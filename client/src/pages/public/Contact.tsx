import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import BreadcrumbSchema from "../../components/seo/BreadcrumbSchema";
import ScrollReveal from "../../components/ui/ScrollReveal";
import { trackEvent } from "../../lib/analytics";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    tipoCliente: "particular",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          email: form.email,
          telefono: form.telefono,
          notas: form.mensaje,
          tipoCliente: form.tipoCliente,
          origen: "formulario",
        }),
      });
      if (res.ok) {
        trackEvent("submit", "contact_form");
        setSuccess(true);
        setForm({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: "",
          tipoCliente: "particular",
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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ARA FINESTRA",
    description: t("hero.description"),
    url: "https://arafinestra.com",
    telephone: "+34XXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Girona",
      addressRegion: "Catalunya",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.9794,
      longitude: 2.8214,
    },
  };

  const inputCls =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all";

  return (
    <>
      <PageHead
        title={t("contact.title")}
        description={t("contact.title") + " - ARA FINESTRA"}
        path="/contacte"
        schema={localBusinessSchema}
      />
      <BreadcrumbSchema items={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.contact"), url: "/contacte" },
      ]} />

      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight animate-fadeIn">
            {t("contact.title")}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8">
                  {t("contact.form_title")}
                </h2>
              </ScrollReveal>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("contact.success")}
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
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.phone")}
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("contact.client_type")}
                      </label>
                      <select
                        name="tipoCliente"
                        value={form.tipoCliente}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        <option value="particular">{t("contact.particular")}</option>
                        <option value="constructora">{t("contact.builder")}</option>
                        <option value="comunitat">{t("contact.community")}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("contact.message")}
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={5}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full px-6 py-3.5 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base btn-press"
                  >
                    {sending ? "..." : t("contact.send")}
                  </button>
                </form>
              </ScrollReveal>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-8">
                  {t("contact.info_title")}
                </h2>
              </ScrollReveal>
              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    ),
                    title: t("contact.phone"),
                    content: (
                      <a href="tel:+34XXXXXXXXX" className="text-brand hover:text-brand-dark font-medium link-underline">
                        +34 XXX XXX XXX
                      </a>
                    ),
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    ),
                    title: t("contact.email"),
                    content: (
                      <a href="mailto:info@arafinestra.com" className="text-brand hover:text-brand-dark font-medium link-underline">
                        info@arafinestra.com
                      </a>
                    ),
                  },
                  {
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </>
                    ),
                    title: t("contact.address"),
                    content: <span className="text-slate-600">Girona, Catalunya</span>,
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    title: t("contact.hours"),
                    content: <span className="text-slate-600">{t("contact.hours_detail")}</span>,
                  },
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={0.25 + i * 0.08}>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand-light text-brand">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-800">
                          {item.title}
                        </p>
                        <div className="text-sm mt-0.5">{item.content}</div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}

                {/* WhatsApp */}
                <ScrollReveal delay={0.6}>
                  <a
                    href="https://wa.me/34XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("click", "whatsapp", "contact_page")}
                    className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.149-3.073.913.913-3.073-.163-.26A7.962 7.962 0 014 12a8 8 0 1116 0 8 8 0 01-8 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        WhatsApp
                      </p>
                      <p className="text-sm text-emerald-600 group-hover:text-emerald-700">
                        {t("contact.whatsapp_cta")}
                      </p>
                    </div>
                  </a>
                </ScrollReveal>
              </div>

              {/* Map */}
              <ScrollReveal delay={0.7}>
                <div className="mt-8 rounded-xl overflow-hidden shadow-md border border-slate-200">
                  <iframe
                    title="ARA FINESTRA location"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d2.8214!3d41.9794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sca!2ses!4v1"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
