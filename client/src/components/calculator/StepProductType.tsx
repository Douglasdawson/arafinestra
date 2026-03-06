import { useTranslation } from "react-i18next";

interface Props {
  selected: string;
  onSelect: (tipo: string) => void;
}

const PRODUCT_TYPES = [
  {
    id: "ventana",
    iconPath: "M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h2v8H8V8zm6 0h2v8h-2V8z",
    descKey: "services.windows_desc",
  },
  {
    id: "puerta",
    iconPath: "M4 3h16v18H4V3zm2 2v14h5V5H6zm7 0v14h5V5h-5zm2 6h1v2h-1v-2z",
    descKey: "services.doors_desc",
  },
  {
    id: "persiana",
    iconPath: "M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2zm0 4h16v2H4v-2z",
    descKey: "services.shutters_desc",
  },
  {
    id: "mosquitera",
    iconPath: "M4 3h16v18H4V3zm2 2v14h12V5H6zm2 2h2v2H8V7zm4 0h2v2h-2V7zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z",
    descKey: "services.mosquito_desc",
  },
];

const NAME_KEYS: Record<string, string> = {
  ventana: "nav.windows",
  puerta: "nav.sliding_doors",
  persiana: "nav.shutters",
  mosquitera: "nav.mosquito_nets",
};

export default function StepProductType({ selected, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {t("calculator.step_product")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_product_desc")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {PRODUCT_TYPES.map(({ id, iconPath, descKey }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <svg className="w-12 h-12 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">{t(NAME_KEYS[id])}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t(descKey)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
