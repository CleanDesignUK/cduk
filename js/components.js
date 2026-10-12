
document.addEventListener("DOMContentLoaded", async () => {

  const components = [
    {
      target: "#site-navbar",
      path: "/components/navbar.html"
    },
    {
      target: "#site-footer",
      path: "/components/footer.html"
    },
    {
      target: "#cookie-consent",
      path: "/components/cookie-banner.html"
    }
  ];

  await Promise.all(
    components.map(async component => {

      const element = document.querySelector(component.target);

      if (!element) return;

      try {
        const response = await fetch(component.path);

        if (!response.ok) {
          throw new Error(`Failed loading ${component.path}`);
        }

        element.innerHTML = await response.text();

      } catch (error) {
        console.error("Component error:", error);
      }

    })
  );

  initialiseNavigation();

  window.dispatchEvent(new Event("cduk:components-ready"));

});

function initialiseNavigation() {

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");

  const servicesContainer = document.querySelector(".nav-services");
  const servicesButton = document.querySelector(".services-toggle");

  if (!header) return;

  menuButton?.addEventListener("click", () => {

    const isOpen = header.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));

  });

  servicesButton?.addEventListener("click", () => {

    const isOpen = servicesContainer.classList.toggle("open");

    servicesButton.setAttribute("aria-expanded", String(isOpen));

  });

  document.addEventListener("click", event => {

    if (!servicesContainer?.contains(event.target)) {
      servicesContainer?.classList.remove("open");
      servicesButton?.setAttribute("aria-expanded", "false");
    }

  });

  document.querySelectorAll(".nav-main a").forEach(link => {

    link.addEventListener("click", () => {

      header.classList.remove("open");

      document.body.classList.remove("menu-open");

      menuButton?.setAttribute("aria-expanded", "false");

    });

  });

}
