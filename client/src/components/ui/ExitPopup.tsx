import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "exit_popup_dismissed";
const DISMISS_DAYS = 7;

// Only show on these route patterns (home + service pages)
const ALLOWED_PATTERNS = [
  /^\/[a-z]{2}$/, // home /:lang
  /^\/$/, // root
  /^\/[a-z]{2}\/serveis\//, // service pages
  /^\/[a-z]{2}\/cortizo$/, // cortizo
  /^\/[a-z]{2}\/subvencions$/, // subvenciones
  /^\/[a-z]{2}\/zones/, // zones
  /^\/[a-z]{2}\/contacte$/, // contact
];

function isAllowedRoute(pathname: string): boolean {
  return ALLOWED_PATTERNS.some((p) => p.test(pathname));
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const until = parseInt(raw, 10);
    if (Date.now() < until) return true;
    localStorage.removeItem(STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(until));
  } catch {
    // ignore
  }
}

export default function ExitPopup() {
  const { t } = useTranslation();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleClose = useCallback(() => {
    setVisible(false);
    dismiss();
  }, []);

  useEffect(() => {
    if (isDismissed()) return;
    if (!isAllowedRoute(location.pathname)) return;

    let triggered = false;
    const handler = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 0) {
        triggered = true;
        setVisible(true);
      }
    };

    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          origen: "popup",
        }),
      });
      setSubmitted(true);
      dismiss();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">&#10003;</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">
              {t("exit_popup.success_title", "Gràcies!")}
            </h3>
            <p className="text-gray-600">
              {t("exit_popup.success_text", "Et contactarem aviat amb el teu pressupost gratuït.")}
            </p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              {t("exit_popup.close", "Tancar")}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t("exit_popup.title", "Vols un pressupost gratuït?")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "exit_popup.subtitle",
                  "Deixa'ns les teves dades i et truquem sense compromís."
                )}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={t("exit_popup.name_placeholder", "El teu nom")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder={t("exit_popup.phone_placeholder", "El teu telèfon")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : t("exit_popup.cta", "Demana pressupost gratuït")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
