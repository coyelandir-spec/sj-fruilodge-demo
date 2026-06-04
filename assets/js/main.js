/* S&J FRUI'LODGE — interactions (sobres) */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // En-tête : fond au défilement
  const nav = document.querySelector(".nav");
  const onScroll = () => { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
  }

  // Apparitions douces au défilement
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // Année du pied de page
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // Formulaires (démo, sans envoi réel)
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
