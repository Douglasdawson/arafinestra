import { useTranslation } from "react-i18next";

interface Props {
  selected: string;
  onSelect: (color: string) => void;
  availableColors?: string[];
}

const DEFAULT_COLORS = [
  { id: "blanc", hex: "#FFFFFF", border: true },
  { id: "roure", hex: "#8B5E3C" },
  { id: "gris_antracita", hex: "#3C3C3C" },
  { id: "noguer", hex: "#5C3A1E" },
  { id: "crema", hex: "#F5F0E1" },
];

export default function StepColor({ selected, onSelect, availableColors }: Props) {
  const { t } = useTranslation();

  const colors = availableColors && availableColors.length > 0
    ? DEFAULT_COLORS.filter((c) => availableColors.includes(c.id))
    : DEFAULT_COLORS;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {t("calculator.step_color")}
      </h2>
      <p className="text-gray-500 text-center">{t("calculator.select_color_desc")}</p>

      <div className="flex flex-wrap justify-center gap-6 max-w-lg mx-auto py-4">
        {colors.map((color) => {
          const isSelected = selected === color.id;
          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-16 h-16 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                    : "ring-1 ring-gray-300 group-hover:ring-2 group-hover:ring-gray-400"
                } ${color.border ? "border border-gray-200" : ""}`}
                style={{ backgroundColor: color.hex }}
              />
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t(`calculator.color_${color.id}`)}
              </span>
            </button>
          );
        })}
      </div>

      {selected !== "blanc" && (
        <p className="text-center text-sm text-amber-600 bg-amber-50 rounded-lg p-3 max-w-md mx-auto">
          {t("calculator.color_surcharge")}
        </p>
      )}
    </div>
  );
}
