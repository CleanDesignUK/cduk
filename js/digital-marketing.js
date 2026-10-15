
/* ==========================================================
   CLEAN DESIGN UK
   DIGITAL MARKETING PAGE
   /js/digital-marketing.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initialiseMarketingTabs();
  initialiseProcessCarousel();
  initialiseScrollAnimations();
  initialiseFaqSchema();
});

/* ==========================================================
   INTERACTIVE MARKETING PANELS
========================================================== */

function initialiseMarketingTabs() {
  const tabList = document.querySelector(".dm-approach-tabs");

  if (!tabList) return;

  const tabs = Array.from(
    tabList.querySelectorAll(".dm-approach-tab")
  );

  const panels = Array.from(
    document.querySelectorAll(".dm-approach-panel")
  );

  if (!tabs.length || !panels.length) return;

  function activateTab(selectedTab, focus = false) {
    const selectedId = selectedTab.dataset.tab;

    tabs.forEach(tab => {
      const active = tab === selectedTab;

      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach(panel => {
      const active = panel.dataset.panel === selectedId;

      panel.hidden = !active;
    });

    if (focus) {
      selectedTab.focus();

      selectedTab.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", event => {
      let nextIndex = index;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (index + 1) % tabs.length;
          break;

        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (
            index - 1 + tabs.length
          ) % tabs.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = tabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();

      activateTab(tabs[nextIndex], true);
    });
  });
}

/* ==========================================================
   MOBILE PROCESS CAROUSEL
========================================================== */

function initialiseProcessCarousel() {
  const track = document.querySelector(".dm-process-track");

  const controls = document.querySelectorAll(
    ".dm-process-controls [data-scroll]"
  );

  if (!track || !controls.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  controls.forEach(button => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.scroll);

      const firstCard = track.querySelector(".dm-process-card");

      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;

      const gap = parseFloat(
        window.getComputedStyle(track).columnGap
      ) || 12;

      track.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: reducedMotion.matches ? "instant" : "smooth"
      });
    });
  });
}

/* ==========================================================
   SCROLL REVEAL ANIMATIONS
========================================================== */

function initialiseScrollAnimations() {
  const elements = document.querySelectorAll(".dm-reveal");

  if (!elements.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("dm-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });

  document.body.classList.add("dm-animations-ready");
}

/* ==========================================================
   FAQ STRUCTURED DATA

   Generates FAQPage markup from the visible FAQ content.
   This keeps structured answers consistent with the page.
   Search engines determine whether rich results are shown.
========================================================== */

function initialiseFaqSchema() {
  const faqSection = document.querySelector(".dm-faq-list");

  if (!faqSection) return;

  const questions = [];

  faqSection.querySelectorAll("details").forEach(item => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector("p");

    if (!summary || !answer) return;

    const questionText = summary.textContent.trim();
    const answerText = answer.textContent.trim();

    if (!questionText || !answerText) return;

    questions.push({
      "@type": "Question",
      "name": questionText,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answerText
      }
    });
  });

  if (!questions.length) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://cleandesignuk.com/html/digital-marketing-agency-north-wales.html#faqs",
    "url": "https://cleandesignuk.com/html/digital-marketing-agency-north-wales.html",
    "inLanguage": "en-GB",
    "mainEntity": questions
  };

  const script = document.createElement("script");

  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}
