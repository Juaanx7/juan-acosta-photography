# Sobre mí y navbar móvil

Entrega del 12 de octubre de 2026 en `feat/sobre-mi-navbar-mobile`, desde **967cc951329bce372f165ffad35c1e3be593e702**, verificado como Production / success en Vercel. Esa revisión incluye los PR #11 (Tienda táctil) y #12 (carrusel). Se reutilizó el worktree limpio existente; las ramas anteriores y los cambios ajenos del checkout principal se conservan.

## Implementación

- Se agrega una biografía real después de las categorías y series, antes del formulario de Contacto. El ancla provisional de la introducción se retira: hay un solo `sobre-mi`. Se conservan los textos aprobados, el pie del retrato y «Una forma de mirar.» como h2, con cursiva en línea y saltos naturales. El h1 permanece en la portada.
- Retrato rectangular a la izquierda, texto a la derecha y párrafos limitados a 65ch en escritorio. En celular se apilan, con retrato de 265 px. Los contenedores generales, fotografías aprobadas, series y amplitud del sitio se conservan; el bloque editorial interno sigue la referencia de 1200 px.
- «Sobre mí» apunta a `/#sobre-mi` en el navbar compartido. «Conversemos ↗» llega al contacto existente y mantiene el formulario y la confirmación de WhatsApp. Se comprueban navegación desde interiores, carga/recarga directa y repetición de la misma ancla. ScrollToTop también atiende la clave de navegación para desplazar nuevamente al activar una URL ya visitada.
- Hasta 650 px el navbar muestra logo y botón nativo de 44×44 px. Los enlaces se despliegan debajo, sobre fondo opaco y dentro del flujo. Tienda usa el mismo details y sus opciones pasan a posición estática dentro del menú. A 768 px y en orientación horizontal de 844 px hay espacio para la navegación de escritorio.
- Botón con nombre Abrir/Cerrar menú, `aria-expanded` y `aria-controls`. El nav cerrado está `hidden`, por lo que sus enlaces no se tabulan. Escape cierra y devuelve el foco al botón, incluso si Tab salió del encabezado. No se atrapa el foco. Se cierran menú y Tienda al navegar, elegir un ancla, tocar fuera o usar el botón; se normalizan al cambiar de breakpoint y al usar Atrás/Adelante y se evita dejar el foco en un control oculto.
- Se preserva la protección táctil de Tienda ante blur con relatedTarget nulo durante un toque interno. No se cancela el clic nativo. Fotos de carreras y Cómo comprar siguen disponibles; Fotografías para encargar sigue como texto no disponible, con En preparación. En escritorio se mantienen los enlaces visibles, el desplegable y la tabulación explícita de sus enlaces para WebKit.

## Fotografía fuente y recursos

La guía menciona el WebP de 819×1456 px, pero el paquete suministrado contiene un **JPG de mayor resolución: `retrato-juan-acosta.jpg`, 2250×4000 px**. Se usó esa fotografía, intacta y local, desde `docs/sobre-mi-navbar/fotos/originales/`, ignorado por Git antes de procesar o agregar archivos. No se usaron las imágenes incrustadas ni el flyer.

Generador reproducible: `python scripts/generateAboutMeImages.py` (Pillow requerido). Orientación EXIF, conversión del perfil original a sRGB, reducción Lanczos, WebP calidad 90, perfil ICC incluido. Sin recorte, ampliación ni edición artística.

Variantes: 320×569, 530×942, 680×1209 y 1020×1813 px, unos 273 KiB en total. Dimensiones declaradas, carga diferida y srcset/sizes según el ancho visible. Se comprobó selección de 530 px para el retrato de 260 px en tablet a DPR 2; 680 px para 340 px de escritorio a DPR 2; y 1020 px en perfiles móviles hasta DPR 3. La imagen visible conserva la proporción 2250:4000.

## Verificación

- **52 casos de Tienda correctos**, con toque nativo emulado en Chromium/WebKit a 360, 390 y 430 px desde inicio, San Marcos, Achala, tienda, evento, galería y Cómo comprar; un solo toque, cierre incluso en el destino actual, opción pendiente, toque exterior, mouse y teclado de escritorio. Las 28 combinaciones omitidas corresponden a dispositivos sin esa interacción. Tras los últimos ajustes se repitieron adicionalmente los cuatro casos de mouse/teclado de escritorio: correctos.
- **28 casos de biografía/navbar correctos**: enlaces desde siete rutas, anclas repetidas, carga/recarga directa, orden de secciones, Conversemos, semántica, foto completa y resolución; apertura/cierre, Tab/Shift+Tab/Enter/Escape, foco al cerrar y al cambiar de breakpoint, enlaces ocultos fuera de tabulación, acordeón inline, Atrás/Adelante y orientación. Cuatro combinaciones exclusivas de celular se omiten en escritorio.
- **16 casos del carrusel correctos**: seis segundos con tiempos reales, selección manual, puntos, teclado, pausas por puntero/foco/fuera de pantalla, movimiento reducido y señal de visibilidad simulada; fotos completas, tamaño móvil aprobado, flechas exteriores y controles visibles en escritorio, selección responsive hasta DPR 2.
- **12 casos de flujos preservados correctos**, en ambos motores y con perfiles móviles/escritorio: carga real de una foto de Cloudinary, selección que persiste tras recargar, segunda página, visor deportivo y de ambas series, contador, navegación y Escape, devolución de foco, preparación del pedido y confirmación de contacto. La apertura externa del pedido se intercepta; no se envía. También se comprueba la redirección histórica /#eventos a /tienda/deportes#eventos.
- Build, lint y **ocho pruebas unitarias correctos**; git diff --check correcto. Permanece el aviso anterior del tamaño del chunk del catálogo deportivo, ajeno a este cambio. No se modifican datos, precios, rutas, utilidades Cloudinary/WhatsApp ni componentes del carrusel, galerías o series.
- Se corrigieron los selectores de las pruebas durante su adaptación. En una corrida paralela WebKit agotó dos cargas iniciales; la corrida completa en serie pasó. Las pruebas de teclado detectaron que WebKit necesita tabindex explícito: se conserva en Tienda y se aplica a los enlaces principales. [Resultados finales](capturas/pruebas.json).

Comandos usados con el Edge instalado: `PLAYWRIGHT_CHROMIUM_CHANNEL=msedge`, `npm run test:navbar -- --workers=1`, `npm run test:about -- --workers=1`, `npm run test:cover -- --workers=1` y `npx playwright test --config tests/preservedFlows.config.js --workers=1`.

Se revisan 360, 390, 430, 768, 1366×768, 1920×1080 y adicionalmente 2560×1440; orientación 844×390 y retorno a vertical. [Mediciones responsive](capturas/mediciones.json). No hay desbordamiento horizontal. Los párrafos y el título se ajustan naturalmente.

Capturas:

- Biografía: [360](capturas/sobre-mi-360.png), [390](capturas/sobre-mi-390.png), [430](capturas/sobre-mi-430.png), [768](capturas/sobre-mi-768.png), [1366](capturas/sobre-mi-1366.png), [1920](capturas/sobre-mi-1920.png), [2560](capturas/sobre-mi-2560.png).
- Navbar móvil cerrado y portada: [390](capturas/inicio-390.png).
- Menú y Tienda abiertos: [360](capturas/menu-tienda-360.png), [390](capturas/menu-tienda-390.png), [430](capturas/menu-tienda-430.png), [WebKit 390](capturas/webkit-menu-tienda-390.png).
- Portada de escritorio: [1366](capturas/inicio-1366.png), [1920](capturas/inicio-1920.png).

## Acceso y límites reales

Local: http://127.0.0.1:5175/#sobre-mi. La referencia se conserva como documentación; no se incorpora al render de React.

Pruebas en Windows con Edge/Chromium 155 y WebKit 26.5, eventos táctiles y densidades emuladas. No se probaron teléfonos físicos ni Safari de iOS real. La prueba previa del carrusel sobre documento oculto usa una señal simulada, porque las pestañas headless permanecen visibles. Los flujos externos de WhatsApp se inspeccionan o interceptan en el navegador de pruebas, sin enviar consultas ni pedidos reales.

PR y Preview se incorporarán a la entrega. Juan hará el merge manual tras revisar; no se fusiona ni publica esta rama en producción.
