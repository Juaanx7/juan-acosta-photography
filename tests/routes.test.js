import test from "node:test";
import assert from "node:assert/strict";
import { matchRoutes } from "react-router-dom";
import { routePaths } from "../src/data/routes.js";

const routes = Object.entries(routePaths).map(([id, path]) => ({ id, path }));
const match = (url) => matchRoutes(routes, url)?.at(-1);

test("las URLs deportivas publicadas mantienen sus parámetros", () => {
  const events = {
    "dh-pan-de-azucar-2026": ["entrenamientos", "clasificacion", "final"],
    "nacional-enduro-las-pircas-2026": ["circuito-molle", "circuito-peperina", "circuito-molle-ebike", "circuito-peperina-ebike", "circuito-downhill", "circuito-ps-anflow"],
    "cpro-capilla-2026": ["tanda-2", "tanda-3", "tanda-4", "tanda-5"],
  };
  for (const [eventId, categories] of Object.entries(events)) {
    assert.equal(match(`/evento/${eventId}`).route.id, "event");
    for (const categoryId of categories) {
      const result = match(`/evento/${eventId}/${categoryId}`);
      assert.equal(result.route.id, "categoryGallery");
      assert.deepEqual(result.params, { eventId, categoryId });
    }
  }
});

test("galeria conserva prioridad sobre el parámetro de categoría", () => {
  assert.equal(match("/evento/dh-pan-de-azucar-2026/galeria").route.id, "eventGallery");
});

test("portfolio, tienda y ayuda siguen siendo accesibles directamente", () => {
  assert.equal(match("/").route.id, "portfolio");
  assert.equal(match("/portfolio/san-marcos-mi-mirada").route.id, "sanMarcos");
  assert.equal(match("/portfolio/cajones-de-achala").route.id, "achala");
  assert.equal(match("/tienda/deportes#eventos").route.id, "sportsShop");
  assert.equal(match("/como-comprar").route.id, "howToBuy");
});
