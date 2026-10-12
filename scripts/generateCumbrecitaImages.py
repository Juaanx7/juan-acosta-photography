"""Generate WebP variants from the twelve approved La Cumbrecita JPGs; requires Pillow.

Validate every source before writing. Never crop, enlarge or modify originals.
Run: python scripts/generateCumbrecitaImages.py
"""
import csv
import io
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/la-cumbrecita/fotos/originales"
OUTPUT = ROOT / "public/images/portfolio/la-cumbrecita"
MANIFEST = ROOT / "src/data/cumbrecitaImages.json"
LANDSCAPE_WIDTHS = (640, 960, 1440, 1920, 2560, 3200, 4400)
PORTRAIT_WIDTHS = (480, 640, 960, 1440, 1920)
EXPECTED = ("DSC03544.jpg", "DSC03493.jpg", "DSC03489.jpg", "DSC03541.jpg", "DSC03530.jpg", "DSC03523.jpg", "DSC03582.jpg", "DSC03586.jpg", "DSC03557.jpg", "DSC03601.jpg", "DSC03619.jpg", "DSC03622.jpg")


def generate():
    with (ROOT / "docs/la-cumbrecita/FOTOS.csv").open(encoding="utf-8-sig", newline="") as catalog:
        rows = list(csv.DictReader(catalog, delimiter=";"))
    if tuple(row["archivo"] for row in rows) != EXPECTED or [int(row["orden"]) for row in rows] != list(range(1, 13)):
        raise ValueError("FOTOS.csv does not match the twelve approved files and order")
    missing = [name for name in EXPECTED if not (SOURCE / name).is_file()]
    if missing:
        raise FileNotFoundError("Missing sources: " + ", ".join(missing))
    for name in EXPECTED:
        with Image.open(SOURCE / name) as original:
            original.verify()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    metadata = {}
    for name in EXPECTED:
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
                variants.append({"image": f"/images/portfolio/la-cumbrecita/{quote(filename)}", "width": target_width, "height": target_height})
            default = min(variants, key=lambda variant: abs(variant["width"] - 1440))
            metadata[Path(name).stem] = {"source": name, "image": default["image"], "width": width, "height": height, "variants": variants}
            print(f"{name}: {width}x{height}, {len(variants)} variants", flush=True)
    MANIFEST.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
