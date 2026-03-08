import { useTranslation } from "react-i18next";

interface Props {
  ancho: number;
  alto: number;
  hojas: number;
  onChange: (field: "ancho" | "alto" | "hojas", value: number) => void;
}

export default function StepDimensions({ ancho, alto, hojas, onChange }: Props) {
  const { t } = useTranslation();
  const area = ((ancho / 100) * (alto / 100)).toFixed(2);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-navy-900 text-center">
        {t("calculator.step_dimensions")}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 max-w-3xl mx-auto items-center">
        {/* Visual window representation */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative border-4 border-navy-700 rounded-md bg-navy-50/30 flex items-center justify-center"
            style={{
              width: Math.max(80, Math.min(220, ancho * 0.55)),
              height: Math.max(80, Math.min(220, alto * 0.55)),
            }}
          >
            {/* Leaves */}
            <div className="flex w-full h-full p-1 gap-0.5">
              {Array.from({ length: hojas }).map((_, i) => (
                <div key={i} className="flex-1 border-2 border-navy-600 rounded-sm bg-brand-light/50 flex items-center justify-center">
                  {/* Handle */}
                  <div className="w-1 h-4 bg-navy-600 rounded-full" />
                </div>
              ))}
            </div>
            {/* Dimensions labels — hidden on very small screens to prevent overflow */}
            <div className="absolute -bottom-7 left-0 right-0 text-center text-sm font-medium text-navy-700 hidden sm:block">
              {ancho} cm
            </div>
            <div className="absolute -right-10 top-0 bottom-0 hidden sm:flex items-center">
              <span className="text-sm font-medium text-navy-700 -rotate-90 whitespace-nowrap">{alto} cm</span>
            </div>
            {/* Inline fallback for mobile */}
            <div className="sm:hidden absolute -bottom-6 left-0 right-0 text-center text-xs font-medium text-navy-700">
              {ancho} x {alto} cm
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1 space-y-6 w-full max-w-sm">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("calculator.width")}</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={40}
                max={400}
                value={ancho}
                onChange={(e) => onChange("ancho", parseInt(e.target.value))}
                className="flex-1 accent-brand"
              />
              <input
                type="number"
                min={40}
                max={400}
                value={ancho}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 40;
                  onChange("ancho", Math.max(40, Math.min(400, v)));
                }}
                inputMode="numeric"
                className="w-20 px-3 py-2 text-base border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("calculator.height")}</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={40}
                max={300}
                value={alto}
                onChange={(e) => onChange("alto", parseInt(e.target.value))}
                className="flex-1 accent-brand"
              />
              <input
                type="number"
                min={40}
                max={300}
                value={alto}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 40;
                  onChange("alto", Math.max(40, Math.min(300, v)));
                }}
                inputMode="numeric"
                className="w-20 px-3 py-2 text-base border border-gray-300 rounded-lg text-center font-mono focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          {/* Leaves */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("calculator.leaves")}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => onChange("hojas", n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    hojas === n
                      ? "bg-brand text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated area */}
          <div className="bg-navy-50 rounded-lg p-4 text-center">
            <span className="text-sm text-navy-700 font-medium">{t("calculator.area")}</span>
            <span className="ml-2 text-xl font-bold text-navy-900">{area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
