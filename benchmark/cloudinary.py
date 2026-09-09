"""Registro por URLs públicas. No utiliza SDK Cloudinary, credenciales ni OCR."""
from datetime import datetime, timezone
import json
import http.client
import re
import struct
import subprocess
import urllib.error
import urllib.parse
import urllib.request
import uuid
import zlib

from data import ROOT, CONDITIONS, dimensions, image_info, inside, read_json, sha256, write_json

ACCEPT = "image/jpeg,image/png,image/webp"
MAX_BYTES = 100 * 1024 * 1024


def valid_id(value, kind):
    pattern = r"[a-z0-9]+(?:-[a-z0-9]+)*" if kind == "eventId" else r"[A-Za-z0-9_-]+"
    if not isinstance(value, str) or not re.fullmatch(pattern, value):
        raise ValueError(f"{kind} inválido")


def load_catalog():
    try:
        result = subprocess.run(["node", str(ROOT / "export-catalog.mjs")], cwd=ROOT.parent,
                                capture_output=True, encoding="utf-8", timeout=60)
    except FileNotFoundError as error:
        raise ValueError("Se requiere Node.js y las dependencias Vite ya usadas por el proyecto") from error
    except subprocess.TimeoutExpired as error:
        raise ValueError("El exportador del catálogo superó 60 segundos") from error
    if result.returncode:
        raise ValueError("No se pudo cargar events.js con el exportador local de Vite: " + result.stderr[-1200:])
    return json.loads(result.stdout)


def event_photos(catalog, event_id):
    valid_id(event_id, "eventId")
    events = [event for event in catalog if event.get("eventId") == event_id]
    if len(events) != 1:
        raise ValueError("Evento inexistente" if not events else "eventId ambiguo en el catálogo")
    return events[0]["photos"]


def public_url(url):
    parsed = urllib.parse.urlsplit(url)
    if (parsed.scheme != "https" or parsed.netloc != "res.cloudinary.com" or
            parsed.query or parsed.fragment or "%" in parsed.path or "\\" in parsed.path):
        raise ValueError("Se requiere una URL pública HTTPS de res.cloudinary.com sin parámetros ni escapes")
    return parsed


def resolve_photo(catalog, event_id, photo_id):
    valid_id(photo_id, "photoId")
    matches = [photo for photo in event_photos(catalog, event_id) if photo.get("id") == photo_id]
    if len(matches) != 1:
        raise ValueError("Foto inexistente" if not matches else "photoId ambiguo: aparece más de una vez en el evento")
    photo = matches[0]
    category = photo.get("categoryId")
    if category is not None:
        valid_id(category, "categoryId")
    expected = f"juan-acosta-photography/events/{event_id}/" + (f"{category}/" if category else "") + photo_id
    if photo.get("publicId") != expected:
        raise ValueError("publicId no coincide con evento/categoría/foto; no se puede determinar high con seguridad")
    parsed = public_url(photo["image"])
    segments = parsed.path.lstrip("/").split("/")
    # Contrato comprobado en los scripts de subida: cloud/image/upload/transformación/vN/publicId.ext.
    if len(segments) < 6 or not re.fullmatch(r"[A-Za-z0-9_-]+", segments[0]) or segments[1:3] != ["image", "upload"]:
        raise ValueError("URL de entrega no compatible; no se puede determinar high")
    version_index = next((i for i in range(3, len(segments)) if re.fullmatch(r"v[0-9]+", segments[i])), None)
    if version_index is None:
        raise ValueError("URL sin versión explícita: high no se construye por suposición")
    transforms = segments[3:version_index]
    if len(transforms) != 1 or not re.fullmatch(r"f_auto,q_auto(?::good)?,w_[0-9]+", transforms[0]):
        raise ValueError("Transformación no reconocida; revisar el exportador antes de registrar")
    asset = "/".join(segments[version_index + 1:])
    if not any(asset == expected + extension for extension in (".jpg", ".jpeg", ".png", ".webp")):
        raise ValueError("La URL no identifica el mismo publicId; high no es seguro")
    high = urllib.parse.urlunsplit(("https", "res.cloudinary.com",
          "/" + "/".join(segments[:3] + segments[version_index:]), "", ""))
    return {"eventId": event_id, "photoId": photo_id, "categoryId": category,
            "publicId": expected, "web": photo["image"], "high": high}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError("Redirección inesperada al descargar; no se sigue otra URL")


def image_extension(path):
    """Firma y estructura mínima; rechaza HTML y transferencias truncadas."""
    data = path.read_bytes()
    dimensions(path)
    if data.startswith(b"\xff\xd8") and data.endswith(b"\xff\xd9"):
        return ".jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        offset = 8
        has_data = False
        while offset + 12 <= len(data):
            size = int.from_bytes(data[offset:offset + 4], "big")
            kind = data[offset + 4:offset + 8]
            end = offset + 8 + size
            if end + 4 > len(data) or zlib.crc32(data[offset + 4:end]) != int.from_bytes(data[end:end + 4], "big"):
                raise ValueError("PNG truncado o con CRC inválido")
            has_data |= kind == b"IDAT"
            offset = end + 4
            if kind == b"IEND" and size == 0 and offset == len(data) and has_data:
                return ".png"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP" and len(data) == struct.unpack("<I", data[4:8])[0] + 8:
        return ".webp"
    raise ValueError("Descarga incompleta o formato de imagen no compatible")


def download(url, destination):
    public_url(url)
    request = urllib.request.Request(url, headers={"Accept": ACCEPT, "User-Agent": "PhotographyBenchmark/3A"})
    try:
        opener = urllib.request.build_opener(NoRedirect())
        with opener.open(request, timeout=30) as response, destination.open("xb") as target:
            if response.status != 200 or not response.headers.get("Content-Type", "").split(";")[0].startswith("image/"):
                raise ValueError("La respuesta no es una imagen HTTP 200")
            expected = response.headers.get("Content-Length")
            if expected is not None and int(expected) > MAX_BYTES:
                raise ValueError("La imagen supera el límite de 100 MiB")
            count = 0
            while chunk := response.read(1024 * 1024):
                count += len(chunk)
                if count > MAX_BYTES:
                    raise ValueError("La imagen supera el límite de 100 MiB")
                target.write(chunk)
            if expected is not None and count != int(expected):
                raise ValueError("Descarga incompleta: Content-Length no coincide")
        image_extension(destination)
    except (OSError, ValueError, http.client.HTTPException) as error:
        destination.unlink(missing_ok=True)
        raise ValueError(f"No se pudo congelar {url}: {error}") from error


def register_cloudinary(dataset, event_id, photo_id, split, condition, sequence_id, catalog=None):
    dataset = inside(ROOT, dataset)
    valid_id(event_id, "eventId")
    valid_id(photo_id, "photoId")
    valid_id(sequence_id, "sequenceId")
    if split not in ("tuning", "evaluation") or condition not in CONDITIONS:
        raise ValueError("Split o condición inválidos; deben elegirse mediante revisión humana")
    lock = dataset / ".register-cloudinary.lock"
    try:
        lock.open("x").close()
    except FileExistsError as error:
        raise ValueError("Ya hay un registro en curso. Si fue interrumpido, revisar y retirar .register-cloudinary.lock") from error
    temporaries, created = [], []
    committed = False
    try:
        manifest_path = dataset / "manifest.json"
        before_hash = sha256(manifest_path)
        manifest = read_json(manifest_path)
        if manifest.get("schemaVersion") != 1 or not isinstance(manifest.get("cases"), list):
            raise ValueError("Manifiesto no compatible")
        case_id = event_id + "--" + photo_id
        for existing in manifest["cases"]:
            if existing.get("caseId") == case_id or (existing.get("eventId"), existing.get("photoId")) == (event_id, photo_id):
                raise ValueError("Foto ya registrada: se conservan los archivos y el manifiesto, sin volver a descargar. Usar otro dataset para una nueva congelación.")
            if existing.get("eventId") == event_id and existing.get("sequenceId") == sequence_id and existing.get("split") != split:
                raise ValueError("La misma sequenceId no puede repartirse entre splits")
        photo = resolve_photo(load_catalog() if catalog is None else catalog, event_id, photo_id)
        variants = {}
        for variant in ("web", "high"):
            directory = inside(dataset, dataset / "images" / variant)
            directory.mkdir(parents=True, exist_ok=True)
            temporary = directory / (".cloudinary-" + uuid.uuid4().hex + ".tmp")
            temporaries.append(temporary)
            download(photo[variant], temporary)
            extension = image_extension(temporary)
            info = image_info(temporary, dataset)
            destination = inside(dataset, directory / (info["sha256"] + extension))
            # Archivos identificados por contenido: reutilizar solo si hash y estructura coinciden.
            if destination.exists():
                if sha256(destination) != info["sha256"]:
                    raise ValueError("Destino existente con contenido inesperado; no se sobrescribe")
            else:
                with destination.open("xb") as target:
                    created.append(destination)
                    target.write(temporary.read_bytes())
            frozen = image_info(destination, dataset)
            if frozen["sha256"] != info["sha256"]:
                raise ValueError("El archivo congelado cambió inesperadamente")
            variants[variant] = {**frozen, "sourceUrl": photo[variant], "downloadedAt": datetime.now(timezone.utc).isoformat(),
                                 "requestAccept": ACCEPT}
        if variants["high"]["width"] < variants["web"]["width"] or variants["high"]["height"] < variants["web"]["height"]:
            raise ValueError("El asset almacenado es menor que web; revisar origen/posible upscale de la web")
        case = {"caseId": case_id, "eventId": event_id, "photoId": photo_id, "categoryId": photo["categoryId"],
                "sequenceId": sequence_id, "split": split, "condition": condition, "tags": [],
                "publicId": photo["publicId"], "variants": variants}
        if sha256(manifest_path) != before_hash:
            raise ValueError("El manifiesto cambió durante la descarga; repetir sobre su versión actual")
        manifest["cases"].append(case)
        write_json(manifest_path, manifest)
        committed = True
        return case
    finally:
        for path in temporaries:
            path.unlink(missing_ok=True)
        if not committed:
            for path in created:
                path.unlink(missing_ok=True)
        lock.unlink(missing_ok=True)
