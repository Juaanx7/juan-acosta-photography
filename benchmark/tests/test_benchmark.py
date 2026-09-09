"""Fixtures 100% sintéticos, creados bajo benchmark/ y retirados al terminar."""
from copy import deepcopy
import json
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import uuid
import zlib

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from data import ROOT, dimensions, image_info, read_json, register, sha256, validate, write_json
from engines.base import empty_result, validate_detection
from evaluate import evaluate
from runner import run


def png(color):
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)) +
            chunk(b"IDAT", zlib.compress(bytes([0, color, 0, 0]))) + chunk(b"IEND", b""))


def prediction(values, status="completed"):
    result = empty_result(status, "Fallo sintético" if status == "error" else None)
    result["candidates"] = [{"value": value, "confidence": None, "bbox": None} for value in values]
    return result


class BenchmarkTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="synthetic-", dir=ROOT / "tests")
        self.dataset = Path(self.temporary.name)
        self.run_dirs = []
        definitions = [
            ("multi-partial", "readable", ["154", "231"], ["154", "23"], "completed"),
            ("multi-exact", "readable", ["154", "231"], ["154", "231"], "completed"),
            ("multi-missing", "readable", ["154", "231"], ["154"], "completed"),
            ("multi-wrong", "readable", ["154", "231"], ["154", "999"], "completed"),
            ("negative", "no_visible_plate", [], [], "completed"),
            ("negative-false", "no_visible_plate", [], ["999"], "completed"),
            ("ambiguous", "ambiguous", [], ["123"], "completed"),
            ("failed", "no_visible_plate", [], [], "error"),
            ("leading-zero", "readable", ["007"], ["7"], "completed"),
            ("uncertain", "readable", ["154"], ["154"], "uncertain"),
            ("readable-error", "readable", ["154"], [], "error"),
        ]
        self.manifest = {"schemaVersion": 1, "datasetVersion": "SYNTHETIC-v1", "cases": []}
        self.truth = {"schemaVersion": 1, "cases": {}}
        self.config = {"responses": {}}
        for index, (case_id, status, expected, values, outcome) in enumerate(definitions):
            variants = {}
            for offset, variant in enumerate(("web", "high")):
                path = self.dataset / "images" / variant / f"{case_id}.png"
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(png(index * 2 + offset))
                info = image_info(path, self.dataset)
                variants[variant] = info
                self.config["responses"][info["sha256"]] = prediction(values, outcome)
            self.manifest["cases"].append({"caseId": case_id, "eventId": "SYNTHETIC", "photoId": case_id,
                "split": "tuning", "sequenceId": case_id, "condition": "multiple_riders" if len(expected) > 1 else "clear",
                "tags": [], "variants": variants})
            self.truth["cases"][case_id] = {"status": status, "plates": expected}
        self.save_dataset()

    def save_dataset(self):
        write_json(self.dataset / "manifest.json", self.manifest)
        write_json(self.dataset / "ground-truth.json", self.truth)

    def tearDown(self):
        for directory in self.run_dirs:
            shutil.rmtree(directory)
            for report in (ROOT / "reports").glob(directory.name + "-*.json"):
                report.unlink()
        self.temporary.cleanup()

    def make_run(self, config=None, variant="web"):
        run_id = "synthetic-test-" + uuid.uuid4().hex
        directory = ROOT / "results" / run_id
        self.run_dirs.append(directory)
        return run(self.dataset, "mock", variant, "tuning", self.config if config is None else config, run_id)

    def test_valid_and_metrics(self):
        self.assertEqual(validate(self.dataset)[2], [])
        directory = self.make_run()
        report = evaluate(directory)
        self.assertTrue(report["synthetic"])
        rows = {row["caseId"]: row for row in report["cases"]}
        self.assertEqual([rows["multi-partial"][k] for k in ("tp", "fp", "fn")], [1, 1, 1])
        self.assertEqual(rows["multi-partial"]["possiblePartialErrors"], [{"prediction": "23", "expected": "231"}])
        self.assertTrue(rows["multi-exact"]["exact"])
        self.assertEqual([rows["multi-missing"][k] for k in ("tp", "fp", "fn")], [1, 0, 1])
        self.assertEqual([rows["multi-wrong"][k] for k in ("tp", "fp", "fn")], [1, 1, 1])
        self.assertEqual([rows["leading-zero"][k] for k in ("tp", "fp", "fn")], [0, 1, 1])
        self.assertFalse(rows["failed"]["exact"])
        self.assertEqual(rows["readable-error"]["fn"], 1)
        self.assertEqual(rows["uncertain"]["tp"], 0)
        self.assertEqual(report["overall"]["correctNegativeRate"], 1 / 3)
        self.assertEqual(report["overall"]["technicalFailures"], 2)
        self.assertEqual(report["overall"]["ambiguousPhotos"], 1)
        self.assertEqual(report["overall"]["scorablePhotos"], 10)
        self.assertEqual([report["overall"][k] for k in ("tp", "fp", "fn")], [5, 4, 6])
        self.assertAlmostEqual(report["overall"]["precision"], 5 / 9)
        self.assertAlmostEqual(report["overall"]["recall"], 5 / 11)
        self.assertEqual(report["multiplePlates"]["photos"], 4)
        self.assertEqual(report["timing"]["totalMs"]["measuredPhotos"], 11)
        self.assertIsNone(report["usageByCase"]["negative"]["estimatedCost"])

    def test_invalid_dataset_errors(self):
        self.manifest["cases"].append(deepcopy(self.manifest["cases"][0]))
        self.manifest["cases"][1]["sequenceId"] = self.manifest["cases"][0]["sequenceId"]
        self.manifest["cases"][1]["split"] = "evaluation"
        self.manifest["cases"][2]["variants"]["web"]["sha256"] = "wrong"
        self.manifest["cases"][3]["variants"]["high"]["path"] = "absent.png"
        del self.manifest["cases"][4]["variants"]["high"]
        del self.truth["cases"]["multi-partial"]
        self.truth["cases"]["multi-exact"]["status"] = "invalid"
        self.truth["cases"]["multi-missing"]["plates"] = [154]
        self.truth["cases"]["multi-wrong"]["plates"] = ["154", "154"]
        self.truth["cases"]["negative"]["plates"] = ["1"]
        self.truth["cases"]["ambiguous"]["plates"] = ["1"]
        self.save_dataset()
        errors = "\n".join(validate(self.dataset)[2])
        for expected in ("caseId duplicado", "eventId/photoId duplicados", "sequenceId repartida", "sha256 difiere",
                         "absent.png", "falta variante", "ground truth faltante", "status de ground truth inválido",
                         "array de strings", "plates contiene duplicados", "no_visible_plate requiere plates vacío", "ambiguous requiere plates vacío"):
            self.assertIn(expected, errors)

    def test_snapshot_and_raw(self):
        directory = self.make_run(variant="high")
        self.truth["cases"]["multi-partial"]["plates"] = ["changed"]
        self.save_dataset()
        self.assertEqual(evaluate(directory)["cases"][0]["tp"], 1)
        record = json.loads((directory / "results.jsonl").read_text().splitlines()[0])
        self.assertTrue(record["raw"]["synthetic"])
        self.assertEqual(record["variant"], "high")
        self.assertEqual(record["normalized"]["candidates"][0]["confidence"], None)

    def test_invalid_engine_contract_preserves_raw(self):
        digest = self.manifest["cases"][0]["variants"]["web"]["sha256"]
        self.config["responses"][digest]["candidates"] = [{"value": 154}]
        directory = self.make_run()
        record = json.loads((directory / "results.jsonl").read_text().splitlines()[0])
        self.assertEqual(record["normalized"]["status"], "error")
        self.assertEqual(record["raw"]["configuredResponse"]["candidates"], [{"value": 154}])

    def test_confidence_bbox_threshold(self):
        digest = self.manifest["cases"][0]["variants"]["web"]["sha256"]
        candidates = self.config["responses"][digest]["candidates"]
        candidates[0].update(confidence=.9, bbox=[.1, .2, .3, .4])
        report = evaluate(self.make_run(), threshold=.8)
        self.assertEqual(report["cases"][0]["predicted"], ["154"])
        for box in ([.9, 0, .2, .2], [0, 0, 0, .2], [0, 0, float('nan'), .2]):
            invalid = prediction(["154"])
            invalid["candidates"][0]["bbox"] = box
            with self.assertRaises(ValueError):
                validate_detection(invalid)

    def test_register_and_paths(self):
        source = self.dataset / "master.png"
        source.write_bytes(png(200))
        before = source.read_bytes()
        info = register(self.dataset, "multi-partial", "web", source)
        self.assertEqual(source.read_bytes(), before)
        self.assertEqual(info["sha256"], sha256(source))
        self.assertEqual((info["width"], info["height"]), (1, 1))
        self.assertEqual(register(self.dataset, "multi-partial", "web", source), info)
        self.manifest["cases"][0]["variants"]["web"]["path"] = "../../../../src/App.jsx"
        self.save_dataset()
        self.assertIn("debe estar dentro", "\n".join(validate(self.dataset)[2]))

    def test_json_duplicate_keys_and_incomplete_run(self):
        (self.dataset / "ground-truth.json").write_text('{"cases":{},"cases":{}}')
        self.assertIn("Clave JSON duplicada", validate(self.dataset)[2][0])
        self.save_dataset()
        directory = self.make_run()
        result = directory / "results.jsonl"
        result.write_text("\n".join(result.read_text().splitlines()[:-1]), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Faltan resultados"):
            evaluate(directory)

    def test_cli_smoke(self):
        def cli(*args):
            return subprocess.run([sys.executable, str(ROOT / "benchmark.py"), *args], capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(cli("validate", "--dataset", str(self.dataset)).returncode, 0)
        config_path = self.dataset / "mock-config.json"
        write_json(config_path, self.config)
        run_id = "synthetic-cli-" + uuid.uuid4().hex
        self.run_dirs.append(ROOT / "results" / run_id)
        result = cli("run", "--dataset", str(self.dataset), "--engine", "mock", "--variant", "web", "--config", str(config_path), "--run-id", run_id)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("SIMULACIÓN", result.stdout)
        result = cli("evaluate", "--run", run_id)
        self.assertEqual(result.returncode, 0, result.stderr)
        report = read_json(ROOT / "reports" / f"{run_id}-threshold-all.json")
        self.assertEqual(report["overall"]["tp"], 5)
        self.manifest["cases"][0]["variants"] = {}
        self.save_dataset()
        result = cli("validate", "--dataset", str(self.dataset))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("falta variante", result.stderr)

    def test_image_headers(self):
        path = self.dataset / "header.jpg"
        path.write_bytes(b'\xff\xd8\xff\xc0' + struct.pack('>HBHHB', 8, 8, 20, 30, 1) + b'\xff\xd9')
        self.assertEqual(dimensions(path), (30, 20))
        path = self.dataset / "header.webp"
        path.write_bytes(b'RIFF' + struct.pack('<I', 22) + b'WEBPVP8X' + struct.pack('<I', 10) + b'\0' * 4 + (29).to_bytes(3, 'little') + (19).to_bytes(3, 'little'))
        self.assertEqual(dimensions(path), (30, 20))
        path.write_bytes(b'bad')
        with self.assertRaises(ValueError):
            dimensions(path)

    def test_empty_prediction_is_not_error(self):
        report = evaluate(self.make_run(config={}))
        self.assertEqual(report["overall"]["technicalFailures"], 0)
        self.assertEqual(report["overall"]["correctNegativeRate"], 1)
        self.assertEqual(report["overall"]["recall"], 0)
        self.assertIsNone(report["overall"]["precision"])

    def test_dimension_and_exact_image_leakage(self):
        self.manifest["cases"][0]["variants"]["web"]["width"] = 99
        self.manifest["cases"][1]["variants"]["web"] = deepcopy(self.manifest["cases"][0]["variants"]["web"])
        self.manifest["cases"][1]["split"] = "evaluation"
        self.save_dataset()
        errors = "\n".join(validate(self.dataset)[2])
        self.assertIn("width difiere", errors)
        self.assertIn("imagen idéntica en ambos splits", errors)

    def test_preserves_cost_and_usage(self):
        digest = self.manifest["cases"][0]["variants"]["web"]["sha256"]
        usage = {"retries": 1, "requestCount": 2, "inputTokens": 10, "outputTokens": 20,
                 "billedUnits": 2, "estimatedCost": {"amount": .01, "currency": "SYNTHETIC", "pricingDate": "2000-01-01"}}
        self.config["responses"][digest]["usage"] = usage
        report = evaluate(self.make_run())
        self.assertEqual(report["usageByCase"]["multi-partial"], usage)


if __name__ == "__main__":
    unittest.main()
