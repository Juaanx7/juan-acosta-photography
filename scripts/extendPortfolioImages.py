"""Add 4400px variants for the seven wide series images (Pillow required).

Run after the existing series generators. Only ignored original JPGs are read;
existing variants and sources are unchanged. Colors follow the sRGB pipeline.
"""
import io
import json
from pathlib import Path
from urllib.parse import quote

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
COLLECTIONS = (
    ("sanMarcosImages.json", "docs/san-marcos/fotos", "san-marcos", ("DSC03637", "DSC08263")),
    ("achalaImages.json", "docs/achala/fotos/originales", "achala", ("DSC02820", "DSC02780", "DSC02887", "DSC02984", "DSC02988")),
)


def generate():
    jobs = []
    for manifest_name, source_folder, output_folder, names in COLLECTIONS:
        manifest = ROOT / "src/data" / manifest_name
        data = json.loads(manifest.read_text(encoding="utf-8"))
        for name in names:
            source = ROOT / source_folder / data[name]["source"]
            with Image.open(source) as original:
                original.verify()
            jobs.append((source, output_folder, name, data[name]))
    srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
    for source, folder, name, entry in jobs:
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            profile = original.info.get("icc_profile")
            image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode="RGB") if profile else image.convert("RGB")
            width, height = image.size
            target = min(4400, width)
            relative = Path(entry["source"]).parent / f"{name}-{target}.webp"
            destination = ROOT / "public/images/portfolio" / folder / relative
            output_height = round(height * target / width)
            if not destination.exists():
                image.resize((target, output_height), Image.Resampling.LANCZOS).save(destination, "WEBP", quality=90, method=6, icc_profile=srgb.tobytes())
            entry["variants"] = sorted([variant for variant in entry["variants"] if variant["width"] != target] + [{"image": f"/images/portfolio/{folder}/{quote(relative.as_posix())}", "width": target, "height": output_height}], key=lambda variant: variant["width"])
            print(f"{source.name}: {target}x{output_height}", flush=True)
    # Save only after every source and variant has completed successfully.
    for manifest_name, _, folder, _ in COLLECTIONS:
        manifest = ROOT / "src/data" / manifest_name
        data = json.loads(manifest.read_text(encoding="utf-8"))
        data.update({name: entry for _, job_folder, name, entry in jobs if job_folder == folder})
        manifest.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    generate()
