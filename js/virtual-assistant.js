
/* ==========================================================
   CLEAN DESIGN UK
   VIRTUAL ASSISTANT SERVICES

   File: /js/virtual-assistant.js
========================================================== */

(function () {
  "use strict";

  function init() {
    initDelegationPlanner();
    initEnquiryForm();
    initScrollAnimations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


  /* ========================================================
     01. DELEGATION PLANNER
  ======================================================== */

  function initDelegationPlanner() {
    const checkboxes = Array.from(
      document.querySelectorAll("[data-va-task]")
    );

    const countElement = document.getElementById(
      "va-selected-count"
    );

    const headingElement = document.getElementById(
      "va-result-heading"
    );

    const descriptionElement = document.getElementById(
      "va-result-description"
    );

    const listElement = document.getElementById(
      "va-selected-list"
    );

    const addButton = document.getElementById(
      "va-add-to-enquiry"
    );

    const messageField = document.getElementById(
      "va-message"
    );

    const serviceField = document.getElementById(
      "va-service"
    );

    if (
      !checkboxes.length ||
      !countElement ||
      !headingElement ||
      !descriptionElement ||
      !listElement ||
      !addButton
    ) {
      return;
    }

    const generatedStart =
      "Tasks selected using the delegation planner:";

    const generatedEnd =
      "End of selected tasks.";

    function getSelectedTasks() {
      return checkboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    }

    function updatePlanner() {
      const selected = getSelectedTasks();
      const count = selected.length;

      countElement.textContent =
        count + " selected";

      listElement.replaceChildren();

      selected.forEach(task => {
        const chip = document.createElement("span");
        chip.textContent = task;
        listElement.appendChild(chip);
      });

      if (count === 0) {
        headingElement.textContent =
          "Start with what's taking up your time.";

        descriptionElement.textContent =
          "Select a few tasks on the left. " +
          "We'll help you turn them into a manageable " +
          "starting plan without taking on more " +
          "support than you need.";

      } else if (count === 1) {
        headingElement.textContent =
          "One task is a good place to start.";

        descriptionElement.textContent =
          "You don't need to delegate everything at once. " +
          "We can discuss this priority, your workload " +
          "and a suitable level of support.";

      } else if (count <= 3) {
        headingElement.textContent =
          "You've identified your first priorities.";

        descriptionElement.textContent =
          "These could form the starting point of an " +
          "agreed support plan. We'll discuss which " +
          "tasks should come first and how much " +
          "time may be required.";

      } else {
        headingElement.textContent =
          "You may benefit from wider admin support.";

        descriptionElement.textContent =
          "There's no need to tackle everything " +
          "immediately. We can help you prioritise " +
          "the most important tasks and review " +
          "what fits your budget.";
      }

      addButton.disabled = count === 0;
    }

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener(
        "change",
        updatePlanner
      );
    });

    addButton.addEventListener("click", () => {
      const selected = getSelectedTasks();

      if (!selected.length || !messageField) {
        return;
      }

      const generatedText =
        generatedStart +
        "\n" +
        selected.map(task => "- " + task).join("\n") +
        "\n" +
        generatedEnd;

      let existingText = messageField.value;

      const previousStart =
        existingText.indexOf(generatedStart);

      const previousEnd =
        existingText.indexOf(generatedEnd);

      if (
        previousStart !== -1 &&
        previousEnd !== -1 &&
        previousEnd >= previousStart
      ) {
        existingText = (
          existingText.slice(0, previousStart) +
          existingText.slice(
            previousEnd + generatedEnd.length
          )
        ).trim();
      }

      messageField.value =
        generatedText +
        (existingText ? "\n\n" + existingText : "\n\n");

      if (serviceField && !serviceField.value) {
        const serviceMap = {
          "Email and inbox management":
            "Email and inbox management",

          "Diary and appointment scheduling":
            "Diary and appointment management",

          "Customer enquiries and customer service admin":
            "Customer service administration",

          "Sales leads and CRM administration":
            "Sales and lead administration",

          "HR and recruitment administration":
            "HR and recruitment administration",

          "Documents, spreadsheets and general administration":
            "Documents and data entry",

          "Invoice and payment administration":
            "Invoice and business administration",

          "Marketing and social media administration":
            "Marketing administration"
        };

        const option =
          selected.length === 1
            ? serviceMap[selected[0]]
            : "Multiple tasks / Not sure yet";

        if (option) {
          serviceField.value = option;
        }
      }

      const contactSection =
        document.getElementById("va-contact");

      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }

      window.setTimeout(() => {
        messageField.focus({
          preventScroll: true
        });
      }, 200);
    });

    updatePlanner();
  }


  /* ========================================================
     02. VIRTUAL ASSISTANT ENQUIRY FORM
  ======================================================== */

  function initEnquiryForm() {
    const form = document.getElementById(
      "va-enquiry-form"
    );

    if (!form) return;

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    const statusElement = document.getElementById(
      "va-form-status"
    );

    const phoneField = document.getElementById(
      "va-phone"
    );

    const pageUrlField = form.querySelector(
      'input[name="page_url"]'
    );

    const honeypot = form.querySelector(
      'input[name="website_check"]'
    );

    if (!submitButton) return;

    const originalButtonText =
      submitButton.textContent.trim();

    if (pageUrlField) {
      pageUrlField.value = window.location.href;
    }

    function setStatus(message, type) {
      if (!statusElement) return;

      statusElement.textContent = message;

      statusElement.classList.remove(
        "is-error",
        "is-success"
      );

      if (type) {
        statusElement.classList.add("is-" + type);
      }
    }

    function isValidUKPhone(number) {
      const cleaned = number.replace(
        /[\s().-]/g,
        ""
      );

      return (
        /^0\d{10}$/.test(cleaned) ||
        /^\+44\d{10}$/.test(cleaned) ||
        /^0044\d{10}$/.test(cleaned)
      );
    }

    if (phoneField) {
      phoneField.addEventListener("input", () => {
        phoneField.setCustomValidity("");
      });
    }

    form.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();

        setStatus("", "");

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (
          phoneField &&
          !isValidUKPhone(phoneField.value.trim())
        ) {
          phoneField.setCustomValidity(
            "Please enter a valid UK phone number."
          );

          phoneField.reportValidity();
          return;
        }

        if (
          honeypot &&
          honeypot.value.trim() !== ""
        ) {
          setStatus(
            "Your enquiry could not be submitted.",
            "error"
          );
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent =
          "Sending your enquiry...";

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

          if (
            !response.ok ||
            result.success !== true
          ) {
            throw new Error(
              result.message ||
              "Form submission failed."
            );
          }

          setStatus(
            "Thank you. Your virtual assistant enquiry has been submitted successfully.",
            "success"
          );

          form.reset();

          if (pageUrlField) {
            pageUrlField.value = window.location.href;
          }

        } catch (error) {
          setStatus(
            "Sorry, we couldn't send your enquiry. " +
            "Please email jesse@cleandesignuk.com " +
            "or contact us on WhatsApp.",
            "error"
          );

        } finally {
          submitButton.disabled = false;
          submitButton.textContent =
            originalButtonText;
        }
      }
    );
  }


  /* ========================================================
     03. SUBTLE SCROLL REVEAL ANIMATIONS
  ======================================================== */

  function initScrollAnimations() {
    const page = document.querySelector(
      ".va-page"
    );

    if (!page) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const elements = Array.from(
      page.querySelectorAll(
        [
          ".va-problem-grid article",
          ".va-service-row",
          ".va-flexible-card",
          ".va-advantage-item",
          ".va-process-list article",
          ".va-industries-grid article"
        ].join(",")
      )
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px 45px 0px"
      }
    );

    elements.forEach(element => {
      element.classList.add(
        "va-reveal"
      );

      observer.observe(element);
    });

    page.classList.add(
      "va-motion-ready"
    );
  }

})();
