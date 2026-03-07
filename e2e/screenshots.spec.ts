import { test, expect } from "@playwright/test";

const PAGES = [
  { name: "home", path: "/ca" },
  { name: "service-windows", path: "/ca/serveis/finestres-pvc" },
  { name: "service-doors", path: "/ca/serveis/portes-corredisses" },
  { name: "service-shutters", path: "/ca/serveis/persianes" },
  { name: "service-mosquito", path: "/ca/serveis/mosquiteres" },
  { name: "calculator", path: "/ca/pressupost" },
  { name: "projects", path: "/ca/projectes" },
  { name: "blog", path: "/ca/blog" },
  { name: "testimonials", path: "/ca/opinions" },
  { name: "contact", path: "/ca/contacte" },
  { name: "cortizo", path: "/ca/cortizo" },
  { name: "subsidies", path: "/ca/subvencions" },
  { name: "process", path: "/ca/proces" },
  { name: "zones", path: "/ca/zones" },
  { name: "legal-privacy", path: "/ca/legal/privacitat" },
];

// ─── Visual screenshots of all pages ───
test.describe("Visual screenshots — all pages", () => {
  for (const page of PAGES) {
    test(`${page.name}`, async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: "networkidle" });
      await p.waitForTimeout(500);
      await p.screenshot({
        path: `e2e/screenshots/${page.name}.png`,
        fullPage: true,
      });
    });
  }
});
