# Benchmark de dorsales — Etapa 3A

Infraestructura local y aislada para comparar motores sobre los mismos archivos.
**Actualmente solo existe `mock`: NO realiza OCR, NO usa IA y NO llama APIs.**
No hay servidor Python, dependencias externas ni conexión con PlateEditor.

## Requisitos y comandos rápidos

Python **3.10 o posterior**, biblioteca estándar. No hay paquetes que instalar.
Para `list-cloudinary` y `register-cloudinary` también se utilizan Node.js y Vite
ya presentes en este proyecto. No se cargan React, la configuración del sitio,
el plugin del editor ni archivos `.env`. Los comandos de evaluación siguen siendo
Python local y no necesitan Node ni Internet.
Desde la raíz del proyecto:

```powershell
python benchmark/benchmark.py --help
python -m unittest discover -s benchmark/tests -v
python benchmark/benchmark.py validate
python benchmark/benchmark.py run --engine mock --variant web --split tuning
python benchmark/benchmark.py evaluate --run ID_DEVUELTO
```

El dataset real se entrega VACÍO. `validate` y `run` fallarán con un mensaje
explicativo hasta cargar los casos, ambas variantes y la referencia humana.
Los tests sí funcionan inmediatamente: generan un dataset sintético temporal,
ejecutan la CLI completa y eliminan sus imágenes, runs y reportes al terminar.

Si Windows no encuentra `python`, usar `py -3` si está disponible o la ruta de un
Python instalado. En el entorno donde se verificó esta implementación se usó:

```powershell
$pythonBenchmark = 'C:\Users\Juan Acosta\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $pythonBenchmark -m unittest discover -s benchmark/tests -v
& $pythonBenchmark benchmark/benchmark.py --help
```

Esa ruta es específica de esa máquina; no forma parte de la implementación.

## Estructura

```text
benchmark/
  benchmark.py             CLI: validate, register, run, evaluate
  data.py                  JSON, hashes, dimensiones y validación
  cloudinary.py            resolución y congelación de URLs públicas
  export-catalog.mjs       exportación de events.js sin React ni servidor persistente
  runner.py                ejecución y snapshots
  evaluate.py              métricas y resumen de consola
  engines/
    base.py                ImageInput, Detection, Engine y validación del contrato
    mock.py                simulación configurable por hash de imagen
    __init__.py            registro explícito de motores
  dataset/
    manifest.json          catálogo y variantes congeladas
    ground-truth.json      referencia humana independiente
    images/web/
    images/high/
  results/<runId>/
    run.json               configuración y snapshot del dataset/referencia
    results.jsonl          una línea por foto, raw + normalized
  reports/<runId>-threshold-<valor>.json
  tests/test_benchmark.py  fixtures sintéticos y pruebas
```

JSON facilita editar y revisar el manifiesto, la referencia y los reportes.
JSONL permite guardar resultados incrementalmente: una línea completa por foto,
sin tener que reescribir los resultados anteriores. El dataset, imágenes y
resultados son datos distintos; no se mezclan con la metadata de la aplicación.

La `.gitignore` local excluye imágenes, resultados crudos y cachés de Python/Vite.
El código, README, manifiesto, referencia y **reportes JSON** pueden versionarse.
Los reportes no se agregan solos: elegirlos mediante `git add benchmark/reports/...`.
Las imágenes congeladas y
los resultados deben respaldarse por separado; ignorarlos en Git no es un backup.

## Construir manualmente el dataset

Elegir las fotografías antes de comparar motores. Objetivo futuro: unas 80 tomas,
con variantes de calidad `web` y `high`. No se seleccionan ni etiquetan fotos reales
automáticamente.

`manifest.json` contiene `schemaVersion: 1`, una `datasetVersion` explícita y `cases`.
Ejemplo **FICTICIO**, solo para mostrar la estructura (no copiar como etiqueta real):

```json
{
  "schemaVersion": 1,
  "datasetVersion": "mi-dataset-v1",
  "cases": [
    {
      "caseId": "SYNTHETIC-example",
      "eventId": "SYNTHETIC-event",
      "photoId": "SYNTHETIC-photo",
      "categoryId": null,
      "sequenceId": "SYNTHETIC-sequence-1",
      "split": "tuning",
      "condition": "clear",
      "tags": ["backlight"],
      "variants": {}
    }
  ]
}
```

- `caseId`: único en todo el dataset, letras ASCII, números, guiones o guion bajo.
- `eventId` + `photoId`: pareja única. El mismo photoId puede existir en otro evento.
- `categoryId`: opcional, string o null.
- `sequenceId`: obligatorio. Compartirlo entre tomas de una misma ráfaga dentro
  de un evento; usar uno propio para una toma aislada. El sistema no deduce ráfagas.
- `split`: `tuning` para ajustes de reglas, prompts y thresholds; `evaluation`
  reservado para medir la configuración final. Nunca ajustar mirando evaluation.
- `condition`: condición principal, una de las siguientes:
  `clear`, `small`, `tilted`, `mud_dust`, `motion_blur`, `partially_occluded`,
  `multiple_riders`, `no_visible_plate`, `ambiguous`.
- `tags`: array opcional de strings para condiciones secundarias; usar nombres
  consistentes. `multiple_riders` como tag también entra en ese subreporte.

Una secuencia no puede repartirse entre splits. También se detectan imágenes de
contenido idéntico entre splits mediante sus hashes. Esto no detecta tomas parecidas:
la agrupación de ráfagas sigue siendo una responsabilidad humana.

Cambiar `datasetVersion` al modificar selección, archivos o etiquetas. Los hashes
del manifiesto y de la referencia también se guardan, para detectar cambios incluso
si alguien olvida actualizar la versión.

## Registrar imágenes sin modificar maestros

Primero crear el caso en el manifiesto; `variants` puede empezar vacío. Luego:

```powershell
python benchmark/benchmark.py register --case MI_CASO --variant web --source 'D:\Exportaciones\foto-web.jpg'
python benchmark/benchmark.py register --case MI_CASO --variant high --source 'D:\Exportaciones\foto-high.jpg'
```

`register` copia el archivo a `dataset/images/<variant>/<sha256>.<extensión>` y
actualiza SOLO ese caso/variante del manifiesto con `path`, `sha256`, `width`,
`height`. No renombra, edita ni sobrescribe el archivo fuente. Si el destino existe,
verifica su contenido y lo reutiliza; no lo sobrescribe. Registrar otra versión
cambia la referencia del manifiesto, pero no elimina copias anteriores.

Los paths son relativos al directorio del dataset. Se rechazan rutas que escapen
de él. Los datasets alternativos de pruebas también deben vivir bajo `benchmark/`:

```powershell
python benchmark/benchmark.py validate --dataset benchmark/mi-dataset
```

No hay descargas en `validate`, `run` ni `evaluate`. Se pueden incorporar archivos
locales con `register` o congelar URLs públicas con `register-cloudinary`, explicado
abajo. Todos los motores recibirán los mismos bytes locales congelados.

Formatos soportados: PNG, JPEG y WebP. Las dimensiones se leen de sus cabeceras,
sin instalar un decodificador. Esto NO certifica que todos los píxeles sean
decodificables; el futuro motor debe reportar un error técnico si no puede leerlos.
Las dimensiones son las del raster: exportar imágenes ya orientadas correctamente,
sin depender de rotación EXIF. No se corrige orientación ni se reencodea la imagen.
No se admiten RAW, HEIC o AVIF en esta etapa: exportarlos previamente a un formato
compatible. `high` debe aportar detalle real; ampliar `web` no lo recupera.

## Ground truth

### Piloto real: elegir y registrar desde Cloudinary

Primero listar candidatos, sin descargarlos ni clasificarlos:

```powershell
python benchmark/benchmark.py list-cloudinary --event nacional-enduro-las-pircas-2026 --limit 20
python benchmark/benchmark.py list-cloudinary --event nacional-enduro-las-pircas-2026 --category circuito-molle --offset 20 --limit 20
```

La salida incluye ID, categoría, `image`, `thumbnail` y `publicId`. Abrir las URLs
para revisar visualmente los candidatos. La herramienta no adjudica condiciones,
no detecta ráfagas y no propone números esperados.

Después de elegir una foto y revisar su condición, registrarla. **El siguiente
comando es un ejemplo de sintaxis; `clear` debe ser tu decisión visual**, no una
etiqueta previamente comprobada para esta fotografía:

```powershell
python benchmark/benchmark.py register-cloudinary --event nacional-enduro-las-pircas-2026 --photo DSC03841 --split tuning --condition clear --sequence molle-rafaga-01
```

`--sequence` es obligatorio. Usar el mismo valor para fotos de una misma ráfaga;
si es una toma aislada puede ser su photoId. No repartir una secuencia entre
`tuning` y `evaluation`: el registro lo rechaza antes de descargar.

El comando crea automáticamente un caso cuyo ID es `eventId--photoId`, con:

- eventId, photoId y categoryId obtenidos del catálogo real;
- split, condition y sequenceId que elegiste explícitamente;
- tags vacío, editable posteriormente;
- publicId y variantes web/high con path, SHA-256, width y height;
- procedencia de cada variante: sourceUrl, downloadedAt UTC y requestAccept.

No hay que editar paths ni hashes. No crea ni modifica `ground-truth.json`.
Por lo tanto, `validate` indicará referencia faltante hasta que la completes.

### De dónde salen web y high

Un exportador pequeño carga **el `events.js` real con el cargador local de Vite**
y emite JSON por stdout. No analiza JavaScript mediante expresiones regulares ni
deduce el catálogo solo por archivos sueltos de `generated/`. También detecta
eventos o photoIds inexistentes y coincidencias ambiguas dentro de un evento.

`web` usa exactamente la URL `image` del catálogo, no `thumbnail`. Como `f_auto`
negocia formato según el cliente, la descarga fija `Accept: image/jpeg,image/png,image/webp`.
Se conserva esa cabecera y el formato real se reconoce por firma; los bytes pueden
diferir de los que recibe un navegador que negocia AVIF. La transformación y tamaño
siguen siendo los de la web. Una vez congelados, todos los motores usan esos bytes.

Para `high` se verifica el contrato de los scripts actuales:

```text
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_1200/v<version>/<publicId>.<ext>
```

Se comprueba que publicId coincida exactamente con evento/categoría/foto y con el
asset de esa URL. Se conserva cloud, recurso image/upload, versión, publicId y
extensión, retirando únicamente la transformación de entrega. No se agrega un
ancho mayor ni ninguna operación de resize o superresolución.

`high` significa el asset almacenado accesible sin transformación: **no significa
RAW**, ni garantiza que no haya sido comprimido o reducido antes de subirse.
Puede medir lo mismo que web si no hay más resolución disponible. Si mide menos,
el comando falla para que se revise el origen o un posible upscale previo de web.
Si cambia el formato de URLs del proyecto, faltan versiones, hay transformaciones
no reconocidas o publicId no coincide, falla explícitamente: no intenta adivinar.

### Seguridad, descargas y repeticiones

No usa `CLOUDINARY_API_SECRET`, SDK administrativo ni credenciales. Acepta solo
HTTPS del host público `res.cloudinary.com`, sin redirecciones, URLs arbitrarias,
parámetros ni rutas aportadas por el usuario. Valida los IDs antes de resolverlos.

Las descargas tienen timeout, límite de 100 MiB y controles de HTTP, Content-Type,
Content-Length cuando existe, firma, dimensiones y estructura mínima del archivo.
Rechaza HTML y archivos truncados. Estos controles no sustituyen una decodificación
completa de todos los píxeles; no se instalaron bibliotecas nuevas para ello.

Primero descarga/verifica ambos archivos. Solo después actualiza el manifiesto
mediante reemplazo temporal. Ante un fallo retira los temporales y las imágenes
nuevas de ese intento; deja intactos el manifiesto y los archivos preexistentes.
Un lock impide dos registros simultáneos y se detectan ediciones del manifiesto
durante la descarga. Una terminación abrupta del proceso puede dejar el lock o
archivos huérfanos, pero no un manifiesto apuntando a descargas a medio escribir.
Antes de retirar un lock manualmente, verificar que no haya un registro en curso.

**Si la foto ya está registrada, el comando se detiene sin redescargar ni sobrescribir.**
Usar el caso congelado existente. Para repetir la comparación con nuevas imágenes,
crear otro dataset bajo benchmark/, con manifiesto/referencia propios y versión
nueva, y pasarlo con `--dataset`. No hay reemplazo implícito ni opción destructiva.

### Flujo para las primeras 8–12 fotos

1. Listar candidatos y mirar las imágenes. Buscar variedad, evitando tomas casi
   idénticas de una misma ráfaga. No es obligatorio cubrir todas las condiciones.
2. Elegir ID, condición principal, split y sequenceId mediante revisión humana.
3. Ejecutar `register-cloudinary` una vez por foto seleccionada.
4. Abrir ambos paths locales registrados en el manifiesto para comparar detalle.
5. Completar ground truth por caseId, únicamente con evidencia de esa toma.
   No copiar `src/data/plates/`; algunas etiquetas allí nacieron como pruebas.
6. Repetir hasta reunir aproximadamente diez casos variados.
7. Ejecutar `python benchmark/benchmark.py validate` y resolver los errores.
8. Con el dataset válido, probar la infraestructura mock con web y high. Estas
   métricas siguen siendo sintéticas: aún no miden reconocimiento real.

Todo lo posterior a la congelación funciona sin Cloudinary ni Internet.

### Verificar Git

La regla `**/images/**/*` en `benchmark/.gitignore` excluye los binarios de ambas
variantes, incluyendo datasets alternativos bajo benchmark/. Amplía la protección
previa de `dataset/images/`; las carpetas y `.gitkeep` tienen excepciones. No se
ignora benchmark completo y no se usa Git LFS. Para comprobarlo desde la raíz:

```powershell
git check-ignore -v benchmark/dataset/images/web/prueba.jpg
git check-ignore -v benchmark/dataset/images/high/prueba.webp
git check-ignore benchmark/reports/reporte-que-quiero-conservar.json
git status --short --untracked-files=all benchmark
```

Los dos primeros deben mostrar la regla. El reporte no debe resultar ignorado
(exit code 1 de check-ignore). Recordar que un `git add -f` explícito puede saltar
cualquier ignore; la protección es contra agregados accidentales normales.

### Formato de la referencia

`ground-truth.json` es un objeto con `schemaVersion: 1` y `cases` indexado por caseId.
Cada caso debe tener una referencia verificada. Ejemplo **sintético**:

```json
{
  "schemaVersion": 1,
  "cases": {
    "SYNTHETIC-example": {
      "status": "readable",
      "plates": ["007", "231"]
    }
  }
}
```

Estados permitidos:

| Estado | Regla |
| --- | --- |
| `readable` | Uno o varios dorsales completos legibles; array no vacío |
| `no_visible_plate` | Evaluación humana sin dorsal visible; `plates: []` |
| `ambiguous` | No es posible fijar una referencia definitiva; `plates: []` |

Preservar strings exactos: `"007" != "7"`. Se rechazan números JSON, strings vacíos,
espacios externos y duplicados. No se completa un número usando otra toma.
No usar `ambiguous` como sinónimo de referencia pendiente: no hay benchmark válido
sin una evaluación humana de cada caso.

Si A y B cambian legibilidad, esta referencia común mide recuperación respecto de
la imagen de referencia de mayor calidad. Tenerlo presente al interpretar recall
de A; se puede registrar esa diferencia en tags. Una foto con números legibles y
otros imposibles de establecer debe tratarse conservadoramente como `ambiguous`
en este esquema inicial; no se inventan etiquetas para los corredores restantes.

## Validación

```powershell
python benchmark/benchmark.py validate
```

Verifica ambas variantes, existencia de archivos, hashes, dimensiones, IDs y pareja
evento/foto duplicados, condiciones/splits, sequenceId, referencia faltante o extra,
estados y arrays inválidos, duplicados de dorsales y contradicciones entre estado y
plates. También rechaza claves JSON repetidas en vez de aceptar silenciosamente la
última. Acumula errores entendibles y sale con código 1 si algo falla.

`run` vuelve a validar todo antes de ejecutar, aunque se seleccione una sola
variante/split. Verifica el hash antes y después de cada detección. No editar los
archivos mientras corre un benchmark.

## Contrato de un motor

`Engine.detect(ImageInput, config) -> Detection(raw, normalized)`.

`ImageInput` contiene path, SHA-256, ancho y alto. No recibe ground truth, eventos,
metadata humana ni objetos de React. `raw` debe ser serializable a JSON y conservar
la respuesta del proveedor. Si recibe bytes, el adaptador debe representarlos
explícitamente, por ejemplo base64, y no descartarlos silenciosamente.

Ejemplo de `normalized`:

```json
{
  "status": "completed",
  "candidates": [
    {"value": "154", "confidence": null, "bbox": [0.1, 0.2, 0.3, 0.4]}
  ],
  "error": null,
  "timing": {"preprocessingMs": null, "inferenceMs": null, "totalMs": null},
  "usage": {
    "retries": null,
    "requestCount": null,
    "inputTokens": null,
    "outputTokens": null,
    "billedUnits": null,
    "estimatedCost": null
  }
}
```

- `completed` con candidatos vacíos es un resultado válido, no prueba ausencia.
- `uncertain` significa abstención: conserva candidatos para inspección pero no
  se aceptan como predicciones estrictas. No cuenta como negativo correcto.
- `error` requiere mensaje y candidatos vacíos. Excepciones del adaptador o
  contrato inválido se registran como errores; el lote continúa.
- `value` siempre string completo; no transformar automáticamente ceros iniciales.
- `confidence` es el score nativo 0..1 o null. Nunca una probabilidad calibrada por
  esta infraestructura. Si el proveedor tiene otra escala, conservarla en raw y
  usar null hasta definir explícitamente su adaptación, sin inventar una cifra.
- `bbox` es null o `[x, y, width, height]` dentro de 0..1 respecto del raster completo.
  Ancho/alto positivos. Convertir coordenadas de recortes al original en el adaptador.
  No se evalúa precisión espacial todavía.

Para agregar un motor después: implementar el protocolo en `engines/`, registrarlo
en `get_engine` y en la opción CLI, y agregar tests del adaptador. Cargar sus
dependencias de forma explícita; no instalar motores para ejecutar mock. El nombre
y versión exacta se declaran en `engine.name` y `engine.model`. La configuración se
congela en el run: NO incluir claves, tokens ni secretos allí. Credenciales futuras
únicamente en el entorno local/backend, nunca en React ni en variables `VITE_*`.

## Mock y ejecuciones

```powershell
python benchmark/benchmark.py run --engine mock --variant web --split tuning
python benchmark/benchmark.py run --engine mock --variant high --split tuning --config benchmark/mock-config.json
```

Sin configuración, mock devuelve `completed` sin candidatos. Con configuración,
`responses` asigna hashes de imagen a respuestas normalizadas sintéticas:

```json
{
  "responses": {
    "SHA256_DE_UN_ARCHIVO_SINTETICO": {
      "status": "completed",
      "candidates": [{"value": "154", "confidence": null, "bbox": null}]
    }
  }
}
```

Los campos no definidos conservan los valores nulos del contrato. Mock no lee
ground truth ni reconoce píxeles. Sus resultados y reportes llevan `synthetic: true`
y la consola advierte que NO miden calidad real de reconocimiento.

El runId se genera con UTC y sufijo aleatorio, o se indica mediante `--run-id`.
No puede reutilizarse una carpeta existente. `run.json` congela configuración,
engine/model, variante/split, versión/hashes del dataset, casos y ground truth.
Cada línea de `results.jsonl` registra identidad de foto/run, fecha UTC, hash,
engine/model, respuesta cruda y normalizada. Una normalización inválida no elimina
la respuesta cruda. Si el proceso se interrumpe, los resultados parciales quedan,
pero el evaluador rechaza el run incompleto; iniciar uno nuevo.

## Evaluación y métricas

```powershell
python benchmark/benchmark.py evaluate --run ID_DEVUELTO
python benchmark/benchmark.py evaluate --run ID_DEVUELTO --threshold 0.8
```

La evaluación usa el snapshot del run, no el dataset vivo. Rechaza filas faltantes,
duplicadas o inconsistentes con motor, variante, IDs y hashes del snapshot.

Se evalúan conjuntos de strings completos. Esperado `["154", "231"]` y predicho
`["154", "23"]` produce TP=1, FP=1, FN=1. Los candidatos repetidos no inflan TP.
Un número más corto contenido en exactamente uno de los FN se marca como posible
error parcial; es diagnóstico y nunca da crédito. No hay fuzzy matching.

- Precision = TP/(TP+FP); recall = TP/(TP+FN); F1 = 2TP/(2TP+FP+FN).
- FP por 100 fotos = 100*FP/número de fotos no ambiguas.
- Coincidencia exacta requiere estado `completed` y conjuntos idénticos.
- `no_visible_plate` contribuye FP si hay predicciones; solo `completed` vacío es
  negativo correcto. La tasa usa todos los negativos de referencia como denominador.
- `ambiguous` se excluye de TP/FP/FN y de sus denominadores; sus candidatos se
  conservan en una sección aparte. Sus errores técnicos sí cuentan como fallos.
- `error` y `uncertain` no son negativos correctos. Si la referencia era readable,
  los dorsales no recuperados suman FN para no ocultar pérdida de cobertura. El
  reporte también muestra sus contadores separados y resultados por caso.
- Un denominador cero se representa con null en JSON y N/A en consola, no con 0 o 1.

Hay subreportes por condición, por ground truth con varios dorsales y por condición
o tag `multiple_riders`. Los números son exactos: `"007"` predicho como `"7"` genera
FP=1 y FN=1.

Sin threshold, se evalúan todos los candidatos de resultados completed. Con
threshold, se excluyen scores inferiores y confidence null. Esa política se registra
en el reporte: no implica que null sea baja confianza. Ajustar thresholds por motor
en tuning, fijarlos y recién entonces evaluar evaluation. No comparar scores entre
proveedores ni interpretar 0.94 como 94% de certeza.

El reporte JSON incluye métricas, diagnósticos por foto, ambiguas, tiempo y consumo.
Se puede regenerar un reporte determinísticamente con el mismo run/threshold;
solo ese reporte se reemplaza, nunca los resultados crudos del run.

## Tiempo y costo

El ejecutor mide `totalMs` de cada foto (incluye verificaciones de hash y adaptador).
El adaptador puede aportar `preprocessingMs` e `inferenceMs`; null indica desconocido.
Se reportan cantidad de mediciones, suma, mediana y p95 por cada tiempo. No hay
descargas en esta etapa. Tiempos mock no predicen rendimiento de un motor real.

Se preservan por foto reintentos, solicitudes, tokens, unidades facturadas y costo
opcional. No se calculan tarifas ni se rellenan desconocidos con cero. Un costo
futuro debe incluir `{"amount": 0.01, "currency": "USD", "pricingDate": "AAAA-MM-DD"}`
(ejemplo inventado de formato, NO tarifa). Comparar costo con tarifas fechadas y
mediciones reales; no mezclar monedas ni ignorar reintentos.

## Aislamiento y siguiente etapa

Todas las escrituras del programa quedan bajo `benchmark/`. Nunca debe escribir en
`src/data/plates/`, `src/data/generated/`, `events.js`, componentes React, scripts de
Cloudinary ni archivos maestros. No lee etiquetas definitivas automáticamente.
No importar este código desde React ni mover imágenes/resultados a `public/`.

Más adelante un paso separado podrá importar sugerencias para revisión en
PlateEditor, preservando siempre plates/reviewed humanos. Ese paso NO existe aquí.
La siguiente tarea es construir y verificar manualmente el dataset congelado;
después se podrá agregar el primer adaptador real, manteniendo este contrato.
