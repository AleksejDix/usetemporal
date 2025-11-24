import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: [/^@allystudio\/usetemporal/, "vue"]
    }
  },
  plugins: [
    dts({
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"]
    })
  ],
  test: {
    environment: "node",
    setupFiles: resolve(__dirname, "../../vitest.setup.ts")
  }
});
