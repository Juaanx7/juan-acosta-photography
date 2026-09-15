import cproEventMeta from "./generated/cpro-capilla-2026.event-cover.meta.json";
import cproTanda2Photos from "./generated/cpro-capilla-2026.tanda-2.cloudinary.json";
import cproTanda2Meta from "./generated/cpro-capilla-2026.tanda-2.meta.json";
import cproTanda3Photos from "./generated/cpro-capilla-2026.tanda-3.cloudinary.json";
import cproTanda3Meta from "./generated/cpro-capilla-2026.tanda-3.meta.json";
import cproTanda4Photos from "./generated/cpro-capilla-2026.tanda-4.cloudinary.json";
import cproTanda4Meta from "./generated/cpro-capilla-2026.tanda-4.meta.json";
import cproTanda5Photos from "./generated/cpro-capilla-2026.tanda-5.cloudinary.json";
import cproTanda5Meta from "./generated/cpro-capilla-2026.tanda-5.meta.json";
import nacionalEnduroLasPircasMeta from "./generated/nacional-enduro-las-pircas-2026.event-cover.meta.json";
import circuitoMollePhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-molle.cloudinary.json";
import circuitoPeperinaPhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-peperina.cloudinary.json";
import circuitoMolleEbikePhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-molle-ebike.cloudinary.json";
import circuitoPeperinaEbikePhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-peperina-ebike.cloudinary.json";
import circuitoDownhillPhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-downhill.cloudinary.json";
import circuitoPSAnflowPhotos from "./generated/nacional-enduro-las-pircas-2026.circuito-ps-anflow.cloudinary.json";

import circuitoMolleMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-molle.meta.json";
import circuitoPeperinaMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-peperina.meta.json";
import circuitoMolleEbikeMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-molle-ebike.meta.json";
import circuitoPeperinaEbikeMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-peperina-ebike.meta.json";
import circuitoDownhillMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-downhill.meta.json";
import circuitoPSAnflowMeta from "./generated/nacional-enduro-las-pircas-2026.circuito-ps-anflow.meta.json";

import dhPanMeta from "./generated/dh-pan-de-azucar-2026.event-cover.meta.json";

import dhEntrenamientosPhotos from "./generated/dh-pan-de-azucar-2026.entrenamientos.cloudinary.json";
import dhEntrenamientosMeta from "./generated/dh-pan-de-azucar-2026.entrenamientos.meta.json";

import dhClasificacionPhotos from "./generated/dh-pan-de-azucar-2026.clasificacion.cloudinary.json";
import dhClasificacionMeta from "./generated/dh-pan-de-azucar-2026.clasificacion.meta.json";

import dhFinalPhotos from "./generated/dh-pan-de-azucar-2026.final.cloudinary.json";
import dhFinalMeta from "./generated/dh-pan-de-azucar-2026.final.meta.json";

export const events = [
  {
    id: "dh-pan-de-azucar-2026",
    title: "DH Pan de Azúcar",
    date: "Septiembre 2026",
    location: "Cerro Pan de Azúcar, Cosquín, Córdoba",
    coverImage: dhPanMeta.coverImage,
    categories: [
      {
        id: "entrenamientos",
        title: "Entrenamientos",
        description: "Fotos de los entrenamientos.",
        coverImage: dhEntrenamientosMeta.coverImage,
        photos: dhEntrenamientosPhotos,
      },
      {
        id: "clasificacion",
        title: "Clasificación",
        description: "Fotos de la clasificación.",
        coverImage: dhClasificacionMeta.coverImage,
        photos: dhClasificacionPhotos,
      },
      {
        id: "final",
        title: "Final",
        description: "Fotos de la final.",
        coverImage: dhFinalMeta.coverImage,
        photos: dhFinalPhotos,
      },
    ],
  },
  {
    id: "nacional-enduro-las-pircas-2026",
    title: "Campeonato Argentino de Enduro 2026",
    date: "Mayo 2026",
    location: "Las Pircas Bikepark, Córdoba",
    coverImage: nacionalEnduroLasPircasMeta.coverImage,
    categories: [
      {
        id: "circuito-molle",
        title: "Circuito Molle",
        description: "Galería del circuito Molle.",
        coverImage: circuitoMolleMeta.coverImage,
        photos: circuitoMollePhotos
      },
      {
        id: "circuito-peperina",
        title: "Circuito Peperina",
        description: "Galería del circuito Peperina.",
        coverImage: circuitoPeperinaMeta.coverImage,
        photos: circuitoPeperinaPhotos
      },
      {
        id: "circuito-molle-ebike",
        title: "Circuito Molle Ebike",
        description: "Galería del circuito Molle Ebike.",
        coverImage: circuitoMolleEbikeMeta.coverImage,
        photos: circuitoMolleEbikePhotos
      },
      {
        id: "circuito-peperina-ebike",
        title: "Circuito Peperina Ebike",
        description: "Galería del circuito Peperina Ebike.",
        coverImage: circuitoPeperinaEbikeMeta.coverImage,
        photos: circuitoPeperinaEbikePhotos
      },
      {
        id: "circuito-downhill",
        title: "Circuito Downhill",
        description: "Galería del circuito Downhill.",
        coverImage: circuitoDownhillMeta.coverImage,
        photos: circuitoDownhillPhotos
      },
      {
        id: "circuito-ps-anflow",
        title: "Circuito PS Anflow",
        description: "Galería del circuito PS Anflow.",
        coverImage: circuitoPSAnflowMeta.coverImage,
        photos: circuitoPSAnflowPhotos
      }

    ]
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
  }
];