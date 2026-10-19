import { defineConfig } from "astro/config";

// Published from the boxi-learn/boxi-learn.github.io repo (tools/publish.sh in peiyuK12).
export default defineConfig({
  site: "https://boxi-learn.github.io",
  trailingSlash: "always",
  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
