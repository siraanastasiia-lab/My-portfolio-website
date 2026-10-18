/* =========================================================
   Portfolio — small helpers, no libraries
   1. Mobile menu (open / close)
   2. Copy email to clipboard with "Copied" feedback
   3. Grey placeholder when an image file is missing
   4. Hero star spins every time it comes into view
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
   Each time the star scrolls into view, it spins once,
   and the dashed ring around it turns together with it.
   (The spin itself is .is-spinning in styles.css)
   --------------------------------------------------------- */
(function () {
  var decor = document.querySelector(".hero__decor");
  var star = document.querySelector(".hero__star");
  var ring = document.querySelector(".hero__ring");
  if (!decor || !star || !("IntersectionObserver" in window)) return;
  var parts = ring ? [star, ring] : [star];

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
