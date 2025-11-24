import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

const coreRoot = resolve(__dirname, "../usetemporal/src");
const alias = {
  "@allystudio/usetemporal": resolve(coreRoot, "index.ts"),
  "@allystudio/usetemporal/native": resolve(coreRoot, "native.ts"),
  "@allystudio/usetemporal/types": resolve(coreRoot, "types.ts"),
  "@allystudio/usetemporal/temporal": resolve(coreRoot, "temporal.ts"),
  "@allystudio/usetemporal/operations": resolve(coreRoot, "operations.ts"),
};

export default defineConfig({
  ...viteConfig,
  resolve: {
    ...(viteConfig.resolve ?? {}),
    alias: {
      ...(viteConfig.resolve?.alias ?? {}),
      ...alias,
    },
  },
  test: {
    ...viteConfig.test,
    globals: false,
    include: ["src/**/*.test.ts"],
  },
});
