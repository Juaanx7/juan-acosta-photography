import { readFile, writeFile, rename, mkdir, unlink } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import { normalizePlates } from "../src/utils/plateMetadata.js";
import { getEventPhotos } from "../src/utils/eventPhotos.js";

const fail = (status, message) => Object.assign(new Error(message), { status });
const revision = (text) => createHash("sha256").update(text).digest("hex");
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export default function plateEditorPlugin() {
  return {
    name: "local-plate-editor",
    apply: "serve",
    // El editor recibe la metadata por HTTP. Evitar una recarga durante el POST;
    // la web pública recoge estos cambios al recargar la página en este modo.
    hotUpdate({ file }) {
      if (file.replaceAll("\\", "/").includes("/src/data/plates/")) return [];
    },
    configureServer(server) {
      const directory = resolve(server.config.root, "src/data/plates");
      let queue = Promise.resolve();
      const load = async (file) => {
        let text;
        try { text = await readFile(file, "utf8"); }
        catch (error) { if (error.code !== "ENOENT") throw error; text = "{}"; }
        const metadata = JSON.parse(text);
        if (!isObject(metadata)) throw fail(422, "La metadata debe ser un objeto JSON. No se modificó el archivo.");
        return { metadata, revision: revision(text) };
      };
      server.middlewares.use(async (req, res, next) => {
        if (req.url.split("?")[0] !== "/__plates") return next();
        const reply = (status, data) => {
          res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
          res.end(JSON.stringify(data));
        };
        try {
          const port = server.httpServer.address()?.port;
          const origin = `http://127.0.0.1:${port}`;
          if (!["127.0.0.1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress) ||
              req.headers.host !== `127.0.0.1:${port}` ||
              (req.headers.origin && req.headers.origin !== origin) ||
              (req.headers["sec-fetch-site"] && req.headers["sec-fetch-site"] !== "same-origin")) {
            throw fail(403, "Solo se permiten solicitudes locales del mismo origen.");
          }
          if (!["GET", "POST"].includes(req.method)) throw fail(405, "Método no permitido.");
          let body = {};
          if (req.method === "POST") {
            if (req.headers.origin !== origin || req.headers["content-type"] !== "application/json") throw fail(403, "Origen o contenido inválido.");
            let text = "";
            for await (const chunk of req) {
              text += chunk;
              if (Buffer.byteLength(text) > 16384) throw fail(413, "Solicitud demasiado grande.");
            }
            try { body = JSON.parse(text); } catch { throw fail(400, "JSON inválido."); }
            if (!isObject(body)) throw fail(400, "Solicitud inválida.");
          }
          const eventId = req.method === "GET" ? new URL(req.url, origin).searchParams.get("eventId") : body.eventId;
          if (typeof eventId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventId)) throw fail(400, "Evento inválido.");
          const { events } = await server.ssrLoadModule("/src/data/events.js");
          const event = events.find((item) => item.id === eventId);
          if (!event) throw fail(404, "Evento inexistente.");
          const file = join(directory, `${eventId}.plates.json`);
          if (req.method === "GET") return reply(200, await load(file));
          if (!getEventPhotos(event).some((photo) => photo.id === body.photoId)) throw fail(400, "La foto no pertenece al evento.");
          if (!Array.isArray(body.plates) || body.plates.some((value) =>
            typeof value !== "string" && !(Number.isSafeInteger(value) && value >= 0))) throw fail(400, "Dorsales inválidos.");
          const save = async () => {
            const current = await load(file);
            if (body.revision !== current.revision) throw fail(409, "El archivo cambió. Recargá la metadata antes de volver a guardar; tu borrador se conserva.");
            const previous = current.metadata[body.photoId];
            if (previous !== undefined && !isObject(previous)) throw fail(422, "La entrada existente es inválida. Revisá el JSON antes de guardar.");
            const metadata = { ...current.metadata, [body.photoId]: {
              ...previous, plates: normalizePlates(body.plates), reviewed: true,
            } };
            const text = JSON.stringify(metadata, null, 2) + "\n";
            await mkdir(directory, { recursive: true });
            const temporary = `${file}.${randomUUID()}.tmp`;
            try {
              await writeFile(temporary, text, { flag: "wx" });
              await rename(temporary, file);
            } finally { await unlink(temporary).catch(() => {}); }
            return { metadata, revision: revision(text) };
          };
          const pending = queue.then(save);
          queue = pending.catch(() => {});
          reply(200, await pending);
        } catch (error) {
          reply(error.status || 500, { error: error.status ? error.message : "No se pudo leer o guardar la metadata. Revisá el archivo y sus permisos." });
        }
      });
    },
  };
}
