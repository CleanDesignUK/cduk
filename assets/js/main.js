(() => {

  "use strict";


  const WEB3FORMS_ENDPOINT =
    "https://api.web3forms.com/submit";


  const WEB3FORMS_KEY_PLACEHOLDER =
    "YOUR_WEB3FORMS_ACCESS_KEY";


  const OWN_DOMAINS = [
    "cleandesignuk.com",
    "cleandesignuk.uk"
  ];


  const salesPitchPatterns = [

    /\bguest\s*(?:post|article)\b/i,

    /\bbacklinks?\b/i,

    /\blink\s*(?:building|insertion)\b/i,

    /\bdomain\s*authority\b/i,

    /\bwhite\s*label\b/i,

    /\bseo\s*(?:service|services|proposal|offer)\b/i,

    /\bwebsite\s*(?:redesign|development)\s*(?:service|services|offer)\b/i,

    /\bdigital\s*marketing\s*(?:service|services|agency|offer)\b/i,

    /\blead\s*generation\s*(?:service|services|offer)\b/i,

    /\bsocial\s*media\s*(?:service|services|agency|offer)\b/i,

    /\b(?:improve|boost|increase)\s+(?:your\s+)?(?:seo|rankings?|traffic|domain|website)\b/i,

    /\bfirst\s+page\s+of\s+google\b/i,

    /\bwe\s+(?:can|could|offer|provide|specialise|specialize)\b.*\b(?:seo|marketing|web\s*design|backlinks?|lead\s*generation)\b/i

  ];



  /*
  ============================================================
  COMPONENT LOADER
  ============================================================
  */

  async function injectComponent(
    selector,
    url
  ) {

    const slot =
      document.querySelector(selector);


    if (!slot) {
      return null;
    }


    try {

      const response =
        await fetch(
          url,
          {
            cache:
              "no-cache"
          }
        );


      if (!response.ok) {

        throw new Error(
          `Could not load ${url}`
        );

      }


      const html =
        await response.text();


      const template =
        document.createElement(
          "template"
        );


      template.innerHTML =
        html.trim();


      const node =
        template.content
          .firstElementChild;


      if (!node) {
        return null;
      }


      slot.replaceWith(node);


      return node;

    }

    catch (error) {

      console.error(error);

      return null;

    }

  }



  /*
  ============================================================
  NAVIGATION
  ============================================================
  */

  function initNavigation() {

    const header =
      document.querySelector(
        "[data-site-header]"
      );


    const dropdown =
      document.querySelector(
        "[data-dropdown]"
      );


    const dropdownButton =
      dropdown?.querySelector(
        ".nav-dropdown-button"
      );


    const mobileButton =
      document.querySelector(
        ".mobile-menu-button"
      );


    const mobileMenu =
      document.querySelector(
        "#mobile-menu"
      );



    /*
    Navbar becomes slightly more solid
    after the visitor scrolls.
    */

    const setScrolled = () => {

      header?.classList.toggle(
        "is-scrolled",
        window.scrollY > 12
      );

    };


    setScrolled();


    window.addEventListener(
      "scroll",
      setScrolled,
      {
        passive: true
      }
    );



    /*
    Desktop Services dropdown
    */

    if (
      dropdown &&
      dropdownButton
    ) {

      const closeDropdown = () => {

        dropdown.classList.remove(
          "is-open"
        );


        dropdownButton.setAttribute(
          "aria-expanded",
          "false"
        );

      };


      dropdownButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          const opening =
            !dropdown.classList.contains(
              "is-open"
            );


          dropdown.classList.toggle(
            "is-open",
            opening
          );


          dropdownButton.setAttribute(
            "aria-expanded",
            String(opening)
          );

        }
      );


      document.addEventListener(
        "click",
        (event) => {

          if (
            !dropdown.contains(
              event.target
            )
          ) {

            closeDropdown();

          }

        }
      );


      document.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key ===
            "Escape"
          ) {

            closeDropdown();

          }

        }
      );

    }



    /*
    Mobile menu
    */

    if (
      mobileButton &&
      mobileMenu
    ) {

      mobileButton.addEventListener(
        "click",
        () => {

          const opening =
            mobileMenu.hidden;


          mobileMenu.hidden =
            !opening;


          mobileButton.setAttribute(
            "aria-expanded",
            String(opening)
          );


          document.body.classList.toggle(
            "menu-open",
            opening
          );

        }
      );


      mobileMenu
        .querySelectorAll("a")
        .forEach((link) => {

          link.addEventListener(
            "click",
            () => {

              mobileMenu.hidden =
                true;


              mobileButton.setAttribute(
                "aria-expanded",
                "false"
              );


              document.body.classList.remove(
                "menu-open"
              );

            }
          );

        });

    }

  }



  /*
  ============================================================
  ALERTS
  ============================================================
  */

  function showAlert(
    icon,
    title,
    text
  ) {

    if (window.Swal) {

      window.Swal.fire({

        icon,

        title,

        text,

        confirmButtonText:
          "OK",

        confirmButtonColor:
          "#ba0d17"

      });


      return;

    }


    window.alert(
      `${title}\n\n${text}`
    );

  }



  /*
  ============================================================
  EMAIL VALIDATION
  ============================================================
  */

  function emailIsBlocked(
    value
  ) {

    const email =
      value
        .trim()
        .toLowerCase();


    const pieces =
      email.split("@");


    if (
      pieces.length !== 2
    ) {

      return true;

    }


    const [
      local,
      domain
    ] = pieces;


    if (
      !local ||
      !domain
    ) {

      return true;

    }


    /*
    Do not allow somebody to submit
    Clean Design UK's own address.
    */

    if (
      OWN_DOMAINS.includes(
        domain
      )
    ) {

      return true;

    }


    if (
      email.includes(
        "cleandesignuk"
      ) ||
      email.includes(
        "clean-design-uk"
      )
    ) {

      return true;

    }


    /*
    Blocks examples such as:
    media+cleandesign.uk@gmail.com
    */

    if (
      local.startsWith(
        "media+"
      )
    ) {

      return true;

    }


    return false;

  }



  /*
  ============================================================
  PHONE VALIDATION
  ============================================================
  */

  function validatePhone(
    value
  ) {

    const raw =
      value.trim();


    const compact =
      raw
        .replace(
          /[\s().-]/g,
          ""
        )
        .replace(
          /^00/,
          "+"
        );


    const digits =
      compact.replace(
        /\D/g,
        ""
      );


    /*
    Block India / Pakistan numbers.
    */

    if (
      compact.startsWith(
        "+91"
      ) ||
      compact.startsWith(
        "+92"
      )
    ) {

      return (
        "Please enter a contact number " +
        "from a supported location."
      );

    }


    /*
    International telephone number
    sanity check.
    */

    if (
      digits.length < 8 ||
      digits.length > 15
    ) {

      return (
        "Please enter a valid " +
        "phone number."
      );

    }


    /*
    Blocks:
    07777777777
    01111111111
    etc.
    */

    if (
      /(\d)\1{5,}/
        .test(digits)
    ) {

      return (
        "Please check the phone number. " +
        "It contains too many repeated digits."
      );

    }


    /*
    Detects numbers where one digit
    makes up nearly all of the value.
    */

    const counts =
      [...digits].reduce(
        (total, digit) => {

          total[digit] =
            (total[digit] || 0) + 1;


          return total;

        },
        {}
      );


    const mostCommon =
      Math.max(
        ...Object.values(
          counts
        )
      );


    if (
      digits.length >= 9 &&
      mostCommon /
      digits.length >
      .68
    ) {

      return (
        "Please enter a genuine " +
        "phone number."
      );

    }


    /*
    Obvious test numbers.
    */

    if (
      /^(?:0123456789|1234567890|9876543210)$/
        .test(digits)
    ) {

      return (
        "Please enter a genuine " +
        "phone number."
      );

    }


    return "";

  }



  /*
  ============================================================
  SALES / OUTREACH SPAM
  ============================================================
  */

  function looksLikeSalesPitch(
    value
  ) {

    const text =
      String(
        value || ""
      ).trim();


    const links =
      text.match(
        /(?:https?:\/\/|www\.)/gi
      ) || [];


    if (
      links.length >= 3
    ) {

      return true;

    }


    return salesPitchPatterns
      .some(
        (pattern) =>
          pattern.test(text)
      );

  }



  /*
  ============================================================
  FIELD ERROR
  ============================================================
  */

  function flagField(
    field,
    message
  ) {

    field?.setAttribute(
      "aria-invalid",
      "true"
    );


    field?.focus();


    showAlert(
      "error",
      "Please check the form",
      message
    );

  }



  /*
  ============================================================
  WEB3FORMS
  ============================================================
  */

  function initForm(
    form
  ) {

    /*
    Used for invisible bot timing.
    */

    form.dataset.startedAt =
      String(
        Date.now()
      );


    form.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        form
          .querySelectorAll(
            "[aria-invalid='true']"
          )
          .forEach(
            (field) =>
              field.removeAttribute(
                "aria-invalid"
              )
          );


        const key =
          form
            .querySelector(
              "[name='access_key']"
            )
            ?.value
            ?.trim();


        const honeypot =
          form.querySelector(
            "[name='website_confirm']"
          );


        const name =
          form.querySelector(
            "[name='name']"
          );


        const business =
          form.querySelector(
            "[name='business']"
          );


        const email =
          form.querySelector(
            "[name='email']"
          );


        const phone =
          form.querySelector(
            "[name='phone']"
          );


        const service =
          form.querySelector(
            "[name='service']"
          );


        const message =
          form.querySelector(
            "[name='message']"
          );


        const button =
          form.querySelector(
            "button[type='submit']"
          );


        const status =
          form.querySelector(
            ".form-status"
          );



        /*
        Web3Forms key check
        */

        if (
          !key ||
          key ===
          WEB3FORMS_KEY_PLACEHOLDER
        ) {

          showAlert(

            "info",

            "Web3Forms key needed",

            "Add your Web3Forms access key before publishing this form."

          );


          return;

        }



        /*
        Invisible honeypot.
        Normal visitors never see this.
        */

        if (
          honeypot?.value
        ) {

          return;

        }



        /*
        Human visitors cannot normally
        complete a form instantly.
        */

        if (
          Date.now() -
          Number(
            form.dataset.startedAt || 0
          ) <
          1800
        ) {

          showAlert(

            "error",

            "Please try again",

            "The form was submitted too quickly. Please check your details and submit again."

          );


          form.dataset.startedAt =
            String(
              Date.now() - 2500
            );


          return;

        }



        /*
        HTML validation
        */

        if (
          !form.checkValidity()
        ) {

          flagField(

            form.querySelector(
              ":invalid"
            ),

            "Please complete the required fields with valid details."

          );


          return;

        }



        /*
        Name validation
        */

        if (
          !name ||
          name.value
            .trim()
            .length <
          2 ||
          /https?:\/\/|www\./i
            .test(
              name.value
            )
        ) {

          flagField(

            name,

            "Please enter your name."

          );


          return;

        }



        /*
        Email validation
        */

        if (
          !email ||
          emailIsBlocked(
            email.value
          )
        ) {

          flagField(

            email,

            "Please use your own genuine email address for the enquiry."

          );


          return;

        }



        /*
        Phone validation
        */

        const phoneError =
          validatePhone(
            phone?.value || ""
          );


        if (
          phoneError
        ) {

          flagField(
            phone,
            phoneError
          );


          return;

        }



        /*
        Require a real service choice.
        */

        if (
          !service?.value
        ) {

          flagField(

            service,

            "Please choose the service you are enquiring about."

          );


          return;

        }



        /*
        The short hero form has no
        textarea.

        The longer form does.

        This combines whichever fields
        exist and checks them for
        supplier / outreach spam.
        */

        const pitchText =
          [
            business?.value,
            message?.value
          ]
            .filter(Boolean)
            .join(" ");


        if (
          looksLikeSalesPitch(
            pitchText
          )
        ) {

          flagField(

            message || business,

            "This form is for client enquiries. Sales pitches, SEO outreach, backlink offers and supplier promotions are not accepted."

          );


          return;

        }



        /*
        Detailed form message validation.
        Hero form skips this because
        there is no message field.
        */

        if (
          message &&
          message.value
            .trim()
            .length <
          20
        ) {

          flagField(

            message,

            "Please add a little more detail about the project."

          );


          return;

        }



        /*
        Stops rapid duplicate enquiries.
        */

        const lastSubmission =
          Number(
            localStorage.getItem(
              "cduk_last_enquiry"
            ) || 0
          );


        if (
          lastSubmission &&
          Date.now() -
          lastSubmission <
          45000
        ) {

          showAlert(

            "info",

            "Enquiry already sent",

            "Please wait before sending another enquiry."

          );


          return;

        }



        /*
        Build submission object.
        */

        const payload =
          Object.fromEntries(
            new FormData(
              form
            ).entries()
          );


        delete payload
          .website_confirm;


        payload.page_url =
          window.location.href;


        payload.submitted_at =
          new Date()
            .toISOString();


        payload.email =
          email.value
            .trim()
            .toLowerCase();


        payload.phone =
          phone.value
            .trim();



        /*
        Loading state.
        */

        const originalText =
          button.textContent;


        button.disabled =
          true;


        button.textContent =
          "Sending…";


        if (
          status
        ) {

          status.textContent =
            "Sending your enquiry…";

        }



        try {

          const response =
            await fetch(

              WEB3FORMS_ENDPOINT,

              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json",

                  "Accept":
                    "application/json"

                },

                body:
                  JSON.stringify(
                    payload
                  )

              }

            );


          const data =
            await response
              .json()
              .catch(
                () => ({})
              );


          if (
            !response.ok ||
            data.success === false
          ) {

            throw new Error(
              data.message ||
              "Submission failed"
            );

          }



          localStorage.setItem(

            "cduk_last_enquiry",

            String(
              Date.now()
            )

          );


          form.reset();


          form.dataset.startedAt =
            String(
              Date.now()
            );


          if (
            status
          ) {

            status.textContent =
              "Your enquiry has been sent.";

          }


          showAlert(

            "success",

            "Thank you!",

            "Our team will get in touch with you soon."

          );

        }

        catch (error) {

          console.error(
            error
          );


          if (
            status
          ) {

            status.textContent =
              "We could not send the form. Please try again.";

          }


          showAlert(

            "error",

            "Something went wrong",

            "Please try again or contact Clean Design UK on WhatsApp."

          );

        }

        finally {

          button.disabled =
            false;


          button.textContent =
            originalText;

        }

      }
    );

  }



  function initForms() {

    document
      .querySelectorAll(
        ".js-web3form"
      )
      .forEach(
        initForm
      );

  }



  /*
  ============================================================
  FAQ
  ============================================================
  */

  function initFaq() {

    document
      .querySelectorAll(
        ".faq-question"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const answer =
                button
                  .nextElementSibling;


              const opening =
                button.getAttribute(
                  "aria-expanded"
                ) !==
                "true";


              button.setAttribute(

                "aria-expanded",

                String(opening)

              );


              if (
                answer
              ) {

                answer.style.maxHeight =
                  opening
                    ? `${answer.scrollHeight}px`
                    : "0px";

              }

            }
          );

        }
      );

  }



  /*
  ============================================================
  COOKIE BANNER
  ============================================================
  */

  function initCookieBanner() {

    const banner =
      document.querySelector(
        "[data-cookie-banner]"
      );


    if (
      !banner
    ) {

      return;

    }


    if (
      localStorage.getItem(
        "cduk_cookie_choice"
      )
    ) {

      banner.hidden =
        true;


      return;

    }


    banner.hidden =
      false;


    banner
      .querySelectorAll(
        "[data-cookie-choice]"
      )
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              localStorage.setItem(

                "cduk_cookie_choice",

                button.dataset
                  .cookieChoice ||
                "essential"

              );


              banner.hidden =
                true;

            }
          );

        }
      );

  }



  /*
  ============================================================
  COPYRIGHT YEAR
  ============================================================
  */

  function initYear() {

    document
      .querySelectorAll(
        "[data-current-year]"
      )
      .forEach(
        (node) => {

          node.textContent =
            String(
              new Date()
                .getFullYear()
            );

        }
      );

  }



  /*
  ============================================================
  BOOT
  ============================================================
  */

  async function boot() {

    await Promise.all([

      injectComponent(
        "[data-component='navbar']",
        "/components/navbar.html"
      ),

      injectComponent(
        "[data-component='footer']",
        "/components/footer.html"
      )

    ]);


    initNavigation();

    initForms();

    initFaq();

    initCookieBanner();

    initYear();

  }



  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      boot,

      {
        once: true
      }

    );

  }

  else {

    boot();

  }

})();