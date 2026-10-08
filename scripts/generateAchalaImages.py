"""Generate WebP variants from the twelve approved Achala JPGs; requires Pillow.

Validate every source before writing. Never crop, enlarge or modify originals.
Run: python scripts/generateAchalaImages.py
"""
import csv
import io
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/achala/fotos/originales"
OUTPUT = ROOT / "public/images/portfolio/achala"
MANIFEST = ROOT / "src/data/achalaImages.json"
WIDTHS = (640, 960, 1440, 1920, 2560, 3200)
EXPECTED = ("DSC02820.jpg", "DSC02395.jpg", "DSC02427.jpg", "DSC02568.jpg", "DSC02569.jpg", "DSC02780.jpg", "DSC02824.jpg", "DSC02882.jpg", "DSC02887.jpg", "DSC02966.jpg", "DSC02984.jpg", "DSC02988.jpg")


def generate():
    with (ROOT / "docs/achala/FOTOS.csv").open(encoding="utf-8-sig", newline="") as catalog:
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
            for target_width in sorted({min(size, width) for size in WIDTHS}):
                target_height = round(height * target_width / width)
                filename = f"{Path(name).stem}-{target_width}.webp"
                resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                resized.save(OUTPUT / filename, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
                variants.append({"image": f"/images/portfolio/achala/{quote(filename)}", "width": target_width, "height": target_height})
            default = min(variants, key=lambda variant: abs(variant["width"] - 1440))
            metadata[Path(name).stem] = {"source": name, "image": default["image"], "width": width, "height": height, "variants": variants}
            print(f"{name}: {width}x{height}, {len(variants)} variants", flush=True)
    MANIFEST.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
