import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";
import { trackEvent } from "../../lib/analytics";
import GuaranteeBlock from "../../components/ui/GuaranteeBlock";

const COVERAGE_TOWNS = [
  "Blanes", "Lloret de Mar", "Tossa de Mar", "Girona", "Figueres",
  "Salt", "Palafrugell", "Sant Feliu de Guíxols", "Olot", "Banyoles",
  "Palamós", "Roses", "Mataró", "Pineda de Mar", "Calella",
  "Arenys de Mar", "Canet de Mar", "Santa Coloma de Farners",
];

export default function FreeVisit() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    ciudad: "",
    franja: "mati",
    descripcion: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    setSuccess(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          email: form.email,
          notas: `[Ciutat: ${form.ciudad}] [Franja: ${form.franja}] ${form.descripcion}`,
          origen: "visita_gratuita",
        }),
      });
      if (res.ok) {
        trackEvent("submit", "free_visit");
        setSuccess(true);
        setForm({
          nombre: "",
          telefono: "",
          email: "",
          ciudad: "",
          franja: "mati",
          descripcion: "",
        });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all";

  const freeVisitSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Visita gratuïta a domicili - ARA FINESTRA",
    description: t("free_visit.seo_desc"),
    provider: {
      "@type": "LocalBusiness",
      name: "ARA FINESTRA",
      telephone: "+34611500372",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Girona",
        addressRegion: "Catalunya",
        addressCountry: "ES",
      },
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 41.6863,
        longitude: 2.79,
      },
      geoRadius: "60000",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: t("free_visit.hero_sub"),
    },
  };

  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: t("free_visit.step1_title"),
      desc: t("free_visit.step1_desc"),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      title: t("free_visit.step2_title"),
      desc: t("free_visit.step2_desc"),
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
        </svg>
      ),
      title: t("free_visit.step3_title"),
      desc: t("free_visit.step3_desc"),
    },
  ];

  const faqs = [
    { q: t("free_visit.faq1_q"), a: t("free_visit.faq1_a") },
    { q: t("free_visit.faq2_q"), a: t("free_visit.faq2_a") },
    { q: t("free_visit.faq3_q"), a: t("free_visit.faq3_a") },
    { q: t("free_visit.faq4_q"), a: t("free_visit.faq4_a") },
    { q: t("free_visit.faq5_q"), a: t("free_visit.faq5_a") },
    { q: t("free_visit.faq6_q"), a: t("free_visit.faq6_a") },
  ];

  return (
    <>
      <PageHead
        title={t("free_visit.page_title")}
        description={t("free_visit.seo_desc")}
        path="/visita-gratuita"
        schema={freeVisitSchema}
      />
      <BreadcrumbSchema
        items={[
          { name: t("nav.home"), url: `/${prefix}` },
          { name: t("nav.free_visit"), url: `/${prefix}/visita-gratuita` },
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[15%] w-[200px] h-[200px] rounded-full bg-brand/8 blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[150px] h-[150px] rounded-full bg-emerald-500/8 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/20 border border-brand/30 rounded-full text-sm font-medium text-brand-light mb-6 animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t("free_visit.hero_badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight animate-fadeIn">
            {t("free_visit.hero_title")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto animate-fadeIn">
            {t("free_visit.hero_sub")}
          </p>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 text-center mb-12">
              {t("free_visit.how_title")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-brand-light text-brand">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-brand/25">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-navy-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Trust sidebar */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form — left / top on mobile */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                  {t("free_visit.form_title")}
                </h2>
                <p className="text-slate-600 mb-8">{t("free_visit.form_sub")}</p>
              </ScrollReveal>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p>{t("free_visit.success")}</p>
                    <p className="mt-1 text-emerald-600 text-xs font-normal">{t("free_visit.success_detail")}</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium animate-fadeIn">
                  {t("contact.error")}
                </div>
              )}

              <ScrollReveal delay={0.1}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.name")} *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        autoComplete="name"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.phone")} *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="611 500 372"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.email")} <span className="text-slate-400 font-normal">({t("contact.optional")})</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("free_visit.city")} *
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        autoComplete="address-level2"
                        placeholder={t("free_visit.city_placeholder")}
                        value={form.ciudad}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("free_visit.time_slot")}
                    </label>
                    <select
                      name="franja"
                      value={form.franja}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="mati">{t("free_visit.morning")}</option>
                      <option value="tarda">{t("free_visit.afternoon")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("free_visit.description")} <span className="text-slate-400 font-normal">({t("contact.optional")})</span>
                    </label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={4}
                      placeholder={t("free_visit.description_placeholder")}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full px-6 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg btn-press shadow-lg shadow-brand/25"
                  >
                    {sending ? "..." : t("free_visit.submit")}
                  </button>

                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {t("trust.secure")}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t("trust.no_spam")}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {t("trust.certified")}
                    </span>
                  </div>
                </form>
              </ScrollReveal>
            </div>

            {/* Trust sidebar — right */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="space-y-5">
                  {/* Google rating */}
                  <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-amber-400 text-lg tracking-tight">★★★★★</span>
                      <span className="text-sm font-bold text-navy-800">{t("contact.google_rating")}</span>
                    </div>
                    <p className="text-xs text-slate-600">Google Reviews</p>
                  </div>

                  {/* Trust points */}
                  {[
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      ),
                      text: t("free_visit.trust_warranty"),
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      ),
                      text: t("free_visit.trust_exact"),
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      ),
                      text: t("free_visit.trust_certified"),
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand-light text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-navy-800 pt-2">{item.text}</p>
                    </div>
                  ))}

                  {/* Testimonial */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-6 h-6 text-brand/40 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-sm text-slate-700 italic leading-relaxed mb-3">
                      {t("free_visit.testimonial_text")}
                    </p>
                    <p className="text-xs font-semibold text-navy-800">{t("free_visit.testimonial_author")}</p>
                    <p className="text-xs text-slate-500">{t("free_visit.testimonial_location")}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 text-center mb-4">
              {t("free_visit.coverage_title")}
            </h2>
            <p className="text-slate-600 text-center max-w-xl mx-auto mb-10">
              {t("free_visit.coverage_sub")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {COVERAGE_TOWNS.map((town) => (
                <span
                  key={town}
                  className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm text-navy-700 font-medium shadow-sm"
                >
                  {town}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              {t("free_visit.coverage_more")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Triple Guarantee — compact */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GuaranteeBlock compact />
        </div>
      </section>

      {/* FAQ mini */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 text-center mb-10">
              {t("free_visit.faq_title")}
            </h2>
          </ScrollReveal>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="text-base font-bold text-navy-800 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
