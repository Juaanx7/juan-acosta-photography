import { defineConfig } from "@playwright/test";
import navbarConfig from "./playwright.config.js";

export default defineConfig({ ...navbarConfig, testMatch: "preservedFlows.spec.js", projects: navbarConfig.projects.filter(project => ["chromium-touch-390", "webkit-touch-390", "chromium-desktop", "webkit-desktop"].includes(project.name)) });
