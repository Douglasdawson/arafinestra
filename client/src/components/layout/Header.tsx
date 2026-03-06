import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    { to: `/${prefix}/blog`, label: t("nav.blog") },
    { to: `/${prefix}/contacte`, label: t("nav.contact") },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = serviceLinks.some((s) => location.pathname === s.to);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100/50"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            {/* Logo */}
            <Link
              to={`/${prefix}`}
              className="group flex items-center gap-2"
            >
              <motion.span
                className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled || !isHome ? "text-slate-800" : "text-white"
                } group-hover:text-sky-600`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                ARA FINESTRA
              </motion.span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Services dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isServiceActive
                      ? "text-sky-600"
                      : scrolled || !isHome
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t("nav.services")}
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: servicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                  {isServiceActive && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 rounded-full"
                      layoutId="nav-indicator"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-100 py-2 overflow-hidden"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {serviceLinks.map((s, i) => (
                        <motion.div
                          key={s.to}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            to={s.to}
                            onClick={() => setServicesOpen(false)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(s.to)
                                ? "text-sky-600 bg-sky-50 font-medium"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            {s.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.to)
                      ? "text-sky-600"
                      : scrolled || !isHome
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 rounded-full"
                      layoutId="nav-indicator"
                    />
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
                    ? "text-slate-600 hover:text-sky-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {PHONE}
              </a>
              <LanguageSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled || !isHome
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <motion.span
                  className={`block h-0.5 rounded-full ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  }`}
                  animate={{
                    rotate: mobileOpen ? 45 : 0,
                    y: mobileOpen ? 7 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={`block h-0.5 rounded-full ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  }`}
                  animate={{ opacity: mobileOpen ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                />
                <motion.span
                  className={`block h-0.5 rounded-full ${
                    scrolled || !isHome ? "bg-slate-700" : "bg-white"
                  }`}
                  animate={{
                    rotate: mobileOpen ? -45 : 0,
                    y: mobileOpen ? -7 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-800">ARA FINESTRA</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
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
                {serviceLinks.map((s, i) => (
                  <motion.div
                    key={s.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={s.to}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(s.to)
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="my-3 border-t border-slate-100" />

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className="p-4 border-t border-slate-100 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="block text-center py-3 px-4 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
                >
                  {t("cta.call_us")} {PHONE}
                </a>
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
