
/**
 * Clean Design UK
 * Homepage interactions
 *
 * 1. Scroll reveal animations
 * 2. Horizontal card navigation on mobile
 * 3. FAQ accordion
 */

document.addEventListener("DOMContentLoaded", () => {
  initialiseRevealAnimations();
  initialiseCarousels();
  initialiseFAQ();
});

/* ============================================
   SCROLL ANIMATIONS
============================================ */

function initialiseRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.06,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}

/* ============================================
   MOBILE CAROUSELS
============================================ */

function initialiseCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach(carousel => {
    const controls = carousel.nextElementSibling;

    if (!controls?.classList.contains("carousel-controls")) {
      return;
    }

    const previous = controls.querySelector("[data-prev]");
    const next = controls.querySelector("[data-next]");

    function move(direction) {
      const card = carousel.firstElementChild;
      if (!card) return;

      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(carousel).gap) || 16;

      carousel.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: "smooth"
      });
    }

    function updateButtons() {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      if (previous) {
        previous.disabled = carousel.scrollLeft <= 2;
      }

      if (next) {
        next.disabled = carousel.scrollLeft >= maxScroll - 2;
      }
    }

    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));

    carousel.addEventListener("scroll", updateButtons, {
      passive: true
    });

    window.addEventListener("resize", updateButtons);

    updateButtons();
  });
}

/* ============================================
   FAQ ACCORDION
============================================ */

function initialiseFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      items.forEach(other => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
}
