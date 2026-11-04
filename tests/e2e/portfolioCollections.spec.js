import { test, expect } from "@playwright/test";

const titles = ["Paisajes y viajes", "Deportes en montaña", "Eventos y música"];

test("tres categorías, portadas completas, enlaces y San Marcos independiente", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#portfolio");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator("h3")).toHaveText(titles);
  await expect(section.locator(".portfolio-category-controls")).toHaveCount(0);
  await expect(section.locator("a").first()).toHaveAttribute("href", "/portfolio/paisajes-y-viajes");
  await expect(section.locator("article").nth(1)).toContainText("Galería en preparación");
  await expect(section.locator("article").nth(1).locator("a")).toHaveCount(0);
  const photos = section.locator("img");
  await expect(photos).toHaveCount(3);
  for (const photo of await photos.all()) {
    await expect(photo).toHaveJSProperty("complete", true);
    expect(await photo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await expect(photo).toHaveCSS("object-fit", "contain");
    await expect(photo).toHaveAttribute("alt", /\S+/);
  }
  await expect(photos.nth(2)).toHaveAttribute("src", /DSC09375-1440.webp$/);
  await expect(photos.nth(2)).toHaveAttribute("srcset", /DSC09375-640.webp 640w/);
  await section.locator("a").last().click();
  await expect(page).toHaveURL(/\/portfolio\/eventos-y-musica$/);
  await expect(page.locator(".series-work").first()).toHaveAttribute("data-source", "DSC09375.jpg");
  await page.goto("/");
  const stories = page.getByRole("region", { name: "Historias en imágenes" });
  await expect(stories.locator("h3")).toHaveText(["Los Cajones de Achala", "La Cumbrecita", "San Marcos, mi mirada"]);
  await stories.getByRole("link", { name: /San Marcos, mi mirada/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/san-marcos-mi-mirada$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("San Marcos");
});

test("límites, contador y cambios de ancho sin huecos ni desbordamiento", async ({ page }, testInfo) => {
  await page.goto("/");
  const section = page.locator("#portfolio");
  const next = section.getByRole("button", { name: "Categorías siguientes" });
  const previous = section.getByRole("button", { name: "Categorías anteriores" });
  for (const width of [320, 390, 580, 581, 768, 1024, 1366, 1920, 2560, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await section.scrollIntoViewIfNeeded();
    if (width <= 580) {
      while (await previous.isEnabled()) await previous.click();
      for (let index = 0; index < titles.length; index++) {
        await expect(section.locator("h3")).toHaveText([titles[index]]);
        await expect(section.getByRole("status")).toHaveText(`${index + 1} de 3`);
        await expect(previous).toBeEnabled({ enabled: index > 0 });
        await expect(next).toBeEnabled({ enabled: index < 2 });
        if (index < 2) await next.click();
      }
    } else {
      await expect(section.locator("h3")).toHaveText(titles);
      await expect(section.locator(".portfolio-category-controls")).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const boxes = await section.locator("article").evaluateAll(cards => cards.map(card => {
      const box = card.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top };
    }));
    expect(boxes.every(box => box.left >= 0 && box.right <= width)).toBe(true);
    expect(new Set(boxes.map(box => box.top)).size).toBe(1);
    if ([390, 768, 1366].includes(width)) {
      await section.screenshot({ path: testInfo.outputPath(`portfolio-${width}.png`) });
    }
  }
});
