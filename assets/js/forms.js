(() => {
  "use strict";

  const ENDPOINT = "https://api.web3forms.com/submit";
  const KEY_PLACEHOLDER = "YOUR_WEB3FORMS_ACCESS_KEY";
  const OWN_DOMAINS = ["cleandesignuk.com", "cleandesignuk.uk"];
  const pitchPatterns = [
    /\b(?:guest\s*post|guest\s*article|link\s*insertion|backlinks?|link\s*building|domain\s*authority|white\s*label|outsource\s+your|partnership\s+proposal)\b/i,
    /\b(?:i|we|our\s+(?:agency|team|company))\s+(?:can|could|would\s+like\s+to|want\s+to)\s+(?:improve|boost|increase|optimise|optimize|redesign|promote)\s+(?:your|the)\b/i,
    /\b(?:we|our\s+(?:agency|team|company))\s+(?:offer|provide|specialise\s+in|specialize\s+in)\s+(?:seo|web\s*design|website\s*development|digital\s*marketing|lead\s*generation|social\s*media)\b/i,
    /\b(?:first\s+page\s+of\s+google|increase\s+your\s+traffic|boost\s+your\s+rankings|improve\s+your\s+seo)\b/i
  ];

  function alertBox(icon, title, text) {
    if (window.Swal) {
      window.Swal.fire({
        icon,
        title,
        text,
        confirmButtonText: "OK",
        confirmButtonColor: "#ba0d17"
      });
    } else {
      window.alert(`${title}\n\n${text}`);
    }
  }

  function emailIsBlocked(value) {
    const email = value.trim().toLowerCase();
    const parts = email.split("@");
    if (parts.length !== 2) return true;
    const [local, domain] = parts;
    if (OWN_DOMAINS.includes(domain)) return true;
    if (local.startsWith("media+")) return true;
    if (email.includes("cleandesignuk") || email.includes("clean-design-uk")) return true;
    return false;
  }

  function phoneCheck(value) {
    const raw = value.trim();
    const compact = raw.replace(/[\s().-]/g, "");
    const international = compact.replace(/^00/, "+");
    const digits = international.replace(/\D/g, "");

    if (international.startsWith("+91") || international.startsWith("+92")) {
      return "Please enter a contact number from a supported location.";
    }
    if (digits.length < 8 || digits.length > 15) {
      return "Please enter a valid phone or WhatsApp number.";
    }
    if (/(\d)\1{5,}/.test(digits)) {
      return "Please check the phone number. It contains too many repeated digits.";
    }
    const counts = [...digits].reduce((acc, digit) => {
      acc[digit] = (acc[digit] || 0) + 1;
      return acc;
    }, {});
    const mostCommon = Math.max(...Object.values(counts));
    if (digits.length >= 9 && mostCommon / digits.length > .68) {
      return "Please enter a genuine phone or WhatsApp number.";
    }
    if (/^(?:0123456789|1234567890|9876543210)$/.test(digits)) {
      return "Please enter a genuine phone or WhatsApp number.";
    }
    return "";
  }

  function isPitch(message) {
    const urls = message.match(/(?:https?:\/\/|www\.)/gi) || [];
    if (urls.length >= 3) return true;
    return pitchPatterns.some((pattern) => pattern.test(message));
  }

  function invalidate(field, message) {
    field?.setAttribute("aria-invalid", "true");
    field?.focus();
    alertBox("error", "Please check the form", message);
  }

  function initForm(form) {
    form.dataset.startedAt = String(Date.now());
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      form.querySelectorAll("[aria-invalid='true']").forEach((el) => el.removeAttribute("aria-invalid"));

      const key = form.querySelector("[name='access_key']")?.value?.trim();
      const honeypot = form.querySelector("[name='company_url']");
      const name = form.querySelector("[name='name']");
      const email = form.querySelector("[name='email']");
      const phone = form.querySelector("[name='phone']");
      const service = form.querySelector("[name='service']");
      const message = form.querySelector("[name='message']");
      const button = form.querySelector("button[type='submit']");
      const status = form.querySelector(".form-status");

      if (!key || key === KEY_PLACEHOLDER) {
        alertBox("info", "Web3Forms key needed", "Add your Web3Forms access key before publishing the form.");
        return;
      }
      if (honeypot?.value) return;
      if (Date.now() - Number(form.dataset.startedAt || 0) < 2200) {
        alertBox("error", "Please try again", "The form was submitted too quickly. Please check the details and submit again.");
        form.dataset.startedAt = String(Date.now() - 3000);
        return;
      }
      if (!form.checkValidity()) {
        invalidate(form.querySelector(":invalid"), "Please complete the required fields with valid details.");
        return;
      }
      if (name.value.trim().length < 2 || /https?:\/\/|www\./i.test(name.value)) {
        invalidate(name, "Please enter your name.");
        return;
      }
      if (emailIsBlocked(email.value)) {
        invalidate(email, "Please use your own genuine email address for the enquiry.");
        return;
      }
      const phoneError = phoneCheck(phone.value);
      if (phoneError) {
        invalidate(phone, phoneError);
        return;
      }
      if (!service.value) {
        invalidate(service, "Please choose the service you are enquiring about.");
        return;
      }
      if (message.value.trim().length < 20) {
        invalidate(message, "Please tell us a little more about the project.");
        return;
      }
      if (isPitch(message.value)) {
        invalidate(message, "This form is for client enquiries. Sales pitches, backlink outreach and supplier promotions are not accepted here.");
        return;
      }

      const last = Number(localStorage.getItem("cduk_last_enquiry") || 0);
      if (last && Date.now() - last < 45000) {
        alertBox("info", "Enquiry already sent", "Please wait before sending another enquiry. You can message us on WhatsApp if you need to add something.");
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());
      delete payload.company_url;
      payload.page_url = window.location.href;
      payload.submitted_at = new Date().toISOString();
      payload.email = email.value.trim().toLowerCase();
      payload.phone = phone.value.trim();

      const original = button.textContent;
      button.disabled = true;
      button.textContent = "Sending…";
      if (status) status.textContent = "Sending your enquiry…";

      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success === false) throw new Error(data.message || "Submission failed");

        localStorage.setItem("cduk_last_enquiry", String(Date.now()));
        form.reset();
        form.dataset.startedAt = String(Date.now());
        if (status) status.textContent = "Your enquiry has been sent.";
        alertBox("success", "Thank you!", "Our team will get in touch with you soon.");
      } catch (error) {
        console.error(error);
        if (status) status.textContent = "We could not send the form. Please try again or use WhatsApp.";
        alertBox("error", "Something went wrong", "Please try again or message Clean Design UK on WhatsApp.");
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  }

  function boot() {
    document.querySelectorAll(".js-web3form").forEach(initForm);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
