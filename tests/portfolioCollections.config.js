import { defineConfig } from "@playwright/test";
import navigation from "./playwright.config.js";

export default defineConfig({
  ...navigation,
  testMatch: "portfolioCollections.spec.js",
  projects: navigation.projects.filter(project => ["chromium-desktop", "webkit-desktop"].includes(project.name)),
});
