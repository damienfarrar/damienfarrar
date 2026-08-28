import { defineConfig, devices } from "@playwright/test";

// E2E runs against the production build (npm run build first). Deterministic
// by design: no Resend key -> dev-log email stub, no Upstash key -> counters
// hide and rate limiting fails open, GitHub tiles hide on failure.
//
// The webServer env below blanks the third-party creds so the suite is
// hermetic: `next start` checks process.env before .env.local (and stops at
// the first hit), so a real .env.local on a contributor's machine can't drag
// the tests onto the live-integration path. CI has no .env.local, so this is
// belt-and-braces there.
const HERMETIC_ENV = {
  RESEND_API_KEY: "",
  CONTACT_TO_EMAIL: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  GITHUB_TOKEN: "",
};

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
    env: HERMETIC_ENV,
  },
});
