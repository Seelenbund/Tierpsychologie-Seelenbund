// responsive.js
// Gemeinsame mobile Anpassungen ohne die Desktop-Version umzubauen.

(function () {
  const MOBILE_QUERY = "(max-width: 900px)";
  const CHAT_CONSENT_KEY = "seelenbund-chat-consent";

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function isIntroPage() {
    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    return file === "index.html" || document.body.classList.contains("intro-page");
  }

  function setViewportHeightVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  }

  function setPageClass() {
    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const stem = file.replace(".html", "");
    const body = document.body;

    const pageMap = {
      "home": "home-page",
      "kontakt": "kontakt-page",
      "philosophie": "philosophie-page",
      "qualifikationen": "qualifikationen-page",
      "leistungenundpreise": "leistungen-page",
      "index": "intro-page"
    };

    body.classList.add(pageMap[stem] || `${stem}-page`);
  }

  function initMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    if (!menuToggle || !siteNav || menuToggle.dataset.responsiveBound === "true") return;

    menuToggle.dataset.responsiveBound = "true";

    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initPhilosophieImageToggle() {
    if (!document.body.classList.contains("philosophie-page")) return;
    const visual = document.querySelector(".hero-visual");
    if (!visual || visual.dataset.mobileToggleBound === "true") return;

    visual.dataset.mobileToggleBound = "true";

    visual.addEventListener("click", () => {
      if (!isMobile()) return;
      visual.classList.toggle("mobile-alt");
    });
  }

  function initQualifikationenYears() {
  return;
}

  function hideTawkOnMobile() {
  const selectors = [
    'iframe[src*="tawk.to"]',
    'iframe[title*="chat" i]',
    '#tawkchat-container',
    '.tawk-min-container',
    '.tawk-button',
    '.tawk-mobile',
    'div[id*="tawk"]',
    'div[class*="tawk"]'
  ];

  if (!isMobile()) return;

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.style.setProperty("width", "0", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("max-width", "0", "important");
      el.style.setProperty("max-height", "0", "important");
    });
  });

  if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
    window.Tawk_API.hideWidget();
  }
}

  function removeTawkBubbleSpace() {
    if (!isMobile()) return;
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.right = "0";
      footer.style.bottom = "0";
    }
  }

  function readChatConsent() {
    try {
      return window.localStorage.getItem(CHAT_CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeChatConsent(value) {
    try {
      window.localStorage.setItem(CHAT_CONSENT_KEY, value);
    } catch (error) {
      // Die Website bleibt auch bei blockiertem Browserspeicher nutzbar.
    }
  }

  function loadTawkChat() {
    if (isIntroPage() || isMobile() || document.getElementById("seelenbund-tawk-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = function () {
      if (typeof window.Tawk_API.minimize === "function") {
        window.Tawk_API.minimize();
      }
    };

    const script = document.createElement("script");
    script.id = "seelenbund-tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/69e0c8c03f5fe21c385b068f/1jmb10c0j";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  }

  function disableTawkChat() {
    if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
      window.Tawk_API.hideWidget();
    }

    const script = document.getElementById("seelenbund-tawk-script");
    if (script) script.remove();

    document.querySelectorAll([
      'iframe[src*="tawk.to"]',
      'iframe[title*="chat" i]',
      '#tawkchat-container',
      '.tawk-min-container',
      '.tawk-button',
      '.tawk-mobile',
      'div[id*="tawk"]',
      'div[class*="tawk"]'
    ].join(",")).forEach((element) => element.remove());
  }

  function updatePrivacyControl() {
    const button = document.querySelector("[data-chat-consent-manage]");
    if (!button) return;

    const consent = readChatConsent();
    button.textContent = consent === "granted"
      ? "Chat-Einwilligung widerrufen"
      : "Live-Chat erlauben";
  }

  function createConsentBanner() {
    if (isIntroPage() || isMobile() || document.querySelector(".privacy-consent")) return;

    const banner = document.createElement("aside");
    banner.className = "privacy-consent";
    banner.setAttribute("aria-label", "Datenschutzeinstellung für den Live-Chat");
    banner.innerHTML = `
      <div class="privacy-consent-copy">
        <strong>Live-Chat &amp; Datenschutz</strong>
        Der Live-Chat von tawk.to wird nur mit Ihrer Zustimmung geladen. Dabei können Daten in die USA übertragen sowie Cookies oder Browser-Speicher verwendet werden.
        <a href="impressum.html">Mehr erfahren</a>
      </div>
      <div class="privacy-consent-actions">
        <button class="privacy-consent-button privacy-consent-decline" type="button">Ablehnen</button>
        <button class="privacy-consent-button privacy-consent-accept" type="button">Zustimmen</button>
      </div>`;

    banner.querySelector(".privacy-consent-decline").addEventListener("click", () => {
      writeChatConsent("denied");
      banner.remove();
      updatePrivacyControl();
    });

    banner.querySelector(".privacy-consent-accept").addEventListener("click", () => {
      writeChatConsent("granted");
      banner.remove();
      loadTawkChat();
      updatePrivacyControl();
    });

    document.body.appendChild(banner);
  }

  function initChatConsent() {
    if (isIntroPage()) {
      document.querySelector(".privacy-consent")?.remove();
      disableTawkChat();
      return;
    }

    if (isMobile()) return;

    const consent = readChatConsent();
    if (consent === "granted") {
      loadTawkChat();
    } else if (consent !== "denied") {
      createConsentBanner();
    }

    const button = document.querySelector("[data-chat-consent-manage]");
    if (button && button.dataset.chatConsentBound !== "true") {
      button.dataset.chatConsentBound = "true";
      button.addEventListener("click", () => {
        const status = document.querySelector(".privacy-settings-status");
        if (readChatConsent() === "granted") {
          writeChatConsent("denied");
          disableTawkChat();
          if (status) status.textContent = "Der Live-Chat ist jetzt deaktiviert.";
        } else {
          writeChatConsent("granted");
          loadTawkChat();
          if (status) status.textContent = "Der Live-Chat ist jetzt erlaubt.";
        }
        updatePrivacyControl();
      });
    }

    updatePrivacyControl();
  }

  function applyMobileEnhancements() {
    hideTawkOnMobile();
    removeTawkBubbleSpace();
    initPhilosophieImageToggle();
    initQualifikationenYears();
    initPhilosophieImageToggle();
  }

  function initFooterContent() {
    const footerInner = document.querySelector("footer .footer-inner");
    if (!footerInner || footerInner.querySelector(".footer-socials")) return;

    const copyright = footerInner.querySelector("div");
    if (copyright) {
      copyright.classList.add("footer-copyright");
      copyright.innerHTML = "© Urheberrecht. Alle Rechte vorbehalten.<span class=\"footer-brandline\">2026 Tierpsychologie Seelenbund.</span>";
    }

    const socials = document.createElement("div");
    socials.className = "footer-socials notranslate";
    socials.setAttribute("translate", "no");
    socials.setAttribute("aria-label", "Kontakt und soziale Medien");
    socials.innerHTML = `
      <span class="footer-icon footer-icon-instagram" role="img" aria-label="Instagram" title="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.7" r="0.8" fill="currentColor" stroke="none"></circle></svg>
      </span>
      <span class="footer-icon footer-icon-facebook" role="img" aria-label="Facebook" title="Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8H17V4.2c-.5-.1-2.1-.2-4-.2-3.9 0-6.6 2.4-6.6 6.8V14H2v4.3h4.4V24h5.4v-5.7h4.4L17 14h-5.2v-2.8C11.8 9.9 12.2 8 14.2 8Z"></path></svg>
      </span>
      <a class="footer-icon footer-icon-email" href="mailto:info@tierpsychologie-seelenbund.de" aria-label="E-Mail an info@tierpsychologie-seelenbund.de" title="info@tierpsychologie-seelenbund.de">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>
      </a>
      <a class="footer-icon footer-icon-phone" href="tel:+4917687925330" aria-label="Telefon 0176-87925330" title="0176-87925330">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.5 10 7.8 8.2 10c1.2 2.5 3.2 4.5 5.8 5.8l2.2-1.8 4.3 2.8-.8 3.5c-.2.8-.9 1.3-1.7 1.3C9.4 21.6 2.4 14.6 2.4 6c0-.8.5-1.5 1.3-1.7l3.5-.8Z"></path></svg>
      </a>`;

    const imprintLink = footerInner.querySelector("a[href*='impressum']");
    footerInner.insertBefore(socials, imprintLink || null);
  }

  const siteLanguages = [
    { code: "de", short: "DE", label: "Deutsch" },
    { code: "en", short: "EN", label: "English" },
    { code: "pl", short: "PL", label: "Polski" },
    { code: "tr", short: "TR", label: "Türkçe" },
    { code: "ru", short: "RU", label: "Русский" },
    { code: "es", short: "ES", label: "Español" },
    { code: "it", short: "IT", label: "Italiano" }
  ];

  const languageSessionKey = "seelenbund-language";
  const languageWindowPrefix = "seelenbund-language:";

  function readWindowLanguage() {
    return window.name.startsWith(languageWindowPrefix)
      ? window.name.slice(languageWindowPrefix.length)
      : null;
  }

  function writeWindowLanguage(language) {
    window.name = language === "de" ? "" : `${languageWindowPrefix}${language}`;
  }

  function setTranslateCookie(language) {
    const isGerman = language === "de";
    const value = isGerman ? "" : `/de/${language}`;
    const expiry = isGerman ? "; expires=Thu, 01 Jan 1970 00:00:00 GMT" : "";
    document.cookie = `googtrans=${value}; path=/; SameSite=Lax${expiry}`;

    if (window.location.hostname && window.location.hostname !== "localhost") {
      document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}; SameSite=Lax${expiry}`;
    }
  }

  function updateInternalLanguageLinks(language) {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      try {
        const url = new URL(href, window.location.href);
        if (window.location.protocol === 'file:') {
          if (url.protocol !== 'file:') return;
        } else if (url.origin !== window.location.origin) {
          return;
        }
        if (language === 'de') url.searchParams.delete('lang');
        else url.searchParams.set('lang', language);
        link.setAttribute('href', url.href);
      } catch (_) {
        /* Ungültige oder externe Links bleiben unverändert. */
      }
    });
  }

  function initLanguageSwitcher() {
    if (isIntroPage()) return;
    if (document.querySelector(".language-switcher")) return;

    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    let selectedLanguage = siteLanguages.some((language) => language.code === requestedLanguage)
      ? requestedLanguage
      : readWindowLanguage() || sessionStorage.getItem(languageSessionKey);
    if (!siteLanguages.some((language) => language.code === selectedLanguage)) {
      selectedLanguage = "de";
      writeWindowLanguage("de");
      setTranslateCookie("de");
    } else {
      sessionStorage.setItem(languageSessionKey, selectedLanguage);
      writeWindowLanguage(selectedLanguage);
      setTranslateCookie(selectedLanguage);
    }

    document.documentElement.lang = selectedLanguage;
    if (selectedLanguage !== "de") {
      const localizedUrl = new URL(window.location.href);
      localizedUrl.searchParams.set("lang", selectedLanguage);
      window.history.replaceState(null, "", localizedUrl.href);
      document.documentElement.classList.add("translation-pending");
      window.setTimeout(() => document.documentElement.classList.remove("translation-pending"), 6500);
    }

    const switcher = document.createElement("div");
    switcher.className = "language-switcher notranslate";
    switcher.setAttribute("translate", "no");

    const toggle = document.createElement("button");
    toggle.className = "language-switcher-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Sprache auswählen");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = siteLanguages.find((language) => language.code === selectedLanguage)?.short || "DE";

    const menu = document.createElement("div");
    menu.className = "language-switcher-menu";
    menu.hidden = true;

    let translationRetryTimer = null;

    const translationIsVisible = () =>
      document.documentElement.classList.contains("translated-ltr") ||
      document.documentElement.classList.contains("translated-rtl") ||
      document.body.classList.contains("translated-ltr") ||
      document.body.classList.contains("translated-rtl");

    const activateSelectedLanguage = () => {
      if (selectedLanguage === "de") {
        document.documentElement.classList.remove("translation-pending");
        return;
      }

      if (translationRetryTimer) window.clearInterval(translationRetryTimer);
      document.documentElement.classList.add("translation-pending");
      let attempts = 0;

      const applyTranslation = () => {
        attempts += 1;
        const googleSelect = document.querySelector(".goog-te-combo");

        if (googleSelect && !translationIsVisible()) {
          googleSelect.value = selectedLanguage;
          googleSelect.dispatchEvent(new Event("change"));
        }

        if (translationIsVisible()) {
          window.clearInterval(translationRetryTimer);
          translationRetryTimer = null;
          window.setTimeout(() => document.documentElement.classList.remove("translation-pending"), 450);
        } else if (attempts >= 60) {
          window.clearInterval(translationRetryTimer);
          translationRetryTimer = null;
          document.documentElement.classList.remove("translation-pending");
        }
      };

      applyTranslation();
      translationRetryTimer = window.setInterval(applyTranslation, 250);
    };

    updateInternalLanguageLinks(selectedLanguage);

    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      const activeLanguage = readWindowLanguage() || sessionStorage.getItem(languageSessionKey) || requestedLanguage || "de";
      if (!link || activeLanguage === "de" || link.hasAttribute("target")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      try {
        const url = new URL(href, window.location.href);
        const isInternal = window.location.protocol === "file:"
          ? url.protocol === "file:"
          : url.origin === window.location.origin;
        if (!isInternal) return;

        url.searchParams.set("lang", activeLanguage);
        event.preventDefault();
        event.stopImmediatePropagation();
        document.body.classList.remove("page-visible");
        document.body.classList.add("page-fade-out");
        window.setTimeout(() => { window.location.href = url.href; }, 350);
      } catch (_) {
        /* Navigation bleibt bei ungültigen URLs unverändert. */
      }
    }, true);

    siteLanguages.forEach((language) => {
      const option = document.createElement("button");
      option.className = "language-option";
      option.classList.toggle("active", language.code === selectedLanguage);
      option.type = "button";
      option.dataset.language = language.code;
      option.textContent = language.label;
      option.addEventListener("click", () => {
        sessionStorage.setItem(languageSessionKey, language.code);
        writeWindowLanguage(language.code);
        selectedLanguage = language.code;
        setTranslateCookie(language.code);
        document.documentElement.lang = language.code;
        updateInternalLanguageLinks(language.code);

        if (language.code === "de") {
          sessionStorage.removeItem(languageSessionKey);
          writeWindowLanguage("de");
          const germanUrl = new URL(window.location.href);
          germanUrl.searchParams.delete("lang");
          window.location.href = germanUrl.href;
          return;
        }

        const localizedUrl = new URL(window.location.href);
        localizedUrl.searchParams.set("lang", language.code);
        window.history.replaceState(null, "", localizedUrl.href);

        toggle.textContent = language.short;
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        menu.querySelectorAll(".language-option").forEach((item) => item.classList.toggle("active", item === option));
        activateSelectedLanguage();
      });
      menu.appendChild(option);
    });

    toggle.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
      toggle.setAttribute("aria-expanded", String(!menu.hidden));
    });

    document.addEventListener("click", (event) => {
      if (!switcher.contains(event.target)) {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    switcher.append(toggle, menu);
    document.body.appendChild(switcher);

    const translateMount = document.createElement("div");
    translateMount.id = "google_translate_element";
    translateMount.hidden = true;
    document.body.appendChild(translateMount);

    window.googleTranslateElementInit = function () {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({
        pageLanguage: "de",
        includedLanguages: "en,es,it,pl,ru,tr",
        autoDisplay: false
      }, "google_translate_element");

      activateSelectedLanguage();
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }

  function init() {
    setViewportHeightVar();
    setPageClass();
    initMenu();
    initChatConsent();
    applyMobileEnhancements();
    initFooterContent();
    initLanguageSwitcher();
  }

  window.addEventListener("load", init);
  window.addEventListener("resize", () => {
    setViewportHeightVar();
    initChatConsent();
    applyMobileEnhancements();
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      setViewportHeightVar();
      applyMobileEnhancements();
    }, 120);
  });

  const cleaner = setInterval(() => {
  applyMobileEnhancements();
}, 500);

const observer = new MutationObserver(() => {
  applyMobileEnhancements();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
})();
