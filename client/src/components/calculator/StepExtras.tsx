import { useTranslation } from "react-i18next";

interface Props {
  tipo: string;
  extras: string[];
  onToggle: (extra: string) => void;
}

export default function StepExtras({ tipo, extras, onToggle }: Props) {
  const { t } = useTranslation();

  const showShutter = tipo !== "persiana" && tipo !== "mosquitera";
  const showMosquito = tipo !== "mosquitera";

  const options = [
    ...(showShutter
      ? [
          {
            id: "persiana_integrada",
            icon: "M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2zm0 4h16v2H4v-2z",
            surcharge: "+~15%",
          },
        ]
      : []),
    ...(showMosquito
      ? [
          {
            id: "mosquitera_integrada",
            icon: "M4 3h16v18H4V3zm2 2v14h12V5H6zm2 2h2v2H8V7zm4 0h2v2h-2V7zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z",
            surcharge: "+~5%",
          },
        ]
      : []),
  ];

  if (options.length === 0) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-navy-900">{t("calculator.step_extras")}</h2>
        <p className="text-gray-500">{t("calculator.no_extras")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy-900 text-center">
        {t("calculator.step_extras")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_extras_desc")}</p>

      <div className="space-y-4 max-w-lg mx-auto">
        {options.map(({ id, icon, surcharge }) => {
          const isActive = extras.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-brand bg-brand-light"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <svg className="w-10 h-10 text-navy-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>

              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800">
                  {t(`calculator.${id}`)}
                </h3>
                <p className="text-sm text-gray-500">{t(`calculator.${id}_desc`)}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  {surcharge}
                </span>
                {/* Toggle switch */}
                <div
                  className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
                    isActive ? "bg-brand" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                      isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
