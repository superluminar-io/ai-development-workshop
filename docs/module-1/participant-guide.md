# Module 1 Participant Guide

**Claude Code in the Engineering Loop**

> Complete the **Setup** module before starting here.

---

## Overview

In this module you will use Claude Code to work with a realistic TypeScript backend service that has intentional imperfections. You will not be using Claude as a chatbot. You will be using it as a repo-aware engineering tool — one that reads your files, proposes changes, and operates inside a disciplined review loop.

By the end you will have:
- explored an unfamiliar codebase with Claude
- written a custom slash command
- refactored code with Claude in small, reviewable steps
- found and fixed a real bug through test generation
- produced a PR-style review and summary

---

## How Claude Code slash commands work

Claude Code reads `.claude/commands/` in the project root. Each `.md` file in that directory becomes a slash command. The filename (without `.md`) is the command name.

To run a command:
```
/explain-codebase
/propose-change
/generate-tests
```

These commands are prompt files. Open any of them in `.claude/commands/` to see exactly what Claude is being asked to do.

---

## Exercise 1 — Codebase Orientation (~18 min)

Full instructions: [exercises/exercise-1-orientation.md](exercises/exercise-1-orientation.md)

**Quick summary:**
1. Read `CLAUDE.md` and understand what it constrains
2. Run `/explain-codebase` and verify two of Claude's claims against the source files
3. Open `.claude/commands/explain-codebase.md` — see how commands are structured
4. Write `.claude/commands/find-weaknesses.md` — your own command
5. Run `/find-weaknesses` and produce a list of suspected issues

**Checkpoint after Exercise 1:**
- [ ] I can describe what `processTicket` does in one sentence
- [ ] I have a list of 3–5 suspected improvement areas
- [ ] I have written and run a custom slash command
- [ ] I have not changed any source or test files

---

## Exercise 2 — Safe Refactoring (~22 min)

Full instructions: [exercises/exercise-2-refactoring.md](exercises/exercise-2-refactoring.md)

**Quick summary:**
1. Run `/propose-change` before touching anything
2. Strengthen TypeScript types in `src/domain/ticket.ts`
3. Add Zod validation to `src/handlers/processTicket.ts`
4. Separate parsing from domain logic
5. Run `npm test` after each change
6. Run `git diff` before accepting each change

**Checkpoint after Exercise 2:**
- [ ] `category` is a union type, not `string`
- [ ] `priority` is removed from the `Ticket` input type
- [ ] The handler throws an explicit error instead of returning `undefined`
- [ ] Parsing and domain logic are in separate functions
- [ ] All tests are passing
- [ ] `git log` shows 3 focused commits

---

## Exercise 3 — Tests, Review, and PR Prep (~18 min)

Full instructions: [exercises/exercise-3-tests-and-review.md](exercises/exercise-3-tests-and-review.md)

**Quick summary:**
1. Run `/generate-tests` — find missing edge cases
2. Write and run the test that exposes a real bug
3. Fix the bug
4. Run `/review-diff` — review the full changeset
5. Run `/prepare-pr-summary` — produce a PR summary

**Checkpoint after Exercise 3:**
- [ ] Two new tests added for high-value billing tickets
- [ ] The billing escalation bug is fixed
- [ ] All tests are passing
- [ ] I have a review note and a PR summary
- [ ] I have a list of remaining risks or follow-up tasks

---

## Troubleshooting

**Claude Code is not finding my commands**  
Make sure your command file is in `.claude/commands/` with a `.md` extension. Run `/explain-codebase` (which is pre-built) to confirm commands work, then try your custom command.

**`npm test` fails after a Claude change**  
Do not panic. Read the failure message. If Claude changed a function signature, the tests may need to be updated. Run `git diff` to see exactly what changed.

**Claude is trying to change too many files at once**  
This is expected. Ask it to slow down: "Only change `src/domain/ticket.ts` for now. Nothing else." Reference `CLAUDE.md` — it says to prefer small, reviewable changes.

**`npm run typecheck` shows errors after type changes**  
Good — this is TypeScript catching real issues. Read each error. They tell you exactly what needs to be fixed. Ask Claude to fix them one at a time.

**I cannot find the bug**  
Try running `npm run process:example` and looking at the output. Then read `docs/module-1/README.md` — it shows the routing table the service is supposed to implement. Compare it to what the service actually returns.
