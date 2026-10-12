import io
from pathlib import Path
from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'docs/sobre-mi-navbar/fotos/originales/retrato-juan-acosta.jpg'
OUTPUT = ROOT / 'public/images/portfolio/sobre-mi'


def generate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as original:
        image = ImageOps.exif_transpose(original)
        srgb = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB'))
        if original.info.get('icc_profile'):
            image = ImageCms.profileToProfile(image, ImageCms.ImageCmsProfile(io.BytesIO(original.info['icc_profile'])), srgb, outputMode='RGB')
        else:
            image = image.convert('RGB')
        width, height = image.size
        for target in sorted({min(size, width) for size in (320, 530, 680, 1020)}):
            resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            destination = OUTPUT / f'retrato-juan-acosta-{target}.webp'
            resized.save(destination, 'WEBP', quality=90, method=6, icc_profile=srgb.tobytes())
            print(f'{destination.name}: {resized.width}x{resized.height}, {destination.stat().st_size} bytes')
        print(f'Fuente: {SOURCE.name}, {width}x{height}; sin recorte ni ampliacion.')


if __name__ == '__main__':
    generate()
