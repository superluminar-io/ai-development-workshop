# Module 1 Workshop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, workshop-ready Module 1 — a realistic (intentionally imperfect) TypeScript ticket routing service, Claude Code project configuration, and all participant and facilitator documentation.

**Architecture:** Three phases. Phase 1: TypeScript starter service with 8 intentional imperfections (all tests pass; the billing escalation bug is invisible without the missing test). Phase 2: Claude Code configuration — `CLAUDE.md` project instructions and 5 pre-built slash commands. Phase 3: Workshop documentation — participant guide, facilitator guide, exercise files, and facilitator answer key.

**Tech Stack:** TypeScript 5.x, Vitest 2.x, tsx 4.x, Zod 3.x (pre-installed, unused in starter), Node 20+

---

## File Map

```
# Phase 1 — TypeScript Starter Service
package.json
tsconfig.json
vitest.config.ts
.gitignore
src/domain/ticket.ts                        ← loose types (imperfections 1, 2, 3)
src/domain/classifier.ts                    ← billing escalation bug (imperfection 6)
src/utils/logger.ts                         ← inconsistently used (imperfection 8)
src/handlers/processTicket.ts               ← mixed concerns, silent error (imperfections 4, 5)
src/index.ts                                ← entry point for npm run process:example
examples/tickets/support-ticket.json
examples/tickets/billing-low.json
examples/tickets/billing-high.json          ← triggers the bug
examples/tickets/incident.json
test/domain/classifier.test.ts              ← passes; missing billing escalation case (imperfection 7)
test/handlers/processTicket.test.ts         ← happy path only

# Phase 2 — Claude Code Configuration
CLAUDE.md
.claude/commands/explain-codebase.md
.claude/commands/propose-change.md
.claude/commands/generate-tests.md
.claude/commands/review-diff.md
.claude/commands/prepare-pr-summary.md

# Phase 3 — Workshop Documentation
README.md                                   ← repo root, spoiler-tagged hints
docs/module-1/README.md
docs/module-1/KNOWN-IMPERFECTIONS.md        ← facilitator answer key, not linked from participant docs
docs/module-1/participant-guide.md
docs/module-1/facilitator-guide.md
docs/module-1/exercises/exercise-1-orientation.md
docs/module-1/exercises/exercise-2-refactoring.md
docs/module-1/exercises/exercise-3-tests-and-review.md
```

---

## Phase 1: TypeScript Starter Service

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "ticket-processor",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "process:example": "tsx src/index.ts examples/tickets/billing-high.json"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
dist/
*.js.map
.DS_Store
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

---

### Task 2: Domain Types

**Files:**
- Create: `src/domain/ticket.ts`

- [ ] **Step 1: Create src/domain/ticket.ts**

Write intentionally loose types — this is the starter code participants will improve.

```typescript
export type Ticket = {
  id: string
  subject: string
  body: string
  category: string       // should be: 'support' | 'billing' | 'incident' | 'security'
  customerId: string
  amount?: number
  createdAt: string      // should be: Date
  priority?: string      // should not be an input field — it should be computed
}

export type TicketResult = {
  ticketId: string
  priority: string
  queue: string
  processedAt: string
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: no errors.

---

### Task 3: Classifier (with intentional bug)

**Files:**
- Create: `src/domain/classifier.ts`

- [ ] **Step 1: Write the failing test first**

Create `test/domain/classifier.test.ts` with a test that will catch the bug — to confirm the bug exists before writing the classifier. Run it after writing the classifier to verify the bug is present.

```typescript
// test/domain/classifier.test.ts — TEMPORARY version to verify the bug
import { describe, it, expect } from 'vitest'
import { classifyPriority, routeTicket } from '../../src/domain/classifier'
import type { Ticket } from '../../src/domain/ticket'

const base: Ticket = {
  id: 'T-001',
  subject: 'Test',
  body: 'Test body',
  category: 'support',
  customerId: 'C-001',
  createdAt: '2026-06-01T00:00:00Z',
}

describe('routeTicket — billing escalation', () => {
  it('routes high-value billing tickets to escalation-queue', () => {
    const ticket: Ticket = { ...base, category: 'billing', amount: 2400 }
    expect(routeTicket(ticket)).toBe('escalation-queue')
  })
})
```

- [ ] **Step 2: Create src/domain/classifier.ts with the intentional bug**

```typescript
import type { Ticket } from './ticket'

export function classifyPriority(ticket: Ticket): string {
  if (ticket.category === 'incident') {
    return 'high'
  }

  if (ticket.category === 'security') {
    return 'escalate'
  }

  if (ticket.category === 'billing' && ticket.amount !== undefined && ticket.amount > 1000) {
    return 'high'   // intentional bug: should be 'escalate'
  }

  return 'medium'
}

export function routeTicket(ticket: Ticket): string {
  const priority = classifyPriority(ticket)

  if (priority === 'escalate') {
    return 'escalation-queue'
  }

  if (ticket.category === 'billing') {
    return 'billing-queue'
  }

  if (ticket.category === 'incident') {
    return 'escalation-queue'
  }

  if (ticket.category === 'security') {
    return 'security-queue'
  }

  return 'standard-queue'
}
```

- [ ] **Step 3: Run the bug-verification test — confirm it FAILS**

```bash
npm test -- --reporter=verbose
```

Expected: FAIL — `expected 'billing-queue' to be 'escalation-queue'`. This confirms the bug is present.

- [ ] **Step 4: Replace test/domain/classifier.test.ts with the starter version (missing the escalation case)**

This is the intentionally incomplete test file participants will start with:

```typescript
import { describe, it, expect } from 'vitest'
import { classifyPriority, routeTicket } from '../../src/domain/classifier'
import type { Ticket } from '../../src/domain/ticket'

const base: Ticket = {
  id: 'T-001',
  subject: 'Test',
  body: 'Test body',
  category: 'support',
  customerId: 'C-001',
  createdAt: '2026-06-01T00:00:00Z',
}

describe('classifyPriority', () => {
  it('returns high for incident tickets', () => {
    const ticket: Ticket = { ...base, category: 'incident' }
    expect(classifyPriority(ticket)).toBe('high')
  })

  it('returns escalate for security tickets', () => {
    const ticket: Ticket = { ...base, category: 'security' }
    expect(classifyPriority(ticket)).toBe('escalate')
  })

  it('returns medium for low-value billing tickets', () => {
    const ticket: Ticket = { ...base, category: 'billing', amount: 500 }
    expect(classifyPriority(ticket)).toBe('medium')
  })

  it('returns medium for support tickets', () => {
    expect(classifyPriority(base)).toBe('medium')
  })
})

describe('routeTicket', () => {
  it('routes incident tickets to escalation-queue', () => {
    const ticket: Ticket = { ...base, category: 'incident' }
    expect(routeTicket(ticket)).toBe('escalation-queue')
  })

  it('routes security tickets to escalation-queue', () => {
    const ticket: Ticket = { ...base, category: 'security' }
    expect(routeTicket(ticket)).toBe('escalation-queue')
  })

  it('routes low-value billing tickets to billing-queue', () => {
    const ticket: Ticket = { ...base, category: 'billing', amount: 200 }
    expect(routeTicket(ticket)).toBe('billing-queue')
  })

  it('routes support tickets to standard-queue', () => {
    expect(routeTicket(base)).toBe('standard-queue')
  })
})
```

- [ ] **Step 5: Run tests — confirm all pass with the starter test file**

```bash
npm test
```

Expected: 8 tests passing. The billing escalation case is absent, so the bug is invisible.

---

### Task 4: Logger Utility

**Files:**
- Create: `src/utils/logger.ts`

- [ ] **Step 1: Create src/utils/logger.ts**

```typescript
export function log(message: string): void {
  console.log(`[ticket-processor] ${message}`)
}

export function logError(message: string, error?: unknown): void {
  console.error(`[ticket-processor] ERROR: ${message}`, error ?? '')
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: no errors.

---

### Task 5: Handler

**Files:**
- Create: `src/handlers/processTicket.ts`

Note: this file intentionally mixes input parsing with domain calls (imperfection 4), returns `undefined` silently on bad input (imperfection 5), and uses `console.log` directly instead of the logger (imperfection 8).

- [ ] **Step 1: Create src/handlers/processTicket.ts**

```typescript
import { classifyPriority, routeTicket } from '../domain/classifier'
import type { Ticket, TicketResult } from '../domain/ticket'

export function processTicket(input: Record<string, unknown>): TicketResult | undefined {
  if (!input.id || !input.subject || !input.category) {
    return undefined
  }

  const ticket: Ticket = {
    id: String(input.id),
    subject: String(input.subject),
    body: String(input.body ?? ''),
    category: String(input.category),
    customerId: String(input.customerId ?? ''),
    amount: typeof input.amount === 'number' ? input.amount : undefined,
    createdAt: String(input.createdAt ?? new Date().toISOString()),
    priority: input.priority !== undefined ? String(input.priority) : undefined,
  }

  const priority = classifyPriority(ticket)
  const queue = routeTicket(ticket)

  console.log(`Processing ticket ${ticket.id} — priority: ${priority}, queue: ${queue}`)

  return {
    ticketId: ticket.id,
    priority,
    queue,
    processedAt: new Date().toISOString(),
  }
}
```

---

### Task 6: Handler Tests

**Files:**
- Create: `test/handlers/processTicket.test.ts`

- [ ] **Step 1: Create test/handlers/processTicket.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { processTicket } from '../../src/handlers/processTicket'

describe('processTicket', () => {
  it('returns undefined when id is missing', () => {
    expect(processTicket({ subject: 'Test', category: 'support' })).toBeUndefined()
  })

  it('returns undefined when subject is missing', () => {
    expect(processTicket({ id: 'T-001', category: 'support' })).toBeUndefined()
  })

  it('returns undefined when category is missing', () => {
    expect(processTicket({ id: 'T-001', subject: 'Test' })).toBeUndefined()
  })

  it('processes a valid support ticket', () => {
    const result = processTicket({
      id: 'T-001',
      subject: 'Cannot log in',
      body: 'Login broken since this morning',
      category: 'support',
      customerId: 'C-001',
      createdAt: '2026-06-01T09:00:00Z',
    })

    expect(result).toBeDefined()
    expect(result?.ticketId).toBe('T-001')
    expect(result?.priority).toBe('medium')
    expect(result?.queue).toBe('standard-queue')
    expect(result?.processedAt).toBeDefined()
  })

  it('processes a low-value billing ticket', () => {
    const result = processTicket({
      id: 'T-002',
      subject: 'Wrong charge',
      body: 'Incorrect charge on invoice',
      category: 'billing',
      customerId: 'C-002',
      amount: 85,
      createdAt: '2026-06-01T10:00:00Z',
    })

    expect(result?.queue).toBe('billing-queue')
    expect(result?.priority).toBe('medium')
  })

  it('processes an incident ticket', () => {
    const result = processTicket({
      id: 'T-003',
      subject: 'Database down',
      body: 'All writes failing',
      category: 'incident',
      customerId: 'C-003',
      createdAt: '2026-06-01T11:00:00Z',
    })

    expect(result?.queue).toBe('escalation-queue')
    expect(result?.priority).toBe('high')
  })
})
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: 13 tests passing (8 classifier + 5 handler). Zero failures.

---

### Task 7: Entry Point

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: Create src/index.ts**

```typescript
import { readFileSync } from 'fs'
import { processTicket } from './handlers/processTicket'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: tsx src/index.ts <path-to-ticket.json>')
  process.exit(1)
}

let raw: Record<string, unknown>

try {
  raw = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, unknown>
} catch {
  console.error(`Failed to read or parse file: ${filePath}`)
  process.exit(1)
}

const result = processTicket(raw)

if (!result) {
  console.error('Failed to process ticket: missing required fields (id, subject, category)')
  process.exit(1)
}

console.log(JSON.stringify(result, null, 2))
```

---

### Task 8: Example Fixtures

**Files:**
- Create: `examples/tickets/support-ticket.json`
- Create: `examples/tickets/billing-low.json`
- Create: `examples/tickets/billing-high.json`
- Create: `examples/tickets/incident.json`

- [ ] **Step 1: Create examples/tickets/support-ticket.json**

```json
{
  "id": "T-001",
  "subject": "Cannot log in to portal",
  "body": "I have been trying to log in since this morning but keep getting a 401 error. This is blocking my whole team.",
  "category": "support",
  "customerId": "C-001",
  "createdAt": "2026-06-01T09:00:00Z"
}
```

- [ ] **Step 2: Create examples/tickets/billing-low.json**

```json
{
  "id": "T-002",
  "subject": "Incorrect charge on last invoice",
  "body": "We were charged $85 for a feature we did not activate. Please review invoice INV-2026-05.",
  "category": "billing",
  "customerId": "C-002",
  "amount": 85,
  "createdAt": "2026-06-01T10:00:00Z"
}
```

- [ ] **Step 3: Create examples/tickets/billing-high.json**

```json
{
  "id": "T-003",
  "subject": "Unexplained $2,400 charge — urgent",
  "body": "We have been charged $2,400 this month with no explanation or prior notification. This is significantly above our normal spend and requires immediate attention.",
  "category": "billing",
  "customerId": "C-003",
  "amount": 2400,
  "createdAt": "2026-06-01T11:00:00Z"
}
```

- [ ] **Step 4: Create examples/tickets/incident.json**

```json
{
  "id": "T-004",
  "subject": "Production database unreachable",
  "body": "All write operations to the primary database are failing with connection timeout errors. Multiple services are degraded. Started approximately 08:45 UTC.",
  "category": "incident",
  "customerId": "C-004",
  "createdAt": "2026-06-01T08:50:00Z"
}
```

---

### Task 9: Verify Starter Project and Initial Commit

**Files:** none new

- [ ] **Step 1: Run full verification**

```bash
npm test && npm run typecheck
```

Expected: 13 tests passing, 0 TypeScript errors.

- [ ] **Step 2: Run process:example to verify the bug is present but hidden**

```bash
npm run process:example
```

Expected output (the bug — billing-high.json should go to escalation-queue but goes to billing-queue):

```json
{
  "ticketId": "T-003",
  "priority": "high",
  "queue": "billing-queue",
  "processedAt": "..."
}
```

Note for implementation: `queue` should be `"escalation-queue"` but the bug routes it to `"billing-queue"`. This is correct — the bug is working as designed.

- [ ] **Step 3: Initialise git and create initial commit**

```bash
git init
git add package.json tsconfig.json vitest.config.ts .gitignore
git add src/ test/ examples/
git commit -m "feat: add ticket processor starter service

Intentionally imperfect TypeScript service for Module 1 workshop.
All 13 tests pass. Billing escalation bug present but not yet covered by tests."
```

---

## Phase 2: Claude Code Configuration

### Task 10: CLAUDE.md Project Instructions

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md at the repo root**

```markdown
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

## Example input

To process an example ticket locally:

```
npm run process:example
```

This runs `src/index.ts` against `examples/tickets/billing-high.json`.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "chore: add Claude Code project instructions"
```

---

### Task 11: Pre-built Claude Code Commands

**Files:**
- Create: `.claude/commands/explain-codebase.md`
- Create: `.claude/commands/propose-change.md`
- Create: `.claude/commands/generate-tests.md`
- Create: `.claude/commands/review-diff.md`
- Create: `.claude/commands/prepare-pr-summary.md`

- [ ] **Step 1: Create .claude/commands/explain-codebase.md**

```markdown
Read the following files before answering. Do not edit any files.

Files to read:
- CLAUDE.md
- package.json
- src/domain/ticket.ts
- src/domain/classifier.ts
- src/handlers/processTicket.ts
- src/utils/logger.ts

Then produce:

1. **Service summary** — what this service does in 2–3 sentences
2. **Data flow** — the path from raw input to output, step by step, naming the actual functions and files involved
3. **Domain types** — what each field in `Ticket` and `TicketResult` represents
4. **Responsibilities** — which file owns which concern

Be specific. Quote actual function names, field names, and file paths from the code.
Do not speculate about anything not visible in the files you read.
If you are uncertain about something, say so explicitly.
```

- [ ] **Step 2: Create .claude/commands/propose-change.md**

```markdown
Before making any changes, produce a scoped implementation plan.

Include:

1. **Goal** — the change in one sentence
2. **Files to touch** — exact paths and what will change in each
3. **Files not to touch** — what is explicitly out of scope
4. **Order of changes** — and why that order
5. **Tests** — which tests you will add or update, with enough detail to evaluate the plan
6. **Assumptions** — anything you are assuming that is not stated in the task
7. **Risks** — what could go wrong, or what you are uncertain about

Do not edit any files yet. Wait for confirmation before proceeding.
If the request is ambiguous, ask one clarifying question rather than guessing.
```

- [ ] **Step 3: Create .claude/commands/generate-tests.md**

```markdown
Review the test files and source files listed below. Do not edit any files yet.

Test files:
- test/domain/classifier.test.ts
- test/handlers/processTicket.test.ts

Source files:
- src/domain/classifier.ts
- src/handlers/processTicket.ts
- src/domain/ticket.ts

Identify and report:

1. **Tested behaviours** — what is currently covered
2. **Missing edge cases** — inputs or conditions that are not tested
3. **Missing error conditions** — invalid inputs, boundary values, missing fields
4. **Suspicious behaviour** — anything in the source that looks like it might not work correctly for all inputs

For each gap, write the exact test code you would add — not pseudocode, not a description. Actual `it(...)` blocks.

After listing the gaps and proposed tests, ask before adding anything to the files.
```

- [ ] **Step 4: Create .claude/commands/review-diff.md**

```markdown
Review the current git diff as if you were a reviewer on a pull request.
Do not edit any files.

First run this command and read the output carefully:

```
git diff HEAD
```

Then assess each change against these criteria:

1. **Correctness** — does the change do what it claims? Are there inputs it does not handle?
2. **Type safety** — are there loose types, implicit `any`, or missing null checks?
3. **Behaviour changes** — does this change existing behaviour? Is that intentional?
4. **Test coverage** — do the tests cover the important cases? What is missing?
5. **Risks** — what could go wrong in a production deployment?
6. **Follow-up work** — what is not done yet but should be tracked?

Be specific. Reference file names and line numbers.
Do not approve the change unless you have actually read the full diff.
State your confidence level for each finding.
```

- [ ] **Step 5: Create .claude/commands/prepare-pr-summary.md**

```markdown
Write a concise pull request summary based on the current diff and test results.

First run:
```
git diff HEAD
```

Then run:
```
npm test
```

Read both outputs before writing anything.

The PR summary should include:

1. **What changed** — 2–3 sentences describing the change and why
2. **Files modified** — list with one-line description per file
3. **Tests** — what was added or updated, and whether they pass
4. **Limitations** — what this change does not cover
5. **Risks** — anything the reviewer should pay close attention to
6. **Follow-up** — work that should happen next but is not in this PR

Write as if explaining to a colleague who will review this. Be accurate — only describe things you verified in the diff and test output.
```

- [ ] **Step 6: Commit**

```bash
git add .claude/
git commit -m "chore: add Claude Code slash commands for workshop exercises"
```

---

## Phase 3: Workshop Documentation

### Task 12: KNOWN-IMPERFECTIONS.md (Facilitator Answer Key)

**Files:**
- Create: `docs/module-1/KNOWN-IMPERFECTIONS.md`

This file is the facilitator answer key. It must not be linked from any participant-facing document.

- [ ] **Step 1: Create docs/module-1/KNOWN-IMPERFECTIONS.md**

```markdown
# Known Imperfections — Facilitator Answer Key

This document lists all intentional imperfections in the starter code.
**Do not share this with participants before or during the exercises.**

Use this to:
- verify that participants have found and fixed the right things
- guide discussion during debrief
- identify if a participant is stuck and needs a hint

---

## Imperfection 1 — `category` typed as `string` instead of a union

**File:** `src/domain/ticket.ts`, line 4

**What it is:**
```typescript
category: string
```

**What it should be:**
```typescript
category: 'support' | 'billing' | 'incident' | 'security'
```

**Why it matters:** TypeScript cannot catch a typo like `"Billing"` or `"INCIDENT"` at compile time. The routing logic silently falls through to `return 'standard-queue'` for any unrecognised category.

**Fix:** Change the type. No runtime change needed — the classification logic already uses string comparison.

---

## Imperfection 2 — `priority` accepted as input instead of being computed

**File:** `src/domain/ticket.ts`, line 8

**What it is:**
```typescript
priority?: string
```

**What it should be:** removed from the `Ticket` type entirely. Priority is a computed output, not an input field.

**Why it matters:** A caller could pass `priority: 'low'` and it would sit in the object silently — `classifyPriority` computes it fresh anyway, so the field has no effect, but it creates a misleading API.

**Fix:** Remove `priority?` from `Ticket`. It belongs only on `TicketResult`.

---

## Imperfection 3 — `createdAt` typed as `string` instead of `Date`

**File:** `src/domain/ticket.ts`, line 6

**What it is:**
```typescript
createdAt: string
```

**What it should be:**
```typescript
createdAt: Date
```

**Why it matters:** No date validation occurs. `"not-a-date"` passes through without error. SLA calculations in a future module would silently produce invalid results.

**Fix:** Change the type. Update the handler to parse the string into a `Date` before constructing the `Ticket`.

---

## Imperfection 4 — Handler mixes input parsing with domain logic

**File:** `src/handlers/processTicket.ts`

**What it is:** `processTicket` does three things in one function: validates/coerces raw input, constructs a `Ticket`, and calls domain functions. There is no separation between "parse this unknown input" and "apply business logic to a valid ticket."

**Why it matters:** Domain logic cannot be tested independently of parsing. As the service grows, this function becomes harder to reason about.

**Fix:** Extract a `parseTicket(input: Record<string, unknown>): Ticket` function that handles coercion. `processTicket` calls `parseTicket`, then calls domain functions. The domain functions receive a typed `Ticket`, not raw input.

---

## Imperfection 5 — Silent `undefined` return on bad input

**File:** `src/handlers/processTicket.ts`, lines 4–6

**What it is:**
```typescript
if (!input.id || !input.subject || !input.category) {
  return undefined
}
```

**What it should be:** throw an explicit error with a descriptive message, or return a typed error result.

**Why it matters:** Callers must check for `undefined` and guess why it happened. In a Lambda handler, an undefined return would be silently swallowed. The `process:example` script in `src/index.ts` does handle it, but it's a fragile contract.

**Fix:** Replace `return undefined` with `throw new Error('Missing required fields: id, subject, category')`. Update the handler signature to remove `| undefined`. Update tests.

---

## Imperfection 6 — Billing escalation bug (the real bug)

**File:** `src/domain/classifier.ts`, line 12

**What it is:**
```typescript
if (ticket.category === 'billing' && ticket.amount !== undefined && ticket.amount > 1000) {
  return 'high'   // should be 'escalate'
}
```

**What it should be:**
```typescript
return 'escalate'
```

**Why it matters:** High-value billing tickets (amount > 1000) get priority `'high'` instead of `'escalate'`. The routing function returns `'billing-queue'` for all billing tickets unless priority is `'escalate'`. So these tickets go to `billing-queue` instead of `escalation-queue`.

**The fix is one word:** change `'high'` to `'escalate'`.

**Trigger:** process `examples/tickets/billing-high.json` — it should route to `escalation-queue` but routes to `billing-queue`.

---

## Imperfection 7 — Missing test for high-value billing escalation

**File:** `test/domain/classifier.test.ts`

**What it is:** No test covers `classifyPriority` with `amount > 1000`, and no test covers `routeTicket` for a high-value billing ticket.

**The missing tests:**
```typescript
it('returns escalate for high-value billing tickets', () => {
  const ticket: Ticket = { ...base, category: 'billing', amount: 2400 }
  expect(classifyPriority(ticket)).toBe('escalate')
})

it('routes high-value billing tickets to escalation-queue', () => {
  const ticket: Ticket = { ...base, category: 'billing', amount: 2400 }
  expect(routeTicket(ticket)).toBe('escalation-queue')
})
```

Both tests fail before the fix. Both pass after.

---

## Imperfection 8 — Inconsistent logging

**File:** `src/handlers/processTicket.ts`, line 20

**What it is:**
```typescript
console.log(`Processing ticket ${ticket.id} — priority: ${priority}, queue: ${queue}`)
```

`src/utils/logger.ts` exists and exports `log()` and `logError()`, but the handler uses `console.log` directly.

**Why it matters:** The logger adds a consistent prefix `[ticket-processor]` and would be the right place to add structured logging, log levels, or output redirection in future modules.

**Fix:** Import `log` from `../utils/logger` and replace the `console.log` call.

---

## Summary Table

| # | File | Symptom | Exercise |
|---|------|---------|----------|
| 1 | `src/domain/ticket.ts:4` | `category: string` not a union | Ex 2 |
| 2 | `src/domain/ticket.ts:8` | `priority?` accepted as input | Ex 2 |
| 3 | `src/domain/ticket.ts:6` | `createdAt: string` not `Date` | Ex 2 |
| 4 | `src/handlers/processTicket.ts` | parsing mixed with domain logic | Ex 2 |
| 5 | `src/handlers/processTicket.ts:4-6` | silent `undefined` on bad input | Ex 2 |
| 6 | `src/domain/classifier.ts:12` | `'high'` should be `'escalate'` | Ex 3 |
| 7 | `test/domain/classifier.test.ts` | missing billing escalation test | Ex 3 |
| 8 | `src/handlers/processTicket.ts:20` | `console.log` instead of `logger` | Ex 2/3 |
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-1/KNOWN-IMPERFECTIONS.md
git commit -m "docs: add facilitator answer key for starter code imperfections"
```

---

### Task 13: Root README with Spoiler Tags

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

```markdown
# AI Development Workshop — Ticket Processor

A local TypeScript service for processing support tickets. Used in Module 1 of the AI Development Workshop.

## Quick start

```bash
npm install
npm test
npm run typecheck
npm run process:example
```

## What this service does

`processTicket` accepts a raw input object, classifies the ticket by priority, and routes it to a named queue. There is no HTTP server or external dependency — it is a pure TypeScript function you can run and test locally.

## Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests with Vitest |
| `npm run typecheck` | TypeScript strict check |
| `npm run process:example` | Process `examples/tickets/billing-high.json` |

## Project structure

```
src/
  domain/         # ticket types and routing logic
  handlers/       # input parsing and main handler function
  utils/          # shared utilities
test/             # mirrors src/ structure
examples/tickets/ # sample input files
```

## Workshop exercises

See [docs/module-1/participant-guide.md](docs/module-1/participant-guide.md) to get started.

---

## Hints

The starter code has some intentional imperfections. If you get stuck, expand the hints below.

<details>
<summary>Hint: typing issues</summary>

Look at `src/domain/ticket.ts`. Are all fields typed as precisely as they could be?
Consider: what values are actually valid for `category`? What type should `createdAt` be?
Is `priority` something a caller should provide, or something the service should compute?

</details>

<details>
<summary>Hint: validation and error handling</summary>

What happens when `processTicket` receives an object with missing fields?
Is the caller told what went wrong, or do they have to guess?
Is there a validation library already installed that could help?

</details>

<details>
<summary>Hint: separation of concerns</summary>

Look at `processTicket` in `src/handlers/processTicket.ts`.
How many things does this one function do?
Which parts belong in the domain layer and which belong in the handler?

</details>

<details>
<summary>Hint: the routing bug</summary>

Try running `npm run process:example`. The example is a high-value billing ticket.
Look at the `queue` field in the output. Does that seem right?
Check the routing table in `docs/module-1/README.md` against what the code actually does.

</details>

<details>
<summary>Hint: missing test coverage</summary>

Look at `test/domain/classifier.test.ts`. The billing tests only cover low-value amounts.
What happens to a billing ticket with `amount: 2400`?
Write the test, run it, and see what happens.

</details>

<details>
<summary>Hint: logging inconsistency</summary>

`src/utils/logger.ts` exists. Is it used everywhere it should be?

</details>
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add root README with workshop quick start and spoiler hints"
```

---

### Task 14: Module 1 README

**Files:**
- Create: `docs/module-1/README.md`

- [ ] **Step 1: Create docs/module-1/README.md**

```markdown
# Module 1: Claude Code in the Engineering Loop

**Duration:** ~60 minutes  
**Type:** Hands-on exercises  

## What you will practise

- Using Claude Code to explore and understand an unfamiliar TypeScript codebase
- Reading and modifying `CLAUDE.md` project instructions to constrain Claude's behaviour
- Writing a custom Claude Code slash command
- Asking Claude for a plan before making changes
- Introducing stronger types and Zod validation in small, reviewable steps
- Running tests after each change and inspecting `git diff` before accepting work
- Using Claude to identify missing test coverage and find a real bug
- Preparing a PR-style summary with Claude

## Routing rules

The service routes tickets to named queues based on category and amount:

| Category  | Condition        | Priority | Queue              |
|-----------|------------------|----------|--------------------|
| incident  | any              | high     | escalation-queue   |
| security  | any              | escalate | escalation-queue   |
| billing   | amount > 1000    | escalate | escalation-queue   |
| billing   | amount ≤ 1000    | medium   | billing-queue      |
| support   | any              | low      | standard-queue     |

> **Note:** The starter code does not fully implement this table. Part of the workshop is discovering where it diverges.

## Exercises

1. [Exercise 1: Codebase Orientation](exercises/exercise-1-orientation.md)
2. [Exercise 2: Safe Refactoring](exercises/exercise-2-refactoring.md)
3. [Exercise 3: Tests, Review, and PR Prep](exercises/exercise-3-tests-and-review.md)

Or follow the [Participant Guide](participant-guide.md) for the full step-by-step walkthrough.

## Prerequisites

- Node.js 20+
- Claude Code CLI installed and authenticated
- `npm install` run in the repo root
- A terminal and a code editor open on this repo
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-1/README.md
git commit -m "docs: add module-1 README with routing table"
```

---

### Task 15: Exercise Files

**Files:**
- Create: `docs/module-1/exercises/exercise-1-orientation.md`
- Create: `docs/module-1/exercises/exercise-2-refactoring.md`
- Create: `docs/module-1/exercises/exercise-3-tests-and-review.md`

- [ ] **Step 1: Create exercise-1-orientation.md**

```markdown
# Exercise 1: Codebase Orientation

**Goal:** Use Claude Code to explore an unfamiliar codebase, understand how Claude Code works as a configured tool, and write your first custom slash command.

**Duration:** ~18 minutes  
**Code changes:** None required (optional at the end)

---

## Step 1 — Read the project instructions (~3 min)

Open `CLAUDE.md` at the repo root.

Read it. This file tells Claude how to behave in this project. Notice:
- What it tells Claude to do before making changes
- What it tells Claude not to do
- How it defines the project's code structure

**Checkpoint:** Can you answer these questions from `CLAUDE.md` alone?
- What must Claude do before editing any file?
- What command runs the tests?
- What does `src/domain/` contain?

---

## Step 2 — Run /explain-codebase (~5 min)

In Claude Code, run:

```
/explain-codebase
```

Read Claude's output. It should describe:
- What the service does
- The data flow from input to output
- The key types and which files own which responsibilities

**Verify two claims:** Pick two specific things Claude said — a function name, a field name, a responsibility assignment — and check them directly in the source files. Do they match?

> Claude Code is useful for orientation, but its output is a model of the code, not the code itself. Verification is always your responsibility.

---

## Step 3 — Look at an existing command (~3 min)

Open `.claude/commands/explain-codebase.md` in your editor.

Notice:
- It is a plain markdown file — just a prompt
- It tells Claude which files to read and in what format to respond
- It explicitly says "Do not edit any files"

This is how Claude Code slash commands work. They are prompt files stored in `.claude/commands/`. You can write, modify, and share them.

---

## Step 4 — Write your own command (~5 min)

Create a new file: `.claude/commands/find-weaknesses.md`

Write a prompt that asks Claude to identify:
1. Fields in `src/domain/ticket.ts` that are typed too loosely
2. Missing or incomplete validation in `src/handlers/processTicket.ts`
3. Test cases that are absent from `test/domain/classifier.test.ts`

Use this skeleton as your starting point:

```markdown
Read the following files. Do not edit any files.

Files to read:
- src/domain/ticket.ts
- src/handlers/processTicket.ts
- test/domain/classifier.test.ts

Then identify:

1. **Typing gaps** — ...
2. **Missing validation** — ...
3. **Missing tests** — ...

Be specific. Quote field names, line numbers, and function names from the files.
Do not speculate. If you are uncertain, say so.
```

Fill in the `...` with your own prompt instructions. Save the file.

---

## Step 5 — Run your command (~2 min)

In Claude Code, run:

```
/find-weaknesses
```

Review the output. Make a list of what Claude identified.

**Checkpoint:** Does the list seem credible? Can you find each issue Claude named in the actual source files?

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A short note (2–4 sentences) describing what the ticket processor does
- [ ] A list of 3–5 suspected improvement areas
- [ ] `.claude/commands/find-weaknesses.md` committed or saved

You have not changed any source or test files yet.

---

## Reflection questions

- What would Claude have done if you had not read `CLAUDE.md` first? Would the output have been different?
- Which of Claude's claims did you verify? Did any of them turn out to be wrong or imprecise?
- What would you add to `CLAUDE.md` to make Claude more useful for this specific project?
```

- [ ] **Step 2: Create exercise-2-refactoring.md**

```markdown
# Exercise 2: Safe AI-Assisted Refactoring

**Goal:** Improve the starter code in small, reviewable steps using Claude Code. Plan before you change. Test after every meaningful change. Inspect the diff before accepting.

**Duration:** ~22 minutes  
**Prerequisites:** Exercise 1 complete

---

## Before you start

Run the tests to confirm a clean baseline:

```bash
npm test && npm run typecheck
```

Expected: 13 tests passing, 0 TypeScript errors.

---

## Step 1 — Ask for a plan first (~3 min)

In Claude Code, describe what you want to improve. Then run:

```
/propose-change
```

Or describe your intent first:
> "I want to introduce stronger TypeScript types in the Ticket domain model, add Zod validation to the handler input, and separate input parsing from domain logic."

Read Claude's plan. Check:
- Are the files it plans to touch reasonable?
- Does it mention what it will NOT change?
- Does it describe which tests it will add or update?

Do not let Claude proceed until you have reviewed the plan.

> If Claude proposes to rewrite everything at once, that is a signal to scope it down. Ask it to start with just the types.

---

## Step 2 — Introduce TypeScript union types (~5 min)

Ask Claude to update `src/domain/ticket.ts`:

1. Change `category: string` to `category: 'support' | 'billing' | 'incident' | 'security'`
2. Remove `priority?: string` from the `Ticket` type (it is a computed output, not an input)
3. Change `createdAt: string` to `createdAt: Date`

After Claude makes changes:

```bash
git diff
```

Review the diff. Does it match what you asked for? Did Claude touch anything else?

```bash
npm run typecheck
```

Expected: TypeScript will now flag places that pass a raw string where the union type is expected. Fix any errors Claude did not catch.

```bash
npm test
```

Expected: tests still passing.

```bash
git add src/domain/ticket.ts
git commit -m "refactor: strengthen Ticket domain types"
```

---

## Step 3 — Add Zod validation (~7 min)

`zod` is already installed. Ask Claude to add input validation to `src/handlers/processTicket.ts`.

The validation should:
- Define a Zod schema for the ticket input
- Parse and validate the raw input at the top of `processTicket`
- Throw a descriptive error (not return `undefined`) if validation fails

After Claude makes changes, review the diff:

```bash
git diff
```

Check:
- Is the Zod schema imported correctly?
- Does the error message describe what is missing?
- Did Claude remove the `| undefined` from the return type?

```bash
npm test
```

If tests fail, read the failure messages. Update the tests to match the new error-throwing behaviour (the handler now throws instead of returning `undefined`).

```bash
git add src/handlers/processTicket.ts test/handlers/processTicket.test.ts
git commit -m "refactor: add Zod validation to processTicket handler"
```

---

## Step 4 — Separate domain from handler (~5 min)

Ask Claude to extract input parsing into its own function, separate from the domain logic.

The goal:
- A `parseTicketInput` function in the handler file (or a new `src/handlers/parseInput.ts`) that converts raw input into a typed `Ticket`
- `processTicket` calls `parseTicketInput`, then calls the classifier

After Claude makes changes:

```bash
git diff
npm test
```

If tests pass and the diff looks right:

```bash
git add src/handlers/
git commit -m "refactor: separate input parsing from domain logic in handler"
```

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] Stronger TypeScript types in `src/domain/ticket.ts`
- [ ] Zod validation in the handler with explicit error throwing
- [ ] Cleaner separation between parsing and domain logic
- [ ] All 13 tests passing (some updated to match new behaviour)
- [ ] 3 focused commits in `git log`

---

## Reflection questions

- Did Claude ever propose a change that was larger than you asked for? What did you do?
- When you ran `git diff`, did Claude's changes match what you expected?
- Were there any type errors TypeScript caught after the union type change that surprised you?
- What does `CLAUDE.md` say about adding dependencies? Did Claude follow it?
```

- [ ] **Step 3: Create exercise-3-tests-and-review.md**

```markdown
# Exercise 3: Tests, Review, and PR Preparation

**Goal:** Use Claude Code to find a real bug through test generation, complete a PR-style review cycle, and produce a PR summary.

**Duration:** ~18 minutes  
**Prerequisites:** Exercise 2 complete, all tests passing

---

## Before you start

Confirm a clean baseline:

```bash
npm test && npm run typecheck
```

---

## Step 1 — Find missing test coverage (~5 min)

Run:

```
/generate-tests
```

Read Claude's output. It should identify:
- Which behaviours are currently tested
- Which edge cases are missing
- Proposed test code for each gap

Look carefully at the billing category tests. What amount values are currently tested?

**Checkpoint:** Did Claude identify any edge cases involving the `amount` field and high-value billing tickets?

If not, ask directly:
> "What happens to a billing ticket with amount: 2400? Is that case tested?"

---

## Step 2 — Write the missing test (~3 min)

Add the following tests to `test/domain/classifier.test.ts`:

```typescript
it('returns escalate for high-value billing tickets', () => {
  const ticket: Ticket = { ...base, category: 'billing', amount: 2400 }
  expect(classifyPriority(ticket)).toBe('escalate')
})

it('routes high-value billing tickets to escalation-queue', () => {
  const ticket: Ticket = { ...base, category: 'billing', amount: 2400 }
  expect(routeTicket(ticket)).toBe('escalation-queue')
})
```

Run the tests:

```bash
npm test
```

Expected: **2 tests fail.** This is correct — the tests are exposing a real bug.

Read the failure output carefully. What is the service actually returning for a high-value billing ticket?

---

## Step 3 — Fix the bug (~3 min)

Open `src/domain/classifier.ts`. Find the billing priority classification.

Look at what priority high-value billing tickets currently receive. Compare it to the routing table in `docs/module-1/README.md`.

Fix the bug. The change is one word.

```bash
npm test
```

Expected: all tests passing.

```bash
git add src/domain/classifier.ts test/domain/classifier.test.ts
git commit -m "fix: route high-value billing tickets to escalation-queue

Billing tickets with amount > 1000 were classified as 'high' priority
instead of 'escalate', causing them to be routed to billing-queue.
The correct destination is escalation-queue."
```

---

## Step 4 — Review the full diff (~4 min)

Run:

```
/review-diff
```

Claude will run `git diff HEAD` and review the full changeset from this session as if it were a pull request.

Read the review. Check:
- Are there risks Claude identified that you agree with?
- Are there findings that seem wrong or overstated?
- Did Claude miss anything important?

Note: Claude's review is input to your judgement, not a replacement for it.

---

## Step 5 — Write a PR summary (~3 min)

Run:

```
/prepare-pr-summary
```

Claude will read the diff and test output, then produce a PR summary.

Review it. Edit it if it is inaccurate or missing something important.

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] Two new tests in `test/domain/classifier.test.ts`
- [ ] The billing escalation bug fixed in `src/domain/classifier.ts`
- [ ] All tests passing
- [ ] A review note from `/review-diff`
- [ ] A PR summary from `/prepare-pr-summary`
- [ ] A list of remaining risks or follow-up tasks

---

## Reflection questions

- The bug existed in the starter code and all tests were passing. What does that tell you about test coverage?
- Claude found the missing test cases — but did it also identify the bug? Or did the test failure do that?
- How much of the review from `/review-diff` would you act on immediately versus track as follow-up?
- What would you add to `CLAUDE.md` now that you have worked through all three exercises?
```

- [ ] **Step 4: Commit exercise files**

```bash
git add docs/module-1/exercises/
git commit -m "docs: add exercise files for module-1 (orientation, refactoring, tests and review)"
```

---

### Task 16: Participant Guide

**Files:**
- Create: `docs/module-1/participant-guide.md`

- [ ] **Step 1: Create docs/module-1/participant-guide.md**

```markdown
# Module 1 Participant Guide

**Claude Code in the Engineering Loop**

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

## Prerequisites

- Node.js 20+ installed
- Claude Code CLI installed (`claude --version` should work)
- A code editor open on this repository
- A terminal in the repository root

If you have not used Claude Code before, run `claude` in your terminal and follow the authentication prompts.

---

## Setup

```bash
# in the repo root
npm install
npm test          # should show 13 tests passing
npm run typecheck # should show 0 errors
npm run process:example  # processes examples/tickets/billing-high.json
```

If any of these fail, ask for help before starting.

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
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-1/participant-guide.md
git commit -m "docs: add module-1 participant guide"
```

---

### Task 17: Facilitator Guide

**Files:**
- Create: `docs/module-1/facilitator-guide.md`

- [ ] **Step 1: Create docs/module-1/facilitator-guide.md**

```markdown
# Module 1 Facilitator Guide

**Claude Code in the Engineering Loop**

---

## Learning goals

By the end of this module participants should be able to:

1. Use Claude Code to explore and understand an unfamiliar TypeScript codebase
2. Read and understand `CLAUDE.md` project instructions, and know why they matter
3. Write a basic custom slash command (prompt file in `.claude/commands/`)
4. Ask Claude for an implementation plan before making changes
5. Introduce stronger types and Zod validation in small, reviewable steps
6. Run tests and inspect `git diff` before accepting AI-generated changes
7. Use Claude to identify missing test coverage and surface a real bug
8. Use Claude to produce a PR-style review and summary

**The meta-skill:** knowing when to accept Claude's output, when to redirect it, and when to verify it yourself.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Intro and setup check | 5 min |
| Live demo: what Claude Code is | 5 min |
| Exercise 1 | 18 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 22 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 18 min |
| Debrief Exercise 3 + wrap-up | 7 min |
| **Total** | **~85 min** |

> If time is short, see **Simplifications** below.

---

## Before the session

1. Confirm Node.js 20+ is installed on participant machines.
2. Confirm Claude Code CLI is installed and authenticated (`claude --version`).
3. Run `npm install && npm test` in the repo to confirm it works on your machine.
4. Read `docs/module-1/KNOWN-IMPERFECTIONS.md` — know all 8 issues and their file locations.
5. Run `npm run process:example` and note the (buggy) output — `billing-queue` instead of `escalation-queue`.

---

## Live demo recommendations

### At the start (~5 min)

Demonstrate Claude Code in the terminal on your machine. Show:
- Running `/explain-codebase` — let participants see Claude read files and produce a structured explanation
- Opening `.claude/commands/explain-codebase.md` — show it is just a prompt file
- Opening `CLAUDE.md` — show it shapes Claude's behaviour

**Say:** "We are not using Claude as a chatbot. We are configuring it for this specific project and running it inside an engineering loop. The commands are prompts. The project instructions are constraints. You are always the reviewer."

### Before Exercise 2 (~2 min)

Run `/propose-change` live and show what a plan looks like before accepting it.  
Deliberately scope it down: "Only the types first."

### Before Exercise 3 (~1 min)

Run `npm run process:example` and ask: "Does this output look right to you?"  
Let participants think before explaining.

---

## Common participant mistakes

### Accepting Claude's output without reading it
Claude will sometimes propose correct changes in an overly broad diff. Participants who accept without reading `git diff` will not notice. Ask: "What does `git diff` show?"

### Skipping `/propose-change`
Participants will be tempted to describe the change and let Claude immediately edit files. Pause them: "Did you run `/propose-change` first? What did the plan say?"

### Running `npm test` before the change, not after
Participants will run tests to confirm the baseline, then forget to run them again after the change. Remind them: tests are a check on the change, not just a baseline.

### Treating Claude's review as authoritative
During Exercise 3, `/review-diff` will produce a review. Participants may treat it as a green light. Ask: "Do you agree with every finding? Is there anything it missed?"

### Writing a `find-weaknesses.md` command that is too vague
Participants often write "find all the problems" without specifying what to look at. This produces vague output. Coach them: specify which files to read and what categories of issues to report.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What did `/explain-codebase` get right? What did it get wrong or miss?"
- "Did anyone's `find-weaknesses` command produce output that surprised them?"
- "What would you add to `CLAUDE.md` to make it more useful for this project?"

**What good looks like:**
- Participants verified at least one Claude claim against the source
- They wrote a `find-weaknesses` command that references specific files and asks for specific categories of issues
- They noticed that `CLAUDE.md` constrains Claude — they did not just run commands blindly

**Teaching point:** Claude Code is useful for orientation, but its output is a model of the code. Verification is always the engineer's responsibility.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Did Claude propose anything you rejected? Why?"
- "When you ran `git diff`, did the changes match what you asked for?"
- "Did TypeScript catch anything after the union type change?"

**What good looks like:**
- At least 3 focused commits, not one large one
- Participants ran `npm test` after each meaningful change
- At least one person rejected or scoped down a Claude proposal
- The handler now throws instead of returning `undefined`

**Teaching point:** The git diff is the source of truth — not Claude's description of what it did.

---

## Exercise 3 debrief (7 min)

**Ask the group:**
- "All 13 starter tests were passing. The bug was present. What does that tell us?"
- "When you wrote the failing test — did Claude point to the bug, or did the test failure do that?"
- "How much of `/review-diff` output would you act on immediately?"

**What good looks like:**
- Participants wrote the test *before* looking for the bug, and let the test failure guide them
- The fix was one word: `'high'` → `'escalate'`
- Participants edited or critiqued the PR summary from `/prepare-pr-summary` rather than accepting it wholesale

**Teaching point:** Tests are how you confirm Claude's output is actually correct. A passing test suite is not evidence of correctness — it is evidence that the written tests pass.

---

## Connecting to the broader workshop arc

Use the wrap-up to preview the next modules:

**"What you practised today is the foundation."**

- Module 1: Claude Code as a configured tool in a local engineering loop
- Module 2: Turning these workflows into repeatable, shareable patterns — custom commands as team conventions, MCP servers to connect Claude to your real systems (GitHub, Jira, CloudWatch)
- Module 3: Deploying the ticket processor as a real AWS Lambda — and using Claude to generate and review the infrastructure code

The consulting angle: the value is not in Claude generating code faster. It is in faster comprehension of unfamiliar systems, more explicit planning, safer changes, and better review discipline — especially in client engagements where you are new to the codebase.

---

## Simplifications if time is short

If you have only 45–50 minutes:

- **Skip Step 4 of Exercise 2** (separating parsing from domain logic). The Zod validation step is more important.
- **Shorten Exercise 1** by pre-filling `.claude/commands/find-weaknesses.md` and having participants just run it rather than write it.
- **Skip `/review-diff`** in Exercise 3 and go straight to `/prepare-pr-summary`.

The non-negotiable steps are: run `/explain-codebase`, write one custom command, run `/propose-change` before a change, inspect `git diff`, write the failing test, and fix the bug.

---

## Optional extensions for advanced participants

- Add a second Zod schema for the `TicketResult` output and validate it in a test
- Write a `/check-types` command that asks Claude to review the Ticket type specifically and suggest improvements with reasoning
- Extend `classifyPriority` to handle a new category (e.g., `'compliance'`) — ask Claude to propose the change, review the plan, then accept or modify it
- Add a `routeSecurityTicket` function that separates security routing from general routing — use TDD
- Write an additional command that Claude uses to summarise the current test coverage gaps at any point
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-1/facilitator-guide.md
git commit -m "docs: add module-1 facilitator guide with timing, debriefs, and teaching notes"
```

---

### Task 18: Final Verification

**Files:** none new

- [ ] **Step 1: Run full test and typecheck**

```bash
npm test && npm run typecheck
```

Expected: 13 tests passing, 0 TypeScript errors.

- [ ] **Step 2: Verify process:example shows the bug**

```bash
npm run process:example
```

Expected output:
```json
{
  "ticketId": "T-003",
  "priority": "high",
  "queue": "billing-queue",
  "processedAt": "..."
}
```

Confirm: `queue` is `"billing-queue"` (not `"escalation-queue"`). The bug is present.

- [ ] **Step 3: Verify all expected files exist**

```bash
ls src/domain/ src/handlers/ src/utils/ test/domain/ test/handlers/ examples/tickets/
ls .claude/commands/
ls docs/module-1/ docs/module-1/exercises/
ls CLAUDE.md README.md
```

Expected: all files from the file map are present.

- [ ] **Step 4: Verify git log shows clean commit history**

```bash
git log --oneline
```

Expected: 8–10 focused commits.

- [ ] **Step 5: Final commit if any files are unstaged**

```bash
git status
```

If anything is untracked or unstaged:

```bash
git add <files>
git commit -m "chore: finalise module-1 workshop setup"
```

---

## Self-Review Notes

### Spec coverage check

| Spec requirement | Covered by |
|---|---|
| Support ticket domain model | Task 2, Task 3 |
| Priority routing logic | Task 3 |
| Handler accepting raw input | Task 5 |
| Example ticket fixtures | Task 8 |
| Passing tests with incomplete coverage | Tasks 3, 6 |
| At least one missing edge case | Task 3 (billing escalation) |
| `npm test`, `typecheck`, `process:example` scripts | Task 1 |
| Zod pre-installed, not yet used | Task 1 |
| `CLAUDE.md` project instructions | Task 10 |
| 5 pre-built slash commands | Task 11 |
| `find-weaknesses.md` written by participants | Task 15 (scaffold in exercise doc) |
| Participant guide with checkpoints | Task 16 |
| Facilitator guide with timing and debriefs | Task 17 |
| KNOWN-IMPERFECTIONS answer key | Task 12 |
| Spoiler-tagged hints in README | Task 13 |
| Exercise 1, 2, 3 files | Task 15 |

All 8 intentional imperfections are implemented in Tasks 2, 3, 5 and documented in Task 12.
