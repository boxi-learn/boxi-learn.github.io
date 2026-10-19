import { defineConfig } from "astro/config";

// `site` is a placeholder until the publishing location is decided (design/k12-subjects.md §6).
export default defineConfig({
  site: "https://example.invalid",
  trailingSlash: "always",
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
