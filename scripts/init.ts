#!/usr/bin/env node
/**
 * Initialize the template with a project name.
 * Usage: vp run init <project-name>
 *
 * Replaces template placeholders and renames template-* files.
 * Run only once on a fresh template clone.
 */

import { access, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const TEMPLATE_PACKAGE_NAME = "browser-extension-template";
const TEMPLATE_DISPLAY_NAME = "Browser Extension Template";
const TEMPLATE_PREFIX = "template";
const TEMPLATE_PROTOCOL_PREFIX = "template";

const toKebabCase = (value: string): string =>
  value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "extension";

const toDisplayName = (value: string): string =>
  toKebabCase(value)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toCamelCase = (value: string): string => {
  const parts = toKebabCase(value).split("-");

  return (
    parts[0] +
    parts
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  );
};

const toPascalCase = (value: string): string => {
  const camel = toCamelCase(value);

  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const replaceAll = (content: string, replacements: [string, string][]): string => {
  let result = content;

  for (const [from, to] of replacements) {
    result = result.split(from).join(to);
  }

  return result;
};

const ensureExists = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
};

const readText = (filePath: string): Promise<string> => readFile(filePath, "utf8");

const writeText = (filePath: string, content: string): Promise<void> =>
  writeFile(filePath, content, "utf8");

const run = (command: string, args: string[], cwd: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code ?? "unknown"}.`));
    });
  });

const resolveProjectRoot = () => path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const initializeProject = async ({
  projectName,
  projectRoot = resolveProjectRoot(),
  format = true,
}: {
  projectName: string;
  projectRoot?: string;
  format?: boolean;
}): Promise<void> => {
  const packageName = toKebabCase(projectName);
  const displayName = toDisplayName(projectName);
  const camelPrefix = toCamelCase(projectName);
  const pascalPrefix = toPascalCase(projectName);
  const protocolPrefix = packageName;

  const replacements: [string, string][] = [
    [TEMPLATE_PACKAGE_NAME, packageName],
    [TEMPLATE_DISPLAY_NAME, displayName],
    [`${TEMPLATE_PROTOCOL_PREFIX}:ping`, `${protocolPrefix}:ping`],
    [`${TEMPLATE_PROTOCOL_PREFIX}:pong`, `${protocolPrefix}:pong`],
    [`${TEMPLATE_PREFIX}PingType`, `${camelPrefix}PingType`],
    [`${TEMPLATE_PREFIX}PongType`, `${camelPrefix}PongType`],
    ["TemplatePingMessage", `${pascalPrefix}PingMessage`],
    ["TemplatePongMessage", `${pascalPrefix}PongMessage`],
  ];

  const templateMetadataPath = path.join(projectRoot, "lib/template-metadata.ts");
  const templateProtocolPath = path.join(projectRoot, "lib/template-protocol.ts");
  const newMetadataPath = path.join(projectRoot, `lib/${packageName}-metadata.ts`);
  const newProtocolPath = path.join(projectRoot, `lib/${packageName}-protocol.ts`);

  const importReplacements: [string, string][] = [
    ["template-metadata", `${packageName}-metadata`],
    ["template-protocol", `${packageName}-protocol`],
  ];

  const filesToUpdate = [
    path.join(projectRoot, "package.json"),
    path.join(projectRoot, "README.md"),
    path.join(projectRoot, "AGENTS.md"),
    path.join(projectRoot, "entrypoints/popup/index.html"),
    path.join(projectRoot, ".github/workflows/ci.yml"),
    path.join(projectRoot, "wxt.config.ts"),
    path.join(projectRoot, "entrypoints/background.ts"),
    path.join(projectRoot, "entrypoints/popup/app.tsx"),
    path.join(projectRoot, "tests/background.spec.ts"),
    path.join(projectRoot, "tests/wxt-config.spec.ts"),
  ];

  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = await readText(packageJsonPath);
  if (!packageJson.includes(TEMPLATE_PACKAGE_NAME)) {
    throw new Error("This project does not appear to be the template. Aborting.");
  }

  for (const filePath of filesToUpdate) {
    await ensureExists(filePath);
    let content = await readText(filePath);
    content = replaceAll(content, replacements);
    content = replaceAll(content, importReplacements);
    await writeText(filePath, content);
  }

  const metadataContent = await readText(templateMetadataPath);
  const protocolContent = await readText(templateProtocolPath);

  await writeText(newMetadataPath, replaceAll(metadataContent, replacements));
  await writeText(newProtocolPath, replaceAll(protocolContent, replacements));

  const renamedProtocolSpecPath = path.join(projectRoot, `tests/${packageName}-protocol.spec.ts`);
  const protocolSpecContent = await readText(
    path.join(projectRoot, "tests/template-protocol.spec.ts"),
  );
  await writeText(
    renamedProtocolSpecPath,
    replaceAll(replaceAll(protocolSpecContent, replacements), importReplacements),
  );

  await rm(templateMetadataPath, { force: true });
  await rm(templateProtocolPath, { force: true });
  await rm(path.join(projectRoot, "tests/template-protocol.spec.ts"), { force: true });

  if (format) {
    await run("pnpm", ["run", "format"], projectRoot);
  }

  console.log(`Initialized project: ${displayName} (${packageName})`);
  console.log(
    "Run `vp install` to refresh the lockfile, then `vp check`, `vp test`, and `vp run build` to verify.",
  );
};

const main = async () => {
  const projectName = process.argv.at(2);
  if (!projectName) {
    console.error("Usage: vp run init <project-name>");
    console.error("Example: vp run init my-awesome-extension");
    process.exit(1);
  }

  await initializeProject({ projectName });
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
