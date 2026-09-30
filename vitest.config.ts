import { defineConfig } from "vitest/config";

// Unit tests only; e2e/ belongs to Playwright.
export default defineConfig({
  test: { exclude: ["e2e/**", "node_modules/**"], passWithNoTests: true },
});
