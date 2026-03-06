import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageHead from "../../components/seo/PageHead";
import ScrollReveal from "../../components/ui/ScrollReveal";
import Counter from "../../components/ui/Counter";
import ScrollIndicator from "../../components/ui/ScrollIndicator";

interface TestimonialItem {
  id: number;
  nombre: string;
  localidad: string | null;
  estrellas: number;
  texto_ca: string | null;
  texto_es: string | null;
  texto_en: string | null;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";
  const currentLang = lang || i18n.language || "ca";

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/testimonials?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const getTestimonialText = (t: TestimonialItem) => {
    if (currentLang === "es") return t.texto_es || t.texto_ca || "";
    if (currentLang === "en") return t.texto_en || t.texto_ca || "";
    return t.texto_ca || "";
  };

  const firstTestimonial = testimonials.length > 0 ? testimonials[0] : null;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ARA FINESTRA",
    description: t("hero.description"),
    url: "https://arafinestra.com",
    telephone: "+34XXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Girona",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.9794,
      longitude: 2.8214,
    },
    areaServed: ["Girona", "Maresme", "Blanes", "Lloret de Mar", "Figueres"],
    priceRange: "$$",
  };

  return (
    <>
      <PageHead
        title={t("hero.title")}
        description={t("hero.description")}
        path=""
        schema={localBusinessSchema}
      />

      {/* ───────────────────── 1. HERO ───────────────────── */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)",
              top: "10%",
              left: "15%",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
              bottom: "10%",
              right: "10%",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full opacity-8 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
              top: "50%",
              right: "30%",
              animation: "float 18s ease-in-out infinite 5s",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            ARA FINESTRA
          </motion.h1>

          <motion.p
            className="mt-6 sm:mt-8 text-xl sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block mt-10 sm:mt-12 px-10 py-4 bg-white text-slate-900 text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-white/10"
            >
              {t("cta.calculate")}
            </Link>
          </motion.div>
        </div>

        <ScrollIndicator label={t("home.scroll_hint")} />
      </section>

      {/* ───────────────────── 2. PROBLEM STATEMENT ───────────────────── */}
      <section className="relative h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-2xl sm:text-3xl text-slate-400 font-light">
              {t("home.problem_cost")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mt-4 text-6xl sm:text-7xl md:text-8xl font-bold text-white">
              <Counter target={847} duration={2} suffix="EUR" />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="mt-2 text-2xl sm:text-3xl text-slate-400 font-light">
              {t("home.problem_per_year")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <p className="mt-10 text-lg sm:text-xl text-slate-500 max-w-lg mx-auto">
              {t("home.problem_subtitle")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────────────── 3. SOLUTION REVEAL ───────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
        <div className="text-center px-4 max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              {t("home.solution_title")}
            </h2>
          </ScrollReveal>

          <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Thermal */}
            <ScrollReveal delay={0.2}>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t("home.thermal")}
                </h3>
                <p className="text-4xl font-bold text-sky-600 mb-2">
                  <Counter target={70} suffix="%" />
                </p>
                <p className="text-sm text-slate-500">{t("home.thermal_stat")}</p>
              </div>
            </ScrollReveal>

            {/* Acoustic */}
            <ScrollReveal delay={0.4}>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t("home.acoustic")}
                </h3>
                <p className="text-4xl font-bold text-sky-600 mb-2">
                  <Counter target={42} suffix="dB" />
                </p>
                <p className="text-sm text-slate-500">{t("home.acoustic_stat")}</p>
              </div>
            </ScrollReveal>

            {/* Energy savings */}
            <ScrollReveal delay={0.6}>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t("home.savings")}
                </h3>
                <p className="text-4xl font-bold text-sky-600 mb-2">
                  <Counter target={40} suffix="%" />
                </p>
                <p className="text-sm text-slate-500">{t("home.savings_stat")}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ───────────────────── 4. CORTIZO BRAND ───────────────────── */}
      <section className="relative h-screen flex items-center bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div>
            <ScrollReveal direction="left">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                {t("home.cortizo_headline")}
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <p className="mt-6 text-xl sm:text-2xl text-slate-400 font-light">
                {t("home.cortizo_sub")}
              </p>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.4}>
              <Link
                to={`/${prefix}/cortizo`}
                className="inline-block mt-8 px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                {t("home.cortizo_cta")}
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: abstract window SVG */}
          <ScrollReveal direction="right" delay={0.3}>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-80 sm:w-80 sm:h-96">
                <svg
                  viewBox="0 0 320 400"
                  fill="none"
                  className="w-full h-full"
                >
                  {/* Outer frame */}
                  <rect
                    x="20"
                    y="20"
                    width="280"
                    height="360"
                    rx="4"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                  {/* Inner division vertical */}
                  <line
                    x1="160"
                    y1="20"
                    x2="160"
                    y2="380"
                    stroke="rgba(56,189,248,0.2)"
                    strokeWidth="2"
                  />
                  {/* Inner division horizontal */}
                  <line
                    x1="20"
                    y1="200"
                    x2="300"
                    y2="200"
                    stroke="rgba(56,189,248,0.2)"
                    strokeWidth="2"
                  />
                  {/* Handle left pane */}
                  <rect
                    x="140"
                    y="195"
                    width="12"
                    height="30"
                    rx="2"
                    fill="rgba(56,189,248,0.4)"
                  />
                  {/* Glow effect */}
                  <rect
                    x="20"
                    y="20"
                    width="280"
                    height="360"
                    rx="4"
                    stroke="rgba(56,189,248,0.1)"
                    strokeWidth="8"
                    filter="blur(8px)"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────────────── 5. SERVICES GRID ───────────────────── */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-center mb-16">
              {t("services.title")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
                  </svg>
                ),
                title: t("nav.windows"),
                desc: t("services.windows_desc"),
                link: `/${prefix}/serveis/finestres-pvc`,
                delay: 0,
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 12h.01" />
                  </svg>
                ),
                title: t("nav.sliding_doors"),
                desc: t("services.doors_desc"),
                link: `/${prefix}/serveis/portes-corredisses`,
                delay: 0.1,
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 4h16m0 4H4m0 4h16" />
                  </svg>
                ),
                title: t("nav.shutters"),
                desc: t("services.shutters_desc"),
                link: `/${prefix}/serveis/persianes`,
                delay: 0.2,
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm4 0v16m4-16v16m4-16v16M4 8h16M4 12h16M4 16h16" />
                  </svg>
                ),
                title: t("nav.mosquito_nets"),
                desc: t("services.mosquito_desc"),
                link: `/${prefix}/serveis/mosquiteres`,
                delay: 0.3,
              },
            ].map((service, i) => (
              <ScrollReveal key={i} delay={service.delay}>
                <Link
                  to={service.link}
                  className="group block bg-white rounded-2xl p-8 sm:p-10 border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
                    {service.desc}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── 6. STATS BAR ───────────────────── */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-r from-sky-600 via-blue-600 to-blue-700 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            <ScrollReveal delay={0}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={15} suffix="+" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.experience")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={500} suffix="+" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.projects")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-6xl sm:text-7xl font-bold text-white">
                <Counter target={60} suffix="km" />
              </p>
              <p className="mt-3 text-lg text-sky-100 font-medium">
                {t("stats.coverage")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ───────────────────── 7. TESTIMONIAL SPOTLIGHT ───────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          {/* Giant quote marks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[12rem] sm:text-[16rem] leading-none text-slate-100 font-serif pointer-events-none select-none">
            &ldquo;
          </div>

          <ScrollReveal>
            <div className="relative z-10">
              {firstTestimonial ? (
                <>
                  <p className="text-xl sm:text-2xl md:text-3xl italic text-slate-700 leading-relaxed font-light">
                    {getTestimonialText(firstTestimonial)}
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-1">
                    {Array.from({ length: firstTestimonial.estrellas }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {firstTestimonial.nombre}
                  </p>
                  {firstTestimonial.localidad && (
                    <p className="text-sm text-slate-500">
                      {firstTestimonial.localidad}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl md:text-3xl italic text-slate-700 leading-relaxed font-light">
                    {t("testimonials.title")}
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────────────── 8. SUBSIDIES CTA ───────────────────── */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("home.subsidies_title")}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold text-white/90">
              {t("home.subsidies_headline")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="mt-6 text-xl sm:text-2xl text-white/80 font-light">
              {t("home.subsidies_sub")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <Link
              to={`/${prefix}/subvencions`}
              className="inline-block mt-10 px-10 py-4 bg-white text-orange-600 text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              {t("home.subsidies_cta")}
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ───────────────────── 9. FINAL CTA ───────────────────── */}
      <section className="relative py-32 sm:py-40 bg-slate-950 overflow-hidden flex items-center justify-center">
        <div className="text-center px-4">
          <ScrollReveal>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">
              {t("home.final_title")}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Link
              to={`/${prefix}/pressupost`}
              className="relative inline-block mt-12 px-12 py-5 bg-white text-slate-900 text-lg font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-white/10"
            >
              {/* Pulsing glow */}
              <span className="absolute inset-0 rounded-lg bg-white/20 animate-ping pointer-events-none" />
              <span className="relative">{t("cta.calculate")}</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
