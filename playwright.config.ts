import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  /* The viewport matrix required by the brief. The overflow spec also sets
     these widths itself, so the check cannot be silently reduced to one
     viewport by editing this file. */
  projects: [
    { name: "360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } } },
    { name: "768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "1280", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    {
      name: "1920",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
    },
  ],
  /* Runs against the production build (`next build` + `next start`) rather than
     the dev server: this is the artefact that actually ships, and it avoids the
     Next dev-server single-instance lock. CI builds before running E2E. */
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
