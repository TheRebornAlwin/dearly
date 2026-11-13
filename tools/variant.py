"""Build /girlfriend-giftbox (the Stage 3 "mechanism" page) from index.html.

    python tools/variant.py          write girlfriend-giftbox.html
    python tools/variant.py --check  exit 1 if it is out of date (used by CI)

Never edit girlfriend-giftbox.html by hand. Edit index.html and rerun this (stamp.py runs it for you).
Only the head text, the hero and the new "Why none of it stuck" section differ. Everything else is copied byte for byte, so the A/B test changes exactly one thing.
The canonical tag stays pointed at the root page."""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "index.html", ROOT / "girlfriend-giftbox.html"

HERO = "She has jewelry, but none of it says anything."
SUB = "You’ve given her a bracelet, earrings, maybe a necklace she wears sometimes. All of it is lovely, but none of it says what you’re truly trying to say."

# Centered, one line at a time: each line fades in on its own as it scrolls into view
WHY = """
  <!-- Why none of it stuck (this page only) -->
  <section class="why" aria-labelledby="why-h">
    <div class="wrap why__text">
      <h2 class="why__k" id="why-h" data-reveal>Why none of it stuck</h2>
      <p data-reveal>Every gift you’ve given her was a thing, because what you actually meant never made it out of your head.</p>
      <p class="why__hit" data-reveal>She got the gift, but she never got the words.</p>
      <h2 class="why__k" data-reveal>What’s different about this one</h2>
      <p data-reveal>The words come with it, already written, and she wears them, so they don’t get read once and end up in a drawer.</p>
      <p data-reveal>Every time she puts it on, she remembers what you meant.</p>
      <p class="why__hit why__hit--end" data-reveal>That’s how a $49 necklace becomes the one she never takes off.</p>
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
    r('<meta name="description" content="An infinity sign linked through a heart, set on a card that speaks from your heart. Free worldwide shipping, 90-day returns.">',
      f'<meta name="description" content="{SUB}">')
    r('<meta property="og:title" content="To My Beautiful Girlfriend Infinity Heart Necklace">', f'<meta property="og:title" content="{HERO}">')
    r('<meta property="og:description" content="The gift she’ll cry over, then never take off.">', f'<meta property="og:description" content="{SUB}">')
    r('<h2 class="display" id="statement-h" data-reveal>The gift she’ll cry over, then never take off.</h2>\n      <p class="lead" data-reveal>An infinity heart necklace and a message card written to melt her heart, and a box that’s ready to give.</p>',
      f'<h2 class="display" id="statement-h" data-reveal>{HERO}</h2>\n      <p class="lead" data-reveal>{SUB}</p>')
    r('  </section>\n\n  <!-- Read the card -->', '  </section>\n' + WHY + '\n  <!-- Read the card -->')
    return s

out = build(SRC.read_text(encoding="utf8"))
if "--check" in sys.argv:
    if not OUT.exists() or OUT.read_text(encoding="utf8") != out:
        print("girlfriend-giftbox.html is out of date (run python tools/variant.py)"); sys.exit(1)
    print("girlfriend-giftbox.html up to date")
else:
    OUT.write_text(out, encoding="utf8", newline="\n"); print("built girlfriend-giftbox.html")
