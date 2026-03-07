import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "exit_popup_dismissed";
const DISMISS_DAYS = 7;
const MOBILE_DELAY_MS = 15_000; // 15 seconds on mobile

// Only show on these route patterns (home + service pages)
const ALLOWED_PATTERNS = [
  /^\/[a-z]{2}$/, // home /:lang
  /^\/$/, // root
  /^\/[a-z]{2}\/serveis\//, // service pages
  /^\/[a-z]{2}\/cortizo$/, // cortizo
  /^\/[a-z]{2}\/subvencions$/, // subvenciones
  /^\/[a-z]{2}\/zones/, // zones
  /^\/[a-z]{2}\/contacte$/, // contact
  /^\/[a-z]{2}\/pressupost$/, // calculator
  /^\/[a-z]{2}\/projectes$/, // projects
  /^\/[a-z]{2}\/blog/, // blog
];

function isAllowedRoute(pathname: string): boolean {
  return ALLOWED_PATTERNS.some((p) => p.test(pathname));
}

function isMobile(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
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
  const [email, setEmail] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setVisible(false);
    dismiss();
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, handleClose]);

  useEffect(() => {
    if (isDismissed()) return;
    if (!isAllowedRoute(location.pathname)) return;

    let triggered = false;

    if (isMobile()) {
      // Mobile: show after 30 seconds
      timerRef.current = setTimeout(() => {
        if (!triggered) {
          triggered = true;
          setVisible(true);
        }
      }, MOBILE_DELAY_MS);
    } else {
      // Desktop: show when mouse leaves viewport (top)
      const handler = (e: MouseEvent) => {
        if (triggered) return;
        if (e.clientY <= 0) {
          triggered = true;
          setVisible(true);
        }
      };
      document.addEventListener("mouseleave", handler);
      return () => document.removeEventListener("mouseleave", handler);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
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
        className="relative rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t("exit_popup.title")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy header band */}
        <div className="bg-[var(--color-navy-900)] px-8 pt-8 pb-4 text-center">
          <span className="inline-block text-5xl mb-2">%</span>
          <h3 className="text-2xl font-bold text-white">
            {t("exit_popup.title")}
          </h3>
        </div>

        {/* White body */}
        <div className="bg-white px-8 pb-8 pt-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-lg text-white/70 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>

          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3 text-[var(--color-brand)]">&#10003;</div>
              <p className="text-[var(--color-navy-800)] font-medium text-lg">
                {t("exit_popup.success")}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-5">
                {t("exit_popup.subtitle")}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("exit_popup.placeholder")}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-[var(--color-brand-dark)] transition disabled:opacity-50"
                >
                  {loading ? "..." : t("exit_popup.button")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
