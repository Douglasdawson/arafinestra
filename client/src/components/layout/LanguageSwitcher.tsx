import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const LANGS = ["ca", "es", "en"] as const;

const LANG_ARIA_LABELS: Record<string, string> = {
  ca: "Canviar a Català",
  es: "Cambiar a Español",
  en: "Switch to English",
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();

  function switchLang(newLang: string) {
    i18n.changeLanguage(newLang);
    // Update the URL path prefix
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (lang && LANGS.includes(pathSegments[0] as typeof LANGS[number])) {
      pathSegments[0] = newLang;
    } else {
      pathSegments.unshift(newLang);
    }
    navigate("/" + pathSegments.join("/") + location.search);
  }

  return (
    <div className="flex items-center gap-1">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-slate-300 text-xs mx-0.5">|</span>}
          <button
            onClick={() => switchLang(l)}
            aria-label={LANG_ARIA_LABELS[l]}
            className={`text-xs font-medium uppercase px-2 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded transition-colors ${
              i18n.language === l || i18n.language.startsWith(l + "-")
                ? "text-brand font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
