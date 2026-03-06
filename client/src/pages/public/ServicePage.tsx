import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import FaqSchema from "../../components/seo/FaqSchema";
import ProjectCard from "../../components/ui/ProjectCard";

type ServiceType = "ventana" | "puerta" | "persiana" | "mosquitera";

const SLUG_TO_TYPE: Record<string, ServiceType> = {
  "finestres-pvc": "ventana",
  "portes-corredisses": "puerta",
  "persianes": "persiana",
  "mosquiteres": "mosquitera",
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  ventana: "from-sky-700 to-blue-900",
  puerta: "from-teal-700 to-cyan-900",
  persiana: "from-slate-700 to-slate-900",
  mosquitera: "from-emerald-700 to-green-900",
};

interface PortfolioItem {
  id: number;
  titulo_ca: string | null;
  titulo_es: string | null;
  titulo_en: string | null;
  localidad: string | null;
  foto_despues: string | null;
  tipo: string | null;
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-800">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function ServicePage() {
  const { t, i18n } = useTranslation();
  const { lang, serviceSlug } = useParams<{ lang?: string; serviceSlug: string }>();
  const prefix = lang || i18n.language || "ca";
  const currentLang = lang || i18n.language || "ca";

  const serviceType = SLUG_TO_TYPE[serviceSlug || ""] || "ventana";
  const gradient = SERVICE_COLORS[serviceType];

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetch(`/api/portfolio?published=true&tipo=${serviceType}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPortfolioItems)
      .catch(() => setPortfolioItems([]));
  }, [serviceType]);

  const getTitle = (p: PortfolioItem) => {
    if (currentLang === "es") return p.titulo_es || p.titulo_ca || "";
    if (currentLang === "en") return p.titulo_en || p.titulo_ca || "";
    return p.titulo_ca || "";
  };

  // Benefits (4-6 per type)
  const benefits: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const key = `service_pages.${serviceType}.benefit_${i}`;
    const val = t(key);
    if (val !== key) benefits.push(val);
  }

  // FAQs (4-5 per type)
  const faqs: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const qKey = `service_pages.${serviceType}.faq_${i}_q`;
    const aKey = `service_pages.${serviceType}.faq_${i}_a`;
    const q = t(qKey);
    const a = t(aKey);
    if (q !== qKey && a !== aKey) faqs.push({ question: q, answer: a });
  }

  const titleKey = `service_pages.${serviceType}.title`;
  const descKey = `service_pages.${serviceType}.description`;
  const pageTitle = t(titleKey);
  const pageDesc = t(descKey);

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDesc}
        path={`/serveis/${serviceSlug}`}
      />
      <FaqSchema faqs={faqs} />

      {/* Hero Banner */}
      <section className={`py-20 bg-gradient-to-br ${gradient}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{pageTitle}</h1>
          <p className="mt-4 text-xl text-sky-100 max-w-2xl mx-auto">{pageDesc}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            {t("service_pages.benefits_title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      {portfolioItems.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {t("service_pages.gallery_title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((p) => (
                <ProjectCard
                  key={p.id}
                  photo={p.foto_despues}
                  title={getTitle(p)}
                  location={p.localidad}
                  link={`/${prefix}/projectes`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            {t("service_pages.faq_title")}
          </h2>
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

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
