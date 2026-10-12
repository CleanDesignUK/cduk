
document.addEventListener("DOMContentLoaded", () => {

  const forms = document.querySelectorAll("[data-lead-form]");

  const disposableDomains = [
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
    "sharklasers.com",
    "trashmail.com"
  ];

  function validEmail(email) {

    const value = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    if (!emailPattern.test(value)) return false;

    const domain = value.split("@")[1];

    return !disposableDomains.includes(domain);

  }

  function validUKPhone(phone) {

    const raw = phone.trim();

    if (!/^[+0-9\s().-]+$/.test(raw)) {
      return false;
    }

    let digits = raw.replace(/\D/g, "");

    if (raw.startsWith("+44")) {
      digits = "0" + digits.substring(2);
    } else if (digits.startsWith("0044")) {
      digits = "0" + digits.substring(4);
    } else if (digits.startsWith("44")) {
      digits = "0" + digits.substring(2);
    }

    if (!/^0[1-9]\d{8,9}$/.test(digits)) {
      return false;
    }

    if (/^(\d)\1+$/.test(digits)) {
      return false;
    }

    if (/12345678|00000000|99999999/.test(digits)) {
      return false;
    }

    return true;

  }

  function containsInvalidPhone(message) {

    const internationalPattern = /(?:\+|00)\d[\d\s().-]{7,20}/g;

    const matches = message.match(internationalPattern) || [];

    return matches.some(number => {

      const cleaned = number.trim();

      return !cleaned.startsWith("+44") &&
             !cleaned.startsWith("0044");

    });

  }

  function updateStatus(form, message, type = "") {

    const status = form.querySelector(".form-status");

    if (!status) return;

    status.textContent = message;

    status.className = `form-status ${type}`;

  }

  forms.forEach(form => {

    const formStarted = Date.now();

    const pageField = form.querySelector('[name="page_url"]');

    if (pageField) {
      pageField.value = window.location.href;
    }

    form.addEventListener("submit", async event => {

      event.preventDefault();

      updateStatus(form, "");

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const botcheck = String(formData.get("botcheck") || "").trim();

      if (botcheck) {
        updateStatus(form, "Unable to submit your enquiry.", "error");
        return;
      }

      if (Date.now() - formStarted < 1800) {
        updateStatus(form, "Please check the form and try again.", "error");
        return;
      }

      if (name.length < 2 || name.length > 80) {
        updateStatus(form, "Please enter your full name.", "error");
        return;
      }

      if (/https?:\/\/|www\./i.test(name)) {
        updateStatus(form, "Please enter a valid name.", "error");
        return;
      }

      if (!validEmail(email)) {
        updateStatus(form, "Please enter a valid email address.", "error");
        return;
      }

      if (!validUKPhone(phone)) {
        updateStatus(form, "Please enter a valid UK phone number.", "error");
        return;
      }

      const messageField = form.querySelector('[name="message"]');

      if (messageField) {

        if (message.length < 10 || message.length > 2000) {
          updateStatus(form, "Please provide your project details.", "error");
          return;
        }

        if (containsInvalidPhone(message)) {
          updateStatus(form, "Please only include UK phone numbers.", "error");
          return;
        }

        if (/https?:\/\/|www\./i.test(message)) {
          updateStatus(form, "Please remove website links from your message.", "error");
          return;
        }

      }

      const lastSubmission = Number(
        localStorage.getItem("cduk_last_submission") || 0
      );

      if (Date.now() - lastSubmission < 30000) {
        updateStatus(form, "Please wait before submitting another enquiry.", "error");
        return;
      }

      const button = form.querySelector('[type="submit"]');

      const originalText = button?.textContent;

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      try {

        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error("Submission failed");
        }

        localStorage.setItem(
          "cduk_last_submission",
          String(Date.now())
        );

        form.reset();

        updateStatus(
          form,
          "Thank you. Your enquiry has been sent successfully.",
          "success"
        );

      } catch (error) {

        updateStatus(
          form,
          "We couldn't send your enquiry. Please email jesse@cleandesignuk.com.",
          "error"
        );

      } finally {

        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }

      }

    });

  });

});
