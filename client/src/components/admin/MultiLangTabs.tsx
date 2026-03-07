import { useState } from "react";

const LANGS = [
  { key: "Ca", label: "CA" },
  { key: "Es", label: "ES" },
  { key: "En", label: "EN" },
] as const;

interface MultiLangTabsProps {
  fieldName: string;
  values: { ca: string; es: string; en: string };
  onChange: (lang: "ca" | "es" | "en", value: string) => void;
  textarea?: boolean;
  rows?: number;
  label?: string;
}

export default function MultiLangTabs({ fieldName, values, onChange, textarea, rows = 4, label }: MultiLangTabsProps) {
  const [activeLang, setActiveLang] = useState<"Ca" | "Es" | "En">("Ca");

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex border-b border-gray-200 mb-2">
        {LANGS.map((lang) => (
          <button
            key={lang.key}
            type="button"
            onClick={() => setActiveLang(lang.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeLang === lang.key
                ? "border-b-2 border-brand text-brand"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      {textarea ? (
        <textarea
          id={`${fieldName}_${activeLang.toLowerCase()}`}
          value={values[activeLang.toLowerCase() as "ca" | "es" | "en"]}
          onChange={(e) => onChange(activeLang.toLowerCase() as "ca" | "es" | "en", e.target.value)}
          rows={rows}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm"
        />
      ) : (
        <input
          type="text"
          id={`${fieldName}_${activeLang.toLowerCase()}`}
          value={values[activeLang.toLowerCase() as "ca" | "es" | "en"]}
          onChange={(e) => onChange(activeLang.toLowerCase() as "ca" | "es" | "en", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm"
        />
      )}
    </div>
  );
}
