/* ============================================================
   FSHTS — shared site interactions
   nav · reveal-on-scroll · counters · 3D tilt · gallery · form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- navigation ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = nav.querySelector(".nav__burger");
    if (burger) {
      burger.addEventListener("click", function () {
        nav.classList.toggle("open");
        document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
      });
      nav.querySelectorAll(".nav__mobile a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("open");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 3D tilt cards ---------- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var glare = card.querySelector(".tilt__glare");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 10;
        var ry = (px - 0.5) * 12;
        card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
        if (glare) {
          glare.style.setProperty("--gx", px * 100 + "%");
          glare.style.setProperty("--gy", py * 100 + "%");
        }
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- gallery filters ---------- */
  var filterBtns = document.querySelectorAll(".gal-filters button");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        document.querySelectorAll(".gal-item").forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-cat") === cat;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var stage = lightbox.querySelector(".lightbox__stage");
    var cap = lightbox.querySelector(".lightbox__cap");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gal-item"));
    var current = 0;

    function openLb(item) {
      current = items.indexOf(item);
      renderLb();
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function renderLb() {
      var item = items[current];
      var cat = item.getAttribute("data-cat");
      var old = stage.querySelector("svg"), oldImg = stage.querySelector("img");
      if (old) old.remove();
      if (oldImg) oldImg.remove();
      var src = item.querySelector("svg.ph");
      var imgEl = item.querySelector("img");
      var node;
      if (imgEl) {
        node = document.createElement("img");
        node.src = imgEl.src;
        node.alt = item.getAttribute("data-caption") || "";
        node.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:inherit;";
      } else if (src) {
        node = src.cloneNode(true);
        node.style.width = "22%";
      }
      if (node) stage.insertBefore(node, cap);
      stage.setAttribute("data-cat", cat);
      cap.textContent = item.getAttribute("data-caption") || "";
    }
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    function moveLb(d) {
      current = (current + d + items.length) % items.length;
      renderLb();
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () { openLb(item); });
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLb);
    lightbox.querySelector(".lightbox__btn--prev").addEventListener("click", function () { moveLb(-1); });
    lightbox.querySelector(".lightbox__btn--next").addEventListener("click", function () { moveLb(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") moveLb(-1);
      if (e.key === "ArrowRight") moveLb(1);
    });
  }

  /* ---------- contact form (demo handler) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector(".form-success");
      if (ok) ok.classList.add("show");
      form.reset();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
