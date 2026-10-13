import { test, expect } from "@playwright/test";

const origins = [
  ["inicio", "/"],
  ["Paisajes y viajes", "/portfolio/paisajes-y-viajes"],
  ["San Marcos", "/portfolio/san-marcos-mi-mirada"],
  ["Achala", "/portfolio/cajones-de-achala"],
  ["La Cumbrecita", "/portfolio/la-cumbrecita"],
  ["tienda", "/tienda/deportes"],
  ["evento", "/evento/dh-pan-de-azucar-2026"],
  ["galería", "/evento/dh-pan-de-azucar-2026/entrenamientos"],
  ["ayuda", "/como-comprar"],
];
const destinations = [
  ["Fotos de carreras ↗", "/tienda/deportes", "Fotografía de deporte y aventura"],
  ["Cómo comprar", "/como-comprar", "Cómo comprar tus fotos"],
];

for (const [label, origin] of origins) {
  test(`un toque activa cada enlace desde ${label}`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "La regresión debe ejercitar eventos táctiles.");
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const shop = page.locator(".navbar__shop");
    const summary = shop.locator("summary");
    for (const [name, destination, heading] of destinations) {
      await page.goto(origin, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toBeVisible();
      await page.getByRole("button", { name: "Abrir menú", exact: true }).tap();
      await summary.tap();
      await expect(shop).toHaveAttribute("open", "");
      // tap envía touchstart/touchend y la secuencia nativa de foco/clic; no es un clic con viewport reducido.
      await shop.getByRole("link", { name, exact: true }).tap();
      await expect(page).toHaveURL(new RegExp(`${destination}$`));
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
      await expect(shop).not.toHaveAttribute("open");
      // También debe cerrarse al activar la opción de la página actual, sin cambio de ruta.
      await page.getByRole("button", { name: "Abrir menú", exact: true }).tap();
      await summary.tap();
      await shop.getByRole("link", { name, exact: true }).tap();
      await expect(shop).not.toHaveAttribute("open");
    }
    expect(errors).toEqual([]);
  });
}

test("toques en Tienda, fuera del menú y en la opción pendiente", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Comprobación táctil.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const shop = page.locator(".navbar__shop");
  const summary = shop.locator("summary");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).tap();
  await summary.tap();
  await expect(shop).toHaveAttribute("open", "");
  await summary.tap();
  await expect(shop).not.toHaveAttribute("open");
  await summary.tap();
  await expect(shop.getByRole("link")).toHaveCount(2);
  const pending = shop.locator('[aria-disabled="true"]');
  await expect(pending).toContainText("En preparación");
  await expect(pending).not.toHaveAttribute("href");
  await expect(pending).not.toHaveAttribute("tabindex");
  await pending.tap();
  await expect(page).toHaveURL(/\/$/);
  await expect(shop).toHaveAttribute("open", "");
  // Margen vacío del header, fuera del submenú y de cualquier enlace.
  await page.touchscreen.tap(2, 10);
  await expect(shop).not.toHaveAttribute("open");
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("escritorio: mouse y navegación de ambos enlaces", async ({ page, isMobile }) => {
  test.skip(isMobile, "Comprobación con mouse.");
  const shop = page.locator(".navbar__shop");
  for (const [name, destination] of destinations) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await shop.locator("summary").click();
    await shop.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(shop).not.toHaveAttribute("open");
  }
});

test("teclado: Tab, Escape y activación con Enter", async ({ page, isMobile }) => {
  test.skip(isMobile, "Comprobación de teclado de escritorio.");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const shop = page.locator(".navbar__shop");
  const summary = shop.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(shop).toHaveAttribute("open", "");
  await page.keyboard.press("Tab");
  await expect(shop.getByRole("link", { name: "Fotos de carreras ↗", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(shop.getByRole("link", { name: "Cómo comprar", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  await expect(shop).not.toHaveAttribute("open");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Shift+Tab");
  await expect(shop).not.toHaveAttribute("open");
  await summary.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/como-comprar$/);
  await expect(shop).not.toHaveAttribute("open");
  await summary.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(shop).not.toHaveAttribute("open");
});
