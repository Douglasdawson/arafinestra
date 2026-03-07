import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { trackEvent } from "../../lib/analytics";

const WHATSAPP_NUMBER = "34611500372";
const PHONE_NUMBER = "+34611500372";

interface CalculatorState {
  step: number;
  tipo: string;
  modelo: string;
  modeloId: number | null;
  hojas: number;
  ancho: number;
  alto: number;
  color: string;
  vidrio: string;
  extras: string[];
  cantidad: number;
}

interface Props {
  state: CalculatorState;
  onReset: () => void;
}

function calculatePrice(state: CalculatorState): { low: number; high: number; base: number } {
  const area = (state.ancho / 100) * (state.alto / 100);

  // Default pricing if no product found
  const precioBase = 200;
  const precioPorM2 = 150;

  let basePrice = precioBase + precioPorM2 * area;

  // Multipliers
  if (state.hojas > 2) basePrice *= 1.15;
  if (state.vidrio === "baix_emissiu") basePrice *= 1.12;
  if (state.vidrio === "triple") basePrice *= 1.25;
  if (state.color !== "blanc") basePrice *= 1.08;

  // Extras
  if (state.extras.includes("persiana_integrada")) basePrice *= 1.15;
  if (state.extras.includes("mosquitera_integrada")) basePrice *= 1.05;

  const total = basePrice * state.cantidad;
  return {
    low: Math.round(total * 0.85),
    high: Math.round(total * 1.15),
    base: Math.round(total),
  };
}

const COLOR_LABELS: Record<string, string> = {
  blanc: "calculator.color_blanc",
  roure: "calculator.color_roure",
  gris_antracita: "calculator.color_gris_antracita",
  noguer: "calculator.color_noguer",
  crema: "calculator.color_crema",
};

const GLASS_LABELS: Record<string, string> = {
  doble: "calculator.glass_doble",
  baix_emissiu: "calculator.glass_baix_emissiu",
  triple: "calculator.glass_triple",
};

const TIPO_LABELS: Record<string, string> = {
  ventana: "nav.windows",
  puerta: "nav.sliding_doors",
  persiana: "nav.shutters",
  mosquitera: "nav.mosquito_nets",
};

export default function Result({ state, onReset }: Props) {
  const { t } = useTranslation();
  const { low, high } = calculatePrice(state);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    localidad: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email || null,
          telefono: form.telefono,
          localidad: form.localidad || null,
          origen: "presupuestador",
          tipoCliente: "particular",
          presupuestoDatos: {
            ...state,
            precioEstimado: { low, high },
          },
        }),
      });

      if (!res.ok) throw new Error();
      trackEvent("complete", "calculator");
      setSubmitted(true);
    } catch {
      setError(t("calculator.form_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const priceRange = `${low.toLocaleString()}\u20AC - ${high.toLocaleString()}\u20AC`;

  const configSummary = useMemo(() => {
    const parts = [
      t(TIPO_LABELS[state.tipo] || state.tipo),
      state.modelo,
      `${state.ancho}x${state.alto}cm`,
      t(COLOR_LABELS[state.color] || state.color),
      t(GLASS_LABELS[state.vidrio] || state.vidrio),
    ];
    if (state.cantidad > 1) parts.push(`x${state.cantidad}`);
    return parts.join(", ");
  }, [state, t]);

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    t("calculator.share_whatsapp_msg", { price: priceRange, summary: configSummary })
  )}`;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Price display */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-navy-900">
          {t("calculator.result_title")}
        </h2>
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 text-white shadow-lg">
          <p className="text-navy-100 text-sm uppercase tracking-wider mb-2">
            {t("calculator.result_from")}
          </p>
          <p className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-[fadeIn_0.6s_ease-out]">
            {low.toLocaleString()}&euro; &mdash; {high.toLocaleString()}&euro;
          </p>
          {state.cantidad > 1 && (
            <p className="text-navy-100 mt-2 text-sm">
              {state.cantidad} {t("calculator.units")} &middot; ~{Math.round(low / state.cantidad)}&euro;/u
            </p>
          )}
        </div>

        {/* Urgency message */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t("calculator.urgency_slots")}
        </div>

        {/* Social proof count */}
        <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-1">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {t("calculator.social_proof_count")}
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-600">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          {t("calculator.warranty_note")}
        </div>

        {/* Action buttons: Call + WhatsApp share */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() => trackEvent("click", "phone", "calculator_result")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t("calculator.call_now")}
          </a>
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("click", "whatsapp_share", "calculator_result")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg text-base"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("calculator.share_whatsapp")}
          </a>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm font-medium text-gray-500 mb-2">{t("calculator.your_config")}</p>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <SummaryRow label={t("calculator.step_product")} value={t(TIPO_LABELS[state.tipo] || state.tipo)} />
        <SummaryRow label={t("calculator.step_model")} value={state.modelo} />
        <SummaryRow
          label={t("calculator.step_dimensions")}
          value={`${state.ancho} x ${state.alto} cm (${((state.ancho / 100) * (state.alto / 100)).toFixed(2)} m²) · ${state.hojas} ${t("calculator.leaves_short")}`}
        />
        <SummaryRow label={t("calculator.step_color")} value={t(COLOR_LABELS[state.color] || state.color)} />
        <SummaryRow label={t("calculator.step_glass")} value={t(GLASS_LABELS[state.vidrio] || state.vidrio)} />
        {state.extras.length > 0 && (
          <SummaryRow
            label={t("calculator.step_extras")}
            value={state.extras.map((e) => t(`calculator.${e}`)).join(", ")}
          />
        )}
        <SummaryRow label={t("calculator.step_quantity")} value={String(state.cantidad)} />
      </div>

      {/* Lead capture */}
      {!submitted ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-navy-900">{t("calculator.want_exact")}</h3>
            <p className="text-gray-500 text-sm mt-1">{t("calculator.exact_desc")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.name")} *</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                  className={`w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors ${
                    touched.nombre && !form.nombre ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
                {touched.nombre && !form.nombre && (
                  <p className="text-red-500 text-xs mt-1">{t("contact.name")} *</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.phone")} *</label>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
                  className={`w-full px-4 py-2.5 text-base border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors ${
                    touched.telefono && !form.telefono ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
                {touched.telefono && !form.telefono && (
                  <p className="text-red-500 text-xs mt-1">{t("contact.phone")} *</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.email")}</label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("calculator.locality")}</label>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={form.localidad}
                  onChange={(e) => setForm((f) => ({ ...f, localidad: e.target.value }))}
                  className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
              >
                {submitting ? t("calculator.sending_quote") : t("calculator.submit_quote")}
              </button>
              <a
                href={`tel:${PHONE_NUMBER}`}
                onClick={() => trackEvent("click", "phone", "calculator_form")}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t("calculator.call_now")}
              </a>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-3 text-center">
            {t("calculator.urgency")}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-3 animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800">{t("calculator.success_title")}</h3>
          <p className="text-green-700">{t("calculator.success_desc")}</p>
        </div>
      )}

      {/* Start over */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-navy-700 hover:text-navy-900 font-medium text-sm underline underline-offset-2"
        >
          {t("calculator.start_over")}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-5 py-3">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-navy-900 font-medium text-sm text-right">{value}</span>
    </div>
  );
}
