import { useState, useEffect, FormEvent } from "react";
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

function BlogCard({
  post,
  currentLang,
  prefix,
  featured = false,
  t,
}: {
  post: BlogPost;
  currentLang: string;
  prefix: string;
  featured?: boolean;
  t: (key: string) => string;
}) {
  const title = localize(post as unknown as Record<string, unknown>, "titulo", currentLang);
  const extracto = localize(post as unknown as Record<string, unknown>, "extracto", currentLang);
  const contenido = localize(post as unknown as Record<string, unknown>, "contenido", currentLang);
  const maxLen = featured ? 250 : 120;
  const excerpt = extracto
    ? extracto.length > maxLen ? extracto.slice(0, maxLen) + "..." : extracto
    : "";
  const minutes = readingTime(contenido);
  const date = formatDate(post.published_at || post.created_at, currentLang);

  return (
    <Link
      to={`/${prefix}/blog/${post.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    >
      {featured && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full uppercase tracking-wide">
          {t("blog.featured")}
        </span>
      )}
      {post.imagen_portada && (
        <div className={`${featured ? "aspect-[16/9]" : "aspect-[16/9]"} bg-slate-200 overflow-hidden`}>
          <img
            src={post.imagen_portada}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading={featured ? "eager" : "lazy"}
          />
        </div>
      )}
      <div className={featured ? "p-6 sm:p-8" : "p-5"}>
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
          {post.categoria && (
            <span className="px-2 py-0.5 bg-brand-light text-brand rounded-full font-medium">
              {t(`blog.cat_${post.categoria}`)}
            </span>
          )}
          <span>{date}</span>
          <span>{minutes} min</span>
        </div>
        <h2
          className={`${
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          } font-semibold text-navy-800 group-hover:text-brand transition-colors mb-2`}
        >
          {title}
        </h2>
        {excerpt && (
          <p className={`${featured ? "text-base" : "text-sm"} text-slate-600 leading-relaxed`}>
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
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

  // Newsletter state
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nlEmail, origen: "blog_newsletter" }),
      });
      setNlStatus(res.ok ? "success" : "error");
      if (res.ok) setNlEmail("");
    } catch {
      setNlStatus("error");
    }
  };

  const categoryOptions = [
    { value: "", label: t("portfolio.all") },
    ...CATEGORIES.map((c) => ({ value: c, label: t(`blog.cat_${c}`) })),
  ];

  const posts = response?.data || [];
  const isFirstPage = page === 1;
  const featuredPost = isFirstPage && posts.length > 0 ? posts[0] : null;
  const gridPosts = isFirstPage ? posts.slice(1) : posts;

  // Build page number array
  const totalPages = response?.totalPages || 0;
  const pageNumbers: number[] = [];
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <PageHead
        title="Blog"
        description={t("blog.seo_desc")}
        path="/blog"
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Blog</h1>
        </div>
      </section>

      {/* Filters — sticky on mobile */}
      <section className="py-6 bg-slate-50 border-b border-slate-200 sticky top-16 z-10">
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
              {/* Featured article (page 1 only) */}
              {featuredPost && (
                <div className="mb-8">
                  <BlogCard
                    post={featuredPost}
                    currentLang={currentLang}
                    prefix={prefix}
                    featured
                    t={t}
                  />
                </div>
              )}

              {/* Rest of articles in 2-column grid */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {gridPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      currentLang={currentLang}
                      prefix={prefix}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Pagination">
                  {/* Previous */}
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("blog.prev")}
                  </button>

                  {/* Page numbers */}
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg border transition-colors ${
                        n === page
                          ? "bg-brand text-white border-brand"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("blog.next")}
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">{t("blog.no_posts")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-800 mb-3">
            {t("blog.subscribe_title")}
          </h2>
          <p className="text-slate-600 mb-6">{t("blog.subscribe_desc")}</p>
          {nlStatus === "success" ? (
            <p className="text-brand font-medium">{t("blog.subscribe_success")}</p>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder={t("blog.subscribe_placeholder")}
                inputMode="email"
                autoComplete="email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-base"
              />
              <button
                type="submit"
                disabled={nlStatus === "sending"}
                className="px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-60 text-sm whitespace-nowrap"
              >
                {nlStatus === "sending" ? "..." : t("blog.subscribe_button")}
              </button>
            </form>
          )}
          {nlStatus === "error" && (
            <p className="text-red-500 text-sm mt-2">{t("contact.error")}</p>
          )}
        </div>
      </section>
    </>
  );
}
