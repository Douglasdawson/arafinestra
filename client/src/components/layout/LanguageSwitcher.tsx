import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const LANGS = ["ca", "es", "en"] as const;

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
            className={`text-xs font-medium uppercase px-1 py-0.5 rounded transition-colors ${
              i18n.language === l || i18n.language.startsWith(l + "-")
                ? "text-sky-600 font-bold"
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
