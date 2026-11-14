/* Microsoft Clarity (session recordings and heatmaps). Project zd9ibmpats.
   Loaded after the page has finished loading, so it never competes with the first paint.
   Skipped for anyone who clicked Decline on the cookie banner (site.js also switches it off on Decline). */
(function (c, l, a, r, i) {
  function go() {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    var t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    var y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  }
  try { if (localStorage.getItem("dearly-consent") === "no") return; } catch (e) {}
  if (l.readyState === "complete") setTimeout(go, 1500);
  else c.addEventListener("load", function () { setTimeout(go, 1500); });
})(window, document, "clarity", "script", "zd9ibmpats");
