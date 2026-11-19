/* =========================================================
   Portfolio — small helpers, no libraries
   1. Mobile menu (open / close)
   2. Copy email to clipboard with "Copied" feedback
   3. Grey placeholder when an image file is missing
   4. (hero star: CSS only now, nothing here)
   5. (removed: About is a bento board now, see section 9)
   6. Out of office photo strip: start when visible, pause button
   7. Header while scrolling: shadow + reading progress (case pages)
   8. Active menu link for the section on screen
   9. Blocks and stickers appear as you scroll
  10. Custom "squish" cursor (mouse only)
  11. Star burst on "Copy", "Download CV" and "View cases"
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

/* ---------------------------------------------------------
   7. HEADER WHILE SCROLLING
   .is-scrolled gives the header a soft shadow once the page moves.
   Case pages: a thin yellow line under the header fills up as you
   read (.read-progress in styles.css).
   The logo star turns slowly with the scroll (one full turn every
   2400px), a quiet sign that the page is moving. Not with "Reduce motion".
   --------------------------------------------------------- */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var bar = null;
  if (document.body.classList.contains("page-case")) {
    bar = document.createElement("span");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    header.appendChild(bar);
  }

  var logoStar = header.querySelector(".logo__star");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var waiting = false;
  function update() {
    waiting = false;
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (logoStar && !calm) logoStar.style.setProperty("--logo-turn", (y * 0.15) + "deg");
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--read", max > 0 ? Math.min(1, y / max) : 0);
    }
  }

  // Update at most once per frame
  window.addEventListener("scroll", function () {
    if (!waiting) { waiting = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ---------------------------------------------------------
   8. ACTIVE MENU LINK
   The menu link of the section you are looking at keeps its yellow
   underline (.is-active). Contact is short, so it becomes active
   once the page is scrolled to the bottom.
   --------------------------------------------------------- */
(function () {
  var pairs = [];
  document.querySelectorAll('.nav__link[href^="#"]').forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) pairs.push([link, section]);
  });
  if (!pairs.length) return;

  var waiting = false;
  function update() {
    waiting = false;
    var line = window.innerHeight * 0.4;   // a section is "on screen" when it crosses this line
    var current = -1;
    pairs.forEach(function (pair, i) {
      var box = pair[1].getBoundingClientRect();
      if (box.top <= line && box.bottom > line) current = i;
    });
    var root = document.documentElement;
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) current = pairs.length - 1;
    pairs.forEach(function (pair, i) { pair[0].classList.toggle("is-active", i === current); });
  }

  window.addEventListener("scroll", function () {
    if (!waiting) { waiting = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ---------------------------------------------------------
   9. APPEAR ON SCROLL
   Blocks below the first screen fade in and rise a little when they
   scroll into view (.reveal / .is-visible in styles.css). Blocks that
   come into view together appear one after another.
   Yellow stickers drop onto their image and the arrow draws itself
   (.is-stuck). Nothing moves if "Reduce motion" is turned on.
   --------------------------------------------------------- */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Which blocks appear on scroll. To add one, add its selector here.
  var SELECTOR = [
    ".section-title", ".cards > li", ".cards-note",
    ".gallery",
    ".split > *", ".case-cover", ".case-wide", ".case-shot", ".case-continue > *",
    ".contact__inner > *"
  ].join(",");

  var all = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  var fold = window.innerHeight * 0.9;
  var blocks = all.filter(function (el) {
    // Skip a block inside another block from the list (the outer one moves for both)
    var nested = all.some(function (other) { return other !== el && other.contains(el); });
    // Blocks already on the first screen stay as they are (no flash)
    return !nested && el.getBoundingClientRect().top > fold;
  });

  document.documentElement.classList.add("has-reveal");

  var observer = new IntersectionObserver(function (entries) {
    var order = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty("--reveal-delay", Math.min(order, 4) * 90 + "ms");
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
      order++;
    });
  }, { rootMargin: "0px 0px -10% 0px" });

  blocks.forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // Stickers: wait until a third of the image is on screen
  var stickers = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-stuck");
      stickers.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  // About me bento board: cards rise in and doodles draw once it is on screen.
  // The handwritten line is split into letters that appear one by one,
  // with small uneven pauses, like a pen writing.
  var about = document.querySelector(".about");
  if (about) {
    var ink = about.querySelector(".about-ink");
    if (ink) {
      var text = ink.textContent, t = 1100, jitter = [0, 30, 10, 45, 15, 0, 35, 20, 5, 40];
      ink.textContent = "";
      var said = document.createElement("span");
      said.className = "sr-only";
      said.textContent = text;
      var letters = document.createElement("span");
      letters.setAttribute("aria-hidden", "true");
      var word = null;   // letters are grouped into words, so a line only breaks between words
      text.split("").forEach(function (ch, i) {
        t += ch === " " ? 140 : 70 + jitter[i % jitter.length];
        if (ch === " ") { letters.appendChild(document.createTextNode(" ")); word = null; return; }
        if (!word) { word = document.createElement("span"); word.className = "about-ink__word"; letters.appendChild(word); }
        var l = document.createElement("span");
        l.className = "about-ink__letter";
        l.style.setProperty("--d", t + "ms");
        l.textContent = ch;
        word.appendChild(l);
      });
      ink.appendChild(said);
      ink.appendChild(letters);
    }
    var aboutWatch = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      about.classList.add("is-in");
      aboutWatch.disconnect();
    }, { threshold: 0.15 });
    aboutWatch.observe(about.querySelector(".about-bento") || about);
  }

  document.querySelectorAll(".has-sticker").forEach(function (figure) {
    figure.querySelectorAll(".sticker-arrow path").forEach(function (path) {
      path.setAttribute("pathLength", "1");   // lets CSS draw the arrow from 0 to 1
    });
    stickers.observe(figure);
  });
})();

/* ---------------------------------------------------------
   10. SQUISH CURSOR
   A lime dot follows the mouse with a little delay and stretches
   in the direction it moves (squashes across it), like a soft ball.
   Over links and buttons it grows, so it's clear they are clickable.
   It is 3 stacked dots that blend with the page: on the background it
   is exactly the brand lime, and text under it stays visible (dark).
   Only with a mouse, and not for people who turned on "Reduce motion":
   then the normal cursor stays. Styles: .squish-cursor in styles.css
   --------------------------------------------------------- */
(function () {
  var mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!mouse || calm) return;

  var layers = ["squish-cursor--flip", "squish-cursor--tint", "squish-cursor--lift"].map(function (name) {
    var dot = document.createElement("div");
    dot.className = "squish-cursor " + name;
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    return dot;
  });
  function each(fn) { layers.forEach(fn); }
  document.documentElement.classList.add("has-squish-cursor");

  var EASE  = 0.2;
  var POWER = 0.96;   // maximum deformation
  var HOVER = 1.6;    // size over links and buttons

  var mx = 0, my = 0, x = 0, y = 0, sx = 1, sy = 1, rot = 0, grow = 1, hovering = false;

  addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    each(function (dot) { dot.classList.add("is-visible"); });
  }, { passive: true });

  // Grow over anything clickable
  addEventListener("pointerover", function (e) {
    hovering = !!e.target.closest("a, button, [role='button'], label, summary");
  }, { passive: true });

  // Hide when the mouse leaves the window
  document.addEventListener("mouseleave", function () {
    each(function (dot) { dot.classList.remove("is-visible"); });
  });

  (function loop() {
    var dx = mx - x, dy = my - y;
    x += dx * EASE;
    y += dy * EASE;

    var speed = Math.min(Math.hypot(dx, dy) / 44, POWER);
    if (speed > 0.02) rot = Math.atan2(dy, dx) * 180 / Math.PI;

    sx += ((1 + speed)        - sx) * 0.18;   // stretch along travel
    sy += ((1 - speed * 0.78) - sy) * 0.18;   // squash across it
    grow += ((hovering ? HOVER : 1) - grow) * 0.2;

    var transform =
      "translate3d(" + x + "px, " + y + "px, 0) rotate(" + rot + "deg) scale(" + sx * grow + ", " + sy * grow + ")";
    each(function (dot) { dot.style.transform = transform; });
    requestAnimationFrame(loop);
  })();
})();

/* ---------------------------------------------------------
   11. STAR BURST
   Clicking "Copy" (email), "Download CV" or "View cases" sends a
   handful of little lime stars flying out of the click and fading.
   Purely decorative; nothing happens with "Reduce motion".
   --------------------------------------------------------- */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!Element.prototype.animate) return;
  var NS = "http://www.w3.org/2000/svg";
  var STAR = "M24 1C26 14 34 22 47 24C34 26 26 34 24 47C22 34 14 26 1 24C14 22 22 14 24 1Z";

  function burst(x, y) {
    var count = 10;
    for (var i = 0; i < count; i++) {
      var star = document.createElementNS(NS, "svg");
      star.setAttribute("class", "star-burst");
      star.setAttribute("viewBox", "0 0 48 48");
      star.setAttribute("aria-hidden", "true");
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", STAR);
      star.appendChild(path);
      star.style.left = x + "px";
      star.style.top = y + "px";
      document.body.appendChild(star);

      // each star flies in its own direction, a random distance, size and spin
      var angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      var dist = 40 + Math.random() * 50;
      var size = 0.5 + Math.random() * 0.9;
      var spin = (Math.random() < 0.5 ? -1 : 1) * (90 + Math.random() * 180);
      star.animate([
        { transform: "translate(0, 0) scale(0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + Math.cos(angle) * dist * 0.7 + "px, " + Math.sin(angle) * dist * 0.7 + "px) scale(" + size + ") rotate(" + spin * 0.6 + "deg)", opacity: 1, offset: 0.55 },
        { transform: "translate(" + Math.cos(angle) * dist + "px, " + (Math.sin(angle) * dist + 12) + "px) scale(" + size * 0.6 + ") rotate(" + spin + "deg)", opacity: 0 }
      ], { duration: 700 + Math.random() * 250, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" })
        .onfinish = (function (el) { return function () { el.remove(); }; })(star);
    }
  }

  document.addEventListener("click", function (e) {
    var target = e.target.closest('.copy-btn, a[href$="cv.pdf"], .hero__cta');
    if (!target) return;
    // From the mouse; from the middle of the button when pressed with the keyboard
    var x = e.clientX, y = e.clientY;
    if (!e.detail) {
      var box = target.getBoundingClientRect();
      x = box.left + box.width / 2;
      y = box.top + box.height / 2;
    }
    burst(x, y);
  });
})();
