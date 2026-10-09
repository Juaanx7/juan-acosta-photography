# Los Cajones de Achala · Diseño aprobado

## Proyecto y alcance

Implementar la página interior de esta serie en la web existente de Juan Acosta Photography. Trabajar en `.worktrees/portfolio-v2`, rama `feat/portfolio-v2`. La portada y San Marcos ya fueron aprobadas visualmente por Juan; el último commit informado de San Marcos es `b887ee6`. No reiniciar desde ese commit ni sobrescribir cambios posteriores. Leer las instrucciones del repositorio y revisar el estado local antes de editar.

La ruta propuesta es `/portfolio/cajones-de-achala`, salvo que una convención existente aconseje otra. Conectar la tarjeta de Pampa de Achala de la portada y el enlace a esa serie desde San Marcos. Mantener `/portfolio/san-marcos-mi-mirada` y su contenido aprobado. La categoría Paisajes y viajes no debe quedar reducida a esta única salida.

Usar React, React Router y Sass existentes. Reutilizar los componentes y datos de series ya implementados donde encaje, adaptando esta distribución. No crear una web independiente ni incrustar el HTML mediante iframe. No implementar otras series o tiendas ahora.

## Fuentes y calidad

Las doce fuentes deben estar en `docs/achala/fotos/originales/`, con los nombres exactos de la tabla. Son JPG exportados desde las ediciones finales de Juan, a la mayor resolución disponible, sin textos, marcas de agua ni diseño de impresión. No se necesita procesar RAW.

El paquete contiene una referencia visual con imágenes pequeñas incrustadas. **Esas imágenes sirven solo para el diseño y la identificación; no son fuentes para la implementación.** No extraerlas para reemplazar originales faltantes.

Antes de agregar archivos a Git, asegurar que `docs/achala/fotos/originales/` esté ignorado. Conservar los originales intactos y locales. Generar WebP y variantes responsive en el destino de recursos optimizados del proyecto. Seguir la estrategia usada en portada y San Marcos: sin ampliación por encima de la fuente, sin recorte adicional y sin cambios de color. No comprimir siguiendo la calidad del HTML de referencia; elegir calidad apropiada para la web real y revisar visualmente.

Declarar ancho y alto, `srcset` y `sizes` correctos para cada distribución. Priorizar la foto inicial según corresponda y diferir las inferiores. El visor debe poder usar una variante de resolución suficiente para pantalla y densidad. Verificar legibilidad/nitidez y evitar cargar todos los originales de entrada.

## Fotografías y orden aprobado

Este es el orden de lectura y del visor. La foto inicial resume la experiencia y funciona como portada; el resto acompaña el relato. No etiquetar toda la secuencia como una cronología exacta de captura. Juan confirmó que las dos últimas fotografías sí corresponden al final de la caminata.

| Orden | Archivo | Identificación visual | Distribución |
| --- | --- | --- | --- |
| 1 | DSC02820.jpg | Grupo pequeño entre enormes paredes rocosas y suelo verde | Apertura horizontal, ancho completo del contenido |
| 2 | DSC02395.jpg | Grupo distante en sendero sobre la ladera y paisaje abierto | Horizontal, junto a la foto 3 |
| 3 | DSC02427.jpg | Caminante de espaldas con ropa azul frente a las rocas | Horizontal, junto a la foto 2 |
| 4 | DSC02568.jpg | Musgo y vegetación sobre una pared de roca | Vertical, junto a la foto 5 |
| 5 | DSC02569.jpg | Dos caminantes dentro de un paso estrecho con vegetación | Vertical, junto a la foto 4 |
| 6 | DSC02780.jpg | Formaciones rocosas y pastizal verde, sin personas | Horizontal centrada, ancho algo menor que la apertura |
| 7 | DSC02824.jpg | Corredor verde entre rocas, encuadre vertical | Vertical, junto a la foto 8 |
| 8 | DSC02882.jpg | Grupo siguiendo un sendero que asciende entre paredes | Vertical, junto a la foto 7 |
| 9 | DSC02887.jpg | Dos personas de espaldas contemplando el paisaje entre rocas | Horizontal, ancho completo del contenido |
| 10 | DSC02966.jpg | Tres amigos frente al paisaje; uno señala hacia el horizonte | Vertical junto al último párrafo del relato |
| 11 | DSC02984.jpg | Paisaje abierto, nubes y sectores iluminados al atardecer | Horizontal amplia, después del relato del regreso |
| 12 | DSC02988.jpg | Pastizales dorados frente a las montañas y cielo con nubes | Horizontal amplia de cierre |

No añadir las otras ocho fotografías de la preselección ni cambiar el orden sin una razón que se explique para revisión.

## Diseño

Referencia aprobada: `diseno-cajones-de-achala.html`. Mantener el lenguaje visual de San Marcos y de la portada: papel cálido claro, tinta oscura, tipografía editorial y espacio entre imágenes. Fotografías completas, con su proporción natural, sin cajas que las recorten.

El título es «Los Cajones de Achala», con «de Achala.» en cursiva como en la referencia. Texto superior secundario: «SERIE · PAMPA DE ACHALA, CÓRDOBA». No inventar fecha, duración, distancia, altura o ubicación más precisa.

Los dos primeros párrafos se muestran junto al título, antes de la foto de apertura. Después se alternan horizontales, pares de verticales, detalle y caminantes según la tabla. La sección del regreso muestra la foto 10 a la izquierda y el último párrafo a la derecha en escritorio, con encabezado «Otra luz, el mismo paisaje.» y texto secundario «EL REGRESO». Las fotos 11 y 12 van a continuación, una debajo de la otra, con espacio para percibir el cambio de luz. Bajo la última figura aparece «Al final del camino.».

En celular: título y relato se apilan; todos los pares pasan a una sola columna; las verticales usan un ancho moderado como en la referencia. En el regreso, la foto 10 precede al texto. Las fotos del atardecer conservan un tamaño destacado y su encuadre completo.

No agregar títulos individuales inventados a las fotos. El título de la colección y los textos aprobados bastan. Mantener acciones discretas de ampliación visibles sin hover.

Los controles «Escritorio» y «Celular» del HTML permiten revisar el diseño y deben omitirse en producción. La referencia usa navegación local demostrativa; conectar los enlaces reales sin copiar sus avisos de demostración.

## Texto aprobado

Primer párrafo, junto al título:

> Comenzamos la caminata con mis amigos bien temprano, con un frío intenso y el cielo nublado. Desde los primeros pasos me sorprendió la variedad del paisaje: vistas abiertas, formaciones rocosas, senderos entre la vegetación y pasos estrechos donde las paredes de piedra nos hacían sentir pequeños.

Segundo párrafo, a continuación del primero:

> Al mediodía llegamos a los cajones y paramos a comer. Fue una caminata extensa, pero lo que íbamos descubriendo nos mantenía las ganas de seguir explorando y detenernos a mirar.

Último párrafo, en la sección del regreso antes de las fotos doradas:

> Durante el regreso, ya cerca de donde habíamos comenzado, coincidimos con la hora dorada del atardecer. Después de un día casi completamente nublado, la luz iluminó los pastizales y nos permitió contemplar el paisaje con otros colores. El mismo lugar nos ofrecía una mirada distinta para cerrar el recorrido.

## Visor y consulta

Reutilizar/adaptar el visor accesible de San Marcos para estas doce fotografías. Navegación manual con anterior/siguiente y contador; sin avance automático. Imagen completa, Escape y flechas del teclado, cierre visible, foco gestionado y devuelto al elemento de apertura, conservación de la posición de lectura. Revisar pantallas de poca altura y celular para mantener los controles accesibles. El visor puede mostrar el título de la serie; no asignar los títulos de las obras de San Marcos a estas imágenes.

Conservar el cierre de consulta de la referencia:

- Encabezado: «¿Hay una imagen que te gustaría tener?»
- Texto: «Podés consultarme por una fotografía de esta colección en formato digital o impresa a pedido.»
- Acción: «Consultar por WhatsApp».

Reutilizar número, utilidad y confirmación existentes. La consulta debe identificar «Los Cajones de Achala». No inventar precios, stock, checkout ni confirmación de envío; el visitante confirma el envío en WhatsApp. No enviar mensajes reales durante las pruebas.

En «Seguir explorando», San Marcos debe navegar a su página existente. La Cumbrecita todavía está pendiente: no crear una ruta vacía ni un enlace que termine en 404; adaptar su estado a la convención del proyecto. Navbar, regreso al portfolio y contacto deben funcionar desde esta ruta.

## Comprobaciones y entrega

- Revisar a 360, 768, 1366×768 y 1920×1080, y el visor con poca altura. Comprobar ausencia de desbordamiento, legibilidad, fotos completas y controles accesibles. Revisar la calidad a alta densidad si las herramientas lo permiten; informar si no se pudo.
- Confirmar las doce correspondencias de archivo, el orden, el texto repartido y el cierre con DSC02984/DSC02988.
- Comprobar ampliación manual, teclado, cierre, foco y posición de lectura. Probar preparación y codificación de la consulta sin enviar un mensaje real.
- Comprobar portada → Achala, San Marcos → Achala, Achala → San Marcos y regreso a las secciones de inicio. Abrir y recargar directamente la nueva ruta; respetar el rewrite de Vercel.
- Ejecutar build, lint y pruebas existentes. Verificar que la portada aprobada y San Marcos no sufran regresiones.
- Conservar `/tienda/deportes`, el alias `/#eventos`, `/evento/:eventId`, `/evento/:eventId/galeria`, `/evento/:eventId/:categoryId` y `/como-comprar`. Mantener selección persistente, paginación, modal, Cloudinary, precios y pedidos deportivos.
- Actualizar `docs/portfolio-v2/REVISION.md`. Hacer commit y push a `feat/portfolio-v2`; revisar Preview. **Sin merge a main ni publicación en producción.**
- Informar comprobaciones efectivamente realizadas y límites; no presentar emulaciones como pruebas en teléfonos físicos.
