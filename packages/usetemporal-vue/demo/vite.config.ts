import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const coreSrc = path.resolve(__dirname, "../..", "usetemporal", "src");

const vuePackageSrc = path.resolve(__dirname, "../src");
const nativeAdapter = path.resolve(coreSrc, "native.ts");

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
  resolve: {
    alias: [
      { find: "@allystudio/usetemporal/native", replacement: nativeAdapter },
      {
        find: "@allystudio/usetemporal/operations",
        replacement: path.resolve(coreSrc, "operations.ts"),
      },
      {
        find: "@allystudio/usetemporal/types",
        replacement: path.resolve(coreSrc, "types.ts"),
      },
      {
        find: "@allystudio/usetemporal",
        replacement: path.resolve(coreSrc, "index.ts"),
      },
      {
        find: "@allystudio/usetemporal-vue",
        replacement: vuePackageSrc,
      },
    ],
  },
  server: {
    port: 4173,
    open: true,
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
