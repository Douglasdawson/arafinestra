import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import FaqSchema from "../../components/seo/FaqSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";
import TrustBar from "../../components/ui/TrustBar";

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
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
        style={{ maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const modelRows = [
    {
      name: "C-70",
      type: t("pricing.table_c70_type"),
      basePrice: "280\u20AC",
      priceM2: "195\u20AC",
      range120: "280\u20AC \u2013 550\u20AC",
      lowPrice: 280,
      highPrice: 550,
    },
    {
      name: "E-170 HI",
      type: t("pricing.table_e170hi_type"),
      basePrice: "450\u20AC",
      priceM2: "310\u20AC",
      range120: "450\u20AC \u2013 850\u20AC",
      lowPrice: 450,
      highPrice: 850,
    },
    {
      name: "E-170",
      type: t("pricing.table_e170_type"),
      basePrice: "600\u20AC",
      priceM2: "420\u20AC",
      range120: "600\u20AC \u2013 1.200\u20AC",
      lowPrice: 600,
      highPrice: 1200,
    },
  ];

  const typeRows = [
    {
      product: t("pricing.type_ventana"),
      range: t("pricing.type_ventana_range"),
      notes: t("pricing.type_ventana_notes"),
    },
    {
      product: t("pricing.type_corredera"),
      range: t("pricing.type_corredera_range"),
      notes: t("pricing.type_corredera_notes"),
    },
    {
      product: t("pricing.type_persiana"),
      range: t("pricing.type_persiana_range"),
      notes: t("pricing.type_persiana_notes"),
    },
    {
      product: t("pricing.type_mosquitera"),
      range: t("pricing.type_mosquitera_range"),
      notes: t("pricing.type_mosquitera_notes"),
    },
  ];

  const faqs = [];
  for (let i = 1; i <= 6; i++) {
    const qKey = `pricing.faq_q${i}`;
    const aKey = `pricing.faq_a${i}`;
    const q = t(qKey);
    const a = t(aKey);
    if (q !== qKey && a !== aKey) faqs.push({ question: q, answer: a });
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@graph": modelRows.map((row) => ({
      "@type": "Product",
      "name": `Cortizo ${row.name}`,
      "description": row.type,
      "brand": { "@type": "Brand", "name": "Cortizo" },
      "material": "PVC",
      "category": "Ventanas PVC",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": row.lowPrice,
        "highPrice": row.highPrice,
        "priceCurrency": "EUR",
        "offerCount": "3",
        "availability": "https://schema.org/InStock",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "47",
      },
    })),
  };

  return (
    <>
      <PageHead
        title={t("pricing.h1")}
        description={t("pricing.intro").slice(0, 160)}
        path="/preus"
        schema={productSchema}
      />
      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), url: "/" },
          { name: t("nav.pricing"), url: "/preus" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] rounded-full bg-brand/8 blur-3xl" />
          <div className="absolute top-[30%] left-[15%] w-[120px] h-[120px] rounded-full bg-brand/6 blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            {t("pricing.h1")}
          </h1>
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-slate-600 leading-relaxed text-lg text-center">
              {t("pricing.intro")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Table by model */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-8 text-center">
              {t("pricing.table_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-navy-800">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.table_model")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.table_type")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.table_base_price")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.table_price_m2")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.table_range_120")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {modelRows.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-brand">
                        {row.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{row.type}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-800">
                        {row.basePrice}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{row.priceM2}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-800">
                        {row.range120}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Table by type */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-8 text-center">
              {t("pricing.type_table_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-navy-800">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.type_table_product")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.type_table_range")}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("pricing.type_table_notes")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {typeRows.map((row, i) => (
                    <tr key={row.product} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-800">
                        {row.product}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-brand">
                        {row.range}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <p className="text-sm text-amber-800 leading-relaxed">
                {t("pricing.disclaimer")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <>
          <FaqSchema faqs={faqs} />
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8 sm:mb-12 text-center tracking-tight">
                  {t("pricing.faq_title")}
                </h2>
              </ScrollReveal>
              <div className="border-t border-slate-200">
                {faqs.map((faq, i) => (
                  <FaqAccordionItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("pricing.cta_title")}</h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("pricing.cta_desc")}</p>
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-brand text-white font-semibold rounded-lg text-base sm:text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 pulse-glow-btn"
            >
              {t("pricing.cta_button")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500">{t("cta.free_no_commitment")}</p>
            <TrustBar className="mt-4" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
