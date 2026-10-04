import test from "node:test";
import assert from "node:assert/strict";
import { buildContactMessage, createWhatsAppLink, contactReasons } from "../src/utils/whatsapp.js";

test("consulta conserva tildes, saltos, emoji y caracteres de URL", () => {
  const message = buildContactMessage({ name: "  José Núñez  ", reason: "Otro proyecto", message: "  ¿Fotos & paisajes? 📷\nLugar #1: Córdoba  " });
  assert.equal(message, "Hola Juan, te contacto desde tu web.\n\nNombre: José Núñez\nConsulta: Otro proyecto\n\n¿Fotos & paisajes? 📷\nLugar #1: Córdoba");
  const url = new URL(createWhatsAppLink(message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5493549461840");
  assert.equal(url.searchParams.get("text"), message);
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.hash, "");
});

test("rechaza espacios vacíos y motivos no permitidos", () => {
  const valid = { name: "Ana", reason: "Recital", message: "Consulta" };
  for (const field of ["name", "reason", "message"]) {
    assert.throws(() => buildContactMessage({ ...valid, [field]: " \n " }));
  }
  assert.throws(() => buildContactMessage({ ...valid, reason: "Inventado" }));
});

test("todos los motivos funcionan sin un correo electrónico", () => {
  for (const reason of contactReasons) {
    assert.match(buildContactMessage({ name: "Ana", reason, message: "Hola" }), /Nombre: Ana/);
  }
  assert.equal(createWhatsAppLink(), "https://wa.me/5493549461840");
});
