import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";

const DISMISSED_KEY = "urgency_banner_dismissed";

function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function getDaysRemaining(): number {
  const now = new Date();
  const end = getEndOfMonth();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

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

  const [daysLeft, setDaysLeft] = useState(getDaysRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft(getDaysRemaining());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

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
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <p className="text-xs sm:text-sm font-medium">
          {t("urgency_banner.countdown", { days: daysLeft })}
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
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 text-white/70 hover:text-white"
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
