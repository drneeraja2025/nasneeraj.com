(function () {
  if (window.__saaniyaSiteLang) return;
  window.__saaniyaSiteLang = true;

  var KEY = "saaniya-site-lang";
  var LABELS = [
    ["en", "EN"],
    ["es", "ES"],
    ["hi", "हि"],
  ];

  function read() {
    try {
      var value = localStorage.getItem(KEY) || "en";
      return value === "es" || value === "hi" ? value : "en";
    } catch (error) {
      return "en";
    }
  }

  function writeCookie(code) {
    var host = location.hostname;
    var clear = "googtrans=;path=/;max-age=0";
    document.cookie = clear;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      document.cookie = clear + ";domain=." + host;
    }
    if (code === "en") return;
    var set = "googtrans=/en/" + code + ";path=/";
    document.cookie = set;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      document.cookie = set + ";domain=." + host;
    }
  }

  function setLang(code) {
    var next = code === "es" || code === "hi" ? code : "en";
    if (next === read()) return;
    try {
      localStorage.setItem(KEY, next);
    } catch (error) {
      /* private mode */
    }
    writeCookie(next);
    try {
      sessionStorage.setItem("saaniya-chat-lang", next === "es" ? "es-ES" : next === "hi" ? "hi-IN" : "en-US");
    } catch (error) {
      /* private mode */
    }
    location.reload();
  }

  window.saaniyaSetSiteLang = setLang;

  function paint() {
    var current = read();
    var bar = document.createElement("div");
    bar.className = "site-lang notranslate";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Language");
    LABELS.forEach(function (pair) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "site-lang__btn";
      button.textContent = pair[1];
      button.setAttribute("aria-pressed", pair[0] === current ? "true" : "false");
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        setLang(pair[0]);
      });
      bar.appendChild(button);
    });
    var logo = document.querySelector(".nav-logo, a.brand, .nav-company");
    if (logo) {
      logo.appendChild(bar);
      return;
    }
    var slot = document.querySelector(".nav-inner, .nav-container, nav.navbar, nav.nav, header .site-header");
    if (slot) slot.appendChild(bar);
    else document.body.appendChild(bar);
  }

  function hideBanner() {
    var style = document.createElement("style");
    style.textContent =
      ".site-lang{display:inline-flex;flex-flow:row nowrap;align-items:center;justify-content:center;gap:0.28rem;margin:0;max-width:100%}" +
      ".site-lang__btn{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:1.7rem;height:0.9rem;padding:0;margin:0;flex:0 0 1.7rem;border:1px solid rgba(16,38,31,.25);background:#fff;color:#10261f;border-radius:999px;font:600 0.58rem/1 \"Segoe UI\",sans-serif;cursor:pointer}" +
      ".site-lang__btn[aria-pressed='true']{background:#1f5c45;color:#fff;border-color:#1f5c45}" +
      "iframe.goog-te-banner-frame,.goog-te-banner-frame,.goog-te-balloon-frame,#goog-gt-tt{display:none!important}" +
      "body{top:0!important}" +
      "#google_translate_element{position:absolute;left:-9999px;height:0;overflow:hidden}";
    document.head.appendChild(style);
  }

  function loadTranslate() {
    if (read() === "en" || document.getElementById("google-translate-script")) return;
    var holder = document.createElement("div");
    holder.id = "google_translate_element";
    document.body.appendChild(holder);
    window.googleTranslateElementInit = function () {
      if (!window.google || !google.translate || !google.translate.TranslateElement) return;
      new google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "es,hi", autoDisplay: false },
        "google_translate_element"
      );
    };
    var script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  }

  function start() {
    hideBanner();
    paint();
    writeCookie(read());
    loadTranslate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
