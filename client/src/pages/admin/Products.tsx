import { useState, useEffect, useCallback } from "react";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface Product {
  id: number;
  tipo: string;
  gama: string | null;
  modelo: string | null;
  descripcion: string | null;
  precioBase: number | null;
  precioPorM2: number | null;
  coloresDisponibles: string[];
  vidriosCompatibles: string[];
  especificaciones: Record<string, string> | null;
  activo: boolean;
}

const TIPOS = ["Ventanas", "Puertas", "Persianas", "Mosquiteras"] as const;
const TABS = ["Todos", ...TIPOS] as const;

const emptyProduct = (): Partial<Product> => ({
  tipo: "Ventanas",
  gama: "",
  modelo: "",
  descripcion: "",
  precioBase: 0,
  precioPorM2: 0,
  coloresDisponibles: [],
  vidriosCompatibles: [],
  especificaciones: {},
  activo: true,
});

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Todos");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [coloresText, setColoresText] = useState("");
  const [vidriosText, setVidriosText] = useState("");
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "Todos" ? `?tipo=${activeTab}` : "";
      const res = await fetch(`/api/products${params}`, { credentials: "include" });
      const data = await res.json();
      setProducts(data);
    } catch {
      setToast({ message: "Error al cargar productos", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openEdit(product?: Product) {
    const p = product || emptyProduct();
    setEditing(p);
    setColoresText((p.coloresDisponibles || []).join(", "));
    setVidriosText((p.vidriosCompatibles || []).join(", "));
    const specs = p.especificaciones || {};
    setSpecRows(Object.entries(specs).map(([key, value]) => ({ key, value })));
  }

  async function saveProduct() {
    if (!editing) return;
    setSaving(true);
    try {
      const body = {
        ...editing,
        coloresDisponibles: coloresText.split(",").map((s) => s.trim()).filter(Boolean),
        vidriosCompatibles: vidriosText.split(",").map((s) => s.trim()).filter(Boolean),
        especificaciones: Object.fromEntries(specRows.filter((r) => r.key).map((r) => [r.key, r.value])),
      };
      const isNew = !editing.id;
      const url = isNew ? "/api/products" : `/api/products/${editing.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setToast({ message: isNew ? "Producto creado" : "Producto actualizado", type: "success" });
      setEditing(null);
      fetchProducts();
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(product: Product) {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ activo: !product.activo }),
      });
      fetchProducts();
    } catch {
      setToast({ message: "Error al actualizar", type: "error" });
    }
  }

  async function deleteProduct() {
    if (deleteId === null) return;
    try {
      await fetch(`/api/products/${deleteId}`, { method: "DELETE", credentials: "include" });
      setToast({ message: "Producto eliminado", type: "success" });
      setDeleteId(null);
      fetchProducts();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog message="Seguro que quieres eliminar este producto?" onConfirm={deleteProduct} onCancel={() => setDeleteId(null)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button onClick={() => openEdit()} className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
          + Nuevo producto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "border-b-2 border-slate-700 text-slate-800" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay productos</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Gama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Modelo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Precio base</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Precio/m2</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Activo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{p.tipo}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.gama || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.modelo || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.precioBase != null ? `${p.precioBase} EUR` : "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.precioPorM2 != null ? `${p.precioPorM2} EUR` : "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActivo(p)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${p.activo ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.activo ? "left-5" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-slate-600 hover:text-slate-800 text-xs">Editar</button>
                    <button onClick={() => setDeleteId(p.id)} className="text-gray-400 hover:text-red-600 text-xs">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing.id ? "Editar producto" : "Nuevo producto"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select value={editing.tipo || ""} onChange={(e) => setEditing({ ...editing, tipo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gama</label>
                  <input type="text" value={editing.gama || ""} onChange={(e) => setEditing({ ...editing, gama: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input type="text" value={editing.modelo || ""} onChange={(e) => setEditing({ ...editing, modelo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea value={editing.descripcion || ""} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio base (EUR)</label>
                  <input type="number" step="0.01" value={editing.precioBase ?? ""} onChange={(e) => setEditing({ ...editing, precioBase: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio/m2 (EUR)</label>
                  <input type="number" step="0.01" value={editing.precioPorM2 ?? ""} onChange={(e) => setEditing({ ...editing, precioPorM2: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colores (separados por coma)</label>
                <input type="text" value={coloresText} onChange={(e) => setColoresText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Blanco, Madera, Antracita" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vidrios (separados por coma)</label>
                <input type="text" value={vidriosText} onChange={(e) => setVidriosText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="4/16/4, 4/20/4, bajo emisivo" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones</label>
                {specRows.map((row, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <input type="text" placeholder="Clave" value={row.key} onChange={(e) => { const r = [...specRows]; r[i] = { ...r[i], key: e.target.value }; setSpecRows(r); }} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    <input type="text" placeholder="Valor" value={row.value} onChange={(e) => { const r = [...specRows]; r[i] = { ...r[i], value: e.target.value }; setSpecRows(r); }} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                    <button onClick={() => setSpecRows(specRows.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs">x</button>
                  </div>
                ))}
                <button onClick={() => setSpecRows([...specRows, { key: "", value: "" }])} className="text-sm text-slate-600 hover:text-slate-800">+ Anadir fila</button>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.activo ?? true} onChange={(e) => setEditing({ ...editing, activo: e.target.checked })} className="rounded" />
                Activo
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
              <button onClick={saveProduct} disabled={saving} className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
