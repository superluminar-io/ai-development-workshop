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

Before touching any files, describe what you want to improve in the Claude Code terminal:

> "I want to introduce stronger TypeScript types in the Ticket domain model, add Zod validation to the handler input, and separate input parsing from domain logic."

Then run:

```
/propose-change
```

Claude will read the codebase and produce a step-by-step plan: which files it intends to touch, what it will change in each, and what it will leave alone. Read the plan before you let Claude proceed.

Check:
- Are the files it plans to touch reasonable?
- Does it mention what it will NOT change?
- Does it describe which tests it will add or update?

Do not let Claude proceed until you have reviewed the plan and it looks right.

> If Claude proposes to rewrite everything at once, that is a signal to scope it down. Reply: "Start with just the types in `src/domain/ticket.ts`. Nothing else yet."

---

## Step 2 — Introduce TypeScript union types (~5 min)

Tell Claude in the chat what you want:

> "Update `src/domain/ticket.ts` to make these changes: change `category: string` to the union type `'support' | 'billing' | 'incident' | 'security'`, remove the `priority` field from the Ticket type entirely (it is a computed output, not an input), and change `createdAt: string` to `createdAt: Date`."

After Claude makes the changes, review them before doing anything else:

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

After Claude makes the changes, review the diff:

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

After Claude makes the changes:

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
