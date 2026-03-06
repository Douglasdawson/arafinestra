import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const PHONE = "+34 XXX XXX XXX";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const prefix = lang || i18n.language || "ca";
  const isHome = location.pathname === "/" || location.pathname === `/${prefix}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
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
    { to: `/${prefix}/blog`, label: t("nav.blog") },
    { to: `/${prefix}/contacte`, label: t("nav.contact") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white shadow-md"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={`/${prefix}`}
              className="text-xl font-bold tracking-tight text-slate-800 hover:text-sky-600 transition-colors"
            >
              ARA FINESTRA
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Services dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
                >
                  {t("nav.services")}
                  <svg
                    className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setServicesOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
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
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
              >
                {PHONE}
              </a>
              <LanguageSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-lg font-bold text-slate-800">ARA FINESTRA</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t("nav.services")}
              </p>
              {serviceLinks.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="block px-3 py-2 rounded-md text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  {s.label}
                </Link>
              ))}

              <div className="my-3 border-t border-slate-100" />

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-3">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="block text-center py-2 px-4 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
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

      {/* Spacer so content is not behind fixed header */}
      <div className="h-16" />
    </>
  );
}
