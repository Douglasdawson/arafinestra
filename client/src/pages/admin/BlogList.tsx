import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/admin/Toast";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface BlogPost {
  id: number;
  slug: string;
  tituloEs: string;
  categoria: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog", { credentials: "include" });
      const data = await res.json();
      setPosts(data.data || []);
    } catch {
      setToast({ message: "Error al cargar blog", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function deletePost() {
    if (deleteId === null) return;
    try {
      await fetch(`/api/blog/${deleteId}`, { method: "DELETE", credentials: "include" });
      setToast({ message: "Post eliminado", type: "success" });
      setDeleteId(null);
      fetchPosts();
    } catch {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteId !== null && (
        <ConfirmDialog message="Seguro que quieres eliminar este post?" onConfirm={deletePost} onCancel={() => setDeleteId(null)} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Blog</h1>
        <button onClick={() => navigate("/admin/blog/new")} className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">
          + Nuevo articulo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay articulos</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titulo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy-900">{post.tituloEs}</td>
                  <td className="px-4 py-3 text-gray-600">{post.categoria || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es") : new Date(post.createdAt).toLocaleDateString("es")}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => navigate(`/admin/blog/${post.id}`)} className="text-sm text-brand hover:text-brand-dark">Editar</button>
                    <button onClick={() => setDeleteId(post.id)} className="text-sm text-gray-400 hover:text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
