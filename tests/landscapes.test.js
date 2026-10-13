import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const rows = fs.readFileSync(new URL("docs/paisajes-y-viajes/FOTOS.csv", root), "utf8").trim().split(/\r?\n/).slice(1).map(line => line.split(","));
const photos = Object.values(JSON.parse(fs.readFileSync(new URL("src/data/landscapeImages.json", root), "utf8")));

test("Paisajes conserva las veinte fuentes, ubicaciones y textos del catálogo aprobado", () => {
  assert.equal(rows.length, 20);
  assert.equal(photos.length, 20);
  for (const [index, photo] of photos.entries()) {
    const [order, file, location, alt] = rows[index];
    assert.equal(+order, index + 1);
    assert.equal(photo.source, file);
    assert.equal(photo.location, location);
    assert.equal(photo.alt, alt);
    assert.equal(photo.sourceHash.length, 64);
    for (const variant of photo.variants) {
      assert.ok(variant.width <= photo.width && variant.height <= photo.height);
      assert.ok(Math.abs(variant.width / variant.height - photo.width / photo.height) < .004);
      assert.ok(fs.existsSync(new URL(`public${variant.image}`, root)));
    }
  }
});
