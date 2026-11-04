# Eventos y música · Revisión de la entrega

Entrega del 3 de noviembre de 2026. Rama `feat/portfolio-eventos-musica`, desde **`f56aae0dec62feae5c7fde1414cfacb5b0052318`**, verificada como origin/main y Production / success antes de trabajar.

## Base y preservación

El PR #16 de Deportes en montaña permanece abierto y sin merge, con su rama `feat/portfolio-deportes-montana` intacta en `56542a143e75c7c6b5a44dc1aa90564a2b05f946`. Siguiendo el pedido de partir del main actual, esta entrega no incorpora ese PR pendiente. Su implementación y sus originales locales se conservan; estos últimos aparecen sin seguimiento al cambiar a una rama cuyo main todavía no contiene su regla de exclusión, y se dejan fuera del índice. No se modifican ni se agregan a esta entrega.

Se reutilizó el worktree limpio existente para aislar los cambios de benchmark y las referencias no versionadas del checkout original, que se conservaron. La rama nueva parte del main actual, no de portfolio-v2 ni del PR anterior.

## Qué cambió y por qué

- Nueva ruta `/portfolio/eventos-y-musica`, con carga diferida en React Router. La tarjeta existente de Eventos pasa a llamarse Eventos y música y enlaza a la galería; conserva su portada tipográfica, sin descargar imágenes ni datos de esta selección en el home. No se agrega una categoría duplicada. Los otros contenidos pendientes de main conservan su estado.
- Encabezado, introducción y cierre aprobados; música. queda en cursiva dentro de la frase y el título está encima del texto, sin cortes manuales. El texto mantiene un ancho cómodo de hasta 660 px; la galería aprovecha el contenedor actual de aproximadamente 90%, máximo 2200 px.
- Once filas con las 26 fotografías en el orden de galeria.json. Las columnas se calculan desde ancho/alto reales de los originales orientados. Cada fila comparte altura de imagen y completa los bordes del contenedor; no se fijan alturas con recorte. Separación de 20 px entre columnas, 28 px entre filas y 10 px hasta el epígrafe. A 600 px o menos, una columna en el mismo orden, con 24 px de separación.
- Los epígrafes usan exactamente Artista · Evento, o solo el evento cuando no se conoce artista. Se mantienen Valentina Márquez, Dosfolk y Aníbal y la otra opción con sus nombres definitivos, junto con los demás artistas identificados. Las cuatro fotos de La Pirámide no se etiquetan como Festival de la Miel.
- Se reutilizan SeriesPhoto, ResponsivePhoto, SeriesViewer y los estilos actuales de portfolio. Cada imagen abre el visor con clic, toque o teclado; no hay acción visible Ampliar. El visor muestra el epígrafe y contador, mantiene navegación manual, Escape, foco contenido, devolución al disparador y posición de lectura. No hay filtros, compra, precios, avales de artistas ni reproducción automática.
- Consultar por una cobertura navega a `/#contacto`. El formulario vigente no admite motivo precargado desde navegación; el visitante puede elegir Evento o festival. Se conserva la preparación y confirmación previa a WhatsApp y el número existente. No se agrega otro formulario ni se copian el acordeón o las anclas de demostración del boceto.
- Navbar, hamburguesa, corrección táctil de Tienda, footer, portada, Sobre mí, las tres series, Paisajes y viajes, rutas/datos deportivos, Cloudinary y compra conservan su implementación.

## Fuentes y recursos

Los 26 JPG se encontraron con sus nombres exactos, se decodificaron completos y se revisaron visualmente. Se verificaron orientación EXIF, dimensiones y perfiles ICC. No se observaron marcas de agua agregadas en la selección. Los originales permanecen intactos, con hashes iguales al checkout original, y la carpeta `docs/eventos-y-musica/fotos/originales/` se ignoró antes de cualquier git add.

| Orden | Original | Dimensiones orientadas | Epígrafe |
| --- | --- | --- | --- |
| 1 | `DSC09375.jpg` | 6000×4000 | Festival de la Miel |
| 2 | `DSC06506.jpg` | 2826×5024 | Valentina Márquez · Festival de la Miel |
| 3 | `DSC06530.jpg` | 4973×2797 | Valentina Márquez · Festival de la Miel |
| 4 | `DSC06435.jpg` | 2944×5233 | Valentina Márquez · Festival de la Miel |
| 5 | `DSC06294.jpg` | 5121×2881 | Dosfolk · Festival de la Miel |
| 6 | `DSC05704.jpg` | 3375×6000 | Festival de la Miel |
| 7 | `DSC00475.jpg` | 3375×6000 | Aníbal y la otra opción · La Pirámide |
| 8 | `DSC04711.jpg` | 6000×3375 | Aníbal y la otra opción · Festival de la Miel |
| 9 | `DSC00386.jpg` | 4000×6000 | Aníbal y la otra opción · La Pirámide |
| 10 | `DSC01242.jpg` | 2981×5299 | Aníbal y la otra opción · La Pirámide |
| 11 | `DSC04246.jpg` | 3375×6000 | Festival de la Miel |
| 12 | `DSC09039.jpg` | 4998×3332 | Festival de la Miel |
| 13 | `DSC01066.jpg` | 6000×4000 | Lázaro Caballero · Festival de la Miel |
| 14 | `DSC00977.jpg` | 6000×4000 | Lázaro Caballero · Festival de la Miel |
| 15 | `DSC06152.jpg` | 4573×2572 | Raly Barrionuevo · Festival de la Miel |
| 16 | `DSC05500.jpg` | 2852×5070 | Raly Barrionuevo · Festival de la Miel |
| 17 | `DSC09711.jpg` | 4000×6000 | Festival de la Miel |
| 18 | `DSC04814.jpg` | 3205×5698 | Aníbal y la otra opción · Festival de la Miel |
| 19 | `DSC04765.jpg` | 3375×6000 | Aníbal y la otra opción · Festival de la Miel |
| 20 | `DSC01232.jpg` | 6000×4000 | Festival de la Miel |
| 21 | `DSC00904.jpg` | 4000×6000 | Festival de la Miel |
| 22 | `DSC01070.jpg` | 3025×5378 | Aníbal y la otra opción · La Pirámide |
| 23 | `DSC09475.jpg` | 4000×6000 | Festival de la Miel |
| 24 | `DSC06307.jpg` | 4000×6000 | Dosfolk · Festival de la Miel |
| 25 | `DSC05659.jpg` | 4025×2264 | Raly Barrionuevo · Festival de la Miel |
| 26 | `DSC09848.jpg` | 5712×3213 | José Luis Aguirre · Festival de la Miel |

El generador `scripts/generateEventsMusicImages.py` lee el manifiesto aprobado, valida orden, filas, archivos y coherencia de epígrafes antes de escribir. Reutiliza Pillow/Lanczos/WebP calidad 90 y método 6, con gestión de perfiles ICC hacia sRGB. No recorta, amplía, reedita color ni añade enfoque creativo. Las dimensiones pequeñas del boceto no se utilizan como maestras.

Se generan **152 variantes WebP**: 11 horizontales con 7 tamaños y 15 verticales con 5 tamaños. Horizontales: 640/960/1440/1920/2560/3200 y hasta 4400 px; verticales: 480/640/960/1440/1920 px. Los tamaños se limitan al original; DSC05659 termina en 4025 px. Se declaran dimensiones, srcset y sizes específicos de cada foto dentro de su fila. Solo la apertura tiene prioridad; las otras 25 usan carga diferida.

Las variantes suman aproximadamente 60.62 MiB en el repositorio, de los que el navegador selecciona un archivo por foto según tamaño visible y densidad. Los datos necesarios para la página se generan sin las URLs de Drive presentes en la documentación de origen. El HTML de referencia se conserva como documentación y se revisó en un contexto UTF-8; no se importa en la app, no se usa como iframe ni se reutilizan sus imágenes base64.

## Comprobaciones realizadas

- `npm run build`: correcto; permanece el aviso previo por el tamaño del catálogo deportivo Cloudinary, que no se cambió.
- `npm run lint`: correcto.
- `npm test`: nueve pruebas correctas. Contratos de imágenes, rutas públicas deportivas y de portfolio, prioridad de galería y preparación de WhatsApp.
- Capturas y mediciones a 360×800, 390×800, 768×1024, 1366×768, 1920×1080 y 2560×1440, con densidad alta. Revisión de escenas con luces/humo, piel y zonas oscuras. En tablet las filas mantienen su composición proporcional, con epígrafes largos que envuelven debajo; el visor permite ver cada foto mayor.
- Las 152 variantes se abrieron y comprobaron contra dimensiones declaradas, proporción y límites de su original, y contienen ICC. Las 26 fuentes conservaron sus hashes.
- Anclas Sobre mí y Contacto activadas por toque desde la galería, con cierre del menú. Visor WebKit capturado a 844×390 con imagen, epígrafe y controles visibles.
- `npm run test:events-music -- --workers=1`: doce pruebas correctas en cuatro proyectos (Edge/WebKit, toque emulado y escritorio). Categoría existente y controles de paginación del home, ninguna descarga de imágenes/datos de la galería antes de abrirla, ruta directa y recarga, regreso al portfolio y contacto real con confirmación de WhatsApp, sin envío.
- Comprobación contra el manifiesto aprobado: 26 fuentes, orden, once filas, textos alternativos y epígrafes exactos; las cuatro fotos de La Pirámide quedan diferenciadas. Filas con alturas iguales y bordes alineados, fotos completas, resolución seleccionada suficiente en alta densidad, título encima del texto y una columna móvil. Viewports de 360/390/768/1366/1920/2560 px, incluida poca altura 1920×600. Apertura y cierre adicionales a DPR 1.
- Visor: recorrido manual de las 26 fotos y epígrafes, contador, ausencia de autoplay tras 6.5 segundos, toque/Enter/Espacio, flechas, Escape, Tab/Shift+Tab, foco visible y contenido, retorno al mismo disparador y posición de lectura. Controles, imagen y epígrafe dentro del viewport 844×390.
- `npx playwright test --config tests/preservedFlows.config.js --workers=1`: doce correctas. Carga real de Cloudinary, selección persistente tras recarga, paginación, modal, devolución de foco y preparación del pedido con apertura externa interceptada. Las tres series conservan visor, contador, epígrafes y Escape; contacto conserva su confirmación y número real. Sin envíos.
- `npm run test:navbar -- --workers=1 --project=chromium-touch-390 --project=webkit-touch-390 --project=chromium-desktop --project=webkit-desktop`: 26 correctas y 26 omisiones esperadas por modalidad. Menú táctil desde diez rutas, incluida Eventos y música; opciones reales con un toque, cierre, opción en preparación deshabilitada, mouse, Tab y Escape.
- `npm run test:navbar -- --workers=1 --project=chromium-touch-360 --project=webkit-touch-360 --grep 'Eventos y música'`: dos correctas, menú Tienda desde esta galería a 360 px en ambos motores.
- `npm run test:landscapes -- --workers=1 --grep 'visor:|home,'`: ocho correctas, accesos, regreso, recarga, series enlazadas y visor de Paisajes.
- `npm run test:cover -- --workers=1 --grep 'flechas, cuatro|fotos completas'`: ocho correctas; controles manuales, puntos, teclado, nitidez y geometría de portada. El temporizador y las pausas conservan su código; no se repitió la batería temporizada completa.
- `git diff --check`: correcto. No se modificó código de los componentes compartidos, galerías anteriores ni tienda. La rama de Deportes mantiene su commit original y los cambios ajenos del checkout principal permanecen intactos.

## Capturas y evidencia

- [Los 26 originales y correspondencias](capturas/correspondencias.jpg)
- [Inicio · 1366×768](capturas/inicio-1366.png)
- [Inicio · 1920×1080](capturas/inicio-1920.png)
- [Inicio · 2560×1440](capturas/inicio-2560.png)
- [Inicio · tablet](capturas/inicio-768.png)
- [Inicio · 360 px](capturas/inicio-360.png)
- [Inicio · 390 px](capturas/inicio-390.png)
- [Valentina Márquez · escritorio](capturas/valentina-1366.png)
- [Valentina Márquez · tablet y epígrafes largos](capturas/valentina-768.png)
- [Valentina Márquez · celular](capturas/valentina-390.png)
- [Aníbal y la otra opción · eventos diferenciados](capturas/anibal-eventos-1366.png)
- [Público y artistas · escritorio](capturas/publico-y-artistas-1366.png)
- [Cierre con José Luis Aguirre · escritorio](capturas/cierre-1366.png)
- [Cierre · celular](capturas/cierre-390.png)
- [Consulta · escritorio](capturas/consulta-1366.png)
- [Consulta · celular](capturas/consulta-390.png)
- [Visor WebKit · poca altura](capturas/visor-webkit-844x390.png)
- [Mediciones de filas y archivos seleccionados](capturas/mediciones.json)
- [Dimensiones, epígrafes, perfiles y hashes de fuentes](capturas/fuentes.json)
- [Validación de variantes](capturas/recursos.json)
- [Anclas reales](capturas/anclas.json)

## Acceso y límites

Local: http://127.0.0.1:5175/portfolio/eventos-y-musica. Reinicio desde el worktree: `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort`.

Edge/Chromium y WebKit de Playwright sobre Windows, con toque emulado Pixel 7 / iPhone 13 y teclado. No equivale a teléfonos físicos, Safari real, lectores de pantalla ni red móvil. No se enviaron mensajes ni pedidos reales. Pendientes la revisión de Juan y las comprobaciones que desee hacer en sus dispositivos.

Commit de implementación: **`422e34db0f5ff3e85142d28d3d5a5c27345e88ee`**, «feat: incorporar galería Eventos y música». Incluye código, imágenes, pruebas, documentación y capturas; una actualización documental agrega los enlaces comprobados.

- [PR borrador #17](https://github.com/Juaanx7/juan-acosta-photography/pull/17)
- [Preview de la implementación](https://juan-acosta-photography-kj842neho-juans-projects-1e5bf112.vercel.app/portfolio/eventos-y-musica)
- [Rama remota](https://github.com/Juaanx7/juan-acosta-photography/tree/feat/portfolio-eventos-musica)

Vercel confirmó **Preview / success** para el commit de implementación. La ruta redirige a Login de Vercel sin sesión autorizada; la validación funcional reportada es local. Esta URL muestra el código probado; la actualización documental no cambia la aplicación. Main y el último despliegue Production permanecen en `f56aae0dec62feae5c7fde1414cfacb5b0052318`.

PR borrador sin merge. Juan revisará y realizará el merge manualmente; no se publicó en Production.
