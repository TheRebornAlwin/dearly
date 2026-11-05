// Static checks for the Dearly site. No dependencies. Run: node tools/check.mjs
// Fails (exit 1) on errors. Missing files under /images/ are warnings only, so photos
// that haven't been added yet never block a deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["shopify-theme", "node_modules", ".git", ".github", "tools", "functions"]);
const errors = [], warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

// Map a site URL path to the file Cloudflare Pages would serve.
function resolveLocal(urlPath) {
  let p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (p.endsWith("/")) p += "index.html";
  const abs = path.join(ROOT, p);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  if (fs.existsSync(abs + ".html")) return abs + ".html";
  return null;
}

const pages = walk(ROOT);
for (const file of pages) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

  // 1. Every local reference resolves.
  const refs = [];
  for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) for (const part of m[1].split(",")) refs.push(part.trim().split(/\s+/)[0]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    if (ref.startsWith("#")) { if (ref.length > 1 && !ids.has(ref.slice(1))) err(rel, `anchor ${ref} has no matching id`); continue; }
    const urlPath = ref.startsWith("/") ? ref : "/" + path.posix.join(path.posix.dirname(rel), ref);
    if (!resolveLocal(urlPath)) (urlPath.startsWith("/images/") ? warn : err)(rel, `missing file ${ref}`);
  }

  // 2. Copy rules: no en or em dashes; exclamation marks only in the announcement bar.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!doctype[^>]*>/i, "");
  if (/[–—]/.test(text)) err(rel, "contains an en or em dash");
  const visible = text.replace(/<div class="announce"[\s\S]*?<\/div>/, "").replace(/<[^>]+>/g, " ");
  if (visible.includes("!")) err(rel, "exclamation mark outside the announcement bar");

  // 3. Structured data is valid JSON and carries no invented ratings.
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); if (JSON.stringify(j).includes("aggregateRating")) err(rel, "aggregateRating in JSON-LD (no fake reviews)"); }
    catch (e) { err(rel, "invalid JSON-LD: " + e.message); }
  }

  // 4. Basics every page needs.
  if (!/<title>[^<]+<\/title>/.test(html)) err(rel, "no <title>");
  if (!/name="viewport"/.test(html)) err(rel, "no viewport meta");
  if (!/<html lang="/.test(html)) err(rel, "no lang attribute");
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) err(rel, "img without alt: " + m[0].slice(0, 80));
    if (!/\swidth="/.test(m[0]) || !/\sheight="/.test(m[0])) { if (!/data-zoom-img/.test(m[0])) err(rel, "img without width/height (layout shift): " + m[0].slice(0, 80)); }
  }
  if (/\sstyle="/.test(html)) err(rel, "inline style attribute (blocked by the Content Security Policy)");
  if (/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(html)) err(rel, "inline <script> (blocked by the Content Security Policy)");
}

// 5. Checkout settings are well-formed when filled in.
const cfgSrc = fs.readFileSync(path.join(ROOT, "assets/config.js"), "utf8");
const shop = (cfgSrc.match(/shopDomain:\s*"([^"]*)"/) || [])[1];
const variant = (cfgSrc.match(/variantId:\s*"([^"]*)"/) || [])[1];
if (shop === undefined || variant === undefined) err("assets/config.js", "shopDomain or variantId missing");
if (shop && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(shop.replace(/^https?:\/\//, ""))) err("assets/config.js", `shopDomain "${shop}" is not a domain`);
if (variant && !/^\d+$/.test(variant)) err("assets/config.js", `variantId "${variant}" must be digits only`);
if (!shop || !variant) warn("assets/config.js", "checkout not connected yet (shopDomain/variantId empty)");

// 6. Budgets.
const jsBytes = ["assets/site.js", "assets/config.js"].reduce((n, f) => n + fs.statSync(path.join(ROOT, f)).size, 0);
if (jsBytes > 16 * 1024) err("assets", `JavaScript is ${jsBytes} bytes, budget is 16384`);
const cssBytes = fs.statSync(path.join(ROOT, "assets/site.css")).size;
if (cssBytes > 48 * 1024) err("assets", `CSS is ${cssBytes} bytes, budget is 49152`);

// 7. Security headers are present.
const headers = fs.readFileSync(path.join(ROOT, "_headers"), "utf8");
for (const h of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Cross-Origin-Opener-Policy"]) {
  if (!headers.includes(h + ":")) err("_headers", `missing ${h}`);
}

for (const w of warnings) console.log("warn  " + w);
for (const e of errors) console.log("ERROR " + e);
console.log(`\n${pages.length} pages checked, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
