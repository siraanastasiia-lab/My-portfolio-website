/* =========================================================
   Portfolio — small helpers, no libraries
   1. Mobile menu (open / close)
   2. Copy email to clipboard with "Copied" feedback
   3. Grey placeholder when an image file is missing
   4. Hero star spins every time it comes into view
   5. Hand-drawn brush outline around the About stats
   6. Out of office photo strip: start when visible, pause button
   ========================================================= */

/* ---------------------------------------------------------
   1. MOBILE MENU
   --------------------------------------------------------- */
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a link
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  // If the window becomes wide, the menu is not needed
  window.matchMedia("(min-width: 48em)").addEventListener("change", function (mq) {
    if (mq.matches) setOpen(false);
  });
})();

/* ---------------------------------------------------------
   2. COPY EMAIL
   Button: <button class="copy-btn" data-copy="..."> with icons inside
   --------------------------------------------------------- */
(function () {
  var status = document.getElementById("copy-status"); // screen reader message

  function fallbackCopy(text) {
    // Works when the page is opened from a file (no clipboard API)
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(field);
    return ok;
  }

  // Swaps the copy icon for a check + "Copied" (see .is-copied in styles.css)
  function showCopied(button) {
    button.classList.add("is-copied");
    if (status) status.textContent = "Email copied to clipboard";
    clearTimeout(button._timer);
    button._timer = setTimeout(function () {
      button.classList.remove("is-copied");
      if (status) status.textContent = "";
    }, 2000);
  }

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { showCopied(button); },
          function () { if (fallbackCopy(text)) showCopied(button); }
        );
      } else if (fallbackCopy(text)) {
        showCopied(button);
      }
    });
  });
})();

/* ---------------------------------------------------------
   3. IMAGE PLACEHOLDERS
   If an image inside .media can't load, keep the grey box
   and show the expected file name (e.g. assets/legal-1.jpg).
   --------------------------------------------------------- */
(function () {
  function markMissing(img) {
    var box = img.closest(".media");
    if (!box) return;
    box.classList.add("is-missing");
    box.setAttribute("data-file", img.getAttribute("src"));
  }

  document.querySelectorAll(".media img").forEach(function (img) {
    img.addEventListener("error", function () { markMissing(img); });
    // Safety net: if the image does arrive, show it
    img.addEventListener("load", function () {
      var box = img.closest(".media");
      if (box) box.classList.remove("is-missing");
    });
    if (img.complete && img.naturalWidth === 0) markMissing(img);
  });
})();

/* ---------------------------------------------------------
   4. HERO STAR ANIMATION
   Each time the star scrolls into view, it spins (2 turns) together
   with the dashed ring, and the small star orbits the centre once.
   (The spin itself is .is-spinning in styles.css)
   --------------------------------------------------------- */
(function () {
  var decor = document.querySelector(".hero__decor");
  var star = document.querySelector(".hero__star");
  var ring = document.querySelector(".hero__ring");
  var sparkle = document.querySelector(".hero__sparkle");
  if (!decor || !star || !("IntersectionObserver" in window)) return;
  var parts = [star, ring, sparkle].filter(Boolean);

  // When a spin finishes, get ready for the next one
  star.addEventListener("animationend", function () {
    parts.forEach(function (el) { el.classList.remove("is-spinning"); });
  });

  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        parts.forEach(function (el) { el.classList.add("is-spinning"); });
      }
    });
  }, { threshold: 0.6 }).observe(decor);
})();

/* ---------------------------------------------------------
   5. BRUSH OUTLINE (About me stats)
   Draws a rough rounded loop around .doodle-box three times, like a
   quick purple brush scribble: each pass is tilted and wobbly, thinner
   or thicker in places. Redrawn whenever the box changes size.
   --------------------------------------------------------- */
(function () {
  var svg = document.querySelector(".doodle-box__line");
  if (!svg || !("ResizeObserver" in window)) return;
  var NS = "http://www.w3.org/2000/svg";

  // Three quick, careless passes. Each one is drawn a bit tilted, shifted
  // and squashed, with its own corner roundness, so they never line up:
  // [start (0-1 of the loop), how far it goes, thickness, wobble,
  //  tilt in degrees, shift x, shift y, extra width, extra height, corner, seed]
  var passes = [
    [0.03, 1.10, 3.0, 4, -2.2, -3,  2,  6, -2, 0.55, 1],
    [0.35, 1.02, 2.0, 6,  1.6,  4, -3, -4,  5, 0.30, 2],
    [0.70, 0.95, 1.4, 7, -0.6,  1,  4,  9,  2, 0.45, 3]
  ];

  // Point on a rounded rectangle, t from 0 to 1 around the edge (clockwise from top-left)
  function onRoundedRect(w, h, r, t) {
    var straightX = w - 2 * r, straightY = h - 2 * r, arc = Math.PI * r / 2;
    var total = 2 * straightX + 2 * straightY + 4 * arc;
    var d = ((t % 1) + 1) % 1 * total;
    var parts = [
      [straightX, function (k) { return [r + k, 0, 0]; }],
      [arc, function (k) { var a = -Math.PI / 2 + k / r; return [w - r + r * Math.cos(a), r + r * Math.sin(a)]; }],
      [straightY, function (k) { return [w, r + k]; }],
      [arc, function (k) { var a = k / r; return [w - r + r * Math.cos(a), h - r + r * Math.sin(a)]; }],
      [straightX, function (k) { return [w - r - k, h]; }],
      [arc, function (k) { var a = Math.PI / 2 + k / r; return [r + r * Math.cos(a), h - r + r * Math.sin(a)]; }],
      [straightY, function (k) { return [0, h - r - k]; }],
      [arc, function (k) { var a = Math.PI + k / r; return [r + r * Math.cos(a), r + r * Math.sin(a)]; }]
    ];
    for (var i = 0; i < parts.length; i++) {
      if (d <= parts[i][0]) return parts[i][1](d);
      d -= parts[i][0];
    }
    return [r, 0];
  }

  function draw() {
    var box = svg.getBoundingClientRect();
    var w = box.width, h = box.height;
    if (!w || !h) return;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.textContent = "";
    var pad = 6;                                   // keep the line inside the svg
    var iw = w - 2 * pad, ih = h - 2 * pad;
    passes.forEach(function (p) {
      var start = p[0], length = p[1], thick = p[2], wobble = p[3];
      var tilt = p[4] * Math.PI / 180, sx = p[5], sy = p[6];
      var pw = iw + p[7], ph = ih + p[8], seed = p[10];
      var r = Math.min(ph * p[9], 44);               // soft corners, different on each pass
      var cx = pad + iw / 2, cy = pad + ih / 2;
      var cos = Math.cos(tilt), sin = Math.sin(tilt);
      var steps = 260, left = [], right = [];
      for (var i = 0; i <= steps; i++) {
        var f = i / steps;
        var t = start + f * length;
        var a = onRoundedRect(pw, ph, r, t);
        var b = onRoundedRect(pw, ph, r, t + 0.002);
        var tx = b[0] - a[0], ty = b[1] - a[1], len = Math.hypot(tx, ty) || 1;
        var nx = ty / len, ny = -tx / len;         // points outwards
        // Hand wobble: a few uneven waves, so the edge bulges and dips.
        // It also grows along the stroke, like a hand speeding up.
        var drift = wobble * (0.6 + 0.6 * f) * (
          Math.sin(t * 6.3 * 1 + seed * 2.1) * 0.5 +
          Math.sin(t * 6.3 * 3 + seed * 1.3) * 0.35 +
          Math.sin(t * 6.3 * 7 + seed * 0.7) * 0.15);
        // Brush pressure: thicker / thinner along the way, thin at both ends
        var pressure = 0.55 + 0.45 * Math.sin(t * 6.3 * 2.5 + seed * 1.7);
        var taper = Math.min(1, f / 0.06, (1 - f) / 0.15);
        var half = thick * pressure * Math.max(taper, 0.05) / 2;
        // Place on the page: centre the loop, then shift and tilt it
        var x = a[0] - pw / 2 + nx * drift, y = a[1] - ph / 2 + ny * drift;
        function put(ox, oy) {
          return (cx + sx + ox * cos - oy * sin).toFixed(1) + " " + (cy + sy + ox * sin + oy * cos).toFixed(1);
        }
        left.push(put(x + nx * half, y + ny * half));
        right.unshift(put(x - nx * half, y - ny * half));
      }
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", "M" + left.join("L") + "L" + right.join("L") + "Z");
      svg.appendChild(path);
    });
  }

  new ResizeObserver(draw).observe(svg.parentNode);
})();

/* ---------------------------------------------------------
   6. OUT OF OFFICE PHOTO STRIP
   The photos start sliding the first time the section scrolls
   into view (.is-playing). The round button pauses / resumes
   them (moving content needs a pause control for accessibility).
   --------------------------------------------------------- */
(function () {
  var gallery = document.querySelector(".gallery");
  var toggle = document.querySelector(".gallery__toggle");
  if (!gallery) return;

  if ("IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        gallery.classList.add("is-playing");
        watcher.disconnect();
      }
    }, { threshold: 0.3 });
    watcher.observe(gallery);
  } else {
    gallery.classList.add("is-playing");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var paused = gallery.classList.toggle("is-paused");
      toggle.setAttribute("aria-pressed", String(paused));   // "Pause slideshow, pressed" = paused
    });
  }
})();
