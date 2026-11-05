# Dearly

The givedearly.com website. Plain HTML, CSS and JS, hosted on Cloudflare Pages. No build step.
Shopify is used only for checkout: the Buy button sends the shopper straight to Shopify checkout.

## Files

| Path | What it is |
|---|---|
| `index.html` | The product page (the home page) |
| `assets/site.css`, `assets/site.js` | All styles and scripts |
| `assets/config.js` | **Checkout settings. The one file to edit to turn checkout on.** |
| `assets/fonts/` | Newsreader and Instrument Sans, self-hosted |
| `images/product-1.svg` to `product-6.svg` | Placeholder drawings. Replace with real photos (see below) |
| `policies/*.html` | Policy pages, built from `policies/src/*.md` with `python policies/build.py` |
| `404.html`, `_headers`, `favicon.svg` | Not-found page, Cloudflare headers, tab icon |
| `shopify-theme/` | The earlier Shopify theme version. Not used by the site |

## Cloudflare Pages settings

- Framework preset: None
- Build command: (empty)
- Build output directory: `/`
- Custom domains: add both `givedearly.com` and `www.givedearly.com` under the Pages project, Custom domains.
  `www` currently points at a Squarespace "Coming Soon" page; remove that DNS record so Pages can take it.

## Turning on checkout

1. In Shopify admin, note the store's `something.myshopify.com` address (Settings, Domains).
2. Get the necklace's variant ID: open the product in Shopify admin, click the variant, and copy the number at the end of the URL.
3. Put both into `assets/config.js`.

The Buy button then goes to `https://<shop>.myshopify.com/cart/<variantId>:1`, which opens Shopify checkout with one necklace.
Do **not** connect givedearly.com itself to Shopify, or it will stop pointing at this site. If you want checkout on your own domain, connect a subdomain such as `shop.givedearly.com` to Shopify and use that as `shopDomain`.

Until both values are filled in, Buy shows a short note asking people to email hello@givedearly.com.

## Replacing the placeholder images

Put the real photos in `images/` (JPG or WebP, 1600 x 2000, portrait 4:5) and update the `src` attributes in `index.html`.
Order: 1 card readable beside open box, 2 box open with necklace and card, 3 pendant close-up, 4 worn at collarbone, 5 closed box in hand, 6 full set flat.
Also update the `og:image` and JSON-LD `image` in the head to photo 1.

## Meta

- Domain verification tag is in the `<head>` of `index.html`.
- The Meta Pixel (29461693903447213) loads only after a visitor accepts cookies in the banner, which matches the cookie policy. It sends PageView, ViewContent, and InitiateCheckout when Buy is clicked. Purchase events come from Shopify checkout: connect the same pixel in Shopify's Facebook and Instagram channel.

## Still to fill in

- `[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]`, `[JURISDICTION]` and `[DATE]` in `policies/src/*.md`, then run `python policies/build.py`.
- The Order-by deadline (`data-deadline` in `index.html`) hides itself after the date passes.
