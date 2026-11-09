"""Build /girlfriend-giftbox (the Stage 3 "mechanism" page) from index.html.

    python tools/variant.py          write girlfriend-giftbox.html
    python tools/variant.py --check  exit 1 if it is out of date (used by CI)

Never edit girlfriend-giftbox.html by hand. Edit index.html and rerun this (stamp.py runs it for you).
Only the head text, the hero, the new "Why none of it stuck" section and the line above the card
heading differ. Everything else is copied byte for byte, so the A/B test changes exactly one thing.
The canonical tag stays pointed at the root page."""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "index.html", ROOT / "girlfriend-giftbox.html"

HERO = "She has jewelry. None of it says anything."
SUB = "You’ve given her a bracelet. Earrings. Maybe a necklace she wears sometimes. All of it lovely. All of it silent."

WHY = """
  <!-- Why none of it stuck (this page only) -->
  <section class="why" aria-labelledby="why-h">
    <div class="wrap">
      <div class="why__text">
        <h2 class="h2" id="why-h">Why none of it stuck</h2>
        <p>Every gift you’ve given her was an object. The thing you actually meant stayed in your head, because you’ve never been able to get it out of your mouth without it coming out wrong.</p>
        <p>So she got the object. She never got the sentence.</p>
        <h2 class="h2">What’s different about this one</h2>
        <p>It’s worn, and it carries words. So the words don’t get read once and go in a drawer. They fire again every time she puts it on.</p>
        <p>Which is how a fifty dollar necklace ends up being the thing she doesn’t take off.</p>
      </div>
    </div>
  </section>
"""

def build(s):
    def r(a, b):
        nonlocal s
        if s.count(a) != 1: sys.exit(f"variant.py: expected exactly one match in index.html for:\n  {a[:90]}")
        s = s.replace(a, b)
    r('<!doctype html>\n', '<!doctype html>\n<!-- Generated from index.html by tools/variant.py. Do not edit by hand. -->\n')
    r('<title>To My Beautiful Girlfriend Infinity Heart Necklace | Dearly</title>', f'<title>{HERO} | Dearly</title>')
    r('<meta name="description" content="An infinity sign linked through a heart, set on a card that says the things you mean. Free worldwide shipping, 90-day returns.">',
      f'<meta name="description" content="{SUB}">')
    r('<meta property="og:title" content="To My Beautiful Girlfriend Infinity Heart Necklace">', f'<meta property="og:title" content="{HERO}">')
    r('<meta property="og:description" content="The gift she’ll cry over, then never take off.">', f'<meta property="og:description" content="{SUB}">')
    r('<h2 class="display" id="statement-h" data-reveal>The gift she’ll cry over, then never take off.</h2>\n      <p class="lead" data-reveal>An infinity heart necklace, a message card already written, and a box that’s ready to give.</p>',
      f'<h2 class="display" id="statement-h" data-reveal>{HERO}</h2>\n      <p class="lead" data-reveal>{SUB}</p>')
    r('  </section>\n\n  <!-- Read the card -->', '  </section>\n' + WHY + '\n  <!-- Read the card -->')
    r('<p class="reading__pre">She has jewelry. None of it says anything.</p>', '<p class="eyebrow eyebrow--light">The card inside</p>')
    return s

out = build(SRC.read_text(encoding="utf8"))
if "--check" in sys.argv:
    if not OUT.exists() or OUT.read_text(encoding="utf8") != out:
        print("girlfriend-giftbox.html is out of date (run python tools/variant.py)"); sys.exit(1)
    print("girlfriend-giftbox.html up to date")
else:
    OUT.write_text(out, encoding="utf8", newline="\n"); print("built girlfriend-giftbox.html")
