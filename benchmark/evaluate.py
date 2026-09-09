"""Métricas de strings exactos. Errores e incertidumbre no son negativos correctos."""
import json
import math
import statistics

from data import read_json, unique_object
from engines.base import validate_detection


def ratio(numerator, denominator):
    return numerator / denominator if denominator else None


def summary(rows):
    scorable = [row for row in rows if row["groundTruthStatus"] != "ambiguous"]
    # Incluimos FN en fotos con error/uncertain para no ocultar pérdida de cobertura.
    tp = sum(row["tp"] for row in scorable)
    fp = sum(row["fp"] for row in scorable)
    fn = sum(row["fn"] for row in scorable)
    negatives = [row for row in scorable if row["groundTruthStatus"] == "no_visible_plate"]
    return {"photos": len(rows), "scorablePhotos": len(scorable), "tp": tp, "fp": fp, "fn": fn,
            "precision": ratio(tp, tp + fp), "recall": ratio(tp, tp + fn),
            "f1": ratio(2 * tp, 2 * tp + fp + fn), "falsePositivesPer100Photos": ratio(100 * fp, len(scorable)),
            "exactPhotos": sum(row["exact"] for row in scorable),
            "exactPhotoRate": ratio(sum(row["exact"] for row in scorable), len(scorable)),
            "negativePhotos": len(negatives), "correctNegatives": sum(row["exact"] for row in negatives),
            "correctNegativeRate": ratio(sum(row["exact"] for row in negatives), len(negatives)),
            "technicalFailures": sum(row["status"] == "error" for row in rows),
            "uncertainPhotos": sum(row["status"] == "uncertain" for row in rows),
            "ambiguousPhotos": sum(row["groundTruthStatus"] == "ambiguous" for row in rows)}


def evaluate(directory, threshold=None):
    if threshold is not None and (not math.isfinite(threshold) or not 0 <= threshold <= 1):
        raise ValueError("Threshold debe estar entre 0 y 1")
    run = read_json(directory / "run.json")
    if run.get("status") != "finished":
        raise ValueError("Run incompleto: no generar métricas sobre resultados parciales")
    cases = {case["caseId"]: case for case in run["cases"]}
    if len(cases) != len(run["cases"]):
        raise ValueError("Run contiene caseIds duplicados")
    records = {}
    for line in (directory / "results.jsonl").read_text(encoding="utf-8").splitlines():
        record = json.loads(line, object_pairs_hook=unique_object)
        case_id = record["caseId"]
        if case_id in records or case_id not in cases:
            raise ValueError(f"Resultado duplicado o ajeno al run: {case_id}")
        case = cases[case_id]
        expected = {"runId": run["runId"], "engine": run["engine"], "model": run["model"],
                    "variant": run["variant"], "eventId": case["eventId"], "photoId": case["photoId"],
                    "imageSha256": case["variants"][run["variant"]]["sha256"]}
        if any(record.get(key) != value for key, value in expected.items()):
            raise ValueError(f"Resultado incompatible con el snapshot: {case_id}")
        validate_detection(record["normalized"])
        records[case_id] = record
    if records.keys() != cases.keys():
        raise ValueError("Faltan resultados del run; no equivalen a predicciones vacías")
    rows, timings = [], []
    for case_id, case in cases.items():
        reference = run["groundTruth"][case_id]
        result = records[case_id]["normalized"]
        expected = set(reference["plates"])
        predictions = {candidate["value"] for candidate in result["candidates"]
                       if threshold is None or (candidate.get("confidence") is not None and candidate["confidence"] >= threshold)}
        # uncertain conserva candidatos para inspección, pero equivale a abstenerse.
        accepted = predictions if result["status"] == "completed" else set()
        fp, fn = accepted - expected, expected - accepted
        ambiguous = reference["status"] == "ambiguous"
        partials = []
        for value in sorted(fp):
            possible = [plate for plate in fn if len(value) < len(plate) and value in plate]
            if len(possible) == 1:
                partials.append({"prediction": value, "expected": possible[0]})
        rows.append({"caseId": case_id, "condition": case["condition"], "groundTruthStatus": reference["status"],
                     "status": result["status"], "expected": sorted(expected), "predicted": sorted(predictions),
                     "tp": 0 if ambiguous else len(accepted & expected), "fp": 0 if ambiguous else len(fp),
                     "fn": 0 if ambiguous else len(fn), "exact": not ambiguous and result["status"] == "completed" and accepted == expected,
                     "possiblePartialErrors": [] if ambiguous else partials, "error": result.get("error")})
        timings.append(result["timing"])
    timing_summary = {}
    for field in ("preprocessingMs", "inferenceMs", "totalMs"):
        values = sorted(t[field] for t in timings if t.get(field) is not None)
        timing_summary[field] = {"measuredPhotos": len(values), "sum": sum(values) if values else None,
                                 "median": statistics.median(values) if values else None,
                                 "p95": values[math.ceil(len(values) * .95) - 1] if values else None}
    return {"schemaVersion": 1, "runId": run["runId"], "synthetic": run["synthetic"], "engine": run["engine"],
            "model": run["model"], "datasetVersion": run["datasetVersion"], "variant": run["variant"], "split": run["split"],
            "threshold": threshold, "nullConfidencePolicy": "excluded when threshold is set",
            "overall": summary(rows), "multiplePlates": summary([row for row in rows if len(row["expected"]) > 1]),
            "multipleRiders": summary([row for row in rows if row["condition"] == "multiple_riders" or "multiple_riders" in cases[row["caseId"]].get("tags", [])]),
            "byCondition": {condition: summary([row for row in rows if row["condition"] == condition]) for condition in sorted({row["condition"] for row in rows})},
            "ambiguous": [row for row in rows if row["groundTruthStatus"] == "ambiguous"],
            "timing": timing_summary, "usageByCase": {key: value["normalized"]["usage"] for key, value in records.items()},
            "cases": rows}


def print_report(report):
    if report["synthetic"]:
        print("SIMULACIÓN MOCK: estas métricas NO miden reconocimiento real.")
    metrics = report["overall"]
    print(f"Run {report['runId']} | {report['variant']} | {report['split']}")
    print(f"TP={metrics['tp']} FP={metrics['fp']} FN={metrics['fn']}")
    for label in ("precision", "recall", "f1", "falsePositivesPer100Photos", "exactPhotoRate", "correctNegativeRate"):
        value = metrics[label]
        print(f"{label}: {value:.4f}" if value is not None else f"{label}: N/A (sin denominador)")
    print(f"Fallos técnicos: {metrics['technicalFailures']} | Inciertas: {metrics['uncertainPhotos']} | Ambiguas: {metrics['ambiguousPhotos']}")
