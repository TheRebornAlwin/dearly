/* Dearly. Vanilla, no dependencies. Scroll effects live in CSS (scroll-driven animations). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, win = window;
  root.classList.add("js");
  var cfg = win.DEARLY_CONFIG || {};
  var PIXEL_ID = "29461693903447213";
  var CONSENT_KEY = "dearly-consent";
  var PRICE = cfg.price || 49.99, CUR = cfg.currency || "USD";
  var SHIP_MIN = 7, SHIP_MAX = 14, HOLIDAY_MARGIN = 21; // days; matches the shipping policy
  var fineHover = win.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function uid() { return (win.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); }

  /* ---------- Meta Pixel + server-side copy, only after consent ---------- */
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
    track('PageView');
    track('ViewContent', { content_name: 'To My Beautiful Girlfriend Infinity Heart Necklace', content_type: 'product', content_ids: [String(cfg.variantId || 'dearly-necklace')], value: PRICE, currency: CUR });
  }
  // Browser event plus the same event sent from our server, deduplicated by Meta through event_id.
  function track(ev, data) {
    if (!pixelLoaded) return;
    var id = uid();
    win.fbq('track', ev, data || {}, { eventID: id });
    try {
      var body = JSON.stringify({ event_name: ev, event_id: id, url: location.href, custom_data: data || {} });
      if (navigator.sendBeacon) navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
    } catch (e) {}
  }

  var banner = doc.querySelector("[data-consent]");
  function setConsent(v) { store(CONSENT_KEY, v); if (banner) banner.hidden = true; if (v === "yes") loadPixel(); }
  var saved = store(CONSENT_KEY);
  if (saved === "yes") loadPixel();
  else if (saved !== "no" && banner) setTimeout(function () { banner.hidden = false; }, 1200);
  doc.addEventListener("click", function (e) {
    var c = e.target.closest("[data-consent-choice]");
    if (c) { setConsent(c.getAttribute("data-consent-choice")); return; }
    if (e.target.closest("[data-consent-open]") && banner) banner.hidden = false;
  });

  /* ---------- Buy: straight to Shopify checkout ---------- */
  var checkoutUrl = "", checkoutOrigin = "";
  if (cfg.shopDomain && /^\d+$/.test(String(cfg.variantId))) {
    var host = String(cfg.shopDomain).replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    checkoutOrigin = "https://" + host;
    checkoutUrl = checkoutOrigin + "/cart/" + cfg.variantId + ":1";
  }
  // Warm up the connection to Shopify the moment intent shows, so checkout opens faster.
  var warmed = false;
  function warm() {
    if (warmed || !checkoutOrigin) return;
    warmed = true;
    var l = doc.createElement("link"); l.rel = "preconnect"; l.href = checkoutOrigin; doc.head.appendChild(l);
  }
  doc.addEventListener("pointerover", function (e) { if (e.target.closest && e.target.closest("[data-buy]")) warm(); }, { passive: true });
  doc.addEventListener("touchstart", function (e) { if (e.target.closest && e.target.closest("[data-buy]")) warm(); }, { passive: true });

  var msg = doc.querySelector("[data-buy-msg]");
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-buy]");
    if (!b) return;
    e.preventDefault();
    if (checkoutUrl) {
      if (b.classList.contains("btn")) {
        b.classList.add("is-loading");
        var label = b.querySelector(".btn__label");
        if (label) label.textContent = "Opening secure checkout";
      }
      track("InitiateCheckout", { value: PRICE, currency: CUR, num_items: 1 });
      setTimeout(function () { win.location.href = checkoutUrl; }, pixelLoaded ? 160 : 0);
      return;
    }
    if (msg) msg.hidden = false;
    var buy = doc.getElementById("buy");
    if (buy && !b.hasAttribute("data-buy-main")) buy.scrollIntoView({ behavior: "smooth" });
  });
  // Coming back from checkout with the Back button: reset the button.
  win.addEventListener("pageshow", function () {
    doc.querySelectorAll(".btn.is-loading").forEach(function (b) {
      b.classList.remove("is-loading");
      var l = b.querySelector(".btn__label"); if (l) l.textContent = "Buy now";
    });
  });

  /* ---------- Delivery window and holiday cutoff, computed from today ---------- */
  var fmt = function (d, wd) {
    try { return d.toLocaleDateString("en-US", wd ? { weekday: "short", month: "short", day: "numeric" } : { month: "short", day: "numeric" }); }
    catch (e) { return d.toDateString().slice(4, 10); }
  };
  var today = new Date(); today.setHours(12, 0, 0, 0);
  var addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
  var eta = doc.querySelector("[data-eta] span");
  if (eta) eta.innerHTML = "Free shipping. Order today, arrives <strong>" + fmt(addDays(today, SHIP_MIN)) + " to " + fmt(addDays(today, SHIP_MAX)) + "</strong>.";

  var hol = doc.querySelector("[data-holiday]");
  if (hol) {
    var y = today.getFullYear(), list = [];
    [y, y + 1].forEach(function (yr) {
      list.push({ name: "Christmas", date: new Date(yr, 11, 25, 12) });
      list.push({ name: "Valentine’s Day", date: new Date(yr, 1, 14, 12) });
    });
    list.sort(function (a, b) { return a.date - b.date; });
    for (var i = 0; i < list.length; i++) {
      var cut = addDays(list[i].date, -HOLIDAY_MARGIN);
      var daysLeft = Math.round((cut - today) / 864e5);
      if (daysLeft >= 0 && daysLeft <= 45) {
        hol.textContent = "Order by " + fmt(cut, true) + " for delivery before " + list[i].name + ".";
        hol.hidden = false;
        var annHol = doc.querySelector("[data-announce-holiday]");
        if (annHol) {
          annHol.innerHTML = "<em>Order by " + fmt(cut) + "</em> for " + list[i].name;
          annHol.hidden = false;
          annHol.parentNode.classList.add("is-3");
        }
        break;
      }
    }
  }

  /* ---------- Gallery: dots on mobile, viewer everywhere ---------- */
  var gal = doc.querySelector("[data-gallery]");
  var slides = gal ? [].slice.call(gal.querySelectorAll(".gallery__slide")) : [];
  if (gal && "IntersectionObserver" in win) {
    var track_ = gal.querySelector(".gallery__track");
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

  var dlg = doc.querySelector("[data-zoom-dialog]");
  if (dlg && slides.length && typeof dlg.showModal === "function") {
    var zImg = dlg.querySelector("[data-zoom-img]"), stage = dlg.querySelector("[data-zoom-stage]"), count = dlg.querySelector("[data-zoom-count]");
    var cur = 0, opener = null;
    var show = function (i) {
      cur = (i + slides.length) % slides.length;
      var src = slides[cur].querySelector("img");
      var go = function () {
        stage.classList.remove("is-zoomed");
        zImg.src = src.currentSrc.replace(/-(400|800|1200)\.(avif|jpg)(?=\?|$)/, "-1600.$2") || src.src;
        zImg.alt = src.alt;
        count.textContent = (cur + 1) + " / " + slides.length;
      };
      if (doc.startViewTransition && dlg.open) doc.startViewTransition(go); else go();
    };
    slides.forEach(function (s, i) {
      s.addEventListener("click", function () { opener = s; show(i); dlg.showModal(); });
    });
    dlg.addEventListener("click", function (e) {
      var st = e.target.closest("[data-zoom-step]");
      if (st) { show(cur + Number(st.getAttribute("data-zoom-step"))); return; }
      if (e.target.closest("[data-zoom-close]")) { dlg.close(); return; }
      if (e.target === zImg) {
        var r = zImg.getBoundingClientRect();
        zImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
        stage.classList.toggle("is-zoomed");
      }
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
    var sx = 0;
    stage.addEventListener("touchstart", function (e) { if (e.touches.length === 1) sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (stage.classList.contains("is-zoomed") || !sx || e.changedTouches.length !== 1) return;
      var dx = e.changedTouches[0].clientX - sx; sx = 0;
      if (Math.abs(dx) > 50 && (!win.visualViewport || win.visualViewport.scale <= 1.01)) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
    dlg.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* ---------- Sticky buy bar ---------- */
  var main = doc.querySelector("[data-buy-main]"), bar = doc.querySelector("[data-sticky]");
  if (main && bar && "IntersectionObserver" in win) {
    var barBtn = bar.querySelector("a");
    new IntersectionObserver(function (en) {
      var vis = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-visible", vis);
      bar.setAttribute("aria-hidden", vis ? "false" : "true");
      if (barBtn) barBtn.tabIndex = vis ? 0 : -1;
    }).observe(main);
  }

  /* ---------- Light on the card follows the pointer (desktop only) ---------- */
  var card = doc.querySelector("[data-shine]");
  if (card && fineHover && !win.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var raf = 0, px = 0, py = 0;
    card.addEventListener("pointerenter", function () { card.classList.add("is-lit"); });
    card.addEventListener("pointerleave", function () { card.classList.remove("is-lit"); });
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; card.style.setProperty("--mx", px + "px"); card.style.setProperty("--my", py + "px"); });
    });
  }
})();
