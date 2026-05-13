import rioPintoPhotos from "./generated/rio-pinto-2026.cloudinary.json";
import rioPintoMeta from "./generated/rio-pinto-2026.meta.json";
import cproEventMeta from "./generated/cpro-capilla-2026.event-cover.meta.json";
import cproTanda2Photos from "./generated/cpro-capilla-2026.tanda-2.cloudinary.json";
import cproTanda2Meta from "./generated/cpro-capilla-2026.tanda-2.meta.json";
import cproTanda3Photos from "./generated/cpro-capilla-2026.tanda-3.cloudinary.json";
import cproTanda3Meta from "./generated/cpro-capilla-2026.tanda-3.meta.json";
import cproTanda4Photos from "./generated/cpro-capilla-2026.tanda-4.cloudinary.json";
import cproTanda4Meta from "./generated/cpro-capilla-2026.tanda-4.meta.json";
import cproTanda5Photos from "./generated/cpro-capilla-2026.tanda-5.cloudinary.json";
import cproTanda5Meta from "./generated/cpro-capilla-2026.tanda-5.meta.json";

export const events = [
  {
    id: "rio-pinto-2026",
    title: "Río Pinto 2026",
    date: "Mayo 2026",
    location: "La Cumbre, Córdoba",
    coverImage: rioPintoMeta.coverImage,
    photos: rioPintoPhotos,
  },
  {
    id: "cpro-capilla-2026",
    title: "CPRO Enduro - Capilla del Monte",
    date: "Mayo 2026",
    location: "Capilla del Monte, Córdoba",
    coverImage: cproEventMeta.coverImage,
    categories: [
      {
        id: "tanda-2",
        title: "Tanda 2",
        description: "Galería de las categorías Quad, Master A, Quad Promo, Quad Master B, Quad sub-16 y Quad damas.",
        coverImage: cproTanda2Meta.coverImage,
        photos: cproTanda2Photos,
      },
      {
        id: "tanda-3",
        title: "Tanda 3",
        description: "Galería de las categorías Motos, promocional, Master Intermedio, Master D y Master C.",
        coverImage: cproTanda3Meta.coverImage,
        photos: cproTanda3Photos,
      },
      {
        id: "tanda-4",
        title: "Tanda 4",
        description: "Galería de las categorías Quad Senior A y Junior.",
        coverImage: cproTanda4Meta.coverImage,
        photos: cproTanda4Photos,
      },
      {
        id: "tanda-5",
        title: "Tanda 5",
        description: "Galería de las categorías Moto Senior A, Moto Senior B, Junior, Master A y Master B.",
        coverImage: cproTanda5Meta.coverImage,
        photos: cproTanda5Photos,
      }
    ],
  },
];