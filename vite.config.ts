import { defineConfig } from "vite-plus";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  staged: {
    "*": "vp fmt",
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
      "zip:chrome": {
        command: "wxt zip --browser chrome",
      },
    },
  },
  test: {
    include: ["tests/**/*.spec.ts"],
    exclude: [".output/**", ".wxt/**"],
  },
});
