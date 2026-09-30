import { expect, test } from "@playwright/test";

test("reloading mid-scroll starts at the top without the page jumping", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.reload();
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const shift = await page.evaluate(
    () =>
      new Promise<number>((done) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number })[]) total += e.value;
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => done(total), 300);
      }),
  );
  expect(shift).toBeLessThan(0.1);
});

test("a hash link lands on its section on first load", async ({ page }) => {
  await page.goto("/#contact");
  await expect.poll(() => page.evaluate(() => Math.round(document.getElementById("contact")!.getBoundingClientRect().top))).toBe(80);
});

test("scrolling types the profile out in the editor", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("[data-hero=console] pre");
  await expect(editor).toContainText("role:"); // intro typed, startup scroll done
  await expect(editor).not.toContainText("ship()");
  await page.evaluate(() => window.scrollTo(0, innerHeight));
  await expect(editor).toContainText("jasun.ship();");
});

test("the bug game starts from the Play button, scores and ends", async ({ page }) => {
  // Reduced motion skips the WebGL scene, so fast-forwarding the clock stays cheap.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "Play" }).click();
  const bug = page.getByRole("button", { name: "Squash bug" }).first();
  await expect(bug).toBeVisible();
  await bug.dispatchEvent("pointerdown");
  await expect(page.locator("[data-hero=console]")).toContainText("1");
  await page.clock.runFor(21_000);
  await expect(page.locator("[data-hero=console]")).toContainText("You squashed 1 bug.");
  await expect(page.getByRole("button", { name: /Play/ })).toContainText("1"); // best score
});
