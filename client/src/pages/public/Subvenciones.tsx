import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import FaqSchema from "../../components/seo/FaqSchema";

export default function Subvenciones() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const requirements = [
    t("subsidies_page.req_1"),
    t("subsidies_page.req_2"),
    t("subsidies_page.req_3"),
    t("subsidies_page.req_4"),
  ];

  const steps = [
    { num: "1", text: t("subsidies_page.step_1") },
    { num: "2", text: t("subsidies_page.step_2") },
    { num: "3", text: t("subsidies_page.step_3") },
    { num: "4", text: t("subsidies_page.step_4") },
  ];

  const faqs: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const qKey = `subsidies_page.faq_q${i}`;
    const aKey = `subsidies_page.faq_a${i}`;
    const q = t(qKey);
    const a = t(aKey);
    if (q !== qKey && a !== aKey) faqs.push({ question: q, answer: a });
  }

  return (
    <>
      <PageHead
        title={t("subsidies_page.page_title")}
        description={t("subsidies_page.page_desc")}
        path="/subvencions"
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-emerald-700 via-teal-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[25%] right-[10%] w-[200px] h-[200px] rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">{t("subsidies_page.h1")}</h1>
          <p className="mt-5 text-base sm:text-xl text-emerald-100/80 max-w-2xl mx-auto font-light">{t("subsidies_page.subtitle")}</p>
        </div>
      </section>

      {/* What Are They */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">{t("subsidies_page.what_title")}</h2>
          <p className="text-slate-600 leading-relaxed mb-4">{t("subsidies_page.what_p1")}</p>
          <p className="text-slate-600 leading-relaxed">{t("subsidies_page.what_p2")}</p>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("subsidies_page.req_title")}</h2>
          <ul className="space-y-4">
            {requirements.map((req, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-700 leading-relaxed">{req}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* We Handle the Paperwork */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("subsidies_page.paperwork_title")}</h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-10">{t("subsidies_page.paperwork_desc")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg font-bold">
                  {step.num}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amount Info */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("subsidies_page.amount_title")}</h2>
          <p className="text-4xl font-bold text-emerald-600 mb-4">{t("subsidies_page.amount_value")}</p>
          <p className="text-slate-600">{t("subsidies_page.amount_desc")}</p>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <>
          <FaqSchema faqs={faqs} />
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">
                {t("subsidies_page.faq_title")}
              </h2>
              <div className="border-t border-slate-200">
                {faqs.map((faq, i) => (
                  <SubvencionesFaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("subsidies_page.cta_title")}</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("subsidies_page.cta_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg text-lg"
            >
              {t("cta.calculate")}
            </Link>
            <Link
              to={`/${prefix}/contacte`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors border-2 border-emerald-600 text-lg"
            >
              {t("cta.contact_us")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SubvencionesFaqItem({ question, answer }: { question: string; answer: string }) {
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
