import { defineConfig } from "@playwright/test";
import navigation from "./playwright.config.js";

export default defineConfig({
  ...navigation,
  testMatch: "cover.spec.js",
  projects: navigation.projects
    .filter(project => ["chromium-desktop", "webkit-desktop", "chromium-touch-390", "webkit-touch-390"].includes(project.name))
    .map(project => ({ ...project, use: { ...project.use, ...(project.name.includes("desktop") ? { deviceScaleFactor: 2 } : {}) } })),
});
