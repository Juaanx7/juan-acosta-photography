"""Generar WebP de Eventos y música desde los originales; requiere Pillow.

Uso: python scripts/generateEventsMusicImages.py
El catálogo aprobado es docs/eventos-y-musica/galeria.json.
"""
import hashlib
import io
import json
from pathlib import Path
from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs/eventos-y-musica"
SOURCE = DOCS / "fotos/originales"
OUTPUT = ROOT / "public/images/portfolio/eventos-y-musica"
MANIFEST = ROOT / "src/data/eventsMusicImages.json"
LANDSCAPE_WIDTHS = (640, 960, 1440, 1920, 2560, 3200, 4400)
PORTRAIT_WIDTHS = (480, 640, 960, 1440, 1920)


def generate():
    catalog = json.loads((DOCS / "galeria.json").read_text(encoding="utf-8-sig"))
    photos = catalog["photos"]
    names = [photo["file"] for photo in photos]
    if len(photos) != 26 or len(set(names)) != 26 or [p["order"] for p in photos] != list(range(1, 27)):
        raise ValueError("Se requieren las 26 fotografías ordenadas, sin duplicados")
    if [name for row in catalog["desktop_rows"] for name in row] != names:
        raise ValueError("Las filas no coinciden con el orden del catálogo")
    missing = [name for name in names if not (SOURCE / name).is_file()]
    if missing:
        raise FileNotFoundError("Faltan fuentes: " + ", ".join(missing))
    for photo in photos:
        name = photo["file"]
        if Path(name).name != name:
            raise ValueError("Nombre de fuente inválido: " + name)
        expected_caption = f"{photo['artist']} · {photo['event']}" if photo["artist"] else photo["event"]
        if photo["display_caption"] != expected_caption:
            raise ValueError("Epígrafe inconsistente: " + name)
        with Image.open(SOURCE / name) as original:
            if original.format != "JPEG":
                raise ValueError("La fuente no es JPEG: " + name)
            original.load()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    metadata = []
    for photo in photos:
        name = photo["file"]
        source_hash = hashlib.sha256((SOURCE / name).read_bytes()).hexdigest()
        with Image.open(SOURCE / name) as original:
            image = ImageOps.exif_transpose(original)
            profile = original.info.get("icc_profile")
            image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode="RGB") if profile else image.convert("RGB")
            width, height = image.size
            requested = LANDSCAPE_WIDTHS if width > height else PORTRAIT_WIDTHS
            variants = []
            for target_width in sorted({min(size, width) for size in requested}):
                target_height = round(height * target_width / width)
                filename = f"{Path(name).stem}-{target_width}.webp"
                image.resize((target_width, target_height), Image.Resampling.LANCZOS).save(
                    OUTPUT / filename, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
                variants.append({"image": f"/images/portfolio/eventos-y-musica/{filename}", "width": target_width, "height": target_height})
            default = min(variants, key=lambda item: abs(item["width"] - 1440))
            metadata.append({"source": name, "artist": photo["artist"], "event": photo["event"],
                             "caption": photo["display_caption"], "alt": photo["alt"], "width": width, "height": height,
                             "image": default["image"], "variants": variants, "sourceHash": source_hash})
            print(f"{name}: {width}x{height}, {len(variants)} variantes", flush=True)
    MANIFEST.write_text(json.dumps({"photos": metadata, "rows": catalog["desktop_rows"]}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
