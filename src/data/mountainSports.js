import images from "./mountainSportsImages.json";

export const mountainSportsPhotos = Object.values(images).map(photo => ({
  ...photo,
  location: photo.race, // El visor compartido muestra aquí el nombre de la carrera.
  srcSet: photo.variants.map(variant => `${variant.image} ${variant.width}w`).join(", "),
}));

export const mountainSportsRows = [
  { indices: [0], layout: "wide" },
  { indices: [1, 2], layout: "pair" },
  { indices: [3, 4], layout: "portraits" },
  { indices: [5, 6], layout: "pair" },
  { indices: [7], layout: "wide" },
  { indices: [8, 9], layout: "portraits" },
  { indices: [10, 11], layout: "portraits" },
  { indices: [12, 13], layout: "pair" },
  { indices: [14, 15], layout: "pair" },
  { indices: [16, 17], layout: "portraits" },
  { indices: [18, 19], layout: "mixed" },
];
