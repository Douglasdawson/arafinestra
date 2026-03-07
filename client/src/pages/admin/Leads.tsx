import { useState, useEffect, useCallback } from "react";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface Lead {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  localidad: string | null;
  tipoCliente: string | null;
  origen: string | null;
  estado: string | null;
  notas: string | null;
  presupuestoDatos: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

const ESTADOS = ["todos", "nuevo", "contactado", "presupuestado", "ganado", "perdido"] as const;
const ORIGENES = ["formulario", "calculadora", "telefono", "whatsapp", "referido"] as const;

const estadoColors: Record<string, string> = {
  nuevo: "bg-brand-light text-brand",
  contactado: "bg-yellow-100 text-yellow-700",
  presupuestado: "bg-orange-100 text-orange-700",
  ganado: "bg-green-100 text-green-700",
  perdido: "bg-red-100 text-red-700",
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("todos");
  const [origen, setOrigen] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editNotas, setEditNotas] = useState("");
  const [editEstado, setEditEstado] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (estado !== "todos") params.set("estado", estado);
      if (origen) params.set("origen", origen);
      if (search) params.set("search", search);
      const res = await fetch(`/api/leads?${params}`, { credentials: "include" });
      const data = await res.json();
      setLeads(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setToast({ message: "Error al cargar leads", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, estado, origen, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function selectLead(lead: Lead) {
    setSelected(lead);
    setEditNotas(lead.notas || "");
    setEditEstado(lead.estado || "nuevo");
  }

  async function saveLead() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notas: editNotas, estado: editEstado }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: "Lead actualizado", type: "success" });
      setSelected(null);
      fetchLeads();
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead() {
    if (deleteId === null) return;
    try {
      const res = await fetch(`/api/leads/${deleteId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setToast({ message: "Lead eliminado", type: "success" });
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
      fetchLeads();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  async function exportCSV() {
    try {
      const res = await fetch("/api/leads/export", { credentials: "include" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setToast({ message: "Error al exportar CSV", type: "error" });
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog
          message="Seguro que quieres eliminar este lead?"
          onConfirm={deleteLead}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-navy-900 mb-6">Leads</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e === "todos" ? "Todos los estados" : e.charAt(0).toUpperCase() + e.slice(1)}</option>
          ))}
        </select>

        <select
          value={origen}
          onChange={(e) => { setOrigen(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Todos los origenes</option>
          {ORIGENES.map((o) => (
            <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar nombre o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 min-w-[200px]"
        />

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          title="Exportar CSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No hay leads</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Contacto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Localidad</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Origen</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => selectLead(lead)}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selected?.id === lead.id ? "bg-brand-light" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-navy-900">{lead.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.email && <div>{lead.email}</div>}
                      {lead.telefono && <div>{lead.telefono}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.localidad || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        {lead.origen || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[lead.estado || ""] || "bg-gray-100 text-gray-600"}`}>
                        {lead.estado || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("es")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(lead.id); }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm">
              <span className="text-gray-500">{total} leads</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-96 bg-white rounded-lg shadow-sm border border-gray-200 p-5 self-start">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-semibold text-navy-900">{selected.nombre}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">x</button>
            </div>

            <div className="space-y-3 text-sm">
              {selected.email && <div><span className="text-gray-500">Email:</span> {selected.email}</div>}
              {selected.telefono && <div><span className="text-gray-500">Telefono:</span> {selected.telefono}</div>}
              {selected.localidad && <div><span className="text-gray-500">Localidad:</span> {selected.localidad}</div>}
              {selected.tipoCliente && <div><span className="text-gray-500">Tipo:</span> {selected.tipoCliente}</div>}
              <div><span className="text-gray-500">Origen:</span> {selected.origen}</div>
              <div><span className="text-gray-500">Fecha:</span> {new Date(selected.createdAt).toLocaleString("es")}</div>

              {selected.presupuestoDatos && (
                <div>
                  <span className="text-gray-500 block mb-1">Datos presupuesto:</span>
                  <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(selected.presupuestoDatos, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-gray-500 mb-1">Estado</label>
                <select
                  value={editEstado}
                  onChange={(e) => setEditEstado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {ESTADOS.filter((e) => e !== "todos").map((e) => (
                    <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Notas</label>
                <textarea
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <button
                onClick={saveLead}
                disabled={saving}
                className="w-full py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
