import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import sanity from "@sanity/astro";

export default defineConfig({
  integrations: [
    tailwind(),
    // 👇 Update these lines
    sanity({
      projectId: "dbowprqv",
      dataset: "production",
      useCdn: false, // for static builds
    }),
  ],
});
