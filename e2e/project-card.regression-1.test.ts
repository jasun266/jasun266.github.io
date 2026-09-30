// Regression: ISSUE-001 — labelled "View" cursor covered the project title being hovered
// Found by /qa on 2026-09-30
// Report: .gstack/qa-reports/qa-report-localhost-2026-09-30.md
import { expect, test } from "@playwright/test";

test("the labelled cursor appears over media, never over text you point at", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.getElementById("work")!.offsetTop + 60));
  const card = page.locator("#work article").first();
  // The custom cursor's label pill (aria-hidden, so match its text directly).
  const label = (text: string) => page.getByText(text, { exact: true });

  await card.locator("h3 a").hover();
  await expect(label("View")).toHaveCount(0);

  await card.locator("[data-parallax]").hover();
  await expect(label("View")).toBeVisible();

  await page.goto("/#contact");
  await page.getByText("jasun266@gmail.com", { exact: true }).first().hover();
  await expect(label("Copy")).toHaveCount(0);
});
