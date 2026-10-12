# Corrección del navbar Tienda en celular

Revisión: **12 de octubre de 2026**. Rama `fix/navbar-tienda-mobile`, basada en `origin/main` **b09f967c8e5f9984496072e6c00ce09ba2d8be94**. GitHub/Vercel registran ese commit como el último despliegue **Production / success**, después del merge del portfolio aprobado. La corrección se realizó en un worktree aislado; se conservaron los cambios locales del repositorio principal y la rama `feat/portfolio-v2`.

## Causa reproducida antes de editar

Se ejecutó el navbar original de ese commit en el servidor local y se usaron **toques de Playwright** (`hasTouch`, `isMobile`, `tap`), que generan eventos táctiles nativos del motor; no se trató de un clic con la ventana reducida.

En **WebKit 26.5**, tocar Tienda enfoca `summary` y abre `details`. Al tocar cualquiera de los dos enlaces, la secuencia observada fue:

1. `pointerdown` con `pointerType: touch` y `touchstart/touchend` sobre el enlace correcto.
2. `mousedown` sobre el enlace y `focusout` de `summary` con destino de foco nulo (`relatedTarget = null`).
3. El `onBlur` original hacía `!details.contains(null)`, cerrando el submenú inmediatamente.
4. `mouseup` y `click` terminaban sobre el contenido de debajo, sin activar el enlace. La URL continuaba en `/`.

Se reprodujo tanto con **Fotos de carreras** como con **Cómo comprar**. `elementFromPoint` identificó el enlace real, con `pointer-events: auto` y el `href` correcto; no se encontró una capa interceptora ni un manejador que cancelara la navegación. Los enlaces no llegaban a recibir el clic.

En **Microsoft Edge 155.0.4283.45 / Chromium**, con emulación táctil, el foco pasó al enlace y la navegación original funcionó. Eso no sustituye las comprobaciones de Juan en teléfonos: identifica exactamente el caso reproducido en los motores disponibles y no atribuye una causa exclusiva a todos los dispositivos sin haberlos probado.

Evidencia de eventos del código original: [Fotos de carreras](capturas/produccion-fotos-eventos.json), [Cómo comprar](capturas/produccion-ayuda-eventos.json). Evidencia con la corrección: [Fotos de carreras](capturas/corregido-fotos-eventos.json), [Cómo comprar](capturas/corregido-ayuda-eventos.json).

## Solución

- El navbar registra si la interacción de puntero comenzó dentro del submenú. En ese caso, una pérdida de foco sin destino no lo oculta antes del clic. Un evento de teclado restablece esa información, conservando el cierre al tabular fuera, incluso si el destino de foco es nulo.
- Los toques/clics exteriores se detectan por `pointerdown`, sin cancelar eventos ni bloquear el enlace. El listener se retira al desmontar el componente.
- Ambos enlaces cierran el menú al activarse. Esto también cubre navegar a la página actual, cuando no cambia `pathname`. Se mantiene el cierre existente por cambio de ruta/hash y Escape con devolución de foco a Tienda.
- Se conserva `details/summary` y la navegación nativa de React Router. Los dos enlaces incluyen `tabIndex={0}` para garantizar su participación en el orden normal de tabulación de WebKit: sin él, este motor saltaba desde Tienda al botón Pausar. No se añaden índices positivos ni controles personalizados que sustituyan el comportamiento nativo.
- **Fotografías para encargar** no tiene página ni ruta implementada. Permanece como texto sin `href`, sin acción ni foco de enlace, con `aria-disabled`, color secundario y la indicación visible **En preparación · paisajes y viajes**. No se implementa una nueva tienda.
- No se cambian fotografías, amplitud, portada, series, galerías, datos, Cloudinary, selección, precios, paginación, visores ni WhatsApp. No se modifica la configuración de despliegue.

## Comprobaciones reales

- **52 pruebas de navegador correctas**, sin reintentos ni fallos intermitentes; 28 casos omitidos por no corresponder al tipo de proyecto (teclado/mouse en móviles y toques en escritorio). [Registro por prueba](capturas/pruebas-navegador.json).
- Emulación táctil con WebKit y Chromium a **360×800, 390×800 y 430×800**. Desde inicio, San Marcos, Achala, tienda deportiva, evento DH, galería Entrenamientos y Cómo comprar: apertura, activación con un toque de cada enlace, destino y encabezado correctos, cierre y repetición de la opción estando en su destino.
- Apertura/cierre tocando Tienda; toque exterior; opción pendiente sin navegación, sin enlace ni tabulación; ausencia de desbordamiento en esas vistas. Sin errores JavaScript en los recorridos de navegación.
- Escritorio: **1366×768 en Edge/Chromium y 1920×1080 en WebKit**. Clic y navegación de ambos enlaces; Tab entre opciones, Shift+Tab para salir, activación con Enter, cierre al tabular fuera, Escape y foco de regreso a Tienda. Se usa Tab normal en ambos motores.
- La misma prueba de regresión táctil se ejecutó temporalmente contra el navbar original: **falló** porque permanecía en `/` en vez de `/tienda/deportes`. Se restauró el archivo corregido y la misma prueba **pasó**, confirmando que detecta la interacción que originó el fallo.
- `npm run build`, `npm run lint`, las **ocho pruebas unitarias** de `npm test` y `git diff --check` correctos. El build conserva el aviso anterior del tamaño del catálogo deportivo.
- Playwright se agrega como dependencia de desarrollo y comando separado, sin aumentar el JavaScript de producción. Los reportes, trazas y resultados locales están ignorados por Git y ESLint; las capturas y evidencia seleccionadas sí se versionan.

## Repetir y revisar

```sh
npm ci
npx playwright install chromium webkit
npm run test:navbar
npm run lint
npm test
npm run build
```

Se puede usar Edge instalado con `PLAYWRIGHT_CHROMIUM_CHANNEL=msedge`. Para comprobar un servidor propio, configurar `NAVBAR_TEST_BASE_URL`; de lo contrario, la prueba inicia/reutiliza el servidor local en el puerto 5175. La ejecución registrada usó Edge como motor Chromium y WebKit instalado por Playwright.

Acceso local del worktree: **http://127.0.0.1:5175/**. La rama se entrega por push para generar **Preview**; no se fusiona con main ni se publica en Production.

**Límites:** pruebas en Windows con motores de escritorio y emulación táctil, perfiles de Pixel/iPhone y tamaños indicados; no hubo pruebas en teléfonos físicos, Safari de iOS instalado ni Android real. La Preview puede exigir autenticación de Vercel. No se hicieron compras ni envíos reales por WhatsApp.

Capturas revisadas:

- [WebKit · menú 390 px](capturas/webkit-390-menu.png)
- [WebKit · destino después de un toque](capturas/webkit-390-destino.png)
- [Chromium · menú 360 px](capturas/chromium-360-menu.png)
- [Chromium · destino después de un toque](capturas/chromium-360-destino.png)
- [Escritorio · menú 1366 px](capturas/escritorio-1366-menu.png)
- [Escritorio · destino](capturas/escritorio-1366-destino.png)

## Estado de la Preview

La corrección está subida y disponible en el PR borrador #11. Después del push y de abrir el PR, GitHub no registró ningún check ni despliegue de Vercel para el commit de la corrección. La Preview remota queda pendiente de revisar la integración del proyecto; esta sesión no tiene Vercel instalado/conectado ni un acceso autenticado para iniciarla manualmente. La versión local sí está disponible y comprobada. Producción y main no se modificaron.
