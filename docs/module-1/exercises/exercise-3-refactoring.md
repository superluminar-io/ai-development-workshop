# Exercise 3: Safe AI-Assisted Refactoring

**Goal:** Use the safe-refactoring skill you wrote in Exercise 2 to make three focused, independently committable improvements to a codebase you did not write.

**Duration:** ~22 minutes  
**Prerequisites:** Exercise 2 complete

---

## Before you start

Run the tests to confirm a clean baseline:

```bash
npm test && npm run typecheck
```

Expected: all tests passing, 0 TypeScript errors.

<details>
<summary>Hint: npm test fails after a Claude change</summary>

Read the failure message before doing anything else. If Claude changed a function signature, the tests may need to be updated to match the new behaviour. Run `git diff` to see exactly what changed, then decide whether the test or the code needs fixing.

</details>

---

## Step 1 — Describe the task, let the skill do its job (~3 min)

Start a fresh Claude Code session (or run `/clear` to reset context). Then describe what you want in natural language — no slash command:

> "I want to improve the TypeScript types in this codebase, add Zod validation to the handler input, and separate input parsing from domain logic. I didn't write this code and I want to be careful."

Claude should recognise this as a refactoring task on unfamiliar code and apply your `safe-refactoring` skill automatically. Before suggesting any changes, you should see it:

- State which files it intends to touch and why
- Read the relevant test files
- Run `npm test` to confirm a passing baseline

Only once that baseline is established should Claude propose what to change.

**If Claude skips straight to making changes,** the skill did not trigger. Check your `description` field — does it match the language you used? Adjust it and try again with `/clear`.

When the skill has established the baseline and scoped the work, proceed to the next steps one at a time.

---

## Step 2 — Introduce TypeScript union types (~5 min)

> **How changes work in Claude Code:** Claude will ask for your permission before editing any file — either by proposing changes on its own and asking whether to proceed, or by waiting for you to describe what you want. Either way, read what it proposes before approving. If Claude waits for direction, the prompt below is a starting point:

> "Update `src/domain/ticket.ts` to make these changes: change `category: string` to the union type `'support' | 'billing' | 'incident' | 'security'`, remove the `priority` field from the Ticket type entirely (it is a computed output, not an input), and change `createdAt: string` to `createdAt: Date`."

Once the changes are approved, review them before doing anything else:

```bash
git diff
```

Read the diff line by line. Does it match exactly what you asked for? Did Claude touch any other files?

```bash
npm run typecheck
```

TypeScript will now flag every place in the codebase that passes a raw string where the union type is expected. These are real errors — read each one and fix it (Claude can help if you paste the error message).

```bash
npm test
```

Expected: tests still passing. Then commit:

```bash
git add src/domain/ticket.ts
git commit -m "refactor: strengthen Ticket domain types"
```

<details>
<summary>Hint: TypeScript is showing errors I don't understand</summary>

This is expected. When you change `category: string` to a union type, TypeScript finds every place in the codebase that passes an arbitrary string as `category`. Those places now need to pass one of the valid values.

Paste the full error message into Claude: "I'm getting this TypeScript error — what does it mean and how do I fix it?" Work through errors one at a time.

</details>

---

## Step 3 — Add Zod validation (~7 min)

[Zod](https://zod.dev) is a TypeScript-first schema validation library. You describe the shape and types of your data once as a schema, and Zod validates incoming values against it at runtime — giving you both a type-safe result and a clear error message when the input is wrong. It is the standard way to validate data at a system boundary (an HTTP handler, a queue consumer, a CLI argument) without writing manual `if` checks for every field.

`zod` is already installed in this project. Tell Claude what you want:

> "Add Zod input validation to `src/handlers/processTicket.ts`. Define a Zod schema for the raw ticket input, parse and validate it at the top of the `processTicket` function, and throw a descriptive error if validation fails — do not return `undefined`."

Once the changes are approved, review the diff:

```bash
git diff
```

Check:
- Is the Zod import at the top of the file?
- Does the error message describe what is actually wrong with the input?
- Has Claude removed the `| undefined` from the return type?

```bash
npm test
```

Some tests may now fail — the handler throws instead of returning `undefined`, and the existing tests may not expect that. Read the failure messages and update the tests to match the new behaviour.

```bash
git add src/handlers/processTicket.ts test/handlers/processTicket.test.ts
git commit -m "refactor: add Zod validation to processTicket handler"
```

<details>
<summary>Hint: Claude changed more files than I asked for</summary>

This is a common pattern. Claude may try to update related files proactively. You do not have to accept everything it changed.

Run `git diff` and look at which files appear in the output. If Claude changed something you did not ask for, you can:
- Tell it: "Revert your changes to `[filename]`. I only wanted changes in `src/handlers/processTicket.ts`."
- Or use `git checkout -- [filename]` to restore a specific file to its previous state.

Reference `CLAUDE.md` — it explicitly says to prefer small, reviewable changes and not to touch files unrelated to the task.

</details>

---

## Step 4 — Separate domain from handler (~5 min)

Tell Claude:

> "Extract input parsing into its own function, separate from the domain logic in `processTicket`. The goal is a `parseTicketInput` function that converts raw input into a typed `Ticket`, and a `processTicket` function that only calls `parseTicketInput` and then the classifier."

Once the changes are approved:

```bash
git diff
npm test
```

If tests pass and the diff looks right, commit:

```bash
git add src/handlers/
git commit -m "refactor: separate input parsing from domain logic in handler"
```

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] Observed your `safe-refactoring` skill trigger automatically before any code changed
- [ ] Stronger TypeScript types in `src/domain/ticket.ts`
- [ ] Zod validation in the handler with explicit error throwing
- [ ] Cleaner separation between parsing and domain logic
- [ ] All tests passing (some updated to match new behaviour)
- [ ] 3 focused commits in `git log`

---

## Verification

Run these commands to confirm your implementation is complete. Every check should pass before you move on.

**1. Tests pass and TypeScript is clean:**

```bash
npm test && npm run typecheck
```

Expected: all tests passing, 0 TypeScript errors.

**2. `priority` has been removed from the `Ticket` input type:**

```bash
grep -A 10 "export type Ticket = {" src/domain/ticket.ts | grep "priority"
```

Expected: no output. (`priority` still appears in `TicketResult` — that is correct, it is a computed output field.)

**3. `category` is a union type, not `string`:**

```bash
grep "category" src/domain/ticket.ts
```

Expected output includes `'support' | 'billing' | 'incident' | 'security'`.

**4. Zod is used in the handler and `parseTicketInput` exists:**

```bash
grep -E "from 'zod'|parseTicketInput" src/handlers/processTicket.ts
```

Expected: two lines — one Zod import, one `parseTicketInput` definition.

**5. Handler tests throw on invalid input rather than returning `undefined`:**

```bash
grep "toThrow" test/handlers/processTicket.test.ts
```

Expected: at least 3 lines.

**6. Three focused commits:**

```bash
git log --oneline -3
```

Expected: three commits, each scoped to one change.

---

## Reflection questions

- Did your `safe-refactoring` skill trigger automatically, or did you have to nudge it? What does that tell you about the `description` field?
- Did Claude run `npm test` between each change without being asked? Was that the skill or default behaviour?
- Did Claude ever propose a change that was larger than you asked for? What did you do?
- When you ran `git diff`, did Claude's changes match what you expected?
- Were there any type errors TypeScript caught after the union type change that surprised you?
