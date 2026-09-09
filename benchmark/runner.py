"""Ejecuta únicamente adaptadores registrados y guarda snapshots reproducibles."""
from datetime import datetime, timezone
from copy import deepcopy
import json
import re
import time
import uuid

from data import ROOT, inside, sha256, validate, write_json
from engines import get_engine
from engines.base import ImageInput, empty_result, validate_detection


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def run(dataset, engine_name, variant, split, config, run_id=None):
    manifest, truth, errors = validate(dataset)
    if errors:
        raise ValueError("Dataset inválido:\n- " + "\n- ".join(errors))
    if variant not in ("web", "high") or split not in ("tuning", "evaluation"):
        raise ValueError("Variante o split inválido")
    if not isinstance(config, dict):
        raise ValueError("La configuración debe ser un objeto JSON")
    engine = get_engine(engine_name)
    selected = [case for case in manifest["cases"] if case["split"] == split]
    if not selected:
        raise ValueError(f"No hay fotos en el split {split}")
    run_id = run_id or datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-") + uuid.uuid4().hex[:8]
    if not re.fullmatch(r"[A-Za-z0-9_-]+", run_id):
        raise ValueError("runId inválido")
    directory = inside(ROOT, ROOT / "results" / run_id)
    directory.mkdir(parents=True, exist_ok=False)
    snapshot = {"schemaVersion": 1, "runId": run_id, "createdAt": utc_now(), "status": "running",
                "engine": engine.name, "model": engine.model, "synthetic": engine.name == "mock",
                "config": config, "variant": variant, "split": split,
                "datasetVersion": manifest["datasetVersion"], "manifestSha256": sha256(dataset / "manifest.json"),
                "groundTruthSha256": sha256(dataset / "ground-truth.json"), "cases": selected,
                "groundTruth": {case["caseId"]: truth["cases"][case["caseId"]] for case in selected}}
    write_json(directory / "run.json", snapshot)
    with (directory / "results.jsonl").open("x", encoding="utf-8") as output:
        for case in selected:
            image = case["variants"][variant]
            raw = None
            started = time.perf_counter()
            try:
                path = inside(dataset, dataset / image["path"])
                if sha256(path) != image["sha256"]:
                    raise ValueError("La imagen cambió después de validar el dataset")
                detection = engine.detect(ImageInput(path, image["sha256"], image["width"], image["height"]), config)
                raw = detection.raw
                if sha256(path) != image["sha256"]:
                    raise ValueError("La imagen cambió durante la detección")
                # Conservar la respuesta aunque falle la validación de su adaptación.
                json.dumps(raw, allow_nan=False)
                normalized = deepcopy(detection.normalized)
                validate_detection(normalized)
                json.dumps(normalized, allow_nan=False)
            except Exception as error:
                normalized = empty_result("error", f"{type(error).__name__}: {error}")
                try:
                    json.dumps(raw, allow_nan=False)
                except (TypeError, ValueError):
                    raw = {"serializationError": "raw no era JSON válido", "repr": repr(raw)}
            normalized["timing"]["totalMs"] = (time.perf_counter() - started) * 1000
            record = {"runId": run_id, "createdAt": utc_now(), "caseId": case["caseId"],
                      "eventId": case["eventId"], "photoId": case["photoId"], "variant": variant,
                      "imageSha256": image["sha256"], "engine": engine.name, "model": engine.model,
                      "raw": raw, "normalized": normalized}
            output.write(json.dumps(record, ensure_ascii=False, allow_nan=False) + "\n")
            output.flush()
    snapshot["status"] = "finished"
    snapshot["finishedAt"] = utc_now()
    write_json(directory / "run.json", snapshot)
    return directory
