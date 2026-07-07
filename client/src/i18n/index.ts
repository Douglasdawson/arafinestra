import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ca from "./ca.json";

// Only the Catalan fallback ships in the entry bundle; es/en (~60KB each)
// load on demand for the active language.
const LOADERS: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  es: () => import("./es.json"),
  en: () => import("./en.json"),
};

async function loadLanguage(lng: string) {
  const base = lng.split("-")[0];
  if (base === "ca" || i18n.hasResourceBundle(base, "translation")) return;
  const loader = LOADERS[base];
  if (!loader) return;
  try {
    const mod = await loader();
    i18n.addResourceBundle(base, "translation", mod.default, true, true);
    // re-emit so react-i18next re-renders with the freshly loaded bundle
    await i18n.changeLanguage(base);
  } catch {
    // network hiccup: Catalan fallback keeps the UI functional
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
    },
    fallbackLng: "ca",
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "navigator"],
      lookupFromPathIndex: 0,
    },
  });

void loadLanguage(i18n.language || "ca");

// Keep <html lang> in sync with the active language (SEO on prerendered
// snapshots + correct screen-reader pronunciation on SPA language switches).
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  void loadLanguage(lng);
});
if (typeof document !== "undefined" && i18n.language) {
  document.documentElement.lang = i18n.language;
}

export default i18n;
