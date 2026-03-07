import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";

const STEPS = [
  {
    key: "step1",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    key: "step2",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    key: "step3",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    key: "step4",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
  },
  {
    key: "step5",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export default function Process() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  return (
    <>
      <PageHead
        title={t("process.page_title")}
        description={t("process.page_desc")}
        path="/proces"
      />
      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), url: `/${prefix}` },
          { name: t("nav.process"), url: `/${prefix}/proces` },
        ]}
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            {t("process.title")}
          </h1>
          <p className="mt-4 text-xl text-brand-light max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block">
            {/* Connector line */}
            <div className="relative mb-12">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />
              <div className="flex justify-between relative">
                {STEPS.map((step, i) => (
                  <ScrollReveal key={step.key} delay={i * 0.15} className="flex flex-col items-center w-1/5">
                    <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center text-lg font-bold relative z-10 shadow-lg shadow-brand/25">
                      {i + 1}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-5 gap-6">
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.key} delay={i * 0.15}>
                  <div className="text-center">
                    <div className="flex justify-center mb-4 text-brand">
                      {step.icon}
                    </div>
                    <h3 className="text-base font-bold text-navy-800 mb-2">
                      {t(`process.${step.key}_title`)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {t(`process.${step.key}_desc`)}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden space-y-0">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.key} delay={i * 0.1}>
                <div className="flex gap-4">
                  {/* Left: number + vertical line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg shadow-brand/25">
                      {i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className="pb-8">
                    <div className="text-brand mb-2">{step.icon}</div>
                    <h3 className="text-lg font-bold text-navy-800 mb-1">
                      {t(`process.${step.key}_title`)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {t(`process.${step.key}_desc`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">
              {t("process.cta_title")}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-8">
              {t("process.cta_desc")}
            </p>
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 text-lg"
            >
              {t("cta.calculate")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
