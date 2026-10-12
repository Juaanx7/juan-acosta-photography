import { test, expect } from "@playwright/test";

const carousel = page => page.locator(".immersive-cover");
const activeDot = page => carousel(page).locator('[aria-current="true"]');

async function openCover(page) {
  await page.goto("/");
  await expect(carousel(page).locator("img.is-active")).toBeVisible();
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 1:/);
}

test("flechas, cuatro puntos y teclado sin botón de pausa ni contador visible", async ({ page, isMobile }) => {
  await openCover(page);
  const cover = carousel(page);
  await expect(cover.getByRole("button", { name: /Pausar|Reproducir/ })).toHaveCount(0);
  await expect(cover.getByRole("group", { name: "Elegir fotografía" }).getByRole("button")).toHaveCount(4);
  expect(await cover.innerText()).not.toMatch(/\d\s*\/\s*\d/);
  const interact = async locator => isMobile ? locator.tap() : locator.click();
  await interact(cover.getByRole("button", { name: "Fotografía anterior", exact: true }));
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 4:/, { timeout: 8000 });
  await interact(cover.getByRole("button", { name: "Fotografía siguiente", exact: true }));
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 1:/);
  await interact(cover.getByRole("button", { name: /Mostrar fotografía 3:/ }));
  await expect(cover.locator(".immersive-cover__name")).toHaveText("La Cumbrecita");
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 3:/, { timeout: 8000 });
  await cover.getByRole("button", { name: "Fotografía siguiente", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 4:/, { timeout: 8000 });
  await page.keyboard.press("Tab");
  await expect(cover.getByRole("button", { name: /Mostrar fotografía 1:/ })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 1:/);
  const focus = await page.evaluate(() => ({ style: getComputedStyle(document.activeElement).outlineStyle, width: getComputedStyle(document.activeElement).outlineWidth }));
  expect(focus.style).not.toBe("none");
  expect(parseFloat(focus.width)).toBeGreaterThan(0);
  await expect(cover.getByRole("status")).toContainText("1 de 4: Pampa de Achala");
});

test("avance de seis segundos y pausas por puntero, foco y fuera de pantalla", async ({ page }) => {
  test.setTimeout(60000);
  await openCover(page);
  await page.mouse.move(1, 1);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 2:/, { timeout: 8000 });
  await carousel(page).hover();
  await page.waitForTimeout(6500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 2:/, { timeout: 8000 });
  await page.mouse.move(1, 1);
  await carousel(page).getByRole("button", { name: "Fotografía siguiente", exact: true }).focus();
  await page.waitForTimeout(6500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 2:/, { timeout: 8000 });
  await page.locator(".navbar__brand").focus();
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 3:/, { timeout: 8000 });
  await page.locator("#contact-name").focus();
  await expect.poll(() => carousel(page).evaluate(e => e.getBoundingClientRect().bottom)).toBeLessThan(0);
  await page.waitForTimeout(6500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 3:/, { timeout: 8000 });
});

test("movimiento reducido y visibilidad de documento detienen el temporizador", async ({ page }) => {
  test.setTimeout(45000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openCover(page);
  await page.waitForTimeout(6500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 1:/);
  await carousel(page).getByRole("button", { name: /Mostrar fotografía 3:/ }).click();
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 3:/, { timeout: 8000 });
  await page.mouse.move(1, 1);
  await page.locator(".navbar__brand").focus();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Los motores headless mantienen visibles todas las pestañas: se simula la señal de documento.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(6500);
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 3:/, { timeout: 8000 });
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(activeDot(page)).toHaveAttribute("aria-label", /Mostrar fotografía 4:/, { timeout: 8000 });
});

test("fotos completas, flechas fuera, nitidez y controles dentro del viewport", async ({ page, isMobile }) => {
  await openCover(page);
  const sizes = isMobile ? [[360,800],[390,800]] : [[1366,768],[1920,1080],[2560,1440]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({ width, height });
    for (let index=1; index<=4; index++) {
      await carousel(page).getByRole("button", { name: new RegExp(`Mostrar fotografía ${index}:`) }).click();
      await page.waitForFunction(() => document.querySelector(".immersive-cover img.is-active").complete);
      const measured = await page.evaluate(() => {
        const img=document.querySelector(".immersive-cover img.is-active"), box=img.getBoundingClientRect();
        const scale=Math.min(box.width/img.naturalWidth,box.height/img.naturalHeight);
        const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
        const left=box.left+(box.width-w)/2,top=box.top+(box.height-h)/2;
        const prev=document.querySelector('[aria-label="Fotografía anterior"]').getBoundingClientRect();
        const next=document.querySelector('[aria-label="Fotografía siguiente"]').getBoundingClientRect();
        const controls=document.querySelector(".immersive-cover__controls").getBoundingClientRect();
        return {left,top,width:w,height:h,previous:{right:prev.right,top:prev.top,height:prev.height,width:prev.width},next:{left:next.left,top:next.top,height:next.height,width:next.width},controlsBottom:controls.bottom,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,fit:getComputedStyle(img).objectFit,sizes:parseInt(img.sizes),sourceWidth:parseInt(img.currentSrc.match(/-(\d+)\.webp/)[1]),dpr:devicePixelRatio};
      });
      expect(measured.overflow).toBe(false);
      expect(measured.fit).toBe("contain");
      expect(Math.abs(measured.sizes-measured.width)).toBeLessThan(2);
      expect(measured.sourceWidth).toBeGreaterThanOrEqual(measured.width*measured.dpr*0.98);
      if (!isMobile) {
        expect(measured.controlsBottom).toBeLessThanOrEqual(height);
        expect(measured.previous.right).toBeLessThan(measured.left);
        expect(measured.next.left).toBeGreaterThan(measured.left+measured.width);
        expect(Math.abs(measured.previous.top+measured.previous.height/2-measured.top-measured.height/2)).toBeLessThan(1);
      } else {
        expect(measured.previous.top).toBeGreaterThan(measured.top+measured.height);
        expect(measured.previous.width).toBeGreaterThanOrEqual(44);
        expect(measured.previous.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
});
