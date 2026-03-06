import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
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

interface PortfolioItem {
  id: number;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  localidad: string | null;
  fotos_despues: string[];
}

export default function Zone() {
  const { t, i18n } = useTranslation();
  const { lang, slug } = useParams<{ lang?: string; slug: string }>();
  const currentLang = lang || i18n.language || "ca";
  const prefix = lang || i18n.language || "ca";

  const [zone, setZone] = useState<ZoneData | null>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
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
        <Link to={`/${prefix}/zones`} className="text-sky-600 hover:text-sky-700">
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
    telephone: "+34XXXXXXXXX",
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
      <section className="py-16 bg-gradient-to-br from-slate-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("zones_page.h1", { zone: nombre })}
          </h1>
        </div>
      </section>

      {/* Content */}
      {contenido && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
              {contenido}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio for this zone */}
      {projects.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {t("portfolio.title")}
            </h2>
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
                      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{t("zones_page.map_title")}</h2>
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

      {/* CTA */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {t("service_pages.cta_title")}
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            {t("service_pages.cta_desc")}
          </p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-flex items-center px-8 py-4 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25 text-lg"
          >
            {t("cta.calculate")}
          </Link>
        </div>
      </section>
    </>
  );
}
