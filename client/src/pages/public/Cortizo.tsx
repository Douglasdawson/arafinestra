import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import ScrollReveal from "../../components/ui/ScrollReveal";

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
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] rounded-full bg-brand/8 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">{t("cortizo.h1")}</h1>
          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light">{t("cortizo.subtitle")}</p>
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
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("cortizo.spec_property")}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("cortizo.spec_value")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {specs.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-slate-700">{spec.label}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium text-slate-800">{spec.value}</td>
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

      {/* Material Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-navy-800 mb-10 text-center">
              {t("cortizo.comparison_title")}
            </h2>
          </ScrollReveal>

          {/* Desktop table */}
          <ScrollReveal delay={0.15} className="hidden md:block">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      {t("cortizo.comp_characteristic")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white bg-brand-light/20">
                      {t("cortizo.comp_pvc")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      {t("cortizo.comp_aluminium")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      {t("cortizo.comp_wood")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { key: "thermal", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★★", aluLabel: t("cortizo.comp_regular"), wood: "★★★★", woodLabel: t("cortizo.comp_good") },
                    { key: "acoustic", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★★", aluLabel: t("cortizo.comp_regular"), wood: "★★★★", woodLabel: t("cortizo.comp_good") },
                    { key: "maintenance", pvc: "★★★★★", pvcLabel: t("cortizo.comp_zero"), alu: "★★★★", aluLabel: t("cortizo.comp_low"), wood: "★★", woodLabel: t("cortizo.comp_high") },
                    { key: "durability", pvc: "★★★★★", pvcLabel: "50+", alu: "★★★★", aluLabel: "30+", wood: "★★★", woodLabel: "20+" },
                    { key: "sustainability", pvc: "★★★★★", pvcLabel: t("cortizo.comp_recyclable_100"), alu: "★★★★", aluLabel: t("cortizo.comp_recyclable"), wood: "★★★", woodLabel: t("cortizo.comp_renewable") },
                    { key: "price", pvc: "★★★★", pvcLabel: t("cortizo.comp_good_value"), alu: "★★★", aluLabel: t("cortizo.comp_medium"), wood: "★★", woodLabel: t("cortizo.comp_expensive") },
                    { key: "condensation", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★", aluLabel: t("cortizo.comp_poor"), wood: "★★★", woodLabel: t("cortizo.comp_regular") },
                  ].map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {t(`cortizo.comp_row_${row.key}`)}
                      </td>
                      <td className="px-6 py-4 text-center bg-brand-light/10">
                        <span className="text-brand text-sm">{row.pvc}</span>
                        <span className="block text-xs text-slate-600 mt-0.5">{row.pvcLabel}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-slate-400 text-sm">{row.alu}</span>
                        <span className="block text-xs text-slate-600 mt-0.5">{row.aluLabel}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-amber-600 text-sm">{row.wood}</span>
                        <span className="block text-xs text-slate-600 mt-0.5">{row.woodLabel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {[
              { key: "thermal", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★★", aluLabel: t("cortizo.comp_regular"), wood: "★★★★", woodLabel: t("cortizo.comp_good") },
              { key: "acoustic", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★★", aluLabel: t("cortizo.comp_regular"), wood: "★★★★", woodLabel: t("cortizo.comp_good") },
              { key: "maintenance", pvc: "★★★★★", pvcLabel: t("cortizo.comp_zero"), alu: "★★★★", aluLabel: t("cortizo.comp_low"), wood: "★★", woodLabel: t("cortizo.comp_high") },
              { key: "durability", pvc: "★★★★★", pvcLabel: "50+", alu: "★★★★", aluLabel: "30+", wood: "★★★", woodLabel: "20+" },
              { key: "sustainability", pvc: "★★★★★", pvcLabel: t("cortizo.comp_recyclable_100"), alu: "★★★★", aluLabel: t("cortizo.comp_recyclable"), wood: "★★★", woodLabel: t("cortizo.comp_renewable") },
              { key: "price", pvc: "★★★★", pvcLabel: t("cortizo.comp_good_value"), alu: "★★★", aluLabel: t("cortizo.comp_medium"), wood: "★★", woodLabel: t("cortizo.comp_expensive") },
              { key: "condensation", pvc: "★★★★★", pvcLabel: t("cortizo.comp_excellent"), alu: "★★", aluLabel: t("cortizo.comp_poor"), wood: "★★★", woodLabel: t("cortizo.comp_regular") },
            ].map((row, i) => (
              <ScrollReveal key={row.key} delay={i * 0.08}>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-navy-800 px-4 py-3">
                    <h3 className="text-sm font-semibold text-white">
                      {t(`cortizo.comp_row_${row.key}`)}
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="flex items-center justify-between px-4 py-3 bg-brand-light/10">
                      <span className="text-sm font-medium text-slate-700">{t("cortizo.comp_pvc")}</span>
                      <div className="text-right">
                        <span className="text-brand text-sm">{row.pvc}</span>
                        <span className="block text-xs text-slate-600">{row.pvcLabel}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">{t("cortizo.comp_aluminium")}</span>
                      <div className="text-right">
                        <span className="text-slate-400 text-sm">{row.alu}</span>
                        <span className="block text-xs text-slate-600">{row.aluLabel}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">{t("cortizo.comp_wood")}</span>
                      <div className="text-right">
                        <span className="text-amber-600 text-sm">{row.wood}</span>
                        <span className="block text-xs text-slate-600">{row.woodLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">{t("cortizo.cta_title")}</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("cortizo.cta_desc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/${prefix}/pressupost`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-semibold rounded-lg text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 pulse-glow-btn"
            >
              {t("cta.calculate")}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to={`/${prefix}/visita-gratuita`}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-navy-800 text-navy-800 font-semibold rounded-lg text-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              {t("cta.free_visit")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
