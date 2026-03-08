import { useTranslation } from "react-i18next";

interface TrustBarProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function TrustBar({ variant = "light", className = "" }: TrustBarProps) {
  const { t } = useTranslation();

  const isDark = variant === "dark";
  const iconColor = isDark ? "text-brand" : "text-brand";
  const textColor = isDark ? "text-slate-300" : "text-slate-600";
  const dividerColor = isDark ? "bg-slate-700" : "bg-slate-200";

  const badges = [
    {
      icon: (
        <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
          variant === "dark" ? "border-brand-light" : "border-brand"
        }`}>
          <svg className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      label: t("trust_bar.cortizo"),
    },
    {
      icon: (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      label: t("trust_bar.warranty"),
    },
    {
      icon: (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      label: t("trust_bar.projects"),
    },
    {
      icon: (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t("trust_bar.response"),
    },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 ${className}`}>
      {badges.map((badge, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className={`hidden sm:block w-px h-4 ${dividerColor} -ml-2 sm:-ml-3 mr-2 sm:mr-3`} />}
          {badge.icon}
          <span className={`text-xs sm:text-sm font-medium ${textColor}`}>{badge.label}</span>
        </span>
      ))}
    </div>
  );
}
