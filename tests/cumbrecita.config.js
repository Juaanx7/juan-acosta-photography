import { defineConfig } from "@playwright/test";
import navbarConfig from "./playwright.config.js";

export default defineConfig({
  ...navbarConfig,
  testMatch: "cumbrecita.spec.js",
  projects: navbarConfig.projects.filter(project => ["chromium-touch-390", "webkit-touch-390", "chromium-desktop", "webkit-desktop"].includes(project.name))
    .map(project => ({ ...project, use: { ...project.use, ...(project.name.includes("desktop") ? { deviceScaleFactor: 2 } : {}) } })),
});
