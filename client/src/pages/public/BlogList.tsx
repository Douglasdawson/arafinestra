import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import FilterBar from "../../components/ui/FilterBar";
import { localize } from "../../lib/localize";

interface BlogPost {
  id: number;
  slug: string;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  extracto_ca: string | null;
  extracto_es: string | null;
  extracto_en: string | null;
  contenido_ca: string | null;
  contenido_es: string | null;
  contenido_en: string | null;
  categoria: string | null;
  autor: string | null;
  imagen_portada: string | null;
  published_at: string | null;
  created_at: string;
}

interface BlogResponse {
  data: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

const CATEGORIES = ["eficiencia", "subvencions", "consells", "cortizo", "noticies"];

function readingTime(text: string | null): number {
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr: string | null, lang: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "ca" ? "ca-ES" : lang === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || i18n.language || "ca";
  const prefix = lang || i18n.language || "ca";

  const [response, setResponse] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ published: "true", page: String(page), limit: "6" });
    if (categoria) params.set("categoria", categoria);
    fetch(`/api/blog?${params}`)
      .then((r) => (r.ok ? r.json() : { data: [], total: 0, page: 1, totalPages: 0 }))
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch(() => {
        setResponse({ data: [], total: 0, page: 1, totalPages: 0 });
        setLoading(false);
      });
  }, [page, categoria]);

  const handleCategoryChange = (cat: string) => {
    setCategoria(cat);
    setPage(1);
  };

  const categoryOptions = [
    { value: "", label: t("portfolio.all") },
    ...CATEGORIES.map((c) => ({ value: c, label: t(`blog.cat_${c}`) })),
  ];

  const posts = response?.data || [];

  return (
    <>
      <PageHead
        title="Blog"
        description={t("blog.seo_desc")}
        path="/blog"
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Blog</h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar options={categoryOptions} value={categoria} onChange={handleCategoryChange} />
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-500">...</div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => {
                  const title = localize(post as unknown as Record<string, unknown>, "titulo", currentLang);
                  const extracto = localize(post as unknown as Record<string, unknown>, "extracto", currentLang);
                  const contenido = localize(post as unknown as Record<string, unknown>, "contenido", currentLang);
                  const excerpt = extracto
                    ? extracto.length > 120 ? extracto.slice(0, 120) + "..." : extracto
                    : "";
                  const minutes = readingTime(contenido);
                  const date = formatDate(post.published_at || post.created_at, currentLang);

                  return (
                    <Link
                      key={post.id}
                      to={`/${prefix}/blog/${post.slug}`}
                      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {post.imagen_portada && (
                        <div className="aspect-[16/9] bg-slate-200 overflow-hidden">
                          <img
                            src={post.imagen_portada}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                          {post.categoria && (
                            <span className="px-2 py-0.5 bg-brand-light text-brand rounded-full font-medium">
                              {t(`blog.cat_${post.categoria}`)}
                            </span>
                          )}
                          <span>{date}</span>
                          <span>{minutes} min</span>
                        </div>
                        <h2 className="text-lg font-semibold text-navy-800 group-hover:text-brand transition-colors mb-2">
                          {title}
                        </h2>
                        {excerpt && (
                          <p className="text-sm text-slate-600 leading-relaxed">{excerpt}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {response && response.totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("blog.prev")}
                  </button>
                  <span className="flex items-center text-sm text-slate-600">
                    {page} / {response.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(response.totalPages, p + 1))}
                    disabled={page >= response.totalPages}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("blog.next")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">{t("blog.no_posts")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
