
/* ===========================================================
   CLEAN DESIGN UK
   SEO & SEARCH VISIBILITY

   /js/seo-search-visibility.js

   Page-specific interactions only.
=========================================================== */

(function () {
  "use strict";

  function init() {
    initialiseSearchTabs();
    initialiseScrollReveals();
    initialiseFaqSchema();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


  /* =======================================================
     01 INTERACTIVE SEARCH FOCUS TABS
  ======================================================== */

  function initialiseSearchTabs() {
    const tabList = document.querySelector(".sv-focus-tabs");

    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll(".sv-focus-tab")
    );

    const panels = Array.from(
      document.querySelectorAll(".sv-focus-panel")
    );

    if (!tabs.length || !panels.length) return;

    function activateTab(selectedTab, focus = false) {
      const selected = selectedTab.dataset.svTab;

      tabs.forEach(tab => {
        const active = tab === selectedTab;

        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      panels.forEach(panel => {
        panel.hidden = panel.dataset.svPanel !== selected;
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


  /* =======================================================
     02 SCROLL REVEALS

     Content remains visible when JavaScript is unavailable
     or reduced motion is preferred.
  ======================================================== */

  function initialiseScrollReveals() {
    const elements = document.querySelectorAll(
      ".sv-page .sv-reveal"
    );

    if (!elements.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("sv-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px 35px 0px"
      }
    );

    elements.forEach(element => {
      observer.observe(element);
    });

    document.querySelector(".sv-page")
      .classList.add("sv-motion-ready");
  }


  /* =======================================================
     03 FAQ STRUCTURED DATA

     Generate structured data from actual visible FAQ
     text so the schema stays consistent with the page.

     FAQ markup does not guarantee FAQ rich results.
  ======================================================== */

  function initialiseFaqSchema() {
    const list = document.querySelector(".sv-faq-items");

    if (!list) return;

    if (
      document.querySelector(
        'script[data-sv-faq-schema="true"]'
      )
    ) {
      return;
    }

    const questions = [];

    list.querySelectorAll("details").forEach(details => {
      const summary = details.querySelector("summary");
      const answer = details.querySelector("p");

      if (!summary || !answer) return;

      const questionText = summary.textContent
        .replace(/\s+/g, " ")
        .trim();

      const answerText = answer.textContent
        .replace(/\s+/g, " ")
        .trim();

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
      "@id": "https://cleandesignuk.com/html/seo-agency-north-wales.html#faq-schema",
      "url": "https://cleandesignuk.com/html/seo-agency-north-wales.html",
      "inLanguage": "en-GB",
      "mainEntity": questions
    };

    const script = document.createElement("script");

    script.type = "application/ld+json";

    script.setAttribute(
      "data-sv-faq-schema",
      "true"
    );

    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
  }

})();
