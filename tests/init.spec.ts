import { cp, mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vite-plus/test";

import { initializeProject } from "../scripts/init";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const createInitWorkspace = async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "browser-extension-template-init-"));
  const projectRoot = path.join(tempRoot, "project");

  await mkdir(projectRoot);
  await mkdir(path.join(projectRoot, ".github", "workflows"), { recursive: true });
  await mkdir(path.join(projectRoot, "entrypoints", "popup"), { recursive: true });
  await mkdir(path.join(projectRoot, "lib"), { recursive: true });
  await mkdir(path.join(projectRoot, "scripts"), { recursive: true });
  await mkdir(path.join(projectRoot, "tests"), { recursive: true });

  const filesToCopy = [
    ".github/workflows/ci.yml",
    "AGENTS.md",
    "README.md",
    "entrypoints/background.ts",
    "entrypoints/popup/app.tsx",
    "entrypoints/popup/index.html",
    "lib/template-metadata.ts",
    "lib/template-protocol.ts",
    "package.json",
    "scripts/init.ts",
    "tests/background.spec.ts",
    "tests/template-protocol.spec.ts",
    "tests/wxt-config.spec.ts",
    "wxt.config.ts",
  ];

  await Promise.all(
    filesToCopy.map(async (relativePath) => {
      await cp(path.join(repositoryRoot, relativePath), path.join(projectRoot, relativePath));
    }),
  );

  return {
    projectRoot,
    remove: () => rm(tempRoot, { recursive: true, force: true }),
  };
};

describe("initializeProject", () => {
  it("rewrites AGENTS.md for the initialized project", async () => {
    const workspace = await createInitWorkspace();

    try {
      await initializeProject({
        projectName: "my-awesome-extension",
        projectRoot: workspace.projectRoot,
        format: false,
      });

      const agentsContent = await readFile(path.join(workspace.projectRoot, "AGENTS.md"), "utf8");

      expect(agentsContent).toContain("# My Awesome Extension");
      expect(agentsContent).toContain("lib/my-awesome-extension-metadata.ts");
      expect(agentsContent).toContain("lib/my-awesome-extension-protocol.ts");
      expect(agentsContent).not.toContain("# Browser Extension Template");
      expect(agentsContent).not.toContain("lib/template-protocol.ts");
      expect(agentsContent).not.toContain("テンプレート保守");
    } finally {
      await workspace.remove();
    }
  });
});
