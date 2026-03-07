import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BeforeAfterSlider from "../../components/ui/BeforeAfterSlider";
import { localize } from "../../lib/localize";

interface ZoneData {
  id: number;
  slug: string;
  nombre_ca: string;
  nombre_es: string;
  nombre_en: string;
  contenido_ca: string | null;
  contenido_es: string | null;
  contenido_en: string | null;
  meta_title_ca: string | null;
  meta_title_es: string | null;
  meta_title_en: string | null;
  meta_description_ca: string | null;
  meta_description_es: string | null;
  meta_description_en: string | null;
  latitud: number | null;
  longitud: number | null;
  published: boolean;
}

interface TestimonialItem {
  id: number;
  nombre: string;
  localidad: string | null;
  puntuacion: number;
  texto_ca: string | null;
  texto_es: string | null;
  texto_en: string | null;
}

interface PortfolioItem {
  id: number;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  localidad: string | null;
  fotos_antes: string[];
  fotos_despues: string[];
}

export default function Zone() {
  const { t, i18n } = useTranslation();
  const { lang, slug } = useParams<{ lang?: string; slug: string }>();
  const currentLang = lang || i18n.language || "ca";
  const prefix = lang || i18n.language || "ca";

  const [zone, setZone] = useState<ZoneData | null>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/zones/${slug}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setZone(data);
          setLoading(false);
          // Fetch portfolio for this zone's locality
          const zoneName = data.nombre_ca || data.nombre_es || "";
          if (zoneName) {
            fetch(`/api/portfolio?published=true&localidad=${encodeURIComponent(zoneName)}`)
              .then((r) => (r.ok ? r.json() : []))
              .then(setProjects)
              .catch(() => setProjects([]));
          }
          // Fetch testimonials and filter client-side by zone locality
          fetch("/api/testimonials?published=true")
            .then((r) => (r.ok ? r.json() : []))
            .then((all: TestimonialItem[]) => {
              const zn = (data.nombre_ca || data.nombre_es || "").toLowerCase();
              const matched = all.filter(
                (t) => t.localidad && t.localidad.toLowerCase() === zn
              );
              setTestimonials(matched.slice(0, 3));
            })
            .catch(() => setTestimonials([]));
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">...</div>;
  }

  if (notFound || !zone) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 py-20">
        <p className="text-2xl font-semibold mb-4">{t("zones_page.not_found")}</p>
        <Link to={`/${prefix}/zones`} className="text-brand hover:text-brand-dark">
          {t("zones_page.back_to_zones")}
        </Link>
      </div>
    );
  }

  const obj = zone as unknown as Record<string, unknown>;
  const nombre = localize(obj, "nombre", currentLang);
  const contenido = localize(obj, "contenido", currentLang);
  const metaTitle = localize(obj, "meta_title", currentLang) || t("zones_page.h1", { zone: nombre });
  const metaDesc = localize(obj, "meta_description", currentLang) || t("zones_page.h1", { zone: nombre });

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ARA FINESTRA",
    description: metaDesc,
    url: `https://arafinestra.com/${currentLang}/zones/${zone.slug}`,
    telephone: "+34611500372",
    address: {
      "@type": "PostalAddress",
      addressLocality: nombre,
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    ...(zone.latitud && zone.longitud
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: zone.latitud,
            longitude: zone.longitud,
          },
        }
      : {}),
    areaServed: {
      "@type": "City",
      name: nombre,
    },
  };

  return (
    <>
      <PageHead
        title={metaTitle}
        description={metaDesc}
        path={`/zones/${zone.slug}`}
        schema={localBusinessSchema}
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("zones_page.h1", { zone: nombre })}
          </h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
            {t("zones_page.hero_subtitle", { zone: nombre })}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-flex items-center mt-6 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25"
          >
            {t("zones_page.hero_cta")} &rarr;
          </Link>
        </div>
      </section>

      {/* Content */}
      {contenido && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed whitespace-pre-line break-words">
              {contenido}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio for this zone */}
      {projects.length > 0 && (() => {
        const showcaseProject = projects.find(
          (p) =>
            p.fotos_antes && p.fotos_antes.length > 0 &&
            p.fotos_despues && p.fotos_despues.length > 0
        );
        return (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">
              {t("portfolio.title")}
            </h2>

            {/* Before / After showcase */}
            {showcaseProject && (
              <div className="mb-10 max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-navy-700 mb-4 text-center">
                  {t("zones_page.before_after")}
                </h3>
                <BeforeAfterSlider
                  beforeSrc={showcaseProject.fotos_antes[0]}
                  afterSrc={showcaseProject.fotos_despues[0]}
                  beforeLabel={t("portfolio.before")}
                  afterLabel={t("portfolio.after")}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => {
                const pObj = p as unknown as Record<string, unknown>;
                const title = localize(pObj, "titulo", currentLang);
                return (
                  <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                      {p.fotos_despues && p.fotos_despues.length > 0 ? (
                        <img
                          src={p.fotos_despues[0]}
                          alt={title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-navy-800">{title}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        );
      })()}

      {/* Zone Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">
              {t("zones_page.reviews_title", { zone: nombre })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((rev) => {
                const tObj = rev as unknown as Record<string, unknown>;
                const texto = localize(tObj, "texto", currentLang);
                return (
                  <div key={rev.id} className="bg-slate-50 rounded-lg p-6">
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i <= rev.puntuacion ? "text-amber-400" : "text-slate-200"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      &ldquo;{texto}&rdquo;
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <p className="text-sm font-semibold text-navy-800">{rev.nombre}</p>
                      {rev.localidad && (
                        <p className="text-xs text-slate-500">{rev.localidad}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Map */}
      {zone.latitud && zone.longitud && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">{t("zones_page.map_title")}</h2>
            <div className="rounded-xl overflow-hidden shadow-md">
              <iframe
                title={nombre}
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d${zone.longitud}!3d${zone.latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sca!2ses!4v1`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* Services Available */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">
            {t("zones_page.services_title", { zone: nombre })}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                to: `/${prefix}/serveis/finestres-pvc`,
                label: t("nav.windows"),
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                ),
              },
              {
                to: `/${prefix}/serveis/portes-corredisses`,
                label: t("nav.sliding_doors"),
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="2" y="3" width="20" height="18" rx="1" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <path d="M8 12h-2M16 12h2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                to: `/${prefix}/serveis/persianes`,
                label: t("nav.shutters"),
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="4" y="2" width="16" height="20" rx="1" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="10" x2="20" y2="10" />
                    <line x1="4" y1="14" x2="20" y2="14" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                ),
              },
              {
                to: `/${prefix}/serveis/mosquiteres`,
                label: t("nav.mosquito_nets"),
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 3l18 18M3 9l12 12M3 15l6 6M9 3l12 12M15 3l6 6" strokeOpacity="0.5" />
                  </svg>
                ),
              },
            ].map((svc) => (
              <Link
                key={svc.to}
                to={svc.to}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-xl hover:bg-brand-light hover:shadow-md transition-all text-center group"
              >
                <span className="text-brand group-hover:text-brand-dark transition-colors">
                  {svc.icon}
                </span>
                <span className="font-semibold text-navy-800 text-sm sm:text-base">{svc.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">
            {t("service_pages.cta_title")}
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            {t("service_pages.cta_desc")}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-flex items-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 text-lg"
          >
            {t("cta.calculate")}
          </Link>
        </div>
      </section>
    </>
  );
}
