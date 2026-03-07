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
  const [copied, setCopied] = useState(false);

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

              {/* Author bio */}
              <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800">{t("blog.author_name")}</p>
                  <p className="text-xs text-slate-500">{t("blog.author_bio")}</p>
                </div>
              </div>

              {/* Social share buttons */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm text-slate-500 font-medium">{t("blog.share")}:</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent((title || '') + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors relative"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </button>
                {copied && (
                  <span className="text-xs text-green-600 font-medium">{t("blog.copied")}</span>
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

              {/* Inline CTA */}
              <div className="mt-10 bg-brand-light rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-navy-800 mb-2">{t("blog.inline_cta_title")}</h3>
                <p className="text-sm text-slate-600 mb-4">{t("blog.inline_cta_desc")}</p>
                <Link
                  to={`/${prefix}/pressupost`}
                  className="inline-block px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
                >
                  {t("cta.calculate")} &rarr;
                </Link>
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
