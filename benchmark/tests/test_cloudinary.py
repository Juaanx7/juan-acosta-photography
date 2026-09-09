"""Sin red: catálogo real de lectura, descargas sintéticas y política de Git."""
from copy import deepcopy
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from cloudinary import ACCEPT, download, image_extension, load_catalog, register_cloudinary, resolve_photo
from data import ROOT, read_json, sha256, write_json
from test_benchmark import png


class CloudinaryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = load_catalog()
        cls.event = "nacional-enduro-las-pircas-2026"
        cls.photo = "DSC03841"

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="cloudinary-synthetic-", dir=ROOT / "tests")
        self.dataset = Path(self.temp.name)
        write_json(self.dataset / "manifest.json", {"schemaVersion": 1, "datasetVersion": "synthetic", "cases": []})
        write_json(self.dataset / "ground-truth.json", {"schemaVersion": 1, "cases": {}})
        self.original = (self.dataset / "manifest.json").read_bytes()

    def tearDown(self):
        self.temp.cleanup()

    def register(self):
        return register_cloudinary(self.dataset, self.event, self.photo, "tuning", "clear", "synthetic-sequence", self.catalog)

    def assert_clean(self):
        self.assertFalse(list(self.dataset.rglob("*.tmp")))
        self.assertFalse(list(self.dataset.rglob("*.lock")))

    def test_catalog_resolution(self):
        result = resolve_photo(self.catalog, self.event, self.photo)
        self.assertEqual(result["categoryId"], "circuito-molle")
        self.assertIn("/f_auto,q_auto,w_1200/v1779675237/", result["web"])
        self.assertEqual(result["high"], result["web"].replace("f_auto,q_auto,w_1200/", ""))
        rio = resolve_photo(self.catalog, "rio-pinto-2026", "DSC02995")
        self.assertIsNone(rio["categoryId"])

    def test_invalid_and_ambiguous_ids(self):
        for event, photo in (("no-existe", self.photo), (self.event, "no-existe"), ("../bad", self.photo), (self.event, "../bad")):
            with self.assertRaises(ValueError):
                resolve_photo(self.catalog, event, photo)
        catalog = deepcopy(self.catalog)
        catalog[0]["photos"].append(deepcopy(catalog[0]["photos"][0]))
        with self.assertRaisesRegex(ValueError, "ambiguo"):
            resolve_photo(catalog, self.event, self.photo)

    def test_uncertain_high_rejected(self):
        for field, value in (("publicId", "other"), ("image", "https://evil.example/image.jpg"),
                             ("image", "https://res.cloudinary.com/demo/image/upload/no-version.jpg")):
            catalog = deepcopy(self.catalog)
            catalog[0]["photos"][0][field] = value
            with self.assertRaises(ValueError):
                resolve_photo(catalog, self.event, self.photo)

    def test_registration_and_no_overwrite(self):
        def fake_download(url, path):
            path.write_bytes(png(10 if "w_1200" in url else 20))
        with patch("cloudinary.download", side_effect=fake_download) as mocked:
            result = self.register()
            self.assertEqual(mocked.call_count, 2)
            with self.assertRaisesRegex(ValueError, "ya registrada"):
                self.register()
            self.assertEqual(mocked.call_count, 2)
        manifest = read_json(self.dataset / "manifest.json")
        self.assertEqual(manifest["cases"], [result])
        self.assertEqual(read_json(self.dataset / "ground-truth.json")["cases"], {})
        for info in result["variants"].values():
            self.assertEqual(info["sha256"], sha256(self.dataset / info["path"]))
            self.assertEqual((info["width"], info["height"]), (1, 1))
            self.assertEqual(info["requestAccept"], ACCEPT)
        self.assert_clean()

    def test_failure_rolls_back_both_variants(self):
        def fake_download(url, path):
            path.write_bytes(png(10) if "w_1200" in url else b"partial")
            if "w_1200" not in url:
                raise ValueError("Red interrumpida")
        with patch("cloudinary.download", side_effect=fake_download):
            with self.assertRaisesRegex(ValueError, "Red interrumpida"):
                self.register()
        self.assertEqual((self.dataset / "manifest.json").read_bytes(), self.original)
        self.assertEqual(list(self.dataset.glob("images/*/*")), [])
        self.assert_clean()

    def test_corrupt_existing_binary_not_overwritten(self):
        source = self.dataset / "test.png"
        source.write_bytes(png(10))
        dest = self.dataset / "images" / "web" / (sha256(source) + ".png")
        dest.parent.mkdir(parents=True)
        dest.write_bytes(b"do not overwrite")
        with patch("cloudinary.download", side_effect=lambda url, path: path.write_bytes(png(10))):
            with self.assertRaisesRegex(ValueError, "no se sobrescribe"):
                self.register()
        self.assertEqual(dest.read_bytes(), b"do not overwrite")
        self.assertEqual((self.dataset / "manifest.json").read_bytes(), self.original)
        self.assert_clean()

    def test_manifest_concurrent_edit(self):
        def fake_download(url, path):
            path.write_bytes(png(10))
            write_json(self.dataset / "manifest.json", {"schemaVersion": 1, "datasetVersion": "edited", "cases": []})
        with patch("cloudinary.download", side_effect=fake_download):
            with self.assertRaisesRegex(ValueError, "manifiesto cambió"):
                self.register()
        self.assertEqual(read_json(self.dataset / "manifest.json")["datasetVersion"], "edited")
        self.assert_clean()

    def test_http_incomplete_and_non_image(self):
        class Response:
            status = 200
            headers = {"Content-Type": "image/png", "Content-Length": "9999"}
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self, size):
                if hasattr(self, "done"): return b""
                self.done = True
                return png(3)
        destination = self.dataset / "download.tmp"
        with patch("cloudinary.urllib.request.build_opener") as opener:
            opener.return_value.open.return_value = Response()
            with self.assertRaisesRegex(ValueError, "incompleta"):
                download(resolve_photo(self.catalog, self.event, self.photo)["web"], destination)
            self.assertFalse(destination.exists())
            response = Response()
            response.headers = {"Content-Type": "text/html"}
            opener.return_value.open.return_value = response
            with self.assertRaisesRegex(ValueError, "no es una imagen"):
                download(resolve_photo(self.catalog, self.event, self.photo)["web"], destination)
            self.assertFalse(destination.exists())
        destination.write_bytes(png(3)[:-6])
        with self.assertRaises(ValueError):
            image_extension(destination)

    def test_git_policy(self):
        for name in ("dataset/images/web/test.jpg", "dataset/images/high/deep/test.webp", "alternate-dataset/images/web/test.png"):
            result = subprocess.run(["git", "check-ignore", "--no-index", str(ROOT / name)], cwd=ROOT.parent, capture_output=True)
            self.assertEqual(result.returncode, 0)
        for name in ("README.md", "benchmark.py", "dataset/manifest.json", "dataset/ground-truth.json", "reports/keep.json", "dataset/images/web/.gitkeep"):
            result = subprocess.run(["git", "check-ignore", "--no-index", str(ROOT / name)], cwd=ROOT.parent, capture_output=True)
            self.assertEqual(result.returncode, 1, name)


if __name__ == "__main__":
    unittest.main()
