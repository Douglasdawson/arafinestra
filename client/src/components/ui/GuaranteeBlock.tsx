import { useTranslation } from "react-i18next";

interface Props {
  compact?: boolean;
  variant?: "light" | "dark";
}

/* Lock / padlock icon */
function PriceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

/* Sparkle icon */
function CleanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

/* Shield-check icon */
function SatisfactionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

export default function GuaranteeBlock({ compact = false, variant = "light" }: Props) {
  const { t } = useTranslation();

  const items = [
    { icon: PriceIcon, titleKey: "guarantee.price_title", descKey: "guarantee.price_desc" },
    { icon: CleanIcon, titleKey: "guarantee.clean_title", descKey: "guarantee.clean_desc" },
    { icon: SatisfactionIcon, titleKey: "guarantee.satisfaction_title", descKey: "guarantee.satisfaction_desc" },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.titleKey} className="flex items-center gap-2">
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${
                variant === "dark" ? "text-brand-light" : "text-brand"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                variant === "dark" ? "text-slate-200" : "text-navy-800"
              }`}
            >
              {t(item.titleKey)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2
        className={`text-2xl sm:text-3xl font-bold text-center mb-10 ${
          variant === "dark" ? "text-white" : "text-navy-900"
        }`}
      >
        {t("guarantee.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.titleKey}
            className={`text-center p-6 rounded-2xl border ${
              variant === "dark"
                ? "bg-white/5 border-white/10"
                : "bg-white border-slate-100 shadow-sm"
            }`}
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl ${
                variant === "dark" ? "bg-brand/20 text-brand-light" : "bg-brand-light text-brand"
              }`}
            >
              <item.icon className="w-7 h-7" />
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                variant === "dark" ? "text-white" : "text-navy-800"
              }`}
            >
              {t(item.titleKey)}
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                variant === "dark" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {t(item.descKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
