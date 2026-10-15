
/* ==========================================================
   CLEAN DESIGN UK
   SALES FUNNELS & AUTOMATION

   /js/sales-funnels-automation.js

   Page-specific interactions only.
========================================================== */

(function () {
  "use strict";

  function initialisePage() {
    initialiseServiceAccordion();
    initialiseUseCaseTabs();
    initialiseScrollAnimations();
    initialiseFaqSchema();
    initialiseFormContext();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialisePage
    );
  } else {
    initialisePage();
  }


  /* ========================================================
     01. SERVICES ACCORDION
  ========================================================= */

  function initialiseServiceAccordion() {
    const accordion = document.querySelector(
      ".sf-service-accordion"
    );

    if (!accordion) return;

    const items = Array.from(
      accordion.querySelectorAll(
        ".sf-service-item"
      )
    );

    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;

        items.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      });
    });
  }


  /* ========================================================
     02. INTERACTIVE INDUSTRY TABS
  ========================================================= */

  function initialiseUseCaseTabs() {
    const tabList = document.querySelector(
      ".sf-usecase-tabs"
    );

    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll(
        ".sf-usecase-tab"
      )
    );

    const panels = Array.from(
      document.querySelectorAll(
        ".sf-usecase-panel"
      )
    );

    if (!tabs.length || !panels.length) return;

    function activateTab(selectedTab, moveFocus = false) {
      const selectedId = selectedTab.dataset.sfTab;

      tabs.forEach(tab => {
        const active = tab === selectedTab;

        tab.classList.toggle("is-active", active);

        tab.setAttribute(
          "aria-selected",
          String(active)
        );

        tab.tabIndex = active ? 0 : -1;
      });

      panels.forEach(panel => {
        const active =
          panel.dataset.sfPanel === selectedId;

        panel.hidden = !active;
      });

      if (moveFocus) {
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
            nextIndex =
              (index - 1 + tabs.length) % tabs.length;
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

        activateTab(
          tabs[nextIndex],
          true
        );
      });
    });
  }


  /* ========================================================
     03. SCROLL ANIMATIONS
  ========================================================= */

  function initialiseScrollAnimations() {
    const page = document.querySelector(".sf-page");

    if (!page) return;

    const elements = Array.from(
      page.querySelectorAll(".sf-reveal")
    );

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

          entry.target.classList.add("sf-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 45px 0px"
      }
    );

    elements.forEach(element => {
      observer.observe(element);
    });

    page.classList.add("sf-motion-ready");
  }


  /* ========================================================
     04. FAQ STRUCTURED DATA

     Generates JSON-LD directly from the FAQ content.

     This helps keep question/answer schema consistent
     with the visible page.

     Search engines determine rich-result eligibility.
  ========================================================= */

  function initialiseFaqSchema() {
    const faqList = document.querySelector(
      ".sf-faq-list"
    );

    if (!faqList) return;

    const existing = document.querySelector(
      'script[data-sf-faq-schema="true"]'
    );

    if (existing) return;

    const questions = [];

    const faqItems = faqList.querySelectorAll("details");

    faqItems.forEach(item => {
      const summary = item.querySelector("summary");
      const paragraph = item.querySelector("p");

      if (!summary || !paragraph) return;

      const question = summary.textContent
        .replace(/\s+/g, " ")
        .trim();

      const answer = paragraph.textContent
        .replace(/\s+/g, " ")
        .trim();

      if (!question || !answer) return;

      questions.push({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer
        }
      });
    });

    if (!questions.length) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id":
        "https://cleandesignuk.com/html/sales-funnels-automation-north-wales.html#faq-schema",
      "url":
        "https://cleandesignuk.com/html/sales-funnels-automation-north-wales.html",
      "inLanguage": "en-GB",
      "mainEntity": questions
    };

    const script = document.createElement("script");

    script.type = "application/ld+json";

    script.setAttribute(
      "data-sf-faq-schema",
      "true"
    );

    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
  }


  /* ========================================================
     05. ENQUIRY FORM CONTEXT

     Actual validation and Web3Forms submission remain
     handled by /js/forms.js.

     Do not create a second submit handler here.
  ========================================================= */

  function initialiseFormContext() {
    const form = document.querySelector(
      ".sf-form-card form[data-lead-form]"
    );

    if (!form) return;

    const pageField = form.querySelector(
      'input[name="page_url"]'
    );

    if (pageField) {
      pageField.value = window.location.href;
    }
  }

})();
