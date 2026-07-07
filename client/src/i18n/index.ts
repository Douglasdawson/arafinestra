import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ca from "./ca.json";
import es from "./es.json";
import en from "./en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "ca",
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "navigator"],
      lookupFromPathIndex: 0,
    },
  });

// Keep <html lang> in sync with the active language (SEO on prerendered
// snapshots + correct screen-reader pronunciation on SPA language switches).
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});
if (typeof document !== "undefined" && i18n.language) {
  document.documentElement.lang = i18n.language;
}

export default i18n;
