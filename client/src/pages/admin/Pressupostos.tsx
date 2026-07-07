import { useState, useRef } from "react";

interface ClientData {
  name: string;
  phone: string;
  email: string;
  city: string;
}

interface WindowItem {
  type: "c70" | "a84" | "e170";
  width: number;
  height: number;
  glass: "doble" | "baix_emissiu" | "triple";
}

const typeLabels: Record<WindowItem["type"], string> = {
  c70: "C-70",
  a84: "A-84",
  e170: "E-170",
};

const glassLabels: Record<WindowItem["glass"], string> = {
  doble: "Doble",
  baix_emissiu: "Baix emissiu",
  triple: "Triple",
};

const PRICE_PER_M2 = 350;

function createItem(): WindowItem {
  return { type: "c70", width: 120, height: 100, glass: "doble" };
}

export default function Pressupostos() {
  const [client, setClient] = useState<ClientData>({
    name: "",
    phone: "",
    email: "",
    city: "",
  });
  const [items, setItems] = useState<WindowItem[]>([createItem()]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    // Cancelar el timer anterior para que un toast viejo no cierre el nuevo antes de tiempo
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const updateItem = (index: number, field: keyof WindowItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, createItem()]);
  };

  const calcM2 = (item: WindowItem) => (item.width / 100) * (item.height / 100);
  const calcEstimate = (item: WindowItem) => calcM2(item) * PRICE_PER_M2;

  const subtotal = items.reduce((sum, item) => sum + calcEstimate(item), 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pressupost/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ client, items }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error generant el pressupost" }));
        throw new Error(err.message || "Error generant el pressupost");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "pressupost.pdf";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Pressupost generat i lead creat al CRM", "success");
    } catch (err: any) {
      showToast(err.message || "Error generant el pressupost", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand";
  const cardClass = "bg-white rounded-lg shadow-sm border border-gray-200 p-6";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">Generador de Pressupostos</h1>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client section */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-navy-800 mb-4">Dades del client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                className={inputClass}
                placeholder="Nom complet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telèfon *</label>
              <input
                type="tel"
                required
                value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                className={inputClass}
                placeholder="612 345 678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                className={inputClass}
                placeholder="client@exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciutat</label>
              <input
                type="text"
                value={client.city}
                onChange={(e) => setClient({ ...client, city: e.target.value })}
                className={inputClass}
                placeholder="Blanes"
              />
            </div>
          </div>
        </div>

        {/* Items section */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-navy-800 mb-4">Finestres</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipus</label>
                  <select
                    value={item.type}
                    onChange={(e) => updateItem(index, "type", e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(typeLabels).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Amplada (cm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={item.width}
                    onChange={(e) => updateItem(index, "width", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Alçada (cm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={item.height}
                    onChange={(e) => updateItem(index, "height", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vidre</label>
                  <select
                    value={item.glass}
                    onChange={(e) => updateItem(index, "glass", e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(glassLabels).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-sm font-medium text-gray-700 pb-2">
                    {calcEstimate(item).toFixed(2)} €
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium pb-2"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-4 border border-brand text-brand rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand/5 transition-colors"
          >
            + Afegir finestra
          </button>
        </div>

        {/* Totals section */}
        <div className={cardClass}>
          <div className="flex flex-col items-end space-y-1 text-sm">
            <div className="flex justify-between w-60">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between w-60">
              <span className="text-gray-600">IVA (21%)</span>
              <span className="font-medium">{iva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between w-60 pt-2 border-t border-gray-200">
              <span className="text-navy-800 font-bold text-base">Total</span>
              <span className="text-navy-800 font-bold text-base">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-white rounded-lg px-8 py-3 text-sm font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generant pressupost..." : "Generar PDF"}
          </button>
        </div>
      </form>
    </div>
  );
}
