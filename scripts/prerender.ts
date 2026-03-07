/**
 * Prerender script — generates static HTML for each public route.
 * Uses Playwright to render the SPA and capture the full DOM.
 * Run after build: npx tsx scripts/prerender.ts
 *
 * Requires the production server to be running on localhost:5000
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../dist/prerendered");
const BASE = "http://localhost:5000";

// All public routes to prerender
const STATIC_ROUTES = [
  "/ca",
  "/es",
  "/en",
  "/ca/serveis/finestres-pvc",
  "/ca/serveis/portes-corredisses",
  "/ca/serveis/persianes",
  "/ca/serveis/mosquiteres",
  "/es/serveis/finestres-pvc",
  "/es/serveis/portes-corredisses",
  "/es/serveis/persianes",
  "/es/serveis/mosquiteres",
  "/ca/pressupost",
  "/es/pressupost",
  "/en/pressupost",
  "/ca/projectes",
  "/ca/blog",
  "/ca/opinions",
  "/ca/contacte",
  "/ca/cortizo",
  "/ca/subvencions",
  "/ca/proces",
  "/ca/zones",
  "/ca/qui-som",
  "/ca/visita-gratuita",
  "/ca/financament",
  "/ca/legal/privacitat",
  "/ca/legal/termes",
  "/ca/legal/cookies",
  "/es/projectes",
  "/es/blog",
  "/es/opinions",
  "/es/contacte",
  "/es/cortizo",
  "/es/subvencions",
  "/es/proces",
  "/es/zones",
  "/es/qui-som",
  "/es/visita-gratuita",
  "/es/financament",
  "/en/projectes",
  "/en/blog",
  "/en/opinions",
  "/en/contacte",
  "/en/cortizo",
  "/en/subvencions",
  "/en/proces",
  "/en/zones",
  "/en/qui-som",
  "/en/visita-gratuita",
  "/en/financament",
];

async function fetchDynamicRoutes(): Promise<string[]> {
  const routes: string[] = [];
  try {
    // Fetch sitemap to discover dynamic routes (blog posts, zones)
    const res = await fetch(`${BASE}/sitemap.xml`);
    const xml = await res.text();
    const locRegex = /<loc>https:\/\/arafinestra\.com([^<]+)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
      const path = match[1];
      if (!STATIC_ROUTES.includes(path)) {
        routes.push(path);
      }
    }
  } catch (err) {
    console.warn("[prerender] Could not fetch sitemap for dynamic routes:", err);
  }
  return routes;
}

async function prerender() {
  console.log("[prerender] Starting...");

  // Discover dynamic routes from sitemap
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  console.log(`[prerender] ${allRoutes.length} routes to render`);

  // Clean and create output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "AraFinestraPrerender/1.0",
  });

  let success = 0;
  let failed = 0;

  // Process in batches of 5 for speed
  for (let i = 0; i < allRoutes.length; i += 5) {
    const batch = allRoutes.slice(i, i + 5);
    await Promise.all(
      batch.map(async (route) => {
        const page = await context.newPage();
        try {
          await page.goto(`${BASE}${route}`, {
            waitUntil: "networkidle",
            timeout: 15000,
          });

          // Wait for React to render
          await page.waitForSelector("#root > *", { timeout: 10000 });

          // Remove scripts and React state to keep HTML clean for bots
          // but keep the structure
          const html = await page.evaluate(() => {
            // Remove cookie banners, popups for clean SEO HTML
            document.querySelectorAll("[data-noprerender]").forEach((el) => el.remove());
            return "<!DOCTYPE html>" + document.documentElement.outerHTML;
          });

          // Save to file: /ca/blog/my-post -> /ca/blog/my-post.html
          const filePath = path.join(OUTPUT_DIR, `${route}.html`);
          const dir = path.dirname(filePath);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(filePath, html, "utf-8");

          success++;
          console.log(`  [OK] ${route}`);
        } catch (err) {
          failed++;
          console.warn(`  [FAIL] ${route}: ${(err as Error).message?.slice(0, 80)}`);
        } finally {
          await page.close();
        }
      })
    );
  }

  await browser.close();
  console.log(
    `\n[prerender] Done: ${success} OK, ${failed} failed, ${allRoutes.length} total`
  );

  // Write manifest of prerendered routes
  const manifest = allRoutes
    .filter((r) => fs.existsSync(path.join(OUTPUT_DIR, `${r}.html`)))
    .sort();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "_manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`[prerender] Manifest: ${manifest.length} routes saved`);
}

prerender().catch((err) => {
  console.error("[prerender] Fatal error:", err);
  process.exit(1);
});
