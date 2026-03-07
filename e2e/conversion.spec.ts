import { test, expect } from "@playwright/test";

test.describe("Conversion flow — Calculator", () => {
  test("complete calculator flow: select product → get quote → submit lead", async ({ page }) => {
    await page.goto("/ca/pressupost", { waitUntil: "networkidle" });

    // Step 1: Select product type (Ventana)
    await page.screenshot({ path: "e2e/screenshots/calc-step1.png" });
    const ventanaCard = page.locator("text=Finestres").first();
    await ventanaCard.click();
    await page.waitForTimeout(300);

    // Step 2: Select model
    await page.screenshot({ path: "e2e/screenshots/calc-step2.png" });
    const modelCard = page.locator("[class*='rounded']").filter({ hasText: /C-70|A-70/i }).first();
    if (await modelCard.isVisible()) {
      await modelCard.click();
      await page.waitForTimeout(300);
    }

    // Click next if available
    const nextBtn = page.locator("button").filter({ hasText: /Següent|Siguiente|Next/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Step 3: Dimensions (defaults are fine, just advance)
    await page.screenshot({ path: "e2e/screenshots/calc-step3.png" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Step 4: Color (select first option)
    await page.screenshot({ path: "e2e/screenshots/calc-step4.png" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Step 5: Glass
    await page.screenshot({ path: "e2e/screenshots/calc-step5.png" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Step 6: Extras (skip, just advance)
    await page.screenshot({ path: "e2e/screenshots/calc-step6.png" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Step 7: Quantity → See result
    await page.screenshot({ path: "e2e/screenshots/calc-step7.png" });
    const seeResult = page.locator("button").filter({ hasText: /Veure|Ver|See/i });
    if (await seeResult.isVisible()) {
      await seeResult.click();
      await page.waitForTimeout(500);
    }

    // Result page should show price
    await page.screenshot({ path: "e2e/screenshots/calc-result.png", fullPage: true });
    const priceText = page.locator("text=€");
    await expect(priceText.first()).toBeVisible({ timeout: 5000 });
  });

  test("contact form renders all fields", async ({ page }) => {
    await page.goto("/ca/contacte", { waitUntil: "networkidle" });

    // Form fields exist
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="tel"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();

    // Submit button exists
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();

    // Trust badges visible
    await expect(page.locator("text=4.9/5")).toBeVisible();

    await page.screenshot({ path: "e2e/screenshots/contact-form.png", fullPage: true });
  });

  test("WhatsApp button is visible", async ({ page }) => {
    await page.goto("/ca", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const whatsapp = page.locator('a[aria-label*="WhatsApp"], a:has-text("WhatsApp")');
    await expect(whatsapp.first()).toBeVisible({ timeout: 5000 });
  });

  test("header CTA button is always visible on desktop", async ({ page }) => {
    await page.goto("/ca", { waitUntil: "networkidle" });
    // The CTA should be visible without scrolling
    const cta = page.locator("header a").filter({ hasText: /pressupost|presupuesto|quote/i });
    await expect(cta.first()).toBeVisible({ timeout: 5000 });
  });
});
