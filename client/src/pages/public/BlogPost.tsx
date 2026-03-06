import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PageHead from "../../components/seo/PageHead";
import { localize } from "../../lib/localize";

interface Post {
  id: number;
  slug: string;
  titulo_ca: string;
  titulo_es: string;
  titulo_en: string;
  contenido_ca: string | null;
  contenido_es: string | null;
  contenido_en: string | null;
  extracto_ca: string | null;
  extracto_es: string | null;
  extracto_en: string | null;
  categoria: string | null;
  autor: string | null;
  imagen_portada: string | null;
  meta_title_ca: string | null;
  meta_title_es: string | null;
  meta_title_en: string | null;
  meta_description_ca: string | null;
  meta_description_es: string | null;
  meta_description_en: string | null;
  published_at: string | null;
  created_at: string;
}

function readingTime(text: string | null): number {
  if (!text) return 1;
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
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

export default function BlogPost() {
  const { t, i18n } = useTranslation();
  const { lang, slug } = useParams<{ lang?: string; slug: string }>();
  const currentLang = lang || i18n.language || "ca";
  const prefix = lang || i18n.language || "ca";

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">...</div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 py-20">
        <p className="text-2xl font-semibold mb-4">{t("blog.not_found")}</p>
        <Link to={`/${prefix}/blog`} className="text-sky-600 hover:text-sky-700">
          {t("blog.back_to_blog")}
        </Link>
      </div>
    );
  }

  const obj = post as unknown as Record<string, unknown>;
  const title = localize(obj, "titulo", currentLang);
  const content = localize(obj, "contenido", currentLang);
  const metaTitle = localize(obj, "meta_title", currentLang) || title;
  const metaDesc = localize(obj, "meta_description", currentLang) || localize(obj, "extracto", currentLang);
  const minutes = readingTime(content);
  const date = formatDate(post.published_at || post.created_at, currentLang);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: metaDesc,
    image: post.imagen_portada || undefined,
    author: post.autor ? { "@type": "Person", name: post.autor } : undefined,
    publisher: {
      "@type": "Organization",
      name: "ARA FINESTRA",
    },
    datePublished: post.published_at || post.created_at,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `https://arafinestra.com/${currentLang}/blog` },
      { "@type": "ListItem", position: 2, name: title },
    ],
  };

  return (
    <>
      <PageHead
        title={metaTitle}
        description={metaDesc}
        path={`/blog/${post.slug}`}
        image={post.imagen_portada || undefined}
        schema={articleSchema}
      />
      {/* Breadcrumb schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero image */}
      {post.imagen_portada && (
        <section className="relative h-64 sm:h-80 lg:h-96 bg-slate-800">
          <img
            src={post.imagen_portada}
            alt={title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </section>
      )}

      {/* Article */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <article className="flex-1 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">
                {post.autor && <span>{post.autor}</span>}
                {date && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span>{date}</span>
                  </>
                )}
                <span className="text-slate-300">|</span>
                <span>{minutes} min</span>
                {post.categoria && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full text-xs font-medium">
                      {t(`blog.cat_${post.categoria}`)}
                    </span>
                  </>
                )}
              </div>
              <div className="prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:text-slate-800 prose-a:text-sky-600 hover:prose-a:text-sky-700">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </article>

            {/* Sidebar CTA */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 bg-sky-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t("blog.cta_title")}</h3>
                <p className="text-sm text-slate-600 mb-4">{t("blog.cta_desc")}</p>
                <Link
                  to={`/${prefix}/pressupost`}
                  className="block w-full text-center px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-400 transition-colors"
                >
                  {t("cta.calculate")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
