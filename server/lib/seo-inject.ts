import { db } from "../db.js";
import { blogPosts, zones } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const DOMAIN = "https://arafinestra.com";
const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.jpg`;

export interface RouteMeta {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_META: RouteMeta = {
  title: "ARA FINESTRA | Finestres PVC Cortizo a Catalunya",
  description:
    "Instal·ladors oficials de finestres PVC Cortizo a Catalunya. Pressupostos sense compromís, subvencions disponibles i projectes a mida per a la teva llar.",
  ogImage: DEFAULT_OG_IMAGE,
  canonicalUrl: DOMAIN,
};

// Lang-specific titles/descriptions for the homepage
const HOME_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  ca: {
    title: "Finestres PVC Cortizo a Catalunya | ARA FINESTRA",
    description:
      "Instal·ladors oficials de finestres PVC Cortizo a Catalunya. Pressupostos sense compromís, subvencions disponibles i projectes a mida per a la teva llar.",
  },
  es: {
    title: "Ventanas PVC Cortizo en Cataluña | ARA FINESTRA",
    description:
      "Instaladores oficiales de ventanas PVC Cortizo en Cataluña. Presupuestos sin compromiso, subvenciones disponibles y proyectos a medida para tu hogar.",
  },
  en: {
    title: "PVC Windows Cortizo in Catalonia | ARA FINESTRA",
    description:
      "Official Cortizo PVC window installers in Catalonia. Free quotes, available subsidies, and custom projects for your home.",
  },
};

interface StaticRouteEntry {
  title: string;
  description: string;
}

// Static route meta — keyed by path segment (without lang prefix)
const STATIC_ROUTES: Record<string, StaticRouteEntry> = {
  cortizo: {
    title: "Cortizo - Partner Oficial | ARA FINESTRA",
    description:
      "ARA FINESTRA és distribuïdor oficial de Cortizo a Catalunya. Sistemes de finestres PVC d'alta qualitat amb garantia de fàbrica.",
  },
  subvencions: {
    title: "Subvencions per Finestres PVC | ARA FINESTRA",
    description:
      "Descobreix les subvencions disponibles per a la renovació de finestres PVC a Catalunya. T'ajudem amb la tramitació completa.",
  },
  pressupost: {
    title: "Calculadora de Pressupost | ARA FINESTRA",
    description:
      "Calcula el pressupost per a les teves finestres PVC Cortizo en línia. Preu orientatiu immediat i sense compromís.",
  },
  projectes: {
    title: "Projectes Realitzats | ARA FINESTRA",
    description:
      "Descobreix els nostres projectes d'instal·lació de finestres PVC Cortizo a Catalunya. Fotos reals de treballs acabats.",
  },
  blog: {
    title: "Blog | ARA FINESTRA",
    description:
      "Articles i consells sobre finestres PVC, eficiència energètica, subvencions i reformes. Mantén-te informat amb ARA FINESTRA.",
  },
  opinions: {
    title: "Opinions de Clients | ARA FINESTRA",
    description:
      "Llegeix les opinions reals dels nostres clients. Descobreix per què confien en ARA FINESTRA per a les seves finestres PVC Cortizo.",
  },
  contacte: {
    title: "Contacte | ARA FINESTRA",
    description:
      "Contacta amb ARA FINESTRA. Demana pressupost sense compromís per a finestres PVC Cortizo a Catalunya.",
  },
  zones: {
    title: "Zones de Servei | ARA FINESTRA",
    description:
      "ARA FINESTRA ofereix serveis d'instal·lació de finestres PVC Cortizo a tota Catalunya. Consulta la teva zona.",
  },
  proces: {
    title: "El Nostre Procés | ARA FINESTRA",
    description:
      "Coneix el procés d'instal·lació de finestres PVC Cortizo amb ARA FINESTRA. Des de la consulta inicial fins a la instal·lació final.",
  },
  "serveis/finestres-pvc": {
    title: "Finestres PVC Cortizo | ARA FINESTRA",
    description:
      "Finestres PVC Cortizo d'alta qualitat. Aïllament tèrmic i acústic superior. Instal·lació professional a Catalunya.",
  },
  "serveis/portes-corredisses": {
    title: "Portes Corredisses PVC | ARA FINESTRA",
    description:
      "Portes corredisses PVC Cortizo. Estalvia espai amb sistemes lliscants d'alta qualitat. Instal·lació a Catalunya.",
  },
  "serveis/persianes": {
    title: "Persianes PVC | ARA FINESTRA",
    description:
      "Persianes PVC Cortizo per a la teva llar. Aïllament, seguretat i durabilitat. Instal·lació professional a Catalunya.",
  },
  "serveis/mosquiteres": {
    title: "Mosquiteres | ARA FINESTRA",
    description:
      "Mosquiteres a mida per a finestres i portes. Protecció contra insectes sense renunciar a la ventilació. ARA FINESTRA.",
  },
};

// Valid language prefixes
const VALID_LANGS = new Set(["ca", "es", "en"]);

/**
 * Parse a request path into { lang, routePath }
 * e.g. "/ca/blog/my-post" => { lang: "ca", routePath: "blog/my-post" }
 *      "/" => { lang: "ca", routePath: "" }
 */
function parsePath(reqPath: string): { lang: string; routePath: string } {
  const segments = reqPath.replace(/^\/+|\/+$/g, "").split("/");
  if (segments.length >= 1 && VALID_LANGS.has(segments[0])) {
    return { lang: segments[0], routePath: segments.slice(1).join("/") };
  }
  return { lang: "ca", routePath: segments.join("/") };
}

function buildJsonLd(meta: { title: string; description: string; url: string; type?: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": meta.type || "WebPage",
    name: meta.title,
    description: meta.description,
    url: meta.url,
    publisher: {
      "@type": "Organization",
      name: "ARA FINESTRA",
      url: DOMAIN,
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/logo.png`,
      },
    },
  };
}

function buildBlogJsonLd(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishedAt?: Date | null;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url,
    image: post.image || DEFAULT_OG_IMAGE,
    author: {
      "@type": "Person",
      name: post.author || "ARA FINESTRA",
    },
    publisher: {
      "@type": "Organization",
      name: "ARA FINESTRA",
      url: DOMAIN,
      logo: { "@type": "ImageObject", url: `${DOMAIN}/logo.png` },
    },
    ...(post.publishedAt
      ? { datePublished: post.publishedAt.toISOString() }
      : {}),
  };
}

// ---------- Cached static meta ----------
const staticMetaCache = new Map<string, RouteMeta>();

function getStaticMeta(lang: string, routePath: string): RouteMeta | null {
  const cacheKey = `${lang}/${routePath}`;
  const cached = staticMetaCache.get(cacheKey);
  if (cached) return cached;

  // Homepage
  if (routePath === "" || routePath === lang) {
    const home = HOME_DESCRIPTIONS[lang] || HOME_DESCRIPTIONS.ca;
    const url = `${DOMAIN}/${lang}`;
    const meta: RouteMeta = {
      title: home.title,
      description: home.description,
      ogImage: DEFAULT_OG_IMAGE,
      canonicalUrl: url,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ARA FINESTRA",
        url: DOMAIN,
        description: home.description,
        logo: `${DOMAIN}/logo.png`,
        areaServed: { "@type": "Place", name: "Catalunya" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: ["Catalan", "Spanish", "English"],
        },
      },
    };
    staticMetaCache.set(cacheKey, meta);
    return meta;
  }

  // Known static routes
  const entry = STATIC_ROUTES[routePath];
  if (entry) {
    const url = `${DOMAIN}/${lang}/${routePath}`;
    const meta: RouteMeta = {
      title: entry.title,
      description: entry.description,
      ogImage: DEFAULT_OG_IMAGE,
      canonicalUrl: url,
      jsonLd: buildJsonLd({ title: entry.title, description: entry.description, url }),
    };
    staticMetaCache.set(cacheKey, meta);
    return meta;
  }

  return null;
}

// ---------- Dynamic meta (DB) ----------

async function getBlogPostMeta(lang: string, slug: string): Promise<RouteMeta | null> {
  try {
    const [post] = await db
      .select({
        tituloCa: blogPosts.tituloCa,
        tituloEs: blogPosts.tituloEs,
        tituloEn: blogPosts.tituloEn,
        extractoCa: blogPosts.extractoCa,
        extractoEs: blogPosts.extractoEs,
        extractoEn: blogPosts.extractoEn,
        metaTitleCa: blogPosts.metaTitleCa,
        metaTitleEs: blogPosts.metaTitleEs,
        metaTitleEn: blogPosts.metaTitleEn,
        metaDescriptionCa: blogPosts.metaDescriptionCa,
        metaDescriptionEs: blogPosts.metaDescriptionEs,
        metaDescriptionEn: blogPosts.metaDescriptionEn,
        imagenPortada: blogPosts.imagenPortada,
        autor: blogPosts.autor,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1);

    if (!post) return null;

    const titleMap: Record<string, string | null> = { ca: post.metaTitleCa, es: post.metaTitleEs, en: post.metaTitleEn };
    const descMap: Record<string, string | null> = { ca: post.metaDescriptionCa, es: post.metaDescriptionEs, en: post.metaDescriptionEn };
    const tituloMap: Record<string, string> = { ca: post.tituloCa, es: post.tituloEs, en: post.tituloEn };
    const extractoMap: Record<string, string | null> = { ca: post.extractoCa, es: post.extractoEs, en: post.extractoEn };

    const title = titleMap[lang] || tituloMap[lang] || tituloMap.ca;
    const description = descMap[lang] || extractoMap[lang] || extractoMap.ca || "";
    const url = `${DOMAIN}/${lang}/blog/${slug}`;

    return {
      title: `${title} | ARA FINESTRA`,
      description,
      ogImage: post.imagenPortada || DEFAULT_OG_IMAGE,
      canonicalUrl: url,
      jsonLd: buildBlogJsonLd({
        title,
        description,
        url,
        image: post.imagenPortada || undefined,
        author: post.autor || undefined,
        publishedAt: post.publishedAt,
      }),
    };
  } catch (err) {
    console.error("[seo-inject] Error fetching blog post meta:", err);
    return null;
  }
}

async function getZoneMeta(lang: string, slug: string): Promise<RouteMeta | null> {
  try {
    const [zone] = await db
      .select({
        nombreCa: zones.nombreCa,
        nombreEs: zones.nombreEs,
        nombreEn: zones.nombreEn,
        metaTitleCa: zones.metaTitleCa,
        metaTitleEs: zones.metaTitleEs,
        metaTitleEn: zones.metaTitleEn,
        metaDescriptionCa: zones.metaDescriptionCa,
        metaDescriptionEs: zones.metaDescriptionEs,
        metaDescriptionEn: zones.metaDescriptionEn,
      })
      .from(zones)
      .where(and(eq(zones.slug, slug), eq(zones.published, true)))
      .limit(1);

    if (!zone) return null;

    const titleMap: Record<string, string | null> = { ca: zone.metaTitleCa, es: zone.metaTitleEs, en: zone.metaTitleEn };
    const nombreMap: Record<string, string> = { ca: zone.nombreCa, es: zone.nombreEs, en: zone.nombreEn };
    const descMap: Record<string, string | null> = { ca: zone.metaDescriptionCa, es: zone.metaDescriptionEs, en: zone.metaDescriptionEn };

    const name = nombreMap[lang] || nombreMap.ca;
    const title = titleMap[lang] || `Finestres PVC a ${name} | ARA FINESTRA`;
    const description =
      descMap[lang] ||
      `Instal·lació de finestres PVC Cortizo a ${name}. Pressupost sense compromís. ARA FINESTRA.`;
    const url = `${DOMAIN}/${lang}/zones/${slug}`;

    return {
      title: typeof title === "string" && title.includes("ARA FINESTRA") ? title : `${title} | ARA FINESTRA`,
      description,
      ogImage: DEFAULT_OG_IMAGE,
      canonicalUrl: url,
      jsonLd: buildJsonLd({
        title: name,
        description,
        url,
        type: "LocalBusiness",
      }),
    };
  } catch (err) {
    console.error("[seo-inject] Error fetching zone meta:", err);
    return null;
  }
}

// ---------- Public API ----------

/**
 * Resolve meta tags for a given request path.
 * Static routes are cached in memory; dynamic routes query the DB.
 */
export async function getMetaForRoute(reqPath: string): Promise<RouteMeta> {
  const { lang, routePath } = parsePath(reqPath);

  // 1. Try static routes (cached)
  const staticMeta = getStaticMeta(lang, routePath);
  if (staticMeta) return staticMeta;

  // 2. Dynamic: blog post  (:lang/blog/:slug)
  const blogMatch = routePath.match(/^blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const meta = await getBlogPostMeta(lang, blogMatch[1]);
    if (meta) return meta;
  }

  // 3. Dynamic: zone page  (:lang/zones/:slug)
  const zoneMatch = routePath.match(/^zones\/([a-z0-9-]+)$/);
  if (zoneMatch) {
    const meta = await getZoneMeta(lang, zoneMatch[1]);
    if (meta) return meta;
  }

  // 4. Fallback
  return {
    ...DEFAULT_META,
    canonicalUrl: `${DOMAIN}${reqPath}`,
  };
}

/**
 * Inject meta tags into the HTML template string.
 */
export function injectMeta(template: string, meta: RouteMeta): string {
  // Replace <title>
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Build meta tags to insert after </title>
  const metaTags = [
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="ARA FINESTRA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(meta.ogImage)}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`,
  ];

  if (meta.jsonLd) {
    metaTags.push(
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`
    );
  }

  // Insert after </title>
  html = html.replace("</title>", `</title>\n    ${metaTags.join("\n    ")}`);

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
