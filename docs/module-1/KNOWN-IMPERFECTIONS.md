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

**Fix:** Extract a `parseTicketInput(input: Record<string, unknown>): Ticket` function that handles coercion. `processTicket` calls `parseTicketInput`, then calls domain functions. The domain functions receive a typed `Ticket`, not raw input.

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
