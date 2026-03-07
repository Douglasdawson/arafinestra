import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/ca", expectedH1: true },
  { path: "/ca/serveis/finestres-pvc", expectedH1: true },
  { path: "/ca/serveis/portes-corredisses", expectedH1: true },
  { path: "/ca/pressupost", expectedH1: true },
  { path: "/ca/projectes", expectedH1: true },
  { path: "/ca/blog", expectedH1: true },
  { path: "/ca/opinions", expectedH1: true },
  { path: "/ca/contacte", expectedH1: true },
  { path: "/ca/cortizo", expectedH1: true },
  { path: "/ca/subvencions", expectedH1: true },
  { path: "/ca/proces", expectedH1: true },
  { path: "/ca/zones", expectedH1: true },
];

test.describe("SEO validation", () => {
  for (const page of PAGES) {
    test(`${page.path} has title, meta description, h1`, async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: "networkidle" });

      // Title exists and is not empty
      const title = await p.title();
      expect(title.length).toBeGreaterThan(5);
      expect(title).not.toBe("Vite + React + TS");

      // Meta description exists
      const metaDesc = await p.getAttribute('meta[name="description"]', "content");
      expect(metaDesc).toBeTruthy();
      expect(metaDesc!.length).toBeGreaterThan(20);

      // H1 exists (exactly 1)
      const h1Count = await p.locator("h1").count();
      expect(h1Count).toBe(1);

      // OG tags
      const ogTitle = await p.getAttribute('meta[property="og:title"]', "content");
      expect(ogTitle).toBeTruthy();

      // Canonical link
      const canonical = await p.getAttribute('link[rel="canonical"]', "href");
      expect(canonical).toBeTruthy();
    });
  }

  test("JSON-LD schema exists on home page", async ({ page }) => {
    await page.goto("/ca", { waitUntil: "networkidle" });
    const schemas = await page.locator('script[type="application/ld+json"]').count();
    expect(schemas).toBeGreaterThanOrEqual(1);
  });

  test("hreflang alternates on home page", async ({ page }) => {
    await page.goto("/ca", { waitUntil: "networkidle" });
    const hreflangs = await page.locator('link[rel="alternate"][hreflang]').count();
    expect(hreflangs).toBeGreaterThanOrEqual(2);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const res = await page.goto("/robots.txt");
    expect(res?.status()).toBe(200);
    const text = await page.textContent("body");
    expect(text).toContain("Sitemap");
    expect(text).toContain("Disallow: /admin");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBe(200);
    const text = await page.textContent("body");
    expect(text).toContain("urlset");
  });
});
