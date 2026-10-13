import { test, expect } from "@playwright/test";

async function activate(locator, isMobile) {
  if (isMobile) await locator.tap(); else await locator.click();
}

test("deportes: Cloudinary, selección persistente, paginación, visor y preparación de pedido", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto("/evento/dh-pan-de-azucar-2026/entrenamientos", { waitUntil: "domcontentloaded" });
  const first = page.locator(".photo-card").first();
  await expect(first).toBeVisible();
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator("img")).toHaveAttribute("src", /res\.cloudinary\.com/);
  await expect.poll(() => first.locator("img").evaluate(el => el.complete && el.naturalWidth > 0), { timeout: 30000 }).toBe(true);
  const id = await first.locator("img").getAttribute("alt");
  await activate(first.locator(".photo-card__select"), isMobile);
  await expect(page.locator(".selection-bar")).toContainText("1 foto seleccionada");
  const selectedLabel = `Quitar ${id}`;
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".photo-card").first().getByRole("button", { name: selectedLabel })).toHaveAttribute("aria-pressed", "true");
  await activate(page.locator(".pagination").getByRole("button", { name: "Siguiente", exact: true }), isMobile);
  await expect(page.locator(".pagination")).toContainText("Página 2 de");
  await expect(page.locator(".selection-bar").getByRole("img", { name: id, exact: true })).toBeVisible();
  const opener = page.locator(".photo-card__image").first();
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  await activate(opener, isMobile);
  await expect(page.locator(".photo-modal")).toBeVisible();
  const oldId = await page.locator(".photo-modal__content p").textContent();
  await activate(page.getByRole("button", { name: "Foto siguiente", exact: true }), isMobile);
  await expect(page.locator(".photo-modal__content p")).not.toHaveText(oldId);
  await page.keyboard.press("Escape");
  await expect(page.locator(".photo-modal")).toHaveCount(0);
  await expect(opener).toBeFocused();
  await activate(page.getByRole("button", { name: "Encargar por WhatsApp", exact: true }), isMobile);
  await expect(page.locator(".confirm-order-modal")).toContainText("Estás por enviar 1 foto");
  // Interceptar la apertura externa en el navegador de prueba; nunca enviar un pedido.
  await page.evaluate(() => { window.open = url => { window.__preparedWhatsApp = url; return null; }; });
  await activate(page.locator(".confirm-order-modal").getByRole("button", { name: "Continuar", exact: true }), isMobile);
  const url = await page.evaluate(() => window.__preparedWhatsApp);
  expect(new URL(url).pathname).toBe("/5493549461840");
  expect(new URL(url).searchParams.get("text")).toContain(id);
  expect(new URL(url).searchParams.get("text")).toContain("Cantidad: 1 foto");
  await expect(page.locator(".confirm-order-modal")).toHaveCount(0);
  await activate(page.getByRole("button", { name: "Limpiar selección", exact: true }), isMobile);
  await expect(page.locator(".selection-bar")).toHaveCount(0);
  await page.goto("/#eventos", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/tienda\/deportes#eventos$/);
});

test("series: orden, visor, contador, Escape y devolución de foco", async ({ page, isMobile }) => {
  for (const [path, count] of [["/portfolio/san-marcos-mi-mirada",6], ["/portfolio/cajones-de-achala",12], ["/portfolio/la-cumbrecita",12]]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const images = page.locator(".series-work__open");
    await expect(images).toHaveCount(count);
    await expect(page.getByText("Ampliar", { exact: true })).toHaveCount(0);
    const opener = images.first();
    await activate(opener, isMobile);
    await expect(page.locator(".series-viewer")).toBeVisible();
    await expect(page.locator(".series-viewer__location")).not.toBeEmpty();
    const location = await page.locator(".series-viewer__location").textContent();
    await expect(page.locator(".series-viewer__controls")).toContainText(`1 / ${count}`);
    await activate(page.getByRole("button", { name: "Obra siguiente", exact: true }), isMobile);
    await expect(page.locator(".series-viewer__controls")).toContainText(`2 / ${count}`);
    await expect(page.locator(".series-viewer__location")).toHaveText(location);
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".series-viewer__controls")).toContainText(`1 / ${count}`);
    await page.keyboard.press("Escape");
    await expect(page.locator(".series-viewer")).toHaveCount(0);
    await expect(opener).toBeFocused();
  }
});

test("contacto existente: confirmación y enlace WhatsApp desde Conversemos", async ({ page, isMobile }) => {
  await page.goto("/#sobre-mi", { waitUntil: "domcontentloaded" });
  await activate(page.getByRole("link", { name: "Conversemos ↗", exact: true }), isMobile);
  await page.getByLabel("Tu nombre", { exact: true }).fill("Prueba local");
  await page.getByRole("combobox", { name: "¿En qué puedo ayudarte?", exact: true }).selectOption({ label: "Otro proyecto" });
  await page.getByLabel("Contame un poco más", { exact: true }).fill("Consulta de revisión. No enviar.");
  const submit = page.getByRole("button", { name: "Continuar por WhatsApp", exact: true });
  await activate(submit, isMobile);
  const dialog = page.getByRole("dialog", { name: "Revisá tu consulta" });
  await expect(dialog).toContainText("Consulta de revisión. No enviar.");
  const href = await dialog.getByRole("link", { name: "Abrir WhatsApp", exact: true }).getAttribute("href");
  expect(new URL(href).pathname).toBe("/5493549461840");
  expect(new URL(href).searchParams.get("text")).toContain("Prueba local");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(submit).toBeFocused();
});
