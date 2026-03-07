import type { Express } from "express";
import { db } from "../db.js";
import { blogPosts, zones } from "@shared/schema";
import { eq } from "drizzle-orm";

const DOMAIN = "https://arafinestra.com";
const LANGS = ["ca", "es", "en"] as const;

const STATIC_PAGES = [
  { path: "", priority: "1.0", changefreq: "monthly" },
  { path: "/cortizo", priority: "0.7", changefreq: "monthly" },
  { path: "/subvencions", priority: "0.7", changefreq: "monthly" },
  { path: "/pressupost", priority: "0.9", changefreq: "monthly" },
  { path: "/projectes", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/opinions", priority: "0.6", changefreq: "weekly" },
  { path: "/contacte", priority: "0.9", changefreq: "monthly" },
  { path: "/zones", priority: "0.8", changefreq: "monthly" },
  { path: "/legal/privacitat", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/termes", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/cookies", priority: "0.3", changefreq: "yearly" },
];

const SERVICE_PAGES = [
  { slug: "finestres-pvc", priority: "0.9", changefreq: "monthly" },
  { slug: "portes-corredisses", priority: "0.9", changefreq: "monthly" },
  { slug: "persianes", priority: "0.9", changefreq: "monthly" },
  { slug: "mosquiteres", priority: "0.9", changefreq: "monthly" },
];

function buildAlternates(pathWithoutLang: string): string {
  return LANGS.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${DOMAIN}/${lang}${pathWithoutLang}" />`
  ).join("\n");
}

function buildUrlEntry(pathWithoutLang: string, priority: string, changefreq: string): string {
  return LANGS.map(
    (lang) => `  <url>
    <loc>${DOMAIN}/${lang}${pathWithoutLang}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${buildAlternates(pathWithoutLang)}
  </url>`
  ).join("\n");
}

export function registerSeoRoutes(app: Express) {
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      // Fetch published blog posts and zones from DB
      const [publishedPosts, publishedZones] = await Promise.all([
        db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.published, true)),
        db.select({ slug: zones.slug }).from(zones).where(eq(zones.published, true)),
      ]);

      let urls = "";

      // Static pages
      for (const page of STATIC_PAGES) {
        urls += buildUrlEntry(page.path, page.priority, page.changefreq) + "\n";
      }

      // Service pages
      for (const svc of SERVICE_PAGES) {
        urls += buildUrlEntry(`/serveis/${svc.slug}`, svc.priority, svc.changefreq) + "\n";
      }

      // Blog posts
      for (const post of publishedPosts) {
        urls += buildUrlEntry(`/blog/${post.slug}`, "0.7", "weekly") + "\n";
      }

      // Zone pages
      for (const zone of publishedZones) {
        urls += buildUrlEntry(`/zones/${zone.slug}`, "0.8", "monthly") + "\n";
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const txt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${DOMAIN}/sitemap.xml
`;
    res.header("Content-Type", "text/plain");
    res.send(txt);
  });
}
