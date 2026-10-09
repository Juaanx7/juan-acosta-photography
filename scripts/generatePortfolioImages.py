"""Generate uncropped, color-managed WebP variants from local portfolio originals.

Requires Pillow (with LittleCMS and WebP support). Run from any directory:
  python scripts/generatePortfolioImages.py
Sources are ignored by Git. This script never enlarges or modifies them.
"""

import argparse
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/portfolio-v2/fotos-originales"
OUTPUT = ROOT / "public/images/portfolio"
MANIFEST = ROOT / "src/data/portfolioImages.json"
WIDTHS = (640, 960, 1440, 1920, 2560, 3200)
NAMES = ("golden", "walkers", "forest", "sport", "valley")


def generate(names):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    metadata = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    for name in names:
        with Image.open(SOURCE / f"{name}.jpg") as original:
            image = ImageOps.exif_transpose(original)
            if original.info.get("icc_profile"):
                source_profile = ImageCms.ImageCmsProfile(io.BytesIO(original.info["icc_profile"]))
                image = ImageCms.profileToProfile(image, source_profile, srgb, outputMode="RGB")
            else:
                image = image.convert("RGB")
            width, height = image.size
            variants = []
            # Include the source width when smaller than the largest requested size.
            widths = sorted({min(size, width) for size in WIDTHS})
            for target_width in widths:
                target_height = round(height * target_width / width)
                resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                filename = f"{name}-{target_width}.webp"
                destination = OUTPUT / filename
                resized.save(destination, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
                variants.append({"image": f"/images/portfolio/{filename}", "width": target_width, "height": target_height})
                print(f"{filename}: {target_width}x{target_height}, {destination.stat().st_size // 1024} KiB")
            default = min(variants, key=lambda item: abs(item["width"] - 1440))
            metadata[name] = {"image": default["image"], "width": width, "height": height, "variants": variants}
    MANIFEST.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--names", nargs="+", choices=NAMES, default=NAMES)
    generate(parser.parse_args().names)
