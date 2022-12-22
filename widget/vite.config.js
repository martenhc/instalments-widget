import { defineConfig } from "vite";
import { resolve as pathResolve } from "path";
import { summary } from "rollup-plugin-summary";
import del from "rollup-plugin-delete";
import resolve from "@rollup/plugin-node-resolve";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ command }) => {
  const vitePlugins = [tsconfigPaths(), viteCompression()];

  const rollupOptions = {
    plugins: [del({ targets: "build/*" }), resolve(), summary()],
  };

  if (command === "build") {
    return {
      plugins: vitePlugins,
      envPrefix: "VAR_",
      publicDir: false,
      build: {
        rollupOptions,
        lib: {
          entry: pathResolve("./main.js"),
          name: "PaymetsWidget",
          fileName: "payments-widget",
        },
        outDir: "build",
      },
    };
  } else if (command === "serve") {
    return {
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
      },
      plugins: vitePlugins,
      envPrefix: "VAR_",
      build: {
        outDir: "build",
      },
    };
  }
});
