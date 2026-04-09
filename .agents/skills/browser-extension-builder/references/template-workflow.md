# Template Workflow

## Command Order

Use this order unless the task requires something different:

1. Inspect current repo state and identify whether the template is initialized.
2. If needed, run `vp run init <project-name>`.
3. Read the implementation surfaces touched by the request.
4. Return a short implementation plan.
5. Edit code and tests.
6. Run `vp check`.
7. Run `vp run build`.
8. Run `vp run zip` only for packaging-focused requests.

## Main File Targets

- `entrypoints/popup/app.tsx`
  - Primary UI surface for simple extension interactions.
- `entrypoints/background.ts`
  - Background lifecycle hooks and message handling.
- `lib/*-metadata.ts`
  - Extension name, description, icon path, and related metadata.
- `lib/*-protocol.ts`
  - Shared message types, constructors, validators, and popup/background helpers.
- `wxt.config.ts`
  - Manifest-level changes such as permissions or new extension surfaces.
- `tests/`
  - Behavior and config verification.

## Scope Escalation Rules

Stay within the existing template shape by default:

- Keep popup + background when the request can fit there.
- Add permissions only when an API requires them.
- Add `storage` only when state must persist across popup openings or background restarts.
- Add content scripts only when the feature must read or modify page content.
- Add an options page only when persistent configuration is central to the feature.
- Add browser-specific branches only when the request explicitly requires non-Chrome behavior.

## Template Initialization

Treat the repo as uninitialized when you still see placeholder naming such as:

- package name `browser-extension-template`
- `lib/template-metadata.ts`
- `lib/template-protocol.ts`
- README or AGENTS references to template placeholders

When initialization is needed:

- derive the project name from the current directory basename
- run `vp run init <project-name>`
- continue using the renamed metadata and protocol files after initialization

## Test Guidance

- Prefer updating existing tests before adding broad new ones.
- Add protocol tests when message contracts change.
- Add background tests when handler behavior changes.
- Add config tests when manifest permissions, icons, or entrypoints change.
- Keep tests focused on behavior, not implementation trivia.

## Verification Expectations

- `vp check` is the required reliability gate before reporting completion.
- `vp run build` is required to confirm the extension still builds for Chrome MV3.
- Mention if any command could not be run.
