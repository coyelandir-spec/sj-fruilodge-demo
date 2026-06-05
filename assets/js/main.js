/* S&J FRUI'LODGE — interactions */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WHATSAPP = "261374901977"; // numéro principal (Mvola / WhatsApp)

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
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // Année du pied de page
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // Formulaires → ouvre WhatsApp avec le message pré-rempli
  const form = document.querySelector("#reservation-form");
  if (form) {
    const success = form.querySelector(".form__success");
    const isEN = (document.documentElement.lang || "fr").toLowerCase().startsWith("en");
    const isContact = form.dataset.kind === "contact";
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const lines = [];
      form.querySelectorAll(".field").forEach((f) => {
        const ctrl = f.querySelector("input, select, textarea");
        const label = f.querySelector("label");
        if (ctrl && ctrl.value && ctrl.value.trim()) {
          lines.push((label ? label.textContent.trim() : (ctrl.name || "")) + " : " + ctrl.value.trim());
        }
      });
      const intro = isEN
        ? (isContact ? "Hello, I'm writing via your website:" : "Hello, I'd like to make a booking at S&J FRUI'LODGE:")
        : (isContact ? "Bonjour, je vous écris via votre site web :" : "Bonjour, je souhaite faire une réservation chez S&J FRUI'LODGE :");
      const msg = intro + "\n\n" + lines.join("\n");
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank");
      if (success) { success.style.display = "block"; success.scrollIntoView({ behavior: "smooth", block: "center" }); }
      const btn = form.querySelector("button[type=submit]");
      if (btn) btn.textContent = isEN ? "Opening WhatsApp…" : "Ouverture de WhatsApp…";
    });
  }
})();
