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

## Code structure

- Domain types: `src/domain/ticket.ts`
- Classification and routing logic: `src/domain/classifier.ts`
- Input parsing and handler: `src/handlers/processTicket.ts`
- Shared utilities: `src/utils/`
- Tests mirror source structure: `test/domain/`, `test/handlers/`

## Skills

Skills are in `.claude/skills/`. At the start of each task, read the skill files in that directory. If a skill's `description` field matches the current situation, follow it as your working approach for that task.

## Example input

To process an example ticket locally:

```
npm run process:example
```

This runs `src/index.ts` against `examples/tickets/billing-high.json`.
