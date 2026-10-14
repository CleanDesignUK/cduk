
/* ============================================================
   CLEAN DESIGN UK — ECOMMERCE PAGE
   File: /js/ecommerce.js
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initialiseEcommerceAnimations();
  initialiseEcommerceProcess();
  initialiseEcommerceForm();
});

/* ============================================================
   SCROLL ANIMATIONS
============================================================ */

function initialiseEcommerceAnimations() {
  const items = document.querySelectorAll(".ec-reveal");

  if (!items.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("ec-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 50px 0px"
    }
  );

  items.forEach(item => observer.observe(item));

  document.body.classList.add("ec-animations-ready");
}

/* ============================================================
   INTERACTIVE PROJECT PROCESS
============================================================ */

function initialiseEcommerceProcess() {
  const menu = document.getElementById("ecProcessMenu");

  if (!menu) return;

  const buttons = [...menu.querySelectorAll("[data-ec-step]")];
  const heading = document.getElementById("ecProcessHeading");
  const description = document.getElementById("ecProcessText");
  const label = document.getElementById("ecProcessLabel");
  const progress = document.getElementById("ecProcessProgress");

  if (!buttons.length || !heading || !description) {
    return;
  }

  const steps = [
    {
      label: "PROJECT DISCOVERY",
      heading: "Discovery & Store Planning",
      description:
        "We discuss your products, target customers, ecommerce platform preferences, operational requirements, integrations and project objectives before agreeing a suitable development scope."
    },
    {
      label: "CATALOGUE PLANNING",
      heading: "Catalogue & Content Structure",
      description:
        "We plan product collections, categories, navigation, product information and the store's content structure. Search intent and appropriate SEO foundations are considered during planning."
    },
    {
      label: "STORE DEVELOPMENT",
      heading: "Design & Development",
      description:
        "We develop the agreed responsive storefront layouts, product pages, navigation, shopping basket and appropriate integrations for the chosen ecommerce platform."
    },
    {
      label: "TESTING & LAUNCH",
      heading: "Testing & Launch",
      description:
        "We check the agreed functionality, mobile experience, key navigation and purchasing journeys before preparing the online store for launch. Payment and shipping configurations are tested as appropriate."
    }
  ];

  function activateStep(index) {
    if (!Number.isInteger(index)) return;
    if (index < 0 || index >= steps.length) return;

    const step = steps[index];

    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    heading.textContent = step.heading;
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
      const forward = ["ArrowDown", "ArrowRight"];
      const backward = ["ArrowUp", "ArrowLeft"];

      if (
        !forward.includes(event.key) &&
        !backward.includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      const direction = forward.includes(event.key) ? 1 : -1;

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

function isValidUKPhone(value) {
  const phone = normaliseUKPhone(value);

  // UK mobile numbers:
  // 07xxxxxxxxx / +447xxxxxxxxx / 00447xxxxxxxxx
  // Excludes 070 personal numbers and 076 pager ranges,
  // except 07624, used by Isle of Man mobiles.

  return /^(?:0|\+44|0044)(?:7[1-5]\d{8}|7[7-9]\d{8}|7624\d{6})$/.test(phone);
}

function isValidEmail(value) {
  const email = value.trim();

  if (email.length > 254) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function setEcommerceStatus(form, message, state = "error") {
  const status = form.querySelector(".ec-form-status");

  if (!status) return;

  status.textContent = message;
  status.dataset.state = state;
}

/* ============================================================
   WEB3FORMS SUBMISSION
============================================================ */

function initialiseEcommerceForm() {
  const form = document.getElementById("ecContactForm");

  if (!form) return;

  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const phone = form.querySelector('[name="phone"]');
  const service = form.querySelector('[name="service"]');
  const honeypot = form.querySelector('[name="website"]');
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
      isValidEmail(email.value)
        ? ""
        : "Please enter a valid email address."
    );
  });

  phone.addEventListener("blur", () => {
    if (!phone.value.trim()) return;

    phone.setCustomValidity(
      isValidUKPhone(phone.value)
        ? ""
        : "Please enter a valid UK mobile number."
    );
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    setEcommerceStatus(form, "");

    const fullName = name.value.trim();
    const emailAddress = email.value.trim();
    const phoneNumber = phone.value.trim();

    if (fullName.length < 2) {
      setEcommerceStatus(form, "Please enter your full name.");
      name.focus();
      return;
    }

    if (!isValidEmail(emailAddress)) {
      setEcommerceStatus(form, "Please enter a valid email address.");
      email.focus();
      return;
    }

    if (!isValidUKPhone(phoneNumber)) {
      setEcommerceStatus(
        form,
        "Please enter a valid UK mobile number."
      );
      phone.focus();
      return;
    }

    if (!service.value) {
      setEcommerceStatus(form, "Please select the service you need.");
      service.focus();
      return;
    }

    // Hidden honeypot field.

    if (honeypot && honeypot.value.trim()) {
      return;
    }

    // Minimum completion time helps reduce basic bot traffic.

    if (Date.now() - loadedAt < 2500) {
      setEcommerceStatus(
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
      formData.delete("website");

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

      setEcommerceStatus(
        form,
        "Thank you. Your ecommerce enquiry has been sent successfully.",
        "success"
      );

    } catch (error) {
      console.error("Ecommerce enquiry error:", error);

      setEcommerceStatus(
        form,
        "Your enquiry could not be sent. Please try again or contact us by email."
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
