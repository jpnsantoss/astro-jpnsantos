import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sanity from "@sanity/astro";

import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwind(), sanity({
    projectId: "dbowprqv",
    dataset: "production",
    useCdn: false,
    studioBasePath: "/studio",
  }), react()],
});