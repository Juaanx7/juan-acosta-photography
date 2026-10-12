import { defineConfig } from "@playwright/test";
import navbarConfig from "./playwright.config.js";

export default defineConfig({ ...navbarConfig, testMatch: "aboutMe.spec.js" });
