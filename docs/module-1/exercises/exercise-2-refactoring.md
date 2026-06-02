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

Expected: all tests passing, 0 TypeScript errors.

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
- [ ] All tests passing (some updated to match new behaviour)
- [ ] 3 focused commits in `git log`

---

## Reflection questions

- Did Claude ever propose a change that was larger than you asked for? What did you do?
- When you ran `git diff`, did Claude's changes match what you expected?
- Were there any type errors TypeScript caught after the union type change that surprised you?
- What does `CLAUDE.md` say about adding dependencies? Did Claude follow it?
