import { chromium, devices } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5000";
const OUT = "e2e/screenshots/mobile-audit";
const device = devices["iPhone 14"];

const PAGES = [
  { name: "home", path: "/ca" },
  { name: "service-windows", path: "/ca/serveis/finestres-pvc" },
  { name: "calculator", path: "/ca/pressupost" },
  { name: "contact", path: "/ca/contacte" },
  { name: "cortizo", path: "/ca/cortizo" },
  { name: "process", path: "/ca/proces" },
  { name: "subsidies", path: "/ca/subvencions" },
  { name: "about", path: "/ca/qui-som" },
  { name: "free-visit", path: "/ca/visita-gratuita" },
  { name: "financing", path: "/ca/financament" },
];

async function audit() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...device });

  for (const pg of PAGES) {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500);

      // Scroll to bottom gradually to trigger all ScrollReveal animations
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      for (let y = 0; y < scrollHeight; y += viewportHeight * 0.5) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await page.waitForTimeout(150);
      }
      // Scroll to very bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      // Back to top for full-page screenshot
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      await page.screenshot({ path: `${OUT}/${pg.name}.png`, fullPage: true });
      console.log(`[OK] ${pg.name}`);
    } catch (e) {
      console.log(`[FAIL] ${pg.name}: ${(e as Error).message?.slice(0, 60)}`);
    }
    await page.close();
  }
  await browser.close();
}

audit();
