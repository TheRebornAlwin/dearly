/* Cookie policy page: opt out of (or back into) the Meta Pixel and Microsoft Clarity for this browser.
   site.js and clarity.js read the same "dearly-consent" key; "no" keeps both off on every page. */
(function () {
  var box = document.querySelector("[data-choices]"); if (!box) return;
  var KEY = "dearly-consent", status = box.querySelector("[data-choices-status]");
  var get = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var show = function () {
    var off = get() === "no";
    status.textContent = off ? "You have opted out. Analytics and marketing cookies are off in this browser." : "Analytics and marketing cookies are on in this browser.";
    box.querySelector('[data-choice="no"]').disabled = off;
    box.querySelector('[data-choice="yes"]').disabled = !off;
  };
  box.addEventListener("click", function (e) {
    var b = e.target.closest("[data-choice]"); if (!b) return;
    var v = b.getAttribute("data-choice");
    try { localStorage.setItem(KEY, v); } catch (x) {}
    if (v === "no") ["_fbp", "_fbc", "_clck", "_clsk"].forEach(function (n) {
      document.cookie = n + "=; Max-Age=0; path=/";
      document.cookie = n + "=; Max-Age=0; path=/; domain=." + location.hostname.replace(/^www\./, "");
    });
    show();
  });
  show();
})();
