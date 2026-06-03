# Module 1 Participant Guide

**Claude Code in the Engineering Loop**

> Complete the **Setup** module before starting here.

---

## The scenario

It's your first week at a new company. You've been handed a codebase that processes support tickets and told there's a bug affecting billing customers — no handover, no context, just the repo and a vague description of the problem. Your task is to understand the code quickly, improve what you find, and ship a clean change without breaking anything.

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

A slash command is a prompt file stored in `.claude/commands/`. Each `.md` file in that directory becomes a command — the filename (without `.md`) is the command name. Running `/explain-codebase` is equivalent to pasting the contents of `.claude/commands/explain-codebase.md` into Claude, but repeatable and consistent every time.

```
/explain-codebase      # understand the codebase structure
/propose-change        # plan a change before touching any files
/generate-tests        # find missing test coverage
/review-diff           # review everything you've changed
/prepare-pr-summary    # produce a PR description
```

**When to use them:** Whenever you find yourself typing the same instructions to Claude more than once — "read these files, don't edit anything, give me X" — that's a command waiting to be written. Commands also make workflows shareable: anyone on the team who clones the repo gets the same starting point.

**Scope:** Commands in `.claude/commands/` are project-level — they're checked into the repo and apply to everyone who works in it. You can also have personal commands in `~/.claude/commands/` that follow you across all projects. Project commands take precedence when there's a name collision.

**They're just markdown:** Open any command file in your editor. There's no special syntax. The prompt is exactly what Claude reads — you can read it, edit it, and understand precisely what you're asking Claude to do. This transparency is intentional. You should never run a command you haven't read.

---

## Exercise 1 — Codebase Orientation (~18 min)

Full instructions: [exercises/exercise-1-orientation.md](exercises/exercise-1-orientation.md)

**Quick summary:**
1. Read `CLAUDE.md` and understand what it constrains
2. Run `/explain-codebase` and verify two of Claude's claims against the source files
3. Open `.claude/commands/explain-codebase.md` — see how commands are structured
4. Write `.claude/commands/find-weaknesses.md` — your own command
5. Run `/find-weaknesses` and produce a list of suspected issues

> **In the scenario:** This is day one. Before you touch anything, you need a map. `/explain-codebase` gives you one in minutes. Writing your own `/find-weaknesses` command is your first act of initiative — you've been told there's a billing bug, so you're actively looking for where things go wrong before anyone asks you to.

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

> **In the scenario:** You've found issues in a codebase you don't fully understand yet. The `/propose-change` command forces a written plan before any code moves — exactly the discipline you want when working in unfamiliar territory with a production service. Running `npm test` and `git diff` after each step means you stay in control even if Claude surprises you.

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

> **In the scenario:** You've made changes to a codebase you've owned for less than a week. Your first PR at the new company needs to show that the work is sound — not just that it runs. `/generate-tests` closes coverage gaps before your reviewer finds them. `/prepare-pr-summary` means your PR description explains the *why*, not just the *what*, so your new colleagues can review it properly.

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
