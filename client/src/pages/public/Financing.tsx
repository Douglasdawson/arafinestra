import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import FaqSchema from "../../components/seo/FaqSchema";

const AMOUNTS = [3000, 4500, 6000, 8000];

function formatEur(n: number) {
  return n.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Financing() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";
  const [selectedAmount, setSelectedAmount] = useState(1); // index into AMOUNTS, default 4500

  const amount = AMOUNTS[selectedAmount];

  const plans = [
    { months: 3, monthly: amount / 3 },
    { months: 6, monthly: amount / 6 },
    { months: 12, monthly: amount / 12 },
    { months: 24, monthly: amount / 24 },
  ];

  // Subsidy example
  const subsidyPct = 0.4;
  const afterSubsidy = amount * (1 - subsidyPct);
  const afterSubsidyMonthly12 = afterSubsidy / 12;

  const steps = [
    { num: "1", icon: clipboardIcon, text: t("financing.step_1") },
    { num: "2", icon: calendarIcon, text: t("financing.step_2") },
    { num: "3", icon: checkIcon, text: t("financing.step_3") },
    { num: "4", icon: wrenchIcon, text: t("financing.step_4") },
  ];

  const paymentMethods = [
    { label: t("financing.method_transfer"), icon: bankIcon },
    { label: t("financing.method_card"), icon: cardIcon },
    { label: t("financing.method_financing"), icon: installmentIcon },
    { label: t("financing.method_cash"), icon: cashIcon },
  ];

  const faqs: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 4; i++) {
    const qKey = `financing.faq_q${i}`;
    const aKey = `financing.faq_a${i}`;
    const q = t(qKey);
    const a = t(aKey);
    if (q !== qKey && a !== aKey) faqs.push({ question: q, answer: a });
  }

  return (
    <>
      <PageHead
        title={t("financing.page_title")}
        description={t("financing.page_desc")}
        path="/financament"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-navy-800 to-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{t("financing.h1")}</h1>
          <p className="mt-4 text-xl text-navy-200 max-w-2xl mx-auto">{t("financing.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {t("financing.badge_no_entry")}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {t("financing.badge_no_interest")}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {t("financing.badge_no_surprises")}
            </span>
          </div>
        </div>
      </section>

      {/* Payment Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-2 text-center">{t("financing.calc_title")}</h2>
          <p className="text-slate-500 text-center mb-8">{t("financing.calc_subtitle")}</p>

          {/* Amount selector tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {AMOUNTS.map((amt, i) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(i)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedAmount === i
                    ? "bg-brand text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {amt.toLocaleString("ca-ES")} EUR
              </button>
            ))}
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.months}
                className={`rounded-xl p-6 text-center border-2 transition-all ${
                  plan.months === 12
                    ? "border-brand bg-orange-50 shadow-lg scale-105"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-sm text-slate-500 mb-1">{plan.months} {t("financing.months")}</p>
                <p className="text-3xl font-bold text-navy-800">{formatEur(plan.monthly)}</p>
                <p className="text-sm text-slate-500">{t("financing.per_month")}</p>
                <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                  0% {t("financing.interest")}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">{t("financing.calc_disclaimer")}</p>
        </div>
      </section>

      {/* How Financing Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("financing.how_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-navy-100 text-navy-700">
                  {step.icon}
                </div>
                <div className="w-8 h-8 mx-auto -mt-2 mb-2 flex items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
                  {step.num}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("financing.methods_title")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {paymentMethods.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-3 p-5 rounded-lg border border-slate-200 hover:border-navy-300 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-navy-50 text-navy-600">
                  {m.icon}
                </div>
                <p className="text-sm font-medium text-navy-800 text-center">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing + Subsidies */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-4 text-center">{t("financing.combo_title")}</h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-8">{t("financing.combo_desc")}</p>

          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-lg mx-auto">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t("financing.combo_original")}</span>
                <span className="text-lg font-semibold text-navy-800">{formatEur(amount)} EUR</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600">
                <span>- 40% {t("financing.combo_subsidy")}</span>
                <span className="font-semibold">-{formatEur(amount * subsidyPct)} EUR</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-navy-800">{t("financing.combo_final")}</span>
                <span className="text-2xl font-bold text-emerald-600">{formatEur(afterSubsidy)} EUR</span>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <p className="text-sm text-slate-600">
                  12 {t("financing.months")} x <span className="font-bold text-emerald-700">{formatEur(afterSubsidyMonthly12)} EUR/{t("financing.month_short")}</span> — 0% {t("financing.interest")}
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                to={`/${prefix}/subvencions`}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline"
              >
                {t("financing.combo_link")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <>
          <FaqSchema faqs={faqs} />
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">
                {t("financing.faq_title")}
              </h2>
              <div className="border-t border-slate-200">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("financing.cta_title")}</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("financing.cta_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg text-lg"
            >
              {t("cta.calculate")}
            </Link>
            <Link
              to={`/${prefix}/contacte`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors border-2 border-navy-600 text-lg"
            >
              {t("cta.contact_us")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
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
        style={{ maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* Inline SVG icons */
const clipboardIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const calendarIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const checkIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const wrenchIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const bankIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
  </svg>
);
const cardIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const installmentIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const cashIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
