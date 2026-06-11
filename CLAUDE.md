# Ticket Processor — Project Instructions

These instructions apply whenever Claude Code is working in this repository.
Read them before taking any action.

## Core principles

- Prefer small, reviewable changes. One concern per commit.
- Before editing any file, explain which files you intend to touch and why.
- Preserve existing behaviour unless the task explicitly asks for behaviour changes.
- Add or update tests for every meaningful code change.
- Use TypeScript strictness. Prefer explicit union types over `string` or `any`.
- Prefer explicit error handling. Do not return `undefined` or swallow errors silently.
- When uncertain about intent, state your assumptions before proceeding.
- After changes, summarise: which files changed, which tests were run, what risks remain.
- Treat `git diff` as the source of truth for review — not your summary of what you did.

## What not to do

- Do not rewrite large parts of the codebase unless explicitly instructed.
- Do not add dependencies without asking first.
- Do not introduce abstractions the current task does not require.
- Do not generate code that has not been asked for.
- Do not make multiple unrelated changes in one step.

## Test commands

```
npm test           # run all tests with vitest
npm run typecheck  # TypeScript strict check (tsc --noEmit)
```

Tests must pass before a change is considered complete.
Always run tests after making changes, not before reporting the change as done.

## Creating new modules or workshop content

When adding a new module or any workshop content, always read the latest versions of the following before writing anything:

- `docs/superpowers/specs/2026-06-10-advanced-workshop-tracks-design.md` — authoritative spec for module structure, audience/level fields, and track configuration
- An existing module (e.g. `docs/module-1/`) — use it as the canonical template for folder layout, file naming, and writing style
- `docs-site/src/config.ts` — to understand the current Module type and how to register a new module

Do not infer module structure from memory or earlier sessions. Always read current files first.

When referencing third-party tools, APIs, or frameworks in module content (e.g. Claude Code CLI, GitHub MCP, Anthropic APIs), always fetch the latest official documentation before writing exercises or instructions. Do not rely on training data — versions, flags, and behaviour change. Use the most current documentation available at the time of writing.

## Code structure

- Domain types: `src/domain/ticket.ts`
- Classification and routing logic: `src/domain/classifier.ts`
- Input parsing and handler: `src/handlers/processTicket.ts`
- Shared utilities: `src/utils/`
- Tests mirror source structure: `test/domain/`, `test/handlers/`

## Example input

To process an example ticket locally:

```
npm run process:example
```

This runs `src/index.ts` against `examples/tickets/billing-high.json`.
