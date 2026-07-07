import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";

const DOMAIN = "https://arafinestra.com";

// Mantener sincronizado con STATIC_PATHS de server/routes/sitemap.ts
const STATIC_PATHS = [
  "",
  "cortizo",
  "subvencions",
  "pressupost",
  "preus",
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
  "legal/privacitat",
  "legal/termes",
  "legal/cookies",
  "legal/avis-legal",
];

interface PageAudit {
  path: string;
  url: string;
  title: boolean;
  description: boolean;
  h1: boolean;
  canonical: boolean;
  schema: boolean;
  score: number;
  status: number;
  error: boolean;
}

async function auditPage(path: string): Promise<PageAudit> {
  const url = `/ca/${path}`;
  const fullUrl = `${DOMAIN}${url}`;
  const empty = { path, url, title: false, description: false, h1: false, canonical: false, schema: false, score: 0 };
  try {
    const res = await fetch(fullUrl, { signal: AbortSignal.timeout(10_000) });
    // Página inaccesible (4xx/5xx): no tiene sentido escanear el HTML de error
    if (!res.ok) {
      return { ...empty, status: res.status, error: true };
    }
    const html = await res.text();

    const title = /<title[\s>]/i.test(html);
    const description = /meta\s[^>]*name=["']description["']/i.test(html);
    const h1 = /<h1[\s>]/i.test(html);
    const canonical = /rel=["']canonical["']/i.test(html);
    const schema = /application\/ld\+json/i.test(html);

    const score = [title, description, h1, canonical, schema].filter(Boolean).length;

    return { path, url, title, description, h1, canonical, schema, score, status: res.status, error: false };
  } catch {
    return { ...empty, status: 0, error: true };
  }
}

export function registerSeoAuditRoutes(app: Express) {
  app.post("/api/seo/audit", requireAuth, async (_req, res) => {
    try {
      const pages = await Promise.all(STATIC_PATHS.map(auditPage));
      const total = pages.length;
      const avgScore = Math.round(
        (pages.reduce((sum, p) => sum + p.score, 0) / total) * 2 * 10
      ) / 10;

      res.json({ pages, summary: { total, avgScore } });
    } catch (err) {
      console.error("SEO audit error:", err);
      res.status(500).json({ error: "Error running SEO audit" });
    }
  });
}
