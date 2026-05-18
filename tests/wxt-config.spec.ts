import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vite-plus/test";

import { extensionDescription, extensionName, manifestIconPath } from "../lib/template-metadata";
import config from "../vite.config";
import wxtConfig, { manifest } from "../wxt.config";

describe("wxt config", () => {
  it("keeps vendored agent references out of product checks", async () => {
    const prettierIgnore = await readFile(".prettierignore", "utf8");

    expect(prettierIgnore).toContain(".agents/");
  });

  it("keeps the template minimal while enabling React", () => {
    expect(wxtConfig.modules).toContain("@wxt-dev/module-react");
    expect(manifest.name).toBe(extensionName);
    expect(manifest.description).toBe(extensionDescription);
    expect(manifest.icons).toMatchObject({
      16: manifestIconPath,
      32: manifestIconPath,
      48: manifestIconPath,
      128: manifestIconPath,
    });
    expect("permissions" in manifest).toBe(false);
    expect("host_permissions" in manifest).toBe(false);
  });

  it("defines package zip tasks used by CI", () => {
    expect(config.run?.tasks?.["zip:chrome"]?.command).toBe("wxt zip --browser chrome");
    expect(config.run?.tasks?.["zip:firefox"]).toBeUndefined();
  });

  it("uses a staged command that works with explicit file paths", () => {
    expect(config.staged?.["*"]).toBe("vp fmt");
  });
});
