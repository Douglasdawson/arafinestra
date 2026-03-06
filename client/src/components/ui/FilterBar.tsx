interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ options, value, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-brand text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-300 hover:border-brand hover:text-brand"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
