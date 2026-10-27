(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Dark is the default. The choice is remembered.
  var btn = document.getElementById("theme");
  function apply(mode) {
    root.setAttribute("data-theme", mode);
    btn.textContent = mode === "dark" ? "☀️ Lys tilstand" : "🌙 Mørk tilstand";
    btn.setAttribute("aria-pressed", mode === "light");
  }
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}
  apply(saved === "light" ? "light" : "dark");
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  // Cards fade in once as they enter the screen
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }
})();

// ---------- Popup til videoer og opslag ----------
(function () {
  var lb = document.getElementById("lightbox");
  if (!lb) return;

  var lbMedia = lb.querySelector(".lb-media");
  var lbText = lb.querySelector(".lb-text");
  var lbLink = lb.querySelector(".lb-link");

  function closeLb() {
    lb.hidden = true;
    lbMedia.innerHTML = ""; // stopper videoen
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open]").forEach(function (card) {
    var preview = card.querySelector("video");

    // lydløs preview ved hover
    if (preview) {
      card.addEventListener("mouseenter", function () {
        preview.play().catch(function () {});
      });
      card.addEventListener("mouseleave", function () {
        preview.pause();
        preview.currentTime = 0.5;
      });
    }

    card.addEventListener("click", function () {
      var d = card.dataset;
      lbMedia.innerHTML = d.type === "video" ? '<video src="' + d.src + '" controls autoplay playsinline></video>' : '<img src="' + d.src + '" alt="">';
      lbText.textContent = d.text;
      lbLink.hidden = !d.link || d.link === "#";
      lbLink.href = d.link;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lb-close")) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });
})();
