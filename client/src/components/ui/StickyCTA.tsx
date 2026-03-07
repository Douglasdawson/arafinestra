import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";

export default function StickyCTA() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const prefix = lang || i18n.language || "ca";
  const [visible, setVisible] = useState(false);

  // Only show on content pages, not on calculator or admin
  const isAllowed =
    !location.pathname.startsWith("/admin") &&
    !location.pathname.includes("/pressupost") &&
    !location.pathname.includes("/visita-gratuita") &&
    !location.pathname.includes("/contacte") &&
    !location.pathname.includes("/legal");

  useEffect(() => {
    if (!isAllowed) return;
    const onScroll = () => {
      // Show after scrolling past ~600px (past the hero)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAllowed]);

  if (!isAllowed || !visible) return null;

  return (
    <div className="fixed top-16 right-4 z-[39] hidden md:block animate-fadeIn">
      <Link
        to={`/${prefix}/pressupost`}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg shadow-lg shadow-brand/25 hover:bg-brand-dark transition-all hover:scale-105 active:scale-[0.97]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>
        {t("sticky_cta")}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
