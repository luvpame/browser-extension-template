# Browser Extension Template

Minimal browser extension template built with WXT, React, pnpm, TypeScript, Vite+, and mise.

## Requirements

- mise
- Node.js 24 and pnpm 10 via `mise install`
- Chrome or Chromium
- Firefox

## Setup

```bash
mise install
vp install
```

This runs `wxt prepare` via `postinstall` and generates the `.wxt/` TypeScript config.

## Initialize with Project Name

Run once after cloning to replace template placeholders with your project name:

```bash
vp run init <project-name>
```

Example: `vp run init my-awesome-extension` updates package name, extension display name, protocol identifiers, rewrites `AGENTS.md`, and renames `lib/template-*.ts` files. Run `vp install` afterward to refresh the lockfile.

## Commands

```bash
vp run dev
vp run dev:chrome
vp run dev:firefox
vp check
vp test
vp run build
vp run zip
```

### GitHub Actions Lint (local)

Static analysis for `.github/workflows/` using actionlint, ghalint, and zizmor:

```bash
vp run lint:gha
```

Install the tools via `mise install`, or install them manually if you prefer:

```bash
mise install
```

## Template Contents

- `background` entrypoint with install logging and popup message handling
- React `popup` entrypoint for verifying popup-to-background messaging
- Minimal manifest config with icons only
- Vite+ test/check workflow with WXT-aware test setup for background and config behavior

## Build Outputs

- Chrome: `.output/chrome-mv3/`
- Firefox: `.output/firefox-mv2/`

## Load Unpacked Extension

### Chrome

1. Open `chrome://extensions/`
2. Enable developer mode
3. Choose "Load unpacked"
4. Select `.output/chrome-mv3/`

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Choose "Load Temporary Add-on"
3. Select any file inside `.output/firefox-mv2/`

## Optional Local Browser Overrides

If WXT cannot find your browser binaries, create an untracked `web-ext.config.ts`:

```ts
import { defineWebExtConfig } from "wxt";

export default defineWebExtConfig({
  binaries: {
    chrome: "/path/to/chrome",
    firefox: "/path/to/firefox",
  },
});
```

This file is ignored by git and is intended for machine-local overrides only.

## Toolchain Notes

- `pnpm` is the package manager for dependency installation and script execution
- Use `vp install`, `vp check`, and `vp test` as the primary Vite+ entrypoints for dependency setup and verification
- Use `vp run <script>` for WXT-specific package scripts such as `dev`, `build`, `zip`, `init`, and `lint:gha`
- WXT remains responsible for browser-extension dev/build/zip commands
- `mise.toml` manages the local toolchain, including Node.js, pnpm, and GitHub Actions lint helpers

## Scope

This template intentionally keeps the initial setup small. Add permissions, options pages, content scripts, storage, or browser-specific behavior only when the actual extension needs them.
