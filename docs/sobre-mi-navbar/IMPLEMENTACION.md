# Sobre mí y navbar móvil · Diseño aprobado por Juan

## Contexto de trabajo

La nueva web ya está en producción. Las mejoras de amplitud, saltos naturales, carrusel de portada y navegación táctil del menú Tienda fueron revisadas y aprobadas por Juan. Este paquete no modifica el repositorio: es una referencia para implementar localmente con Codex.

Leer AGENTS/instrucciones aplicables y revisar git status. Basarse en la versión actual de producción y preservar cambios ajenos. No volver a utilizar una rama antigua de portfolio sin comprobar que contiene todas las correcciones posteriores. Rama propuesta si se necesita una nueva: `feat/sobre-mi-navbar-mobile`. Si se usa un worktree nuevo, leer/copiar las referencias desde el checkout original `docs/sobre-mi-navbar/` sin perder el estado del trabajo principal.

Trabajar en React, React Router y Sass existentes. Sin una nueva web, iframe o sustitución del sistema de navegación. Las referencias no autorizan merge ni publicación: Juan hará el merge manual en GitHub tras revisar la Preview.

## Sección Sobre mí

Agregar una sección real del home después del portfolio y las series, antes de Contacto. Si hay una sección provisional o un ancla `sobre-mi` que apunta al portfolio, corregirla y evitar IDs duplicados. El destino debe ser `/#sobre-mi`, con desplazamiento al comienzo de la biografía desde el home y desde cualquier página interior/deportiva. Comprobar apertura y recarga directa de esa URL, renderizado y ajuste por altura del navbar si es fijo.

Usar el diseño aprobado de `diseno-sobre-mi-navbar.html`: papel cálido claro, tipografía editorial, retrato vertical a la izquierda y texto a la derecha en escritorio. Imagen rectangular completa; conservar su fondo, proporción y edición, sin convertirla en avatar circular. En celular, retrato arriba y biografía debajo, con imagen de ancho moderado y texto legible. Mantener la amplitud general de la web actual y los anchos cómodos de lectura de los párrafos.

Etiqueta superior: «SOBRE MÍ». Encabezado: «Una forma de mirar.», con «mirar.» en cursiva en línea, permitiendo saltos naturales cuando falte ancho. En el home real usar una jerarquía de encabezados correcta: el título de portada conserva el h1 y esta sección usa h2, aunque la referencia aislada use h1.

Introducción:

> Soy Juan Acosta, fotógrafo de San Marcos Sierras, Córdoba.

Biografía aprobada, en tres párrafos:

> Empecé con la fotografía casi sin querer, buscando algo que todavía no sabía nombrar. Aprendí de otros fotógrafos, contemplando el paisaje, probando y volviendo al mismo lugar hasta entender la luz.
>
> Con el tiempo entendí que fotografiar es, sobre todo, una forma de estar y de sentirme parte del lugar. Disfruto todo el proceso: cómo los distintos tonos del día transforman un cerro, la quietud de esperar a que salgan las estrellas, el momento en que una imagen finalmente transmite lo que sentí.
>
> San Marcos Sierras es parte de esa mirada. También lo son los viajes, los senderos y los deportes en montaña: experiencias que me llevan a explorar y descubrir qué fotografiar. Comparto mis imágenes para que quienes las vean puedan sentir algo de lo que viví al tomarlas.

Pie del retrato: «Juan Acosta · San Marcos Sierras, Córdoba».

Acción discreta «Conversemos ↗», enlazada al contacto existente del home. Mantener el formulario y la confirmación de WhatsApp actuales. El bloque de Contacto de la referencia solo permite visualizar la continuación: no reemplazar el formulario por un botón directo ni duplicar esta sección.

## Foto fuente

`fotos/originales/retrato-juan-acosta.webp` es una copia intacta del archivo `preview.webp` compartido por Juan, de 819 × 1456 px. Es la fotografía limpia, sin los textos/degradados del flyer. La imagen incrustada en el HTML tiene menor resolución y es solo una referencia.

Si Juan agrega el original de mayor resolución de la misma foto en esta carpeta, usar ese archivo y registrar cuál se procesó. No cambiar la extensión de un JPG a WebP sin convertirlo. Si no hay otra fuente, usar el WebP incluido sin ampliarlo artificialmente y comunicar cualquier limitación de nitidez.

Ignorar `docs/sobre-mi-navbar/fotos/originales/` antes de agregar archivos a Git, respetando la estrategia existente. Mantener fuentes intactas y locales; incorporar solo documentación y derivados optimizados necesarios. Generar variantes responsive adecuadas al tamaño visible, con srcset/sizes, dimensiones declaradas y carga diferida al estar debajo de la portada. No alterar color, encuadre o proporciones ni agregar efectos del flyer.

## Navbar hamburguesa en celular

Aplicarlo al navbar compartido de toda la web, incluidas series, tienda, eventos, galerías y Cómo comprar. En escritorio, conservar el navbar actual con sus enlaces visibles. Elegir el breakpoint siguiendo las convenciones existentes y el espacio disponible, comprobando tablet y orientación horizontal.

Estado cerrado: logo a la izquierda, botón hamburguesa a la derecha, sin la fila de enlaces visible. El encabezado queda compacto y conserva el tamaño aprobado de la portada móvil.

Estado abierto: desplegar los enlaces debajo del encabezado, sobre fondo opaco del mismo tono de la web, dentro del flujo de la página. El botón pasa a cierre. Usar texto claro, separación discreta y áreas de toque cómodas. No crear un panel lateral, overlay de pantalla completa ni interacción por hover.

Opciones: Portfolio, Sobre mí, Contacto y Tienda. Tienda abre sus opciones dentro del menú móvil (acordeón): Fotos de carreras `/tienda/deportes`, Cómo comprar `/como-comprar`, Fotografías para encargar como texto no disponible con «En preparación · paisajes y viajes». No implementar una tienda nueva.

Cerrar el menú al navegar o elegir un ancla; cerrar al tocar fuera, con Escape y mediante el botón. Cerrar/restablecer el submenú Tienda cuando corresponda. Al pasar a escritorio, normalizar el estado para evitar menús ocultos o atributos inconsistentes.

Usar botón nativo con nombre accesible, aria-expanded y aria-controls. En estado cerrado los enlaces ocultos no deben permanecer en el orden de tabulación. Mantener foco visible y orden natural; Escape devuelve el foco al botón. Como es un desplegable dentro del flujo y no un diálogo modal, no atrapar el foco como si fuera un modal.

Preservar la corrección táctil existente de Tienda: un toque interno no debe cerrar/ocultar el submenú antes de que el enlace se active. Evitar reintroducir el cierre prematuro por blur con relatedTarget nulo. No cancelar la navegación nativa ni requerir dos toques para seguir un enlace. Conservar teclado, toques exteriores y cierre después de activar los enlaces, también estando en el destino actual.

## Cómo interpretar la referencia

Los controles Escritorio/Celular no son parte del producto. El navbar de la referencia muestra «Sobre mí» activo porque se está revisando esa sección; no marcarlo siempre como activo en todas las páginas. Los enlaces demostrativos y sus avisos deben reemplazarse por destinos reales, sin copiar los avisos al producto.

La propuesta aislada comienza por la biografía para revisarla. En la implementación, conservar portada, portfolio y series por encima; no convertir la biografía en el comienzo de la web ni en otra página independiente.

## Verificación y entrega

- Revisar 360, 390, 430, 768, 1366×768 y 1920×1080: navbar, disposición, texto, foto, márgenes y ausencia de desbordamiento. Comprobar orientación horizontal y cambios de tamaño.
- Probar abrir/cerrar hamburguesa, Tienda y cada opción disponible con interacción táctil emulada en Chromium/WebKit; mantener y adaptar las pruebas de regresión existentes del navbar. Distinguir emulación de pruebas en teléfonos físicos.
- Comprobar Tab, Shift+Tab, Enter, Escape, foco al cerrar y que el contenido oculto no sea enfocable. Revisar escritorio con mouse y teclado.
- Probar Sobre mí desde home, San Marcos, Achala y páginas deportivas; carga/recarga `/#sobre-mi`, destino correcto, Contacto y Conversemos sin enlaces a secciones equivocadas.
- Conservar el carrusel aprobado: automatismo, flechas laterales en PC, puntos, ausencia del botón de pausa, tamaño móvil, pausas existentes y selección de resolución.
- Verificar rutas y funciones deportivas: selección persistente, paginación, visor, Cloudinary y preparación del pedido. No modificar precios ni contratos de datos. No enviar mensajes reales por WhatsApp.
- Ejecutar build, lint y pruebas correspondientes. Actualizar el documento de revisión existente o uno propio de esta etapa, con capturas relevantes y límites reales.
- Commit/push de la rama, PR y Preview. No merge a main ni publicación en producción. Entregar enlace de revisión y explicar cambios, motivo y comprobaciones efectivas.
