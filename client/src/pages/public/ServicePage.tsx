import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHead from "../../components/seo/PageHead";
import FaqSchema from "../../components/seo/FaqSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";
import ProjectCard from "../../components/ui/ProjectCard";

type ServiceType = "ventana" | "puerta" | "persiana" | "mosquitera";

const SLUG_TO_TYPE: Record<string, ServiceType> = {
  "finestres-pvc": "ventana",
  "portes-corredisses": "puerta",
  "persianes": "persiana",
  "mosquiteres": "mosquitera",
};

const SERVICE_COLORS: Record<ServiceType, { gradient: string; accent: string }> = {
  ventana: { gradient: "from-sky-800 via-blue-900 to-slate-900", accent: "sky" },
  puerta: { gradient: "from-teal-800 via-cyan-900 to-slate-900", accent: "teal" },
  persiana: { gradient: "from-slate-700 via-slate-800 to-slate-900", accent: "slate" },
  mosquitera: { gradient: "from-emerald-800 via-green-900 to-slate-900", accent: "emerald" },
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

function AccordionItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 0.08}>
      <div className="border-b border-slate-200">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-5 text-left group"
        >
          <span className="text-base font-medium text-slate-800 group-hover:text-sky-600 transition-colors pr-4">
            {question}
          </span>
          <motion.svg
            className="w-5 h-5 text-slate-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="pb-5 text-sm text-slate-600 leading-relaxed">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

export default function ServicePage() {
  const { t, i18n } = useTranslation();
  const { lang, serviceSlug } = useParams<{ lang?: string; serviceSlug: string }>();
  const prefix = lang || i18n.language || "ca";
  const currentLang = lang || i18n.language || "ca";

  const serviceType = SLUG_TO_TYPE[serviceSlug || ""] || "ventana";
  const { gradient } = SERVICE_COLORS[serviceType];

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

  const benefits: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const key = `service_pages.${serviceType}.benefit_${i}`;
    const val = t(key);
    if (val !== key) benefits.push(val);
  }

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

      {/* Hero */}
      <section className={`relative py-24 sm:py-32 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {pageDesc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block mt-8 px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              {t("cta.calculate")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center tracking-tight">
              {t("service_pages.benefits_title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-sky-200 hover:shadow-sm transition-all">
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{b}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {portfolioItems.length > 0 && (
        <section className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center tracking-tight">
                {t("service_pages.gallery_title")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <ProjectCard
                    photo={p.foto_despues}
                    title={getTitle(p)}
                    location={p.localidad}
                    link={`/${prefix}/projectes`}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center tracking-tight">
              {t("service_pages.faq_title")}
            </h2>
          </ScrollReveal>
          <div className="border-t border-slate-200">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.3) 0%, transparent 60%)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("service_pages.cta_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-lg text-slate-400 font-light">
              {t("service_pages.cta_desc")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block mt-10 px-10 py-4 bg-white text-slate-900 text-lg font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg pulse-glow-btn"
            >
              {t("cta.calculate")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
