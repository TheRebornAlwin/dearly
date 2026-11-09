// Loads the site in real Chrome at four screen sizes, with the production security headers applied.
// Fails on: horizontal scroll, script errors, console errors (including CSP violations), failed
// requests (except /images/, which only warn), or a missing Buy button. Saves screenshots to tools/out/.
// Run: CHROME_PATH=/path/to/chrome node tools/browser.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "tools", "out");
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".avif": "image/avif", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };

// Global headers from _headers (the "/*" block), so CSP problems show up here before production.
const globalHeaders = {};
{
  const lines = fs.readFileSync(path.join(ROOT, "_headers"), "utf8").split(/\r?\n/);
  let inGlobal = false;
  for (const l of lines) {
    if (/^\S/.test(l)) inGlobal = l.trim() === "/*";
    else if (inGlobal && l.trim()) { const i = l.indexOf(":"); globalHeaders[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
  }
  delete globalHeaders["Strict-Transport-Security"];
  if (globalHeaders["Content-Security-Policy"]) globalHeaders["Content-Security-Policy"] = globalHeaders["Content-Security-Policy"].replace("; upgrade-insecure-requests", "");
}

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.startsWith("/api/")) { res.writeHead(204); return res.end(); }
  if (p.endsWith("/")) p += "index.html";
  let f = path.join(ROOT, p);
  if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, globalHeaders); return res.end("not found"); }
  res.writeHead(200, { ...globalHeaders, "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const errors = [], warnings = [];
const pagesToTest = ["/", "/girlfriend-giftbox", "/policies/refund-policy", "/404.html"];
for (const url of pagesToTest) {
  for (const [w, h] of (url === "/" ? [[360, 640], [390, 844], [768, 1024], [1440, 900]] : [[390, 844]])) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    const tag = `${url} @${w}`;
    page.on("pageerror", e => errors.push(`${tag}: script error ${e.message}`));
    page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(`${tag}: console error ${m.text()}`); });
    page.on("requestfailed", r => { const u = r.url(); if (u.startsWith(base)) errors.push(`${tag}: request failed ${u}`); });
    page.on("response", r => { const u = r.url(); if (u.startsWith(base) && r.status() >= 400) (u.includes("/images/") ? warnings : errors).push(`${tag}: ${r.status()} ${u.replace(base, "")}`); });
    await page.goto(base + url, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => ({
      hscroll: document.documentElement.scrollWidth > window.innerWidth + 1,
      buy: !!document.querySelector("[data-buy-main]") || !document.querySelector("#buy"),
    }));
    if (r.hscroll) errors.push(`${tag}: horizontal scroll`);
    if (!r.buy) errors.push(`${tag}: Buy button missing`);
    const name = (url === "/" ? "home" : url.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")) + `-${w}.png`;
    await page.screenshot({ path: path.join(OUT, name), fullPage: url === "/" && w !== 360 });
    await page.close();
  }
}
await browser.close();
server.close();
for (const w of [...new Set(warnings)]) console.log("warn  " + w);
for (const e of [...new Set(errors)]) console.log("ERROR " + e);
console.log(`\nbrowser checks: ${errors.length} errors, ${warnings.length} warnings, screenshots in tools/out/`);
process.exit(errors.length ? 1 : 0);
