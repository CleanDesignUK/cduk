(() => {
  "use strict";

  function initFaq() {
    document.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = button.nextElementSibling;
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        if (answer) answer.style.maxHeight = isOpen ? "0px" : `${answer.scrollHeight}px`;
      });
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    const items = document.querySelectorAll("[data-reveal]");
    items.forEach((item) => item.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    items.forEach((item) => observer.observe(item));
  }

  function addRevealCss() {
    const style = document.createElement("style");
    style.textContent = `
      .reveal-ready{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
      .reveal-ready.is-visible{opacity:1;transform:none}
      @media(prefers-reduced-motion:reduce){.reveal-ready{opacity:1;transform:none}}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { initFaq(); addRevealCss(); initReveal(); }, { once: true });
  } else {
    initFaq(); addRevealCss(); initReveal();
  }
})();
