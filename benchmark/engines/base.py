"""Contrato independiente de catálogos, referencia humana y almacenamiento."""
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Protocol
import math


@dataclass(frozen=True)
class ImageInput:
    path: Path
    sha256: str
    width: int
    height: int


@dataclass
class Detection:
    raw: Any
    normalized: dict


class Engine(Protocol):
    name: str
    model: str

    def detect(self, image: ImageInput, config: dict) -> Detection:
        ...


def number(value):
    return type(value) in (int, float) and math.isfinite(value)


def validate_detection(result):
    if not isinstance(result, dict) or result.get("status") not in ("completed", "uncertain", "error"):
        raise ValueError("Resultado: status inválido")
    candidates = result.get("candidates")
    if not isinstance(candidates, list):
        raise ValueError("Resultado: candidates debe ser array")
    for candidate in candidates:
        if not isinstance(candidate, dict) or not isinstance(candidate.get("value"), str) or not candidate["value"]:
            raise ValueError("Candidato: value debe ser string no vacío")
        if candidate["value"] != candidate["value"].strip():
            raise ValueError("Candidato: quitar espacios externos en el adaptador")
        score = candidate.get("confidence")
        if score is not None and (not number(score) or not 0 <= score <= 1):
            raise ValueError("Candidato: confidence debe ser null o score nativo 0..1")
        box = candidate.get("bbox")
        if box is not None and (not isinstance(box, list) or len(box) != 4 or
                               any(not number(v) or not 0 <= v <= 1 for v in box) or
                               box[2] <= 0 or box[3] <= 0 or box[0] + box[2] > 1 + 1e-9 or box[1] + box[3] > 1 + 1e-9):
            raise ValueError("Candidato: bbox debe estar dentro de la imagen, [x,y,width,height] 0..1")
    for field in ("timing", "usage"):
        if not isinstance(result.get(field), dict):
            raise ValueError(f"Resultado: falta objeto {field}")
    for field in ("preprocessingMs", "inferenceMs", "totalMs"):
        value = result["timing"].get(field)
        if value is not None and (not number(value) or value < 0):
            raise ValueError(f"Tiempo inválido: {field}")
    for field in ("retries", "requestCount", "inputTokens", "outputTokens", "billedUnits"):
        value = result["usage"].get(field)
        if value is not None and (not number(value) or value < 0):
            raise ValueError(f"Consumo inválido: {field}")
    cost = result["usage"].get("estimatedCost")
    if cost is not None and (not isinstance(cost, dict) or not number(cost.get("amount")) or cost["amount"] < 0 or
                             not isinstance(cost.get("currency"), str) or not cost["currency"] or
                             not isinstance(cost.get("pricingDate"), str) or not cost["pricingDate"]):
        raise ValueError("Costo requiere amount, currency y pricingDate; usar null si se desconoce")
    if result["status"] == "error" and (candidates or not isinstance(result.get("error"), str) or not result["error"]):
        raise ValueError("Error técnico requiere error descriptivo y candidates vacío")


def empty_result(status="completed", error=None):
    return {"status": status, "candidates": [], "error": error,
            "timing": {"preprocessingMs": None, "inferenceMs": None, "totalMs": None},
            "usage": {"retries": None, "requestCount": None, "inputTokens": None,
                      "outputTokens": None, "billedUnits": None, "estimatedCost": None}}
