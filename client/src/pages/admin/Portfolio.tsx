import { useState, useEffect, useCallback } from "react";
import MultiLangTabs from "../../components/admin/MultiLangTabs";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface PortfolioItem {
  id: number;
  tituloCa: string;
  tituloEs: string;
  tituloEn: string;
  descripcionCa: string | null;
  descripcionEs: string | null;
  descripcionEn: string | null;
  localidad: string | null;
  tipoInmueble: string | null;
  productosUsados: string | null;
  fotosAntes: string[];
  fotosDespues: string[];
  destacado: boolean;
  published: boolean;
  createdAt: string;
}

const TIPO_INMUEBLE = ["piso", "casa", "edificio", "comercial"] as const;

const emptyItem = (): Partial<PortfolioItem> => ({
  tituloCa: "", tituloEs: "", tituloEn: "",
  descripcionCa: "", descripcionEs: "", descripcionEn: "",
  localidad: "", tipoInmueble: "piso", productosUsados: "",
  fotosAntes: [], fotosDespues: [],
  destacado: false, published: false,
});

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortfolioItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", { credentials: "include" });
      setItems(await res.json());
    } catch {
      setToast({ message: "Error al cargar portfolio", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openEdit(item?: PortfolioItem) {
    setEditing(item || emptyItem());
  }

  async function saveItem() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/portfolio" : `/api/portfolio/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      setToast({ message: isNew ? "Proyecto creado" : "Proyecto actualizado", type: "success" });
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
      await fetch(`/api/portfolio/${deleteId}`, { method: "DELETE", credentials: "include" });
      setToast({ message: "Proyecto eliminado", type: "success" });
      setDeleteId(null);
      fetchItems();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  function updatePhotos(field: "fotosAntes" | "fotosDespues", index: number, value: string) {
    if (!editing) return;
    const arr = [...(editing[field] || [])];
    arr[index] = value;
    setEditing({ ...editing, [field]: arr });
  }

  function addPhoto(field: "fotosAntes" | "fotosDespues") {
    if (!editing) return;
    setEditing({ ...editing, [field]: [...(editing[field] || []), ""] });
  }

  function removePhoto(field: "fotosAntes" | "fotosDespues", index: number) {
    if (!editing) return;
    setEditing({ ...editing, [field]: (editing[field] || []).filter((_, i) => i !== index) });
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog message="Seguro que quieres eliminar este proyecto?" onConfirm={deleteItem} onCancel={() => setDeleteId(null)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Portfolio</h1>
        <button onClick={() => openEdit()} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">
          + Nuevo proyecto
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No hay proyectos</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {item.fotosDespues?.[0] ? (
                <img src={item.fotosDespues[0]} alt={item.tituloEs} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Sin foto</div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-navy-900">{item.tituloEs}</h3>
                    <p className="text-sm text-gray-500">{item.localidad || "-"}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.published ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(item)} className="text-sm text-brand hover:text-brand-dark">Editar</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              {editing.id ? "Editar proyecto" : "Nuevo proyecto"}
            </h2>

            <div className="space-y-4">
              <MultiLangTabs
                fieldName="titulo"
                label="Titulo"
                values={{ ca: editing.tituloCa || "", es: editing.tituloEs || "", en: editing.tituloEn || "" }}
                onChange={(lang, val) => setEditing({ ...editing, [`titulo${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: val })}
              />

              <MultiLangTabs
                fieldName="descripcion"
                label="Descripcion"
                textarea
                values={{ ca: editing.descripcionCa || "", es: editing.descripcionEs || "", en: editing.descripcionEn || "" }}
                onChange={(lang, val) => setEditing({ ...editing, [`descripcion${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: val })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                  <input type="text" value={editing.localidad || ""} onChange={(e) => setEditing({ ...editing, localidad: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo inmueble</label>
                  <select value={editing.tipoInmueble || ""} onChange={(e) => setEditing({ ...editing, tipoInmueble: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    {TIPO_INMUEBLE.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Productos usados</label>
                <input type="text" value={editing.productosUsados || ""} onChange={(e) => setEditing({ ...editing, productosUsados: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              </div>

              {/* Photos */}
              {(["fotosAntes", "fotosDespues"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-navy-900 mb-2">
                    {field === "fotosAntes" ? "Fotos antes" : "Fotos despues"}
                  </label>
                  <div className="space-y-2">
                    {(editing[field] || []).map((url, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
                        {url ? (
                          <img
                            src={url}
                            alt={`Preview ${i + 1}`}
                            className="w-14 h-14 rounded-md object-cover border border-gray-200 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder="https://example.com/photo.jpg"
                          value={url}
                          onChange={(e) => updatePhotos(field, i, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-brand focus:border-brand"
                        />
                        <button
                          onClick={() => removePhoto(field, i)}
                          title="Eliminar imagen"
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addPhoto(field)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand hover:text-brand-dark border border-dashed border-brand/40 hover:border-brand rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Anadir imagen
                  </button>
                </div>
              ))}

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.destacado ?? false} onChange={(e) => setEditing({ ...editing, destacado: e.target.checked })} className="rounded" />
                  Destacado
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                  Publicado
                </label>
              </div>
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
