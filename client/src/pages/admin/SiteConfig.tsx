import { useState, useEffect, useCallback } from "react";
import Toast from "../../components/admin/Toast";

interface ConfigItem {
  id?: number;
  key: string;
  valueCa: string;
  valueEs: string;
  valueEn: string;
}

const PREDEFINED_KEYS = [
  "telefono", "email", "whatsapp", "horario", "direccion",
  "facebook", "instagram",
  "cifras_experiencia", "cifras_proyectos", "cifras_zona",
];

export default function SiteConfig() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/config", { credentials: "include" });
      const data: ConfigItem[] = await res.json();

      // Merge with predefined keys
      const existing = new Map(data.map((c) => [c.key, c]));
      const merged: ConfigItem[] = PREDEFINED_KEYS.map((key) =>
        existing.get(key) || { key, valueCa: "", valueEs: "", valueEn: "" }
      );
      // Add any extra keys from DB not in predefined
      data.forEach((c) => {
        if (!PREDEFINED_KEYS.includes(c.key)) merged.push(c);
      });

      setConfigs(merged);
    } catch {
      setToast({ message: "Error al cargar configuracion", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  function updateConfig(key: string, field: "valueCa" | "valueEs" | "valueEn", value: string) {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, [field]: value } : c))
    );
  }

  async function saveConfig(item: ConfigItem) {
    setSavingKey(item.key);
    try {
      const res = await fetch(`/api/config/${item.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          valueCa: item.valueCa,
          valueEs: item.valueEs,
          valueEn: item.valueEn,
        }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: `"${item.key}" guardado`, type: "success" });
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Cargando...</div>;
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contenido / Configuracion</h1>

      <div className="space-y-4">
        {configs.map((item) => (
          <div key={item.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <label className="text-sm font-medium text-gray-700 font-mono">{item.key}</label>
              <button
                onClick={() => saveConfig(item)}
                disabled={savingKey === item.key}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {savingKey === item.key ? "..." : "Guardar"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <span className="text-xs text-gray-400 block mb-1">CA</span>
                <input
                  type="text"
                  value={item.valueCa}
                  onChange={(e) => updateConfig(item.key, "valueCa", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">ES</span>
                <input
                  type="text"
                  value={item.valueEs}
                  onChange={(e) => updateConfig(item.key, "valueEs", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">EN</span>
                <input
                  type="text"
                  value={item.valueEn}
                  onChange={(e) => updateConfig(item.key, "valueEn", e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
