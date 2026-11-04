import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { WHATSAPP_NUMBER } from "../../src/utils/whatsapp.js";
const catalog = JSON.parse(fs.readFileSync(new URL("../../docs/eventos-y-musica/galeria.json", import.meta.url), "utf8"));
const photos = catalog.photos;
const sources = photos.map(photo => photo.file);
const path = "/portfolio/eventos-y-musica";
const activate = (locator, touch) => touch ? locator.tap() : locator.click();

test("categoría existente, carga diferida, recarga, regreso y contacto confirmado", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  const requests = [];
  page.on("request", request => requests.push(new URL(request.url()).pathname));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Explorar mi trabajo", exact: true })).toBeVisible();
  const steps = isMobile ? 2 : 0;
  for (let i=0; i<steps; i++) {
    await activate(page.getByRole("button", { name: "Categorías siguientes", exact: true }), isMobile);
    await expect(page.locator(".portfolio-category-controls [role=status]")).toContainText(`${i+2} de 3`);
  }
  const access = page.locator(`main a[href="${path}"]`);
  await expect(access).toHaveCount(1);
  await expect(access.locator("h3")).toHaveText("Eventos y música");
  expect(requests.filter(url => url.includes("/images/portfolio/eventos-y-musica/")).every(url => url.includes("DSC09375-"))).toBe(true);
  await activate(access,isMobile);
  await expect(page.getByRole("heading",{name:"Eventos y música.",level:1})).toBeVisible();
  await page.reload();
  await expect(page.locator(".series-work")).toHaveCount(26);
  await activate(page.getByRole("link",{name:"← Volver al portfolio",exact:true}),isMobile);
  await expect(page).toHaveURL(/\/#portfolio$/);
  await page.goto(path);
  await activate(page.getByRole("link",{name:"Consultar por una cobertura",exact:true}),isMobile);
  await expect(page).toHaveURL(/\/#contacto$/);
  await page.getByLabel("Tu nombre",{exact:true}).fill("Revisión de eventos");
  await page.getByRole("combobox",{name:"¿En qué puedo ayudarte?"}).selectOption("Evento o festival");
  await page.getByLabel("Contame un poco más",{exact:true}).fill("Consulta de un encuentro. No enviar.");
  const submit=page.getByRole("button",{name:"Continuar por WhatsApp",exact:true});
  await activate(submit,isMobile);
  const dialog=page.getByRole("dialog",{name:"Revisá tu consulta",exact:true});
  await expect(dialog).toContainText("Evento o festival");
  await expect(dialog).toContainText("Consulta de un encuentro. No enviar.");
  const url=new URL(await dialog.getByRole("link",{name:"Abrir WhatsApp",exact:true}).getAttribute("href"));
  expect(url.pathname).toBe(`/${WHATSAPP_NUMBER}`);
  expect(url.searchParams.get("text")).toContain("Revisión de eventos");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(submit).toBeFocused();
});

test("26 originales en orden, epígrafes definitivos, filas alineadas y resolución", async ({page,isMobile,browser})=>{
  test.setTimeout(180000);
  const sizes=isMobile?[[360,800],[390,800]]:[[768,1024],[1366,768],[1920,1080],[1920,600],[2560,1440]];
  for(const [width,height] of sizes){
    await page.setViewportSize({width,height});await page.goto(path);
    await expect(page.locator(".series-work")).toHaveCount(26);
    expect(await page.locator(".series-work").evaluateAll(items=>items.map(el=>el.dataset.source))).toEqual(sources);
    expect(await page.locator(".series-work figcaption").allTextContents()).toEqual(photos.map(photo=>photo.display_caption));
    expect(await page.locator(".series-work img").evaluateAll(items=>items.map(el=>el.alt))).toEqual(photos.map(photo=>photo.alt));
    expect(await page.locator(".events-music-row").evaluateAll(rows=>rows.map(row=>[...row.querySelectorAll("figure")].map(el=>el.dataset.source)))).toEqual(catalog.desktop_rows);
    await expect(page.locator(".series-work figcaption").filter({hasText:"La Pirámide"})).toHaveCount(4);
    await expect(page.getByText("Ampliar",{exact:true})).toHaveCount(0);
    await expect(page.locator('.events-music-gallery iframe,.events-music-gallery details,h1 br,img[src^="data:"],a[href^="#em-"]')).toHaveCount(0);
    const title=await page.locator("h1").boundingBox(); const copy=await page.locator(".landscape-intro__copy").boundingBox();
    expect(copy.y).toBeGreaterThan(title.y+title.height);expect(copy.width).toBeLessThanOrEqual(660);
    for(const image of await page.locator(".series-work img").all()){
      await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);await image.evaluate(el=>el.decode());
      const m=await image.evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,sw:+el.getAttribute("width"),sh:+el.getAttribute("height"),src:el.currentSrc,dpr:devicePixelRatio,fit:getComputedStyle(el).objectFit}));
      expect(m.w/m.h).toBeCloseTo(m.sw/m.sh,2);expect(m.fit).not.toBe("cover");
      expect(+m.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(Math.min(m.sw,Math.ceil(m.w*m.dpr)-3));
    }
    const container=await page.locator(".series-container").boundingBox();
    for(const row of await page.locator(".events-music-row").all()){
      const rects=await row.locator("img").evaluateAll(items=>items.map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}}));
      expect(Math.abs(rects[0].x-container.x)).toBeLessThan(1);
      expect(Math.abs(rects.at(-1).x+rects.at(-1).w-container.x-container.width)).toBeLessThan(1);
      if(width>600){for(const r of rects){expect(Math.abs(r.y-rects[0].y)).toBeLessThan(1);expect(Math.abs(r.h-rects[0].h)).toBeLessThan(1);}}
      else {for(const r of rects)expect(r.w).toBeCloseTo(container.width,1);}
    }
    if(width<=600){const positions=await page.locator(".series-work").evaluateAll(items=>items.map(el=>el.getBoundingClientRect().y));expect(positions.every((y,i)=>!i||y>positions[i-1])).toBe(true);}
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    await expect(page.locator('.series-work img[loading="eager"]')).toHaveCount(1);
    await expect(page.locator('.series-work img[loading="lazy"]')).toHaveCount(25);
  }
  const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});const normal=await context.newPage();await normal.goto(new URL(path,page.url()).href);
  for(const index of [0,25]){const image=normal.locator(".series-work img").nth(index);await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);const m=await image.evaluate(el=>({w:el.clientWidth,src:el.currentSrc}));expect(+m.src.match(/-(\d+)\.webp/)[1]).toBeGreaterThanOrEqual(m.w);}
  await context.close();
});

test("visor: las veintiséis, teclado, contador, poca altura, Escape, foco y posición", async ({ page, isMobile }) => {
  test.setTimeout(60000);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const opener = page.locator('[data-source="DSC05704.jpg"] button');
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  const scrollBefore = await page.evaluate(() => scrollY);
  if (isMobile) await opener.tap(); else await page.keyboard.press("Enter");
  const dialog = page.locator(".series-viewer");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 26");
  await page.waitForTimeout(6500);
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 26");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator(".series-viewer__controls")).toContainText("5 / 26");
  await page.keyboard.press("ArrowRight");
  for (let offset = 0; offset < 26; offset++) {
    const index = (5 + offset) % 26;
    await expect(dialog.locator("img")).toHaveAttribute("src", new RegExp(sources[index].replace(".jpg", "-")));
    await expect(dialog.locator(".series-viewer__controls")).toContainText(`${index+1} / 26`);
    await expect(dialog.locator(".series-viewer__location")).toHaveText(photos[index].display_caption);
    await activate(dialog.getByRole("button", { name: "Obra siguiente", exact: true }), isMobile);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - scrollBefore)).toBeLessThan(2);
  await page.keyboard.press("Space");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".series-viewer__controls")).toContainText("6 / 26");
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
