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

  // Bouton WhatsApp flottant (moderne, sur toutes les pages)
  if (!document.querySelector(".float-wa")) {
    const wa = document.createElement("a");
    wa.className = "float-wa";
    wa.href = "https://wa.me/261374901977";
    wa.target = "_blank"; wa.rel = "noopener";
    wa.setAttribute("aria-label", "Nous écrire sur WhatsApp");
    wa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.299-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
    document.body.appendChild(wa);
  }

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
