# Eventos y música · Implementación aprobada

## Objetivo

Integrar la galería de portfolio «Eventos y música» en la web Juan Acosta Photography, siguiendo el boceto aprobado y las convenciones actuales del repositorio React/Vite/Sass. Es una selección de coberturas para mostrar trabajo y experiencia. No es un catálogo de venta ni una nueva serie de viaje.

## Primero: entorno y Git

1. Leer AGENTS.md y las instrucciones vigentes del repositorio. Revisar estado de Git y estructura actual antes de editar.
2. Trabajar en una rama nueva `feat/portfolio-eventos-musica` desde la versión actual de `origin/main`, comprobando antes qué commit corresponde a producción. No utilizar como base los antiguos commits de portfolio-v2 de la conversación.
3. Preservar cualquier trabajo local ajeno. Si hace falta, crear un worktree aislado y copiar allí este paquete y los originales de esta entrega.
4. Implementar, comprobar, hacer commit y push de la rama. Crear un PR borrador si se dispone de acceso. No fusionar a main ni publicar en producción: Juan revisará y hará el merge manualmente.
5. Si hay Preview automática disponible, comprobarla. Si está protegida o no se genera, informar el límite; no es necesario instalar o conectar servicios para completar la implementación local.

## Archivos de referencia

- `referencias/diseno-aprobado.fragment.html`: fuente exacta del boceto aprobado, con imágenes pequeñas incrustadas y visor funcional. Su diseño de galería, orden, textos y epígrafes son la referencia visual. No copiar el HTML completo como aplicación de producción.
- `galeria.json`: 26 fotos ordenadas, epígrafes, textos alternativos de referencia y agrupación por filas. No contiene imágenes ni enlaces temporales de descarga.
- `FOTOS.md` y `fotos.csv`: listado por carpeta de origen, enlaces de Drive y orden de aparición.
- `fotos/originales/`: Juan colocará aquí las 26 imágenes originales con sus nombres exactos. El paquete no incluye los originales.

Antes de generar imágenes, comprobar que estén presentes los 26 archivos y que abran completos. Informar archivos faltantes o dañados con su nombre exacto. No sustituirlos silenciosamente por miniaturas del boceto.

## Integración

- Reutilizar la arquitectura de las galerías ya implementadas de «Paisajes y viajes» y «Deportes en montaña», sus controles y el sistema de imágenes del proyecto.
- Usar `/portfolio/eventos-y-musica` si no hay ya una ruta equivalente establecida; conservar la ruta existente si corresponde. Enlazar desde la tarjeta/categoría actual destinada a eventos, música, festivales o recitales. Evitar una categoría duplicada.
- Usar el navbar, menú hamburguesa, footer y sistema de contacto reales de la web. La navegación del boceto es una representación: sus anclas de demostración y el desplegable de contacto no son el comportamiento final.
- Mantener la portada y las demás galerías aprobadas. Preservar la tienda y URLs deportivas, el menú táctil corregido, selección persistente, Cloudinary y los pedidos por WhatsApp.

## Encabezado y textos

Volver al portfolio mediante el patrón actual de la web.

Antetítulo: `ARTISTAS · ENCUENTROS · EMOCIONES`

Título: `Eventos y música.`

Introducción: `La energía del escenario, la emoción del público y los momentos que se comparten alrededor de la música. Fotografías para volver a sentir lo que se vivió.`

Título encima del texto, sin texto a su lado. Respetar el estilo tipográfico del sitio y el énfasis en «música» de la referencia. Evitar saltos de línea manuales y restricciones que corten títulos cuando queda espacio disponible.

## Composición de la galería

El boceto final tiene 26 fotografías. Mantener todas, su orden y las filas de `galeria.json`.

- Contenido ancho y fluido, aprovechando la pantalla como en las galerías actuales. La referencia usa 90% del ancho disponible.
- Filas alineadas en sus bordes izquierdo y derecho. Dentro de cada fila, imágenes con la misma altura visible y anchos proporcionales a su relación de aspecto. Evitar un mosaico de imágenes sueltas con espacios vacíos desiguales.
- Apertura y cierre con una sola foto a todo el ancho. Filas intermedias de dos o tres fotos según el manifiesto.
- Sin recortar, deformar o ampliar artificialmente las imágenes. Calcular proporciones desde los originales ya orientados mediante EXIF; las dimensiones del manifiesto son de las miniaturas de referencia, no las dimensiones maestras.
- Referencia de separación: 20 px entre columnas, 28 px entre filas y 10 px hasta el epígrafe. Adaptar a los tokens del proyecto manteniendo ese aspecto.
- En móvil, una fotografía completa por fila, en el mismo orden, con espacio regular; la referencia cambia a una columna a 600 px. Resolver tablet sin imágenes demasiado pequeñas, sin desbordes ni textos superpuestos.
- No mostrar «Ampliar» debajo de las fotos. Cada imagen es un control accesible que abre el visor.

## Epígrafes y nombres definitivos

Usar el formato `Artista · Evento` cuando el artista esté identificado; solo el evento cuando no se conozca. No inventar nombres para las otras actuaciones o para el público.

Nombres aprobados: **Valentina Márquez**, **Dosfolk**, **Aníbal y la otra opción**, **Lázaro Caballero**, **Raly Barrionuevo**, **José Luis Aguirre**.

El evento será **Festival de la Miel** o **La Pirámide**, según cada foto en `galeria.json`. No rotular como Festival de la Miel las cuatro fotografías tomadas en La Pirámide. No presentar a los artistas como clientes, patrocinadores o personas que avalan a Juan si eso no está acreditado. No añadir avisos legales a la interfaz por esta entrega.

## Visor y accesibilidad

Reutilizar el visor accesible existente. Navegación manual anterior/siguiente, contador, epígrafe, cierre, flechas del teclado y Escape. Contener el foco mientras está abierto, devolverlo a la foto al cerrar y conservar la posición de lectura. En móvil, controles visibles y cómodos de tocar, incluso con poca altura. Mantener fotografías completas y textos alternativos descriptivos revisados contra los originales. Sin reproducción automática.

## Imágenes y rendimiento

- Generar variantes WebP desde los originales con el proceso actual del repositorio. Si no existe un proceso reusable, crear uno pequeño y reproducible sin añadir dependencias innecesarias.
- Elegir tamaños que cubran las filas y las fotos de apertura/cierre en monitores amplios y DPR 2, sin superar las dimensiones del original. Orientativamente, 480/768/1200/1600/2200/2800 px de ancho cuando el original lo permita; adaptar al sistema existente.
- Usar `srcset` y `sizes` que reflejen los anchos reales de cada composición, no un mismo `sizes` aproximado para todas las fotos. Incluir dimensiones para evitar saltos de diseño.
- Ajustar calidad mediante revisión visual de luces, humo, piel y zonas oscuras: no usar los pequeños WebP del boceto como archivos finales.
- Carga diferida de fotos fuera de la primera vista. Evitar que estas imágenes se descarguen al entrar al home sin abrir la galería.
- Mantener los originales fuera del seguimiento de Git, mediante una regla acotada a esta carpeta. No agregar `*.jpg` globalmente ni cambiar el seguimiento de otras imágenes. Versionar las variantes optimizadas y los datos según el patrón del proyecto.

## Contacto al final

Antetítulo: `CONTEMOS LO QUE SUCEDE`

Título: `Tu próximo evento, en imágenes.`

Texto: `Coberturas de recitales, festivales y encuentros culturales.`

Acción: `Consultar por una cobertura ↗`

Integrar la acción con el contacto existente y, si está soportado, preseleccionar el motivo de cobertura de un evento. Mantener la confirmación previa a abrir WhatsApp y el número real del proyecto. No enviar mensajes reales en las pruebas. Como ayuda contextual puede utilizarse el texto aprobado: `Contame qué estás organizando, dónde y para qué fecha. Podemos conversar sobre las fotografías que necesitás.`

## Verificación y entrega

- Ejecutar build, lint y las pruebas existentes pertinentes. Añadir solo pruebas que aporten una regresión útil; evitar pruebas que dupliquen datos o detalles de implementación.
- Revisar visualmente 360/390 px, 768 px y escritorio 1366/1920/2560 px, incluida poca altura. Verificar filas alineadas, fotos completas, naturalidad de los títulos, epígrafes largos, ausencia de desbordes y calidad visible. Verificar DPR 2 cuando las herramientas lo permitan.
- Abrir la galería desde el portfolio y mediante URL directa/recarga. Revisar las 26 imágenes, el orden, el visor, teclado, cierre y retorno del foco, menú móvil y contacto.
- Hacer una comprobación dirigida de navegación y compra deportiva para detectar efectos de cambios compartidos. No enviar pedidos reales.
- Entregar un `REVISION.md` con qué cambió, por qué, cómo se verificó, resultado de comprobaciones y límites reales; informar rama, commit y PR/Preview si existen. Separar comprobaciones ejecutadas de las pendientes. No afirmar pruebas en dispositivos físicos si se usó emulación.
