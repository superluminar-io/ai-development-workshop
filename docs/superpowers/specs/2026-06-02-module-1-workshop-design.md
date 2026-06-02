# Module 1 Workshop Design: Claude Code in the Engineering Loop

**Date:** 2026-06-02  
**Status:** Approved  
**Duration:** ~60 minutes  
**Audience:** Competent TypeScript/AWS backend engineers, new to systematic AI engineering

---

## Overview

Module 1 teaches participants how to use Claude Code as a repo-aware engineering collaborator — not as an unchecked code generator. It does this through three exercises on a realistic TypeScript backend service with intentional imperfections.

The module has two explicit teaching layers:

1. **Claude Code as a configured tool** — `CLAUDE.md`, custom slash commands, constraining Claude's behaviour
2. **AI-assisted engineering loop** — explore, plan, change, test, review, commit

---

## Service Architecture

### Domain: Priority-based ticket routing

A `processTicket` handler accepts raw input, classifies it by priority, and routes it to a named queue. No HTTP server. No runtime Claude dependency. Pure TypeScript handler functions.

### Core Types (starter — intentionally loose)

```typescript
type Ticket = {
  id: string
  subject: string
  body: string
  category: string       // imperfection: should be 'support' | 'billing' | 'incident' | 'security'
  customerId: string
  amount?: number        // present on billing tickets
  createdAt: string      // imperfection: should be Date
}
```

### Routing Rules

| Category  | Condition        | Priority   | Queue              |
|-----------|------------------|------------|--------------------|
| incident  | any              | high       | escalation-queue   |
| security  | any              | escalate   | escalation-queue   |
| billing   | amount > 1000    | **bug: high** → should be escalate | **bug: billing-queue** → should be escalation-queue |
| billing   | amount <= 1000   | medium     | billing-queue      |
| support   | any              | low        | standard-queue     |

### File Structure

```
src/
  domain/
    ticket.ts              # Ticket type, loose typing, Priority as string not union
    classifier.ts          # classifyPriority + routeTicket (mixed concerns)
  handlers/
    processTicket.ts       # mixes input parsing with domain calls
  utils/
    logger.ts              # simple logger, inconsistently used

test/
  domain/
    classifier.test.ts     # passes, missing billing escalation case
  handlers/
    processTicket.test.ts  # happy path only

examples/
  tickets/
    support-ticket.json
    billing-low.json
    billing-high.json      # triggers the bug
    incident.json
```

### package.json Scripts

```json
{
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "process:example": "tsx src/index.ts examples/tickets/billing-high.json"
}
```

### Dependencies

- `zod` — pre-installed, not yet used in starter code (participants add usage in Ex 2)
- `vitest` — test runner
- `tsx` — TypeScript execution for examples
- No HTTP framework, no AWS SDK, no Anthropic SDK

---

## Intentional Imperfections

Eight issues, all organic-looking (no TODO labels). Each maps to a specific exercise.

| # | Issue | Location | Exercise |
|---|-------|----------|----------|
| 1 | `category` typed as `string` not a union | `domain/ticket.ts` | Ex 2 |
| 2 | `priority` accepted as handler input instead of computed | `handlers/processTicket.ts` | Ex 2 |
| 3 | `createdAt` is `string` not `Date` | `domain/ticket.ts` | Ex 2 |
| 4 | Handler mixes input parsing with routing calls — no domain/handler separation | `handlers/processTicket.ts` | Ex 2 |
| 5 | Silent `undefined` return on bad input instead of explicit error | `handlers/processTicket.ts` | Ex 2 |
| 6 | High-value billing tickets (`amount > 1000`) get `'high'` priority instead of `'escalate'` — the real bug | `domain/classifier.ts` | Ex 3 |
| 7 | Tests cover happy paths only; billing escalation case missing | `test/domain/classifier.test.ts` | Ex 3 |
| 8 | `console.log` used directly in some places, `logger` in others | mixed | Ex 2 or Ex 3 |

**Facilitator answer key** (`KNOWN-IMPERFECTIONS.md`) lists all eight with exact file and line references.  
**Participant README** has GitHub-style `<details>/<summary>` spoiler blocks for hints.

---

## Exercise Flow

### Exercise 1 — Codebase Orientation + Claude Code Setup (~18 min)

**Goal:** Participants learn what Claude Code is as a configured tool, and use it to explore an unfamiliar codebase.

**Steps:**
1. Read `.claude/CLAUDE.md` as a group — understand what it is and why it constrains Claude's behaviour
2. Run the pre-built `/explain-codebase` command — Claude maps the service structure and data flow
3. Verify two of Claude's claims directly against the source files (teaches critical verification)
4. Open `.claude/commands/explain-codebase.md` — see that it's a plain prompt file
5. **Write one new command**: participants author `.claude/commands/find-weaknesses.md` — a prompt asking Claude to identify typing gaps, missing validation, and test coverage holes (~10 lines)
6. Run their new command, review the output
7. Produce: short engineering onboarding note + list of suspected issues

**No code changes in this exercise.**

**Teaching points:**
- Claude Code slash commands are just prompt files — you can write, modify, and share them
- `CLAUDE.md` shapes Claude's behaviour for the whole project
- Claude's output must be verified against the actual files, not taken at face value

---

### Exercise 2 — Safe AI-Assisted Refactoring (~22 min)

**Goal:** Participants use Claude Code to improve the service in small, reviewable steps within a disciplined engineering loop.

**Steps:**
1. Run `/propose-change` before touching anything — get a scoped plan, review it
2. Add Zod validation for handler input (Zod pre-installed, zero import needed)
3. Introduce TypeScript unions for `category` and `priority`
4. Separate input parsing from domain logic
5. Run `npm test` after each meaningful change
6. Inspect `git diff` before accepting each change
7. Deny or redirect if Claude proposes too-broad changes

**Deliverables:** improved types, Zod validation, cleaner domain/handler boundary, passing tests, meaningful git diff

**Teaching points:**
- Plan before change: `/propose-change` enforces the habit
- CLAUDE.md constraints are visible and testable — Claude should not rewrite everything
- Git diff is the review boundary, not Claude's summary of what it did
- Small diffs are safer and more reviewable than large rewrites

---

### Exercise 3 — Tests, Review, and PR Preparation (~18 min)

**Goal:** Participants use Claude Code to find a real bug via test generation, then complete a PR-style review cycle.

**Steps:**
1. Run `/generate-tests` — Claude identifies missing edge cases
2. Write the test that catches the billing escalation bug (amount > 1000 → escalation-queue)
3. Run the test, see it fail
4. Fix the bug in `classifier.ts`
5. Run `/review-diff` — PR-style risk review of the full changeset
6. Run `/prepare-pr-summary`
7. Note remaining risks and follow-up tasks

**Deliverables:** billing escalation bug fixed, improved test coverage, PR summary, risk list

**Teaching points:**
- Tests are how you confirm Claude's output is actually correct
- The review cycle is an engineering responsibility, not Claude's
- A PR summary from Claude is a starting point, not a final document

---

## Claude Code Commands

Six commands total. Five pre-built, one written by participants.

| File | Purpose | Pre-built? |
|------|---------|-----------|
| `explain-codebase.md` | Map repo structure and data flow without changes | Yes |
| `propose-change.md` | Produce a scoped implementation plan before any edits | Yes |
| `generate-tests.md` | Identify edge cases and generate tests | Yes |
| `review-diff.md` | Review current git diff for correctness, risk, maintainability | Yes |
| `prepare-pr-summary.md` | Write a concise PR summary from diff and tests | Yes |
| `find-weaknesses.md` | Identify typing gaps, missing validation, test holes | **Participants write this** |

The participant guide provides a skeleton showing command frontmatter and prompt structure so participants know the format. They write the prompt content themselves — not the boilerplate.

All commands model high-quality prompting: ask for evidence from files, avoid broad changes, request plans before implementation, require stated assumptions.

---

## Documentation Structure

```
CLAUDE.md                        # project instructions at repo root (auto-loaded by Claude Code)
.claude/
  commands/
    explain-codebase.md
    propose-change.md
    generate-tests.md
    review-diff.md
    prepare-pr-summary.md
    find-weaknesses.md            # participants write this in Exercise 1

docs/
  module-1/
    README.md                    # module overview + spoiler-tagged hints per imperfection
    participant-guide.md         # step-by-step instructions, checkpoints, troubleshooting
    facilitator-guide.md         # timing, demo notes, common mistakes, debriefs
    KNOWN-IMPERFECTIONS.md       # facilitator answer key — all 8 issues with file + line refs
    exercises/
      exercise-1-orientation.md
      exercise-2-refactoring.md
      exercise-3-tests-and-review.md
```

`KNOWN-IMPERFECTIONS.md` is not linked from any participant-facing document.

---

## CLAUDE.md Content Summary

The project instructions tell Claude to:
- Prefer small, reviewable changes
- Explain the plan and files to be touched before editing
- Preserve existing behaviour unless explicitly asked to change it
- Add or update tests for meaningful code changes
- Use TypeScript strictness and clear domain types
- Prefer explicit error handling over silent fallbacks
- State assumptions when uncertain
- After changes: summarise the diff, tests run, and risks
- Treat git diff as the source of truth for review
- Do not rewrite large parts of the codebase unless explicitly asked

---

## Assumptions

- Participants have Node.js 20+ and Claude Code CLI installed before the workshop
- Workshop environment has internet access for `npm install` (all deps pre-listed, no mid-exercise installs)
- Git is initialised so `git diff` works from the first exercise
- `zod` is in `dependencies` in the starter `package.json`, not yet imported
- No AWS, no Anthropic SDK, no HTTP server in Module 1
- MCP servers are mentioned in the facilitator guide as a Module 2 preview, not configured in Module 1

---

## Out of Scope for Module 1

- MCP server configuration (Module 2)
- AWS CDK / serverless infrastructure (Module 3)
- Runtime Claude API calls in application code
- HTTP server or REST endpoints
- Authentication, database, or external services
