import { defineConfig } from "vite-plus";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  plugins: [WxtVitest()],
  run: {
    tasks: {
      init: {
        command: "node --experimental-strip-types scripts/init.ts",
      },
      dev: {
        command: "wxt",
      },
      build: {
        command: "wxt build",
      },
      zip: {
        command: "wxt zip",
      },
    },
  },
  test: {
    include: ["tests/**/*.spec.ts"],
    exclude: [".output/**", ".wxt/**"],
  },
});
