# Dearly

The givedearly.com website. Plain HTML, CSS and JS on Cloudflare Pages, no build step.
Shopify is used only for checkout: Buy sends the shopper straight to Shopify checkout.

## Files

| Path | What it is |
|---|---|
| `index.html` | The product page (the home page) |
| `assets/site.css`, `assets/site.js` | All styles and scripts. Scroll effects are CSS scroll-driven animations |
| `assets/config.js` | **Checkout settings. The one file to edit to turn checkout on** |
| `assets/fonts/` | Newsreader and Instrument Sans, self-hosted |
| `images/` | AVIF + JPG in 4 sizes, built by `tools/images.py` |
| `policies/*.html` | Policy pages, built from `policies/src/*.md` with `python policies/build.py` |
| `functions/api/event.js` | Server-side copy of Meta Pixel events (Conversions API) |
| `_headers` | Security headers (CSP, HSTS, COOP) and caching |
| `robots.txt`, `sitemap.xml`, `404.html`, `favicon.svg`, `apple-touch-icon.png` | The usual |
| `tools/` | Checks and the image pipeline. Not deployed |
| `shopify-theme/` | The earlier Shopify theme version. Not used |

## Turning on checkout

1. In Shopify admin, open the necklace. The address bar ends in `/products/1234567890`. Add `.json` to the end and press Enter.
   Search for `"variants"`; the first `"id"` after it is the variant ID.
2. Put the variant ID and your `something.myshopify.com` address in `assets/config.js`.

Buy then opens `https://<shop>.myshopify.com/cart/<variantId>:1`. Do not connect givedearly.com itself to Shopify.

## Photos

Source photos are the AliExpress supplier set. To rebuild or swap: `python tools/images.py <folder>`, with the mapping at the top of that script.

## After editing CSS, JS or photos

Run `python tools/stamp.py` after changing CSS, JS or any photo. It updates the `?v=` fingerprints on asset and photo URLs so visitors never get a stale cached file. CI fails if you forget.

## Automatic checks

`.github/workflows/checks.yml` runs on every push:
1. `tools/check.mjs`: every link and file resolves, copy rules (no en/em dashes, no `!` outside the announcement bar),
   valid JSON-LD with no ratings, image dimensions, no inline styles or scripts (CSP), checkout config format, JS/CSS budgets, security headers.
   Missing files under `/images/` are warnings, never failures.
2. `tools/browser.mjs`: real Chrome at 360, 390, 768 and 1440 wide with the production CSP applied. Fails on horizontal scroll,
   script or console errors, failed requests, or a missing Buy button. Screenshots are saved as a download on the run.
3. Lighthouse: performance 85+, accessibility 95+, best practices 90+, SEO 95+, LCP under 3.5s on simulated slow 4G (raised from 3s to keep photos at full sharpness), CLS under 0.05.

Run locally: `cd tools && npm install && node check.mjs && node browser.mjs`.

**Making checks block bad deploys** (recommended): in Cloudflare, Pages project, Settings, Builds, turn off automatic production deployments.
In GitHub, Settings, Secrets and variables, Actions: add secrets `CLOUDFLARE_API_TOKEN` (Pages Edit permission) and `CLOUDFLARE_ACCOUNT_ID`,
and a variable `CF_PAGES_PROJECT` with the Pages project name. From then on, a change only goes live after every check passes.

## Meta

- Domain verification tag is in the `<head>` of `index.html`.
- The Pixel loads after a visitor accepts cookies. Events: PageView, ViewContent, InitiateCheckout. Purchase comes from Shopify's Meta channel.
- Server-side events: add `META_CAPI_TOKEN` as a secret in Cloudflare (Pages project, Settings, Variables and Secrets).
  Get it from Meta Events Manager, the pixel, Settings, Conversions API, Generate access token. Until then the endpoint does nothing.

## Cloudflare settings worth turning on

- Web Analytics (Pages project, Metrics): cookieless visitor stats and real-user Core Web Vitals. The CSP already allows it.
- SSL/TLS: Full (strict), Always Use HTTPS, minimum TLS 1.2.
- DNS: enable DNSSEC. Add a CAA record so only Cloudflare's certificate authorities can issue for the domain.
- Email: SPF, DKIM and DMARC records for hello@givedearly.com, so nobody can send mail pretending to be you.
- Keep Rocket Loader off: it breaks the Content Security Policy.

## Still to fill in

- `[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]`, `[JURISDICTION]` and `[DATE]` in `policies/src/*.md`, then `python policies/build.py`.
- Confirm the necklace's base metal with the supplier. The page makes no metal or tarnish claims until then.
