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
        <h2 className="text-2xl font-bold text-gray-800">
          {t("calculator.result_title")}
        </h2>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <p className="text-blue-100 text-sm uppercase tracking-wider mb-2">
            {t("calculator.result_from")}
          </p>
          <p className="text-5xl sm:text-6xl font-bold tracking-tight animate-[fadeIn_0.6s_ease-out]">
            {low.toLocaleString()}&euro; &mdash; {high.toLocaleString()}&euro;
          </p>
          {state.cantidad > 1 && (
            <p className="text-blue-200 mt-2 text-sm">
              {state.cantidad} {t("calculator.units")} &middot; ~{Math.round(low / state.cantidad)}&euro;/u
            </p>
          )}
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
            <h3 className="text-xl font-bold text-gray-800">{t("calculator.want_exact")}</h3>
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.phone")} *</label>
                <input
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.email")}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("calculator.locality")}</label>
                <input
                  type="text"
                  value={form.localidad}
                  onChange={(e) => setForm((f) => ({ ...f, localidad: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {submitting ? t("calculator.sending") : t("cta.request_quote")}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
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
          className="text-blue-600 hover:text-blue-800 font-medium text-sm underline underline-offset-2"
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
      <span className="text-gray-800 font-medium text-sm text-right">{value}</span>
    </div>
  );
}
