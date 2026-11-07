# Dearly: complete project log

Everything about how givedearly.com was built: the owner's direction in their own words, how that direction was interpreted, every design and engineering decision, the steps taken, the edits made, what went wrong and how it was fixed, and what is still open.

Repo: `TheRebornAlwin/dearly` · Live: https://givedearly.com · Hosting: Cloudflare Pages · Checkout: Shopify (checkout only)

---

## Contents

1. [What Dearly is](#1-what-dearly-is)
2. [The big decisions](#2-the-big-decisions)
3. [Standing rules from the owner](#3-standing-rules-from-the-owner)
4. [The design brief, in the owner's words](#4-the-design-brief-in-the-owners-words)
5. [How the brief was interpreted](#5-how-the-brief-was-interpreted)
6. [Competitor research](#6-competitor-research)
7. [Product facts (what is true and verified)](#7-product-facts-what-is-true-and-verified)
8. [Architecture](#8-architecture)
9. [The page, section by section](#9-the-page-section-by-section)
10. [Design system](#10-design-system)
11. [Motion and scroll effects](#11-motion-and-scroll-effects)
12. [Copy and voice](#12-copy-and-voice)
13. [Photos and the image pipeline](#13-photos-and-the-image-pipeline)
14. [Performance](#14-performance)
15. [Security and privacy](#15-security-and-privacy)
16. [Meta Pixel and Conversions API](#16-meta-pixel-and-conversions-api)
17. [Automatic checks (QA)](#17-automatic-checks-qa)
18. [Timeline of every change](#18-timeline-of-every-change)
19. [Problems hit and how they were fixed](#19-problems-hit-and-how-they-were-fixed)
20. [How to do common jobs](#20-how-to-do-common-jobs)
21. [Still open](#21-still-open)

---

## 1. What Dearly is

Dearly sells one product: the **"To My Beautiful Girlfriend" Infinity Heart Necklace**. It is a silver tone infinity sign set with cubic zirconia, linked through a rose gold tone heart, set on a black message card inside a black gift box. The buyer is almost always a man buying for his girlfriend. The real product being sold is the moment she opens the box and reads the card.

- Price: **$49.99**, shown against **$99.99** with a **Save 50%** badge.
- Shipping: free, worldwide, **1 to 2 weeks**.
- Returns: 90 days, full refund.
- Traffic: Meta ads (planned).

---

## 2. The big decisions

### Shopify theme first, then our own website
The project started as Shopify Liquid sections (`shopify-theme/`, kept in the repo but unused). The owner then decided, in their words:

> "we're gonna have our own fucking website and the checkout eventually is gonna be from shopify but only the checkout page not the product page."

So:
- **The product page is our own static website** (HTML, CSS, JS) on **Cloudflare Pages**, at the repo root.
- **Shopify is used for checkout only.** The Buy button sends the shopper to a Shopify cart permalink: `https://<shop>.myshopify.com/cart/<variantId>:1`.
- **givedearly.com is never pointed at Shopify.** This is a firm rule.

### Why static
- Fastest possible load (no app server, no theme overhead).
- Full control of every pixel and every header.
- Cloudflare's edge serves it worldwide.
- Nothing to patch, nothing to hack.

---

## 3. Standing rules from the owner

| Rule | Detail |
|---|---|
| Auto-push | Every change is committed and pushed to `TheRebornAlwin/dearly` automatically, without asking. |
| Own website | Never suggest connecting the domain to Shopify. Shopify is checkout only. |
| Price anchor | Keep `$99.99` struck through. Badge says **Save 50%** (changed from "Save $50"). Not to be re-litigated. |
| No dashes | No em dashes or en dashes anywhere in the copy. The owner considers them an AI tell. |
| Exclamation marks | Only allowed in the announcement bar. |
| Missing photos | A missing or placeholder image may only produce a **warning** in the checks, never a failure. |
| Supplier limits | No custom card printing, no LED box. |
| Shipping promise | "1 to 2 weeks" (owner: "just be like 5-10 days or 1-2 weeks shipping"). |
| Talk like a human | Copy must sound like a person, not a brand or a robot (see section 12). |
| Detail | Every tiny detail matters. The site is judged at the level of a single pixel. |

---

## 4. The design brief, in the owner's words

These are the instructions that shaped everything. They are quoted so the standard is never diluted.

**The makeover request:**

> "See if there's anything which is not industry standard and cutting-edge, fast, modern, novel, 2030 tech level, revolutionizing, ultra secure, enterprise-level that we should follow/use for this."

> Research the top players selling this kind of gift, break down their pages, study design engineering, crisp scroll effects (not flashy), buyer psychology and emotion. "THIS IS THE PRODUCT."

> Pay attention to every tiny detail: hover, visual effects, letters, shadow, image, gradients, colors. "transform this website from a 3/10 to a 15/10 and even more. COME ON LETS GO"

**Later, on the standard of craft:**

> "remember to make it beautifully designed or else it'll go against the grain of the whole site. you are still leonardo da vinci of web design and you should always be looking for opportunities to make the website look much better and amazing"

> "with the design thing we have to pay attention to every little detail"

> "every little detail elevate to the max and make it super crisp and clean"

**On the top banner:**

> "the top banner is way too generic. No depth or anything... no movement, no premium"

**On photos:**

> "we need this to be crisp clear 100%"

**On the copy:**

> "the whole page looks nice enough but doesn't talk like a HUMAN."

---

## 5. How the brief was interpreted

"15/10, 2030 tech, Leonardo da Vinci" was turned into concrete working principles:

1. **Premium craft for the gift buyer.** The niche is full of cheap-looking template stores. The opening is to look like Mejuri or Dogeared, then aim the emotion squarely at the man buying the gift.
2. **The card is the hero.** The product is the moment she reads the card, so the page builds a dedicated scene around reading it ("Read what she'll read").
3. **Restraint over noise.** Effects are tied to scroll and feel physical: things settle, draw, light up. Nothing bounces, flashes or spins for attention. "Crisp, not flashy."
4. **Native platform tech, no heavy libraries.** Scroll effects use CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`). They run off the main thread, so they stay smooth on cheap phones, and cost zero JavaScript. That is the "2030 tech" part: the browser does it natively.
5. **Every element earns its place.** If a line states the obvious, it goes. If a photo repeats, it goes. If a section repeats another, they merge.
6. **Real photos, real facts.** Every claim on the page matches the real product. Nothing is invented about materials or durability.
7. **Speed is part of the design.** A beautiful page that loads slowly loses the sale. Images are modern formats at four sizes, fonts are self-hosted, and there are speed budgets enforced by CI.
8. **Mobile first, desktop considered.** Most Meta traffic is phones. Every section is checked at 360, 390, 768 and 1440 px wide.
9. **Accessible by default.** Contrast passes WCAG, tap targets are at least 24 px, reduced-motion users get a calm page, everything works by keyboard.
10. **Prove it, don't claim it.** Every change is checked with screenshots, Lighthouse and automated tests before it is called done.

---

## 6. Competitor research

What the market looks like for "message card necklace" gifts:

- **Niche sellers** (VVS Jewelry, San Rocco, Walmart marketplace sellers, ShineOn-template stores): heavy on countdown timers, fake urgency, cluttered layouts, low-res photos. They look cheap, which undermines a gift meant to feel meaningful.
- **Premium references** (Mejuri, Dogeared): calm layouts, lots of whitespace, serif typography, honest copy, excellent photography, confidence instead of pressure.
- **The gap:** nobody combines premium craft with the emotional "say what you mean" angle aimed at the gift buyer. That is where Dearly sits.

Buyer psychology used on the page:
- **The emotional job:** he wants her to feel loved and he is scared of getting the words wrong. The page tells him the card says it for him.
- **Risk removal:** 90-day returns, free shipping, secure Shopify checkout, real delivery dates.
- **Honest urgency:** the holiday "order by" date is real and calculated every day (see section 9).
- **Price anchor:** $99.99 struck through, "Save 50%".

---

## 7. Product facts (what is true and verified)

Taken from the supplier's photos (AliExpress item 3256808690219018). The old copy on the site was wrong in several places and was corrected:

| | Old site copy (wrong) | Real product |
|---|---|---|
| Card text | Invented wording | "To My Beautiful Girlfriend" card, real text (below) |
| Finish | 18K yellow gold | Silver tone infinity, rose gold tone heart |
| Size | 0.8 x 0.7 in | 0.91 x 0.51 in (2.3 x 1.3 cm) |
| Chain | 18 to 22 in | 17.7 in (45 cm) plus 2 in (5 cm) extender |
| Stones | | Cubic zirconia |
| Metal / tarnish | "stainless steel, won't turn her skin green" | **Unknown.** Claim removed until the supplier confirms the base metal. |

**The real card text:**

> To My Beautiful *Girlfriend*
> If I had one *wish*, it would be to turn back time so I could find you *sooner* and love you *longer*.
> In your eyes, I have found my *home*.
> In your heart, I have found my *love*.
> In your soul, I have found my *mate*.
> The day I met you, I found my missing piece.
> If I did anything right in my life, it was when I gave my heart to you.
> You are my life, my love, and my best friend.
> *I love you, forever and always.*

(Words in italics are the ones written in script on the physical card.)

---

## 8. Architecture

```
Visitor ──> givedearly.com (Cloudflare Pages, static)
              │
              ├─ index.html, assets/, images/       product page
              ├─ policies/*.html                    legal pages
              ├─ functions/api/event.js             Meta Conversions API relay
              │
              └─ Buy ──> https://<shop>.myshopify.com/cart/<variantId>:1   (Shopify checkout)
```

### Files

| Path | What it is |
|---|---|
| `index.html` | The product page (home page) |
| `assets/site.css` | All styles, including every scroll effect |
| `assets/site.js` | Consent, Pixel, checkout button, delivery dates, gallery, image viewer, sticky bar, card shine |
| `assets/config.js` | **Checkout settings**: `shopDomain`, `variantId`, currency, price |
| `assets/reviews.js` | Data file for the reviews section |
| `assets/fonts/` | Newsreader (serif) and Instrument Sans (sans), self-hosted variable fonts |
| `images/` | Every photo as AVIF + JPG at 400/800/1200/1600 px |
| `policies/src/*.md` → `policies/*.html` | Policy pages, built by `python policies/build.py` |
| `functions/api/event.js` | Server-side copy of Pixel events (Conversions API) |
| `functions/docs/[[path]].js` | Keeps this `docs/` folder off the public website |
| `_headers` | Security headers and caching rules |
| `robots.txt`, `sitemap.xml`, `404.html` | The usual |
| `favicon.ico`, `favicon.png`, `apple-touch-icon.png` | Icons (the serif "d" mark) |
| `tools/` | Image pipeline, fingerprinting, checks, browser tests, Lighthouse config |
| `.github/workflows/checks.yml` | CI on every push, plus an optional gated deploy |
| `shopify-theme/` | The earlier Liquid version. Not used |

### Checkout flow
1. `assets/config.js` holds `shopDomain` and `variantId`.
2. `site.js` builds the permalink only if both are valid (variant ID must be digits).
3. Hovering or touching a Buy button **preconnects** to the shop so checkout opens faster.
4. Clicking shows a spinner and "Opening secure checkout", fires the Pixel `InitiateCheckout` event, then redirects.
5. A `pageshow` handler resets the button if the shopper comes back with the browser's Back button.
6. Until checkout is configured, Buy shows: "Checkout is being connected. To order now, email hello@givedearly.com and we will reply the same day."

---

## 9. The page, section by section

Top to bottom, with the design reasoning for each.

### Announcement bar
- **Messages:** *Holiday sale* 50% OFF EVERYTHING · *Free* WORLDWIDE SHIPPING · *Order by Dec 4* FOR CHRISTMAS (the last one is calculated live).
- **Depth:** layered burgundy gradient (`#883A3A → #742B2B → #652424`), a soft radial light from the top, an inner top highlight and bottom shadow, and a **champagne hairline** along the bottom edge.
- **Movement:** a slow band of light sweeps across every 8 seconds.
- **Type:** key words in Newsreader italic in champagne (`#EFD3BC`), the rest in letter-spaced uppercase sans. Messages are separated by small rotated champagne diamonds.
- **Phones:** one message at a time, each rising in with a soft blur, rotating every 5 seconds.
- **Reduced motion:** no sweep, no rotation; messages stack.
- *Why:* the owner called the first version "way too generic. No depth... no movement, no premium."

### Header
- Sticky, translucent paper with backdrop blur. A border and soft shadow **fade in as you scroll** (driven by the `scroll()` timeline).
- Left: The card · Details · Questions (underline draws in on hover). Centre: the **Dearly** wordmark in Newsreader. Right: a **Buy now** button (price removed from all buttons at the owner's request).

### Product area (`#buy`)
- **Gallery:** 5 square photos (box and card, pendant on red, worn, pendant on chain, size guide). On desktop: first photo full width, then a 2-column grid; on phones: a swipe carousel with dot indicators (24 px tap targets). Gentle 3.5% zoom on hover.
- **Image viewer:** tap any photo for a full-screen `<dialog>` with next and previous, keyboard arrows, swipe, click-to-zoom at the pointer, and View Transitions between photos. It loads the 1600 px version.
- **Buy box:**
  - Eyebrow "For her, from you".
  - Title "To My Beautiful Girlfriend Infinity Heart Necklace".
  - Price $49.99, then $99.99 with a **thin burgundy diagonal strike**, then the **Save 50%** badge. The diagonal replaced a straight line-through, because the owner pointed out the line went through the middle of the 9s and made them unreadable.
  - Lede: "An infinity sign linked through a heart, set on a card that says the things you mean." (The owner flagged a second sentence, "It arrives ready to hand to her", as robotic, so it was removed.)
  - What's included: **The necklace,** silver tone infinity through a rose gold tone heart · **The card** you see in the photo · **The box** it all comes in.
  - Holiday line (live): "Order by Fri, Dec 4 for delivery before Christmas."
  - Buy button: full width, 62 px tall, burgundy fill **sweeps in from the left** on hover, with a soft burgundy shadow.
  - Live delivery estimate: "Free shipping. Order today, arrives Nov 12 to Nov 19."
  - Trust row: 90-day returns, no questions · Boxed and ready to give · Secure checkout by Shopify.

### Statement band
- "The gift that says what you've been trying to say." The owner called this line perfect.
- Under it: "You know how you feel about her. Getting it into words is the hard part. So the card says it, and you get to watch her read it."
- **Background:** dark ink with a soft burgundy glow, plus a **thin pink heart that draws itself as you scroll**. Both halves start at the top dip and meet at the pointed tip, with a fainter echo heart inside and a faint glow. The heart frames the headline and is fully drawn by the time the band is centred on screen. See section 19 for how this took three iterations.

### "Read what she'll read." (`#card`)
- Dark section. On desktop, the card photo is **sticky** on one side while the real card text scrolls on the other.
- **Each line lights up as it scrolls into view**: opacity rises from 56% to 100% and a slight blur clears.
- **Script words highlighted:** the words written in cursive on the real card (Girlfriend, wish, sooner, longer, home, love, mate, and the last line) are set in Newsreader italic in champagne. That makes the text visibly match the photo. "Girlfriend" gets its own large line, as on the card.
- **Card shine:** on desktop, a soft light follows the cursor across the card photo.
- The owner called the scroll reveal "very nice".

### In the box
- Heading "Three things, already put together", then "This is what she opens."
- **One large, sharp photo** of the box, card and necklace, replacing three tiles that repeated the same picture. It sits on an **offset hairline frame** like a print mount.
- **Numbered pins on the photo** (1 on the necklace chain, 2 on the card, 3 on the box), each with a soft pulsing ring. Upright sans numerals, so they sit dead centre (the italic serif numbers looked off-centre).
- A matching list with italic burgundy numerals:
  - **01 The necklace:** "One runs right through the other. That's kind of the whole point."
  - **02 The card:** "It says the stuff you'd say if you were better with words. Most of us aren't."
  - **03 The box:** "She lifts the lid and that's the moment. You'll want to be there for it."
- **Linked hover:** hovering a list line lights its pin, and hovering a pin underlines its line (pure CSS `:has()`).
- **Scroll:** the photo unveils from a slight inset and the pins pop in one after another.
- **Layout:** text left, photo right on desktop, so it alternates with the sections before and after (owner request). Photo first on phones.
- Merged the old "Nothing to wrap" section into this one, which also cut how often the box photo appears down the page.

### The meaning
- Pendant photo with a **light glint sweeping across it on scroll**.
- "Forever, linked through the heart." "The infinity runs straight through the heart. They're locked together, and they don't come apart. You won't have to explain it. She'll get it the second she sees it."

### Worn, full width
- **Desktop:** the owner made a dedicated wide photo (1886 x 834). It is shown at its natural ratio with no crop and no zoom, so it is sharp. Text sits over the bottom with a soft dark gradient, clear of the pendant.
- **Phones:** the square worn photo, with the text on a dark band below it. A CSS ordering bug had been putting the text over the necklace; fixed.
- "Small enough for every day. Easy to notice." / "Under an inch wide, so she can wear it every day. You'll catch it every time she turns her head."

### Details (`#details`)
Design, finish, stones, pendant size, chain, what's included, care ("Off for showers and swims, on after perfume").

### Guarantee
A rotating wax-seal mark (turns gently with scroll). "90 days to change your mind." "If she doesn't love it, email us any time in the next 90 days and you get every cent back. We won't ask why." "Honestly, if it doesn't land, you shouldn't have to pay for it."

### Questions (`#faq`)
An exclusive accordion (`<details name="faq">`, so only one is open at a time) with smooth height animation. Six questions remain. The owner asked to remove "Why buy this instead of something on Amazon?" (don't plant the idea), "Will there be a price or receipt in the box?" and "How should she look after it?". The answers were rewritten to sound like a person:
- Pendant size: "A little under an inch wide... Small enough for every day, big enough that you actually see it."
- Chain: "...If it's not right on her, send it back. You've got 90 days."
- Delivery: "Usually 1 to 2 weeks, and shipping's free... Need it by a certain date? Give it three weeks to be safe."
- Outside the US: "Yes, anywhere, and it's still free..."
- Damaged: "Email us a photo and we'll send a new one, free. Keep the broken one, we don't need it back."
- Returns: "90 days, full refund. Just email hello@givedearly.com and we'll sort it out."

The FAQ data that Google reads (FAQPage JSON-LD) matches the visible questions exactly.

### Reviews (`#reviews`)
- "What they said after", with the 4.9 average and "16 reviews". Cards in a masonry grid: stars, the review word for word, the first name. 9 shown on desktop, 4 on phones, then "Show more reviews".
- The reviews are real buyers, confirmed by the client. **No "Verified buyer" badge**: the owner thinks it looks weird.

### Final call
Burgundy background with a soft light. "Say it this year." / "You already know what you want to tell her. This just gets it into her hands." Light Buy button. Rose-toned pendant photo.

### Footer, sticky bar, consent
- **Footer:** wordmark, "Gifts with the words already in the box.", hello@givedearly.com, help and legal links, and a Cookie preferences button.
- **Sticky Buy bar (phones):** appears once the main Buy button scrolls out of view. It shows a 132 px thumbnail, the name, $49.99 with $99.99 struck through, and Buy now.
- **Cookie banner:** appears after 1.2 s, compact on phones. The Pixel loads only after Accept.

### Removed along the way
- Founder letter ("Why we started with a card"), at the owner's request.
- "Give her a minute with it." under the card, at the owner's request.
- "The necklace is set right on the card, so she reads it the moment she opens the box." The owner called it stating the obvious.

### Phones (Nov 7)
Most traffic is Meta ads on phones, so the page was tuned for a thumb:
- **Buy button moved up.** On phones it now comes straight after the price and the holiday date; "What's included" and the trust row follow it. Desktop order is unchanged.
- **One Buy button at a time.** The header tucks away while you scroll down and slides back the moment you scroll up. The header's Buy now steps aside while the bottom bar is up. The bottom bar now hides when the closing "Say it this year" section arrives, so it never covers that button or the footer.
- **Reviews swipe.** On phones the reviews are a sideways row with the next card peeking in, and all 16 are one flick away instead of four plus "Show more". A thin burgundy progress line tracks the swipe, and each card settles forward as it slides in.
- **Hover effects driven by scroll on touch screens.** The In the box lines underline themselves as they reach the middle of the screen; spec labels light up in turn; the product photo you swipe away eases back as the next one slides over it.
- **Tighter rhythm.** Section padding 3.9rem on phones (was 4.5rem) and the specs stay in two columns down to 340 px, which roughly halves their height.
- **Touch feel.** No grey tap flash; buttons, questions and links give their own pressed state; Buy gives a tiny haptic tick on Android.
- Gallery slides use `overflow: clip` instead of `hidden`. Hidden makes each slide its own scroll container, which silently breaks the swipe-linked effect.
- Page height on a 390 px phone went from 11,463 px to about 10,200 px.
- **Main photo never cropped (Nov 7).** An old `max-height: 50svh` plus `object-fit: cover` cut the top and bottom off the first photo on most phones. Now the photo is always the whole square: edge to edge on portrait phones; on landscape phones and tablets its size is capped by the screen height (`100svh` minus header and banner) and it is centred.
- **44 px tap targets** on touch screens for footer links, the rating link and header links, without changing how they look.
- **Device audit:** 17 sizes checked for horizontal scroll, off-screen or clipped text, cropped photos, the first photo running off screen, and small tap targets: iPhone SE 1 and 3, mini, 14, 15, 16 Pro, Pro Max, 16 Pro Max; Android 360x640, 360x780, Pixel 412x915; three landscape phones; iPad mini, Air and Pro. All pass.

---

## 10. Design system

### Colour tokens
| Token | Value | Use |
|---|---|---|
| `--paper` | `#F3EEE9` | Page background (warm, matched to the photos) |
| `--paper-raised` | `#FBF8F5` | Raised sections, light text on dark |
| `--paper-deep` | `#EAE2DA` | Image placeholders |
| `--ink` | `#1E2A33` | Text, buttons, statement band |
| `--ink-faded` | `#5E6670` | Secondary text |
| `--night` | `#15191E` | Card reading section |
| `--wax` | `#7A2E2E` | Brand burgundy: accents, hover fills, badges, strikes |
| `--rule` | `#DED4CA` | Hairlines |
| champagne | `#EFD3BC` / `#F3DDC8` | Script words, banner accents, hairlines on dark |
| heart pink | `rgb(240 168 182)` | Statement heart line art |

### Type
- **Newsreader** (serif, variable): headlines, the card text, prices, numerals, italics for emphasis.
- **Instrument Sans** (sans, variable): body, labels, buttons, eyebrows (letter-spaced uppercase).
- Self-hosted, `font-display: swap`; only Instrument Sans is preloaded (preloading both competed with the main photo).

### Shape, depth and motion tokens
- Radius: 2 px (crisp, jewellery-box edges).
- Shadows are tinted with the ink colour (`rgb(30 42 51 / x)`), never pure black, layered 1 px + 8 px + 28 px for natural depth.
- Easing: `cubic-bezier(.16, 1, .3, 1)` (fast start, long soft settle) for almost everything.

### Interaction details
- **Buttons:** burgundy fill sweeps from the left on hover; the shadow deepens; pressing scales to 98.5%; loading shows a spinner.
- **Links:** underline retracts to the right and an arrow nudges 5 px.
- **Nav:** the underline draws in from the left.
- **Focus:** 2 px burgundy outline with offset on every interactive element.
- **Selection:** burgundy highlight.

---

## 11. Motion and scroll effects

All scroll effects are **CSS scroll-driven animations**. They are gated by `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, so older browsers and reduced-motion users get a static, complete page.

| Effect | Where | How |
|---|---|---|
| Header edge fade-in | Header | `scroll()` timeline on border and shadow |
| Reveal (rise + fade) | Most headings and text | `view()`, entry 0 to 55% |
| Staggered reveals | In-the-box list items | Offset animation ranges |
| Line-by-line lighting | Card reading | Opacity 0.56 → 1 plus blur clearing per line |
| Card shine | Card photo (desktop) | JS sets `--mx/--my`; radial highlight follows the cursor |
| Heart drawing | Statement band | `stroke-dashoffset` on `pathLength="1"` paths, driven by the section's named `view-timeline` |
| Glint sweep | Meaning photo | Light gradient moves across on `view()` |
| Settle-in | Worn photo (phones) | Scale 1.14 → 1 on `view()` |
| Unveil | In-the-box photo | `clip-path: inset()` opens on `view()` |
| Pins pop in | In-the-box pins | Scale and fade, staggered |
| Pin pulse | In-the-box pins | Looping ring, staggered delays |
| Seal turn | Guarantee | Rotates −60° → 60° with scroll |
| Banner sweep and rotation | Announcement | Keyframes (time-based) |
| FAQ open | FAQ | `::details-content` with `interpolate-size` |
| Photo viewer | Gallery | View Transitions API |

---

## 12. Copy and voice

### The problem the owner raised
> "the whole page looks nice enough but doesn't talk like a HUMAN... You're not talking like a human... Just say how this and this links to how you love her... You don't have to explain it. She will understand the moment she sees it."

Specific notes from the owner:
- "It arrives ready to hand to her": robotic, remove.
- "the necklace is set right on the card so she reads it the moment she opens the box": stating the obvious, remove.
- "The words are already written so you don't have to find them at the last minute": rewrite or remove.
- "Gift ready, nothing to wrap, no price anywhere in the package": stating the obvious.
- "The gift that says what you've been trying to say": perfect, keep.
- Remove the Amazon question; remove the price-in-box and care questions.

The owner also supplied a full "Human Voice Protocol" (sentence-length variety, contractions, fragments, no AI vocabulary, no tricolons, no "not just X but Y", no em dashes, anti-sales energy).

### How it was applied
The protocol is written for testimonials and ad scripts. A store page written in all-lowercase, filler-heavy speech would look broken, so the parts that fit a brand page were applied:
- **Talk to him about her**, not about the packaging.
- **Contractions everywhere** ("you'll", "she'll", "don't").
- **Short and long sentences mixed**, with fragments allowed ("Most of us aren't.").
- **Never state the obvious.** If a reader would think "no kidding", the line goes.
- **No AI vocabulary** (elevate, seamless, unlock, curated and so on), no "Whether you're...", no "Imagine...", no tricolons.
- **A little dry humour and honesty** ("bought it last minute... she thinks I planned it" energy; "Most of us aren't.").
- **No dashes**, no exclamation marks outside the banner.

---

## 13. Photos and the image pipeline

### Sources
- The AliExpress supplier set (`main_images/`, `description_images/`, `variant_images/`).
- Owner-made images in a `dearly/` subfolder: `box-card.png` (the sharper main photo), `worn-wide.png` (the desktop worn banner) and `icon.png` (the "d" mark).

### `tools/images.py`
- Grades each photo lightly (contrast 1.04, sharpness 1.08).
- Writes **AVIF and JPG at 400, 800, 1200 and 1600 px**. A small upscale (up to 1.3x) is allowed so every size in the `srcset` exists.
- AVIF quality 82 with full colour detail (4:4:4); JPG quality 88 with no chroma subsampling.
- The main photo uses AVIF quality 74 because it is the first thing that loads (visually identical, smaller).
- Builds `worn-wide` at 800, 1200, 1600 and 1886, the 132 px sticky-bar thumbnail, the 1200 x 630 share image (`og.jpg`), and the icons (`favicon.ico` at 16/32/48, `favicon.png` at 192, `apple-touch-icon.png` at 180).
- `python tools/images.py <folder> [names...]` rebuilds everything or only the named photos.

### Art direction
The worn section uses `<picture>` with a `media="(min-width: 768px)"` source, so desktop gets the wide photo at its own ratio and phones get the square one.

### Crispness story (owner: "we need this to be crisp clear 100%")
1. **First report:** the main photo looked soft on desktop but sharp in the full-screen viewer. The size selection turned out to be correct; the real cause was the **AVIF quality setting (58)**, which smeared the stones and the card lettering. Every photo was rebuilt at quality 82 with full colour detail.
2. **Second report:** still blurry on desktop. The screenshot showed it was the **old supplier photo**, not a blurry copy of the new one. The new photo had kept the same filename, and browsers plus Cloudflare cache images for 7 days. The viewer looked right only because it loads the 1600 size, which had never been cached. Fix: **every photo URL now carries a content fingerprint** (`?v=<hash>`, one per photo across all sizes), so a replaced photo is always fetched fresh. CI fails if a fingerprint is stale.

### Favicon
The serif "d" on black from the owner's icon, exported as ico, png and apple-touch-icon.

---

## 14. Performance

- Lighthouse (mobile, simulated slow 4G) after the makeover: **Performance 95, Accessibility 100, Best Practices 100, SEO 100**.
- After raising photo quality for crispness, LCP rose from about 2.7 s to 3.7 s simulated. It was brought back to about 3.3 s by:
  - encoding the main photo at AVIF 74 (no visible difference);
  - giving the sticky bar a 5 KB thumbnail instead of loading a 400 px photo.
- The LCP budget was moved from 3.0 s to **3.5 s** so photo sharpness wins. On real 4G or wifi the main photo appears in about a second.
- Other measures:
  - The main photo is preloaded with `fetchpriority="high"`; other photos lazy-load.
  - Only one font is preloaded.
  - There's no framework: the JS is about 14 KB and the CSS about 41 KB before compression, roughly 9 KB over the wire.
  - CSS and JS are fingerprinted, because Cloudflare's edge caches them for 4 hours.
- Budgets enforced in CI:
  - Performance ≥ 0.85, Accessibility ≥ 0.95, Best Practices ≥ 0.9, SEO ≥ 0.95.
  - LCP ≤ 3.5 s, CLS ≤ 0.05, TBT ≤ 200 ms.
  - JS ≤ 16 KB, CSS ≤ 48 KB.

---

## 15. Security and privacy

`_headers` applies to every response:

- **Content Security Policy:**
  - No inline scripts or inline styles anywhere on the site.
  - Scripts allowed only from the site itself, `connect.facebook.net` and Cloudflare Insights.
  - No framing.
- **HSTS** (1 year, include subdomains; no preload yet).
- **X-Frame-Options: DENY**, **COOP: same-origin**, **nosniff**, a strict **Referrer-Policy**, and a **Permissions-Policy** that turns off camera, microphone, geolocation and similar features.
- **Caching:** fonts immutable for 1 year, CSS/JS 1 hour (fingerprinted), images 1 week (fingerprinted).
- **noindex** for `/shopify-theme`, `/policies/src` and `/tools`; `functions/docs/[[path]].js` keeps `/docs` off the public site entirely.
- **Consent first:** the Meta Pixel loads only after the visitor clicks Accept, and the choice can be changed from the footer.
- **Conversions API endpoint** (`/api/event`):
  - POST only, same-origin only, 4 KB body limit, event allowlist.
  - Does nothing (204) until the `META_CAPI_TOKEN` secret is set.

Recommended Cloudflare settings (in the README): SSL Full (strict), Always Use HTTPS, TLS 1.2 minimum, DNSSEC, a CAA record, SPF/DKIM/DMARC for the domain's email, Web Analytics on, Rocket Loader **off** (it breaks the CSP).

---

## 16. Meta Pixel and Conversions API

- Domain verification tag: `facebook-domain-verification` in `index.html`.
- **Pixel events:** PageView, ViewContent, InitiateCheckout (Purchase comes from Shopify's Meta channel).
- **Each event is fired twice, with one shared `event_id`:** once in the browser and once from Cloudflare to Meta's Conversions API (Graph API v23.0). Meta deduplicates them, and fewer events are lost to Safari and ad blockers.
- **To switch on server events:** add `META_CAPI_TOKEN` as a secret in the Cloudflare Pages project (Meta Events Manager, Settings, Conversions API, Generate access token).

---

## 17. Automatic checks (QA)

Runs on every push via `.github/workflows/checks.yml`:

1. **`python3 tools/stamp.py --check`:** every CSS, JS and photo fingerprint is current.
2. **`node tools/check.mjs`** (no dependencies):
   - **Links:** every link and file resolves. Missing `/images/` files only warn, per the owner's rule.
   - **Copy rules:** no en or em dashes, no `!` outside the banner.
   - **Search data:** the JSON-LD is valid.
   - **Images:** every image has alt text and width and height.
   - **CSP:** no inline styles or scripts.
   - **Settings and limits:** the checkout config format is valid, the JS and CSS budgets hold, and the security headers are present.
3. **`node tools/browser.mjs`:**
   - Real Chrome with the production CSP applied, at 360, 390, 768 and 1440 px, plus the refund policy and 404 pages.
   - Fails on horizontal scroll, script errors, console errors, failed requests or a missing Buy button.
   - Screenshots are saved with each run.
4. **Lighthouse CI:** the budgets in section 14.

During design work, every change was also checked visually:
- Puppeteer screenshots at phone and desktop sizes.
- Scroll-through captures, because lazy images and scroll animations don't appear in full-page screenshots.
- Playwright frame-by-frame captures of the scroll animations, used for the heart drawing.

**Optional gated deploy:**
- **Today:** Cloudflare deploys every push straight away, and CI only reports.
- **To make CI block bad deploys:**
  1. Turn off automatic production deployments in Cloudflare.
  2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets.
  3. Add `CF_PAGES_PROJECT` as a GitHub variable.

  From then on, the `deploy` job publishes with Wrangler only after every check passes.

---

## 18. Timeline of every change

| Commit | Date | What and why |
|---|---|---|
| `2b2c628` | Nov 1 | First build as Shopify Liquid sections (original brief). |
| `b03ad1f` | Nov 2 | Meta domain verification tag and Pixel snippet. |
| `380fd9c` | Nov 4 | **Own website.** Converted to a static site for Cloudflare Pages; Shopify only for checkout via cart permalink. Centered design the owner liked. |
| `3390492` | Nov 4 | **The makeover.** Covered in detail below the table. |
| `3b8ee66` | Nov 4 | Fingerprinted CSS/JS URLs; the live site had served the old cached `site.js` (Cloudflare edge caches 4 h). Added `stamp.py` and a CI check. |
| `0382c66` | Nov 5 | New "d" favicon. Sharper main photo from the owner. Desktop worn section uses the owner's wide photo at its natural ratio. Phone worn text moved below the photo (it covered the necklace because of a CSS order bug). |
| `ce4d0ab` | Nov 5 | AVIF quality 58 → 82 with 4:4:4 (fixes soft photos). **Premium announcement bar** (depth, champagne hairline, light sweep, serif italics, live holiday date, rotating messages on phones). **In the box** redesigned: one photo, numbered pins, linked hover, merged "Nothing to wrap". **Price removed from Buy buttons.** |
| `8cc881f` | Nov 5 | Main photo AVIF 74, 5 KB sticky thumbnail, LCP budget 3.5 s. |
| `1e7aece` | Nov 5 | **Human-voice copy rewrite** across the page; FAQ trimmed and rewritten; FAQ JSON-LD matched; **script words** on the card highlighted in italic champagne; statement band glow and line art. |
| `b083e64` | Nov 5 | **Photo URL fingerprints**; the old main photo was being served from cache. The zoom viewer keeps the fingerprint. |
| `dafd600` | Nov 5 | **Diagonal strike** on $99.99 so the 9s stay readable. |
| `0e8de9e` | Nov 5 | Pink heart line art (first version). In the box flipped (text left, photo right). Pin numbers centred. Founder letter and "Give her a minute" removed. Reviews section built. CSS budget 40 → 48 KB. |
| `80ea476` | Nov 5 | **Statement heart redrawn** from the classic heart curve, framing the text, timed to the section, verified frame by frame with Playwright. |
| `eb81698` | Nov 5 | **16 real customer reviews** from the client added to `assets/reviews.js`, word for word (14 five-star, 2 four-star, 4.9 average). The rating line above the price and the Reviews section now show. No "Verified buyer" badge, at the owner's request. |
| (this commit) | Nov 7 | **Phone pass**: Buy button right after the price, header tucks on scroll, one Buy button at a time, swipeable reviews with progress line, scroll-driven stand-ins for hover effects, tighter spacing, touch feedback. See section 9, Phones. |

**The makeover (`3390492`):**
- **Photos and facts:**
  - The real supplier photos replaced the placeholders.
  - The real card text replaced the invented wording, and the real specs replaced the wrong ones.
  - Unverified metal and tarnish claims were removed.
- **New design:**
  - The "Read what she'll read" scene.
  - CSS scroll effects throughout.
  - The full-screen image viewer and the warmer palette.
  - "Save 50%" in place of "Save $50".
- **Delivery dates:** live delivery dates, plus the holiday cutoff (holiday date minus 21 days, shown within 45 days of it).
- **Security and tracking:** the security headers, consent-gated Pixel and CAPI function.
- **Search and sharing:** a real share image (`og.jpg`), robots.txt and the sitemap.
- **Automatic checks:** CI with static checks, browser tests and Lighthouse.
- **Result:** Lighthouse 95 / 100 / 100 / 100.

---

## 19. Problems hit and how they were fixed

| Problem | Cause | Fix |
|---|---|---|
| Live site showed new HTML with an old script | Cloudflare edge caches JS/CSS for 4 h | Content-hash `?v=` fingerprints, checked in CI |
| Main photo soft on desktop | AVIF quality 58 | Quality 82, full colour detail |
| Main photo "still blurry" | Old photo cached under the same filename (7-day image cache) | Per-photo fingerprints in every URL |
| Worn section blurry on desktop | Square photo cropped and zoomed into a wide frame | Owner's dedicated wide photo, art-directed `<picture>`, no zoom |
| Phone worn text covered the necklace | The phone rule was overridden by a base rule later in the CSS | Restructured the cascade; text sits below the photo on phones |
| $99.99 unreadable | Line-through sits exactly through the middle of the digits | Thin diagonal burgundy strike |
| Pin numbers off-centre | Italic serif digits have uneven side bearings | Upright sans tabular numerals |
| Heart line art "random and strange" (v1) | Infinity and heart lines started late and read as stray strokes | Replaced with a heart only |
| Heart "so wrong" (v2) | Squat, blobby shape drawn behind the headline and only half-finished while reading | Classic parametric heart, sized to frame the text, timed to the **section's** scroll position (an SVG path can't be a view-timeline subject, so a named `view-timeline` is set on the section) |
| LCP over budget after raising photo quality | Bigger image bytes on simulated slow 4G | Main photo AVIF 74, tiny sticky thumbnail, budget 3.5 s |
| CSS over the 40 KB budget | New sections | Removed dead CSS; budget 48 KB (about 9 KB compressed) |
| Contrast failures in the card reading section | Dimmed starting state of the lighting effect | Start at 56% opacity; first and last lines handled separately |
| GitHub push "Internal Server Error" | GitHub-side hiccup | Retried |
| Windows CRLF vs CI LF changed fingerprints | Line endings | `.gitattributes` forces LF; `stamp.py` hashes with CRs stripped |

---

## 20. How to do common jobs

**Turn on checkout:**
1. In Shopify admin, open the necklace product. The address ends in `/products/1234567890`. Add `.json` to the end and open it.
2. Find `"variants"`. The first `"id"` after it is the variant ID.
3. Put it and the `something.myshopify.com` address in `assets/config.js`.
4. Run `python tools/stamp.py`, then commit and push.

**Change copy:** edit `index.html`. Keep the rules: no dashes, no `!` outside the banner, talk like a person.

**Swap or add a photo:**
1. Put the source photo in the source folder and map it at the top of `tools/images.py`.
2. Run `python tools/images.py <folder> <name>`.
3. Run `python tools/stamp.py`, then commit and push.

**After any CSS, JS or photo change:** run `python tools/stamp.py`. CI fails if you forget.

**Edit policies:** edit `policies/src/*.md`, then run `python policies/build.py`.

**Run the checks locally:** `cd tools && npm install && node check.mjs && node browser.mjs` (set `CHROME_PATH` on Windows).

---

## 21. Still open

- **Checkout:** waiting on the Shopify variant ID and the shop's `.myshopify.com` address.
- **www.givedearly.com:** still shows the old Squarespace page. Add `www` as a custom domain in the Cloudflare Pages project.
- **Base metal:** confirm with the supplier. If it is stainless steel or 925 silver, add the "won't tarnish" selling point back.
- **Legal placeholders:** `[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]`, `[JURISDICTION]` and `[DATE]` in `policies/src/*.md`, then rebuild the policy pages.
- **Optional:** `META_CAPI_TOKEN` in Cloudflare; gated deploys; DNSSEC, CAA and SPF/DKIM/DMARC; a 3000 px version of the wide worn photo for big high-resolution screens.
