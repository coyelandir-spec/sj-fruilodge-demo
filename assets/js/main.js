/* S&J FRUI'LODGE — interactions de la démo */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // --- En-tête : style au défilement ---
  const nav = document.querySelector(".nav");
  const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Menu mobile ---
  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
  }

  // --- Apparitions au défilement (staggerées) ---
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Inclinaison 3D + reflet lumineux (cartes & encadrés) ---
  if (fine && !reduce) {
    const tiltables = document.querySelectorAll(".card, .media-box");
    const MAX = 8; // degrés
    tiltables.forEach((el) => {
      el.addEventListener("mousemove", (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;   // 0..1
        const py = (ev.clientY - r.top) / r.height;   // 0..1
        const ry = (px - 0.5) * (MAX * 2);
        const rx = (0.5 - py) * (MAX * 2);
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-8px)`;
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  // --- Parallaxe du héro à la souris ---
  const hero = document.querySelector(".hero");
  const heroInner = document.querySelector(".hero__inner");
  if (hero && heroInner && fine && !reduce) {
    let raf = null, tx = 0, ty = 0;
    hero.addEventListener("mousemove", (ev) => {
      const r = hero.getBoundingClientRect();
      tx = ((ev.clientX - r.left) / r.width - 0.5);
      ty = ((ev.clientY - r.top) / r.height - 0.5);
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
    function apply() {
      raf = null;
      heroInner.style.transform = `translate3d(${tx * -20}px, ${ty * -14}px, 0)`;
    }
  }

  // --- Année du pied de page ---
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // --- Simulation des formulaires (DÉMO, aucun paiement réel) ---
  const form = document.querySelector("#reservation-form");
  if (form) {
    const success = form.querySelector(".form__success");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (success) { success.style.display = "block"; success.scrollIntoView({ behavior: "smooth", block: "center" }); }
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.textContent = "Demande envoyée ✓";
    });
  }
})();
