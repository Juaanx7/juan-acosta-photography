# Paisajes y viajes · implementación aprobada

Implementar en el proyecto existente Juan Acosta Photography. El boceto diseno-paisajes-y-viajes.html es una referencia visual de la galería aprobada, no código de producción. No insertar su iframe, sus imágenes base64 ni su navegación de demostración en la app.

## Alcance y Git

Leer AGENTS.md e instrucciones del repositorio, revisar estado local y remoto y preservar cambios ajenos. Partir de la rama que actualmente alimenta producción, confirmando la configuración real; crear rama local y remota feat/portfolio-paisajes-viajes. Si ya existe, comprobar su contenido antes de reutilizarla. No fusionar ni desplegar a producción: Juan revisa y hace el merge manualmente en GitHub. Puede generar la Preview habitual mediante la integración existente.

Reutilizar React, Router, Sass, navbar, footer, datos y visor accesible existentes. No instalar dependencias sin una necesidad concreta. Mantener las rutas deportivas, Cloudinary, selección persistente, compra por WhatsApp y series actuales.

## Ruta y accesos

Usar /portfolio/paisajes-y-viajes, salvo que el proyecto ya tenga una ruta equivalente: priorizar compatibilidad y documentar la elección. Activar la categoría Paisajes y viajes del home y su acceso desde Portfolio. Volver al portfolio debe llevar a /#portfolio desde el interior. Sobre mí y Contacto deben apuntar a sus secciones reales del home. Reutilizar navbar móvil hamburguesa y Tienda con la corrección táctil de producción.

## Introducción

Antetítulo: UNA SELECCIÓN DE MI TRABAJO

Título: Paisajes y viajes.

Texto debajo del título, alineado a la izquierda:

Salir a explorar, detenerme a mirar y descubrir cómo la luz transforma cada lugar. Una selección de paisajes, caminos y cielos que fui encontrando con mi cámara.

El título puede usar el tratamiento serif/cursiva existente. No forzar saltos de línea con br, bloques o anchos en caracteres; permitir ajuste natural. Mantener texto legible y de ancho moderado aunque las imágenes ocupen un ancho mayor.

## Galería y orden

20 fotos en el orden exacto de FOTOS.csv. Filas de escritorio:

1. DSC08585 sola, ancha, apertura.
2. DSC00793 + DSC06286.
3. DSC02826 + DSC02934.
4. DSC06392 sola, ancha.
5. DSC06547 vertical izquierda + DSC06484-Editar horizontal derecha, proporción aproximada 1:1.8 y alineación vertical centrada.
6. DSC06023 + DSC06975.
7. DSC07567 sola, ancha.
8. DSC03691 + DSC06836.
9. DSC01960 + DSC02988.
10. DSC05652 sola, ancha.
11. DSC07903 + DSC08261.
12. DSC00888 + DSC06005, dos verticales para cerrar; fila algo más contenida, aproximadamente 76% del ancho de la galería.

Ancho fluido cercano al 90% de pantalla, siguiendo los tamaños y límites aprobados actualmente en la web. No volver a una columna central estrecha. Separaciones moderadas entre imágenes y más aire entre filas, siguiendo el boceto y los tokens existentes. No forzar igual altura a costa de recortar; respetar proporciones originales, ancho 100% y alto automático. Mantener todas las fotos completas, sin object-fit: cover ni deformación.

En móvil, todas las filas pasan a una sola columna en el mismo orden; las verticales nocturnas también usan el ancho disponible. No aplicar el ancho 76% de escritorio en móvil. Sin filtros, paginación, autoplay de esta galería ni rótulos visibles «Ampliar».

Debajo de cada imagen, ubicación discreta según FOTOS.csv. No superponer texto ni inventar títulos, fechas, coordenadas o localidades adicionales. Usar Cerro La Banderita sin agregar municipio: no se ha validado la localidad. Las descripciones de FOTOS.csv son propuestas de texto alternativo, no títulos de obra.

## Visor

Reutilizar el visor manual del portfolio. Click, toque o activación por teclado abre la foto correspondiente y permite recorrer las 20 en el orden definido. Mostrar ubicación y contador. Conservar Escape, flechas, cierre accesible, contención del foco, devolución del foco al disparador y posición de lectura al cerrar. No añadir controles de compra en esta entrega.

## Cierre y series relacionadas

Antetítulo: SEGUIR EXPLORANDO

Título: Historias detrás de las fotos.

Tres accesos: Los Cajones de Achala; La Cumbrecita; San Marcos, mi mirada. Enlazar a las rutas reales implementadas, comprobándolas en el proyecto, sin inventar slugs. En escritorio tres columnas, en móvil una. El boceto usa details para demostrar el contenido: en producción deben ser enlaces reales a las series, no acordeones. Se puede reutilizar el componente existente de series manteniendo una presentación discreta.

## Imágenes originales

Fuentes: docs/paisajes-y-viajes/fotos/originales/. Juan copiará allí los 20 JPG exactos de FOTOS.csv. Si el trabajo se hace en worktree, resolver las fuentes en el checkout original o copiarlas localmente al worktree; no asumir que archivos ignorados aparecen por Git. Si falta una fuente, informar cuál antes de sustituirla. No usar capturas ni imágenes embebidas del boceto.

Generar WebP y srcset/sizes con el flujo existente, adecuados para fotos anchas en escritorio y pantallas de alta densidad. Sin ampliar por encima del original, recortar, modificar color o nitidez creativamente. Reutilizar variantes ya presentes solo si corresponden exactamente al mismo original y calidad requerida; DSC02988 ya puede existir en Achala. Los originales siguen ignorados en Git. Publicar solo variantes optimizadas y los datos necesarios. Cargar con prioridad la apertura y lazy loading las restantes; definir dimensiones para evitar saltos.

## Validación y entrega

Ejecutar build, lint y pruebas existentes relevantes. Revisar 360, 390, 768, 1366 y 1920 px, incluyendo monitor alto y bajo. Verificar que no hay desbordamiento, recorte ni texto truncado; comprobar srcset en DPR 1 y 2 si está disponible. Comprobar apertura y recarga directa de la nueva ruta, accesos del home y a las tres series, los 20 nombres y ubicaciones, orden móvil, teclado y foco del visor, navbar hamburguesa y Tienda táctil. Realizar comprobaciones proporcionadas de regresión en la tienda sin enviar mensajes reales.

No modificar la portada, las series actuales o Sobre mí salvo los enlaces necesarios. Reportar límites de validación con claridad; no afirmar haber probado móviles físicos o Safari real si solo se emularon. Guardar informe REVISION.md con cambios, comprobaciones, capturas si se generan, rama y commit. Subir la rama, abrir PR borrador si la integración disponible lo permite y proporcionar enlace para revisión; sin merge ni publicación en producción.
