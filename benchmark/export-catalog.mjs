// Exportador de lectura: carga solo events.js, sin React, config del sitio ni secretos.
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { stdout } from 'node:process';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  envFile: false,
  logLevel: 'silent',
  cacheDir: fileURLToPath(new URL('./.cache', import.meta.url)),
  server: { middlewareMode: true, watch: null, preTransformRequests: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { events } = await server.ssrLoadModule('/src/data/events.js');
  const catalog = events.map(event => ({
    eventId: event.id,
    photos: event.categories
      ? event.categories.flatMap(category => category.photos.map(photo => ({ ...photo, categoryId: category.id })))
      : (event.photos || []).map(photo => ({ ...photo, categoryId: null })),
  }));
  stdout.write(JSON.stringify(catalog));
} finally {
  await server.close();
}
