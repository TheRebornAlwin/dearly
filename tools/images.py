"""Build the site's images from source photos.

    python tools/images.py <source-folder>

Reads the mapping below (output name -> source file inside the folder), and writes
images/<name>-<width>.avif and images/<name>-<width>.jpg at each width, plus the
1200x630 share image and the touch icon. Re-run it whenever a photo changes.
Needs Pillow 11.3+ (built with AVIF support)."""
import sys, pathlib
from PIL import Image, ImageEnhance, ImageOps

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parent.parent / "images"
WIDTHS = [400, 800, 1200, 1600]

PHOTOS = {
    "box-card":       "main_images/1.jpeg",
    "pendant-red":    "main_images/3.jpeg",
    "worn":           "main_images/6.jpeg",
    "pendant-chain":  "main_images/2.jpeg",
    "pendant-light":  "main_images/5.jpeg",
    "size":           "main_images/4.jpeg",
    "card":           "description_images/1.jpeg",
    "box-gift":       "variant_images/1.jpeg",
    "pendant-rose":   "description_images/5.jpeg",
}

def grade(im):
    # Gentle, consistent finish: a touch of contrast, keep the colours honest.
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    return im

OUT.mkdir(exist_ok=True)
for name, rel in PHOTOS.items():
    im = grade(ImageOps.exif_transpose(Image.open(SRC / rel)).convert("RGB"))
    for w in WIDTHS:
        if w > im.width: continue
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.avif", quality=58, speed=4)
        r.save(OUT / f"{name}-{w}.jpg", quality=80, optimize=True, progressive=True)
    print("built", name)

# Close crop of the card's words, for the "The card" tile.
c = grade(Image.open(SRC / PHOTOS["card"]).convert("RGB"))
W, H = c.size
c = c.crop((int(W * .27), int(H * .26), int(W * .87), int(H * .86)))
for w in WIDTHS:  # every width, so the srcset in index.html always resolves
    r = c.resize((w, w), Image.LANCZOS)
    r.save(OUT / f"card-words-{w}.avif", quality=60, speed=4)
    r.save(OUT / f"card-words-{w}.jpg", quality=82, optimize=True, progressive=True)
print("built card-words")

# Share image for Meta and messaging apps (they ignore SVG and AVIF).
hero = grade(Image.open(SRC / PHOTOS["box-card"]).convert("RGB"))
og = Image.new("RGB", (1200, 630), (240, 234, 227))
h = hero.resize((630, 630), Image.LANCZOS)
og.paste(h, (285, 0))
og.save(OUT / "og.jpg", quality=86, optimize=True)

# Apple touch icon from the pendant shot.
p = grade(Image.open(SRC / PHOTOS["pendant-light"]).convert("RGB"))
c = p.crop((p.width * 0.2, p.height * 0.35, p.width * 0.8, p.height * 0.95)).resize((180, 180), Image.LANCZOS)
c.save(OUT.parent / "apple-touch-icon.png", optimize=True)
print("built og.jpg and apple-touch-icon.png")
