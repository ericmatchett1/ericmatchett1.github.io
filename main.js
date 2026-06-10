// ---------- Theme (light/dark) ----------
(function () {
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  function syncToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "☾" : "☀";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Year
    document.querySelectorAll(".year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Theme toggle
    syncToggle();
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        var next = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        syncToggle();
      });
    }

    // Active nav link (clean URLs: "/about/", "/", ...)
    var path = location.pathname.replace(/index\.html$/, "");
    if (path.charAt(path.length - 1) !== "/") path += "/";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });

    // Filter tabs (projects / videos)
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      var buttons = group.querySelectorAll(".filter");
      var targetSel = group.getAttribute("data-filter-target");
      var items = document.querySelectorAll(targetSel + " [data-cat]");
      buttons.forEach(function (b) {
        b.addEventListener("click", function () {
          buttons.forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          var f = b.getAttribute("data-filter");
          items.forEach(function (item) {
            var cats = (item.getAttribute("data-cat") || "").split(" ");
            var show = f === "all" || cats.indexOf(f) !== -1;
            item.classList.toggle("is-hidden", !show);
          });
        });
      });
    });
  });
})();
