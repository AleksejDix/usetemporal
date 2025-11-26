import { resolve } from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@allystudio/usetemporal-svelte": resolve(
        __dirname,
        "../../packages/usetemporal-svelte/src"
      ),
    },
  },
  server: {
    port: 4174,
  },
});
