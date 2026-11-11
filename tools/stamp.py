"""Fingerprint asset URLs so browsers and Cloudflare's cache always get the current file.

    python tools/stamp.py          rewrite ?v= stamps in every page
    python tools/stamp.py --check  exit 1 if any stamp is out of date (used by CI)

Each reference to /assets/site.css, /assets/site.js or /assets/config.js gets ?v=<first 10 hex of its SHA-256>.
Photos get one stamp per photo (all widths and formats of e.g. box-card share it), so a replaced
photo is fetched fresh instead of the browser or Cloudflare showing the old cached one."""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ["assets/site.css", "assets/site.js", "assets/config.js", "assets/reviews.js"]
SKIP = {"shopify-theme", "tools", "node_modules", ".git", "functions"}
CR = bytes([13])

def pages():
    for p in ROOT.rglob("*.html"):
        if not SKIP.intersection(p.relative_to(ROOT).parts):
            yield p
    yield ROOT / "policies" / "build.py"

# Carriage returns dropped, so Windows (CRLF) and CI (LF) checkouts produce the same stamp.
stamps = {a: hashlib.sha256((ROOT / a).read_bytes().replace(CR, b"")).hexdigest()[:10] for a in ASSETS}
# One stamp per photo name: images/box-card-800.avif -> group "box-card"
groups = {}
for f in sorted((ROOT / "images").glob("*")):
    m = re.fullmatch(r"(.+)-(\d+)\.(avif|jpg|mp4|webm)", f.name)
    if m: groups.setdefault(m.group(1), hashlib.sha256()).update(f.read_bytes())
img_stamps = {g: h.hexdigest()[:8] for g, h in groups.items()}
IMG = re.compile(r"(/images/([a-z0-9-]+)-(\d+)\.(?:avif|jpg|mp4|webm))(\?v=[0-9a-f]*)?")
def stamp_images(text):
    return IMG.sub(lambda m: m.group(1) + ("?v=" + img_stamps[m.group(2)] if m.group(2) in img_stamps else ""), text)

check = "--check" in sys.argv
# /girlfriend-giftbox is built from index.html, so rebuild it first and it gets the same stamps
if not check: import subprocess; subprocess.run([sys.executable, str(ROOT / "tools" / "variant.py")], check=True)
stale = []
for page in pages():
    text = page.read_text(encoding="utf8")
    new = text
    for a, h in stamps.items():
        new = re.sub(r'(/' + re.escape(a) + r')(\?v=[0-9a-f]*)?(?=")', r"\1?v=" + h, new)
    new = stamp_images(new)
    if new != text:
        if check: stale.append(str(page.relative_to(ROOT)))
        else: page.write_text(new, encoding="utf8"); print("stamped", page.relative_to(ROOT))
if check:
    if stale: print("Stale asset stamps (run python tools/stamp.py):", *stale, sep="\n  "); sys.exit(1)
    print("asset stamps up to date")
