/* Dearly: gallery, zoom, sticky cart bar, FAQ, variant sync, deadline. Vanilla, no dependencies. */
(function () {
  'use strict';
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Gallery: dots on mobile, thumbnails on desktop, popover zoom */
  $$('[data-d-gallery]').forEach(function (g) {
    var track = g.querySelector('.d-gallery__track');
    var slides = $$('.d-gallery__slide', g);
    var marks = $$('[data-d-goto]', g);
    if (!track || !slides.length) return;

    function mark(i) {
      marks.forEach(function (m) {
        m.setAttribute('aria-current', String(+m.getAttribute('data-d-goto') === i));
      });
    }
    function go(i) {
      var s = slides[i];
      if (!s) return;
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0), behavior: 'auto' });
      mark(i);
    }
    marks.forEach(function (m) {
      m.addEventListener('click', function () { go(+m.getAttribute('data-d-goto')); });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) mark(slides.indexOf(e.target));
        });
      }, { root: track, threshold: [0.6] });
      slides.forEach(function (s) { io.observe(s); });
    }

    var zoom = g.querySelector('.d-zoom');
    var zimg = zoom && zoom.querySelector('img');
    slides.forEach(function (s) {
      s.addEventListener('click', function () {
        if (!zimg) return;
        zimg.src = s.getAttribute('data-zoom-src');
        zimg.alt = s.getAttribute('data-zoom-alt') || '';
        /* popovertarget opens the popover natively after this handler; older engines get a new tab */
        if (!zoom.showPopover) window.open(s.getAttribute('data-zoom-src'), '_blank', 'noopener');
      });
    });
  });

  /* Sticky add-to-cart bar: shows once the main button has scrolled out above the viewport */
  var main = document.querySelector('[data-d-atc-main]');
  var bar = document.querySelector('[data-d-sticky]');
  if (main && bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var past = !e.isIntersecting && e.boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', past);
      bar.setAttribute('aria-hidden', String(!past));
      $$('button, a', bar).forEach(function (el) { el.tabIndex = past ? 0 : -1; });
    }).observe(main);
  }

  /* FAQ accordion: buttons with aria-expanded controlling hidden panels */
  $$('[data-d-faq] .d-faq__btn').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
    if (panel) panel.addEventListener('beforematch', function () {
      btn.setAttribute('aria-expanded', 'true');
    });
  });

  /* Variant selector (only present once a second SKU exists): keep the form id and prices in sync */
  var picker = document.querySelector('[data-d-variants]');
  if (picker) {
    var idInput = document.querySelector('#dearly-product-form input[name="id"]');
    picker.addEventListener('change', function (ev) {
      var r = ev.target;
      if (!r || r.name !== 'd-variant') return;
      if (idInput) idInput.value = r.value;
      $$('[data-d-price-now]').forEach(function (el) { el.textContent = r.getAttribute('data-price'); });
      $$('[data-d-price-was]').forEach(function (el) {
        var was = r.getAttribute('data-compare');
        el.textContent = was || '';
        el.hidden = !was;
      });
      var url = new URL(window.location.href);
      url.searchParams.set('variant', r.value);
      history.replaceState(null, '', url.toString());
    });
  }

  /* Christmas deadline: Liquid renders it server side; this hides it if a cached page outlives the date */
  $$('[data-d-deadline]').forEach(function (el) {
    var d = el.getAttribute('data-d-deadline');
    var end = d && new Date(d + 'T23:59:59');
    if (!end || isNaN(end) || Date.now() > end.getTime()) el.hidden = true;
  });

  /* Footer cookie preferences link: only shown when Shopify's privacy banner is available */
  $$('[data-d-cookie-prefs]').forEach(function (b) {
    function ready() { return window.privacyBanner && typeof window.privacyBanner.showPreferences === 'function'; }
    function check() { if (ready()) b.hidden = false; }
    check();
    window.addEventListener('load', function () { check(); setTimeout(check, 3000); });
    b.addEventListener('click', function () { if (ready()) window.privacyBanner.showPreferences(); });
  });
})();
