// ============ About page interactions ============
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    // ---- Scroll progress bar ----
    var bar = document.querySelector(".scroll-progress");
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- Staggered reveal (cards + philosophy) ----
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll(".ab-card").forEach(function (c, i) {
      c.style.transitionDelay = (i * 0.09) + "s";
      io.observe(c);
    });
    var phil = document.querySelector(".ab-philosophy");
    if (phil) io.observe(phil);

    // ---- Cursor glow on cards ----
    document.querySelectorAll(".ab-card").forEach(function (card) {
      var glow = card.querySelector(".glow");
      if (!glow) return;
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        glow.style.left = (ev.clientX - r.left) + "px";
        glow.style.top = (ev.clientY - r.top) + "px";
      });
    });

    // ---- Navbar shadow on scroll ----
    var nav = document.querySelector(".nav");
    function navShade() { if (nav) nav.style.boxShadow = (window.scrollY > 8 ? "0 6px 20px rgba(15,23,42,0.06)" : "none"); }
    window.addEventListener("scroll", navShade, { passive: true });
    navShade();

    if (reduce) return;

    // ---- Mouse parallax on the AI pipeline ----
    var hero = document.querySelector(".ab-hero");
    var stage = document.querySelector(".ab-stage");
    if (hero && stage) {
      hero.addEventListener("mousemove", function (ev) {
        var r = hero.getBoundingClientRect();
        var dx = (ev.clientX - r.left) / r.width - 0.5;
        var dy = (ev.clientY - r.top) / r.height - 0.5;
        stage.style.transform = "translate(" + (dx * 14).toFixed(1) + "px," + (dy * 10).toFixed(1) + "px)";
      });
      hero.addEventListener("mouseleave", function () { stage.style.transform = "translate(0,0)"; });
    }

    // ---- Neural particle field ----
    var canvas = document.querySelector(".ab-particles");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), pts = [];
    function accent() {
      var c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      return c || "#2563eb";
    }
    function resize() {
      var host = canvas.parentElement;
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(34, Math.round(W / 34)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          r: 1.5 + Math.random() * 2.5 });
      }
    }
    function hexToRgb(h) {
      h = h.replace("#", "");
      if (h.length === 3) h = h.split("").map(function (x){return x+x;}).join("");
      var n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function tick() {
      var col = accent(); var rgb = col[0] === "#" ? hexToRgb(col) : [37,99,235];
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.55)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (0.18 * (1 - d / 110)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(tick);
  });
})();
