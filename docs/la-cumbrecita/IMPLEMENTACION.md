# La Cumbrecita · Diseño aprobado

## Integración

Implementar la tercera serie del portfolio en la web existente. La web ya está en producción y Juan realiza los merges manualmente después de revisar. Leer las instrucciones del repositorio y git status. Partir de la versión actual que contiene las últimas mejoras aprobadas; preservar los cambios locales. Rama sugerida: `feat/serie-la-cumbrecita`, o una rama de trabajo adecuada existente. No volver a una versión antigua de `feat/portfolio-v2` sin verificar sus cambios posteriores.

Los archivos de referencia se copiarán en `docs/la-cumbrecita/` del checkout original. Si se utiliza otro worktree, leer/copiar desde allí las referencias y fuentes necesarias, respetando su exclusión de Git.

Ruta propuesta: `/portfolio/la-cumbrecita`, adaptada a la convención existente si fuera necesario. Conectar la tarjeta de La Cumbrecita del home y los accesos desde San Marcos y Achala. Usar DSC03544 como cubierta de esta serie. Retirar su estado pendiente solo cuando la página esté funcional. En el cierre, enlazar a las páginas existentes de San Marcos y Los Cajones de Achala, resolviendo sus rutas reales desde los datos/router. No cambiar las fotos ni controles de la portada principal.

Reutilizar React, React Router, Sass, datos de series, visor accesible y consulta por WhatsApp. El HTML adjunto es una referencia visual, no una aplicación para incrustar como iframe.

## Diseño y lectura

Abrir `diseno-la-cumbrecita.html`. Mantener la estética cálida y clara existente, los contenedores amplios en escritorio y márgenes razonables. Fotografías completas, con sus proporciones naturales y sin títulos individuales inventados. No agregar el texto «Ampliar»: la imagen es el control de apertura al visor.

Encabezado: etiqueta «SERIE · LA CUMBRECITA, CÓRDOBA», título «La Cumbrecita.» con «Cumbrecita.» en cursiva en línea, sin salto impuesto. Los dos primeros párrafos van debajo del título, alineados a la izquierda y con ancho cómodo de lectura. Respetar saltos naturales según el espacio disponible.

El recorrido empieza por la neblina y las calles, continúa con el bosque, sus detalles y la cascada, y termina con los rincones cálidos y la noche. El orden es editorial; no afirmar que cada foto representa una secuencia cronológica exacta.

Después de la foto de la cascada se ubica el último párrafo, bajo la etiqueta «LAS LUCES DEL PUEBLO» y el encabezado «Cuando cae la noche.» con «noche.» en cursiva, sin salto forzado. Luego van las cuatro últimas imágenes de la tabla.

Los pares verticales tienen separación generosa y un tamaño equilibrado. La cascada y el detalle nocturno son verticales individuales centradas. El par mixto de la foto 9 y 10 muestra la vertical de menor ancho a la izquierda y la horizontal de mayor ancho a la derecha, centradas verticalmente y sin recortes. La horizontal nocturna final ocupa el ancho amplio del contenido.

En celular los pares se apilan en el orden indicado, las verticales usan un ancho moderado y las horizontales aprovechan el ancho disponible. Mantener el navbar hamburguesa ya implementado, sin sustituirlo por el código demostrativo del HTML. Los controles Escritorio/Celular y los avisos de navegación del boceto no pertenecen al producto.

## Selección definitiva y orden del visor

La foto descartada es **DSC03521.jpg** (casita sobre un tronco). Se conservan las otras doce fotos de la preselección. No confundirla con **DSC03523.jpg**, que sí se usa: estructura de madera con libros entre la vegetación.

| Orden | Archivo | Identificación | Distribución |
| --- | --- | --- | --- |
| 1 | DSC03544.jpg | Árboles, tejados y montaña cubierta de neblina | Horizontal de apertura, ancho completo |
| 2 | DSC03493.jpg | Camino húmedo junto al letrero Paseo de la Fuente | Horizontal amplia |
| 3 | DSC03489.jpg | Casa blanca entre árboles y curva del camino | Vertical, junto a la foto 4 |
| 4 | DSC03541.jpg | Pequeña capilla rodeada de árboles | Vertical, junto a la foto 3 |
| 5 | DSC03530.jpg | Persona junto al sendero bajo árboles altos | Vertical, junto a la foto 6 |
| 6 | DSC03523.jpg | Estructura de madera con libros entre la vegetación | Vertical, junto a la foto 5 |
| 7 | DSC03582.jpg | Gotas de agua en una rama con vegetación | Horizontal amplia |
| 8 | DSC03586.jpg | Persona contemplando la cascada | Vertical individual centrada |
| 9 | DSC03557.jpg | Rincón de madera con estantes y tonos cálidos | Vertical izquierda del par mixto |
| 10 | DSC03601.jpg | Edificio iluminado junto al puente y el agua | Horizontal derecha del par mixto |
| 11 | DSC03619.jpg | Lámparas cálidas en un tronco contra el cielo azul | Vertical individual centrada |
| 12 | DSC03622.jpg | Edificio y guirnaldas iluminados de noche | Horizontal amplia de cierre |

La foto de apertura lleva el pie discreto «La Cumbrecita». Mantener textos alternativos descriptivos. El visor contiene estas doce imágenes, en este mismo orden, sin avance automático.

## Texto aprobado

Primer párrafo, debajo del título:

> En mi visita a La Cumbrecita encontré el pueblo cubierto de neblina, lluvia y mucho verde. Ese clima le daba una atmósfera especial y me invitaba a descubrirlo caminando, atento a sus rincones y detalles.

Segundo párrafo, a continuación:

> Comenzamos recorriendo sus calles, apreciando la arquitectura y la vegetación que la rodeaba. Entre los árboles altos, el río y las cascadas, sentí esa conexión con la naturaleza que tanto disfruto al explorar con mi cámara.

Último párrafo, después de la cascada y antes del tramo cálido/nocturno:

> Al caer la noche, las luces cálidas transformaron el paisaje del pueblo. Seguimos recorriendo la zona céntrica, descubriendo los mismos rincones con otros colores y una iluminación distinta. Esa atmósfera nocturna también quedó en las fotografías de esta visita.

No agregar fechas, nombres de acompañantes, datos turísticos o lugares específicos no proporcionados por Juan.

## Fuentes y recursos

Juan copiará los JPG originales de mayor resolución disponible en `docs/la-cumbrecita/fotos/originales/`, conservando los nombres de la tabla. Usar las mismas ediciones y encuadres de la selección aprobada, sin marcas de agua ni márgenes/textos de impresión. No hace falta procesar RAW.

Verificar las doce fuentes antes de generar recursos. Si falta alguna, comunicar su nombre y continuar el trabajo independiente; no sustituirla silenciosamente por una foto diferente o por la pequeña imagen incrustada en el HTML. Los JPG de esta carpeta deben quedar ignorados por Git antes de agregar archivos.

Generar WebP y variantes responsive siguiendo el flujo existente. No ampliar por encima de la fuente, alterar color ni recortar. Ajustar srcset/sizes a las distribuciones amplias actuales y al visor, cuidando nitidez en pantallas de alta densidad. El HTML contiene previews comprimidas solo para mostrar el diseño: no imitar esa compresión en los recursos finales. Declarar dimensiones y diferir las fotos inferiores; priorizar únicamente la apertura cuando corresponda.

## Visor, navegación y contacto

Conservar el visor existente: apertura por clic/toque/teclado, foto completa, controles manuales, contador, Escape, flechas de teclado, foco devuelto al elemento de apertura y posición de lectura conservada. Controles visibles y accesibles en celular y pantallas de poca altura.

Mantener todos los enlaces del navbar y sus anclas reales, incluida la biografía `/#sobre-mi` y Contacto. Preservar la corrección de Tienda en táctil, el menú hamburguesa y los estados de contenido pendiente. No añadir enlaces a páginas vacías.

El cierre de la página reutiliza la consulta de las otras series:

- Encabezado: «¿Hay una imagen que te gustaría tener?»
- Texto: «Podés consultarme por una fotografía de esta colección en formato digital o impresa a pedido.»
- Acción: «Consultar por WhatsApp».

Reutilizar número, utilidad y confirmación existentes. La consulta identifica «La Cumbrecita». No inventar precios ni checkout y no enviar mensajes reales durante las pruebas.

## Comprobaciones y entrega

- Revisar a 360, 390, 768, 1366×768, 1920×1080 y 2560×1440: ancho, texto debajo del título, fotos completas, proporciones, nitidez y ausencia de desbordamiento. Comprobar visor con poca altura.
- Confirmar las doce correspondencias y su orden; DSC03521 debe estar ausente y DSC03523 presente. Verificar los tres párrafos y su distribución.
- Comprobar visor, teclado, cierre, foco y scroll. Preparar la consulta por WhatsApp sin envío real.
- Probar home → La Cumbrecita, otras series → La Cumbrecita y enlaces de regreso. Abrir y recargar directamente la nueva ruta; mantener el rewrite de Vercel.
- Probar navbar de escritorio y hamburguesa con toques en celular, manteniendo las pruebas de regresión de Tienda y de Sobre mí existentes.
- Conservar portada, biografía, San Marcos y Achala. Verificar rutas y flujos deportivos: selección persistente, paginación, modal, Cloudinary y preparación de pedidos. No modificar precios ni contratos de datos.
- Ejecutar build, lint y las pruebas pertinentes. Actualizar el documento de revisión con capturas relevantes y límites reales; distinguir emulación de teléfonos físicos.
- Hacer commit/push, abrir PR y entregar Preview para Juan. **Sin merge a main ni publicación en producción: Juan realiza el merge manual tras revisar.**
