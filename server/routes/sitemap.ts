import type { Express } from "express";
import { db } from "../db.js";
import { blogPosts, zones } from "@shared/schema";
import { eq } from "drizzle-orm";

const DOMAIN = "https://arafinestra.com";
const LANGS = ["ca", "es", "en"];
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Static routes (mirrors seo-inject.ts STATIC_ROUTES keys + homepage)
const STATIC_PATHS = [
  "",
  "cortizo",
  "subvencions",
  "pressupost",
  "projectes",
  "blog",
  "opinions",
  "contacte",
  "zones",
  "proces",
  "serveis/finestres-pvc",
  "serveis/portes-corredisses",
  "serveis/persianes",
  "serveis/mosquiteres",
  "qui-som",
  "visita-gratuita",
  "financament",
  "preus",
  "legal/privacitat",
  "legal/termes",
  "legal/cookies",
  "legal/avis-legal",
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function registerSitemapRoutes(app: Express) {
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const urls: string[] = [];

      // Static routes for each language
      for (const path of STATIC_PATHS) {
        for (const lang of LANGS) {
          const fullPath = path ? `/${lang}/${path}` : `/${lang}`;
          const url = `${DOMAIN}${fullPath}`;
          const priority = path === "" ? "1.0" : "0.8";
          const alternates = [
            ...LANGS.map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}${path ? `/${path}` : ""}" />`
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/ca${path ? `/${path}` : ""}" />`,
          ].join("\n");

          urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${path === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`);
        }
      }

      // Dynamic: published blog posts (with image extensions)
      const posts = await db
        .select({
          slug: blogPosts.slug,
          publishedAt: blogPosts.publishedAt,
          imagenPortada: blogPosts.imagenPortada,
        })
        .from(blogPosts)
        .where(eq(blogPosts.published, true));

      for (const post of posts) {
        const slug = escapeXml(post.slug);
        const lastmod = post.publishedAt
          ? new Date(post.publishedAt).toISOString().slice(0, 10)
          : BUILD_DATE;
        const imageTag = post.imagenPortada
          ? `\n    <image:image>\n      <image:loc>${escapeXml(post.imagenPortada)}</image:loc>\n    </image:image>`
          : "";
        const blogAlternates = [
          ...LANGS.map(
            (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}/blog/${slug}" />`
          ),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/ca/blog/${slug}" />`,
        ].join("\n");

        for (const lang of LANGS) {
          const url = `${DOMAIN}/${lang}/blog/${slug}`;
          urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${blogAlternates}${imageTag}
  </url>`);
        }
      }

      // Dynamic: published zones
      const allZones = await db
        .select({ slug: zones.slug })
        .from(zones)
        .where(eq(zones.published, true));

      for (const zone of allZones) {
        const slug = escapeXml(zone.slug);
        const zoneAlternates = [
          ...LANGS.map(
            (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}/zones/${slug}" />`
          ),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/ca/zones/${slug}" />`,
        ].join("\n");

        for (const lang of LANGS) {
          const url = `${DOMAIN}/${lang}/zones/${slug}`;
          urls.push(`  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${zoneAlternates}
  </url>`);
        }
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (err) {
      console.error("[sitemap] Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // robots.txt
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${DOMAIN}/sitemap.xml
`);
  });
}
