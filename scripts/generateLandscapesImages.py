"""Generate WebP variants from the twenty approved Paisajes y viajes JPGs; requires Pillow.

Validate every source before writing. Never crop, enlarge or modify originals.
Run: python scripts/generateLandscapesImages.py
"""
import csv
import io
import hashlib
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/paisajes-y-viajes/fotos/originales"
OUTPUT = ROOT / "public/images/portfolio/paisajes-y-viajes"
MANIFEST = ROOT / "src/data/landscapeImages.json"
LANDSCAPE_WIDTHS = (640, 960, 1440, 1920, 2560, 3200, 4400)
PORTRAIT_WIDTHS = (480, 640, 960, 1440, 1920)
EXPECTED = ('DSC08585.jpg', 'DSC00793.jpg', 'DSC06286.jpg', 'DSC02826.jpg', 'DSC02934.jpg', 'DSC06392.jpg', 'DSC06547.jpg', 'DSC06484-Editar.jpg', 'DSC06023.jpg', 'DSC06975.jpg', 'DSC07567.jpg', 'DSC03691.jpg', 'DSC06836.jpg', 'DSC01960.jpg', 'DSC02988.jpg', 'DSC05652.jpg', 'DSC07903.jpg', 'DSC08261.jpg', 'DSC00888.jpg', 'DSC06005.jpg')


def generate():
    with (ROOT / "docs/paisajes-y-viajes/FOTOS.csv").open(encoding="utf-8-sig", newline="") as catalog:
        rows = list(csv.DictReader(catalog, delimiter=","))
    if tuple(row["archivo"] for row in rows) != EXPECTED or [int(row["orden"]) for row in rows] != list(range(1, 21)):
        raise ValueError("FOTOS.csv does not match the twenty approved files and order")
    missing = [name for name in EXPECTED if not (SOURCE / name).is_file()]
    if missing:
        raise FileNotFoundError("Missing sources: " + ", ".join(missing))
    for name in EXPECTED:
        with Image.open(SOURCE / name) as original:
            original.verify()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    metadata = {}
    for row in rows:
        name = row["archivo"]
        source_hash = hashlib.sha256((SOURCE / name).read_bytes()).hexdigest()
        # Reuse only the exact original already optimized for Achala.
        if name == "DSC02988.jpg" and source_hash == "a8f4b8da953d0f51b52d2e9555b7a6d4cf082e484eac7f3d5a7e4b6fa0bda13b":
            existing = json.loads((ROOT / "src/data/achalaImages.json").read_text())[Path(name).stem]
            if all((ROOT / "public" / variant["image"].lstrip("/")).is_file() for variant in existing["variants"]):
                metadata[Path(name).stem] = {**existing, "location": row["ubicacion"], "alt": row["texto_alternativo"], "sourceHash": source_hash}
                print(f"{name}: reused {len(existing['variants'])} Achala variants", flush=True)
                continue
        with Image.open(SOURCE / name) as original:
            image = ImageOps.exif_transpose(original)
            profile = original.info.get("icc_profile")
            if profile:
                image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode="RGB")
            else:
                image = image.convert("RGB")
            width, height = image.size
            variants = []
            requested_widths = LANDSCAPE_WIDTHS if width > height else PORTRAIT_WIDTHS
            for target_width in sorted({min(size, width) for size in requested_widths}):
                target_height = round(height * target_width / width)
                filename = f"{Path(name).stem}-{target_width}.webp"
                resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                resized.save(OUTPUT / filename, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
                variants.append({"image": f"/images/portfolio/paisajes-y-viajes/{quote(filename)}", "width": target_width, "height": target_height})
            default = min(variants, key=lambda variant: abs(variant["width"] - 1440))
            metadata[Path(name).stem] = {"source": name, "image": default["image"], "width": width, "height": height, "variants": variants, "location": row["ubicacion"], "alt": row["texto_alternativo"], "sourceHash": source_hash}
            print(f"{name}: {width}x{height}, {len(variants)} variants", flush=True)
    MANIFEST.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
