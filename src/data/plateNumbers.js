import { normalizePlates } from "../utils/plateMetadata";

const files = import.meta.glob("./plates/*.plates.json", {
  eager: true,
  import: "default",
});

// Diccionarios sin propiedades heredadas: un ID desconocido siempre queda vacío.
export const plateNumbers = Object.create(null);

for (const [path, metadata] of Object.entries(files)) {
  const match = /^\.\/plates\/([a-z0-9]+(?:-[a-z0-9]+)*)\.plates\.json$/.exec(path);
  if (!match) continue;

  const photos = Object.create(null);
  plateNumbers[match[1]] = photos;

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;

  for (const [photoId, entry] of Object.entries(metadata)) {
    // reviewed y suggestions no participan de la búsqueda pública.
    photos[photoId] = normalizePlates(entry?.plates);
  }
}
