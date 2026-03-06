import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import { localize } from "../../lib/localize";

interface Zone {
  id: number;
  slug: string;
  nombre_ca: string;
  nombre_es: string;
  nombre_en: string;
  published: boolean;
}

export default function ZonesList() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || i18n.language || "ca";
  const prefix = lang || i18n.language || "ca";

  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/zones?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setZones(data);
        setLoading(false);
      })
      .catch(() => {
        setZones([]);
        setLoading(false);
      });
  }, []);

  const sortedZones = [...zones].sort((a, b) => {
    const nameA = localize(a as unknown as Record<string, unknown>, "nombre", currentLang);
    const nameB = localize(b as unknown as Record<string, unknown>, "nombre", currentLang);
    return nameA.localeCompare(nameB);
  });

  return (
    <>
      <PageHead
        title={t("zones_page.title")}
        description={t("zones_page.title") + " - ARA FINESTRA"}
        path="/zones"
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{t("zones_page.title")}</h1>
          <p className="mt-4 text-xl text-brand-light">{t("zones_page.we_serve")}</p>
        </div>
      </section>

      {/* Zone cards */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-500">...</div>
          ) : sortedZones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedZones.map((zone) => {
                const name = localize(zone as unknown as Record<string, unknown>, "nombre", currentLang);
                return (
                  <Link
                    key={zone.id}
                    to={`/${prefix}/zones/${zone.slug}`}
                    className="group bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-light text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-navy-800 group-hover:text-brand transition-colors">
                        {name}
                      </h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">{t("zones_page.no_zones")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
