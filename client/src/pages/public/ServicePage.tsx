import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageHead from "../../components/seo/PageHead";
import FaqSchema from "../../components/seo/FaqSchema";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
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
  ventana: { gradient: "from-navy-700 via-navy-800 to-navy-950", accent: "sky" },
  puerta: { gradient: "from-teal-800 via-navy-800 to-navy-950", accent: "teal" },
  persiana: { gradient: "from-navy-600 via-navy-800 to-navy-950", accent: "slate" },
  mosquitera: { gradient: "from-emerald-800 via-navy-800 to-navy-950", accent: "emerald" },
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

interface BlogPost {
  id: number;
  slug: string;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  extracto_ca: string | null;
  extracto_es: string | null;
  extracto_en: string | null;
  imagen_portada: string | null;
  categoria: string | null;
}

interface Zone {
  id: number;
  slug: string;
  nombre_ca: string;
  nombre_es: string;
  nombre_en: string;
}

const SERVICE_BLOG_CATEGORIES: Record<ServiceType, string[]> = {
  ventana: ["Ventanas", "Guies"],
  puerta: ["Ventanas"],
  persiana: ["Ventanas"],
  mosquitera: ["Ventanas"],
};

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
          <span className="text-base font-medium text-navy-800 group-hover:text-brand transition-colors pr-4">
            {question}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: open ? "500px" : "0",
            opacity: open ? 1 : 0,
          }}
        >
          <p className="pb-5 text-sm text-slate-600 leading-relaxed">
            {answer}
          </p>
        </div>
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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    fetch(`/api/portfolio?published=true&tipo=${serviceType}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPortfolioItems)
      .catch(() => setPortfolioItems([]));

    // Fetch blog posts matching service categories
    const categories = SERVICE_BLOG_CATEGORIES[serviceType];
    Promise.all(
      categories.map((cat) =>
        fetch(`/api/blog?published=true&categoria=${encodeURIComponent(cat)}&limit=2`)
          .then((r) => (r.ok ? r.json() : { data: [] }))
          .then((res) => res.data || [])
          .catch(() => [])
      )
    ).then((results) => {
      const all = results.flat() as BlogPost[];
      // Deduplicate by id and take up to 2
      const seen = new Set<number>();
      const unique = all.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      setBlogPosts(unique.slice(0, 2));
    });

    // Fetch zones
    fetch("/api/zones?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Zone[]) => setZones(data.slice(0, 8)))
      .catch(() => setZones([]));
  }, [serviceType]);

  const getTitle = (p: PortfolioItem) => {
    if (currentLang === "es") return p.titulo_es || p.titulo_ca || "";
    if (currentLang === "en") return p.titulo_en || p.titulo_ca || "";
    return p.titulo_ca || "";
  };

  const getBlogTitle = (p: BlogPost) => {
    if (currentLang === "es") return p.titulo_es || p.titulo_ca;
    if (currentLang === "en") return p.titulo_en || p.titulo_ca;
    return p.titulo_ca;
  };

  const getBlogExcerpt = (p: BlogPost) => {
    if (currentLang === "es") return p.extracto_es || p.extracto_ca || "";
    if (currentLang === "en") return p.extracto_en || p.extracto_ca || "";
    return p.extracto_ca || "";
  };

  const getZoneName = (z: Zone) => {
    if (currentLang === "es") return z.nombre_es || z.nombre_ca;
    if (currentLang === "en") return z.nombre_en || z.nombre_ca;
    return z.nombre_ca;
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": pageTitle,
    "description": pageDesc,
    "provider": {
      "@type": "Organization",
      "name": "ARA FINESTRA"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 41.6742,
        "longitude": 2.7903
      },
      "geoRadius": "60000"
    },
    "serviceType": "Window Installation"
  };

  return (
    <>
      <PageHead
        title={pageTitle}
        description={pageDesc}
        path={`/serveis/${serviceSlug}`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <FaqSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.services"), url: "/serveis" },
        { name: pageTitle, url: `/serveis/${serviceSlug}` },
      ]} />

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight animate-fadeIn">
            {pageTitle}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-light animate-fadeIn" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>
            {pageDesc}
          </p>
          <div className="animate-fadeIn" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-block mt-8 px-8 py-3.5 bg-white text-navy-900 font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              {t("cta.calculate")}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-12 text-center tracking-tight">
              {t("service_pages.benefits_title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand/20 hover:shadow-sm transition-all">
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-brand-light text-brand">
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

      {/* Warranty */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-brand-light">
                <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{t("warranty.title")}</h3>
                <p className="mt-1 text-sm text-slate-600">{t("warranty.description")}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Portfolio */}
      {portfolioItems.length > 0 && (
        <section className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-12 text-center tracking-tight">
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

      {/* Related Articles */}
      {blogPosts.length > 0 && (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-12 text-center tracking-tight">
                {t("service_pages.related_articles")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {blogPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.1}>
                  <Link
                    to={`/${prefix}/blog/${post.slug}`}
                    className="block bg-slate-50 rounded-xl border border-slate-100 hover:border-brand/20 hover:shadow-md transition-all overflow-hidden"
                  >
                    {post.imagen_portada && (
                      <img
                        src={post.imagen_portada}
                        alt={getBlogTitle(post)}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-navy-900 mb-2 line-clamp-2">
                        {getBlogTitle(post)}
                      </h3>
                      {getBlogExcerpt(post) && (
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {getBlogExcerpt(post)}
                        </p>
                      )}
                      <span className="inline-block mt-3 text-sm font-medium text-brand">
                        {t("blog_section.read_more")} &rarr;
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-12 text-center tracking-tight">
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

      {/* Zones */}
      {zones.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h3 className="text-xl font-bold text-navy-900 mb-6">
                {t("service_pages.zones_title")}
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap justify-center gap-2">
                {zones.map((zone) => (
                  <Link
                    key={zone.id}
                    to={`/${prefix}/zones/${zone.slug}`}
                    className="px-4 py-2 text-sm font-medium text-navy-700 bg-slate-100 rounded-full hover:bg-brand-light hover:text-brand transition-colors"
                  >
                    {getZoneName(zone)}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-24 sm:py-32 bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(232,101,43,0.3) 0%, transparent 60%)",
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
              className="inline-block mt-10 px-10 py-4 bg-white text-navy-900 text-lg font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg pulse-glow-btn"
            >
              {t("cta.calculate")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
