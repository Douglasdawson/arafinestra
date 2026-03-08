import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const SHOW_DURATION = 5000;
const HIDE_DURATION = 35000; // time between toasts
const DISMISSED_KEY = "social_proof_dismissed";

export default function SocialProofToast() {
  const { t } = useTranslation();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  // Don't show on admin or calculator pages
  const isAllowed =
    !location.pathname.startsWith("/admin") &&
    !location.pathname.includes("/pressupost");

  const generateMessage = useCallback(() => {
    const names = t("social_proof_toast.names", { returnObjects: true }) as string[];
    const cities = t("social_proof_toast.cities", { returnObjects: true }) as string[];
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const minutes = Math.floor(Math.random() * 25) + 3;
    const timeAgo = t("social_proof_toast.time_ago", { minutes });

    const rand = Math.random();
    let text: string;
    if (rand < 0.3) {
      text = `${name} (${city}) ${t("social_proof_toast.action_quote")}`;
    } else if (rand < 0.6) {
      text = `${name} (${city}) ${t("social_proof_toast.action_visit")}`;
    } else if (rand < 0.75) {
      text = `${name} (${city}) ${t("social_proof_toast.action_install")}`;
    } else {
      // Geographic FOMO — no name, zone activity
      text = t("social_proof_toast.action_zone", { city });
    }

    return `${text} — ${timeAgo}`;
  }, [t]);

  useEffect(() => {
    if (!isAllowed) return;

    // Don't show if dismissed recently
    try {
      const dismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (dismissed) return;
    } catch { /* ignore */ }

    // First toast after 20s
    const initialDelay = setTimeout(() => {
      setMessage(generateMessage());
      setVisible(true);
    }, 20000);

    return () => clearTimeout(initialDelay);
  }, [isAllowed, generateMessage]);

  useEffect(() => {
    if (!visible) return;

    // Hide after SHOW_DURATION
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, SHOW_DURATION);

    return () => clearTimeout(hideTimer);
  }, [visible, message]);

  useEffect(() => {
    if (visible || !isAllowed) return;
    if (!message) return; // hasn't shown first one yet

    // Show next toast after HIDE_DURATION
    const nextTimer = setTimeout(() => {
      setMessage(generateMessage());
      setVisible(true);
    }, HIDE_DURATION);

    return () => clearTimeout(nextTimer);
  }, [visible, isAllowed, message, generateMessage]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-28 md:bottom-6 left-4 z-[45] max-w-xs animate-slideInToast"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-3.5 pr-10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-700 leading-snug">{message}</p>
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full"
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
