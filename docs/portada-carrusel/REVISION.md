# Portada: flechas laterales y puntos

Revisión del **12 de octubre de 2026**, rama `codex/portada-carrusel`, desde producción **0eefd6e293cca3bdcba4a2c384e3cf1267e44d1c** (Production / success confirmado). Esta base ya incluye el arreglo táctil de Tienda del PR #11. Se reutilizó el worktree limpio existente, conservando las ramas anteriores y los cambios locales del repositorio principal.

## Cambios

- Se retiró el botón Pausar/Reproducir y el contador visible. Permanecen el avance automático cada seis segundos y las pausas por puntero/interacción, foco, portada fuera de pantalla, documento oculto y preferencia de movimiento reducido. Con movimiento reducido se mantiene disponible la selección manual, sin animación ni avance automático.
- En escritorio las flechas se centran verticalmente junto a los bordes reales de la fotografía contenida, con 44×44 px de área interactiva, separadas del contenido y sin recuadros ni fondos. Su posición responde a la proporción de la foto activa, incluyendo la fotografía deportiva de 3:2.
- Hay cuatro puntos debajo del nombre, con estado activo visible y `aria-current`, etiquetas con número/título y elección directa por clic/toque. Tab, Enter y Espacio usan los controles nativos; el foco visible y el anuncio accesible de las selecciones manuales se conservan. El avance automático no genera anuncios continuos.
- En celular las flechas quedan debajo de la imagen, flanqueando los puntos. Flechas y puntos tienen áreas de 44×44 px. El marco sigue en 4:3 y la fotografía mantiene exactamente sus dimensiones anteriores; no se recorta para ocupar ese marco.
- El principal límite de la fotografía era la altura. El máximo de portada pasa de 1000 a 1200 px, siempre limitado al espacio visible descontando el navbar. Se redujeron espacios del encabezado (16/20→8/12 px) y del pie; el tamaño/tipografía del título no cambia. No se modifican los anchos generales, las series, las galerías ni la tienda.

## Comparación medida

Primera foto, fotografía completa, mismo viewport y densidad:

| Viewport | Antes: ancho×alto visible | Después: ancho×alto visible | Aumento del ancho | Final de controles |
|---|---:|---:|---:|---:|
| 1366×768 | 865×486 px | 943×530 px | 9 % | 755 px |
| 1920×1080 | 1399×787 px | 1479×831 px | 6 % | 1067 px |
| 2560×1440 | 1431×804 px | 1865×1048 px | 30 % | 1284 px |
| 360×800 | 320×180 px | 320×180 px | Sin cambio | 568 px |
| 390×800 | 350×197 px | 350×197 px | Sin cambio | 554 px |

Las tres vistas de escritorio entran con scrollY=0, título, fotografía, nombre y controles visibles. Los anchos de la tabla corresponden a la imagen efectivamente contenida, no solo a su contenedor. [Antes](capturas/antes-mediciones.json) y [después](capturas/despues-mediciones.json).

## Recursos y nitidez

- `sizes` se calcula a partir del marco observado y la proporción de cada imagen, reservando el espacio lateral de las flechas solamente en escritorio. El marco medido se mantiene separado de la posición de las flechas para evitar ciclos de redimensionado.
- Se añaden WebP de 4000×2250 para golden, walkers y forest, que cubren las fotos panorámicas más grandes a densidad 2×. La versión deportiva de 3200 px ya basta para su proporción. Se conservan todos los recursos previos.
- Se utilizaron los originales aprobados: 5794×3259, 4884×2747 y 5914×3327. Orientación EXIF, conversión del perfil original a sRGB, Lanczos y calidad 90 siguen el generador existente. Sin ampliación de fuentes ni edición artística. Las tres variantes tienen perfil ICC y añaden unos 4.94 MiB; [dimensiones y perfiles comprobados](capturas/imagenes-optimizadas.json).
- El generador acepta `--widths` y conserva las variantes anteriores del manifiesto. Para repetir esta ampliación: `python scripts/generatePortfolioImages.py --names golden walkers forest --widths 4000`. Requiere Pillow y los originales locales ignorados en `docs/portfolio-v2/fotos-originales/`. Los originales no se incorporan al commit.

## Comprobaciones reales

- **16 pruebas del carrusel correctas**, en Edge/Chromium y WebKit, con perfiles táctiles y escritorio. Navegación circular anterior/siguiente, elección directa de cada punto, estado activo, ausencia de pausa/contador visibles, Tab/Enter/Espacio, foco y anuncio manual.
- Se comprobó el temporizador con tiempos reales: avance en seis segundos; pausa por puntero y foco durante 6.5 segundos; reanudación al salir del componente; pausa con portada fuera de pantalla y con movimiento reducido. El estado de documento oculto se simuló con su señal de visibilidad: ambos motores headless mantienen visibles todas las pestañas y esa comprobación no se presenta como un cambio real de pestaña física.
- Las cuatro imágenes se recorrieron a 1366×768, 1920×1080 y 2560×1440 con **DPR 2**, y en celular a 360/390×800 con perfiles táctiles. Se verificaron foto completa (`object-fit: contain`), controles dentro del viewport, flechas fuera de la fotografía y alineadas verticalmente, correspondencia de `sizes` y resolución del recurso elegido suficiente para la densidad. Sin desbordamiento horizontal. Capturas comparativas en DPR 1 para escritorio y perfiles móviles, normalizadas a tamaño CSS.
- Regresión de Tienda: 50 casos pasaron en la ejecución conjunta con las pruebas de portada; dos cargas iniciales de WebKit excedieron el límite de `page.goto` mientras las suites corrían en paralelo. Esos dos casos (Achala y tienda a 360 px) se repitieron aisladamente y ambos pasaron. No falló la activación de enlaces. Se conservaron los 52 casos de navegación, cierre y teclado; 28 combinaciones se omiten por no corresponder a mouse/teclado o toque. El componente y estilos del navbar son idénticos a producción.
- Build final correcto, lint sin errores/advertencias, ocho pruebas unitarias correctas y `git diff --check` correcto. Permanece el aviso previo del tamaño del catálogo deportivo. Se separan `npm run test:cover` y `npm run test:navbar` para ejecutar las comprobaciones de cada componente.
- [Registro de pruebas, incluidos los dos timeouts y su repetición](capturas/pruebas.json). Los datos de eventos, rutas compatibles, selección, modal, paginación, mensajes de WhatsApp y las páginas interiores no se modifican; las pruebas unitarias existentes siguen protegiendo sus contratos.

## Acceso y límites

Local: **http://127.0.0.1:5175/**. Se entrega por commit/push para Preview, sin merge a main ni publicación de producción; esos pasos quedan a cargo de Juan.

Pruebas en Windows con Edge/Chromium 155 y WebKit 26.5, tamaños y densidades emulados; no equivalen a teléfonos físicos ni a Safari de iOS real. La comprobación de documento oculto utiliza una señal simulada, como se indicó. La cobertura de nitidez se comprobó hasta DPR 2 en escritorio; la preferencia del navegador y la resolución disponible siguen determinando la descarga. No se enviaron mensajes ni pedidos reales.

Capturas comparativas:

- 1366×768: [antes](capturas/antes-1366x768.png) · [después](capturas/despues-1366x768.png)
- 1920×1080: [antes](capturas/antes-1920x1080.png) · [después](capturas/despues-1920x1080.png)
- 2560×1440: [antes](capturas/antes-2560x1440.png) · [después](capturas/despues-2560x1440.png)
- Celular 360×800: [antes](capturas/antes-360x800.png) · [después](capturas/despues-360x800.png)
- Celular 390×800: [antes](capturas/antes-390x800.png) · [después](capturas/despues-390x800.png)
