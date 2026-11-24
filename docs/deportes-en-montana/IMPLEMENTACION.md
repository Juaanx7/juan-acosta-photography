# Portfolio · Deportes en montaña

Diseño aprobado por Juan el 30/10/2026. Integrar la galería en la web existente. diseno-deportes-en-montana.html es referencia visual, no una página para incrustar ni código de producción. No usar sus imágenes base64 de baja resolución.

## Trabajo y entrega

Leer las instrucciones del repositorio, revisar git status y preservar cambios locales. Identificar la rama actual de producción y crear desde ella una rama local y remota feat/portfolio-deportes-montana. Si ya existe, revisar antes de reutilizarla. Trabajar en worktree si corresponde. No fusionar a main ni publicar en producción: Juan revisará y hará el merge manualmente. Reutilizar React, Router, Sass, componentes y flujo de imágenes existentes. Subir la rama y entregar PR borrador/enlace de Preview si las integraciones disponibles lo permiten, sin instalar conectores para hacerlo.

## Integración

Ruta propuesta /portfolio/deportes-en-montana. Si ya hay ruta o contrato equivalente, mantener compatibilidad y documentarlo. Activar la categoría Deportes en montaña del home con ese destino. Volver al portfolio debe ir a /#portfolio; usar las rutas reales para Sobre mí, Contacto y tienda. Mantener navbar hamburguesa móvil y el arreglo táctil del submenú Tienda. Conservar portada, series, Paisajes y viajes y tienda deportiva salvo enlaces necesarios.

El boceto usa enlaces locales y detalles desplegables para demostrar acciones; no copiar esos destinos ni acordeones a producción.

## Cabecera editorial

Antetítulo: ACCIÓN · PERSONAS · ENTORNO

Título: Deportes en montaña.

Introducción debajo del título, alineada a la izquierda:

La intensidad de una bajada, el esfuerzo de cada subida y los momentos que se comparten en el camino. Mi mirada sobre el deporte y los paisajes donde sucede.

Usar la tipografía y colores de la web; mantener el tratamiento serif y cursiva aprobado. No forzar saltos de línea; permitir que los textos ajusten naturalmente. Introducción de ancho legible, galería ancha y fluida, aproximadamente 90% del viewport siguiendo los límites actuales del sitio.

## Orden y distribución

Usar las 20 fotos exactas de FOTOS.csv, en ese orden. Cada foto muestra debajo el nombre de la carrera, sin ubicación o año inventados. Las descripciones del CSV son textos alternativos propuestos, no títulos de obra.

Filas de escritorio:

1. DSC06918 sola y ancha: apertura.
2. DSC04908 + DSC04741, dos horizontales.
3. DSC07076 + DSC03832, dos verticales; fila al 78% del ancho de galería.
4. DSC06683 + DSC04471, dos horizontales.
5. DSC07968 sola y ancha: cruce del río en Quilpo.
6. DSC08137 + DSC09314, dos verticales; fila al 78%.
7. DSC08579 + DSC04994, dos verticales; fila al 78%.
8. DSC06797 + DSC04326, dos horizontales.
9. DSC02996 + DSC08126, dos horizontales.
10. DSC08226 + DSC05303, dos verticales; fila al 78%.
11. DSC05143 horizontal a la izquierda + DSC06882 vertical a la derecha; columnas aproximadas 1.75:1, alineadas al centro vertical.

En escritorio mantener separación moderada entre fotos y mayor entre filas, como referencia 28 y 44 px adaptados al sistema actual. Sin recortes ni deformación: fotos completas, width 100%, height auto. No igualar alturas mediante object-fit: cover.

En celular todas las filas pasan a una columna con el mismo orden y ancho completo disponible; quitar el 78% de las filas de verticales. Sin filtros, paginación, autoplay ni texto visible «Ampliar».

## Visor

Reutilizar el visor manual accesible del portfolio: abrir la foto tocada o activada por teclado y recorrer las 20 en el orden del CSV. Mostrar nombre de carrera y contador. Escape, flechas, cierre visible, foco contenido, retorno al disparador y conservación de la posición de lectura. El visor de esta galería no tiene selección de compra ni precio.

## Cierre aprobado

Antetítulo: FOTOGRAFÍA DEPORTIVA

Título: Nos encontramos en el próximo circuito.

Texto: Coberturas de carreras, sesiones con corredores y proyectos al aire libre.

Acción: Consultar por una cobertura.

En producción esa acción abre el formulario real de contacto existente o navega a /#contacto, conservando si es viable el motivo «Cobertura deportiva». Reutilizar la preparación y confirmación de WhatsApp; no abrir un simple acordeón como en la demostración. Si el formulario existente no admite motivo precargado, basta enlazar correctamente a contacto sin rediseñarlo. No cambiar el número ni enviar mensajes de prueba reales.

Debajo, bloque secundario discreto:

Título: ¿Buscás tus fotos de una carrera?

Texto: Encontrá las galerías completas en la tienda deportiva.

Acción: Ver fotos de carreras → /tienda/deportes, comprobando la ruta real. Debe navegar, no mostrar la nota explicativa del boceto. La venta permanece en su sección propia.

## Fuentes y optimización

Juan copiará los 20 JPG originales a docs/deportes-en-montana/fotos/originales/. FOTOS.csv enumera los nombres y carreras exactos. Si se usa worktree, ubicar las fuentes en el checkout original o copiarlas localmente al worktree: los archivos ignorados no viajan con Git. Si falta una foto, informar su nombre antes de sustituirla.

Las copias de Quilpo usadas en la referencia tienen lado mayor de 2048 px. Juan debe aportar sus archivos de mayor calidad si los conserva. Si 2048 es la mayor fuente disponible, respetarla y no ampliarla artificialmente; documentar el límite en alta densidad. No usar miniaturas del HTML, capturas ni fotos con marca de agua como fuentes.

Reutilizar el generador de variantes WebP responsive existente, con srcset/sizes acordes al ancho de cada fila y pantallas de alta densidad. Sin ampliar más allá de la fuente, recortar ni reeditar color. Orientación EXIF correcta, dimensiones definidas para evitar saltos, prioridad de carga en apertura y lazy loading en el resto. Reutilizar variantes previas solo si son del mismo original, sin marcas y con resolución adecuada. Mantener originales ignorados por Git y publicar únicamente variantes necesarias.

## Comprobaciones

Build, lint y pruebas relevantes existentes. Revisar 360/390/768/1366/1920 px, incluyendo poca altura y DPR 2 si está disponible. Validar imágenes completas, orden, nombres, ausencia de desbordamientos, legibilidad y tamaños descargados. Revisar ruta directa y recarga, acceso desde home, retorno al portfolio, contacto y enlace a tienda. Probar visor con ratón, toque emulado y teclado; Escape, foco y scroll. Comprobar navbar móvil y submenú Tienda. Hacer regresión proporcionada de galería deportiva y selección persistente sin enviar WhatsApp real.

Entregar REVISION.md con cambios, rama/commit, validaciones y límites reales. Distinguir emulación de dispositivos físicos; no afirmar pruebas no realizadas. Registrar Preview si se generó. No hacer merge ni publicación en producción.
