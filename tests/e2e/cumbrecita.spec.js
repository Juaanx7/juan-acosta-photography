import { test, expect } from "@playwright/test";

const path = "/portfolio/la-cumbrecita";
const sources = ["DSC03544.jpg", "DSC03493.jpg", "DSC03489.jpg", "DSC03541.jpg", "DSC03530.jpg", "DSC03523.jpg", "DSC03582.jpg", "DSC03586.jpg", "DSC03557.jpg", "DSC03601.jpg", "DSC03619.jpg", "DSC03622.jpg"];
const activate = (locator, touch) => touch ? locator.tap() : locator.click();

test("accesos desde home y ambas series, regresos y recarga directa", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  for (const origin of ["/", "/portfolio/san-marcos-mi-mirada", "/portfolio/cajones-de-achala"]) {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    const link = page.locator(`main a[href="${path}"]`);
    await expect(link).toHaveCount(1);
    if (origin === "/") {
      await expect(link.locator("img")).toHaveAttribute("src", /DSC03544-/);
      await expect(link).not.toContainText("En preparación");
      await expect(page.getByText("Galería en preparación", { exact: true }).first()).toBeVisible();
    }
    await activate(link, isMobile);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { name: "La Cumbrecita.", exact: true, level: 1 })).toBeVisible();
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "La Cumbrecita.", exact: true })).toBeVisible();
  for (const [label, destination] of [["San Marcos, mi mirada", "/portfolio/san-marcos-mi-mirada"], ["Los Cajones de Achala", "/portfolio/cajones-de-achala"]]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await activate(page.getByRole("region", { name: "Otras series" }).getByRole("link", { name: new RegExp(label) }), isMobile);
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
  }
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await activate(page.getByRole("link", { name: "← Volver al portfolio", exact: true }), isMobile);
  await expect(page).toHaveURL(/\/#portfolio$/);
});

test("doce fotografías completas en orden y distribución responsive aprobada", async ({ page, isMobile }) => {
  test.setTimeout(120000);
  const viewports = isMobile ? [[360,800],[390,800]] : [[768,1024],[1366,768],[1920,1080],[2560,1440]];
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".series-work")).toHaveCount(12);
    expect(await page.locator(".series-work").evaluateAll(elements => elements.map(el => el.dataset.source))).toEqual(sources);
    await expect(page.getByText("Ampliar", { exact: true })).toHaveCount(0);
    await expect(page.locator("h1 em")).toHaveText("Cumbrecita.");
    await expect(page.locator(".cumbrecita-story p")).toHaveCount(2);
    await expect(page.locator(".cumbrecita-story p").first()).toContainText("En mi visita a La Cumbrecita encontré el pueblo cubierto de neblina");
    const text = await page.locator(".cumbrecita-story").boundingBox();
    const title = await page.locator("h1").boundingBox();
    expect(text.y).toBeGreaterThan(title.y + title.height);
    expect(Math.abs(text.x - title.x)).toBeLessThan(1);
    await expect(page.locator(".cumbrecita-night__story p").last()).toContainText("Al caer la noche, las luces cálidas transformaron el paisaje del pueblo");
    expect(await page.locator('[data-source="DSC03586.jpg"]').evaluate(el => !!(el.compareDocumentPosition(document.querySelector(".cumbrecita-night__story")) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    expect(await page.locator(".cumbrecita-night__story").evaluate(el => !!(el.compareDocumentPosition(document.querySelector('[data-source="DSC03557.jpg"]')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    for (const image of await page.locator(".series-work img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
      await image.evaluate(el => el.decode());
      const photo = await image.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { width: rect.width, height: rect.height, sourceWidth: Number(el.getAttribute("width")), sourceHeight: Number(el.getAttribute("height")), currentSrc: el.currentSrc, dpr: devicePixelRatio, objectFit: style.objectFit, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(photo.width / photo.height).toBeCloseTo(photo.sourceWidth / photo.sourceHeight, 2);
      expect(photo.overflow).toBe(false);
      expect(photo.objectFit).not.toBe("cover");
      expect(Number(photo.currentSrc.match(/-(\d+)\.webp/)[1])).toBeGreaterThanOrEqual(Math.min(photo.sourceWidth, Math.ceil(photo.width * photo.dpr) - 2));
    }
    const mixed = page.locator(".cumbrecita-mixed img");
    const vertical = await mixed.first().boundingBox();
    const horizontal = await mixed.last().boundingBox();
    if (width <= 650) {
      expect(vertical.width).toBe(280);
      expect(horizontal.y).toBeGreaterThan(vertical.y + vertical.height);
      expect(horizontal.width).toBeGreaterThan(vertical.width);
    } else {
      expect(horizontal.width).toBeGreaterThan(vertical.width);
      expect(horizontal.x).toBeGreaterThan(vertical.x + vertical.width);
      expect(Math.abs((horizontal.y + horizontal.height/2) - (vertical.y + vertical.height/2))).toBeLessThan(2);
    }
    for (const single of await page.locator(".cumbrecita-single img").all()) {
      const rect = await single.boundingBox();
      expect(Math.abs(rect.x + rect.width / 2 - width / 2)).toBeLessThan(2);
      if (width <= 650) expect(rect.width).toBe(280);
    }
    await expect(page.locator(".series-work img[loading=eager]")).toHaveCount(1);
    await expect(page.locator(".series-work img[loading=lazy]")).toHaveCount(11);
  }
});

test("visor: las doce, teclado, contador, poca altura, Escape, foco y posición", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const opener = page.locator('[data-source="DSC03523.jpg"] button');
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  const scrollBefore = await page.evaluate(() => scrollY);
  if (isMobile) await opener.tap(); else await page.keyboard.press("Enter");
  const dialog = page.locator(".series-viewer");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 12");
  await page.waitForTimeout(6500);
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 12");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator(".series-viewer__controls")).toContainText("5 / 12");
  await page.keyboard.press("ArrowRight");
  for (let offset = 0; offset < 12; offset++) {
    const index = (5 + offset) % 12;
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(sources[index].replace(".jpg", "-")));
    await expect(dialog.locator(".series-viewer__controls")).toContainText(`${index+1} / 12`);
    await activate(dialog.getByRole("button", { name: "Obra siguiente", exact: true }), isMobile);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - scrollBefore)).toBeLessThan(2);
  await page.keyboard.press("Space");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 12");
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

test("consulta identifica la colección y confirma el enlace WhatsApp existente", async ({ page, isMobile }) => {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const button = page.getByRole("button", { name: "Consultar por WhatsApp ↗", exact: true });
  await activate(button, isMobile);
  const dialog = page.getByRole("dialog", { name: "Revisá tu consulta", exact: true });
  await expect(dialog).toContainText("colección «La Cumbrecita»");
  const link = await dialog.getByRole("link", { name: "Abrir WhatsApp ↗", exact: true }).getAttribute("href");
  expect(new URL(link).pathname).toBe("/5493549461840");
  expect(new URL(link).searchParams.get("text")).toContain("La Cumbrecita");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(button).toBeFocused();
});
