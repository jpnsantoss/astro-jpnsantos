import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sanity from "@sanity/astro";
import node from '@astrojs/node';
import react from "@astrojs/react";

export default defineConfig({
  output: 'server',
  adapter: node({     
    mode: 'standalone',
  }),
  integrations: [tailwind(), sanity({
    projectId: "dbowprqv",
    dataset: "production",
    useCdn: false,
    studioBasePath: "/studio",
  }), react()],
});