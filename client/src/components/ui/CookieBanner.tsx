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
    setVisible(false);
    initAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-out animate-slideUp"
      style={{ animation: "slideUp 0.5s ease-out forwards" }}
    >
      <div className="bg-navy-900 text-white px-4 py-4 sm:px-6 sm:py-5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm sm:text-base text-center sm:text-left">
            {t("cookies_banner.text")}{" "}
            <Link
              to={`/${prefix}/legal/cookies`}
              className="underline hover:text-slate-300 transition-colors"
            >
              {t("cookies_banner.link")}
            </Link>
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-5 py-2 text-sm font-medium border border-white/40 rounded-lg hover:bg-white/10 transition-colors"
            >
              {t("cookies_banner.reject")}
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
            >
              {t("cookies_banner.accept")}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
