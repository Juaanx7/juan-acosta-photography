import test from "node:test";
import assert from "node:assert/strict";
import { cloudinaryImageVariants } from "../src/utils/cloudinaryImages.js";

test("las variantes deportivas mantienen recurso y versión, sin recortar ni ampliar", () => {
  const source = "https://res.cloudinary.com/doxwugcye/image/upload/f_auto,q_auto:good,w_700/v1789428235/events/DSC06680.jpg";
  assert.deepEqual(cloudinaryImageVariants(source, [640, 1440]), {
    srcSet: "https://res.cloudinary.com/doxwugcye/image/upload/f_auto,q_auto:good,c_limit,w_640/v1789428235/events/DSC06680.jpg 640w, https://res.cloudinary.com/doxwugcye/image/upload/f_auto,q_auto:good,c_limit,w_1440/v1789428235/events/DSC06680.jpg 1440w",
  });
});

test("las URLs locales o con otras transformaciones mantienen su entrega original", () => {
  for (const source of [undefined, "/images/gallery/photo-1.webp", "https://res.cloudinary.com/demo/image/upload/c_fill,w_700/example.jpg"]) {
    assert.deepEqual(cloudinaryImageVariants(source, [640, 1440]), {});
  }
});
