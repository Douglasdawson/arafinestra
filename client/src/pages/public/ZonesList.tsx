import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import TrustBar from "../../components/ui/TrustBar";
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
        description={t("zones_page.subtitle")}
        path="/zones"
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-[180px] h-[180px] rounded-full bg-brand/8 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">{t("zones_page.title")}</h1>
          <p className="mt-4 text-lg sm:text-xl text-brand-light">{t("zones_page.we_serve")}</p>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light">{t("zones_page.subtitle")}</p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-6">
            <div className="flex items-center gap-2 text-navy-800">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">{t("zones_page.stats_zones", { count: sortedZones.length })}</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-300" />
            <div className="flex items-center gap-2 text-navy-800">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">{t("zones_page.stats_projects")}</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-300" />
            <div className="flex items-center gap-2 text-navy-800">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="font-semibold">{t("zones_page.stats_rating")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Zone cards */}
      <section className="py-16 bg-slate-50">
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
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md p-6 transition-all duration-300 hover:scale-[1.02] h-full"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-light text-brand">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-navy-800 group-hover:text-brand transition-colors">
                            {name}
                          </h2>
                          <p className="text-sm text-slate-500 mt-0.5">{t("zones_page.card_tagline")}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-brand group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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

      {/* CTA bottom */}
      <section className="py-16 bg-brand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">{t("zones_page.not_found_zone")}</h2>
          <p className="mt-3 text-lg text-navy-700">{t("zones_page.contact_us_cta")}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-brand text-white font-semibold rounded-lg text-base sm:text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 pulse-glow-btn"
            >
              {t("cta.calculate")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to={`/${prefix}/visita-gratuita`}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-navy-800 text-navy-800 font-semibold rounded-lg text-base sm:text-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              {t("cta.free_visit")}
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t("cta_microcopy")}</p>
          <TrustBar className="mt-4" />
        </div>
      </section>
    </>
  );
}
