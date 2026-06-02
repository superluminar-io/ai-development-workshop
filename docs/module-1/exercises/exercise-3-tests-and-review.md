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
