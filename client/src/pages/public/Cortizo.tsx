import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";

export default function Cortizo() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || i18n.language || "ca";

  const specs = [
    { label: t("cortizo.spec_thermal"), value: t("cortizo.spec_thermal_val") },
    { label: t("cortizo.spec_acoustic"), value: t("cortizo.spec_acoustic_val") },
    { label: t("cortizo.spec_security"), value: t("cortizo.spec_security_val") },
    { label: t("cortizo.spec_watertight"), value: t("cortizo.spec_watertight_val") },
    { label: t("cortizo.spec_wind"), value: t("cortizo.spec_wind_val") },
  ];

  const series = [
    { name: "C-70", desc: t("cortizo.series_c70") },
    { name: "A-84", desc: t("cortizo.series_a84") },
    { name: "E-170", desc: t("cortizo.series_e170") },
  ];

  return (
    <>
      <PageHead
        title={t("cortizo.page_title")}
        description={t("cortizo.page_desc")}
        path="/cortizo"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{t("cortizo.h1")}</h1>
          <p className="mt-4 text-xl text-brand-light max-w-2xl mx-auto">{t("cortizo.subtitle")}</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-navy-800 mb-6">{t("cortizo.story_title")}</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{t("cortizo.story_p1")}</p>
            <p className="text-slate-600 leading-relaxed">{t("cortizo.story_p2")}</p>
          </div>
        </div>
      </section>

      {/* Product Ranges */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("cortizo.series_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {series.map((s) => (
              <div key={s.name} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-brand mb-2">{s.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Table */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">{t("cortizo.specs_title")}</h2>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("cortizo.spec_property")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("cortizo.spec_value")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {specs.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-6 py-4 text-sm text-slate-700">{spec.label}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">{t("cortizo.certs_title")}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["ISO 9001", "ISO 14001", "CE", "AENOR"].map((cert) => (
              <div
                key={cert}
                className="px-6 py-3 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-700"
              >
                {cert}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 max-w-xl mx-auto">{t("cortizo.certs_desc")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("cortizo.cta_title")}</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("cortizo.cta_desc")}</p>
          <Link
            to={`/${prefix}/pressupost`}
            className="inline-flex items-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 text-lg"
          >
            {t("cta.calculate")}
          </Link>
        </div>
      </section>
    </>
  );
}
