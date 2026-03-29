import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const demoRoot = resolve(__dirname, "examples");

export default defineConfig(({ command, mode }) => {
  const isDemo = command === "serve" || mode === "demo";

  if (isDemo) {
    return {
      root: demoRoot,
      plugins: [vue()],
      resolve: {
        alias: {
          "minuta-vue": resolve(__dirname, "src"),
          "minuta-vue/components": resolve(
            __dirname,
            "src/components/index.ts"
          ),
        },
      },
      build: {
        outDir: "dist",
      },
    };
  }

  return {
    build: {
      lib: {
        entry: {
          index: resolve(__dirname, "src/index.ts"),
          components: resolve(__dirname, "src/components/index.ts"),
        },
        formats: ["es"],
        fileName: (_format, entryName) =>
          entryName === "index" ? "index.js" : `${entryName}/index.js`,
      },
      rollupOptions: {
        external: [/^minuta/, "vue"],
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
  };
});
