# Primera entrega · Portfolio v2

Base: origin/main, eb9b971 (producción al iniciar el trabajo).
Rama: feat/portfolio-v2. No fusionar a main antes de la revisión de Juan.
Referencia leída: docs/juanacostaph-portfolio-v2/IMPLEMENTACION.md y diseno-portada-inmersiva.html en el checkout original. Los archivos de referencia, previamente sin seguimiento, no se incorporaron al commit. Las cinco fotos de muestra utilizadas inicialmente fueron reemplazadas por versiones web generadas desde los originales en la corrección de portada detallada abajo.

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

- Las galerías interiores de otras series, fotos definitivas de categorías secundarias, biografía ampliada y tienda de paisajes quedan pendientes. San Marcos y Los Cajones de Achala se implementaron en las entregas documentadas más abajo. No hay checkout ni enlaces que simulen contenido terminado.
- prefers-reduced-motion, pausa por hover/foco/visibilidad y limpieza de efectos están implementados; la emulación del ajuste de movimiento reducido no está disponible en el navegador de pruebas utilizado.
- Las recargas se comprobaron localmente. La Preview remota protegida por Vercel no pudo inspeccionarse sin iniciar sesión.
- La web no puede confirmar que un mensaje fue enviado en WhatsApp. Se comprobó la preparación de enlaces y la acción de apertura; no el envío ni la aplicación externa en un teléfono.

## Corrección de portada · 4 de octubre de 2026

- Se conserva la marca del navbar y se agrega una franja con el h1 “Juan Acosta Photography”, centrado, en serif y con mayor jerarquía. “Una mirada en el camino.” pasa a h2: la página conserva un único h1.
- La portada utiliza una cuadrícula con filas para título, fotografía y controles. Su altura es el espacio del viewport menos la altura real del navbar, con un límite de 1000 px. Un ResizeObserver mide el navbar y el marco de la foto; se desconecta al desmontar.
- La foto queda centrada en un marco de hasta 1600 px de ancho, con márgenes simétricos y object-fit: contain. Conserva el encuadre completo, incluida la proporción 3:2 de sport. En celular, el marco mantiene 4:3 y la imagen completa dentro.
- El nombre de la foto ocupa una línea independiente. Pausar/Reproducir, las flechas y el contador forman un grupo centrado cuyo ancho no cambia al alternar el estado de reproducción.
- Se conservan el intervalo de 6000 ms y las pausas por interacción, visibilidad de la pestaña y salida de pantalla; los cambios automáticos continúan sin anuncios a lectores de pantalla.

### Originales y versiones responsive

- Correspondencia confirmada para golden (5794×3259), walkers (4884×2747), forest (5914×3327) y sport (6000×4000).
- Juan confirmó el reemplazo de la muestra valley por el nuevo valley.jpg (5977×3362), una puesta de sol abierta. Se actualizó también su texto alternativo.
- Los originales quedan en `docs/portfolio-v2/fotos-originales/`, ignorados por Git. No se modifican ni se incluyen en el commit.
- `scripts/generatePortfolioImages.py` genera las versiones WebP con Pillow, calidad 90 y remuestreo Lanczos, sin recortar ni ampliar. Interpreta los perfiles ICC originales (Rec. 2020 en golden, walkers y forest; sRGB en sport y valley), convierte a sRGB e incluye ese perfil en la salida. No aplica ajustes artísticos de color, contraste o exposición.
- Se versionan 30 WebP: 640, 960, 1440, 1920, 2560 y 3200 px de ancho por foto, con proporción conservada. Ocupan aproximadamente 13.69 MiB en total; cada visitante descarga las variantes que el navegador selecciona, no el conjunto completo.
- `src/data/portfolioImages.json` registra dimensiones y variantes. El carrusel usa srcset con descriptores de ancho y sizes según el ancho real de la fotografía contenida, calculado a partir del marco y su proporción. Las categorías y series también usan srcset/sizes, con carga diferida.
- Las versiones de 3200 px cubren hasta 2× el ancho máximo del marco de 1600 px. En celular, 960 px cubren aproximadamente 3× una fotografía de 305 px. Esto se comprobó mediante dimensiones de archivos; el navegador de pruebas expone DPR 1 y no permite emular DPR 2/3.
- Para regenerar: `python scripts/generatePortfolioImages.py` con Pillow, WebP y LittleCMS disponibles. `--names golden walkers forest sport valley` permite seleccionar archivos. Los originales deben estar presentes localmente.

### Verificación de esta corrección

| Viewport | Fin de los controles desde el inicio de la página | Imagen seleccionada a DPR 1 | Desbordamiento horizontal |
| --- | --- | --- | --- |
| 1366×768 | 751 px | 960 px, foto visible de ~864 px | No |
| 1920×1080 | 1063 px | 1440 px, foto visible de ~1400 px | No |
| 2560×1440 | 1080 px | 1440 px, foto visible de ~1430 px | No |
| 360×800 | ~556 px | 640 px, foto visible de 305 px | No |

- En los tres tamaños de escritorio se comprobó con scrollY=0 que título, foto y controles quedan visibles. El centro del grupo de controles coincide con el del área de contenido. También se inspeccionaron visualmente nitidez, márgenes y proporciones.
- Se verificaron las flechas, Pausar/Reproducir, el avance automático y la pausa mientras el control mantiene foco/hover. La imagen deportiva carga correctamente y se muestra completa en celular.
- Auditoría de los 30 archivos: dimensiones coincidentes con el manifiesto, proporciones conservadas, perfil sRGB y ningún archivo ampliado por encima de su original.
- `npm run build`, `npm test` (6 pruebas) y `git diff --check` correctos. Lint sin errores; persiste el aviso previo de PhotoModal. Build conserva el aviso de tamaño del catálogo deportivo existente.
- No se cambiaron rutas, datos deportivos, Cloudinary, selección ni compra por WhatsApp. Se conserva el aislamiento en el worktree y la rama feat/portfolio-v2.

Capturas de la vista inicial, pausadas para facilitar la comparación:

- [1366×768](capturas/portada-corregida-1366x768.jpg)
- [1920×1080](capturas/portada-corregida-1920x1080.jpg)
- [2560×1440](capturas/portada-corregida-2560x1440.jpg)
- [Celular 360×800](capturas/portada-corregida-celular-360x800.jpg)

## Serie «San Marcos, mi mirada» · 4 de octubre de 2026

### Implementación

- Nueva página React/Sass en `/portfolio/san-marcos-mi-mirada`, cargada de forma diferida. Se abrió e inspeccionó `docs/san-marcos/diseno-san-marcos.html` como referencia; no se usa como iframe ni se extraen sus miniaturas para producción.
- Se conservan la distribución editorial, el fondo cálido, las tipografías, la introducción, la fecha y los dos párrafos personales de la muestra. Las fotografías completas mantienen su proporción: apertura panorámica; dos horizontales; Última luz centrada; dos verticales. En celular se apilan en el orden aprobado.
- Correspondencia aplicada: DSC03637 → Pueblo serrano; DSC05590 → Camino al atardecer; DSC08228-Editar → Calles de infancia; **DSC08263 → Última luz**; DSC03503 (2) → Reflejos; DSC00869 → El cielo del pueblo. Ubicación: San Marcos Sierras.
- La muestra conserva IMG_5633 → Las imágenes en papel; IMG_5660 → Compartir la mirada; IMG_5663 → Detenerse a mirar. Se muestra con menor tamaño, fuera del visor de obras.
- Los dos accesos de San Marcos desde categorías y series usan Pueblo serrano y enlazan a la página real. El regreso lleva a `/#portfolio`; navbar y footer existentes siguen disponibles. Las otras series no tienen enlaces a páginas inexistentes.
- Los datos y textos están separados en `src/data/sanMarcos.js`. Un componente pequeño declara imágenes responsive; el visor manual está separado de la presentación y del modal deportivo.
- El visor contiene solo las seis obras, con foto completa, título, ubicación, contador, flechas y cierre. Usa un diálogo nativo, teclado ←/→, recorrido circular de Tab/Shift+Tab y Escape. Bloquea el desplazamiento del fondo y restaura foco y posición de lectura al cerrar. La imagen contenida informa su ancho visible mediante ResizeObserver para que `sizes` tenga en cuenta la proporción y el espacio disponible.
- Consulta general por disponibilidad digital o impresa a pedido: muestra el mensaje antes de abrir WhatsApp con `createWhatsAppLink` y el número existente. No exige correo, no introduce precios ni checkout y no afirma que el mensaje haya sido enviado.
- Se conservan las fotos, alturas, título, controles y reproducción de la portada aprobada en 6b6d208. Se agregó únicamente una protección en su medición para ignorar una notificación pendiente si los elementos ya se desmontaron al cambiar de ruta; en las pruebas apareció ese error y después del ajuste no hubo nuevos errores.

### Imágenes y fuentes locales

- Los seis JPG de obras tienen entre 5103 y 5966 px de ancho en horizontales, y 2657/3183 px en verticales. Las tres fotos de la muestra llegaron como **HEIC** (mismos nombres base que la guía), con 3024×4032 px. Se procesaron esas fuentes; no se sustituyeron por las imágenes incrustadas en el HTML.
- `scripts/generateSanMarcosImages.py` utiliza Pillow y pillow-heif. Genera 51 WebP con calidad 90, remuestreo Lanczos, orientación aplicada, sin recortes ni ampliaciones. Las obras tienen variantes de 640, 960, 1440, 1920, 2560 y hasta 3200 px, limitadas al ancho de cada fuente; la muestra, 320/480/640/960/1440 px. Total aproximado: 14.84 MiB.
- Los JPG tienen perfil sRGB; los HEIC, Display P3 de 8 bits. Se interpretan los perfiles y se convierten a sRGB para la web, incluyendo el perfil de salida. No se aplican nuevas ediciones de exposición, contraste o color.
- Los nombres base y la correspondencia se conservan en `src/data/sanMarcosImages.json`. Los espacios del nombre DSC03503 (2) están codificados en las URLs para que `srcset` sea válido.
- Todas las imágenes declaran `srcset`, `sizes`, ancho y alto. Solo se prioriza la primera obra en la página; las inferiores tienen carga diferida. El visor solicita una variante acorde al ancho contenido y la densidad del dispositivo.
- `docs/san-marcos/fotos/` queda ignorado por Git, tanto JPG como HEIC. Se versionan los WebP de `public/images/portfolio/san-marcos/`. `.tools/` contiene únicamente herramientas locales de conversión y queda ignorado por Git y ESLint.
- Para regenerar, con Pillow y pillow-heif disponibles: `python scripts/generateSanMarcosImages.py`. En este equipo se instalaron en `.tools/image-processing`; se usó esa carpeta en PYTHONPATH. La aplicación no agrega dependencias Python ni HEIC.

### Comprobaciones reales

- Navegador local a **360×800, 768×1024, 1366×768 y 1920×1080**: sin desbordamiento horizontal; obras en el orden correcto, imágenes completas, textos legibles, verticales moderadas en celular y tres fotos de muestra pequeñas. Las nueve imágenes cargaron correctamente; se inspeccionaron las capturas completas de escritorio y celular.
- Visor horizontal y vertical, título Última luz, navegación con botones y flechas del teclado, paso 6→1 y 1→6, Tab/Shift+Tab dentro del diálogo, Escape y cierre por botón. La posición registrada de lectura (scrollY=1364) y el foco en «Ampliar Última luz» se restauraron al cerrar. Tras una espera superior a 6 segundos la obra siguió en 1/6: no tiene reproducción automática.
- Visor adicional a **667×375**: fotografía completa y controles visibles; fin de controles a 349 px y ubicación a 365 px. En 360×800, fin de controles a 760 px. Se comprobaron las variantes de imágenes efectivamente cargadas a DPR 1.
- Categoría y tarjeta de serie llevan a la nueva página. Regreso a `/#portfolio` comprobado (sección alineada al inicio tras finalizar el desplazamiento suave), enlaces a Contacto y Sobre mí, apertura directa y recarga de la ruta.
- Confirmación de consulta, mensaje con nombre de colección y URL codificada hacia el número existente; Escape devuelve el foco al botón. No se abrió la aplicación externa ni se envió un mensaje real.
- Portada aprobada a 1366×768: scrollY=0, título conservado, altura de portada 671 px y fin de controles a 751 px; sin desbordamiento. La hoja de estilos del carrusel y sus fotos no cambiaron.
- Tienda y compatibilidad de `/#eventos` → `/tienda/deportes#eventos`; apertura de DH Pan de Azúcar y Entrenamientos. Se agregó una foto de prueba, persistió tras recarga, se comprobó la confirmación del pedido y se canceló. Se quitó solo la foto de prueba y quedó la selección previa DSC06680.
- Paginación 1→2 de 12, carga de las 16 miniaturas de Cloudinary de la página, modal deportivo y siguiente foto. Apertura/recarga directa de Circuito Molle (Las Pircas) y Tanda 2 (CPRO). Las pruebas de rutas cubren todas las categorías publicadas y la prioridad de `/galeria`.
- `npm run build`, `npm test` (6 pruebas, incluyendo acceso a la nueva ruta) y `git diff --check` correctos. Lint sin errores nuevos: conserva el aviso previo de dependencias de PhotoModal. Build conserva el aviso de tamaño del catálogo deportivo. No se modificaron eventos, precios, contratos de Cloudinary ni lógica de compra/selección deportiva.
- Auditoría de los 51 archivos: dimensiones coincidentes con el manifiesto, proporciones conservadas dentro del redondeo de un píxel, perfil sRGB y ningún archivo ampliado por encima de la fuente. Se verificó la exclusión de originales mediante `git check-ignore`.

### Límites y revisión

- Se verificó en el navegador de escritorio con viewport simulado, a DPR 1; no en un teléfono físico, Safari ni con emulación de DPR 2/3. Las variantes cubren 2× el ancho máximo de 1600 px del visor cuando la fuente lo permite; las verticales tienen su límite original.
- No se probaron envíos reales, pagos ni la aplicación externa de WhatsApp. La Preview de Vercel puede requerir la sesión de Juan para revisar visualmente; la protección existente no se modifica.
- Otras series y la tienda de paisajes continúan pendientes. Esta entrega se mantiene en `feat/portfolio-v2`, sin merge con main ni publicación en Production.
- Acceso local: `http://127.0.0.1:5174/portfolio/san-marcos-mi-mirada` (Vite activo en el worktree). Para iniciar otra sesión: `npm run dev -- --host 127.0.0.1`, usando el puerto que informe Vite.

Capturas:

- [Página completa · 1366×768](capturas/san-marcos-1366x768.jpg)
- [Página completa · 1920×1080](capturas/san-marcos-1920x1080.jpg)
- [Tablet · 768×1024](capturas/san-marcos-tablet-768x1024.jpg)
- [Celular · 360×800](capturas/san-marcos-celular-360x800.jpg)
- [Visor Última luz · 1366×768](capturas/san-marcos-visor-1366x768.jpg)
- [Visor vertical · 360×800](capturas/san-marcos-visor-celular-360x800.jpg)
- [Visor de poca altura · 667×375](capturas/san-marcos-visor-667x375.jpg)

## Serie «Los Cajones de Achala» · 8 de octubre de 2026

### Alcance y conservación del trabajo

- Se continuó desde b887ee6 en el worktree `.worktrees/portfolio-v2`, rama `feat/portfolio-v2`, sin reiniciar la rama ni cambiar su base. Se leyeron IMPLEMENTACION.md y FOTOS.csv y se abrió la referencia interactiva en el navegador local antes de implementar.
- Había un cambio local en `src/pages/SanMarcosSeries.jsx`: eliminación del salto de línea forzado del h1. Se conserva en el worktree y se excluye del commit de Achala. La Preview conserva el título de la entrega aprobada b887ee6; la revisión local incluye el ajuste que ya estaba presente.
- No se cambiaron los estilos, fotos, alturas ni reproducción de la portada. No se modificaron datos deportivos, Cloudinary, selección, precios, modal, paginación ni preparación de pedidos.
- La Cumbrecita y la tienda de paisajes siguen pendientes. No tienen nuevas rutas, checkout ni enlaces a contenido vacío. Paisajes y viajes conserva su categoría general; no se enlaza toda esa categoría a esta única salida.

### Página y componentes

- Ruta `/portfolio/cajones-de-achala`, cargada de forma diferida en React Router, conservando el rewrite de Vercel. La tarjeta antes llamada Pampa de Achala se presenta como Los Cajones de Achala, usa DSC02820 como portada y enlaza a la nueva colección. El carrusel principal conserva su contenido aprobado.
- Se reprodujo la distribución aprobada en React/Sass: dos párrafos junto al título, apertura amplia, par horizontal, par vertical, horizontal centrada, segundo par vertical y horizontal amplia. En el regreso, la fotografía precede al último párrafo; las dos fotos doradas se muestran después y la última lleva «Al final del camino.».
- Se mantiene el texto personal exacto de la guía. No se inventan fechas, medidas ni títulos individuales. La cursiva de «de Achala.» y «el mismo paisaje.» conserva la jerarquía editorial.
- Orden en página y visor: **DSC02820, DSC02395, DSC02427, DSC02568, DSC02569, DSC02780, DSC02824, DSC02882, DSC02887, DSC02966, DSC02984, DSC02988**. Solo estas doce fotografías forman parte de la colección.
- `src/data/achala.js` separa texto, correspondencia y mensaje de consulta de la presentación. `SeriesPhoto` comparte la fotografía responsive y las acciones de ampliación; `SeriesInquiry` comparte la confirmación existente de San Marcos. Su extracción conserva el contenido y la estructura visual de San Marcos, con el nuevo enlace hacia Achala.
- Se reutiliza `SeriesViewer` con un título de colección opcional. Achala muestra Los Cajones de Achala; San Marcos conserva el título individual de cada obra. Continúan la navegación manual, contador, teclado, foco, bloqueo del fondo y regreso a la lectura.
- WhatsApp reutiliza el número y `createWhatsAppLink`, muestra el mensaje para revisar y prepara una consulta identificada como Los Cajones de Achala. No exige correo ni promete envío confirmado, disponibilidad, precios o compra automática.
- «Seguir explorando» enlaza a San Marcos; La Cumbrecita muestra el estado Serie en preparación sin enlace. Los dos interiores enlazan entre sí y mantienen el regreso a `/#portfolio`.
- El HTML permanece como documentación de referencia. No se incrusta mediante iframe ni se incorporan sus miniaturas o controles Escritorio/Celular a la aplicación.

### Fuentes, color y recursos responsive

- Se verificaron los doce nombres y su orden en FOTOS.csv, la existencia de todos los JPG y su lectura íntegra antes de generar recursos. No faltó ninguna fuente. Las horizontales tienen entre 5477 y 6000 px de ancho; las verticales entre 3273 y 3375 px.
- `docs/achala/fotos/originales/` se agregó a `.gitignore` antes de cualquier git add. `git check-ignore` confirmó los doce JPG; también queda ignorado el LEEME de esa carpeta. Los originales no se modificaron: sus hashes SHA-256 coincidieron antes y después del procesamiento.
- `scripts/generateAchalaImages.py` valida primero el CSV y todos los archivos, e informa por nombre las fuentes faltantes. Requiere Pillow; se ejecuta con `python scripts/generateAchalaImages.py`. No usa ni extrae imágenes del HTML.
- Se generan 72 WebP en `public/images/portfolio/achala`, a 640/960/1440/1920/2560/3200 px de ancho, calidad 90 y remuestreo Lanczos. Sin recortes, ampliación ni edición artística adicional. Total almacenado: aproximadamente **60.50 MiB**, por las doce imágenes y sus seis variantes; el visitante descarga las variantes elegidas por el navegador, no ese conjunto completo.
- Todas las fuentes tienen perfil Rec. 2020. Se interpreta el perfil original, se convierte a sRGB para la web y se incluye el perfil de salida, siguiendo el tratamiento de la portada. Se aplica la orientación y se conserva la proporción.
- `src/data/achalaImages.json` registra nombre de fuente, dimensiones y variantes. Cada fotografía declara width/height, srcset y sizes según su distribución. Solo se prioriza la apertura en la página; las inferiores cargan de forma diferida. El visor sigue midiendo el ancho de la fotografía contenida para ajustar sizes.
- Auditoría de los 72 WebP: dimensiones coincidentes con el manifiesto, perfil sRGB, proporción conservada dentro del redondeo de un píxel y resolución nunca superior a la fuente. Se inspeccionaron visualmente las doce correspondencias y el cierre en las capturas completas.

### Verificaciones realizadas

- Navegador local a **360×800, 768×1024, 1366×768 y 1920×1080**: sin desbordamiento horizontal; todas las fotografías completas; orden correcto; texto inicial junto al título en escritorio y apilado en celular; pares separados en celular; verticales de 280 px; foto del regreso antes del texto. Se cargaron las doce imágenes y se revisaron capturas completas de escritorio y celular.
- Visor a 1366×768 y 360×800, y prueba adicional a **667×375**: foto completa, cierre y controles visibles. Fin de los controles a 760 px en celular y 349 px con poca altura; ubicación a 784 y 365 px respectivamente.
- Recorrido manual de las doce fotografías en el visor, correspondencia de cada fuente y pasos 12→1 / 1→12. Flechas de teclado, cierre por botón y Escape, Tab/Shift+Tab dentro del diálogo. Apertura por Enter desde el botón de DSC02966: foco y scrollY=4380 exactamente iguales antes de abrir y después de cerrar.
- Vista previa de la consulta, nombre de colección, caracteres y URL codificados al número existente; Escape devuelve el foco al botón. Se comprobó el mensaje de ambas series. No se abrió WhatsApp ni se enviaron mensajes reales.
- Portada→Achala, Achala→San Marcos, San Marcos→Achala, regreso a `/#portfolio` y enlaces a Contacto/Sobre mí. Apertura y recarga directa de la nueva ruta. La sección portfolio quedó alineada al inicio tras finalizar el desplazamiento suave.
- Portada aprobada a 1366×768: h1 conservado, scrollY=0, fin de controles a 751 px y ausencia de desbordamiento. Se verificó que Paisajes y viajes no enlaza a Achala. San Marcos conserva las seis obras, Última luz como obra 4/6, siguiente Reflejos 5/6, visor y confirmación existentes. Sus imágenes, datos y Sass aprobado no cambiaron.
- Tienda: alias `/#eventos` redirige a `/tienda/deportes#eventos`; apertura de evento DH y Entrenamientos; selección adicional DSC06681 persistió tras recarga; pedido de dos fotos mostró el total existente de $14.000 y se canceló. Se quitó solo la selección de prueba y se restauró la previa DSC06680.
- Paginación 1→2 de 12; las 16 miniaturas de la página cargaron desde Cloudinary. Modal deportivo DSC06733→DSC06737 y cierre. Apertura y recarga directa de Circuito Molle y Tanda 2, de Las Pircas y CPRO. Las pruebas de rutas conservan todas las categorías publicadas, ayuda y prioridad de `/galeria` e incluyen la nueva ruta de Achala.
- Build correcto con las dependencias existentes; el entorno limitado no pudo resolver Sass inicialmente y se repitió con acceso a esas dependencias, sin agregar paquetes. Lint sin errores nuevos (aviso previo de PhotoModal); seis pruebas existentes correctas; `git diff --check` correcto. El build conserva el aviso de tamaño del catálogo deportivo. Consola local sin errores durante la revisión funcional.

### Límites y acceso

- Pruebas con viewport simulado en el navegador de escritorio, a DPR 1. La herramienta permite cambiar ancho/alto y no ofrece emulación de DPR 2/3; no se probó un teléfono físico ni Safari. Los archivos de 3200 px cubren 2× el ancho máximo de 1600 px del visor; esta cobertura se verificó por dimensiones, no mediante emulación de alta densidad.
- No se probaron envíos reales, pagos ni la aplicación externa de WhatsApp. La Preview mantiene la protección de Vercel y puede requerir iniciar sesión; esa protección no se cambia.
- Entrega en `feat/portfolio-v2`, sin merge con main ni publicación en Production. Se conserva el ajuste local previo del título de San Marcos sin incluirlo en el commit de esta entrega.
- Acceso local: `http://127.0.0.1:5174/portfolio/cajones-de-achala` (Vite activo en el worktree). Para reiniciar: `npm run dev -- --host 127.0.0.1 --port 5174`.

Capturas:

- [Página completa · 1366×768](capturas/achala-1366x768.jpg)
- [Página completa · 1920×1080](capturas/achala-1920x1080.jpg)
- [Tablet · 768×1024](capturas/achala-tablet-768x1024.jpg)
- [Celular · 360×800](capturas/achala-celular-360x800.jpg)
- [Visor · 1366×768](capturas/achala-visor-1366x768.jpg)
- [Visor vertical · 360×800](capturas/achala-visor-celular-360x800.jpg)
- [Visor de poca altura · 667×375](capturas/achala-visor-667x375.jpg)
- [Consulta preparada · 1366×768](capturas/achala-consulta-1366x768.jpg)

## Distribución horizontal y acceso desde fotografías · 8 de octubre de 2026

### Cambios

- Trabajo realizado sobre `feat/portfolio-v2`, desde 2e38a59, en el worktree existente. Se conserva el cambio local previo del h1 de San Marcos (sin salto forzado) y se excluye del commit de esta entrega. Los originales de ambas series y de la portada continúan ignorados; no se agregan fuentes al repositorio.
- Se unificó el ancho mediante `--content-width`: 90 % del espacio disponible, con máximo de 2200 px; en tablet se dejan 24 px a cada lado y en celular 20 px (22 px en las series). Navbar, footer, inicio, contacto, tienda, eventos, galerías, ayuda y barra de selección siguen esta distribución.
- Los interiores dejan el límite útil anterior de 984 px. Las horizontales destacadas ocupan el contenedor; las intermedias usan 85 % y hasta 1760 px. Los pares horizontales distribuyen el ancho en dos columnas, con 28 px de separación. Los pares verticales usan 75 %, con topes de 1320/1280 px; mantienen 280 px en celular. El regreso de Achala alcanza 440 px en escritorio y conserva 280 px en celular. Las fotos de la muestra de San Marcos llegan a 960 px en conjunto, conservando su papel secundario.
- Los relatos mantienen límites de lectura independientes de las fotografías (460/560 px), el formulario hasta 720 px y los textos deportivos entre 48/65ch. No se cambian títulos, relatos, orden, categorías, rutas, precios ni datos de eventos.
- La portada conserva su altura adaptada al navegador, título, nombre, controles centrados, avance cada seis segundos y pausas. Su fotografía sigue contenida por ancho y altura: no se recorta para llenar artificialmente el nuevo espacio horizontal.
- Se eliminó únicamente el botón visible «Ampliar» de `SeriesPhoto`. La imagen conserva su botón, etiqueta accesible, clic/toque, teclado y foco visible. Los pies de San Marcos y los dos pies de Achala permanecen. Las fotografías sin pie ya no generan un figcaption vacío ni el espacio del botón retirado.
- Las imágenes de categorías, portadas deportivas y miniaturas conservan la fotografía completa. Se retiraron los recortes/zoom visuales de las tarjetas; las alturas responden a la proporción de la foto. La imagen de la galería deportiva es ahora un botón accesible y la selección tiene nombre y estado accesibles.
- El modal deportivo conserva navegación, sincronización con la paginación y Escape; se amplía su límite horizontal a 2200 px. Se separó el bloqueo del fondo de la navegación y se agregó recuperación de foco/posición, Tab/Shift+Tab entre controles y una imagen de retorno cuando el cambio de página reemplaza el botón original. `useCallback` mantiene las dependencias de los manejadores explícitas; lint ya no muestra la advertencia anterior de este componente.

### Recursos y resolución

- `src/data/photoSizes.js` centraliza los tamaños de las series y tarjetas según los límites reales. Portada y visor de series siguen calculando el tamaño contenido a partir del marco medido, incluyendo el límite por altura.
- `scripts/extendPortfolioImages.py` lee los JPG originales ignorados y agrega siete WebP a 4400 px: DSC03637 y DSC08263 de San Marcos; DSC02820, DSC02780, DSC02887, DSC02984 y DSC02988 de Achala. Se ejecuta después de los generadores base: `python scripts/extendPortfolioImages.py`. Mantiene los recursos previos; al regenerar desde cero hay que ejecutar este complemento nuevamente.
- Las nuevas variantes cubren 2× los 2200 px visibles. Se conserva orientación, proporción y el tratamiento de color de las entregas aprobadas: perfil original interpretado, conversión a sRGB, calidad 90, Lanczos, sin edición artística ni ampliación. Se comprobaron dimensiones, perfil y proporción de los siete archivos, y que todos son menores que sus fuentes. Añaden aproximadamente 14.19 MiB almacenados; solo se descarga la variante elegida por el navegador.
- Las variantes anteriores bastan para pares, verticales y portada limitada por altura. El hero deportivo existente es de 5624×3749 y permite la nueva anchura sin inventar resolución.
- `cloudinaryImageVariants` adapta únicamente las URLs de entrega conocidas del proyecto, sin cambiar sus recursos, versión, marcas de agua ni manifiestos. Entrega srcset/sizes para tarjetas, galerías y modal, con formato/calidad automáticos y `c_limit`, que preserva proporciones y evita aumentar por encima del recurso remoto. Las URLs locales o con otras transformaciones mantienen su entrega existente. La consulta de DSC06680 con límite 4400 devolvió 4231×2821: se verificó que el servicio respetó la resolución de su recurso.

### Comprobaciones reales

- Se revisaron siete páginas a **360×800, 768×1024, 1366×768, 1920×1080 y 2560×1440**: inicio/contacto, San Marcos, Achala, tienda deportiva, evento DH, galería Entrenamientos y Cómo comprar. Las 35 combinaciones no mostraron desbordamiento horizontal ni acciones visibles «Ampliar». Las proporciones de las seis obras y doce fotos coincidieron con las fuentes en todos los tamaños. Mediciones guardadas en `capturas/ancho-comprobaciones.json`.
- Anchos observados en las series: alrededor de 1216 px en 1366, 1715 px en 1920 y 2200 px en 2560, frente a 984 px antes. En 2560 los pares horizontales llegan a 1086 px por foto; verticales de San Marcos a 636 px y de Achala a 618 px. Relatos y formulario conservan los límites mencionados.
- Se recorrieron las imágenes para activar la carga diferida antes de guardar las capturas completas. Cargaron nueve imágenes de San Marcos, doce de Achala, las portadas deportivas y las 16 miniaturas de la galería. Se revisaron visualmente las capturas completas de ambas series, inicio y galería. Se corrigió un ancho colapsado en la foto del regreso de Achala en celular; la comprobación final registró 280 px y proporción completa.
- Portada al entrar en escritorio, scrollY=0: título, foto y controles visibles; fin de controles a 751 px en 1366×768, 1063 px en 1920×1080 y 1080 px en 2560×1440. Se observó el avance automático, el avance manual 4→1 y la pausa mantuvo 1/4 durante las otras comprobaciones.
- San Marcos: apertura por Enter en la imagen de Última luz, título y contador 4/6; siguiente por teclado a Reflejos 5/6; Shift+Tab vuelve al último control; Escape. Antes/después de abrir y cerrar, scrollY=1564 y foco en la misma imagen. Achala: paso 1→12 con flecha izquierda y 12→1 con derecha; visor móvil con controles hasta 760 px, sin desbordamiento. Se conserva la navegación manual.
- Consultas de ambas series y contacto: mensajes preparados, nombre de colección, caracteres codificados, número existente y confirmación antes de WhatsApp. No se abrió WhatsApp ni se envió un mensaje.
- Tienda: se agregó DSC06681 a la selección previa DSC06680; tras recarga persistieron dos fotos y $14.000. Se abrió la confirmación y se canceló. Se quitó solo la foto de prueba, restaurando la selección previa y $7.000. La lógica de precios, pedido y persistencia no se modifica.
- Paginación 1→2 de 12, con 16 miniaturas cargadas. Modal por Enter en DSC06733, siguiente DSC06737, Shift+Tab y Escape; scrollY=128 y foco iguales al regresar. Modal desde DSC06731→DSC06733 actualiza página 1→2, y al cerrar el foco vuelve a una imagen de la nueva página. Modal móvil con cierre a 58 px y controles hasta 776 px, fotografía completa.
- Enlaces San Marcos↔Achala; compatibilidad `/#eventos`→`/tienda/deportes#eventos`; apertura y recarga de Circuito Molle y Tanda 2. Las pruebas conservan los parámetros de todas las categorías publicadas y la prioridad de `/galeria`.
- `npm run build` correcto, `npm run lint` sin errores ni advertencias, `npm test` con ocho pruebas correctas (incluidas dos para proteger las URLs/transformaciones deportivas) y `git diff --check` correcto. La consola local no registró errores. Permanece el aviso de build por el tamaño del catálogo deportivo.
- Los SHA-256 de los doce originales de Achala coinciden con los registrados previamente. `git check-ignore` y revisión del índice confirman que los originales no se versionan. No se cambian selección/compra, catálogos, contratos de eventos, configuración de despliegue ni rutas.

### Límites y acceso

- Comprobación visual en el navegador de escritorio, con viewport simulado y DPR 1. La cobertura 2× se verificó por dimensiones y srcset, sin emulación DPR 2/3, teléfono físico ni Safari. La entrega deportiva conserva los recursos con marca de agua; si una fuente remota tiene menos resolución, c_limit conserva ese límite.
- No se hicieron envíos reales ni pagos. La Preview mantiene la protección de Vercel. Trabajo exclusivo en `feat/portfolio-v2`, sin merge ni publicación en Production. La Cumbrecita y la tienda de paisajes siguen pendientes.
- Acceso local: `http://127.0.0.1:5174/`. Para iniciar el worktree: `npm run dev -- --host 127.0.0.1 --port 5174`.

Capturas representativas (también se guardaron las vistas completas de ayuda, evento y galería):

- [Portada · 1366×768](capturas/ancho-portada-1366x768.jpg)
- [Inicio · 2560×1440](capturas/ancho-inicio-2560x1440.jpg)
- [San Marcos · 1920×1080](capturas/ancho-san-marcos-1920x1080.jpg)
- [Pares de San Marcos · 1920×1080](capturas/ancho-san-marcos-pares-1920x1080.jpg)
- [San Marcos · celular](capturas/ancho-san-marcos-360x800.jpg)
- [Achala · 1920×1080](capturas/ancho-achala-1920x1080.jpg)
- [Achala · 2560×1440](capturas/ancho-achala-2560x1440.jpg)
- [Achala · celular](capturas/ancho-achala-360x800.jpg)
- [Tienda · 1920×1080](capturas/ancho-tienda-1920x1080.jpg)
- [Galería · 1920×1080](capturas/ancho-galeria-1920x1080.jpg)
- [Galería · celular](capturas/ancho-galeria-360x800.jpg)
- [Visor Achala · celular](capturas/ancho-visor-achala-360x800.jpg)
- [Modal deportivo · celular](capturas/ancho-modal-deportivo-360x800.jpg)
