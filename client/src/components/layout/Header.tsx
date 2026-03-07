import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const PHONE = "+34 611 500 372";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const prefix = lang || i18n.language || "ca";
  const isHomePath = location.pathname === "/" || location.pathname === `/${prefix}`;

  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsWide(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isHome = isHomePath && isWide;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const serviceLinks = [
    { to: `/${prefix}/serveis/finestres-pvc`, label: t("nav.windows") },
    { to: `/${prefix}/serveis/portes-corredisses`, label: t("nav.sliding_doors") },
    { to: `/${prefix}/serveis/persianes`, label: t("nav.shutters") },
    { to: `/${prefix}/serveis/mosquiteres`, label: t("nav.mosquito_nets") },
  ];

  const navLinks = [
    { to: `/${prefix}/pressupost`, label: t("nav.calculator") },
    { to: `/${prefix}/projectes`, label: t("nav.projects") },
    { to: `/${prefix}/qui-som`, label: t("nav.about") },
    { to: `/${prefix}/blog`, label: t("nav.blog") },
    { to: `/${prefix}/contacte`, label: t("nav.contact") },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = serviceLinks.some((s) => location.pathname === s.to);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100/50"
            : "bg-transparent"
        }`}
        style={{ animation: "slideDown 0.6s ease-out" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            {/* Logo */}
            <Link to={`/${prefix}`} className="group flex items-center gap-2">
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled || !isHome ? "text-navy-800" : "text-white"
                } group-hover:text-brand`}
              >
                ARA FINESTRA
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Services dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isServiceActive
                      ? "text-brand"
                      : scrolled || !isHome
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t("nav.services")}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {isServiceActive && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />
                  )}
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-100 py-2 overflow-hidden animate-fadeIn">
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setServicesOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive(s.to)
                            ? "text-brand bg-brand-light font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.to)
                      ? "text-brand"
                      : scrolled || !isHome
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className={`text-sm font-medium transition-colors ${
                  scrolled || !isHome
                    ? "text-slate-600 hover:text-brand"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {PHONE}
              </a>
              <LanguageSwitcher />
              <Link
                to={`/${prefix}/visita-gratuita`}
                className="bg-brand text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-all"
              >
                {t("cta.free_visit")}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-3 rounded-lg transition-colors ${
                scrolled || !isHome
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 rounded-full transition-all duration-200 ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  } ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-200 ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  } ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 rounded-full transition-all duration-200 ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  } ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
            style={{ animation: "slideInRight 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-lg font-bold text-navy-800">ARA FINESTRA</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tancar menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t("nav.services")}
              </p>
              {serviceLinks.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(s.to)
                      ? "bg-brand-light text-brand"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {s.label}
                </Link>
              ))}

              <div className="my-3 border-t border-slate-100" />

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-brand-light text-brand"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-3">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="block text-center py-3 px-4 bg-brand text-white rounded-xl font-medium hover:bg-brand-dark transition-colors"
              >
                {t("cta.call_us")} {PHONE}
              </a>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
