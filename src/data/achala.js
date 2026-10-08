import images from "./achalaImages.json";

const photo = (name, alt) => ({
  ...images[name], alt,
  srcSet: images[name].variants.map((variant) => `${variant.image} ${variant.width}w`).join(", "),
});

export const achala = {
  title: "Los Cajones de Achala",
  location: "Pampa de Achala, Córdoba",
  paragraphs: [
    "Comenzamos la caminata con mis amigos bien temprano, con un frío intenso y el cielo nublado. Desde los primeros pasos me sorprendió la variedad del paisaje: vistas abiertas, formaciones rocosas, senderos entre la vegetación y pasos estrechos donde las paredes de piedra nos hacían sentir pequeños.",
    "Al mediodía llegamos a los cajones y paramos a comer. Fue una caminata extensa, pero lo que íbamos descubriendo nos mantenía las ganas de seguir explorando y detenernos a mirar.",
    "Durante el regreso, ya cerca de donde habíamos comenzado, coincidimos con la hora dorada del atardecer. Después de un día casi completamente nublado, la luz iluminó los pastizales y nos permitió contemplar el paisaje con otros colores. El mismo lugar nos ofrecía una mirada distinta para cerrar el recorrido.",
  ],
  works: [
    photo("DSC02820", "Cuatro caminantes se ven pequeños entre enormes paredes de roca y un suelo verde"),
    photo("DSC02395", "El grupo recorre un sendero sobre la ladera, frente a un paisaje abierto bajo un cielo gris"),
    photo("DSC02427", "Una caminante de espaldas observa las formaciones rocosas y los pastizales"),
    photo("DSC02568", "Musgo verde y pequeñas plantas crecen sobre una pared de roca en un paso estrecho"),
    photo("DSC02569", "Dos personas avanzan por un paso estrecho entre paredes de roca cubiertas de vegetación"),
    photo("DSC02780", "Grandes formaciones de roca gris rodean una depresión cubierta de pasto verde"),
    photo("DSC02824", "Un corredor de pastizales verdes se extiende entre paredes rocosas bajo el cielo nublado"),
    photo("DSC02882", "Cuatro caminantes siguen un sendero que asciende entre grandes paredes de roca"),
    photo("DSC02887", "Dos personas de espaldas contemplan el paisaje abierto, enmarcado por rocas a ambos lados"),
    photo("DSC02966", "Tres amigos miran el paisaje desde las rocas mientras uno señala hacia el horizonte"),
    photo("DSC02984", "La luz del atardecer atraviesa las nubes y alcanza distintos sectores del paisaje rocoso"),
    photo("DSC02988", "Pastizales dorados iluminados por el sol contrastan con las montañas oscuras y un cielo con nubes"),
  ],
  inquiry: "Hola Juan, me interesa la colección «Los Cajones de Achala». Quisiera consultar por la disponibilidad de sus fotografías en formato digital o impresas a pedido. ¿Podés contarme las opciones?",
};
