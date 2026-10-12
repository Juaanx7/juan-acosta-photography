import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const externalURL = process.env.NAVBAR_TEST_BASE_URL;
const chromiumChannel = process.env.PLAYWRIGHT_CHROMIUM_CHANNEL;
const mobileProjects = [360, 390, 430].flatMap((width) => [
  { name: `chromium-touch-${width}`, use: { ...devices["Pixel 7"], viewport: { width, height: 800 }, ...(chromiumChannel ? { channel: chromiumChannel } : {}) } },
  { name: `webkit-touch-${width}`, use: { ...devices["iPhone 13"], viewport: { width, height: 800 } } },
]);

export default defineConfig({
  testDir: "./e2e",
  testMatch: "navbar.spec.js",
  outputDir: "../test-results",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "../playwright-report", open: "never" }]],
  use: { baseURL: externalURL || "http://127.0.0.1:5175", trace: "retain-on-failure" },
  projects: [
    ...mobileProjects,
    { name: "chromium-desktop", use: { browserName: "chromium", viewport: { width: 1366, height: 768 }, ...(chromiumChannel ? { channel: chromiumChannel } : {}) } },
    { name: "webkit-desktop", use: { browserName: "webkit", viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: externalURL ? undefined : {
    command: "npm run dev -- --host 127.0.0.1 --port 5175 --strictPort",
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    url: "http://127.0.0.1:5175",
    reuseExistingServer: !process.env.CI,
  },
});
