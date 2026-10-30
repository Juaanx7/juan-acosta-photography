import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { WHATSAPP_NUMBER } from "../../src/utils/whatsapp.js";
const photos = Object.values(JSON.parse(fs.readFileSync(new URL("../../src/data/mountainSportsImages.json", import.meta.url), "utf8")));
const sources = photos.map(photo => photo.source);
const path = "/portfolio/deportes-en-montana";
const activate = (locator, touch) => touch ? locator.tap() : locator.click();

test("home, recarga directa, regreso, contacto real confirmado y tienda", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto("/");
  // El home aprobado muestra una categoría por vez en celular; Deportes es la tercera.
  if (isMobile) {
    await activate(page.getByRole("button", { name: "Categorías siguientes", exact: true }), true);
    await expect(page.locator(".portfolio-category h3")).toHaveText("San Marcos, mi mirada");
    await activate(page.getByRole("button", { name: "Categorías siguientes", exact: true }), true);
    await expect(page.locator(".portfolio-category h3")).toHaveText("Deportes en montaña");
  }
  const access = page.locator(`main a[href="${path}"]`);
  await expect(access).toHaveCount(1);
  await expect(access).not.toContainText("preparación");
  await activate(access, isMobile);
  await expect(page.getByRole("heading", { name: "Deportes en montaña.", level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.locator(".series-work")).toHaveCount(20);
  await activate(page.getByRole("link", { name: "← Volver al portfolio", exact: true }), isMobile);
  await expect(page).toHaveURL(/\/#portfolio$/);
  await page.goto(path);
  await activate(page.locator(".mountain-shop").getByRole("link", { name: "Ver fotos de carreras", exact: true }), isMobile);
  await expect(page).toHaveURL(/\/tienda\/deportes$/);
  await expect(page.getByRole("heading", { name: "Fotografía de deporte y aventura", exact: true })).toBeVisible();
  await page.goto(path);
  await activate(page.getByRole("link", { name: "Consultar por una cobertura", exact: true }), isMobile);
  await expect(page).toHaveURL(/\/#contacto$/);
  await page.getByLabel("Tu nombre", { exact: true }).fill("Revisión deportiva");
  await page.getByRole("combobox", { name: "¿En qué puedo ayudarte?" }).selectOption("Cobertura deportiva");
  await page.getByLabel("Contame un poco más", { exact: true }).fill("Consulta de cobertura. No enviar.");
  const submit = page.getByRole("button", { name: "Continuar por WhatsApp", exact: true });
  await activate(submit, isMobile);
  const dialog = page.getByRole("dialog", { name: "Revisá tu consulta", exact: true });
  await expect(dialog).toContainText("Cobertura deportiva");
  await expect(dialog).toContainText("Consulta de cobertura. No enviar.");
  const url = new URL(await dialog.getByRole("link", { name: "Abrir WhatsApp", exact: true }).getAttribute("href"));
  expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
  expect(url.searchParams.get("text")).toContain("Revisión deportiva");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(submit).toBeFocused();
});

test("veinte fotos completas, carreras, once filas y resolución responsive", async ({ page, isMobile, browser }) => {
  test.setTimeout(180000);
  const sizes = isMobile ? [[360,800],[390,800]] : [[768,1024],[1366,768],[1920,1080],[1920,600],[2560,1440]];
  const expectedRows = [[0],[1,2],[3,4],[5,6],[7],[8,9],[10,11],[12,13],[14,15],[16,17],[18,19]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({ width,height });
    await page.goto(path);
    await expect(page.locator(".series-work")).toHaveCount(20);
    expect(await page.locator(".series-work").evaluateAll(items => items.map(el => el.dataset.source))).toEqual(sources);
    expect(await page.locator(".series-work figcaption").allTextContents()).toEqual(photos.map(photo => photo.race));
    expect(await page.locator(".landscape-row").evaluateAll(rows => rows.map(row => [...row.querySelectorAll("figure")].map(el => el.dataset.source)))).toEqual(expectedRows.map(row => row.map(i => sources[i])));
    await expect(page.getByText("Ampliar", { exact: true })).toHaveCount(0);
    await expect(page.locator(".mountain-sports-gallery iframe, .mountain-sports-gallery details, h1 br")).toHaveCount(0);
    const title = await page.locator("h1").boundingBox(); const copy = await page.locator(".landscape-intro__copy").boundingBox();
    expect(copy.y).toBeGreaterThan(title.y+title.height); expect(copy.width).toBeLessThanOrEqual(650);
    for (const image of await page.locator(".series-work img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      await image.evaluate(el => el.decode());
      const m = await image.evaluate(el => ({ w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,sw:+el.getAttribute("width"),sh:+el.getAttribute("height"),src:el.currentSrc,dpr:devicePixelRatio,fit:getComputedStyle(el).objectFit }));
      expect(m.w/m.h).toBeCloseTo(m.sw/m.sh,2); expect(m.fit).not.toBe("cover");
      expect(+m.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(Math.min(m.sw,Math.ceil(m.w*m.dpr)-3));
    }
    const container = await page.locator(".series-container").boundingBox();
    for (const row of await page.locator(".mountain-row--portraits").all()) {
      const box = await row.boundingBox(); expect(box.width/container.width).toBeCloseTo(width<=600?1:.78,2);
    }
    const mixed = page.locator(".mountain-row--mixed img"); const left = await mixed.first().boundingBox(); const right = await mixed.last().boundingBox();
    if (width<=600) {
      expect(left.width).toBeCloseTo(container.width,1); expect(right.width).toBeCloseTo(container.width,1);
      expect(right.y).toBeGreaterThan(left.y+left.height);
      const positions = await page.locator(".series-work").evaluateAll(items => items.map(el=>el.getBoundingClientRect().y));
      expect(positions.every((y,i)=>!i||y>positions[i-1])).toBe(true);
    } else {
      expect(left.width/right.width).toBeCloseTo(1.75,2);
      expect(Math.abs(left.y+left.height/2-right.y-right.height/2)).toBeLessThan(2);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    await expect(page.locator('.series-work img[loading="eager"]')).toHaveCount(1);
    await expect(page.locator('.series-work img[loading="lazy"]')).toHaveCount(19);
  }
  const context = await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const normal = await context.newPage(); await normal.goto(new URL(path,page.url()).href);
  const opening=normal.locator(".series-work img").first();
  await expect.poll(()=>opening.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  const m=await opening.evaluate(el=>({w:el.clientWidth,src:el.currentSrc}));
  expect(+m.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(m.w);
  await context.close();
});

test("visor: las veinte, teclado, contador, poca altura, Escape, foco y posición", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const opener = page.locator('[data-source="DSC06683.jpg"] button');
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
    await expect(dialog.locator(".series-viewer__location")).toHaveText(photos[index].race);
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
