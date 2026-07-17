import { defineConfig, devices } from "@playwright/test";

// E2E runs against the production build (npm run build first). Deterministic
// by design: no Resend key -> dev-log email stub, no Upstash key -> counters
// hide and rate limiting fails open, GitHub tiles hide on failure.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3200",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx next start -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
