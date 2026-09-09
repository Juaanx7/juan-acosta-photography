"""Dataset local: lectura estricta, imágenes congeladas y validación acumulativa."""
import hashlib
import json
import os
from pathlib import Path
import re
import struct
import uuid

ROOT = Path(__file__).resolve().parent
CONDITIONS = {"clear", "small", "tilted", "mud_dust", "motion_blur",
              "partially_occluded", "multiple_riders", "no_visible_plate", "ambiguous"}


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Clave JSON duplicada: {key}")
        result[key] = value
    return result


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"),
                      object_pairs_hook=unique_object,
                      parse_constant=lambda value: (_ for _ in ()).throw(ValueError(f"Número JSON inválido: {value}")))


def inside(root, path):
    root, path = Path(root).resolve(), Path(path).resolve()
    if not path.is_relative_to(root):
        raise ValueError(f"La ruta debe estar dentro de {root}: {path}")
    return path


def write_json(path, value):
    path = inside(ROOT, path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + "." + uuid.uuid4().hex + ".tmp")
    try:
        temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def sha256(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def dimensions(path):
    """Dimensiones del raster PNG/JPEG/WebP, sin decodificar ni alterar píxeles."""
    content = Path(path).read_bytes()
    if content[:8] == b"\x89PNG\r\n\x1a\n" and len(content) >= 24 and content[12:16] == b"IHDR":
        width, height = struct.unpack(">II", content[16:24])
    elif content[:2] == b"\xff\xd8":
        index = 2
        while index + 4 <= len(content):
            if content[index] != 255:
                raise ValueError("Cabecera JPEG inválida")
            while index < len(content) and content[index] == 255:
                index += 1
            if index >= len(content):
                break
            marker = content[index]
            index += 1
            if marker in (0xD9, 0xDA):
                break
            if marker == 1 or 0xD0 <= marker <= 0xD7:
                continue
            length = int.from_bytes(content[index:index + 2], "big")
            if length < 2 or index + length > len(content):
                raise ValueError("Segmento JPEG truncado")
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                if length < 8:
                    raise ValueError("Dimensiones JPEG truncadas")
                height, width = struct.unpack(">HH", content[index + 3:index + 7])
                break
            index += length
        else:
            raise ValueError("JPEG sin dimensiones")
        if "width" not in locals():
            raise ValueError("JPEG sin dimensiones")
    elif content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        kind = content[12:16]
        if kind == b"VP8X" and len(content) >= 30:
            width = 1 + int.from_bytes(content[24:27], "little")
            height = 1 + int.from_bytes(content[27:30], "little")
        elif kind == b"VP8 " and len(content) >= 30 and content[23:26] == b"\x9d\x01\x2a":
            width, height = (value & 0x3FFF for value in struct.unpack("<HH", content[26:30]))
        elif kind == b"VP8L" and len(content) >= 25 and content[20] == 0x2F:
            bits = int.from_bytes(content[21:25], "little")
            width, height = 1 + (bits & 0x3FFF), 1 + ((bits >> 14) & 0x3FFF)
        else:
            raise ValueError("Cabecera WebP no compatible")
    else:
        raise ValueError("Formato no compatible: usar PNG, JPEG o WebP")
    if width <= 0 or height <= 0:
        raise ValueError("Dimensiones inválidas")
    return width, height


def image_info(path, dataset):
    path = inside(dataset, path)
    width, height = dimensions(path)
    return {"path": path.relative_to(Path(dataset).resolve()).as_posix(),
            "sha256": sha256(path), "width": width, "height": height}


def validate(dataset):
    dataset = inside(ROOT, dataset)
    errors = []
    try:
        manifest = read_json(dataset / "manifest.json")
        truth = read_json(dataset / "ground-truth.json")
    except (OSError, ValueError) as error:
        return None, None, [str(error)]
    if not isinstance(manifest, dict) or manifest.get("schemaVersion") != 1 or not isinstance(manifest.get("cases"), list):
        return None, None, ["manifest.json: se requiere schemaVersion 1 y cases como array"]
    if not isinstance(truth, dict) or truth.get("schemaVersion") != 1 or not isinstance(truth.get("cases"), dict):
        return None, None, ["ground-truth.json: se requiere schemaVersion 1 y cases como objeto"]
    if not isinstance(manifest.get("datasetVersion"), str) or not manifest["datasetVersion"].strip():
        errors.append("Falta datasetVersion")
    if not manifest["cases"]:
        errors.append("Dataset vacío: agregá casos y referencia humana antes de ejecutar")
    ids, identities, sequences, hashes = set(), set(), {}, {}
    for index, case in enumerate(manifest["cases"]):
        label = f"Caso {index + 1}"
        if not isinstance(case, dict):
            errors.append(f"{label}: debe ser un objeto")
            continue
        case_id = case.get("caseId")
        if not isinstance(case_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]+", case_id):
            errors.append(f"{label}: caseId inválido")
            continue
        label = case_id
        if case_id in ids:
            errors.append(f"{label}: caseId duplicado")
        ids.add(case_id)
        for key in ("eventId", "photoId"):
            if not isinstance(case.get(key), str) or not case[key].strip():
                errors.append(f"{label}: falta {key} válido")
        identity = (str(case.get("eventId")), str(case.get("photoId")))
        if identity in identities:
            errors.append(f"{label}: eventId/photoId duplicados")
        identities.add(identity)
        if case.get("categoryId") is not None and not isinstance(case["categoryId"], str):
            errors.append(f"{label}: categoryId debe ser string o null")
        split = case.get("split")
        if split not in ("tuning", "evaluation"):
            errors.append(f"{label}: split inválido")
        if not isinstance(case.get("condition"), str) or case["condition"] not in CONDITIONS:
            errors.append(f"{label}: condición inválida")
        tags = case.get("tags", [])
        if not isinstance(tags, list) or any(not isinstance(tag, str) for tag in tags):
            errors.append(f"{label}: tags debe ser un array de strings")
        sequence = case.get("sequenceId")
        if not isinstance(sequence, str) or not sequence.strip():
            errors.append(f"{label}: sequenceId requerido (usar uno propio si es una foto aislada)")
        else:
            sequence_key = (identity[0], sequence)
            if sequence_key in sequences and sequences[sequence_key] != split:
                errors.append(f"{label}: sequenceId repartida entre tuning y evaluation")
            sequences[sequence_key] = split
        variants = case.get("variants")
        for variant in ("web", "high"):
            record = variants.get(variant) if isinstance(variants, dict) else None
            if not isinstance(record, dict):
                errors.append(f"{label}: falta variante {variant}")
                continue
            try:
                relative = record.get("path")
                if not isinstance(relative, str) or Path(relative).is_absolute():
                    raise ValueError("path debe ser relativo al dataset")
                actual = image_info(dataset / relative, dataset)
                for key in ("sha256", "width", "height"):
                    if type(record.get(key)) is not type(actual[key]) or record[key] != actual[key]:
                        errors.append(f"{label}/{variant}: {key} difiere del archivo")
                digest = actual["sha256"]
                if digest in hashes and hashes[digest] != split:
                    errors.append(f"{label}/{variant}: imagen idéntica en ambos splits")
                hashes[digest] = split
            except (OSError, ValueError) as error:
                errors.append(f"{label}/{variant}: {error}")
        reference = truth["cases"].get(case_id)
        if not isinstance(reference, dict):
            errors.append(f"{label}: ground truth faltante o inválida")
            continue
        status, plates = reference.get("status"), reference.get("plates")
        if status not in ("readable", "no_visible_plate", "ambiguous"):
            errors.append(f"{label}: status de ground truth inválido")
        if not isinstance(plates, list) or any(not isinstance(value, str) or not value or value != value.strip() for value in plates):
            errors.append(f"{label}: plates debe ser array de strings no vacíos, sin espacios externos")
        else:
            if len(set(plates)) != len(plates):
                errors.append(f"{label}: plates contiene duplicados")
            if status == "readable" and not plates:
                errors.append(f"{label}: readable requiere dorsales")
            if status in ("no_visible_plate", "ambiguous") and plates:
                errors.append(f"{label}: {status} requiere plates vacío")
    for extra in truth["cases"].keys() - ids:
        errors.append(f"{extra}: ground truth sin caso en manifiesto")
    return manifest, truth, errors


def register(dataset, case_id, variant, source):
    """Copia sin sobrescribir; imprime/actualiza metadata solo del dataset indicado."""
    dataset = inside(ROOT, dataset)
    manifest = read_json(dataset / "manifest.json")
    matches = [case for case in manifest["cases"] if case.get("caseId") == case_id]
    if len(matches) != 1:
        raise ValueError("Debe existir exactamente un caso con ese caseId")
    if variant not in ("web", "high"):
        raise ValueError("Variante inválida")
    source = Path(source).resolve()
    dimensions(source)
    digest = sha256(source)
    destination = inside(dataset, dataset / "images" / variant / (digest + source.suffix.lower()))
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        if sha256(destination) != digest:
            raise ValueError("Destino existente con contenido distinto; no se sobrescribe")
    else:
        with destination.open("xb") as target, source.open("rb") as origin:
            target.write(origin.read())
    info = image_info(destination, dataset)
    if info["sha256"] != digest:
        raise ValueError("La imagen cambió mientras se copiaba; volver a registrar")
    matches[0].setdefault("variants", {})[variant] = info
    write_json(dataset / "manifest.json", manifest)
    return info
