import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import ServiceCard from "../../components/ui/ServiceCard";
import ProjectCard from "../../components/ui/ProjectCard";
import TestimonialCarousel from "../../components/ui/TestimonialCarousel";

// SVG icon components for services
function WindowIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
    </svg>
  );
}
function DoorIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 12h.01" />
    </svg>
  );
}
function ShutterIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16H4V4zm0 4h16m0 4H4m0 4h16" />
    </svg>
  );
}
function MosquitoNetIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16H4V4zm4 0v16m4-16v16m4-16v16M4 8h16M4 12h16M4 16h16" />
    </svg>
  );
}

interface PortfolioItem {
  id: number;
  titulo_ca: string | null;
  titulo_es: string | null;
  titulo_en: string | null;
  localidad: string | null;
  foto_despues: string | null;
}

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

  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetch("/api/portfolio?published=true&destacado=true&limit=3")
      .then((r) => (r.ok ? r.json() : []))
      .then(setProjects)
      .catch(() => setProjects([]));

    fetch("/api/testimonials?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const getTitle = (p: PortfolioItem) => {
    if (currentLang === "es") return p.titulo_es || p.titulo_ca || "";
    if (currentLang === "en") return p.titulo_en || p.titulo_ca || "";
    return p.titulo_ca || "";
  };

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

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)"
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-sky-200 max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center justify-center px-8 py-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 text-lg"
            >
              {t("cta.calculate")}
            </Link>
            <Link
              to={`/${prefix}/contacte`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 text-lg"
            >
              {t("cta.contact_us")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            {t("services.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<WindowIcon />}
              title={t("nav.windows")}
              description={t("services.windows_desc")}
              link={`/${prefix}/serveis/finestres-pvc`}
            />
            <ServiceCard
              icon={<DoorIcon />}
              title={t("nav.sliding_doors")}
              description={t("services.doors_desc")}
              link={`/${prefix}/serveis/portes-corredisses`}
            />
            <ServiceCard
              icon={<ShutterIcon />}
              title={t("nav.shutters")}
              description={t("services.shutters_desc")}
              link={`/${prefix}/serveis/persianes`}
            />
            <ServiceCard
              icon={<MosquitoNetIcon />}
              title={t("nav.mosquito_nets")}
              description={t("services.mosquito_desc")}
              link={`/${prefix}/serveis/mosquiteres`}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-white">15+</p>
              <p className="mt-2 text-sky-100 font-medium">{t("stats.experience")}</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">500+</p>
              <p className="mt-2 text-sky-100 font-medium">{t("stats.projects")}</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white">100+</p>
              <p className="mt-2 text-sky-100 font-medium">{t("stats.coverage")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why ARA FINESTRA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            {t("about.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cortizo Quality */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{t("about.quality")}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t("about.quality_desc")}</p>
            </div>
            {/* Local Service */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{t("about.local")}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t("about.local_desc")}</p>
            </div>
            {/* Subsidies */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{t("about.subsidies")}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t("about.subsidies_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              {t("portfolio.title")}
            </h2>
            <Link
              to={`/${prefix}/projectes`}
              className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              {t("cta.view_projects")} &rarr;
            </Link>
          </div>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  photo={p.foto_despues}
                  title={getTitle(p)}
                  location={p.localidad}
                  link={`/${prefix}/projectes`}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">{t("home.no_projects")}</p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            {t("testimonials.title")}
          </h2>
          {testimonials.length > 0 ? (
            <TestimonialCarousel testimonials={testimonials} lang={currentLang} />
          ) : (
            <p className="text-center text-slate-500 py-12">{t("home.no_testimonials")}</p>
          )}
        </div>
      </section>

      {/* Cortizo Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("home.cortizo_title")}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            {t("home.cortizo_desc")}
          </p>
          <Link
            to={`/${prefix}/cortizo`}
            className="inline-flex items-center px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-colors"
          >
            {t("home.cortizo_cta")}
          </Link>
        </div>
      </section>

      {/* Subsidies Banner */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            {t("home.subsidies_title")}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            {t("home.subsidies_desc")}
          </p>
          <Link
            to={`/${prefix}/subvencions`}
            className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
          >
            {t("home.subsidies_cta")}
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            {t("home.final_cta_title")}
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">
            {t("home.final_cta_desc")}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-flex items-center px-10 py-4 bg-sky-500 text-white text-lg font-semibold rounded-lg hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
          >
            {t("cta.calculate")}
          </Link>
        </div>
      </section>
    </>
  );
}
