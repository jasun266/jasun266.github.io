// Renders the web resume to public/resume.pdf. Start the site first (`npm run dev`),
// then `npm run resume:pdf [url]`.
import { chromium } from "@playwright/test";

async function main() {
  const url = process.argv[2] ?? "http://localhost:3000/resume/";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: "public/resume.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  console.log(`Wrote public/resume.pdf from ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
