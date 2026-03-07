import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import FilterBar from "../../components/ui/FilterBar";
import Lightbox from "../../components/ui/Lightbox";
import BeforeAfterSlider from "../../components/ui/BeforeAfterSlider";
import { localize } from "../../lib/localize";
import ProgressiveImage from "../../components/ui/ProgressiveImage";

interface PortfolioItem {
  id: number;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  descripcion_ca: string | null;
  descripcion_es: string | null;
  descripcion_en: string | null;
  localidad: string | null;
  tipo_inmueble: string | null;
  productos_usados: string | null;
  fotos_antes: string[];
  fotos_despues: string[];
  destacado: boolean;
  published: boolean;
}

const TYPE_FILTERS = [
  { value: "", label: "" }, // "all" - label set from translations
];

export default function Projects() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || i18n.language || "ca";

  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/portfolio?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, []);

  const typeOptions = [
    { value: "", label: t("portfolio.all") },
    { value: "ventana", label: t("nav.windows") },
    { value: "puerta", label: t("nav.sliding_doors") },
    { value: "persiana", label: t("nav.shutters") },
    { value: "mosquitera", label: t("nav.mosquito_nets") },
  ];

  const locations = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.localidad) set.add(p.localidad);
    });
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (typeFilter && p.tipo_inmueble !== typeFilter) return false;
      if (locationFilter && p.localidad !== locationFilter) return false;
      return true;
    });
  }, [projects, typeFilter, locationFilter]);

  return (
    <>
      <PageHead
        title={t("portfolio.title")}
        description={t("portfolio.title") + " - ARA FINESTRA"}
        path="/projectes"
      />
      <BreadcrumbSchema items={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.projects"), url: "/projectes" },
      ]} />
      {projects.length > 0 && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              "name": "ARA FINESTRA - Portfolio",
              "about": "PVC window installations in Girona, Catalunya",
              "image": projects
                .filter((p) => p.fotos_despues && p.fotos_despues.length > 0)
                .map((p) => ({
                  "@type": "ImageObject",
                  "name": localize(p as unknown as Record<string, unknown>, "titulo", currentLang),
                  "contentUrl": p.fotos_despues[0],
                  "description": localize(p as unknown as Record<string, unknown>, "descripcion", currentLang) || localize(p as unknown as Record<string, unknown>, "titulo", currentLang),
                })),
            })}
          </script>
        </Helmet>
      )}

      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[20%] right-[15%] w-[150px] h-[150px] rounded-full bg-brand/8 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            {t("portfolio.title")}
          </h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <FilterBar options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
            {locations.length > 0 && (
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-base text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">{t("portfolio.filter_location")}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">{t("portfolio.title")}</h2>
          {loading ? (
            <div className="text-center py-20 text-slate-500">{t("portfolio.title")}...</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <div className="aspect-[4/3] bg-slate-200 overflow-hidden">
                    {p.fotos_despues && p.fotos_despues.length > 0 ? (
                      <ProgressiveImage
                        src={p.fotos_despues[0]}
                        alt={localize(p as unknown as Record<string, unknown>, "titulo", currentLang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="text-sm font-semibold text-navy-800 group-hover:text-brand transition-colors">
                      {localize(p as unknown as Record<string, unknown>, "titulo", currentLang)}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.localidad && (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-brand-light text-brand rounded-full">
                          {p.localidad}
                        </span>
                      )}
                      {p.productos_usados && (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                          {p.productos_usados}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">{t("portfolio.coming_soon")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-brand-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-3">
            {t("portfolio.like_what_you_see")}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {t("portfolio.cta_desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/${currentLang}/pressupost`}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-brand text-white font-semibold rounded-lg text-base sm:text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 pulse-glow-btn"
            >
              {t("portfolio.cta_button")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to={`/${currentLang}/visita-gratuita`}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-navy-800 text-navy-800 font-semibold rounded-lg text-base sm:text-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              {t("cta.free_visit")}
            </Link>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-navy-800">
                {localize(selectedProject as unknown as Record<string, unknown>, "titulo", currentLang)}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Tancar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* Before / After interactive slider */}
              {selectedProject.fotos_antes?.length > 0 &&
                selectedProject.fotos_despues?.length > 0 ? (
                <div className="mb-6 space-y-4">
                  {selectedProject.fotos_antes.map((beforeSrc, i) => {
                    const afterSrc =
                      selectedProject.fotos_despues[i] ||
                      selectedProject.fotos_despues[0];
                    return (
                      <BeforeAfterSlider
                        key={i}
                        beforeSrc={beforeSrc}
                        afterSrc={afterSrc}
                        beforeLabel={t("portfolio.before")}
                        afterLabel={t("portfolio.after")}
                      />
                    );
                  })}
                </div>
              ) : (selectedProject.fotos_antes?.length > 0 ||
                  selectedProject.fotos_despues?.length > 0) ? (
                <div className="mb-6 space-y-2">
                  {(selectedProject.fotos_despues?.length > 0
                    ? selectedProject.fotos_despues
                    : selectedProject.fotos_antes
                  ).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${t("portfolio.title")} ${i + 1}`}
                      className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxImg(src)}
                    />
                  ))}
                </div>
              ) : null}

              {/* Description */}
              {localize(selectedProject as unknown as Record<string, unknown>, "descripcion", currentLang) && (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {localize(selectedProject as unknown as Record<string, unknown>, "descripcion", currentLang)}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.productos_usados && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                    {selectedProject.productos_usados}
                  </span>
                )}
                {selectedProject.localidad && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-brand-light text-brand rounded-full">
                    {selectedProject.localidad}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link
                  to={`/${currentLang}/pressupost`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
                  onClick={() => setSelectedProject(null)}
                >
                  {t("portfolio.request_similar")}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <Lightbox
          src={lightboxImg}
          alt="Project photo"
          onClose={() => setLightboxImg(null)}
        />
      )}
    </>
  );
}
