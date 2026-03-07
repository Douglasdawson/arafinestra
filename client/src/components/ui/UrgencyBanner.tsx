import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";

const DISMISSED_KEY = "urgency_banner_dismissed";

export default function UrgencyBanner() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const prefix = lang || i18n.language || "ca";

  const [dismissed, setDismissed] = useState(() => {
    try {
      return !!sessionStorage.getItem(DISMISSED_KEY);
    } catch {
      return false;
    }
  });

  // Only show on key conversion pages
  const isAllowed =
    !location.pathname.startsWith("/admin") &&
    !location.pathname.includes("/pressupost") &&
    !location.pathname.includes("/legal");

  if (dismissed || !isAllowed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white relative z-[41]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 sm:gap-4 text-center">
        <svg className="w-4 h-4 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p className="text-xs sm:text-sm font-medium">
          {t("urgency_banner.text")}
        </p>
        <Link
          to={`/${prefix}/subvencions`}
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors flex-shrink-0"
        >
          {t("urgency_banner.cta")}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <button
          onClick={handleDismiss}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
