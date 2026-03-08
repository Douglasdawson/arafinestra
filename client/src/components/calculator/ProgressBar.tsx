import { useTranslation } from "react-i18next";

const STEP_KEYS = [
  "calculator.step_product",
  "calculator.step_model",
  "calculator.step_dimensions",
  "calculator.step_color",
  "calculator.step_glass",
  "calculator.step_extras",
  "calculator.step_quantity",
];

interface ProgressBarProps {
  currentStep: number; // 1-7
}

function getTimeRemaining(step: number): string {
  if (step <= 3) return "2";
  if (step <= 5) return "1";
  return "<1";
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t } = useTranslation();
  const totalSteps = STEP_KEYS.length;
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  const timeRemaining = getTimeRemaining(currentStep);

  return (
    <div className="w-full py-4 sm:py-6 px-2">
      {/* Mobile: compact bar with step label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand">
            {t(STEP_KEYS[currentStep - 1])} ({currentStep}/{totalSteps})
          </span>
          <span className="text-xs text-slate-500">
            ~{timeRemaining} min
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop: full step circles */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium text-brand">{percentage}%</span>
          <span className="text-xs text-slate-500">
            {t("calculator.time_remaining", { minutes: timeRemaining })}
          </span>
        </div>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-brand z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
          />

          {STEP_KEYS.map((key, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-brand text-white ring-4 ring-brand-light"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-[60px] lg:max-w-[80px] ${
                    isCurrent ? "text-brand" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {t(key)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
