
/* ==============================================
   CLEAN DESIGN UK
   ABOUT PAGE INTERACTIONS
   /js/about.js
============================================== */

document.addEventListener("DOMContentLoaded", () => {
  initialiseReviewCarousel();
});

function initialiseReviewCarousel() {
  const track = document.getElementById("aboutReviewsCarousel");
  const previous = document.getElementById("reviewsPrev");
  const next = document.getElementById("reviewsNext");

  if (!track || !previous || !next) return;

  const getScrollDistance = () => {
    const card = track.querySelector(".about-review-card");

    if (!card) return 350;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    return card.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    const maximumScroll = track.scrollWidth - track.clientWidth;

    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maximumScroll - 2;
  };

  previous.addEventListener("click", () => {
    track.scrollBy({
      left: -getScrollDistance(),
      behavior: "smooth"
    });
  });

  next.addEventListener("click", () => {
    track.scrollBy({
      left: getScrollDistance(),
      behavior: "smooth"
    });
  });

  track.addEventListener("scroll", updateButtons, { passive: true });

  window.addEventListener("resize", updateButtons);

  updateButtons();
}
