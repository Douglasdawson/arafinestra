import { useTranslation } from "react-i18next";

interface Props {
  cantidad: number;
  onChange: (value: number) => void;
}

const QUICK_PICKS = [1, 2, 3, 4, 5, 8, 10];

export default function StepQuantity({ cantidad, onChange }: Props) {
  const { t } = useTranslation();

  const decrement = () => onChange(Math.max(1, cantidad - 1));
  const increment = () => onChange(Math.min(20, cantidad + 1));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {t("calculator.step_quantity")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_quantity_desc")}</p>

      {/* Large counter */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={decrement}
          disabled={cantidad <= 1}
          className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <span className="text-6xl font-bold text-blue-600 w-24 text-center tabular-nums">
          {cantidad}
        </span>

        <button
          onClick={increment}
          disabled={cantidad >= 20}
          className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Quick select */}
      <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
        {QUICK_PICKS.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${
              cantidad === n
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
