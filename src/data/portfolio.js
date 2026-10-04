const photo = (name) => `/images/portfolio/${name}.webp`;

export const coverPhotos = [
  { image: photo("golden"), title: "Pampa de Achala", alt: "Pastizales dorados y montañas de Pampa de Achala" },
  { image: photo("walkers"), title: "Caminantes", alt: "Una caminata con amigos entre paredes de roca" },
  { image: photo("forest"), title: "La Cumbrecita", alt: "Un pueblo entre el bosque y la niebla de La Cumbrecita" },
  { image: photo("sport"), title: "Deporte entre la niebla", alt: "Ciclista en la montaña entre la niebla" },
];

// Las portadas tipográficas esperan fotografías propias del tema correspondiente.
export const portfolioCategories = [
  { id: "paisajes", title: "Paisajes y viajes", image: photo("valley"), alt: "Un valle visto entre rocas" },
  { id: "san-marcos", title: "San Marcos, mi mirada", eyebrow: "SAN MARCOS", coverTitle: "mi mirada" },
  { id: "deportes", title: "Deportes en montaña", image: photo("sport"), alt: "Deporte entre la niebla" },
  { id: "eventos", title: "Eventos", eyebrow: "ENCUENTROS", coverTitle: "Eventos" },
  { id: "festivales", title: "Festivales", eyebrow: "ENERGÍA COMPARTIDA", coverTitle: "Festivales" },
  { id: "recitales", title: "Recitales", eyebrow: "MÚSICA EN VIVO", coverTitle: "Recitales" },
];

export const portfolioSeries = [
  { id: "achala", title: "Pampa de Achala", image: photo("golden"), alt: coverPhotos[0].alt, label: "RECORRIDOS", description: "Una caminata con amigos entre paredes de roca." },
  { id: "cumbrecita", title: "La Cumbrecita", image: photo("forest"), alt: coverPhotos[2].alt, label: "VIAJES", description: "Bosque, agua y pequeños momentos del viaje." },
  { ...portfolioCategories[1], label: "MIRADA PERSONAL", description: "Una colección sobre el lugar al que pertenezco." },
];
