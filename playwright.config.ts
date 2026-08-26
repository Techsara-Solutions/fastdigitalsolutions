import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against the static export in /out.
 * Run `npm run build` before `npm run test:e2e`.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx serve out -l 4173 --no-clipboard",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
