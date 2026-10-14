
/* =====================================================
   CLEAN DESIGN UK — SHARED COMPONENTS
   File: /js/components.js
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  // Automatically add the floating WhatsApp slot.

  if (!document.getElementById("floating-whatsapp")) {
    const slot = document.createElement("div");
    slot.id = "floating-whatsapp";
    document.body.appendChild(slot);
  }

  const components = [
    {
      target: "#site-navbar",
      path: "/components/navbar.html"
    },
    {
      target: "#site-footer",
      path: "/components/footer.html"
    },
    {
      target: "#cookie-consent",
      path: "/components/cookie-banner.html"
    },
    {
      target: "#floating-whatsapp",
      path: "/components/floating-whatsapp.html"
    },
    {
      target: "#site-testimonials",
      path: "/components/testimonials.html"
    }
  ];

  await Promise.all(
    components.map(async ({ target, path }) => {

      const container = document.querySelector(target);

      if (!container) return;

      try {
        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(
            `Unable to load ${path}: HTTP ${response.status}`
          );
        }

        container.innerHTML = await response.text();

      } catch (error) {
        console.error("Component loading error:", error);
      }
    })
  );

  initialiseNavigation();
  initialiseSharedTestimonials();

  window.dispatchEvent(
    new Event("cduk:components-ready")
  );

});

/* =====================================================
   NAVIGATION
===================================================== */

function initialiseNavigation() {

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const services = document.querySelector(".nav-services");
  const servicesButton = document.querySelector(".services-toggle");

  if (!header) return;

  const closeMobileMenu = () => {
    header.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  const closeServices = () => {
    services?.classList.remove("open");
    servicesButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = header.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  servicesButton?.addEventListener("click", () => {
    if (!services) return;

    const isOpen = services.classList.toggle("open");
    servicesButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", event => {
    if (!services?.contains(event.target)) {
      closeServices();
    }
  });

  document.querySelectorAll(".nav-main a").forEach(link => {
    link.addEventListener("click", () => {
      closeMobileMenu();
      closeServices();
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    closeMobileMenu();
    closeServices();
  });
}

/* =====================================================
   SHARED TESTIMONIAL CAROUSEL
===================================================== */

function initialiseSharedTestimonials() {

  document.querySelectorAll(".cduk-reviews").forEach(section => {

    // Prevent registering the same handlers twice.
    if (section.dataset.carouselReady === "true") return;
    section.dataset.carouselReady = "true";

    const track = section.querySelector(".cduk-reviews-track");
    const prev = section.querySelector(".cduk-review-prev");
    const next = section.querySelector(".cduk-review-next");

    if (!track || !prev || !next) return;

    const getCardWidth = () => {
      const card = track.querySelector(".cduk-review-card");

      if (!card) return 350;

      const gap = parseFloat(getComputedStyle(track).gap) || 0;

      return card.getBoundingClientRect().width + gap;
    };

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;

      prev.disabled = track.scrollLeft <= 2;

      next.disabled = track.scrollLeft >= maxScroll - 2;
    };

    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -getCardWidth(),
        behavior: "smooth"
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: getCardWidth(),
        behavior: "smooth"
      });
    });

    track.addEventListener(
      "scroll",
      updateControls,
      { passive: true }
    );

    window.addEventListener("resize", updateControls);

    updateControls();
  });
}
