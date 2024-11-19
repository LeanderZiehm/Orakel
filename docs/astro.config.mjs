// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Orakel Docs",
      social: {
        github: "https://github.com/LeanderZiehm/Orakel",
      },
      sidebar: [
        {
          label: "Tutorials",
          autogenerate: { directory: "tutorials" },
        },
        {
          label: "API Reference",
          autogenerate: { directory: "api" },
        },
        {
          label: "Configuration",
          autogenerate: { directory: "configuration" },
        },
      ],
    }),
  ],
});
