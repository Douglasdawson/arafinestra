import { useTranslation } from "react-i18next";
import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

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
          <p className="text-5xl sm:text-6xl font-bold tracking-tight animate-[fadeIn_0.6s_ease-out]">
            {low.toLocaleString()}&euro; &mdash; {high.toLocaleString()}&euro;
          </p>
          {state.cantidad > 1 && (
            <p className="text-navy-100 mt-2 text-sm">
              {state.cantidad} {t("calculator.units")} &middot; ~{Math.round(low / state.cantidad)}&euro;/u
            </p>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-1">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {t("calculator.social_proof")}
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-600">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          {t("calculator.warranty_note")}
        </div>
      </div>

      {/* Summary */}
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
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors ${
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
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors ${
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
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("calculator.locality")}</label>
                <input
                  type="text"
                  value={form.localidad}
                  onChange={(e) => setForm((f) => ({ ...f, localidad: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
            >
              {submitting ? t("calculator.sending") : t("cta.request_quote")}
            </button>
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
