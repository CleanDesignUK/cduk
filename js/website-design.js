
/* ============================================================
   CLEAN DESIGN UK
   WEBSITE DESIGN PAGE

   File: /js/website-design.js
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initialiseScrollAnimations();
  initialiseWebsiteProcess();
  initialiseWebsiteForm();
});

/* ============================================================
   SCROLL ANIMATIONS
============================================================ */

function initialiseScrollAnimations() {

  const elements = document.querySelectorAll("[data-reveal]");

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

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });

  document.body.classList.add("wd-animations-ready");
}

/* ============================================================
   INTERACTIVE WEBSITE DESIGN PROCESS
============================================================ */

function initialiseWebsiteProcess() {

  const container = document.getElementById("wdProcessTabs");

  if (!container) return;

  const buttons = Array.from(
    container.querySelectorAll("[data-wd-step]")
  );

  const title = document.getElementById("wdProcessTitle");
  const description = document.getElementById("wdProcessDescription");
  const label = document.getElementById("wdProcessLabel");
  const progress = document.getElementById("wdProcessProgress");

  if (!buttons.length || !title || !description) return;

  const steps = [
    {
      title: "Consultation & Planning",
      label: "DISCOVERY",
      description:
        "We discuss your business, target customers, current website and project requirements before agreeing the most suitable approach."
    },
    {
      title: "Content & Structure",
      label: "PLANNING",
      description:
        "We plan the site's navigation, page structure, headings, content and functionality. Where relevant, we consider suitable SEO keywords, search intent and internal links."
    },
    {
      title: "Design & Development",
      label: "DEVELOPMENT",
      description:
        "We create the agreed layouts, develop the responsive website and implement the required functionality, considering usability across different devices."
    },
    {
      title: "Testing & Launch",
      label: "LAUNCH",
      description:
        "We complete the agreed checks for navigation, forms, responsiveness and technical setup before preparing the website for launch."
    }
  ];

  function activateStep(index) {

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= steps.length
    ) {
      return;
    }

    const step = steps[index];

    buttons.forEach((button, buttonIndex) => {

      const isActive = buttonIndex === index;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

    });

    title.textContent = step.title;
    description.textContent = step.description;

    if (label) {
      label.textContent = step.label;
    }

    if (progress) {
      progress.style.width =
        `${((index + 1) / steps.length) * 100}%`;
    }
  }

  buttons.forEach((button, index) => {

    button.addEventListener("click", () => {
      activateStep(index);
    });

    button.addEventListener("keydown", event => {

      const nextKeys = ["ArrowDown", "ArrowRight"];
      const previousKeys = ["ArrowUp", "ArrowLeft"];

      if (
        !nextKeys.includes(event.key) &&
        !previousKeys.includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      const direction = nextKeys.includes(event.key) ? 1 : -1;

      const nextIndex =
        (index + direction + buttons.length) % buttons.length;

      buttons[nextIndex].focus();
      activateStep(nextIndex);

    });

  });

  activateStep(0);
}

/* ============================================================
   FORM VALIDATION
============================================================ */

function normaliseUKPhone(value) {
  return value.replace(/[\s().-]/g, "");
}

function validateUKPhone(value) {

  const phone = normaliseUKPhone(value);

  // General UK national telephone number check.
  // Includes standard geographic, mobile and
  // common non-geographic numbers.

  return /^(?:(?:\+44|0044)0?|0)[1235789]\d{8,9}$/.test(phone);
}

function validateEmail(value) {

  const email = value.trim();

  if (email.length > 254) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function setFormStatus(form, message, state = "error") {

  const status = form.querySelector(".wd-form-status");

  if (!status) return;

  status.textContent = message;
  status.dataset.state = state;
}

/* ============================================================
   WEB3FORMS CONSULTATION FORM
============================================================ */

function initialiseWebsiteForm() {

  const form = document.querySelector("[data-wd-form]");

  if (!form) return;

  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const phone = form.querySelector('[name="phone"]');
  const service = form.querySelector('[name="service"]');
  const honeypot = form.querySelector('[name="botcheck"]');
  const submitButton = form.querySelector('[type="submit"]');

  if (!name || !email || !phone || !service || !submitButton) {
    return;
  }

  const loadedAt = Date.now();

  email.addEventListener("input", () => {
    email.setCustomValidity("");
  });

  phone.addEventListener("input", () => {
    phone.setCustomValidity("");
  });

  email.addEventListener("blur", () => {

    if (!email.value.trim()) return;

    email.setCustomValidity(
      validateEmail(email.value)
        ? ""
        : "Please enter a valid email address."
    );
  });

  phone.addEventListener("blur", () => {

    if (!phone.value.trim()) return;

    phone.setCustomValidity(
      validateUKPhone(phone.value)
        ? ""
        : "Please enter a valid UK telephone number."
    );
  });

  form.addEventListener("submit", async event => {

    event.preventDefault();

    setFormStatus(form, "");

    const fullName = name.value.trim();
    const emailAddress = email.value.trim();
    const phoneNumber = phone.value.trim();

    if (fullName.length < 2) {
      setFormStatus(form, "Please enter your full name.");
      name.focus();
      return;
    }

    if (!validateEmail(emailAddress)) {
      setFormStatus(form, "Please enter a valid email address.");
      email.focus();
      return;
    }

    if (!validateUKPhone(phoneNumber)) {
      setFormStatus(form, "Please enter a valid UK telephone number.");
      phone.focus();
      return;
    }

    if (!service.value) {
      setFormStatus(form, "Please select a service.");
      service.focus();
      return;
    }

    // Invisible honeypot.

    if (honeypot?.value.trim()) {
      return;
    }

    // Supplementary bot check.
    if (Date.now() - loadedAt < 2500) {
      setFormStatus(
        form,
        "Please check your details and try again."
      );
      return;
    }

    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {

      const formData = new FormData(form);

      formData.set("name", fullName);
      formData.set("email", emailAddress);
      formData.set("phone", normaliseUKPhone(phoneNumber));

      // Avoid sending an empty hidden field to Web3Forms.
      formData.delete("botcheck");

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Submission failed."
        );
      }

      form.reset();

      setFormStatus(
        form,
        "Thank you. Your enquiry has been sent successfully.",
        "success"
      );

    } catch (error) {

      console.error("Website form submission:", error);

      setFormStatus(
        form,
        "We couldn't send your enquiry. Please try again or contact us by email."
      );

    } finally {

      submitButton.disabled = false;
      submitButton.textContent = originalText;

    }

  });
}
