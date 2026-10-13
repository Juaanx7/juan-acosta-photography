import { test, expect } from "@playwright/test";

const menu = page => page.locator(".navbar__toggle");
const nav = page => page.getByRole("navigation", { name: "Navegación principal" });
async function openMenu(page, isMobile) {
  if (isMobile) await menu(page).tap();
}

async function expectBiographyStart(page) {
  await expect(page).toHaveURL(/\/#sobre-mi$/);
  await expect(page.locator("#sobre-mi")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Una forma de mirar.", level: 2 })).toBeVisible();
  // Al final del documento, el navegador limita el scroll a su máximo disponible.
  await expect.poll(() => page.locator("#sobre-mi").evaluate(el => {
    const top = el.getBoundingClientRect().top;
    const expected = Math.max(0, innerHeight - (document.documentElement.scrollHeight - (top + scrollY)));
    return Math.abs(top - expected);
  })).toBeLessThan(3);
}

test("biografía: enlaces desde todas las páginas, anclas repetidas y recarga directa", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  const origins = ["/", "/portfolio/paisajes-y-viajes", "/portfolio/san-marcos-mi-mirada", "/portfolio/cajones-de-achala", "/portfolio/la-cumbrecita", "/tienda/deportes", "/evento/dh-pan-de-azucar-2026", "/evento/dh-pan-de-azucar-2026/entrenamientos", "/como-comprar"];
  for (const origin of origins) {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main h1")).toBeVisible();
    await openMenu(page, isMobile);
    const link = nav(page).getByRole("link", { name: "Sobre mí", exact: true });
    if (isMobile) await link.tap(); else await link.click();
    await expectBiographyStart(page);
    if (isMobile) await expect(menu(page)).toHaveAttribute("aria-expanded", "false");
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectBiographyStart(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await openMenu(page, isMobile);
  await nav(page).getByRole("link", { name: "Sobre mí", exact: true }).click();
  await expectBiographyStart(page);
  await page.getByRole("link", { name: "Conversemos ↗", exact: true }).click();
  await expect(page).toHaveURL(/\/#contacto$/);
  await expect(page.locator("#contact-name")).toBeVisible();
  expect(await page.locator("#sobre-mi").evaluate(el => el.compareDocumentPosition(document.querySelector("#contacto")) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  expect(await page.locator("#portfolio").evaluate(el => el.compareDocumentPosition(document.querySelector("#sobre-mi")) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
});

test("hamburguesa: toque, teclado, foco, acordeón, anclas y cambios de orientación", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Estados de la navegación móvil.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const toggle = menu(page);
  await expect(toggle).toHaveAttribute("aria-controls", "site-navigation");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav(page)).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement.closest("#site-navigation"))).toBe(false);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(nav(page)).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav(page).getByRole("link", { name: "Portfolio", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.tap();
  const shop = page.locator(".navbar__shop");
  await shop.locator("summary").tap();
  await expect(shop).toHaveAttribute("open", "");
  expect(await shop.locator("div").evaluate(el => getComputedStyle(el).position)).toBe("static");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(nav(page)).toBeHidden();
  await toggle.tap();
  await expect(shop).not.toHaveAttribute("open");
  await page.touchscreen.tap(2, 10);
  await expect(nav(page)).toBeHidden();
  await toggle.tap();
  await toggle.tap();
  await expect(nav(page)).toBeHidden();
  await toggle.tap();
  await page.getByRole("button", { name: "Fotografía siguiente", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(nav(page)).toBeHidden();
  await expect(toggle).toBeFocused();
  for (const [label, hash] of [["Portfolio", "portfolio"], ["Contacto", "contacto"]]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await toggle.tap();
    await nav(page).getByRole("link", { name: label, exact: true }).tap();
    await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    await expect(nav(page)).toBeHidden();
    await expect.poll(() => page.locator(`#${hash}`).evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await toggle.tap();
  await shop.locator("summary").tap();
  await toggle.focus();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator(".navbar__brand")).toBeFocused();
  await expect(toggle).toBeHidden();
  await expect(nav(page)).toBeVisible();
  await expect(shop).not.toHaveAttribute("open");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await nav(page).getByRole("link", { name: "Portfolio", exact: true }).focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toBeFocused();
  await expect(toggle).toBeVisible();
  await expect(nav(page)).toBeHidden();
});

test("disposición: retrato completo, lectura, semántica y resolución responsive", async ({ page, isMobile }) => {
  const sizes = isMobile ? [[360,800],[390,800],[430,800]] : [[768,1024],[1366,768],[1920,1080],[2560,1440]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({ width,height });
    await page.goto("/#sobre-mi", { waitUntil: "domcontentloaded" });
    await expectBiographyStart(page);
    const image = page.locator(".about-me__portrait img");
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
    const metrics = await image.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const text = document.querySelector(".about-me__text").getBoundingClientRect();
      return { width: rect.width, height: rect.height, top: rect.top, right: rect.right, textTop: text.top, textLeft: text.left, filename: el.currentSrc, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(metrics.overflow).toBe(false);
    expect(metrics.width / metrics.height).toBeCloseTo(2250/4000, 2);
    expect(Number(metrics.filename.match(/-(\d+)\.webp/)[1])).toBeGreaterThanOrEqual(Math.ceil(metrics.width * metrics.dpr));
    if (width <= 650) { expect(metrics.width).toBe(265); expect(metrics.textTop).toBeGreaterThan(metrics.top + metrics.height); }
    else { expect(metrics.width).toBeLessThanOrEqual(340); expect(metrics.textLeft).toBeGreaterThan(metrics.right); }
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".about-me__story p")).toHaveCount(3);
    await expect(page.locator("#about-me-heading em")).toHaveText("mirar.");
    await expect(page.getByRole("button", { name: /Pausar|Reproducir/ })).toHaveCount(0);
    await expect(page.getByText("Ampliar", { exact: true })).toHaveCount(0);
  }
});



test("historial: Atrás y Adelante no reabren un menú anterior", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Estado del menú móvil tras navegación de historial.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const label of ["Portfolio", "Contacto"]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await menu(page).tap();
    await nav(page).getByRole("link", { name: label, exact: true }).tap();
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await menu(page).tap();
  await page.locator(".navbar__shop summary").tap();
  await page.goBack();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(menu(page)).toHaveAttribute("aria-expanded", "false");
  await page.goForward();
  await expect(page).toHaveURL(/#contacto$/);
  await expect(menu(page)).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".navbar__shop")).not.toHaveAttribute("open");
});
