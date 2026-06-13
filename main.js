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

    // ---- Contact form: open mail client with a prefilled message ----
    var contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
        var name = get("cf-name"), email = get("cf-email"), subject = get("cf-subject"), message = get("cf-message");
        if (!name || !email || !message) {
          contactForm.reportValidity ? contactForm.reportValidity() : alert("Please fill in your name, email, and message.");
          return;
        }
        var subj = subject || ("Portfolio message from " + name);
        var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
        window.location.href = "mailto:matchetteric1@gmail.com"
          + "?subject=" + encodeURIComponent(subj)
          + "&body=" + encodeURIComponent(body);
      });
    }

    // ---- Back to top ----
    document.querySelectorAll('a[href="#top"], .to-top').forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    });
    var backTop = document.createElement("button");
    backTop.className = "backtop";
    backTop.setAttribute("aria-label", "Back to top");
    backTop.innerHTML = "↑";
    backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(backTop);

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
      backTop.classList.toggle("show", window.scrollY > 400);
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
     ".ab-stack .ab-stack-col", ".eh-grid .eh", ".edu-extras .edu-xcard",
     ".proj-grid .proj-card", ".saycan-walk .walk-step", ".saycan-flow .flow-step"].forEach(function (sel) {
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
    document.querySelectorAll(".reveal, .ab-card, .htimeline, .exp-scene, .edu-timeline, .exp-end, .edu-entry").forEach(function (el) { revObs.observe(el); });

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

    // ---- Experience: cinematic active-section + rail + tilt ----
    var expSections = [].slice.call(document.querySelectorAll(".exp-section"));
    if (expSections.length) {
      var railEl = document.querySelector(".exp-rail");
      var railLinks = {}, railOrder = [];
      document.querySelectorAll(".exp-rail a").forEach(function (a) {
        var id = a.getAttribute("href").slice(1); railLinks[id] = a; railOrder.push(id);
      });
      var railFill = null;
      if (railEl) { railFill = document.createElement("div"); railFill.className = "exp-rail-fill"; railEl.appendChild(railFill); }
      document.querySelectorAll(".exp-scene").forEach(function (sc) {
        var sn = document.createElement("div"); sn.className = "scene-scan"; sc.insertBefore(sn, sc.firstChild);
      });
      expSections[0].classList.add("exp-active");

      var isDesktop = window.matchMedia("(min-width: 861px)").matches;
      var sweepEl = null, prevActive = expSections[0].id;
      if (!reduce && isDesktop) {
        document.documentElement.classList.add("exp-snap");
        var cur = document.createElement("div"); cur.className = "exp-cursor"; document.body.appendChild(cur);
        document.addEventListener("mousemove", function (e) { cur.style.left = e.clientX + "px"; cur.style.top = e.clientY + "px"; cur.style.opacity = "1"; }, { passive: true });
        sweepEl = document.createElement("div"); sweepEl.className = "exp-sweep"; document.body.appendChild(sweepEl);
      }

      var expObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          expSections.forEach(function (s) { s.classList.toggle("exp-active", s === e.target); });
          var id = e.target.id;
          for (var k in railLinks) railLinks[k].classList.remove("active");
          if (railLinks[id]) railLinks[id].classList.add("active");
          if (railFill && railEl) {
            var idx = railOrder.indexOf(id);
            railFill.style.height = (((idx + 1) / railOrder.length) * (railEl.offsetHeight - 42)) + "px";
          }
          if (sweepEl && id !== prevActive) { sweepEl.classList.remove("go"); void sweepEl.offsetWidth; sweepEl.classList.add("go"); }
          prevActive = id;
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      expSections.forEach(function (s) { expObs.observe(s); });

      if (!reduce && isDesktop) {
        // 3D tilt + layered parallax of focal layer
        document.querySelectorAll(".exp-scene").forEach(function (scene) {
          var media = scene.closest(".exp-media") || scene;
          var core = scene.querySelector(".scene-core");
          media.addEventListener("mousemove", function (ev) {
            var r = scene.getBoundingClientRect();
            var dx = (ev.clientX - r.left) / r.width - 0.5;
            var dy = (ev.clientY - r.top) / r.height - 0.5;
            scene.style.transform = "perspective(900px) rotateX(" + (dy * -5).toFixed(2) + "deg) rotateY(" + (dx * 6).toFixed(2) + "deg)";
            if (core) core.style.transform = "translate(" + (dx * 16).toFixed(1) + "px," + (dy * 12).toFixed(1) + "px)";
          });
          media.addEventListener("mouseleave", function () { scene.style.transform = ""; if (core) core.style.transform = ""; });
        });

        // HUD chip data dots
        document.querySelectorAll(".scene-chip").forEach(function (chip) {
          var d = document.createElement("span"); d.className = "chip-dot"; chip.appendChild(d);
        });

        // per-company signature overlay (drawn line)
        var sigPaths = ["M5 70 L30 50 L55 62 L80 35 L96 46", "M8 74 C 30 60, 50 66, 66 44 S 92 24, 96 20", "M5 28 L95 28 M5 44 L95 44 M5 60 L95 60", "M50 18 a26 26 0 1 0 0.1 0", "M8 60 C 38 66, 54 30, 95 34", "M8 70 L26 54 L42 62 L58 38 L78 50 L95 30"];
        expSections.forEach(function (sec, i) {
          var scene = sec.querySelector(".exp-scene"); if (!scene) return;
          var NS = "http://www.w3.org/2000/svg";
          var svg = document.createElementNS(NS, "svg");
          svg.setAttribute("class", "sig-overlay"); svg.setAttribute("viewBox", "0 0 100 80"); svg.setAttribute("preserveAspectRatio", "none");
          var p = document.createElementNS(NS, "path");
          p.setAttribute("d", sigPaths[i] || sigPaths[0]); p.setAttribute("class", "sig-path");
          svg.appendChild(p); scene.appendChild(svg);
        });

        // depth grid layers (parallax)
        var bg = document.createElement("div");
        bg.className = "exp-bg";
        bg.innerHTML = '<span class="l1"></span><span class="l2"></span>';
        document.body.insertBefore(bg, document.body.firstChild);
        var l1 = bg.querySelector(".l1"), l2 = bg.querySelector(".l2");
        window.addEventListener("scroll", function () {
          var y = window.scrollY;
          l1.style.transform = "translateY(" + (y * 0.04).toFixed(1) + "px)";
          l2.style.transform = "translateY(" + (y * 0.08).toFixed(1) + "px)";
        }, { passive: true });

        // floating particles + spotlight
        document.querySelectorAll(".exp-scene").forEach(function (sc) {
          var p = document.createElement("div"); p.className = "scene-particles"; sc.appendChild(p);
        });
        document.querySelectorAll(".exp-grid").forEach(function (g) {
          var sp = document.createElement("div"); sp.className = "exp-spot"; g.insertBefore(sp, g.firstChild);
          g.addEventListener("mousemove", function (ev) {
            var r = g.getBoundingClientRect();
            sp.style.setProperty("--mx", ((ev.clientX - r.left) / r.width * 100).toFixed(1) + "%");
            sp.style.setProperty("--my", ((ev.clientY - r.top) / r.height * 100).toFixed(1) + "%");
          });
        });

        // magnetic CTA buttons
        document.querySelectorAll(".exp-end .btn").forEach(function (btn) {
          btn.addEventListener("mousemove", function (e) {
            var r = btn.getBoundingClientRect();
            var mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
            btn.style.transform = "translate(" + (mx * 0.2).toFixed(1) + "px," + (my * 0.3).toFixed(1) + "px)";
          });
          btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
        });
      }
    }

    // ---- Education: active entry + collage parallax ----
    var eduEntries = [].slice.call(document.querySelectorAll(".edu-entry"));
    if (eduEntries.length) {
      eduEntries[0].classList.add("edu-active");
      var eduObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) eduEntries.forEach(function (x) { x.classList.toggle("edu-active", x === e.target); });
        });
      }, { rootMargin: "-40% 0px -45% 0px" });
      eduEntries.forEach(function (x) { eduObs.observe(x); });

      if (!reduce && window.matchMedia("(min-width: 861px)").matches) {
        // collage 3D tilt + layered parallax
        document.querySelectorAll(".edu-collage").forEach(function (c) {
          c.style.transformStyle = "preserve-3d";
          var tiles = [].slice.call(c.querySelectorAll(".tile"));
          c.addEventListener("mousemove", function (ev) {
            var r = c.getBoundingClientRect();
            var dx = (ev.clientX - r.left) / r.width - 0.5, dy = (ev.clientY - r.top) / r.height - 0.5;
            c.style.transform = "perspective(900px) rotateX(" + (dy * -4).toFixed(2) + "deg) rotateY(" + (dx * 5).toFixed(2) + "deg)";
            tiles.forEach(function (t, i) { var f = (i + 1) * 2.2; t.style.transform = "translate(" + (dx * f).toFixed(1) + "px," + (dy * f).toFixed(1) + "px)"; });
          });
          c.addEventListener("mouseleave", function () { c.style.transform = ""; tiles.forEach(function (t) { t.style.transform = ""; }); });
        });

        // background depth: grid + blobs (parallax)
        var ebg = document.createElement("div");
        ebg.className = "edu-bg";
        ebg.innerHTML = '<div class="grid"></div><div class="blob b1"></div><div class="blob b2"></div>';
        document.body.insertBefore(ebg, document.body.firstChild);
        var eg = ebg.querySelector(".grid"), eb1 = ebg.querySelector(".b1"), eb2 = ebg.querySelector(".b2");
        window.addEventListener("scroll", function () {
          var y = window.scrollY;
          eg.style.transform = "translateY(" + (y * 0.05).toFixed(1) + "px)";
          eb1.style.transform = "translateY(" + (y * 0.12).toFixed(1) + "px)";
          eb2.style.transform = "translateY(" + (y * -0.08).toFixed(1) + "px)";
        }, { passive: true });
      }
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
    var mouse = { x: -9999, y: -9999 };
    canvas.parentElement.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    canvas.parentElement.addEventListener("mouseleave", function () { mouse.x = -9999; mouse.y = -9999; });
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
        var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < 90 && md > 0) { var fr = (90 - md) / 90 * 0.6; p.x += (mdx/md)*fr; p.y += (mdy/md)*fr; }
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
