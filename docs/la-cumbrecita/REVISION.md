# La Cumbrecita · Revisión de la entrega

Rama `feat/serie-la-cumbrecita`, desde **45cb5ce6e249e5a0e408860bcbe341a94688338d**, verificada como Production / success en Vercel. Esta base incluye navbar hamburguesa, Sobre mí, corrección táctil de Tienda, carrusel, amplitud y saltos naturales. Se reutilizó el worktree limpio existente y se conservaron los cambios ajenos del checkout original.

## Implementación

- Nueva ruta `/portfolio/la-cumbrecita`, cargada de forma diferida con el router existente. Se conserva el rewrite de Vercel para abrir y recargar rutas interiores.
- Doce fotografías, exactamente en el orden de FOTOS.csv. **DSC03521 está excluida; DSC03523 está incluida.** Sin títulos individuales inventados ni acción visible Ampliar. Las imágenes son los botones accesibles de apertura al visor.
- Etiqueta y título aprobados, con Cumbrecita. en cursiva en línea. Los dos párrafos iniciales quedan debajo, alineados a la izquierda y limitados a 78ch. Tras la cascada se ubican LAS LUCES DEL PUEBLO, Cuando cae la noche. y el último párrafo, antes de las cuatro fotos cálidas/nocturnas.
- Horizontales a todo el ancho general aprobado, de 90% / máximo 2200 px. Pares verticales centrados con separación de 46 px; cascada y lámparas individuales de ancho moderado. El par mixto mantiene la vertical menor a la izquierda, la horizontal mayor a la derecha y ambas centradas verticalmente. En celular se apilan en orden, con verticales de 280 px y horizontales al ancho disponible. Se conservan los límites internos del diseño y los márgenes existentes del sitio.
- Se reutilizan SeriesPhoto, ResponsivePhoto, SeriesViewer y SeriesInquiry: fotografía completa, navegación manual, contador, teclado, Escape, foco y conservación del scroll; consulta que identifica La Cumbrecita y confirma el enlace al WhatsApp existente. No se agregan precios ni checkout.
- La tarjeta del home usa DSC03544 y enlaza a la serie. San Marcos y Achala enlazan a La Cumbrecita; su cierre enlaza a ambas series y al portfolio. Se retira únicamente su estado pendiente. Las categorías y la tienda de paisajes todavía no implementadas conservan sus avisos.
- El navbar, la biografía, las fotografías y controles de portada, estilos de amplitud, galerías deportivas, datos, precios y utilidades de Cloudinary/WhatsApp no cambian. Las otras series solo reciben el enlace de navegación nuevo.

## Fuentes y nitidez

Se leyeron las referencias del checkout original, ubicadas en la subcarpeta la-cumbrecita-codex, y se copiaron al worktree. Antes de procesar o agregar archivos se ignoró `docs/la-cumbrecita/**/fotos/originales/`, que cubre la ubicación original anidada y la carpeta local de trabajo.

Se verificaron los doce JPG completos: horizontales de 4357–5946 px y verticales de 1933–3375 px de ancho. Los hashes de las copias coinciden con los originales suministrados. No se usaron las previews incrustadas en el HTML.

Generador reproducible: `python scripts/generateCumbrecitaImages.py` (requiere Pillow). Valida CSV, orden, existencia e integridad de todas las fuentes antes de escribir. Orientación EXIF, conversión del perfil original a sRGB, reducción Lanczos y WebP calidad 90 con ICC; sin recorte, ampliación ni edición artística.

**70 variantes**, aproximadamente 37.6 MiB en total versionado. Horizontales: 640, 960, 1440, 1920, 2560, 3200 y hasta 4400 px. Verticales: 480, 640, 960, 1440 y 1920 px. Si una fuente es menor que el ancho solicitado, se usa su máximo real. Cada visita descarga las variantes elegidas por el navegador, no todos los tamaños. Solo la apertura tiene carga prioritaria; las once inferiores son lazy.

srcset/sizes acompaña los anchos de pares, verticales, par mixto y visor. Se inspeccionan las doce fotografías hasta DPR 2 en escritorio y hasta DPR 3 en celular. DSC03582 tiene 4357 px de ancho: ese es su límite para la horizontal de 2200 px a DPR 2, unos 43 px menos que el doble exacto; se preserva la fuente sin ampliarla.

[Fuentes, hashes, dimensiones y perfiles de todos los WebP](capturas/recursos.json) · [Mediciones de las doce imágenes en seis viewports](capturas/mediciones.json).

## Comprobaciones reales

- **16 casos de La Cumbrecita correctos** en Edge/Chromium y WebKit con perfiles móviles y escritorio. Orden de las doce imágenes, identidad de cada archivo en el visor, DSC03523 incluida/DSC03521 ausente, los tres párrafos y su posición, h1/cursivas, foto completa, nitidez del recurso elegido y ausencia de desbordamiento.
- Viewports: 360×800, 390×800, 768×1024, 1366×768, 1920×1080 y 2560×1440. Se recorren y cargan las doce imágenes en cada tamaño. Se comprueba el par mixto y el centrado de las verticales, y se revisan las capturas. Resolución suficiente para la densidad comprobada o máxima original disponible, como se indicó para DSC03582.
- Visor: toque/clic, navegación circular de las doce, flechas de teclado, contador, Escape, devolución de foco y posición de lectura. Permanece en la misma imagen durante 6.5 segundos, sin avance automático. A 844×390 los controles y la ubicación quedan dentro del viewport y la imagen usa contain; Tab/Shift+Tab conservan el orden y el foco visible. Se comprueban también Enter y Espacio: tras ampliar esa cobertura se repitieron los cuatro casos de visor, todos correctos.
- Accesos home → serie y ambas series → La Cumbrecita; regresos al portfolio/San Marcos/Achala, apertura y recarga directa. Consulta preparada con «La Cumbrecita», confirmación y enlace al mismo WhatsApp; sin envío real.
- **58 casos de Tienda/navbar correctos**, incluidos toques desde La Cumbrecita y siete rutas anteriores, apertura/cierre, ambos destinos con un solo toque, destino actual, opción no disponible, toque exterior, mouse y teclado. Se omiten 30 combinaciones que no corresponden al dispositivo.
- **28 casos de Sobre mí/navbar correctos**, conservando biografía, contacto, foco, anclas repetidas/recarga, historial y orientación, ahora también desde La Cumbrecita. Cuatro casos solo móviles se omiten en escritorio.
- **16 casos de portada correctos**, con automatismo y pausas mediante tiempos reales, flechas/puntos/teclado, ausencia de Pausar, tamaño móvil, fotos completas, recursos adecuados y controles visibles en escritorio. La señal de documento oculto está simulada, como en la suite existente.
- **12 casos de flujos preservados correctos**: carga real de Cloudinary, selección tras recargar, paginación, modal deportivo y visores de San Marcos/Achala, foco, preparación de pedido interceptada, confirmación de contacto y compatibilidad /#eventos. No se envían mensajes ni pedidos.
- Build y lint correctos; **ocho pruebas unitarias correctas**, incluido el contrato de la nueva ruta y las URL deportivas publicadas. git diff --check correcto. Sigue el aviso previo del tamaño del chunk del catálogo deportivo. [Resultados](capturas/pruebas.json).

Comandos: `PLAYWRIGHT_CHROMIUM_CHANNEL=msedge`, `npm run test:cumbrecita -- --workers=1`, `npm run test:navbar -- --workers=1`, `npm run test:about -- --workers=1`, `npm run test:cover -- --workers=1`, `npx playwright test --config tests/preservedFlows.config.js --workers=1`, build, lint y npm test.

Capturas de los anchos 360, 390, 768, 1366, 1920 y 2560 en capturas/: encabezado, par vertical, relato nocturno, par mixto y cierre. Representativas:

- Encabezado: [1366×768](capturas/inicio-1366.png), [1920×1080](capturas/inicio-1920.png), [celular 390](capturas/inicio-390.png).
- Pares: [vertical 1920](capturas/par-vertical-1920.png), [mixto 1920](capturas/par-mixto-1920.png), [mixto celular](capturas/par-mixto-390.png).
- Cierre: [relato nocturno](capturas/relato-nocturno-1366.png), [fotografía final 2560](capturas/cierre-2560.png), [final celular](capturas/cierre-390.png).
- [Visor WebKit con poca altura, 844×390](capturas/webkit-visor-844x390.png).

## Acceso y límites

Local: http://127.0.0.1:5175/portfolio/la-cumbrecita. Se entrega por PR y Preview, sin merge a main ni publicación en producción. Juan realizará el merge manual después de revisar.

Se usan Edge/Chromium y WebKit en Windows, con interacción táctil, tamaños y densidades emulados. No se prueban teléfonos físicos ni Safari de iOS real. La comprobación previa del carrusel sobre documento oculto usa una señal simulada: el navegador headless mantiene las pestañas visibles. Los enlaces de WhatsApp se inspeccionan o interceptan en el navegador de pruebas; no se envían mensajes ni pedidos reales.
