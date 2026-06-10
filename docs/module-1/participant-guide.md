# Module 1 Participant Guide

**Claude Code in the Engineering Loop**

> Complete the **Setup** module before starting here.

---

## The scenario

It's your first week at a new company. You've been handed a codebase that processes support tickets and told there's a bug affecting billing customers — no handover, no context, just the repo and a vague description of the problem. Your task is to understand the code quickly, improve what you find, and ship a clean change without breaking anything.

---

## Exercise 1 — Codebase Orientation (~18 min)

Explore the service with Claude, understand how slash commands work, and write your first custom command.

> **In the scenario:** This is day one. Before you touch anything, you need a map. `/explain-codebase` gives you one in minutes. Writing your own `/find-weaknesses` command is your first act of initiative — you've been told there's a billing bug, so you're actively looking for where things go wrong before anyone asks you to.

---

## Exercise 2 — Writing a Skill (~15 min)

Write a skill that Claude recognises and applies automatically when the situation matches its description.

> **In the scenario:** You're about to start making changes to code you've never worked in before. Before you touch anything, you write down the careful approach you want Claude to follow whenever it modifies unfamiliar code — so you don't have to repeat yourself every time you ask for a change.

---

## Exercise 3 — Safe Refactoring (~22 min)

Improve the starter code in small steps — stronger types, Zod validation, cleaner separation — with Claude proposing and you reviewing.

> **In the scenario:** You've found issues in a codebase you don't fully understand yet. The `/propose-change` command forces a written plan before any code moves, and your skill ensures Claude holds the right caution throughout.

---

## Exercise 4 — Tests, Review, and PR Prep (~18 min)

Use Claude to find missing test coverage, expose and fix a real bug, then produce a review and PR summary.

> **In the scenario:** You've made changes to a codebase you've owned for less than a week. Your first PR at the new company needs to show that the work is sound. `/generate-tests` closes coverage gaps before your reviewer finds them. `/prepare-pr-summary` means your PR description explains the *why*, not just the *what*.

---

## Troubleshooting

**Claude Code is not finding my commands**  
Make sure your command file is in `.claude/commands/` with a `.md` extension. Run `/explain-codebase` (which is pre-built) to confirm commands work, then try your custom command.

**My skill isn't triggering automatically**  
Check that you added the `## Skills` section to `CLAUDE.md`. Then re-read your skill's `description` — is it specific enough to match the task you're describing? Try starting a fresh session after editing.

**`npm test` fails after a Claude change**  
Do not panic. Read the failure message. If Claude changed a function signature, the tests may need to be updated. Run `git diff` to see exactly what changed.

**Claude is trying to change too many files at once**  
This is expected. Ask it to slow down: "Only change `src/domain/ticket.ts` for now. Nothing else." Reference `CLAUDE.md` — it says to prefer small, reviewable changes.

**`npm run typecheck` shows errors after type changes**  
Good — this is TypeScript catching real issues. Read each error. They tell you exactly what needs to be fixed. Ask Claude to fix them one at a time.

**I cannot find the bug**  
Try running `npm run process:example` and looking at the output. Then read `docs/module-1/README.md` — it shows the routing table the service is supposed to implement. Compare it to what the service actually returns.
