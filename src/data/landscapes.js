import images from "./landscapeImages.json";

// El manifiesto generado conserva el orden y los pies del CSV aprobado.
export const landscapePhotos = Object.values(images).map(photo => ({
  ...photo,
  srcSet: photo.variants.map(variant => `${variant.image} ${variant.width}w`).join(", "),
}));

export const landscapeRows = [
  { indices: [0], layout: "wide" },
  { indices: [1, 2], layout: "pair" },
  { indices: [3, 4], layout: "pair" },
  { indices: [5], layout: "wide" },
  { indices: [6, 7], layout: "mixed" },
  { indices: [8, 9], layout: "pair" },
  { indices: [10], layout: "wide" },
  { indices: [11, 12], layout: "pair" },
  { indices: [13, 14], layout: "pair" },
  { indices: [15], layout: "wide" },
  { indices: [16, 17], layout: "pair" },
  { indices: [18, 19], layout: "night" },
];
