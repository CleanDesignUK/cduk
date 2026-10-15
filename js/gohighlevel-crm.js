
/* ==========================================================
   CLEAN DESIGN UK
   GOHIGHLEVEL CRM SUPPORT PAGE
   /js/gohighlevel-crm.js
========================================================== */

(function () {
  "use strict";

  function init() {
    initServiceTabs();
    initScrollReveals();
    initEnquiryForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


  /* ========================================================
     01. INTERACTIVE GOHIGHLEVEL SERVICES
  ======================================================== */

  function initServiceTabs() {
    const tabList = document.querySelector(
      ".gh-build-tabs"
    );

    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll(".gh-build-tab")
    );

    const panels = Array.from(
      document.querySelectorAll(".gh-build-panel")
    );

    if (!tabs.length || !panels.length) return;

    function activateTab(selectedTab, focus = false) {
      const selectedName = selectedTab.dataset.ghTab;

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
        panel.hidden =
          panel.dataset.ghPanel !== selectedName;
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
        activateTab(tabs[nextIndex], true);
      });
    });

    const initiallyActive =
      tabs.find(tab => tab.classList.contains("is-active"))
      || tabs[0];

    activateTab(initiallyActive);
  }


  /* ========================================================
     02. SCROLL REVEAL ANIMATIONS
  ======================================================== */

  function initScrollReveals() {
    const page = document.querySelector(".gh-page");

    if (!page) return;

    const elements = Array.from(
      page.querySelectorAll(
        [
          ".gh-capability",
          ".gh-business-grid article",
          ".gh-why-list article",
          ".gh-process-grid article",
          ".gh-journey-track article"
        ].join(",")
      )
    );

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    elements.forEach(element => {
      element.classList.add("gh-observe");
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 50px 0px"
      }
    );

    elements.forEach(element => {
      observer.observe(element);
    });

    page.classList.add("gh-motion-ready");
  }


  /* ========================================================
     03. ENQUIRY FORM
  ======================================================== */

  function initEnquiryForm() {
    const form = document.getElementById(
      "gh-enquiry-form"
    );

    if (!form) return;

    const button = form.querySelector(
      'button[type="submit"]'
    );

    const status = document.getElementById(
      "gh-form-status"
    );

    const phone = document.getElementById(
      "gh-phone"
    );

    const pageUrl = form.querySelector(
      'input[name="page_url"]'
    );

    const honeypot = form.querySelector(
      'input[name="botcheck"]'
    );

    const originalText = button
      ? button.textContent.trim()
      : "Send my GoHighLevel enquiry";

    if (pageUrl) {
      pageUrl.value = window.location.href;
    }

    function showStatus(message, type = "") {
      if (!status) return;

      status.textContent = message;
      status.classList.remove(
        "is-error",
        "is-success"
      );

      if (type) {
        status.classList.add("is-" + type);
      }
    }

    function validUKPhone(value) {
      const digits = value.replace(/\D/g, "");

      return (
        /^0\d{9,10}$/.test(digits) ||
        /^44\d{10}$/.test(digits) ||
        /^0044\d{10}$/.test(digits)
      );
    }

    if (phone) {
      phone.addEventListener("input", () => {
        phone.setCustomValidity("");
      });
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();

      showStatus("");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (phone && !validUKPhone(phone.value.trim())) {
        phone.setCustomValidity(
          "Please enter a valid UK phone number."
        );
        phone.reportValidity();
        return;
      }

      if (honeypot && honeypot.value.trim() !== "") {
        showStatus(
          "Your enquiry could not be submitted. Please try again.",
          "error"
        );
        return;
      }

      if (!button) return;

      button.disabled = true;
      button.textContent = "Sending enquiry...";

      try {
        const formData = new FormData(form);

        const response = await fetch(
          form.action,
          {
            method: "POST",
            body: formData,
            headers: {
              "Accept": "application/json"
            }
          }
        );

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(
            result.message ||
            "The enquiry could not be submitted."
          );
        }

        showStatus(
          "Thank you. Your enquiry has been submitted successfully.",
          "success"
        );

        form.reset();

        if (pageUrl) {
          pageUrl.value = window.location.href;
        }

      } catch (error) {
        showStatus(
          "Sorry, your enquiry could not be sent. Please email jesse@cleandesignuk.com or contact us on WhatsApp.",
          "error"
        );
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

})();
