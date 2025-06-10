/// <reference types="vitest" />
import { defineConfig } from "vite"

import angular from "@analogjs/vite-plugin-angular"
import path from "path"
import viteTsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => ({
  plugins: [angular(), viteTsconfigPaths()],
  resolve: {
    alias: {
      ...(mode === "test"
        ? {
            "src/app/composition/environments/environment.ts": path.resolve(
              __dirname,
              "src/app/composition/environments/environment.testing.ts",
            ),
          }
        : {}),
    },
  },
  test: {
    globals: true,
    setupFiles: ["src/test-setup.ts"],
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
  },
  define: {
    "import.meta.vitest": mode !== "production",
  },
}))
