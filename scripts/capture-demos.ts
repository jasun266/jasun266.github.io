// Records a short walkthrough of each live project and encodes it for the site:
// public/media/projects/<slug>/{desktop,mobile}.{webm,mp4,webp}. Needs ffmpeg on PATH.
// `npm run capture [slug...]`. Pages behind a login are recorded as their public
// screen; pass a recording of your own to replace any clip.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium, type Page } from "@playwright/test";
import { projects } from "../lib/data";

const variants = {
  desktop: { width: 1440, height: 900, mobile: false },
  mobile: { width: 390, height: 844, mobile: true },
} as const;
const CLIP_MS = 12_000;

// Human-ish tour: drift the mouse over interactive elements and ease down the page.
async function tour(page: Page, mobile: boolean) {
  const until = Date.now() + CLIP_MS;
  const targets = await page.locator("a:visible, button:visible, input:visible").all();
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let i = 0; Date.now() < until; i++) {
    if (!mobile && targets.length) {
      const box = await targets[i % targets.length].boundingBox().catch(() => null);
      if (box && box.y > 0 && box.y < 900) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
    }
    if (scrollable > 0) await page.mouse.wheel(0, Math.min(260, scrollable / 6));
    await page.waitForTimeout(1100);
  }
}

// Promo/welcome modals: wait for them to appear, then close them.
async function dismissPopups(page: Page) {
  await page.waitForTimeout(2500);
  for (let i = 0; i < 3; i++) {
    const close = page
      .locator('[role=dialog] button, [class*=modal i] button, [class*=popup i] button')
      .filter({ has: page.locator("svg") })
      .or(page.getByRole("button", { name: /close|dismiss|×/i }))
      .first();
    if (!(await close.isVisible().catch(() => false))) break;
    await close.click({ timeout: 2000 }).catch(() => page.keyboard.press("Escape"));
    await page.waitForTimeout(600);
  }
}

async function passChallenge(page: Page) {
  for (let i = 0; i < 20 && /just a moment/i.test(await page.title()); i++) await page.waitForTimeout(1000);
  return !/just a moment/i.test(await page.title());
}

async function record(url: string, variant: keyof typeof variants, dir: string, headless: boolean) {
  const v = variants[variant];
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    isMobile: v.mobile,
    hasTouch: v.mobile,
    recordVideo: { dir, size: { width: v.width, height: v.height } },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const ok = await passChallenge(page);
  if (ok) {
    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
    // Hide cookie/chat widgets that would cover the product.
    await page.addStyleTag({ content: "[id*=cookie i],[class*=cookie i],[id*=chat i],[class*=intercom i],[class*=crisp i]{display:none!important}" });
    await dismissPopups(page);
    await page.waitForTimeout(800);
    await tour(page, v.mobile);
  }
  const video = page.video();
  await context.close();
  await browser.close();
  return ok ? await video?.path() : undefined;
}

function encode(raw: string, out: string, width: number) {
  const ff = (...args: string[]) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
  // Drop the first second (page paint) and keep clips small.
  const scale = `scale=${width}:-2:flags=lanczos,fps=24`;
  ff("-ss", "1", "-i", raw, "-vf", scale, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-an", `${out}.webm`);
  ff("-ss", "1", "-i", raw, "-vf", scale, "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${out}.mp4`);
  ff("-ss", "2", "-i", raw, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-c:v", "libwebp", "-quality", "80", `${out}.webp`);
}

async function main() {
  const only = process.argv.slice(2);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "capture-"));
  for (const p of projects.filter((x) => !only.length || only.includes(x.slug))) {
    const outDir = path.join("public", "media", "projects", p.slug);
    fs.mkdirSync(outDir, { recursive: true });
    for (const variant of ["desktop", "mobile"] as const) {
      // Bot walls often let a visible browser through when headless is blocked.
      let raw = await record(p.demoUrl, variant, tmp, true);
      if (!raw) {
        console.log(`${p.slug}/${variant}: blocked headless, retrying in a visible browser…`);
        raw = await record(p.demoUrl, variant, tmp, false);
      }
      if (!raw) {
        console.warn(`${p.slug}/${variant}: still blocked by a bot check. Record it yourself and drop it in ${outDir}.`);
        continue;
      }
      encode(raw, path.join(outDir, variant), variant === "desktop" ? 1280 : 390);
      const size = (f: string) => `${(fs.statSync(path.join(outDir, f)).size / 1024).toFixed(0)} KB`;
      console.log(`${p.slug}/${variant}: webm ${size(`${variant}.webm`)}, mp4 ${size(`${variant}.mp4`)}`);
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
