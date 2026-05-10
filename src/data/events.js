import rioPintoPhotos from "./generated/rio-pinto-2026.cloudinary.json";
import rioPintoMeta from "./generated/rio-pinto-2026.meta.json";

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
    coverImage: "/images/events/cpro-capilla-2026/cover.webp",
    categories: [
      {
        id: "tanda-2",
        title: "Tanda 2",
        description: "Galería de las categorías Quad, Master A, Quad Promo, Quad Master B, Quad sub-16 y Quad damas.",
        coverImage: "/images/events/cpro-capilla-2026/tanda-2/cover.webp",
        photos: [],
      },
      {
        id: "tanda-3",
        title: "Tanda 3",
        description: "Galería de las categorías Motos, promocional, Master Intermedio, Master D y Master C.",
        coverImage: "/images/events/cpro-capilla-2026/tanda-3/cover.webp",
        photos: [],
      },
      {
        id: "tanda-4",
        title: "Tanda 4",
        description: "Galería de las categorías Quad Senior A y Junior.",
        coverImage: "/images/events/cpro-capilla-2026/tanda-4/cover.webp",
        photos: [],
      },
      {
        id: "tanda-5",
        title: "Tanda 5",
        description: "Galería de las categorías Moto Senior A, Moto Senior B, Junior, Master A y Master B.",
        coverImage: "/images/events/cpro-capilla-2026/tanda-5/cover.webp",
        photos: [],
      }
    ],
  },
];