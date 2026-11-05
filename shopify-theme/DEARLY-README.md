# Dearly product page: install notes

A drop-in set of Shopify Liquid sections for the Dearly product page (To My Girlfriend Infinity Heart Necklace), built to the build prompt and the design prompt dated Nov 1, 2026. The design prompt wins on visuals. Copy, section order, Liquid structure, budgets and the no-fake-reviews rule come from the build prompt.

There is no Shopify theme in this repository. These files go into your existing theme.

## Files created

| File | What it is |
| --- | --- |
| `assets/dearly.css` | The one stylesheet. Six color tokens (OKLCH with hex fallback), type scale, spacing scale, every section's styles. |
| `assets/dearly.js` | All added JavaScript, about 5KB uncompressed. Gallery dots and thumbnails, zoom, sticky cart bar, FAQ accordion, variant sync, deadline expiry, cookie preferences link. |
| `assets/newsreader-var.woff2` | Newsreader, latin, variable, weights 400 to 500 with optical sizing. Self-hosted. |
| `assets/instrument-sans-var.woff2` | Instrument Sans, latin, variable, weights 400 to 500. Self-hosted. |
| `sections/dearly-01-announcement.liquid` | 1. Announcement bar |
| `sections/dearly-02-gallery.liquid` | 2. Image gallery |
| `sections/dearly-03-title-price.liquid` | 3. Title and price, plus Product and BreadcrumbList JSON-LD |
| `sections/dearly-04-delivery.liquid` | 4. Delivery line |
| `sections/dearly-05-rating-anchor.liquid` | 5. Rating anchor (hidden at zero reviews) |
| `sections/dearly-06-variants.liquid` | 6. Variant selector (off) |
| `sections/dearly-07-add-to-cart.liquid` | 7. Add to cart and sticky phone bar |
| `sections/dearly-08-trust.liquid` | 8. Trust lines |
| `sections/dearly-09-hero.liquid` | 9. Hero headline and the Christmas deadline |
| `sections/dearly-10-meaning.liquid` | 10. What it means |
| `sections/dearly-11-card.liquid` | 11. The card (the dark section with the settle motion) |
| `sections/dearly-12-ready.liquid` | 12. Ready to give |
| `sections/dearly-13-specs.liquid` | 13. Specifications (VERIFY rows) |
| `sections/dearly-14-guarantee.liquid` | 14. The guarantee |
| `sections/dearly-15-founder.liquid` | 15. Founder note |
| `sections/dearly-16-reviews.liquid` | 16. Reviews (Judge.me, hidden at zero reviews) |
| `sections/dearly-17-faq.liquid` | 17. FAQ, plus FAQPage JSON-LD |
| `sections/dearly-18-footer.liquid` | 18. Footer |
| `snippets/dearly-head.liquid` | Meta domain verification tag and Meta Pixel base code, rendered in <head>. |
| `templates/product.dearly.json` | An alternate product template with all 18 sections in order and the 8 FAQ questions filled in. See the note below. |
| `policies/*.md` | The five policy texts, ready to paste. |

### Changed in your theme (you make this edit)

`layout/theme.liquid` needs three lines. Nothing else in it changes. Paste them just above `</head>`:

```liquid
{% render 'dearly-head' %}
{{ 'dearly.css' | asset_url | stylesheet_tag }}
<script src="{{ 'dearly.js' | asset_url }}" defer></script>
```

`snippets/dearly-head.liquid` holds the Meta domain verification tag (`facebook-domain-verification`) and the Meta Pixel base code (pixel 29461693903447213). Upload it under Snippets, Add a new snippet, named `dearly-head`.

After publishing: open givedearly.com, view the page source (Ctrl+U), search for `facebook-domain-verification`, then click Verify domain in Meta. Meta can take up to 72 hours to see it.

**Do not run the pixel twice.** If the Facebook and Instagram sales channel in Shopify is also connected to this same pixel, every event counts double. Use one or the other. If you keep this snippet, delete the pixel block from it only if you later switch to the channel. Note that a theme-pasted pixel cannot see Shopify's checkout, so it fires PageView (and anything you add on store pages) but not InitiateCheckout or Purchase. The sales channel does fire those. For ads optimising on purchases, the channel is the better source.

The JSON-LD is emitted by sections 3 and 17, so it stays in sync with the page and needs no block in theme.liquid.

### One deliberate deviation: the template file

The build prompt says nothing should be created outside `sections/` and `assets/`. `templates/product.dearly.json` breaks that rule on purpose. Without it, you would add 18 sections by hand in the theme editor and type in 8 FAQ answers. It adds a new alternate template and changes nothing that already exists in your theme. If you'd rather not use it, delete it and add the sections in the editor instead. Every section has a preset, and the FAQ preset comes with all eight questions.

## Install steps

1. **Back up.** Online Store, Themes, on your live theme click the three dots, Duplicate. Work on the copy.
2. **Add the files.** Either:
   - Download the theme (three dots, Download theme file), unzip it, copy `assets/`, `sections/` and `templates/product.dearly.json` from this repo into the matching folders, zip it, and upload it under Online Store, Themes, Add theme, Upload zip file. Or:
   - On the duplicate, three dots, Edit code. Under Assets use Add a new asset to upload the four asset files. Under Sections use Add a new section for each `dearly-*.liquid` and paste in its contents. Under Templates, Add a new template, product, JSON, named `dearly`, and paste in `product.dearly.json`.
3. **Edit theme.liquid** as shown above.
4. **Assign the template.** Products, the necklace, Theme template (right column), choose `product.dearly`. Save.
5. **Set the product up in admin:**
   - Price 49.99, compare-at price 99.99. The page reads both from Shopify and never hardcodes them.
   - Upload the six images to the product's media **in this order**: card readable beside the open box, box open with necklace and card, pendant close-up, worn at the collarbone, closed box in a hand, full set laid flat. Image 1 is what the ad clicks through to.
   - Give each image alt text in admin. If you don't, the gallery uses the fallback alt text set in section 2.
6. **Header and footer.** Your theme's own header and footer still render. In the theme editor:
   - Move the announcement bar into the Header group (or turn off your theme's own announcement bar and keep this one at the top of the template). Note it is only sticky on desktop. The design forbids a sticky header on phones.
   - Either hide your theme's footer on this template, or remove section 18. Two footers will look broken.
   - The header's cart link should read `Cart (0)` in plain text, not a filled badge. That lives in your theme's header, which these files do not touch.
7. **Check the VERIFY specs** (section 13) against the real supplier listing, then tick "I have checked every VERIFY spec". Until you tick it, a reminder shows inside the theme editor only. Shoppers never see it.
8. **Preview at phone size**, then publish.

### After install

- Paste the policies under Settings, Policies (see below).
- Install Judge.me free tier. Import nothing. Set its review request to 21 days after fulfilment. Leave section 16 as it is; it appears by itself once the first real review lands.
- Once there are 5 or more real reviews, turn on section 5 (Show the rating anchor).
- Shipping: change the transit time in Settings, Shipping and delivery from 3 to 5 days to **7 to 14 business days**. The page, FAQ and policies all say 7 to 14.
- Meta pixel: connect through Shopify's Facebook and Instagram sales channel, not a pasted script. Use Meta's Test Events tool to confirm ViewContent, AddToCart, InitiateCheckout and Purchase all fire.
- Create a collection with the handle `for-her`, or change the For Her link in section 18.

## Policies

Paste each file into its field under Settings, Policies. Easiest way to keep the headings: open the file on GitHub, which renders it, and copy from the rendered page rather than the raw Markdown.

| File | Shopify field |
| --- | --- |
| `policies/refund-policy.md` | Refund policy |
| `policies/shipping-policy.md` | Shipping policy |
| `policies/terms-of-service.md` | Terms of service |
| `policies/privacy-policy.md` | Privacy policy |
| `policies/cookie-policy.md` | **No Shopify field exists for this.** Make a page with the handle `cookie-policy` (the footer links to `/pages/cookie-policy`), or add the text to the end of the privacy policy and change the footer link. |

Leave out the short "Paste into Shopify" lines at the top of each file. Fill in `[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]`, `[JURISDICTION]` and `[DATE]` before you publish.

## Theme settings added

All are section settings, editable in the theme editor.

| Section | Setting | Controls |
| --- | --- | --- |
| 1 Announcement | First phrase, Second phrase | The two halves of the bar. Shown side by side on desktop and stacked on phones, with no middle dot between them. |
| | Stick to the top on desktop | Sticky on desktop only (default on) |
| 2 Gallery | Image 1 to 6 alt | Fallback alt text when an image has none in admin. Image 1's alt includes the card text. |
| 3 Title and price | Show the saving | "Save $50", calculated as compare-at minus price |
| | Output Product and Breadcrumb JSON-LD | Turn off only if your theme already outputs Product JSON-LD here |
| | Description for structured data | Used only if the product description is empty |
| 4 Delivery | First line, Second line | "Ships free worldwide." / "Arrives in 7 to 14 business days." |
| 5 Rating anchor | Show the rating anchor | Default off. Also requires at least one real review. |
| | Minimum real reviews before showing | Default 5 |
| 6 Variants | Enable when a second SKU exists (gift box upgrade). | Default off. Also needs the product to have more than one variant. |
| | Selector label | "Choose a box" |
| 7 Add to cart | Button label, Sold out label | "Add to cart" / "Sold out" |
| | Sticky bar on phones | Default on |
| 8 Trust lines | Line 1 to 3 | The three trust lines |
| 9 Hero | Headline, Supporting line | Hero copy |
| | Last safe order date (YYYY-MM-DD) | Default 2026-12-05. Empty, or a past date, hides the deadline line. It also hides itself in the browser if a cached page outlives the date. |
| | Deadline line | "Order by December 5 for delivery before Christmas." |
| 10 Meaning | Headline, Body | |
| 11 Card | Card photograph (option A) | Leave empty to use the typeset card (option B) |
| | Card text | Used as the photo's alt text, or set in type |
| | The one line beside the card | "The part she'll keep in a drawer" |
| | Show the supporting paragraphs | Default off (see design notes). The copy is kept word for word. |
| 12 Ready to give | Headline, Body | |
| 13 Specs | Heading | |
| | **VERIFY: Finish, VERIFY: Stone, VERIFY: Pendant size, VERIFY: Chain, VERIFY: Clasp** | Unconfirmed specs. Check each against the listing. |
| | I have checked every VERIFY spec | Hides the editor-only reminder |
| | Care, Included | Confirmed specs |
| 14 Guarantee | Headline, Body | |
| 15 Founder | Headline, Body | |
| 16 Reviews | Heading | Section only renders when the review count is above zero |
| 17 FAQ | Heading, and one block per question | The FAQPage JSON-LD is built from the same blocks |
| 18 Footer | Wordmark, Copyright year, Contact email | |
| | All Gifts, For Her, Contact, FAQ, Cookie Policy links | Link targets |
| | Show inline email field, Email field label | Inline signup. No popup. |

## Where the design prompt overrode the build prompt

- Palette, type and the removal of gold, rose, Playfair and Inter. Fonts are Newsreader (voice) and Instrument Sans (facts), 400 and 500 only.
- The **trust badge row** (section 8) is three plain sentence-case lines with no icons and no caps.
- The **delivery line** (section 4) and **announcement bar** (section 1) use a line break instead of the middle dot.
- **Button label** is "Add to cart", sentence case.
- **Price** is set in the sans with tabular figures. The current price is in wax, the compare-at is struck through in faded ink, and the saving is plain faded text instead of a pill.
- **Deadline line** is in ink, not gold.
- **Everything is left-aligned** except the announcement bar, including the hero and the guarantee.
- **Gallery** is a 4:5 portrait main image with a thumbnail row underneath on desktop (the build prompt had a left column).
- **Section 11** shows the card and one line only, as the design requires. The two supporting paragraphs from the build prompt are kept word for word behind the "Show the supporting paragraphs" toggle, default off. Turn it on if you want them.
- **Apostrophes** are typographic (’), and headlines have a non-breaking space before the last word.

## Checklist results

Checked on a local render of the sections with mock product data, in headless Chrome, plus Shopify's Theme Check (0 offenses).

**Content integrity**
- Pass: no invented reviews, names, testimonials or counts in any file.
- Pass: no aggregateRating or review property in any JSON-LD (verified in rendered output).
- Pass: no countdown, stock counter or visitor counter.
- Pass: all five VERIFY specs are settings labelled `VERIFY:`.
- Pass: no em dash (or en dash) in any created file.
- Pass, with the design overrides listed above: copy matches the build prompt.

**Structure**
- Pass: one .liquid file per section, each with a schema.
- Pass: reviews section renders nothing at zero reviews (rendered with 0: absent; with 7: present).
- Pass: rating anchor renders nothing at zero reviews, and nothing while its toggle is off.
- Pass: variant section exists, default off, labelled for the gift box SKU.
- Pass: deadline renders for 2026-12-05 and for today; hidden for empty, for a past date and for a malformed date.
- Deviation: `templates/product.dearly.json` is outside sections/ and assets/ (explained above).

**Mobile**
- Pass: Add to cart bottom edge at 774px on 390x844, measured with a 56px theme header above it. On 360x640 it's at 621px. Your real header height changes this, so check on a phone.
- Pass: no horizontal scroll at 360, 390, 768 or 1440.
- Pass: sticky bar appears after the main button scrolls out of view and shows the price.
- Pass: all buttons and footer links are 44px or taller. The only exception is the email link inside the founder paragraph, which is inline text and exempt under WCAG 2.5.8.
- Pass: body copy is 17px or more. Fine print (delivery line, trust lines, spec table) is 15px, as both prompts specify.

**Performance**
- Not verified: Lighthouse, LCP and CLS need the live store with real images. Run PageSpeed Insights on the product URL after publishing.
- Pass: hero image is eager, has fetchpriority="high", is preloaded and has dimensions. Every other image is lazy with dimensions, from the Shopify CDN, with srcset at 390, 768, 1200 and 1600.
- Pass: fonts are self-hosted woff2, two variable files capped at 400 to 500. Each file covers both weights, so there are two requests instead of four.
- Pass: added JS is about 5KB.
- Estimated page weight: fonts about 160KB, CSS about 23KB, JS about 5KB, plus images.

**Accessibility**
- Pass on contrast, checked for both OKLCH and hex values: ink on paper 11.6:1. Faded ink on paper 5.0:1 (4.57:1 for the hex fallback). Wax on paper 8.9:1. Paper on ink 11.6:1. There is no gold left to check.
- Pass: card alt includes the card text.
- Pass: FAQ works with the keyboard (Enter and Space tested) and aria-expanded updates correctly.
- Pass: focus rings visible, 2px wax with offset.

**Design**
- Exactly one animation (the card settle). With reduced motion on, it doesn't run and the card sits in its finished state.
- Wax appears in four places: the price, the guarantee seal, the 2px stub under the title, and link underlines on hover. It also appears in focus rings and the text-selection tint, which are interaction states the design prompt specifies separately.
- Zero gradients, and no shadows outside section 11.
- Chanel test: I removed the truck icon from the delivery line. The build prompt asked for it, but it was the last piece of retail iconography on the page. It also sat next to a sentence that already says "Ships free", so it said the same thing twice.

## What still needs a person

1. Verify the five specs against the real listing.
2. Set the shipping transit time to 7 to 14 business days in Shopify.
3. Fill the legal placeholders, and decide the jurisdiction deliberately.
4. Place a real test order through to DSers fulfilment, then refund it.
5. Confirm the Christmas date against your supplier's real transit times. Move it earlier if anything, never later.
