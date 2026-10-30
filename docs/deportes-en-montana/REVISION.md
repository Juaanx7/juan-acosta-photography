# Deportes en montaña · Revisión

Entrega del 30 de octubre de 2026, rama `feat/portfolio-deportes-montana`, desde **`f56aae0dec62feae5c7fde1414cfacb5b0052318`**. Se verificó que main y el último despliegue Production / success apuntaban a esa versión. Se reutilizó el worktree limpio existente; se preservaron los cambios de benchmark y las referencias del checkout original.

## Cambios y decisiones

- Nueva ruta `/portfolio/deportes-en-montana`, cargada de forma diferida en React Router. La categoría del home queda activa, conservando su fotografía y los controles actuales de categorías (una por vez en celular, tres en escritorio). Volver al portfolio lleva a `/#portfolio`.
- Cabecera y texto aprobados; montaña. en cursiva dentro de la frase, sin br ni cortes impuestos. Introducción de hasta 650 px, fotografías al ancho fluido actual de aproximadamente 90%, máximo 2200 px.
- Once filas en el orden indicado: apertura; par horizontal; par vertical; par horizontal; Quilpo ancho; dos pares verticales; dos pares horizontales; par vertical; cierre mixto horizontal/vertical 1.75:1 centrado. Los cuatro pares verticales usan 78% del ancho en escritorio. A 600 px o menos todas las filas pasan a una columna y las verticales usan el ancho completo. Fotos completas, sin recortes ni deformación; separación de 28 px entre fotos y 44 px entre filas en escritorio.
- Se reutilizan SeriesPhoto, ResponsivePhoto, SeriesViewer y las clases de galería actuales. Datos y estilos nuevos están limitados a esta página; no se modificaron navbar, carrusel, Sobre mí, Paisajes y viajes, series anteriores, contacto ni la lógica deportiva.
- Cada pie muestra solamente la carrera del CSV. Ese nombre se adapta al campo de pie ya admitido por el visor compartido, sin modificarlo. El visor recorre las veinte fotos manualmente y conserva contador, flechas, Escape, foco y posición de lectura. Las imágenes son los botones accesibles; no hay acción visible Ampliar, selección de compra ni precios.
- El cierre Consultar por una cobertura navega a `/#contacto`. El formulario actual no recibe un motivo precargado desde navegación: el visitante elige Cobertura deportiva allí. Se conservan preparación de mensaje, revisión previa y enlace WhatsApp del proyecto; no se inventó un teléfono ni se creó otro formulario.
- Ver fotos de carreras navega realmente a `/tienda/deportes`. No se copiaron los acordeones ni acciones ficticias del boceto. Su HTML se conserva como documentación y se inspeccionó renderizado en escritorio y celular; no se importa en la aplicación, no se incrusta como iframe ni se utilizan sus base64.

## Veinte fuentes verificadas

Se verificaron presencia, nombres, formato JPEG, decodificación, orientación EXIF, dimensiones, perfil ICC y correspondencia visual, sin marcas de agua observadas en la selección. Todas las fuentes tienen más resolución que el boceto. **Quilpo tiene originales de 6000 px de lado mayor; no se usaron copias de 2048 px.** La menor fuente mide 2393×3589 px, suficiente para su columna y las resoluciones verificadas.

La carpeta `docs/deportes-en-montana/**/fotos/originales/` se ignoró antes de agregar archivos. Los originales copiados al worktree conservan los mismos hashes que el checkout original; no se versionan.

| Orden | Archivo | Carrera |
| --- | --- | --- |
| 1 | `DSC06918.jpg` | DH Pan de Azúcar |
| 2 | `DSC04908.jpg` | Enduro Las Pircas |
| 3 | `DSC04741.jpg` | Enduro Las Pircas |
| 4 | `DSC07076.jpg` | DH Pan de Azúcar |
| 5 | `DSC03832.jpg` | Enduro Las Pircas |
| 6 | `DSC06683.jpg` | DH Pan de Azúcar |
| 7 | `DSC04471.jpg` | Enduro Las Pircas |
| 8 | `DSC07968.jpg` | Quilpo Race |
| 9 | `DSC08137.jpg` | Quilpo Race |
| 10 | `DSC09314.jpg` | Quilpo Race |
| 11 | `DSC08579.jpg` | Quilpo Race |
| 12 | `DSC04994.jpg` | Desafío Río Pinto |
| 13 | `DSC06797.jpg` | DH Pan de Azúcar |
| 14 | `DSC04326.jpg` | Enduro Las Pircas |
| 15 | `DSC02996.jpg` | Desafío Río Pinto |
| 16 | `DSC08126.jpg` | DH Pan de Azúcar |
| 17 | `DSC08226.jpg` | DH Pan de Azúcar |
| 18 | `DSC05303.jpg` | Enduro Las Pircas |
| 19 | `DSC05143.jpg` | Enduro Las Pircas |
| 20 | `DSC06882.jpg` | Desafío Río Pinto |

## Recursos responsive

`scripts/generateMountainSportsImages.py` reutiliza el flujo Pillow/Lanczos/WebP del portfolio: verifica catálogo y fuentes antes de generar; corrige orientación EXIF y gestiona los perfiles sRGB y Rec. 2020 hacia sRGB para la web. No recorta, amplía, modifica la edición ni agrega enfoque creativo.

Se generaron **122 WebP** (11 horizontales × 7 y 9 verticales × 5), calidad 90 / método 6, con perfil sRGB. Horizontales: 640, 960, 1440, 1920, 2560, 3200 y hasta 4400 px, limitados al original. DSC02996 termina en 3787 px y DSC08126 en 3904 px. Verticales: 480, 640, 960, 1440 y 1920 px. No se reutilizaron miniaturas o variantes con marcas de la tienda.

Los recursos suman aproximadamente 84.45 MiB en el repositorio; srcset/sizes permite descargar solamente la variante adecuada, sin cargar toda esa colección de tamaños al entrar. Se define el tamaño intrínseco de cada foto; solo la apertura es prioritaria y las otras diecinueve tienen lazy loading. La página y sus datos se descargan al navegar a ella.

## Comprobaciones reales

- `npm run build`: correcto. Permanece el aviso previo por el tamaño del catálogo Cloudinary, sin cambios en él.
- `npm run lint`: correcto.
- `npm test`: diez pruebas correctas; contratos de ambas galerías, nombres/carreras/alt del CSV, variantes, rutas deportivas publicadas, Cloudinary y preparación de WhatsApp.
- Capturas/mediciones en 360×800, 390×800, 768×1024, 1366×768, 1920×1080 y 2560×1440. Imagen completa, proporción y columna móvil conservadas; sin desbordamientos. Visor WebKit con poca altura 844×390. Anclas Sobre mí y Contacto verificadas por toque desde la galería y cierre del menú confirmado.
- Las 122 variantes se decodificaron y contrastaron con sus dimensiones declaradas, proporción, límite del original y perfil ICC. Las veinte fuentes conservaron sus hashes.
- `npm run test:mountain-sports -- --workers=1`: doce correctas en Edge y WebKit, escritorio y toque emulado. Apertura desde la tercera categoría del home móvil, ruta directa/recarga, regreso, acceso a tienda y contacto real con motivo Cobertura deportiva, confirmación y URL WhatsApp existentes sin envío. Orden de veinte fuentes, carreras y once filas, tamaños responsive a 360/390/768/1366/1920/2560 px, incluyendo 1920×600; imagen completa y resolución suficiente según srcset en alta densidad. Apertura adicional a DPR 1.
- Visor: las veinte fotos/carreras y contador, ausencia de avance automático durante 6.5 segundos, toque, Enter/Espacio, flechas, Tab/Shift+Tab, Escape, foco visible, devolución al disparador y scroll conservado. Controles, carrera e imagen visibles con poca altura 844×390.
- `npm run test:landscapes -- --workers=1`: doce correctas, incluida su galería responsive, visor y enlaces a las tres series.
- `npx playwright test --config tests/preservedFlows.config.js --workers=1`: doce correctas. Imágenes reales de Cloudinary, selección persistente tras recarga, paginación, modal y preparación de pedido con apertura externa interceptada. Las tres series conservan visor, contador, carrera/ubicación, Escape y foco. Contacto mantiene confirmación y WhatsApp, sin envío.
- `npm run test:navbar -- --workers=1 --project=chromium-touch-390 --project=webkit-touch-390 --project=chromium-desktop --project=webkit-desktop`: 26 correctas y 26 omisiones esperadas por tipo de interacción. Apertura/cierre, opciones reales con un toque desde diez rutas, opción de fotografías para encargar deshabilitada, mouse, Tab y Escape.
- `npm run test:navbar -- --workers=1 --project=chromium-touch-360 --project=webkit-touch-360 --grep 'Deportes en montaña'`: dos correctas, navegación táctil de Tienda desde la nueva galería a 360 px en ambos motores.
- `npm run test:cover -- --workers=1 --grep 'flechas, cuatro|fotos completas'`: ocho correctas. Flechas, puntos, teclado, imagen completa, nitidez, márgenes y controles visibles en los tamaños aprobados. El código del temporizador y sus pausas no cambió; no se repitió la batería temporizada completa.
- `git diff --check`: correcto. Los componentes y estilos anteriores, datos/rutas de eventos, Cloudinary, selección, compra y número de WhatsApp conservan su implementación. Los cambios ajenos del checkout original permanecen intactos.

## Capturas y evidencia

- [Correspondencia de los veinte archivos](capturas/correspondencias.jpg)
- [Inicio · 1366×768](capturas/inicio-1366.png)
- [Inicio · 1920×1080](capturas/inicio-1920.png)
- [Inicio · 2560×1440](capturas/inicio-2560.png)
- [Tablet · 768×1024](capturas/inicio-768.png)
- [Celular · 360×800](capturas/inicio-360.png)
- [Celular · 390×800](capturas/inicio-390.png)
- [Apertura completa · escritorio](capturas/apertura-completa-1366.png)
- [Quilpo completo · escritorio](capturas/quilpo-1366.png)
- [Par vertical · escritorio](capturas/pares-verticales-1366.png)
- [Par vertical · celular](capturas/pares-verticales-390.png)
- [Cierre mixto · escritorio](capturas/par-mixto-1366.png)
- [Cierre mixto · celular](capturas/par-mixto-390.png)
- [Consulta · escritorio](capturas/consulta-1366.png)
- [Consulta · celular](capturas/consulta-390.png)
- [Acceso a tienda · celular](capturas/tienda-390.png)
- [Visor · WebKit 844×390](capturas/webkit-visor-844x390.png)
- [Mediciones y recursos elegidos](capturas/mediciones.json)
- [Fuentes, resolución, perfiles y hashes](capturas/fuentes.json)
- [Validación de variantes](capturas/recursos.json)
- [Anclas reales del home](capturas/anclas.json)

## Acceso y límites

Local: http://127.0.0.1:5175/portfolio/deportes-en-montana. Para reiniciar desde el worktree: `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort`.

Pruebas en Edge/Chromium y WebKit de Playwright sobre Windows, con emulación táctil Pixel 7 / iPhone 13 y teclado. No son pruebas en teléfonos físicos, Safari real, lectores de pantalla ni redes móviles. No se enviaron consultas ni pedidos reales por WhatsApp. Pendientes la revisión visual de Juan y, si corresponde, las comprobaciones en sus dispositivos.

El commit de implementación se identifica como «feat: incorporar galería Deportes en montaña»; sus enlaces y Preview se agregarán al confirmar la subida. El merge a main y la publicación en producción quedan exclusivamente a cargo de Juan.
