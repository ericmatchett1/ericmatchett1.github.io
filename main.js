// ============ One-page portfolio interactions ============
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function syncToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.textContent = document.documentElement.getAttribute("data-theme") === "dark" ? "☾" : "☀";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // ---- Year ----
    document.querySelectorAll(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // ---- Back to top ----
    document.querySelectorAll('a[href="#top"], .to-top').forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    });

    // ---- Theme toggle ----
    syncToggle();
    var tbtn = document.getElementById("themeToggle");
    if (tbtn) tbtn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });

    // ---- Scroll progress + navbar shadow ----
    var bar = document.querySelector(".scroll-progress");
    var nav = document.querySelector(".nav");
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- Active nav link (mixed: home anchors + detail pages) ----
    function norm(p) { p = p.replace(/index\.html$/, ""); return p.charAt(p.length - 1) === "/" ? p : p + "/"; }
    var here = norm(location.pathname);
    var allNav = [].slice.call(document.querySelectorAll(".nav-links a"));
    var hashLinks = {};
    allNav.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("#") !== -1) {
        hashLinks[href.split("#")[1]] = a;            // home-section link
      } else if (here !== "/" && norm(a.pathname) === here) {
        a.classList.add("active");                    // detail-page link
      }
    });
    if (here === "/") {
      var navObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && hashLinks[e.target.id]) {
            for (var k in hashLinks) hashLinks[k].classList.remove("active");
            hashLinks[e.target.id].classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll("section[id]").forEach(function (s) { navObs.observe(s); });
    }

    // ---- Stagger setup for grouped items ----
    [".ab-cards .ab-card", ".stats .stat-card", ".impact-grid .impact-item",
     ".cards .card", ".fvideos .fvideo", ".htimeline .htl-item",
     ".ab-stack .ab-stack-col", ".eh-grid .eh", ".edu-extras .edu-xcard"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.transitionDelay = (i * 0.08) + "s";
      });
    });

    // ---- Reveal on scroll ----
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal, .ab-card, .htimeline, .exp-scene, .edu-timeline").forEach(function (el) { revObs.observe(el); });

    // ---- Count-up ----
    function fmt(n) { return n.toLocaleString("en-US"); }
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; countObs.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduce) { el.textContent = fmt(target) + suffix; return; }
        var dur = 1200, start = null;
        function step(ts) {
          if (!start) start = ts;
          var prog = Math.min((ts - start) / dur, 1);
          var val = Math.round(target * (0.5 - Math.cos(prog * Math.PI) / 2));
          el.textContent = fmt(val) + suffix;
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-count]").forEach(function (el) { countObs.observe(el); });

    // ---- Featured videos: click to play + real duration ----
    document.querySelectorAll(".fvideo-media").forEach(function (media) {
      var video = media.querySelector("video");
      var durEl = media.querySelector(".dur");
      if (video && durEl) {
        video.addEventListener("loadedmetadata", function () {
          if (isFinite(video.duration)) {
            var m = Math.floor(video.duration / 60), s = Math.floor(video.duration % 60);
            durEl.textContent = m + ":" + (s < 10 ? "0" : "") + s;
          }
        });
      }
      media.addEventListener("click", function () {
        if (!video) return;
        media.classList.add("playing");
        video.setAttribute("controls", "");
        video.play();
      });
    });

    // ---- Experience: progress-rail active state ----
    var expSections = [].slice.call(document.querySelectorAll(".exp-section"));
    if (expSections.length) {
      var railLinks = {};
      document.querySelectorAll(".exp-rail a").forEach(function (a) { railLinks[a.getAttribute("href").slice(1)] = a; });
      var expObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && railLinks[e.target.id]) {
            for (var k in railLinks) railLinks[k].classList.remove("active");
            railLinks[e.target.id].classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      expSections.forEach(function (s) { expObs.observe(s); });
    }

    if (reduce) return;

    // ---- Hero pointer: depth parallax + arm tracking + cursor halo ----
    var hero = document.querySelector(".ab-hero");
    var modules = [].slice.call(document.querySelectorAll(".ab-stage .ab-module"));
    var halo = document.querySelector(".cursor-halo");
    var depths = [5, 10, 15];
    if (hero) {
      hero.addEventListener("mousemove", function (ev) {
        var r = hero.getBoundingClientRect();
        var dx = (ev.clientX - r.left) / r.width - 0.5;
        var dy = (ev.clientY - r.top) / r.height - 0.5;
        modules.forEach(function (m, i) {
          var d = depths[i] || 8;
          var t = "translate(" + (dx * d).toFixed(1) + "px," + (dy * d * 0.7).toFixed(1) + "px)";
          if (i === 2) t += " rotate(" + (dx * 6).toFixed(1) + "deg)";   // robot arm tracks the mouse
          m.style.transform = t;
        });
        if (halo) {
          halo.style.left = (ev.clientX - r.left) + "px";
          halo.style.top = (ev.clientY - r.top) + "px";
          halo.style.opacity = "1";
        }
      });
      hero.addEventListener("mouseleave", function () {
        modules.forEach(function (m) { m.style.transform = "translate(0,0)"; });
        if (halo) halo.style.opacity = "0";
      });
    }

    // ---- Magnetic hero buttons ----
    document.querySelectorAll(".hero-btns .btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (mx * 0.25).toFixed(1) + "px," + (my * 0.35).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });

    // ---- AI status panel: ticking metrics ----
    var ops = document.getElementById("aisOps"), lat = document.getElementById("aisLat");
    if (ops && lat) {
      setInterval(function () {
        ops.textContent = 240 + Math.floor(Math.random() * 18);
        lat.textContent = 12 + Math.floor(Math.random() * 6);
      }, 2500);
    }

    // ---- Neural particle field ----
    var canvas = document.querySelector(".ab-particles");
    if (!canvas) return;
    var ctx = canvas.getContext("2d"), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), pts = [];
    function rgb() {
      var c = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().replace("#", "");
      if (c.length === 3) c = c.split("").map(function (x){return x+x;}).join("");
      var n = parseInt(c || "2563eb", 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function resize() {
      var host = canvas.parentElement;
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(32, Math.round(W / 34)));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25, r:1.5+Math.random()*2.5 });
    }
    function tick() {
      var c = rgb();
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.55)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx*dx + dy*dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (0.18*(1 - d/110)).toFixed(3) + ")";
            ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    resize(); window.addEventListener("resize", resize); requestAnimationFrame(tick);
  });
})();
