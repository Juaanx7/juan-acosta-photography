"""Generate uncropped San Marcos WebP variants; requires Pillow and pillow-heif.

Run with the ignored docs/san-marcos/fotos sources present locally.
HEIC sources are decoded with pillow-heif and converted to sRGB for the web.
"""
import io
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps
from pillow_heif import register_heif_opener

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs/san-marcos/fotos"
OUTPUT = ROOT / "public/images/portfolio/san-marcos"
MANIFEST = ROOT / "src/data/sanMarcosImages.json"
FILES = {
    "obras": ("DSC03637.jpg", "DSC05590.jpg", "DSC08228-Editar.jpg", "DSC08263.jpg", "DSC03503 (2).jpg", "DSC00869.jpg"),
    "muestra": ("IMG_5633.heic", "IMG_5660.HEIC", "IMG_5663.HEIC"),
}


def generate():
    register_heif_opener()
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    metadata = {}
    for group, names in FILES.items():
        destination = OUTPUT / group
        destination.mkdir(parents=True, exist_ok=True)
        requested_widths = (640, 960, 1440, 1920, 2560, 3200) if group == "obras" else (320, 480, 640, 960, 1440)
        for name in names:
            with Image.open(SOURCE / group / name) as original:
                image = ImageOps.exif_transpose(original)
                profile = original.info.get("icc_profile")
                if profile:
                    image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode="RGB")
                else:
                    image = image.convert("RGB")
                width, height = image.size
                variants = []
                for target_width in sorted({min(size, width) for size in requested_widths}):
                    target_height = round(height * target_width / width)
                    filename = f"{Path(name).stem}-{target_width}.webp"
                    resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                    resized.save(destination / filename, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
                    variants.append({"image": f"/images/portfolio/san-marcos/{group}/{quote(filename)}", "width": target_width, "height": target_height})
                default = min(variants, key=lambda variant: abs(variant["width"] - (1440 if group == "obras" else 640)))
                metadata[Path(name).stem] = {"source": f"{group}/{name}", "image": default["image"], "width": width, "height": height, "variants": variants}
                print(f"{name}: {width}x{height}, {len(variants)} variants")
    MANIFEST.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
