import { db } from "../db.js";
import { blogPosts, zones } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { safeJsonLd } from "./escape.js";

const DOMAIN = "https://arafinestra.com";
const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.png`;

export interface RouteMeta {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
  jsonLd?: Record<string, unknown>;
  ogType?: string; // "website" | "article"
  articleMeta?: { publishedTime?: string; modifiedTime?: string; author?: string };
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

// Static route meta — keyed by path segment, then by language
const STATIC_ROUTES: Record<string, Record<string, StaticRouteEntry>> = {
  cortizo: {
    ca: { title: "Perfils PVC Cortizo — Partner Oficial a Girona | ARA FINESTRA", description: "ARA FINESTRA és distribuïdor oficial de Cortizo a Catalunya. Sistemes de finestres PVC d'alta qualitat amb garantia de fàbrica." },
    es: { title: "Perfiles PVC Cortizo — Partner Oficial en Girona | ARA FINESTRA", description: "ARA FINESTRA es distribuidor oficial de Cortizo en Cataluña. Sistemas de ventanas PVC de alta calidad con garantía de fábrica." },
    en: { title: "Cortizo PVC Profiles — Official Partner in Girona | ARA FINESTRA", description: "ARA FINESTRA is an official Cortizo distributor in Catalonia. High-quality PVC window systems with factory warranty." },
  },
  subvencions: {
    ca: { title: "Subvencions per Finestres PVC | ARA FINESTRA", description: "Descobreix les subvencions disponibles per a la renovació de finestres PVC a Catalunya. T'ajudem amb la tramitació completa." },
    es: { title: "Subvenciones para Ventanas PVC | ARA FINESTRA", description: "Descubre las subvenciones disponibles para la renovación de ventanas PVC en Cataluña. Te ayudamos con la tramitación completa." },
    en: { title: "PVC Window Subsidies | ARA FINESTRA", description: "Discover available subsidies for PVC window renovation in Catalonia. We help you with the complete application process." },
  },
  pressupost: {
    ca: { title: "Calculadora Online de Pressupost Finestres PVC | ARA FINESTRA", description: "Calcula el pressupost per a les teves finestres PVC Cortizo en línia. Preu orientatiu immediat i sense compromís." },
    es: { title: "Calculadora Online de Presupuesto Ventanas PVC | ARA FINESTRA", description: "Calcula el presupuesto para tus ventanas PVC Cortizo online. Precio orientativo inmediato y sin compromiso." },
    en: { title: "Online PVC Window Budget Calculator | ARA FINESTRA", description: "Calculate your Cortizo PVC window budget online. Immediate indicative price with no obligation." },
  },
  projectes: {
    ca: { title: "Projectes de Finestres PVC Cortizo a Girona | ARA FINESTRA", description: "Descobreix els nostres projectes d'instal·lació de finestres PVC Cortizo a Catalunya. Fotos reals de treballs acabats." },
    es: { title: "Proyectos de Ventanas PVC Cortizo en Girona | ARA FINESTRA", description: "Descubre nuestros proyectos de instalación de ventanas PVC Cortizo en Cataluña. Fotos reales de trabajos terminados." },
    en: { title: "Cortizo PVC Window Projects in Girona | ARA FINESTRA", description: "Discover our Cortizo PVC window installation projects in Catalonia. Real photos of finished work." },
  },
  blog: {
    ca: { title: "Blog sobre Finestres PVC i Eficiència Energètica | ARA FINESTRA", description: "Articles i consells sobre finestres PVC, eficiència energètica, subvencions i reformes. Mantén-te informat amb ARA FINESTRA." },
    es: { title: "Blog sobre Ventanas PVC y Eficiencia Energética | ARA FINESTRA", description: "Artículos y consejos sobre ventanas PVC, eficiencia energética, subvenciones y reformas. Mantente informado con ARA FINESTRA." },
    en: { title: "PVC Windows & Energy Efficiency Blog | ARA FINESTRA", description: "Articles and tips about PVC windows, energy efficiency, subsidies, and renovations. Stay informed with ARA FINESTRA." },
  },
  opinions: {
    ca: { title: "Opinions i Valoracions de Clients Reals | ARA FINESTRA", description: "Llegeix les opinions reals dels nostres clients. Descobreix per què confien en ARA FINESTRA per a les seves finestres PVC Cortizo." },
    es: { title: "Opiniones y Valoraciones de Clientes Reales | ARA FINESTRA", description: "Lee las opiniones reales de nuestros clientes. Descubre por qué confían en ARA FINESTRA para sus ventanas PVC Cortizo." },
    en: { title: "Real Customer Reviews & Ratings | ARA FINESTRA", description: "Read real customer reviews. Discover why they trust ARA FINESTRA for their Cortizo PVC windows." },
  },
  contacte: {
    ca: { title: "Contacta — Pressupost Gratuït Finestres PVC Girona | ARA FINESTRA", description: "Contacta amb ARA FINESTRA. Demana pressupost sense compromís per a finestres PVC Cortizo a Catalunya." },
    es: { title: "Contacto — Presupuesto Gratis Ventanas PVC Girona | ARA FINESTRA", description: "Contacta con ARA FINESTRA. Pide presupuesto sin compromiso para ventanas PVC Cortizo en Cataluña." },
    en: { title: "Contact — Free PVC Window Quote in Girona | ARA FINESTRA", description: "Contact ARA FINESTRA. Request a free quote for Cortizo PVC windows in Catalonia." },
  },
  zones: {
    ca: { title: "Zones de Servei — Finestres PVC a Girona i Maresme | ARA FINESTRA", description: "ARA FINESTRA ofereix serveis d'instal·lació de finestres PVC Cortizo a tota Catalunya. Consulta la teva zona." },
    es: { title: "Zonas de Servicio — Ventanas PVC en Girona y Maresme | ARA FINESTRA", description: "ARA FINESTRA ofrece servicios de instalación de ventanas PVC Cortizo en toda Cataluña. Consulta tu zona." },
    en: { title: "Service Areas — PVC Windows in Girona & Maresme | ARA FINESTRA", description: "ARA FINESTRA offers Cortizo PVC window installation services throughout Catalonia. Check your area." },
  },
  proces: {
    ca: { title: "Procés d'Instal·lació de Finestres PVC — 5 Passos | ARA FINESTRA", description: "Coneix el procés d'instal·lació de finestres PVC Cortizo amb ARA FINESTRA. Des de la consulta inicial fins a la instal·lació final." },
    es: { title: "Proceso de Instalación de Ventanas PVC — 5 Pasos | ARA FINESTRA", description: "Conoce el proceso de instalación de ventanas PVC Cortizo con ARA FINESTRA. Desde la consulta inicial hasta la instalación final." },
    en: { title: "PVC Window Installation Process — 5 Steps | ARA FINESTRA", description: "Learn about the Cortizo PVC window installation process with ARA FINESTRA. From initial consultation to final installation." },
  },
  "serveis/finestres-pvc": {
    ca: { title: "Finestres PVC Cortizo | ARA FINESTRA", description: "Finestres PVC Cortizo d'alta qualitat. Aïllament tèrmic i acústic superior. Instal·lació professional a Catalunya." },
    es: { title: "Ventanas PVC Cortizo | ARA FINESTRA", description: "Ventanas PVC Cortizo de alta calidad. Aislamiento térmico y acústico superior. Instalación profesional en Cataluña." },
    en: { title: "Cortizo PVC Windows | ARA FINESTRA", description: "High-quality Cortizo PVC windows. Superior thermal and acoustic insulation. Professional installation in Catalonia." },
  },
  "serveis/portes-corredisses": {
    ca: { title: "Portes Corredisses PVC | ARA FINESTRA", description: "Portes corredisses PVC Cortizo. Estalvia espai amb sistemes lliscants d'alta qualitat. Instal·lació a Catalunya." },
    es: { title: "Puertas Correderas PVC | ARA FINESTRA", description: "Puertas correderas PVC Cortizo. Ahorra espacio con sistemas deslizantes de alta calidad. Instalación en Cataluña." },
    en: { title: "PVC Sliding Doors | ARA FINESTRA", description: "Cortizo PVC sliding doors. Save space with high-quality sliding systems. Installation in Catalonia." },
  },
  "serveis/persianes": {
    ca: { title: "Persianes PVC | ARA FINESTRA", description: "Persianes PVC Cortizo per a la teva llar. Aïllament, seguretat i durabilitat. Instal·lació professional a Catalunya." },
    es: { title: "Persianas PVC | ARA FINESTRA", description: "Persianas PVC Cortizo para tu hogar. Aislamiento, seguridad y durabilidad. Instalación profesional en Cataluña." },
    en: { title: "PVC Shutters | ARA FINESTRA", description: "Cortizo PVC shutters for your home. Insulation, security, and durability. Professional installation in Catalonia." },
  },
  "serveis/mosquiteres": {
    ca: { title: "Mosquiteres | ARA FINESTRA", description: "Mosquiteres a mida per a finestres i portes. Protecció contra insectes sense renunciar a la ventilació. ARA FINESTRA." },
    es: { title: "Mosquiteras | ARA FINESTRA", description: "Mosquiteras a medida para ventanas y puertas. Protección contra insectos sin renunciar a la ventilación. ARA FINESTRA." },
    en: { title: "Mosquito Nets | ARA FINESTRA", description: "Custom mosquito nets for windows and doors. Insect protection without sacrificing ventilation. ARA FINESTRA." },
  },
  "qui-som": {
    ca: { title: "Qui Som | ARA FINESTRA — Instal·ladors de Finestres PVC a Girona", description: "Coneix l'equip d'ARA FINESTRA. Instal·ladors certificats Cortizo a Girona amb més de 500 projectes completats. Empresa local, servei professional." },
    es: { title: "Quiénes Somos | ARA FINESTRA — Instaladores de Ventanas PVC en Girona", description: "Conoce al equipo de ARA FINESTRA. Instaladores certificados Cortizo en Girona con más de 500 proyectos completados. Empresa local, servicio profesional." },
    en: { title: "About Us | ARA FINESTRA — PVC Window Installers in Girona", description: "Meet the ARA FINESTRA team. Certified Cortizo installers in Girona with over 500 completed projects. Local company, professional service." },
  },
  "visita-gratuita": {
    ca: { title: "Visita Gratuïta a Domicili | ARA FINESTRA", description: "Demana una visita tècnica gratuïta. Un instal·lador certificat visitarà casa teva en 48h per prendre mides i fer-te un pressupost exacte sense compromís." },
    es: { title: "Visita Gratuita a Domicilio | ARA FINESTRA", description: "Solicita una visita técnica gratuita. Un instalador certificado visitará tu casa en 48h para tomar medidas y hacerte un presupuesto exacto sin compromiso." },
    en: { title: "Free Home Visit | ARA FINESTRA", description: "Request a free technical visit. A certified installer will visit your home within 48h to take measurements and provide an exact no-obligation quote." },
  },
  financament: {
    ca: { title: "Finançament Sense Interessos | ARA FINESTRA", description: "Finança les teves finestres PVC de 3 a 24 mesos sense interessos. Sense entrada, sense sorpreses. Combinable amb subvencions Next Generation." },
    es: { title: "Financiación Sin Intereses | ARA FINESTRA", description: "Financia tus ventanas PVC de 3 a 24 meses sin intereses. Sin entrada, sin sorpresas. Combinable con subvenciones Next Generation." },
    en: { title: "Interest-Free Financing | ARA FINESTRA", description: "Finance your PVC windows from 3 to 24 months interest-free. No down payment, no surprises. Combinable with Next Generation subsidies." },
  },
  preus: {
    ca: { title: "Preus Finestres PVC Cortizo | ARA FINESTRA", description: "Consulta els preus de finestres PVC Cortizo a Girona. Des de 280€ per finestra. Taula de preus per model, subvencions i finançament disponibles." },
    es: { title: "Precios Ventanas PVC Cortizo | ARA FINESTRA", description: "Consulta los precios de ventanas PVC Cortizo en Girona. Desde 280€ por ventana. Tabla de precios por modelo, subvenciones y financiación disponibles." },
    en: { title: "Cortizo PVC Window Prices | ARA FINESTRA", description: "Check Cortizo PVC window prices in Girona. From €280 per window. Price table by model, subsidies and financing available." },
  },
  "legal/privacitat": {
    ca: { title: "Política de Privacitat | ARA FINESTRA", description: "Política de privacitat d'ARA FINESTRA (Renova't Costa Brava SL). Informació sobre el tractament de dades personals conforme al RGPD." },
    es: { title: "Política de Privacidad | ARA FINESTRA", description: "Política de privacidad de ARA FINESTRA (Renova't Costa Brava SL). Información sobre el tratamiento de datos personales conforme al RGPD." },
    en: { title: "Privacy Policy | ARA FINESTRA", description: "ARA FINESTRA privacy policy (Renova't Costa Brava SL). Information about personal data processing in accordance with GDPR." },
  },
  "legal/termes": {
    ca: { title: "Termes i Condicions | ARA FINESTRA", description: "Termes i condicions d'ús del lloc web arafinestra.com i dels serveis d'instal·lació de finestres PVC Cortizo." },
    es: { title: "Términos y Condiciones | ARA FINESTRA", description: "Términos y condiciones de uso del sitio web arafinestra.com y de los servicios de instalación de ventanas PVC Cortizo." },
    en: { title: "Terms and Conditions | ARA FINESTRA", description: "Terms and conditions of use for the arafinestra.com website and Cortizo PVC window installation services." },
  },
  "legal/cookies": {
    ca: { title: "Política de Cookies | ARA FINESTRA", description: "Informació sobre les cookies utilitzades al lloc web arafinestra.com i com gestionar-les." },
    es: { title: "Política de Cookies | ARA FINESTRA", description: "Información sobre las cookies utilizadas en el sitio web arafinestra.com y cómo gestionarlas." },
    en: { title: "Cookie Policy | ARA FINESTRA", description: "Information about cookies used on the arafinestra.com website and how to manage them." },
  },
  "legal/avis-legal": {
    ca: { title: "Avís Legal | ARA FINESTRA", description: "Avís legal d'ARA FINESTRA (Renova't Costa Brava SL, CIF B42997049). Dades identificatives conforme a la LSSI-CE." },
    es: { title: "Aviso Legal | ARA FINESTRA", description: "Aviso legal de ARA FINESTRA (Renova't Costa Brava SL, CIF B42997049). Datos identificativos conforme a la LSSI-CE." },
    en: { title: "Legal Notice | ARA FINESTRA", description: "ARA FINESTRA legal notice (Renova't Costa Brava SL, CIF B42997049). Identification data in accordance with LSSI-CE." },
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
  updatedAt?: Date | null;
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
    ...(post.updatedAt
      ? { dateModified: post.updatedAt.toISOString() }
      : post.publishedAt
        ? { dateModified: post.publishedAt.toISOString() }
        : {}),
    about: [
      { "@type": "Thing", name: "Ventanas PVC" },
      { "@type": "Thing", name: "Aislamiento térmico" },
    ],
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
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
        "@graph": [
          {
            "@type": "Organization",
            name: "ARA FINESTRA",
            url: DOMAIN,
            description: home.description,
            logo: `${DOMAIN}/logo.png`,
            areaServed: { "@type": "Place", name: "Catalunya" },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              telephone: "+34611500372",
              availableLanguage: ["Catalan", "Spanish", "English"],
            },
            sameAs: [
              "https://instagram.com/arafinestra",
              "https://facebook.com/arafinestra",
            ],
          },
          {
            "@type": "WebSite",
            name: "ARA FINESTRA",
            url: DOMAIN,
            inLanguage: ["ca", "es", "en"],
            potentialAction: {
              "@type": "SearchAction",
              target: `${DOMAIN}/ca/blog?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ],
      },
    };
    staticMetaCache.set(cacheKey, meta);
    return meta;
  }

  // Known static routes
  const langEntries = STATIC_ROUTES[routePath];
  if (langEntries) {
    const entry = langEntries[lang] || langEntries.ca;
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
        createdAt: blogPosts.createdAt,
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
      ogType: "article",
      articleMeta: {
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: (post.publishedAt || post.createdAt)?.toISOString(),
        author: post.autor || "ARA FINESTRA",
      },
      jsonLd: buildBlogJsonLd({
        title,
        description,
        url,
        image: post.imagenPortada || undefined,
        author: post.autor || undefined,
        publishedAt: post.publishedAt,
        // dateModified debe ser >= datePublished. createdAt (fecha de borrador) puede
        // ser anterior a la publicación → usar publishedAt, coherente con modifiedTime.
        updatedAt: post.publishedAt || post.createdAt,
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

// OG locale mapping
const OG_LOCALE_MAP: Record<string, string> = { ca: "ca_ES", es: "es_ES", en: "en_US" };

/**
 * Inject meta tags into the HTML template string.
 */
export function injectMeta(template: string, meta: RouteMeta, reqPath?: string): string {
  // Replace <title>. Función de reemplazo para que un $$ / $& / $' en el título
  // no sea interpretado como patrón de String.replace y corrompa el HTML.
  const titleTag = `<title>${escapeHtml(meta.title)}</title>`;
  let html = template.replace(/<title>[^<]*<\/title>/, () => titleTag);

  // Extract lang from canonical URL or request path for hreflang/og:locale
  const { lang, routePath } = parsePath(reqPath || meta.canonicalUrl.replace(DOMAIN, ""));

  // <html lang> must match the route language (SEO + screen reader pronunciation)
  html = html.replace(/<html([^>]*)\slang="[^"]*"/, `<html$1 lang="${lang}"`);
  const ogType = meta.ogType || "website";
  const ogLocale = OG_LOCALE_MAP[lang] || "ca_ES";

  // Build meta tags to insert after </title>
  const metaTags = [
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="ARA FINESTRA" />`,
    `<meta property="og:locale" content="${ogLocale}" />`,
  ];

  // og:locale:alternate for the other two languages
  for (const l of VALID_LANGS) {
    if (l !== lang) {
      metaTags.push(`<meta property="og:locale:alternate" content="${OG_LOCALE_MAP[l] || l}" />`);
    }
  }

  // Article-specific OG tags for blog posts
  if (ogType === "article" && meta.articleMeta) {
    if (meta.articleMeta.publishedTime) {
      metaTags.push(`<meta property="article:published_time" content="${meta.articleMeta.publishedTime}" />`);
    }
    if (meta.articleMeta.modifiedTime) {
      metaTags.push(`<meta property="article:modified_time" content="${meta.articleMeta.modifiedTime}" />`);
    }
    if (meta.articleMeta.author) {
      metaTags.push(`<meta property="article:author" content="${escapeAttr(meta.articleMeta.author)}" />`);
    }
  }

  metaTags.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(meta.ogImage)}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`,
  );

  // Hreflang alternate links (server-side — critical for crawlers)
  const pathSuffix = routePath ? `/${routePath}` : "";
  for (const l of VALID_LANGS) {
    metaTags.push(`<link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}${pathSuffix}" />`);
  }
  metaTags.push(`<link rel="alternate" hreflang="x-default" href="${DOMAIN}/ca${pathSuffix}" />`);

  if (meta.jsonLd) {
    metaTags.push(
      `<script type="application/ld+json">${safeJsonLd(meta.jsonLd)}</script>`
    );
  }

  // Insert after </title>. Función de reemplazo por la misma razón: los meta tags
  // contienen contenido de usuario que puede incluir $ (p.ej. "Ofertes $$").
  const injected = `</title>\n    ${metaTags.join("\n    ")}`;
  html = html.replace("</title>", () => injected);

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
