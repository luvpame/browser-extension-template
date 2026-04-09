---
name: browser-extension-builder
description: Build and verify a browser extension in this WXT, React, pnpm, TypeScript template repository from a freeform requirements prompt. Use when Codex needs to turn a fresh or partially initialized clone of this template into a working Chrome MV3 extension, including repo inspection, template initialization, implementation planning, code changes, tests, and verification with `vp check` and `vp run build`.
---

# Browser Extension Builder

## Overview

Implement a browser extension in this repository from a text description.

Treat the user prompt as the product spec, but always inspect the repo state first and return a short implementation plan before editing files.

## Workflow

1. Inspect the repository before making assumptions.

- Read `AGENTS.md`, `README.md`, `package.json`, `wxt.config.ts`, and the relevant entrypoints and tests.
- Confirm the current scope stays minimal unless the user explicitly asks for more.

2. Detect whether the repository is still the raw template clone.

- If files still use template placeholders such as `browser-extension-template`, `template-metadata`, or `template-protocol`, initialize the repo first.
- Derive the project name from the current directory basename.
- Run `vp run init <project-name>` once.
- If the basename is clearly unusable as a package name, ask the user for the project name.

3. Produce a short plan before mutating files.

- Summarize the requested behavior.
- State which extension surfaces are needed, such as popup, background, permissions, content scripts, or options.
- Keep the plan implementation-oriented and brief.

4. Implement the smallest viable solution.

- Prefer extending the existing popup and background flow before adding new entrypoints.
- Add permissions, content scripts, storage, options pages, alarms, or browser-specific branches only when the request requires them.
- Keep metadata and protocol definitions centralized.

5. Update tests with the implementation.

- Add or update focused `.spec.ts` or `.spec.tsx` tests.
- Import test APIs explicitly from `vite-plus/test`.

6. Verify the result.

- Run `vp check`.
- Run `vp run build`.
- Run `vp run zip` only when the user explicitly asks for packaging or distribution verification.

## Editing Rules

- Keep extension metadata in `lib/*-metadata.ts`.
- Keep popup/background message contracts in `lib/*-protocol.ts`.
- Do not spread raw message type strings across call sites.
- Prefer arrow functions in normal code.
- Preserve the template's minimal manifest unless the requested feature needs more.
- When changing template-derived naming, update code, README, and tests consistently.

## Implementation Heuristics

- Start from existing files instead of creating new architecture by default.
- Use the popup for simple UI-driven features.
- Use the background for lifecycle hooks, cross-context coordination, and browser APIs.
- If the feature needs shared types or helpers, place them in `lib/`.
- If a requested feature is underspecified but a reasonable default is low-risk, choose the default and state it in the plan.

## Resources

- Read [references/template-workflow.md](references/template-workflow.md) for concrete file targets, command choices, and escalation rules for feature scope.
- Use the local `wxt` skill only when framework documentation is needed beyond what the repository already shows.
