import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:5000";
const OUT_ROOT = "e2e/screenshots/mobile-audit";

const DEVICES = [
  { name: "iphone-se", width: 375, height: 667, ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", dpr: 2 },
  { name: "galaxy-s8", width: 360, height: 740, ua: "Mozilla/5.0 (Linux; Android 14; SM-G950F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36", dpr: 3 },
  { name: "iphone-14", width: 390, height: 844, ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", dpr: 3 },
  { name: "iphone-14-pro-max", width: 430, height: 932, ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", dpr: 3 },
];

const PAGES = [
  { name: "home", path: "/ca" },
  { name: "pressupost", path: "/ca/pressupost" },
  { name: "contacte", path: "/ca/contacte" },
  { name: "qui-som", path: "/ca/qui-som" },
  { name: "visita-gratuita", path: "/ca/visita-gratuita" },
  { name: "financament", path: "/ca/financament" },
];

interface OverflowResult {
  device: string;
  page: string;
  scrollWidth: number;
  clientWidth: number;
  overflow: number;
}

async function audit() {
  const overflowIssues: OverflowResult[] = [];
  const browser = await chromium.launch();

  for (const device of DEVICES) {
    const outDir = path.join(OUT_ROOT, device.name);
    fs.mkdirSync(outDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      userAgent: device.ua,
      deviceScaleFactor: device.dpr,
      isMobile: true,
      hasTouch: true,
    });

    console.log(`\n=== ${device.name} (${device.width}x${device.height}) ===`);

    for (const pg of PAGES) {
      const page = await context.newPage();
      try {
        await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle", timeout: 20000 });
        await page.waitForTimeout(500);

        // Scroll down gradually to trigger ScrollReveal animations
        const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        for (let y = 0; y < scrollHeight; y += viewportHeight * 0.4) {
          await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
          await page.waitForTimeout(150);
        }
        // Scroll to very bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        // Check horizontal overflow AFTER all content is revealed
        const dims = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        if (dims.scrollWidth > dims.clientWidth) {
          const result: OverflowResult = {
            device: device.name,
            page: pg.name,
            scrollWidth: dims.scrollWidth,
            clientWidth: dims.clientWidth,
            overflow: dims.scrollWidth - dims.clientWidth,
          };
          overflowIssues.push(result);
          console.log(`  [OVERFLOW] ${pg.name}: scrollWidth=${dims.scrollWidth} > clientWidth=${dims.clientWidth} (${result.overflow}px overflow)`);
        }

        // Scroll back to top for full-page screenshot
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);

        await page.screenshot({ path: `${outDir}/${pg.name}.png`, fullPage: true });
        console.log(`  [OK] ${pg.name}`);
      } catch (e) {
        console.log(`  [FAIL] ${pg.name}: ${(e as Error).message?.slice(0, 80)}`);
      }
      await page.close();
    }

    await context.close();
  }

  await browser.close();

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("HORIZONTAL OVERFLOW SUMMARY");
  console.log("=".repeat(60));
  if (overflowIssues.length === 0) {
    console.log("No horizontal overflow detected on any page/device.");
  } else {
    console.log(`Found ${overflowIssues.length} overflow issue(s):\n`);
    for (const issue of overflowIssues) {
      console.log(`  ${issue.device} | ${issue.page}: ${issue.overflow}px overflow (${issue.scrollWidth} vs ${issue.clientWidth})`);
    }
  }
  console.log("\nScreenshots saved to: " + path.resolve(OUT_ROOT));
}

audit().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
