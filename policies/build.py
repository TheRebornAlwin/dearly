"""Turn policies/src/*.md into policies/*.html. Run from the repo root: python policies/build.py
Everything above the first '---' line in each .md is a note for us and is not published."""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | Dearly</title>
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://givedearly.com/policies/{slug}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192">
<link rel="stylesheet" href="/assets/site.css?v=69702e6be3">
</head>
<body>
<header class="header">
  <div class="wrap header__row">
    <a class="wordmark" href="/" aria-label="Dearly, home">Dearly</a>
    <a class="header__buy" href="/#buy">Shop the necklace</a>
  </div>
</header>
<main class="policy">
  <div class="wrap">
    <a class="back" href="/">Back to Dearly</a>
{body}
  </div>
</main>
<footer class="footer">
  <div class="wrap">
    <div class="footer__base footer__base--solo">
      <p>&copy; 2026 Dearly</p>
      <p><a href="/policies/shipping-policy">Shipping</a> &middot; <a href="/policies/refund-policy">Refunds</a> &middot; <a href="/policies/terms-of-service">Terms</a> &middot; <a href="/policies/privacy-policy">Privacy</a> &middot; <a href="/policies/cookie-policy">Cookies</a></p>
    </div>
  </div>
</footer>
</body>
</html>
"""

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"`(.+?)`", r"\1", t)
    t = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\b([\w.+-]+@(?:givedearly\.com|gmail\.com))\b", r'<a href="mailto:\1">\1</a>', t)
    return t

def convert(md):
    out, para, lst = [], [], None
    def flush():
        nonlocal para, lst
        if para: out.append("    <p>" + inline(" ".join(para)) + "</p>"); para = []
        if lst: out.append(f"    <{lst[0]}>" + "".join(f"<li>{inline(i)}</li>" for i in lst[1]) + f"</{lst[0]}>"); lst = None
    for line in md.splitlines():
        s = line.strip()
        if not s: flush(); continue
        m = re.match(r"^(#{1,3})\s+(.*)", s)
        if m:
            flush(); n = len(m.group(1)); out.append(f"    <h{n}>{inline(m.group(2))}</h{n}>"); continue
        m = re.match(r"^([-*]|\d+\.)\s+(.*)", s)
        if m:
            kind = "ol" if m.group(1)[0].isdigit() else "ul"
            if para: flush()
            if lst and lst[0] != kind: flush()
            if not lst: lst = (kind, [])
            lst[1].append(m.group(2)); continue
        if lst: flush()
        para.append(s)
    flush()
    return "\n".join(out)

for src in sorted((ROOT / "src").glob("*.md")):
    text = src.read_text(encoding="utf8")
    title = re.search(r"^#\s+(.*)", text, re.M).group(1).strip()
    parts = re.split(r"^---\s*$", text, maxsplit=1, flags=re.M)
    body = parts[1] if len(parts) > 1 else text
    page = TEMPLATE.format(title=html.escape(title), slug=src.stem, body=f"    <h1>{html.escape(title)}</h1>\n" + convert(body))
    (ROOT / f"{src.stem}.html").write_text(page, encoding="utf8")
    print("wrote", src.stem + ".html")
