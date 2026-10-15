
/* ============================================================
   CLEAN DESIGN UK — BRANDING PAGE
   File: /js/branding.js

   Features:
   - Interactive service accordion
   - Scroll reveal animations
   - Web3Forms enquiry submission
   - UK mobile validation
   - Basic invisible spam protection
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initialiseBrandingAccordion();
  initialiseBrandingAnimations();
  initialiseBrandingForm();
});


/* ============================================================
   01. SERVICES ACCORDION
============================================================ */

function initialiseBrandingAccordion() {
  const accordion = document.getElementById(
    "brServiceAccordion"
  );

  if (!accordion) return;

  const items = [
    ...accordion.querySelectorAll(".br-service-item")
  ];

  function openItem(selectedItem) {
    const alreadyOpen = selectedItem.classList.contains(
      "is-open"
    );

    items.forEach(item => {
      const trigger = item.querySelector(
        ".br-service-trigger"
      );

      const panel = item.querySelector(
        ".br-service-panel"
      );

      item.classList.remove("is-open");

      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }

      if (panel) {
        panel.hidden = true;
      }
    });

    if (!alreadyOpen) {
      const trigger = selectedItem.querySelector(
        ".br-service-trigger"
      );

      const panel = selectedItem.querySelector(
        ".br-service-panel"
      );

      selectedItem.classList.add("is-open");

      if (trigger) {
        trigger.setAttribute("aria-expanded", "true");
      }

      if (panel) {
        panel.hidden = false;
      }
    }
  }

  items.forEach(item => {
    const trigger = item.querySelector(
      ".br-service-trigger"
    );

    if (!trigger) return;

    trigger.addEventListener("click", () => {
      openItem(item);
    });
  });
}


/* ============================================================
   02. SCROLL REVEAL ANIMATIONS
============================================================ */

function initialiseBrandingAnimations() {
  const elements = document.querySelectorAll(".br-reveal");

  if (!elements.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("br-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px 30px 0px"
    }
  );

  elements.forEach(element => {
    observer.observe(element);
  });

  document.body.classList.add("br-animations-ready");
}


/* ============================================================
   03. FORM VALIDATION HELPERS
============================================================ */

function normaliseBrandingPhone(value) {
  return value.replace(/[\s().-]/g, "");
}

function isValidBrandingUKMobile(value) {
  const phone = normaliseBrandingPhone(value);

  /*
    UK mobile formats:
      07xxxxxxxxx
      +447xxxxxxxxx
      00447xxxxxxxxx

    Excludes 070 personal numbers and most
    076 pager numbers.

    This is format validation, not verification
    that a mobile number belongs to a person.
  */

  return /^(?:0|\+44|0044)(?:7[1-5]\d{8}|7[7-9]\d{8}|7624\d{6})$/.test(phone);
}

function isValidBrandingEmail(value) {
  const email = value.trim();

  if (email.length > 254) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function containsNonUKInternationalPhone(message) {
  if (!message) return false;

  /*
    Check explicitly international-prefixed numbers
    within the optional message field.

    This is an additional spam filter, not
    a complete international telephone parser.
  */

  const matches = message.match(
    /(?:\+|00)\d[\d\s().-]{7,}/g
  ) || [];

  return matches.some(value => {
    const cleaned = value.replace(/[\s().-]/g, "");

    return !(
      cleaned.startsWith("+44") ||
      cleaned.startsWith("0044")
    );
  });
}

function setBrandingFormStatus(
  form,
  message,
  state = "error"
) {
  const status = form.querySelector(".br-form-status");

  if (!status) return;

  status.textContent = message;
  status.dataset.state = state;
}


/* ============================================================
   04. WEB3FORMS SUBMISSION
============================================================ */

function initialiseBrandingForm() {
  const form = document.getElementById("brContactForm");

  if (!form) return;

  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const phone = form.querySelector('[name="phone"]');
  const service = form.querySelector('[name="service"]');
  const message = form.querySelector('[name="message"]');

  const honeypot = form.querySelector('[name="website"]');
  const submitButton = form.querySelector(
    '[type="submit"]'
  );

  if (
    !name ||
    !email ||
    !phone ||
    !service ||
    !submitButton
  ) {
    return;
  }

  const formLoadedAt = Date.now();

  /*
    Clear custom validation errors when
    the user updates the affected fields.
  */

  email.addEventListener("input", () => {
    email.setCustomValidity("");
  });

  phone.addEventListener("input", () => {
    phone.setCustomValidity("");
  });

  email.addEventListener("blur", () => {
    if (!email.value.trim()) return;

    email.setCustomValidity(
      isValidBrandingEmail(email.value)
        ? ""
        : "Please enter a valid email address."
    );
  });

  phone.addEventListener("blur", () => {
    if (!phone.value.trim()) return;

    phone.setCustomValidity(
      isValidBrandingUKMobile(phone.value)
        ? ""
        : "Please enter a valid UK mobile number."
    );
  });


  /* ==========================================
     FORM SUBMISSION
  ========================================== */

  form.addEventListener("submit", async event => {
    event.preventDefault();

    setBrandingFormStatus(form, "");

    const fullName = name.value.trim();
    const emailAddress = email.value.trim();
    const phoneNumber = phone.value.trim();
    const selectedService = service.value;
    const projectMessage = message?.value.trim() || "";

    // Full name validation
    if (fullName.length < 2) {
      setBrandingFormStatus(
        form,
        "Please enter your full name."
      );

      name.focus();
      return;
    }

    // Email validation
    if (!isValidBrandingEmail(emailAddress)) {
      email.setCustomValidity(
        "Please enter a valid email address."
      );

      setBrandingFormStatus(
        form,
        "Please enter a valid email address."
      );

      email.reportValidity();
      return;
    }

    // UK mobile number validation
    if (!isValidBrandingUKMobile(phoneNumber)) {
      phone.setCustomValidity(
        "Please enter a valid UK mobile number."
      );

      setBrandingFormStatus(
        form,
        "Please enter a valid UK mobile number."
      );

      phone.reportValidity();
      return;
    }

    // Service selection validation
    if (!selectedService) {
      setBrandingFormStatus(
        form,
        "Please select the service you need."
      );

      service.focus();
      return;
    }

    // Optional message phone-number check
    if (containsNonUKInternationalPhone(projectMessage)) {
      setBrandingFormStatus(
        form,
        "Please use a UK contact number in your message."
      );

      message.focus();
      return;
    }

    /*
      Invisible spam protection:
      reject basic bots that populate
      hidden fields.
    */

    if (honeypot && honeypot.value.trim()) {
      setBrandingFormStatus(
        form,
        "Your enquiry could not be submitted."
      );
      return;
    }

    /*
      Minimum completion time to reduce
      basic automated submissions.
    */

    if (Date.now() - formLoadedAt < 2500) {
      setBrandingFormStatus(
        form,
        "Please check your details and try again."
      );
      return;
    }

    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      // Normalise submitted information
      formData.set("name", fullName);
      formData.set("email", emailAddress);
      formData.set(
        "phone",
        normaliseBrandingPhone(phoneNumber)
      );

      if (message) {
        formData.set("message", projectMessage);
      }

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
          result.message ||
          "The enquiry could not be submitted."
        );
      }

      form.reset();

      setBrandingFormStatus(
        form,
        "Thank you. Your branding enquiry has been sent successfully.",
        "success"
      );

    } catch (error) {
      console.error(
        "Branding form submission error:",
        error
      );

      setBrandingFormStatus(
        form,
        "Your enquiry could not be sent. Please try again or contact us by email."
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
