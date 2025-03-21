// @ts-check
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    astroTypesafeRoutes({
      astroVersion: 5,
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
