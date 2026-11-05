"""Fingerprint asset URLs so browsers and Cloudflare's cache always get the current file.

    python tools/stamp.py          rewrite ?v= stamps in every page
    python tools/stamp.py --check  exit 1 if any stamp is out of date (used by CI)

Each reference to /assets/site.css, /assets/site.js or /assets/config.js gets ?v=<first 10 hex of its SHA-256>."""
import hashlib, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ["assets/site.css", "assets/site.js", "assets/config.js"]
SKIP = {"shopify-theme", "tools", "node_modules", ".git", "functions"}
CR = bytes([13])

def pages():
    for p in ROOT.rglob("*.html"):
        if not SKIP.intersection(p.relative_to(ROOT).parts):
            yield p
    yield ROOT / "policies" / "build.py"

# Carriage returns dropped, so Windows (CRLF) and CI (LF) checkouts produce the same stamp.
stamps = {a: hashlib.sha256((ROOT / a).read_bytes().replace(CR, b"")).hexdigest()[:10] for a in ASSETS}
check = "--check" in sys.argv
stale = []
for page in pages():
    text = page.read_text(encoding="utf8")
    new = text
    for a, h in stamps.items():
        new = re.sub(r'(/' + re.escape(a) + r')(\?v=[0-9a-f]*)?(?=")', r"\1?v=" + h, new)
    if new != text:
        if check: stale.append(str(page.relative_to(ROOT)))
        else: page.write_text(new, encoding="utf8"); print("stamped", page.relative_to(ROOT))
if check:
    if stale: print("Stale asset stamps (run python tools/stamp.py):", *stale, sep="\n  "); sys.exit(1)
    print("asset stamps up to date")
