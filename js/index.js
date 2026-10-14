
/**
 * Clean Design UK
 * Homepage JavaScript
 *
 * - Scroll reveal animations
 * - Desktop portfolio stack spreading
 * - Mobile portfolio swipe and arrows
 * - Other mobile carousels
 * - FAQ accordion
 */

document.addEventListener("DOMContentLoaded", () => {
  initialiseRevealAnimations();
  initialiseHeroGallery();
  initialiseCarousels();
  initialiseFAQ();
});

/* ============================================
   SCROLL REVEALS
============================================ */

function initialiseRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("is-visible"));
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
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  elements.forEach(element => observer.observe(element));
}

/* ============================================
   HERO GALLERY — DESKTOP SCROLL SPREAD
============================================ */

function initialiseHeroGallery() {
  const gallery = document.querySelector("#heroGallery");
  const track = document.querySelector("#heroGalleryTrack");

  if (!gallery || !track) return;

  const cards = Array.from(
    track.querySelectorAll(".hero-gallery-card")
  );

  const previous = document.querySelector("#heroGalleryPrev");
  const next = document.querySelector("#heroGalleryNext");

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let frameRequested = false;

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  const interpolate = (start, end, progress) =>
    start + (end - start) * progress;

  function updateDesktopGallery() {
    frameRequested = false;

    if (mobileQuery.matches) {
      cards.forEach(card => {
        card.style.removeProperty("--gallery-x");
        card.style.removeProperty("--gallery-y");
        card.style.removeProperty("--gallery-rotation");
        card.style.removeProperty("--gallery-scale");
      });
      return;
    }

    const rect = gallery.getBoundingClientRect();

    /*
      0 = cards fully stacked
      1 = cards spread across the screen

      Progress advances as the user scrolls
      through the gallery section.
    */
    const scrollDistance = Math.max(
      250,
      rect.height - 490
    );

    const rawProgress = (
      window.innerHeight * 0.72 - rect.top
    ) / scrollDistance;

    const progress = reducedMotion.matches
      ? 1
      : clamp(rawProgress, 0, 1);

    /* Smooth easing */
    const eased =
      progress * progress * (3 - 2 * progress);

    const spacing = Math.min(
      275,
      window.innerWidth * 0.17
    );

    const centre = (cards.length - 1) / 2;

    cards.forEach((card, index) => {
      const position = index - centre;
      const distance = Math.abs(position);

      /* Slightly visible edges in the stack */
      const startingX = position * 42;
      const endingX = position * spacing;

      const startingY = distance * 22;
      const endingY = distance * 13;

      const startingRotation = position * 5;
      const endingRotation = position * 3;

      const startingScale = 1 - distance * 0.045;
      const endingScale = 1;

      const x = interpolate(startingX, endingX, eased);
      const y = interpolate(startingY, endingY, eased);
      const rotation = interpolate(
        startingRotation,
        endingRotation,
        eased
      );
      const scale = interpolate(
        startingScale,
        endingScale,
        eased
      );

      card.style.setProperty("--gallery-x", `${x}px`);
      card.style.setProperty("--gallery-y", `${y}px`);
      card.style.setProperty(
        "--gallery-rotation",
        `${rotation}deg`
      );
      card.style.setProperty("--gallery-scale", scale);
    });
  }

  function requestGalleryUpdate() {
    if (frameRequested) return;

    frameRequested = true;
    requestAnimationFrame(updateDesktopGallery);
  }

  /* ========================================
     MOBILE SWIPE NAVIGATION
  ======================================== */

  function updateMobileButtons() {
    if (!mobileQuery.matches) return;

    const maximum = track.scrollWidth - track.clientWidth;

    if (previous) {
      previous.disabled = track.scrollLeft <= 2;
    }

    if (next) {
      next.disabled = track.scrollLeft >= maximum - 2;
    }
  }

  function moveGallery(direction) {
    const card = cards[0];
    if (!card) return;

    const gap = parseFloat(
      getComputedStyle(track).gap
    ) || 17;

    const width = card.getBoundingClientRect().width;

    track.scrollBy({
      left: direction * (width + gap),
      behavior: reducedMotion.matches ? "instant" : "smooth"
    });
  }

  previous?.addEventListener("click", () => {
    moveGallery(-1);
  });

  next?.addEventListener("click", () => {
    moveGallery(1);
  });

  track.addEventListener("scroll", updateMobileButtons, {
    passive: true
  });

  window.addEventListener("scroll", requestGalleryUpdate, {
    passive: true
  });

  window.addEventListener("resize", () => {
    requestGalleryUpdate();
    updateMobileButtons();
  });

  mobileQuery.addEventListener("change", () => {
    requestGalleryUpdate();
    updateMobileButtons();
  });

  updateDesktopGallery();
  updateMobileButtons();
}

/* ============================================
   OTHER MOBILE CAROUSELS
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
      const firstCard = carousel.firstElementChild;
      if (!firstCard) return;

      const width = firstCard.getBoundingClientRect().width;
      const gap = parseFloat(
        getComputedStyle(carousel).gap
      ) || 16;

      carousel.scrollBy({
        left: direction * (width + gap),
        behavior: "smooth"
      });
    }

    function updateButtons() {
      const maxScroll =
        carousel.scrollWidth - carousel.clientWidth;

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
