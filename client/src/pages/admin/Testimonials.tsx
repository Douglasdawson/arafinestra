import { useState, useEffect, useCallback } from "react";
import MultiLangTabs from "../../components/admin/MultiLangTabs";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface Testimonial {
  id: number;
  nombre: string;
  localidad: string | null;
  textoCa: string | null;
  textoEs: string | null;
  textoEn: string | null;
  puntuacion: number;
  fotoUrl: string | null;
  published: boolean;
  createdAt: string;
}

const emptyItem = (): Partial<Testimonial> => ({
  nombre: "", localidad: "",
  textoCa: "", textoEs: "", textoEn: "",
  puntuacion: 5, fotoUrl: "", published: false,
});

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", { credentials: "include" });
      setItems(await res.json());
    } catch {
      setToast({ message: "Error al cargar testimonios", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function saveItem() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/testimonials" : `/api/testimonials/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      setToast({ message: isNew ? "Testimonio creado" : "Testimonio actualizado", type: "success" });
      setEditing(null);
      fetchItems();
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem() {
    if (deleteId === null) return;
    try {
      await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE", credentials: "include" });
      setToast({ message: "Testimonio eliminado", type: "success" });
      setDeleteId(null);
      fetchItems();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  function renderStars(count: number, interactive = false) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && editing && setEditing({ ...editing, puntuacion: n })}
            className={`text-lg ${n <= count ? "text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-500" : ""}`}
          >
            *
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog message="Seguro que quieres eliminar este testimonio?" onConfirm={deleteItem} onCancel={() => setDeleteId(null)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Testimonios</h1>
        <button onClick={() => setEditing(emptyItem())} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">
          + Nuevo testimonio
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No hay testimonios</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-navy-900">{item.nombre}</h3>
                  <p className="text-sm text-gray-500">{item.localidad || "-"}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.published ? "Publicado" : "Borrador"}
                </span>
              </div>
              {renderStars(item.puntuacion)}
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.textoEs || item.textoCa || "-"}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(item)} className="text-sm text-brand hover:text-brand-dark">Editar</button>
                <button onClick={() => setDeleteId(item.id)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              {editing.id ? "Editar testimonio" : "Nuevo testimonio"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={editing.nombre || ""} onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                  <input type="text" value={editing.localidad || ""} onChange={(e) => setEditing({ ...editing, localidad: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>

              <MultiLangTabs
                fieldName="texto"
                label="Texto"
                textarea
                rows={4}
                values={{ ca: editing.textoCa || "", es: editing.textoEs || "", en: editing.textoEn || "" }}
                onChange={(lang, val) => setEditing({ ...editing, [`texto${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: val })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puntuacion</label>
                {renderStars(editing.puntuacion || 5, true)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL foto</label>
                <input type="text" value={editing.fotoUrl || ""} onChange={(e) => setEditing({ ...editing, fotoUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                Publicado
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
              <button onClick={saveItem} disabled={saving} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
