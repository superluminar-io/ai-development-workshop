# Exercise 4: Tests, Review, and PR Preparation

**Goal:** Use Claude Code to find a real bug through test generation, complete a PR-style review cycle, and produce a PR summary.

**Duration:** ~18 minutes  
**Prerequisites:** Exercise 3 complete, all tests passing

---

## The system you are working with

The ticket processor receives customer support requests and routes them to the right team. A ticket has a category (`support`, `billing`, `incident`, `security`) and optionally an `amount` for billing disputes. The classifier assigns a priority, and the router sends the ticket to a queue.

The routing rules are:

| Category | Condition | Priority | Queue |
|---|---|---|---|
| `incident` | any | `high` | `escalation-queue` |
| `security` | any | `escalate` | `escalation-queue` |
| `billing` | `amount > 1000` | `escalate` | `escalation-queue` |
| `billing` | `amount ≤ 1000` | `medium` | `billing-queue` |
| `support` | any | `medium` | `standard-queue` |

**Why this matters:** imagine a customer contacts you about a $2,400 billing error. That ticket should be escalated immediately — large disputes need senior attention and fast resolution. If the classifier gets this wrong, the ticket lands in the standard billing queue and waits its turn alongside a $40 invoice question. The customer with the $2,400 problem has no idea why nobody is calling them back.

That is the bug you are going to find in this exercise.

---

## Before you start

Confirm a clean baseline:

```bash
npm test && npm run typecheck
```

---

## Step 1 — Find missing test coverage (~5 min)

In the Claude Code terminal, run:

```
/generate-tests
```

Claude will read the test files and the source files, identify which behaviours are currently tested, and propose tests for gaps it finds. Read its output and look carefully at what it says about the billing category — specifically which `amount` values are and are not covered.

If Claude does not mention the `amount` field, ask it directly in the chat:

> "What happens to a billing ticket with `amount: 2400`? Is that case tested?"

**Checkpoint:** Did Claude identify any edge cases involving high-value billing tickets?

<details>
<summary>Hint: I don't understand what "edge case" means here</summary>

The routing table in `docs/module-1/README.md` shows that billing tickets with `amount > 1000` should be treated differently from billing tickets with `amount ≤ 1000`. Look at the test file `test/domain/classifier.test.ts` — what billing amounts are currently tested? Is the high-value case (`amount: 2400`) covered?

</details>

---

## Step 2 — Write the missing tests (~3 min)

Open `test/domain/classifier.test.ts` in your editor and add these two tests inside the relevant `describe` block:

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

Save the file, then run:

```bash
npm test
```

Expected: **2 tests fail.** This is correct — the tests are exposing a real bug in the starter code. Read the failure output carefully:

```
Expected: "escalate"
Received: "high"
```

This tells you what the service is currently returning versus what the routing table says it should return.

<details>
<summary>Hint: I'm not sure where to add the tests in the file</summary>

Open `test/domain/classifier.test.ts`. You will see `describe` blocks grouping tests by category. Find the block for `'billing'` — it already has some tests for low-value billing tickets. Add the two new tests at the end of that block, before the closing `})`.

If you are not sure about the `base` fixture, look at how the existing billing tests construct their `Ticket` objects — your tests follow the same pattern.

</details>

---

## Step 3 — Fix the bug (~3 min)

Open `src/domain/classifier.ts` in your editor. Find the section that classifies billing ticket priority.

Compare what the code does for high-value billing tickets against the routing table in `docs/module-1/README.md`. The fix is a single word — the wrong priority value.

Make the change directly in your editor, then run:

```bash
npm test
```

Expected: all tests passing.

Commit with a message that explains the bug and the fix:

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

Claude will run `git diff` across your full session and review the changeset as if it were a pull request — looking for risks, missing cases, and anything worth calling out.

Read the review. For each finding, decide: do you agree? Is it something to fix now or track as a follow-up?

> Claude's review is input to your judgement, not a replacement for it. It will sometimes flag things that are not problems, and occasionally miss things that are. Your job is to evaluate the output, not accept it wholesale.

---

## Step 5 — Write a PR summary (~3 min)

Run:

```
/prepare-pr-summary
```

Claude will read the diff and produce a PR description. Review what it writes — is the summary accurate? Does it explain the *why* of the billing bug, not just the *what*? Edit it if anything is missing or wrong.

---

## Deliverable

By the end of Exercise 4 you should have:
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
