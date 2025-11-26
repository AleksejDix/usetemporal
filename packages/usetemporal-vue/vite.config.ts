import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [/^@allystudio\/usetemporal/, "vue"],
    },
  },
  plugins: [
    vue(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/**/*.test.ts"],
    }),
  ],
  test: {
    environment: "node",
    setupFiles: resolve(__dirname, "../../vitest.setup.ts"),
  },
});
