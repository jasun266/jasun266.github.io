import { defineConfig } from "@playwright/test";

// Browser tests live in e2e/. Reuses a running `npm run dev`, or starts one.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 900 } },
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true },
});
