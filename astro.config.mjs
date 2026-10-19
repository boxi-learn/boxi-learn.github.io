import { defineConfig } from "astro/config";

// Published to GitHub Pages from boxi-learn/boxi-learn.github.io.
export default defineConfig({
  site: "https://boxi-learn.github.io",
  trailingSlash: "always",
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
