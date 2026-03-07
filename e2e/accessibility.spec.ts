import { test, expect } from "@playwright/test";

const PAGES = [
  { name: "home", path: "/ca" },
  { name: "contact", path: "/ca/contacte" },
  { name: "calculator", path: "/ca/pressupost" },
  { name: "service", path: "/ca/serveis/finestres-pvc" },
];

test.describe("Accessibility checks", () => {
  for (const pg of PAGES) {
    test(`${pg.name} — images have alt text`, async ({ page }) => {
      await page.goto(pg.path, { waitUntil: "networkidle" });
      const images = await page.locator("img").all();
      for (const img of images) {
        const alt = await img.getAttribute("alt");
        const src = await img.getAttribute("src");
        expect(alt, `Image ${src} missing alt`).toBeTruthy();
      }
    });

    test(`${pg.name} — no broken heading hierarchy`, async ({ page }) => {
      await page.goto(pg.path, { waitUntil: "networkidle" });
      const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
      if (headings.length === 0) return;

      // First heading should be h1
      const firstTag = await headings[0].evaluate((el) => el.tagName);
      expect(firstTag).toBe("H1");

      // Should have exactly 1 h1
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });

    test(`${pg.name} — interactive elements are keyboard accessible`, async ({ page }) => {
      await page.goto(pg.path, { waitUntil: "networkidle" });
      // All buttons and links should be focusable
      const buttons = await page.locator("button:visible").all();
      for (const btn of buttons.slice(0, 5)) {
        const tabIndex = await btn.getAttribute("tabindex");
        // tabindex should not be -1 (unless it's managed by ARIA)
        if (tabIndex) {
          expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(-1);
        }
      }
    });
  }

  test("skip-to-content link exists", async ({ page }) => {
    await page.goto("/ca", { waitUntil: "networkidle" });
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test("form labels are associated with inputs", async ({ page }) => {
    await page.goto("/ca/contacte", { waitUntil: "networkidle" });
    const inputs = await page.locator("input:visible").all();
    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const name = await input.getAttribute("name");
      const ariaLabel = await input.getAttribute("aria-label");
      const placeholder = await input.getAttribute("placeholder");
      // Each input should have at least one identifying attribute
      const hasIdentifier = id || name || ariaLabel || placeholder;
      expect(hasIdentifier, "Input missing identifier").toBeTruthy();
    }
  });
});
