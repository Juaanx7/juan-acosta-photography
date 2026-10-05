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

- Las galerías interiores de otras series, fotos definitivas de categorías secundarias, biografía ampliada y tienda de paisajes quedan pendientes. San Marcos se implementó en la entrega documentada más abajo. No hay checkout ni enlaces que simulen contenido terminado.
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
