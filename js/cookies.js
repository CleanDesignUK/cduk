
(() => {

  const STORAGE_KEY = "cduk_cookie_consent";
  const GA_ID = "G-TFED1HQFDE";

  let analyticsLoaded = false;

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage may be unavailable.
    }
  }

  function loadAnalytics() {

    if (analyticsLoaded) return;

    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());

    window.gtag("config", GA_ID, {
      anonymize_ip: true
    });

    const script = document.createElement("script");

    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    document.head.appendChild(script);

  }

  function clearAnalyticsCookies() {

    const names = document.cookie
      .split(";")
      .map(cookie => cookie.trim().split("=")[0])
      .filter(name =>
        name === "_ga" ||
        name === "_gid" ||
        name === "_gat" ||
        name.startsWith("_ga_")
      );

    names.forEach(name => {

      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;

      document.cookie = `${name}=; Max-Age=0; path=/; domain=.cleandesignuk.com; SameSite=Lax`;

    });

  }

  function initialiseCookies() {

    const banner = document.querySelector("#cookieBanner");

    if (!banner || banner.dataset.initialised) return;

    banner.dataset.initialised = "true";

    const existingConsent = getConsent();

    if (existingConsent === "accepted") {
      loadAnalytics();
    }

    if (!existingConsent) {
      banner.classList.add("show");
    }

    banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {

      saveConsent("accepted");

      banner.classList.remove("show");

      loadAnalytics();

    });

    banner.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {

      saveConsent("rejected");

      banner.classList.remove("show");

      clearAnalyticsCookies();

      // Reload to ensure any existing analytics script stops.
      if (analyticsLoaded) {
        window.location.reload();
      }

    });

    document.querySelectorAll("[data-cookie-settings]").forEach(button => {

      button.addEventListener("click", () => {
        banner.classList.add("show");
      });

    });

  }

  window.addEventListener("cduk:components-ready", initialiseCookies);

})();
