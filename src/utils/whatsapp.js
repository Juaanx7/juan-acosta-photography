// Destino utilizado por la tienda deportiva existente.
export const WHATSAPP_NUMBER = "5493549461840";

export function createWhatsAppLink(message = "") {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export const contactReasons = [
  "Cobertura deportiva", "Evento o festival", "Recital",
  "Fotografía digital o para imprimir", "Otro proyecto",
];

export function buildContactMessage({ name, reason, message }) {
  if (!name.trim() || !message.trim() || !contactReasons.includes(reason)) {
    throw new Error("Completá tu nombre, elegí un motivo y escribí un mensaje.");
  }
  return `Hola Juan, te contacto desde tu web.\n\nNombre: ${name.trim()}\nConsulta: ${reason}\n\n${message.trim()}`;
}
