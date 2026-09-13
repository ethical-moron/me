(function () {
  const start = new Date("2018-09-01");
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const before =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  if (before) years -= 1;
  document.querySelectorAll(".exp-years").forEach(function (el) {
    el.textContent = String(years);
  });
})();

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  function paint(theme) {
    root.setAttribute("data-theme", theme);
  }
  paint(root.getAttribute("data-theme") || "dark");
  toggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    paint(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
})();

(function () {
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");
  function closeMenu() {
    btn.classList.remove("is-open");
    overlay.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }
  function openMenu() {
    btn.classList.add("is-open");
    overlay.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  btn.addEventListener("click", function () {
    if (overlay.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  overlay.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const nodes = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.28 },
  );
  nodes.forEach(function (n) {
    io.observe(n);
  });
})();

(function () {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  const COUNT = 10;
  const trail = document.createElement("div");
  trail.className = "cursor-trail is-on";
  trail.setAttribute("aria-hidden", "true");
  const dots = [];
  for (let i = 0; i < COUNT; i++) {
    const span = document.createElement("span");
    trail.appendChild(span);
    dots.push({
      el: span,
      x: 0,
      y: 0,
      scale: 1 - i * 0.07,
      alpha: 0.72 - i * 0.055,
    });
  }
  document.body.appendChild(trail);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let lastScrollY = window.scrollY;
  let lively = false;
  let idleTimer = 0;
  let raf = 0;

  function wake() {
    lively = true;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () {
      lively = false;
    }, 180);
    if (!raf) raf = requestAnimationFrame(tick);
  }

  window.addEventListener(
    "pointermove",
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      wake();
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    function () {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (dy === 0) return;

      dots.forEach(function (d) {
        d.y -= dy;
      });
      wake();
    },
    { passive: true },
  );

  function tick() {
    raf = 0;

    let px = mx;
    let py = my;
    dots.forEach(function (d, i) {
      const ease = 0.3 - i * 0.02;
      d.x += (px - d.x) * ease;
      d.y += (py - d.y) * ease;
      d.el.style.transform =
        "translate3d(" + d.x + "px," + d.y + "px,0) scale(" + d.scale + ")";
      d.el.style.opacity = lively ? String(d.alpha) : "0";
      px = d.x;
      py = d.y;
    });

    if (lively) raf = requestAnimationFrame(tick);
  }
})();
