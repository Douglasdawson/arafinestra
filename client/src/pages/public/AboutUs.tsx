import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";

const VALUES = [
  {
    key: "quality",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    key: "proximity",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    key: "transparency",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "warranty",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const STATS = [
  { key: "projects", value: "500+" },
  { key: "warranty_years", value: "10" },
  { key: "rating", value: "4.9/5" },
  { key: "coverage", value: "60 km" },
];

const TEAM = [
  {
    key: "installer",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
  },
  {
    key: "advisor",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    key: "technician",
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const CERTIFICATIONS = [
  { key: "cortizo_partner", icon: "cortizo" },
  { key: "ce_marking", icon: "ce" },
  { key: "iso_9001", icon: "iso" },
  { key: "energy_efficiency", icon: "energy" },
];

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ARA FINESTRA",
    url: "https://arafinestra.com",
    logo: "https://arafinestra.com/og-image.svg",
    description: t("about_page.page_desc"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Blanes",
      addressRegion: "Girona",
      addressCountry: "ES",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 41.674,
        longitude: 2.79,
      },
      geoRadius: "60000",
    },
    telephone: "+34611500372",
    email: "info@arafinestra.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "47",
    },
  };

  return (
    <>
      <PageHead
        title={t("about_page.page_title")}
        description={t("about_page.page_desc")}
        path="/qui-som"
        schema={organizationSchema}
      />
      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), url: `/${prefix}` },
          { name: t("nav.about"), url: `/${prefix}/qui-som` },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[15%] w-[180px] h-[180px] rounded-full bg-brand/8 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            {t("about_page.title")}
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            {t("about_page.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-navy-800 mb-6">
                {t("about_page.story_title")}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t("about_page.story_p1")}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t("about_page.story_p2")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              {t("about_page.stats_title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.key} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-brand mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300">
                    {t(`about_page.stat_${stat.key}`)}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-12">
              {t("about_page.values_title")}
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.key} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center h-full">
                  <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center text-brand mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy-800 mb-2">
                    {t(`about_page.value_${value.key}_title`)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(`about_page.value_${value.key}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-4">
              {t("about_page.team_title")}
            </h2>
            <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
              {t("about_page.team_subtitle")}
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.key} delay={i * 0.15}>
                <div className="text-center">
                  <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                    {member.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy-800 mb-1">
                    {t(`about_page.team_${member.key}_title`)}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {t(`about_page.team_${member.key}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-12">
              {t("about_page.certs_title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {CERTIFICATIONS.map((cert, i) => (
              <ScrollReveal key={cert.key} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
                  <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                    {cert.icon === "cortizo" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    )}
                    {cert.icon === "ce" && (
                      <span className="text-sm font-bold">CE</span>
                    )}
                    {cert.icon === "iso" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    )}
                    {cert.icon === "energy" && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-navy-800 mb-1">
                    {t(`about_page.cert_${cert.key}_title`)}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t(`about_page.cert_${cert.key}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">
              {t("about_page.cta_title")}
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto mb-8">
              {t("about_page.cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={`/${prefix}/pressupost`}
                className="inline-flex items-center gap-2 px-5 sm:px-8 py-3.5 sm:py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 text-base sm:text-lg pulse-glow-btn"
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
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
