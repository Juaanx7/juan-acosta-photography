"""Generate WebP variants from the twenty approved Deportes en montaña JPGs; requires Pillow.

Validate every source before writing. Never crop, enlarge or modify originals.
Run: python scripts/generateMountainSportsImages.py
"""
import csv
import io
import hashlib
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/deportes-en-montana/fotos/originales"
OUTPUT = ROOT / "public/images/portfolio/deportes-en-montana"
MANIFEST = ROOT / "src/data/mountainSportsImages.json"
LANDSCAPE_WIDTHS = (640, 960, 1440, 1920, 2560, 3200, 4400)
PORTRAIT_WIDTHS = (480, 640, 960, 1440, 1920)
EXPECTED = ('DSC06918.jpg', 'DSC04908.jpg', 'DSC04741.jpg', 'DSC07076.jpg', 'DSC03832.jpg', 'DSC06683.jpg', 'DSC04471.jpg', 'DSC07968.jpg', 'DSC08137.jpg', 'DSC09314.jpg', 'DSC08579.jpg', 'DSC04994.jpg', 'DSC06797.jpg', 'DSC04326.jpg', 'DSC02996.jpg', 'DSC08126.jpg', 'DSC08226.jpg', 'DSC05303.jpg', 'DSC05143.jpg', 'DSC06882.jpg')


def generate():
    with (ROOT / "docs/deportes-en-montana/FOTOS.csv").open(encoding="utf-8-sig", newline="") as catalog:
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
                variants.append({"image": f"/images/portfolio/deportes-en-montana/{quote(filename)}", "width": target_width, "height": target_height})
            default = min(variants, key=lambda variant: abs(variant["width"] - 1440))
            metadata[Path(name).stem] = {"source": name, "image": default["image"], "width": width, "height": height, "variants": variants, "race": row["carrera"], "alt": row["texto_alternativo"], "sourceHash": source_hash}
            print(f"{name}: {width}x{height}, {len(variants)} variants", flush=True)
    MANIFEST.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
