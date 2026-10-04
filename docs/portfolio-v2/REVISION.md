# Primera entrega · Portfolio v2

Base: origin/main, eb9b971 (producción al iniciar el trabajo).
Rama: feat/portfolio-v2. No fusionar a main antes de la revisión de Juan.
Referencia leída: docs/juanacostaph-portfolio-v2/IMPLEMENTACION.md y diseno-portada-inmersiva.html en el checkout original. Los archivos de referencia, previamente sin seguimiento, no se incorporaron al commit. Se copiaron únicamente las cinco fotos WebP autorizadas a public/images/portfolio.

## Desarrollo y arquitectura

- React, React Router, Vite y Sass del proyecto, sin dependencias nuevas.
- `npm run dev` inicia la web; `npm run build`, `npm run lint` y `npm test` ejecutan las comprobaciones.
- `src/data/portfolio.js` contiene las portadas, categorías y series. Las categorías sin foto mantienen portadas tipográficas.
- La tienda se carga mediante importación dinámica para no descargar el catálogo deportivo al entrar al portfolio.
- La consulta usa un diálogo nativo con foco contenido, Escape y regreso al formulario. No requiere correo ni envía mensajes: prepara la URL y el visitante confirma el envío en WhatsApp.
- Se extrajo la construcción existente de la URL de WhatsApp a una utilidad compartida, conservando el número y los textos/precios deportivos.
- Se conservan los datos, contratos de Cloudinary, scripts de carga, selección persistente, modal y paginación. Se corrigieron el hook condicionado en EventCategories y el acceso a un evento inexistente en Gallery.
- Se ajustó ESLint para reconocer el entorno Node de los scripts existentes, sin modificar esos scripts.

## Rutas protegidas

- `/`: nuevo portfolio; `/#portfolio`, `/#sobre-mi`, `/#contacto`: secciones.
- `/tienda/deportes`: entrada a la tienda existente.
- `/#eventos`: alias compatible que redirige a `/tienda/deportes#eventos`.
- `/evento/:eventId`, `/evento/:eventId/galeria`, `/evento/:eventId/:categoryId` y `/como-comprar`: conservadas.
- DH Pan de Azúcar: `dh-pan-de-azucar-2026`, con `entrenamientos`, `clasificacion`, `final`.
- Las Pircas: `nacional-enduro-las-pircas-2026`, con `circuito-molle`, `circuito-peperina`, `circuito-molle-ebike`, `circuito-peperina-ebike`, `circuito-downhill`, `circuito-ps-anflow`.
- CPRO: `cpro-capilla-2026`, con `tanda-2`, `tanda-3`, `tanda-4`, `tanda-5`.
- `vercel.json` conserva el rewrite existente hacia index.html para aperturas directas y recargas.

## Comprobaciones realizadas

- Build correcto. El paquete inicial pasó de aproximadamente 1.28 MB a 252 kB sin comprimir; el catálogo deportivo existente conserva un bloque de aproximadamente 1.01 MB y el aviso de tamaño de Vite.
- Lint sin errores; persiste un aviso previo en PhotoModal sobre dependencias de un efecto, fuera de los cambios del rediseño.
- Seis pruebas de Node: mensajes con tildes, emojis, saltos, &, ? y #; espacios vacíos; motivos; URL y número existente; compatibilidad de rutas y prioridad de /galeria.
- Navegador local a 360, 768 y 1440 px: sin desbordamiento horizontal, una categoría por vista en celular y tres en escritorio/tablet; imagen completa en celular; categorías secundarias accesibles con flechas.
- Vista previa de contacto, URL codificada y Escape con devolución del foco y conservación de campos. No se envió ningún mensaje real.
- Tienda: enlace antiguo /#eventos; apertura y recarga de una galería de cada carrera; selección, persistencia tras recarga, deselección, modal, navegación entre fotos, paginación y confirmación del pedido. Imágenes de Cloudinary cargadas correctamente.
- El primer push registró en GitHub un despliegue Vercel exitoso con environment=Preview y production_environment=false. main mantuvo eb9b971. La Preview requiere iniciar sesión en Vercel.

## Límites y siguiente etapa

- Las galerías interiores del portfolio, fotos definitivas de categorías secundarias/San Marcos, biografía ampliada y tienda de paisajes quedan pendientes. No hay checkout ni enlaces que simulen contenido terminado.
- prefers-reduced-motion, pausa por hover/foco/visibilidad y limpieza de efectos están implementados; la emulación del ajuste de movimiento reducido no está disponible en el navegador de pruebas utilizado.
- Las recargas se comprobaron localmente. La Preview remota protegida por Vercel no pudo inspeccionarse sin iniciar sesión.
- La web no puede confirmar que un mensaje fue enviado en WhatsApp. Se comprobó la preparación de enlaces y la acción de apertura; no el envío ni la aplicación externa en un teléfono.
