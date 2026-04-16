const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = document.querySelectorAll(".nav-list a");
const scrollTopLinks = document.querySelectorAll("[data-scroll-top]");
const signupForm = document.querySelector("#signup-form");
const statusMessage = document.querySelector("#form-status");
const pageLoader = document.querySelector("#page-loader");

document.body.classList.add("is-loading");

const hidePageLoader = () => {
  if (!pageLoader || pageLoader.classList.contains("is-hidden")) {
    document.body.classList.remove("is-loading");
    return;
  }

  pageLoader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
};

window.addEventListener("load", () => {
  window.setTimeout(hidePageLoader, 450);
});

window.setTimeout(hidePageLoader, 2200);

if (navToggle && primaryNav) {
  const closeNavigation = () => {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Otvori navigaciju");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Zatvori navigaciju" : "Otvori navigaciju");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNavigation();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedOutsideNav = !primaryNav.contains(event.target) && !navToggle.contains(event.target);

    if (clickedOutsideNav) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

scrollTopLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (primaryNav && navToggle) {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Otvori navigaciju");
    }
  });
});

if (signupForm) {
  const validators = {
    "parent-name": (value) =>
      value.trim().length >= 2 ? "" : "Unesite ime i prezime roditelja.",
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
        ? ""
        : "Unesite ispravnu e-mail adresu.",
    phone: (value) =>
      value.trim().length >= 8 ? "" : "Unesite broj telefona za povratni kontakt.",
    "child-grade": (value) => (value ? "" : "Odaberite razred djeteta."),
    "module-interest": (value) => (value ? "" : "Odaberite modul koji vas zanima.")
  };

  const showError = (field, message) => {
    const errorElement = document.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const validateField = (field) => {
    const validator = validators[field.id];

    if (!validator) {
      return true;
    }

    const message = validator(field.value);
    showError(field, message);
    return !message;
  };

  signupForm.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Array.from(signupForm.querySelectorAll("input, select"));
    const isValid = fields.every((field) => validateField(field));

    if (!isValid) {
      statusMessage.textContent = "Provjerite označena polja i pokušajte ponovno.";
      statusMessage.style.color = "#c2410c";

      const firstInvalidField = signupForm.querySelector('[aria-invalid="true"]');

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return;
    }

    statusMessage.textContent =
      "Upit je uspješno zaprimljen kao front-end simulacija. Sljedeći korak je povezivanje forme s backendom ili servisom za slanje podataka.";
    statusMessage.style.color = "#0f766e";
    signupForm.reset();

    signupForm.querySelectorAll("input, select").forEach((field) => {
      field.setAttribute("aria-invalid", "false");
      showError(field, "");
    });
  });
}
