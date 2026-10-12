import images from "./cumbrecitaImages.json";

const photo = (name, alt) => ({
  ...images[name], alt,
  srcSet: images[name].variants.map(variant => `${variant.image} ${variant.width}w`).join(", "),
});

export const cumbrecita = {
  title: "La Cumbrecita",
  location: "La Cumbrecita, Córdoba",
  paragraphs: [
    "En mi visita a La Cumbrecita encontré el pueblo cubierto de neblina, lluvia y mucho verde. Ese clima le daba una atmósfera especial y me invitaba a descubrirlo caminando, atento a sus rincones y detalles.",
    "Comenzamos recorriendo sus calles, apreciando la arquitectura y la vegetación que la rodeaba. Entre los árboles altos, el río y las cascadas, sentí esa conexión con la naturaleza que tanto disfruto al explorar con mi cámara.",
    "Al caer la noche, las luces cálidas transformaron el paisaje del pueblo. Seguimos recorriendo la zona céntrica, descubriendo los mismos rincones con otros colores y una iluminación distinta. Esa atmósfera nocturna también quedó en las fotografías de esta visita.",
  ],
  works: [
    photo("DSC03544", "Árboles, tejados y montaña cubierta de neblina"),
    photo("DSC03493", "Camino húmedo junto al letrero Paseo de la Fuente"),
    photo("DSC03489", "Casa blanca entre árboles y curva del camino"),
    photo("DSC03541", "Pequeña capilla rodeada de árboles"),
    photo("DSC03530", "Persona junto al sendero bajo árboles altos"),
    photo("DSC03523", "Estructura de madera con libros entre la vegetación"),
    photo("DSC03582", "Gotas de agua en una rama con vegetación"),
    photo("DSC03586", "Persona contemplando la cascada"),
    photo("DSC03557", "Rincón de madera con estantes y tonos cálidos"),
    photo("DSC03601", "Edificio iluminado junto al puente y el agua"),
    photo("DSC03619", "Lámparas cálidas en un tronco contra el cielo azul"),
    photo("DSC03622", "Edificio y guirnaldas iluminados de noche"),
  ],
  inquiry: "Hola Juan, me interesa la colección «La Cumbrecita». Quisiera consultar por la disponibilidad de sus fotografías en formato digital o impresas a pedido. ¿Podés contarme las opciones?",
};
