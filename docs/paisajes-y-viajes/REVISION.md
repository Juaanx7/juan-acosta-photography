# Paisajes y viajes · Revisión de la entrega

Rama `feat/portfolio-paisajes-viajes`, desde `843daab61f1be1658e94758b5bb2fb1b0aefcdba`. Se comprobó que main y el último despliegue Production / success apuntan a esa versión (merge de La Cumbrecita). Se reutilizó el worktree limpio existente; los cambios de benchmark y las referencias del checkout original se conservaron.

## Implementación

- Nueva ruta `/portfolio/paisajes-y-viajes`, cargada de forma diferida mediante React Router. La categoría Paisajes y viajes del home queda activa conservando su portada aprobada. El regreso lleva a `/#portfolio` y el cierre enlaza a las tres series implementadas.
- Introducción y texto aprobados; serif con viajes. en cursiva, en la misma frase y con ajuste natural. Relato debajo del título, alineado a la izquierda, máximo 660 px. Paleta clara y detalles discretos de la referencia, aislados en los estilos de la nueva galería.
- Exactamente veinte fotos y ubicaciones del CSV. Se conserva el ancho fluido vigente (aproximadamente 90%, máximo 2200 px), con fotos completas y proporción original. Filas: apertura; dos pares; Los Terrones ancho; par mixto 1:1.8 centrado; par; La Viña ancho; dos pares; atardecer ancho; par; dos verticales nocturnas al 76%. En celular todas usan una columna y todo el ancho disponible, incluidas las verticales.
- Reutilización de SeriesPhoto, ResponsivePhoto y SeriesViewer. Cada imagen sigue siendo un botón accesible, sin acción visible Ampliar. El visor es manual; actualiza ubicación y contador, mantiene flechas, Escape, foco contenido, devolución al disparador y posición de lectura. La única ampliación del componente compartido es aceptar la ubicación de cada foto y conservar la ubicación general como alternativa para las series existentes.
- Navbar, carrusel, Sobre mí, estilos y fotografías de las tres series y lógica deportiva sin cambios. Sin controles de demostración, iframe de referencia, imágenes base64 de producción, filtros, paginación de portfolio ni controles de compra nuevos.

## Fuentes y recursos

Se verificaron y decodificaron los veinte JPG indicados; no falta ninguna fuente. Los hashes coinciden con el checkout original y las fuentes siguen intactas. La carpeta `docs/paisajes-y-viajes/**/fotos/originales/` se ignoró antes de cualquier incorporación a Git. No se versionan originales.

| Orden | Archivo | Ubicación |
| --- | --- | --- |
| 1 | `DSC08585.jpg` | San Marcos Sierras |
| 2 | `DSC00793.jpg` | Camino del Cuadrado |
| 3 | `DSC06286.jpg` | Camino del Cuadrado |
| 4 | `DSC02826.jpg` | Pampa de Achala |
| 5 | `DSC02934.jpg` | Pampa de Achala |
| 6 | `DSC06392.jpg` | Los Terrones |
| 7 | `DSC06547.jpg` | Cerro La Banderita |
| 8 | `DSC06484-Editar.jpg` | Cerro La Banderita |
| 9 | `DSC06023.jpg` | Los Terrones |
| 10 | `DSC06975.jpg` | Ongamira |
| 11 | `DSC07567.jpg` | Dique La Viña |
| 12 | `DSC03691.jpg` | San Marcos Sierras |
| 13 | `DSC06836.jpg` | Cerro La Banderita |
| 14 | `DSC01960.jpg` | San Marcos Sierras |
| 15 | `DSC02988.jpg` | Pampa de Achala |
| 16 | `DSC05652.jpg` | San Marcos Sierras |
| 17 | `DSC07903.jpg` | El Mástil · Los Cocos |
| 18 | `DSC08261.jpg` | San Marcos Sierras |
| 19 | `DSC00888.jpg` | San Marcos Sierras |
| 20 | `DSC06005.jpg` | San Marcos Sierras |

El generador `scripts/generateLandscapesImages.py` valida el catálogo y todas las fuentes antes de escribir. Mantiene el flujo Pillow/Lanczos/WebP calidad 90, método 6 y gestión de perfiles hacia sRGB: sin recorte, ampliación, cambio de edición ni nitidez creativa. Horizontales: 640, 960, 1440, 1920, 2560, 3200 y hasta 4400 px; verticales: 480, 640, 960, 1440 y 1920 px. Cada tamaño se limita al original (DSC08261 termina en 4012 px).

Hay **127 variantes nuevas y 7 reutilizadas, 134 en total**. DSC02988 coincide exactamente con el original de Achala (SHA-256 `a8f4b8da953d0f51b52d2e9555b7a6d4cf082e484eac7f3d5a7e4b6fa0bda13b`); se reutilizan sus siete archivos sin duplicarlos. Se validaron dimensiones, proporciones, perfiles ICC y ausencia de ampliación en los 134 WebP. Los recursos nuevos suman aproximadamente 70.9 MiB en el repositorio; el navegador descarga solamente las variantes seleccionadas mediante srcset. La apertura tiene prioridad, las otras diecinueve son lazy y todas declaran dimensiones.

## Comprobaciones reales

- Edge/Chromium y WebKit de Playwright en Windows. Interacción táctil mediante tap y touchscreen; emulación Pixel 7 e iPhone 13, sin teléfonos físicos ni Safari real.
- Galería: 360×800, 390×800, 768×1024, 1366×768, 1920×1080, 1920×600 y 2560×1440. Orden, ubicaciones, proporciones y tamaños de filas comprobados; sin desbordamiento horizontal, recorte ni deformación. Capturas y mediciones de los seis tamaños principales. Alta densidad en las galerías completas; apertura comprobada además en un contexto DPR 1. Los archivos elegidos cubren el tamaño visible y DPR sin exceder la fuente.
- Acceso desde home, apertura/recarga directa, regreso al portfolio y navegación real a las tres series. Las anclas Sobre mí y Contacto desde la galería también se activaron por toque y cerraron el menú móvil. No hay acordeones ni vínculos de demostración.
- Visor: recorrido de las veinte fotos y ubicaciones, contador, ausencia de avance automático tras 6.5 segundos, toque/Enter/Espacio, flechas, Escape, Tab/Shift+Tab, foco visible y retorno al mismo botón/scroll. Visor de poca altura 844×390, controles, ubicación e imagen completos dentro de pantalla.
- `npm run build` correcto; permanece el aviso preexistente por el tamaño del catálogo deportivo. `npm run lint` correcto. `npm test`: nueve pruebas correctas, incluidos contratos independientes de catálogo, recursos, rutas publicadas, Cloudinary y WhatsApp. `npm run test:landscapes -- --workers=1`: doce pruebas correctas.
- `npm run test:navbar -- --workers=1`: 63 casos correctos, 32 omitidos por tipo de interacción y un timeout al cargar `/tienda/deportes` en WebKit 390, antes de la interacción. Ese caso se repitió con `--project=webkit-touch-390 --grep "desde tienda" --repeat-each=3`: tres resultados correctos, sin cambios en código ni tiempo de espera. La nueva galería pasó en los seis proyectos táctiles; escritorio, teclado y opción pendiente también comprobados.
- `npx playwright test --config tests/preservedFlows.config.js --workers=1`: doce correctas. Se cargaron imágenes reales de Cloudinary; selección persistente tras recarga, paginación, modal y pedido por WhatsApp con apertura externa interceptada. Las tres series conservan su ubicación, navegación manual, contador, Escape y retorno de foco. Contacto conserva confirmación y número existente, sin envío real.
- `npm run test:cover -- --workers=1`: dieciséis correctas. Flechas, puntos, Enter/Espacio, avance cada seis segundos y pausas por puntero/foco/fuera de pantalla, movimiento reducido y evento simulado de visibilidad. Se preservan foto completa, nitidez y controles visibles en los escritorios aprobados.
- `npm run test:about -- --workers=1`: 28 correctas y 4 omisiones esperadas de escenarios exclusivamente móviles. Sobre mí desde las nueve rutas de origen, anclas repetidas, recarga directa, orientación, foco e historial.

## Capturas y datos

- [Correspondencias de las veinte fotos](capturas/correspondencias.jpg)
- [Inicio escritorio · 1366×768](capturas/inicio-1366.png)
- [Inicio escritorio · 1920×1080](capturas/inicio-1920.png)
- [Inicio escritorio · 2560×1440](capturas/inicio-2560.png)
- [Tablet · 768×1024](capturas/inicio-768.png)
- [Celular · 360×800](capturas/inicio-360.png)
- [Celular · 390×800](capturas/inicio-390.png)
- [Apertura completa · escritorio](capturas/apertura-completa-1366.png)
- [Par mixto · escritorio](capturas/par-mixto-1366.png)
- [Par mixto · celular](capturas/par-mixto-390.png)
- [Cierre nocturno · escritorio](capturas/cierre-nocturno-1366.png)
- [Cierre nocturno · celular](capturas/cierre-nocturno-390.png)
- [Tres series · escritorio](capturas/series-1366.png)
- [Tres series · celular](capturas/series-390.png)
- [Visor WebKit · 844×390](capturas/webkit-visor-844x390.png)
- [Mediciones de tamaños y recursos elegidos](capturas/mediciones.json)
- [Verificación de fuentes, hashes y variantes](capturas/recursos.json)
- [Anclas del home desde la galería](capturas/anclas.json)

## Revisión y límites

Local: http://127.0.0.1:5175/portfolio/paisajes-y-viajes. Para reiniciar desde el worktree: `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort`.

Las pruebas son locales y emuladas: no certifican teléfonos físicos, Safari de macOS/iOS, lectores de pantalla ni condiciones de red móvil real. No se enviaron mensajes ni pedidos reales por WhatsApp. El HTML de referencia se conserva únicamente como documentación y se inspeccionó renderizado; no se usa en producción. Juan realizará la revisión, el merge y la publicación manualmente; esta entrega no modifica main ni Production.

Commit de implementación: **`c5fefb722f617aea7b25c932345c8338185d5a1c`**, «feat: implementar galería Paisajes y viajes». Código, imágenes, pruebas e informe inicial pertenecen a ese commit; una actualización documental agrega estos enlaces tras confirmar el despliegue.

- [PR borrador #15](https://github.com/Juaanx7/juan-acosta-photography/pull/15)
- [Preview de la implementación](https://juan-acosta-photography-i37p9evmi-juans-projects-1e5bf112.vercel.app/portfolio/paisajes-y-viajes)
- [Rama remota](https://github.com/Juaanx7/juan-acosta-photography/tree/feat/portfolio-paisajes-viajes)

GitHub/Vercel confirmó **Preview / success** para el commit de implementación. La URL redirige a Login de Vercel sin una sesión autorizada; por eso la validación funcional reportada es local. La Preview corresponde al código de implementación; las actualizaciones documentales no cambian la aplicación. Después de subir, main y el último Production siguieron en `843daab61f1be1658e94758b5bb2fb1b0aefcdba`. No se realizó merge.
