import images from "./sanMarcosImages.json";

const photo = (name, title, alt) => ({
  ...images[name], title, alt,
  srcSet: images[name].variants.map((variant) => `${variant.image} ${variant.width}w`).join(", "),
});

export const sanMarcos = {
  title: "San Marcos, mi mirada",
  location: "San Marcos Sierras",
  introduction: "Una mirada personal sobre los paisajes y rincones de San Marcos Sierras.",
  works: [
    photo("DSC03637", "Pueblo serrano", "San Marcos Sierras entre los árboles, bajo un cielo de atardecer"),
    photo("DSC05590", "Camino al atardecer", "El sol entre las ramas ilumina el paisaje y un camino en la ladera"),
    photo("DSC08228-Editar", "Calles de infancia", "Una calle de tierra y una figura en bicicleta entre la luz y la sombra de los árboles"),
    photo("DSC08263", "Última luz", "La silueta de un caminante cruza una pasarela frente al cielo del atardecer"),
    photo("DSC03503 (2)", "Reflejos", "Tres siluetas cruzan una pasarela y se reflejan en el agua bajo un cielo dorado"),
    photo("DSC00869", "El cielo del pueblo", "El cielo estrellado sobre la pasarela y los árboles iluminados del pueblo"),
  ],
  exhibition: {
    date: "San Marcos Sierras · Septiembre de 2026",
    paragraphs: [
      "Ver mis fotografías en papel me permitió apreciarlas con una mirada distinta. Esta muestra fue una oportunidad para compartir mi manera de ver San Marcos, conversar con quienes se acercaron y contar cómo fueron tomadas las imágenes.",
      "También pude presentarme como fotógrafo y escuchar lo que mis fotos despertaban en otras personas. Me llevo esas charlas, las palabras de cariño y la alegría de haber compartido algo tan personal. Fue una experiencia única, por la que estoy muy agradecido.",
    ],
    photos: [
      photo("IMG_5633", "Las imágenes en papel", "Las fotografías de la colección impresas con sus márgenes y títulos sobre una mesa"),
      photo("IMG_5660", "Compartir la mirada", "Visitantes recorren las fotografías expuestas en la sala"),
      photo("IMG_5663", "Detenerse a mirar", "Una persona observa de cerca una fotografía enmarcada del paisaje de San Marcos"),
    ],
  },
  inquiry: "Hola Juan, me interesa la colección «San Marcos, mi mirada». Quisiera consultar por la disponibilidad de sus fotografías en formato digital o impresas a pedido. ¿Podés contarme las opciones?",
};
