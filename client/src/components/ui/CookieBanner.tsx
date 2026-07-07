import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { initAnalytics } from "../../lib/analytics";

const CONSENT_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay for slide-up effect
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
    initAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t("cookies_banner.text")}
      className="fixed bottom-[60px] md:bottom-0 left-0 right-0 z-[55] animate-slideUp"
    >
      <div className="bg-navy-900 text-white px-4 py-4 sm:px-6 sm:py-5 shadow-2xl pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base">
              {t("cookies_banner.text")}{" "}
            <Link
              to={`/${prefix}/legal/cookies`}
              className="underline hover:text-slate-300 transition-colors"
            >
              {t("cookies_banner.link")}
            </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="px-5 py-3.5 text-sm font-medium border border-white/40 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors text-center"
            >
              {t("cookies_banner.reject")}
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-3.5 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-dark active:bg-brand-dark transition-colors text-center"
            >
              {t("cookies_banner.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
