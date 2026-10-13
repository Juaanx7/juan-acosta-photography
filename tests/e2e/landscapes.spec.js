import { test, expect } from "@playwright/test";
import fs from "node:fs";
const photos = Object.values(JSON.parse(fs.readFileSync(new URL("../../src/data/landscapeImages.json", import.meta.url), "utf8")));
const sources = photos.map(photo => photo.source);
const path = "/portfolio/paisajes-y-viajes";
const activate = (locator, touch) => touch ? locator.tap() : locator.click();

test("home, recarga directa, tres series reales y regreso al portfolio", async ({ page, isMobile }) => {
  await page.goto("/");
  const link = page.locator(`main a[href="${path}"]`);
  await expect(link).toHaveCount(1);
  await expect(link).not.toContainText("preparación");
  await activate(link, isMobile);
  await expect(page.getByRole("heading", { name: "Paisajes y viajes.", level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.locator(".series-work")).toHaveCount(20);
  const destinations = ["/portfolio/cajones-de-achala", "/portfolio/la-cumbrecita", "/portfolio/san-marcos-mi-mirada"];
  for (const destination of destinations) {
    await page.goto(path);
    const access = page.locator(`.landscape-more a[href="${destination}"]`);
    await activate(access, isMobile);
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.goto(path);
  await activate(page.getByRole("link", { name: "← Volver al portfolio", exact: true }), isMobile);
  await expect(page).toHaveURL(/\/#portfolio$/);
});

test("orden, ubicaciones, fotos completas, filas y resolución responsive", async ({ page, isMobile, browser }) => {
  test.setTimeout(180000);
  const sizes = isMobile ? [[360,800],[390,800]] : [[768,1024],[1366,768],[1920,1080],[1920,600],[2560,1440]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto(path);
    await expect(page.locator(".series-work")).toHaveCount(20);
    expect(await page.locator(".series-work").evaluateAll(items => items.map(el => el.dataset.source))).toEqual(sources);
    expect(await page.locator(".series-work figcaption").allTextContents()).toEqual(photos.map(photo => photo.location));
    await expect(page.getByText("Ampliar", { exact: true })).toHaveCount(0);
    await expect(page.locator(".landscape-gallery iframe, .landscape-gallery details, h1 br")).toHaveCount(0);
    const title = await page.locator("h1").boundingBox();
    const copy = await page.locator(".landscape-intro__copy").boundingBox();
    expect(copy.y).toBeGreaterThan(title.y + title.height);
    expect(copy.width).toBeLessThanOrEqual(660);
    for (const image of await page.locator(".series-work img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      await image.evaluate(el => el.decode());
      const rect = await image.evaluate(el => ({ w: el.clientWidth, h: el.clientHeight, sw: +el.getAttribute("width"), sh: +el.getAttribute("height"), src: el.currentSrc, dpr: devicePixelRatio, fit: getComputedStyle(el).objectFit }));
      expect(rect.w / rect.h).toBeCloseTo(rect.sw / rect.sh, 1);
      expect(rect.fit).not.toBe("cover");
      expect(+rect.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(Math.min(rect.sw, Math.ceil(rect.w * rect.dpr) - 3));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const gallery = await page.locator(".series-container").boundingBox();
    const night = await page.locator(".landscape-row--night").boundingBox();
    const mixed = page.locator(".landscape-row--mixed img");
    const left = await mixed.first().boundingBox(); const right = await mixed.last().boundingBox();
    if (width <= 600) {
      expect(night.width).toBeCloseTo(gallery.width, 1);
      expect(left.width).toBeCloseTo(gallery.width, 1);
      expect(right.y).toBeGreaterThan(left.y + left.height);
      const boxes = await page.locator(".series-work").evaluateAll(items => items.map(el => el.getBoundingClientRect().y));
      expect(boxes.every((y, i) => !i || y > boxes[i-1])).toBe(true);
    } else {
      expect(night.width / gallery.width).toBeCloseTo(.76, 2);
      expect(right.width / left.width).toBeCloseTo(1.8, 2);
      expect(Math.abs(left.y + left.height/2 - right.y - right.height/2)).toBeLessThan(2);
    }
    await expect(page.locator('.series-work img[loading="eager"]')).toHaveCount(1);
    await expect(page.locator('.series-work img[loading="lazy"]')).toHaveCount(19);
  }
  // A fresh context checks DPR 1 separately from the high-density projects.
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const normal = await context.newPage();
  await normal.goto("http://127.0.0.1:5175" + path);
  const opening = normal.locator(".series-work img").first();
  await expect.poll(() => opening.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  const info = await opening.evaluate(el => ({ width: el.clientWidth, src: el.currentSrc }));
  expect(+info.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(info.width);
  await context.close();
});

test("visor: las veinte, teclado, contador, poca altura, Escape, foco y posición", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const opener = page.locator('[data-source="DSC06392.jpg"] button');
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  const scrollBefore = await page.evaluate(() => scrollY);
  if (isMobile) await opener.tap(); else await page.keyboard.press("Enter");
  const dialog = page.locator(".series-viewer");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 20");
  await page.waitForTimeout(6500);
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 20");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator(".series-viewer__controls")).toContainText("5 / 20");
  await page.keyboard.press("ArrowRight");
  for (let offset = 0; offset < 20; offset++) {
    const index = (5 + offset) % 20;
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(sources[index].replace(".jpg", "-")));
    await expect(dialog.locator(".series-viewer__controls")).toContainText(`${index+1} / 20`);
    await expect(dialog.locator(".series-viewer__location")).toHaveText(photos[index].location);
    await activate(dialog.getByRole("button", { name: "Obra siguiente", exact: true }), isMobile);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - scrollBefore)).toBeLessThan(2);
  await page.keyboard.press("Space");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 20");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.setViewportSize({ width: 844, height: 390 });
  await activate(page.locator(".series-work__open").first(), isMobile);
  const short = page.locator(".series-viewer");
  for (const locator of [short.getByRole("button", { name: "Cerrar ×", exact: true }), short.locator(".series-viewer__controls"), short.locator(".series-viewer__location")]) {
    const rect = await locator.boundingBox();
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.y + rect.height).toBeLessThanOrEqual(390);
  }
  expect(await short.locator("img").evaluate(el => getComputedStyle(el).objectFit)).toBe("contain");
  await short.getByRole("button", { name: "Cerrar ×", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(short.getByRole("button", { name: "Obra anterior", exact: true })).toBeFocused();
  expect(await short.getByRole("button", { name: "Obra anterior", exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(short.getByRole("button", { name: "Obra siguiente", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
});
