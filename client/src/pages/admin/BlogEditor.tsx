import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MultiLangTabs from "../../components/admin/MultiLangTabs";
import Toast from "../../components/admin/Toast";

const CATEGORIAS = ["Ventanas", "Eficiencia", "Subvenciones", "Cortizo", "Mantenimiento"] as const;

interface BlogPost {
  id?: number;
  slug: string;
  tituloCa: string; tituloEs: string; tituloEn: string;
  contenidoCa: string; contenidoEs: string; contenidoEn: string;
  extractoCa: string; extractoEs: string; extractoEn: string;
  categoria: string;
  autor: string;
  imagenPortada: string;
  metaTitleCa: string; metaTitleEs: string; metaTitleEn: string;
  metaDescriptionCa: string; metaDescriptionEs: string; metaDescriptionEn: string;
  published: boolean;
}

const emptyPost = (): BlogPost => ({
  slug: "", tituloCa: "", tituloEs: "", tituloEn: "",
  contenidoCa: "", contenidoEs: "", contenidoEn: "",
  extractoCa: "", extractoEs: "", extractoEn: "",
  categoria: "Ventanas", autor: "", imagenPortada: "",
  metaTitleCa: "", metaTitleEs: "", metaTitleEn: "",
  metaDescriptionCa: "", metaDescriptionEs: "", metaDescriptionEn: "",
  published: false,
});

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new" || !id;
  const [post, setPost] = useState<BlogPost>(emptyPost());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    // Fetch by ID — we need to find it. The API uses slug for public GET, but we have the id.
    // We'll fetch the list and find by id, or try a direct approach.
    fetch(`/api/blog`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const found = (data.data || []).find((p: any) => String(p.id) === id);
        if (found) {
          setPost({
            id: found.id,
            slug: found.slug || "",
            tituloCa: found.tituloCa || "", tituloEs: found.tituloEs || "", tituloEn: found.tituloEn || "",
            contenidoCa: found.contenidoCa || "", contenidoEs: found.contenidoEs || "", contenidoEn: found.contenidoEn || "",
            extractoCa: found.extractoCa || "", extractoEs: found.extractoEs || "", extractoEn: found.extractoEn || "",
            categoria: found.categoria || "Ventanas", autor: found.autor || "", imagenPortada: found.imagenPortada || "",
            metaTitleCa: found.metaTitleCa || "", metaTitleEs: found.metaTitleEs || "", metaTitleEn: found.metaTitleEn || "",
            metaDescriptionCa: found.metaDescriptionCa || "", metaDescriptionEs: found.metaDescriptionEs || "", metaDescriptionEn: found.metaDescriptionEn || "",
            published: found.published || false,
          });
          setSlugManual(true);
        }
      })
      .catch(() => setToast({ message: "Error al cargar post", type: "error" }))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function updateField(field: string, value: string | boolean) {
    setPost((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from tituloEs if not manually edited
      if (field === "tituloEs" && !slugManual && typeof value === "string") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function savePost() {
    setSaving(true);
    try {
      const url = isNew ? "/api/blog" : `/api/blog/${post.id}`;
      const method = isNew ? "POST" : "PATCH";
      const body = { ...post };
      if (isNew) delete (body as any).id;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setToast({ message: isNew ? "Articulo creado" : "Articulo actualizado", type: "success" });
      if (isNew) {
        const created = await res.json();
        navigate(`/admin/blog/${created.id}`, { replace: true });
      }
    } catch {
      setToast({ message: "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Cargando...</div>;
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "Nuevo articulo" : "Editar articulo"}
        </h1>
        <button onClick={() => navigate("/admin/blog")} className="text-sm text-gray-500 hover:text-gray-800">
          Volver a la lista
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => { setSlugManual(true); updateField("slug", e.target.value); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <MultiLangTabs
          fieldName="titulo"
          label="Titulo"
          values={{ ca: post.tituloCa, es: post.tituloEs, en: post.tituloEn }}
          onChange={(lang, val) => updateField(`titulo${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
        />

        <MultiLangTabs
          fieldName="contenido"
          label="Contenido (Markdown)"
          textarea
          rows={12}
          values={{ ca: post.contenidoCa, es: post.contenidoEs, en: post.contenidoEn }}
          onChange={(lang, val) => updateField(`contenido${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
        />

        <MultiLangTabs
          fieldName="extracto"
          label="Extracto"
          textarea
          rows={3}
          values={{ ca: post.extractoCa, es: post.extractoEs, en: post.extractoEn }}
          onChange={(lang, val) => updateField(`extracto${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select value={post.categoria} onChange={(e) => updateField("categoria", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input type="text" value={post.autor} onChange={(e) => updateField("autor", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen portada (URL)</label>
          <input type="text" value={post.imagenPortada} onChange={(e) => updateField("imagenPortada", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>

        <MultiLangTabs
          fieldName="metaTitle"
          label="Meta Title (SEO)"
          values={{ ca: post.metaTitleCa, es: post.metaTitleEs, en: post.metaTitleEn }}
          onChange={(lang, val) => updateField(`metaTitle${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
        />

        <MultiLangTabs
          fieldName="metaDescription"
          label="Meta Description (SEO)"
          textarea
          rows={2}
          values={{ ca: post.metaDescriptionCa, es: post.metaDescriptionEs, en: post.metaDescriptionEn }}
          onChange={(lang, val) => updateField(`metaDescription${lang.charAt(0).toUpperCase() + lang.slice(1)}`, val)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={post.published} onChange={(e) => updateField("published", e.target.checked)} className="rounded" />
          Publicado
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button onClick={() => navigate("/admin/blog")} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancelar
          </button>
          <button onClick={savePost} disabled={saving} className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
