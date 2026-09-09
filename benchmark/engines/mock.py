"""SIMULACIÓN: respuestas configuradas por hash. No reconoce imágenes."""
from copy import deepcopy
from engines.base import Detection, empty_result


class MockEngine:
    name = "mock"
    model = "synthetic-v1"

    def detect(self, image, config):
        configured = deepcopy(config.get("responses", {}).get(image.sha256, {}))
        result = empty_result()
        result.update(configured)
        return Detection(raw={"synthetic": True, "configuredResponse": configured}, normalized=result)
