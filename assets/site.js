/* Dearly. Vanilla, no dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.add("js");
  var cfg = window.DEARLY_CONFIG || {};
  var PIXEL_ID = "29461693903447213";
  var CONSENT_KEY = "dearly-consent";

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- Meta Pixel, loaded only after the visitor accepts cookies ---------- */
  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: 'To My Girlfriend Infinity Heart Necklace', content_type: 'product', value: cfg.price || 49.99, currency: cfg.currency || 'USD' });
  }
  function track(ev, data) { if (window.fbq && pixelLoaded) window.fbq('track', ev, data); }

  var banner = doc.querySelector("[data-consent]");
  function setConsent(v) { store(CONSENT_KEY, v); if (banner) banner.hidden = true; if (v === "yes") loadPixel(); }
  var saved = store(CONSENT_KEY);
  if (saved === "yes") loadPixel();
  else if (saved !== "no" && banner) banner.hidden = false;
  doc.addEventListener("click", function (e) {
    var c = e.target.closest("[data-consent-choice]");
    if (c) { setConsent(c.getAttribute("data-consent-choice")); return; }
    if (e.target.closest("[data-consent-open]") && banner) banner.hidden = false;
  });

  /* ---------- Buy: straight to Shopify checkout ---------- */
  var checkoutUrl = "";
  if (cfg.shopDomain && cfg.variantId) {
    var host = String(cfg.shopDomain).replace(/^https?:\/\//, "").replace(/\/+$/, "");
    checkoutUrl = "https://" + host + "/cart/" + encodeURIComponent(cfg.variantId) + ":1";
  }
  var msg = doc.querySelector("[data-buy-msg]");
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-buy]");
    if (!b) return;
    e.preventDefault();
    if (checkoutUrl) {
      track("InitiateCheckout", { value: cfg.price || 49.99, currency: cfg.currency || "USD", num_items: 1 });
      setTimeout(function () { window.location.href = checkoutUrl; }, pixelLoaded ? 150 : 0);
      return;
    }
    if (msg) msg.hidden = false;
    var buy = doc.getElementById("buy");
    if (buy && !b.hasAttribute("data-buy-main")) buy.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Gallery dots (mobile swipe) ---------- */
  var gal = doc.querySelector("[data-gallery]");
  if (gal && "IntersectionObserver" in window) {
    var track_ = gal.querySelector(".gallery__track");
    var slides = [].slice.call(gal.querySelectorAll(".gallery__slide"));
    var dotsWrap = gal.querySelector(".gallery__dots");
    var dots = slides.map(function (s, i) {
      var d = doc.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Show image " + (i + 1));
      d.setAttribute("aria-current", i === 0 ? "true" : "false");
      d.addEventListener("click", function () { track_.scrollTo({ left: s.offsetLeft - track_.offsetLeft, behavior: "smooth" }); });
      dotsWrap.appendChild(d);
      return d;
    });
    dotsWrap.removeAttribute("aria-hidden");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio > 0.6) {
          var i = slides.indexOf(en.target);
          dots.forEach(function (d, j) { d.setAttribute("aria-current", i === j ? "true" : "false"); });
        }
      });
    }, { root: track_, threshold: [0.6] });
    slides.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Sticky buy bar ---------- */
  var main = doc.querySelector("[data-buy-main]"), bar = doc.querySelector("[data-sticky]");
  if (main && bar && "IntersectionObserver" in window) {
    var barBtn = bar.querySelector("a");
    new IntersectionObserver(function (en) {
      var show = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      if (barBtn) barBtn.tabIndex = show ? 0 : -1;
    }).observe(main);
  }

  /* ---------- Delivery deadline: hide once passed ---------- */
  doc.querySelectorAll("[data-deadline]").forEach(function (el) {
    var d = new Date(el.getAttribute("data-deadline") + "T23:59:59");
    if (isNaN(d) || d < new Date()) el.hidden = true;
  });

  /* ---------- Card settle, the one animation ---------- */
  var card = doc.querySelector("[data-settle]");
  if (card) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { card.classList.add("is-in"); cio.disconnect(); }
      }, { threshold: 0.35 });
      cio.observe(card);
    } else card.classList.add("is-in");
  }
})();
