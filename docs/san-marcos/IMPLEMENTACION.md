# San Marcos, mi mirada · Diseño aprobado

Implementar esta página interior del portfolio en el proyecto existente. Esta entrega contiene la referencia visual aprobada, seis obras y tres fotografías de la muestra. El título confirmado para la fotografía del caminante sobre la pasarela es **Última luz**.

## Estado y alcance

- Continuar en `feat/portfolio-v2`, dentro del worktree `.worktrees/portfolio-v2` del repositorio local de Juan. Leer las instrucciones del repositorio y revisar `git status` antes de editar. Preservar cambios ajenos.
- La última entrega aprobada de la portada fue `6b6d208`. Conservar sus alturas, fotos completas, título principal, controles centrados, avance automático y pausas.
- Mantener React, React Router y Sass. Integrar el diseño como componentes del proyecto; el HTML adjunto es una referencia visual, no una aplicación para incrustar mediante iframe.
- Implementar únicamente esta serie y sus accesos desde la portada. Las otras series y la tienda de paisajes quedan pendientes.
- Ruta propuesta: `/portfolio/san-marcos-mi-mirada`. Adaptar a la estructura existente si hay una convención previa, sin romper rutas actuales.
- Conectar los accesos de San Marcos de la portada a esta página. Usar Pueblo serrano para la portada de esta serie/categoría si actualmente carece de imagen.
- No fusionar con `main` ni publicar en producción. Hacer commit y push de esta etapa a la misma rama y revisar únicamente Preview.

## Referencia visual

Abrir `diseno-san-marcos.html` en el navegador. Los controles Escritorio/Celular y el visor ilustran el comportamiento aprobado; no forman parte de la página de producción. Los enlaces de navegación y WhatsApp de la referencia son demostrativos: hay que conectarlos a los destinos reales del proyecto.

Conservar el lenguaje visual de la portada actual: fondo cálido y claro, tipografía editorial, aire alrededor de las imágenes y navegación discreta. Fotografías completas, con su relación de aspecto original y sin recorte para llenar cajas.

Orden de la página:

1. Navegación existente y regreso al portfolio.
2. Encabezado «San Marcos, mi mirada» e introducción: «Una mirada personal sobre los paisajes y rincones de San Marcos Sierras.»
3. Las seis obras, con título y ubicación debajo de cada imagen.
4. «Del paisaje al papel»: texto personal y tres imágenes documentales de la muestra, con menor tamaño y protagonismo que las obras.
5. Consulta por una fotografía digital o impresa a pedido mediante WhatsApp.
6. Navegación hacia otras series solo si están disponibles. No crear enlaces que terminen en páginas inexistentes.
7. Pie de página coherente con la web actual.

## Obras: archivos, títulos y distribución

Los nombres de archivo se conservan para evitar confusiones. Esta tabla prevalece sobre cualquier identificación anterior.

| Orden | Archivo en fotos/obras | Título | Distribución en escritorio |
| --- | --- | --- | --- |
| 1 | DSC03637.jpg | Pueblo serrano | Panorámica de apertura, ancho del contenido |
| 2 | DSC05590.jpg | Camino al atardecer | Horizontal, junto a Calles de infancia |
| 3 | DSC08228-Editar.jpg | Calles de infancia | Horizontal, junto a Camino al atardecer |
| 4 | DSC08263.jpg | Última luz | Horizontal centrada, con aire alrededor |
| 5 | DSC03503 (2).jpg | Reflejos | Vertical, junto a El cielo del pueblo |
| 6 | DSC00869.jpg | El cielo del pueblo | Vertical, junto a Reflejos |

Ubicación de los pies de foto: «San Marcos Sierras». En celular, todas las obras se apilan en este orden; las verticales tienen un ancho moderado, como en la referencia.

### Ampliación

Las seis obras se pueden ampliar en un visor accesible con título, imagen completa, contador, controles anterior/siguiente y cierre. Navegación manual, sin avance automático. Escape cierra; las flechas permiten navegar. Gestionar el foco, devolverlo al elemento de apertura y conservar la posición de lectura al cerrar. Los controles deben seguir visibles en celular y en pantallas de poca altura. El visor de obras contiene solo las seis obras, no las fotografías del evento.

## Fotografías de la muestra

| Orden | Archivo en fotos/muestra | Pie de foto |
| --- | --- | --- |
| 1 | IMG_5633.jpg | Las imágenes en papel |
| 2 | IMG_5660.jpg | Compartir la mirada |
| 3 | IMG_5663.jpg | Detenerse a mirar |

Tres imágenes pequeñas, debajo del relato. En escritorio van en una fila; en celular se apilan. No incluir otras fotos del evento por el momento.

Encabezado: «Del paisaje al papel.»

Dato de la muestra usado en el diseño aprobado: «San Marcos Sierras · Septiembre de 2026».

Texto aprobado, respetando los dos párrafos:

> Ver mis fotografías en papel me permitió apreciarlas con una mirada distinta. Esta muestra fue una oportunidad para compartir mi manera de ver San Marcos, conversar con quienes se acercaron y contar cómo fueron tomadas las imágenes.
>
> También pude presentarme como fotógrafo y escuchar lo que mis fotos despertaban en otras personas. Me llevo esas charlas, las palabras de cariño y la alegría de haber compartido algo tan personal. Fue una experiencia única, por la que estoy muy agradecido.

## Consulta por WhatsApp

Encabezado: «¿Hay una imagen que te gustaría tener?»

Texto: «Podés consultarme por una fotografía de esta colección en formato digital o impresa a pedido.»

Botón: «Consultar por WhatsApp».

Reutilizar el número, la utilidad de URL y el patrón de confirmación ya implementados. El mensaje debe identificar la colección «San Marcos, mi mirada» y puede preparar una consulta general por disponibilidad y formatos. No inventar precios ni checkout. La persona confirma el envío en WhatsApp; la web no puede comprobarlo. No enviar mensajes reales durante las pruebas.

## Tratamiento de imágenes

- Usar los JPG de `fotos/`, nunca las pequeñas imágenes incrustadas en la referencia HTML.
- Si Juan reemplaza esos JPG por versiones de mayor resolución con el mismo nombre, procesar esas versiones antes de generar las variantes finales.
- Generar WebP y variantes responsive según la estrategia ya usada en la portada. No ampliar más allá de la resolución de la fuente, recortar, alterar el color ni aplicar nuevas ediciones.
- Declarar `srcset`, `sizes`, ancho y alto; cargar de forma diferida las imágenes inferiores. Priorizar solo la imagen inicial cuando corresponda. En ampliación, usar una variante adecuada para el tamaño visible y la densidad de pantalla.
- Guardar los recursos optimizados donde corresponda en `public/images/portfolio`. Los JPG fuente deben permanecer locales y fuera de Git; respetar/extender el patrón existente de originales ignorados. No subir por accidente las fotos fuente dentro de `docs/san-marcos/fotos/`.
- Separar los datos de la serie de su presentación para reutilizar lo necesario cuando se implementen Achala y La Cumbrecita, sin construir una infraestructura compleja para esta primera página.

## Verificación y entrega

Revisar a 360, 768, 1366×768 y 1920×1080: orden, fotos completas, legibilidad, controles visibles y ausencia de desbordamientos. Comprobar títulos, especialmente Última luz, ampliación, teclado, cierre y foco. Comprobar acceso desde la portada, regreso a sus secciones y apertura/recarga directa de la nueva ruta.

Ejecutar build, lint y las pruebas existentes. Verificar que sigan funcionando `/tienda/deportes`, `/#eventos`, las rutas de eventos y galerías, selección persistente y preparación de pedidos. No modificar contratos deportivos, Cloudinary ni precios.

Actualizar `docs/portfolio-v2/REVISION.md` con lo implementado, comprobaciones reales y límites. Informar commit, rama y Preview. Si alguna comprobación no se pudo realizar, decirlo explícitamente.
