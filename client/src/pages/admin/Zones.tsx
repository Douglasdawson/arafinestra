import { useState, useEffect, useCallback } from "react";
import MultiLangTabs from "../../components/admin/MultiLangTabs";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface Zone {
  id: number;
  slug: string;
  nombreCa: string; nombreEs: string; nombreEn: string;
  contenidoCa: string | null; contenidoEs: string | null; contenidoEn: string | null;
  metaTitleCa: string | null; metaTitleEs: string | null; metaTitleEn: string | null;
  metaDescriptionCa: string | null; metaDescriptionEs: string | null; metaDescriptionEn: string | null;
  latitud: number | null;
  longitud: number | null;
  published: boolean;
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyZone = (): Partial<Zone> => ({
  slug: "", nombreCa: "", nombreEs: "", nombreEn: "",
  contenidoCa: "", contenidoEs: "", contenidoEn: "",
  metaTitleCa: "", metaTitleEs: "", metaTitleEn: "",
  metaDescriptionCa: "", metaDescriptionEs: "", metaDescriptionEn: "",
  latitud: null, longitud: null, published: false,
});

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Zone> | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/zones", { credentials: "include" });
      setZones(await res.json());
    } catch {
      setToast({ message: "Error al cargar zonas", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  function openEdit(zone?: Zone) {
    setEditing(zone || emptyZone());
    setSlugManual(!!zone);
  }

  function updateEditing(field: string, value: any) {
    setEditing((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === "nombreCa" && !slugManual && typeof value === "string") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function saveZone() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/zones" : `/api/zones/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      setToast({ message: isNew ? "Zona creada" : "Zona actualizada", type: "success" });
      setEditing(null);
      fetchZones();
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteZone() {
    if (deleteId === null) return;
    try {
      await fetch(`/api/zones/${deleteId}`, { method: "DELETE", credentials: "include" });
      setToast({ message: "Zona eliminada", type: "success" });
      setDeleteId(null);
      fetchZones();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog message="Seguro que quieres eliminar esta zona?" onConfirm={deleteZone} onCancel={() => setDeleteId(null)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Zonas</h1>
        <button onClick={() => openEdit()} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">
          + Nueva zona
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : zones.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay zonas</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy-900">{zone.nombreEs || zone.nombreCa}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{zone.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${zone.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {zone.published ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(zone)} className="text-sm text-brand hover:text-brand-dark">Editar</button>
                    <button onClick={() => setDeleteId(zone.id)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-navy-900 mb-4">
              {editing.id ? "Editar zona" : "Nueva zona"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={editing.slug || ""} onChange={(e) => { setSlugManual(true); updateEditing("slug", e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono" />
              </div>

              <MultiLangTabs
                fieldName="nombre"
                label="Nombre"
                values={{ ca: editing.nombreCa || "", es: editing.nombreEs || "", en: editing.nombreEn || "" }}
                onChange={(lang, val) => updateEditing(`nombre${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
              />

              <MultiLangTabs
                fieldName="contenido"
                label="Contenido"
                textarea
                rows={8}
                values={{ ca: editing.contenidoCa || "", es: editing.contenidoEs || "", en: editing.contenidoEn || "" }}
                onChange={(lang, val) => updateEditing(`contenido${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
              />

              <MultiLangTabs
                fieldName="metaTitle"
                label="Meta Title (SEO)"
                values={{ ca: editing.metaTitleCa || "", es: editing.metaTitleEs || "", en: editing.metaTitleEn || "" }}
                onChange={(lang, val) => updateEditing(`metaTitle${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
              />

              <MultiLangTabs
                fieldName="metaDescription"
                label="Meta Description (SEO)"
                textarea
                rows={2}
                values={{ ca: editing.metaDescriptionCa || "", es: editing.metaDescriptionEs || "", en: editing.metaDescriptionEn || "" }}
                onChange={(lang, val) => updateEditing(`metaDescription${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                  <input type="number" step="any" value={editing.latitud ?? ""} onChange={(e) => updateEditing("latitud", e.target.value ? parseFloat(e.target.value) : null)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                  <input type="number" step="any" value={editing.longitud ?? ""} onChange={(e) => updateEditing("longitud", e.target.value ? parseFloat(e.target.value) : null)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published ?? false} onChange={(e) => updateEditing("published", e.target.checked)} className="rounded" />
                Publicada
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
              <button onClick={saveZone} disabled={saving} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
