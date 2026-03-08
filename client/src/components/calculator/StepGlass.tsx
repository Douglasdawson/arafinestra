import { useTranslation } from "react-i18next";

interface Props {
  selected: string;
  onSelect: (glass: string) => void;
  compatibleGlasses?: string[];
}

const GLASS_TYPES = [
  { id: "doble", stars: 3, recommended: false },
  { id: "baix_emissiu", stars: 4, recommended: true },
  { id: "triple", stars: 5, recommended: false },
];

export default function StepGlass({ selected, onSelect, compatibleGlasses }: Props) {
  const { t } = useTranslation();

  const glasses = compatibleGlasses && compatibleGlasses.length > 0
    ? GLASS_TYPES.filter((g) => compatibleGlasses.includes(g.id))
    : GLASS_TYPES;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-900 text-center">
        {t("calculator.step_glass")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_glass_desc")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {glasses.map(({ id, stars, recommended }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`relative p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-brand bg-brand-light shadow-md"
                  : recommended
                  ? "border-brand/40 bg-brand-light/30 hover:border-brand/60"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm z-10">
                  {t("calculator_badge_popular")}
                </div>
              )}
              {isSelected && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-brand rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Glass icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-light rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm4 4h10v10H7V7z" />
                </svg>
              </div>

              <h3 className="font-semibold text-navy-800 text-sm sm:text-base mb-1">{t(`calculator.glass_${id}`)}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{t(`calculator.glass_${id}_desc`)}</p>

              {/* Star rating */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-xs text-gray-500 mr-1 hidden sm:inline">{t("calculator.insulation")}:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < stars ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
