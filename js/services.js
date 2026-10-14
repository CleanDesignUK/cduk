
/* =====================================================
   CLEAN DESIGN UK — SERVICES PAGE
   File: /js/services.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initialiseServicesProcess();
});

function initialiseServicesProcess() {

  const container = document.getElementById("servicesProcess");

  if (!container) return;

  const buttons = Array.from(
    container.querySelectorAll("[data-process-step]")
  );

  const title = document.getElementById("processDisplayTitle");
  const description = document.getElementById("processDisplayDescription");
  const label = document.getElementById("processGraphicLabel");
  const progress = document.getElementById("processProgress");

  if (!buttons.length || !title || !description) return;

  const processSteps = [
    {
      title: "Consultation & Requirements",
      label: "CONSULTATION",
      description:
        "We discuss your business, customers, existing website and project goals to establish what services and functionality you require."
    },
    {
      title: "Research & Planning",
      label: "PLANNING",
      description:
        "We plan the website structure, design direction, content and technical requirements. Where relevant, we also consider competitors, local search and suitable SEO keywords."
    },
    {
      title: "Design & Development",
      label: "DEVELOPMENT",
      description:
        "We develop the agreed design and functionality, review mobile responsiveness, organise the website content and test the key features before launch."
    },
    {
      title: "Launch & Support",
      label: "LAUNCH",
      description:
        "We complete the agreed checks, prepare the website or digital system for launch and discuss any ongoing updates, maintenance or support requirements."
    }
  ];

  function activateProcessStep(index) {

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= processSteps.length
    ) {
      return;
    }

    const selected = processSteps[index];

    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    title.textContent = selected.title;
    description.textContent = selected.description;

    if (label) {
      label.textContent = selected.label;
    }

    if (progress) {
      progress.style.width =
        `${((index + 1) / processSteps.length) * 100}%`;
    }
  }

  buttons.forEach((button, index) => {

    button.addEventListener("click", () => {
      activateProcessStep(index);
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

      activateProcessStep(nextIndex);
    });

  });

  activateProcessStep(0);
}
