import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";

const STORAGE_KEY = "arafinestra_calculator_state";

export default function CalculatorRecoveryBanner() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || "ca";
  const location = useLocation();
  const [savedState, setSavedState] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.step >= 2 && parsed?.tipo) {
          setSavedState(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Don't show on calculator page, admin, or if dismissed
  if (!savedState || dismissed) return null;
  if (location.pathname.includes("/pressupost") || location.pathname.includes("/admin")) return null;

  const summary = [
    savedState.tipo,
    savedState.ancho && savedState.alto ? `${savedState.ancho}x${savedState.alto}cm` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[46] max-w-sm animate-slideInToast">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-navy-900">{t("calculator_recovery.title")}</p>
        {summary && <p className="text-xs text-slate-500">{summary}</p>}
        <div className="flex gap-2">
          <Link
            to={`/${prefix}/pressupost`}
            className="flex-1 text-center px-3 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t("calculator_recovery.resume")}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setDismissed(true);
            }}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            {t("calculator_recovery.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
