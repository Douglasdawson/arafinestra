import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PageHead from "../../components/seo/PageHead";
import ScrollReveal from "../../components/ui/ScrollReveal";
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
  const [allPosts, setAllPosts] = useState<Post[]>([]);
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

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setAllPosts(Array.isArray(data) ? data : []))
      .catch(() => setAllPosts([]));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">...</div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 py-20">
        <p className="text-2xl font-semibold mb-4">{t("blog.not_found")}</p>
        <Link to={`/${prefix}/blog`} className="text-brand hover:text-brand-dark">
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
        <section className="relative h-64 sm:h-80 lg:h-96 bg-navy-800">
          <img
            src={post.imagen_portada}
            alt={title}
            className="w-full h-full object-cover opacity-70"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
        </section>
      )}

      {/* Article */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <article className="flex-1 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-navy-800 mb-4">{title}</h1>
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
                    <span className="px-2 py-0.5 bg-brand-light text-brand rounded-full text-xs font-medium">
                      {t(`blog.cat_${post.categoria}`)}
                    </span>
                  </>
                )}
              </div>
              <div className="prose prose-slate prose-sm sm:prose-base max-w-none prose-headings:text-navy-800 prose-a:text-brand hover:prose-a:text-brand-dark">
                <ReactMarkdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      if (href?.startsWith("/")) {
                        return (
                          <Link to={href} className="text-brand hover:text-brand-dark underline">
                            {children}
                          </Link>
                        );
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:text-brand-dark underline"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Sidebar CTA */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 bg-brand-light rounded-xl p-6">
                <h3 className="text-lg font-bold text-navy-800 mb-2">{t("blog.cta_title")}</h3>
                <p className="text-sm text-slate-600 mb-4">{t("blog.cta_desc")}</p>
                <Link
                  to={`/${prefix}/pressupost`}
                  className="block w-full text-center px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
                >
                  {t("cta.calculate")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {(() => {
        const others = allPosts.filter((p) => p.slug !== post.slug);
        let related = others.filter((p) => p.categoria && p.categoria === post.categoria);
        if (related.length === 0) {
          related = others.sort(
            (a, b) =>
              new Date(b.published_at || b.created_at).getTime() -
              new Date(a.published_at || a.created_at).getTime()
          );
        }
        const shown = related.slice(0, 3);
        if (shown.length === 0) return null;
        return (
          <section className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-navy-800 mb-8">{t("blog.related_title")}</h2>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((rp, idx) => {
                  const rpObj = rp as unknown as Record<string, unknown>;
                  const rpTitle = localize(rpObj, "titulo", currentLang);
                  const rpExcerpt = localize(rpObj, "extracto", currentLang);
                  return (
                    <ScrollReveal key={rp.slug} delay={idx * 0.1}>
                      <Link
                        to={`/${prefix}/blog/${rp.slug}`}
                        className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
                      >
                        {rp.imagen_portada && (
                          <img
                            src={rp.imagen_portada}
                            alt={rpTitle}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="p-5">
                          <h3 className="font-semibold text-navy-800 mb-2 line-clamp-2">{rpTitle}</h3>
                          {rpExcerpt && (
                            <p className="text-sm text-slate-500 line-clamp-3">{rpExcerpt}</p>
                          )}
                        </div>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Service CTA */}
      {(() => {
        const cat = (post.categoria || "").toLowerCase();
        let serviceLink: string;
        if (cat.includes("subvencion") || cat.includes("subvenci")) {
          serviceLink = `/${prefix}/subvencions`;
        } else if (cat.includes("porta") || cat.includes("puerta") || cat.includes("door") || cat.includes("corrediss")) {
          serviceLink = `/${prefix}/serveis/portes-corredisses`;
        } else if (cat.includes("persiana") || cat.includes("shutter")) {
          serviceLink = `/${prefix}/serveis/persianes`;
        } else if (cat.includes("mosquiter")) {
          serviceLink = `/${prefix}/serveis/mosquiteres`;
        } else {
          serviceLink = `/${prefix}/serveis/finestres-pvc`;
        }
        return (
          <section className="py-12 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="bg-brand-light rounded-xl p-6 text-center">
                  <p className="text-navy-800 font-medium">{t("blog.service_cta")}</p>
                  <Link
                    to={serviceLink}
                    className="inline-block mt-3 px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    {t("blog.service_cta_btn")}
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        );
      })()}
    </>
  );
}
