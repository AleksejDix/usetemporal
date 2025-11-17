import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "test-minimal.ts"),
      name: "minimalBundle",
      formats: ["es"],
      fileName: () => "test-minimal.js",
    },
    rollupOptions: {
      external: ["@allystudio/usetemporal/operations"],
    },
    outDir: resolve(__dirname, "dist-minimal"),
  },
});
