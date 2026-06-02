# Demo Repo Setup Design: ai-development-ws-ticket-demo

**Date:** 2026-06-02  
**Status:** Approved  
**Repo:** `superluminar-io/ai-development-ws-ticket-demo`

> **All implementation work happens in the demo repo (`ai-development-ws-ticket-demo`).** This spec is stored in the workshop repo for reference, but every file created, every commit made, and the GitHub issue/PR setup all target the demo repo. Nothing in the workshop repo (`ai-development-ws`) changes during implementation.

---

## Purpose

This repo is the read-only review target for Module 2 of the AI Development Workshop. It extends the workshop by providing the realistic product codebase that participants review via GitHub MCP — they never clone or commit to it themselves. It must look like a genuine TypeScript product repo with meaningful history, open issues, and a carefully constructed PR containing three planted teaching issues.

---

## Service: Notification Preferences

A simple TypeScript service for managing user notification preferences. Pure functions, no HTTP layer — same structural pattern as the ticket processor (familiar shape, different domain).

### File Structure

```
src/
  domain/
    preference.ts        # NotificationPreference type, Channel, Priority, QuietHours
    notifier.ts          # computeEffectivePriority, shouldSendNow
  handlers/
    updatePreference.ts  # parseInput + updatePreference handler
  utils/
    time.ts              # isWithinQuietHours helper
test/
  domain/
    notifier.test.ts
  handlers/
    updatePreference.test.ts
examples/
  preferences/
    email-preference.json
    sms-urgent.json
package.json
tsconfig.json
vitest.config.ts
.gitignore
README.md
```

### Core Types (src/domain/preference.ts)

```typescript
export type Channel = 'email' | 'sms' | 'push'
export type Priority = 'low' | 'medium' | 'urgent'

export type QuietHours = {
  startHour: number   // 0–23, inclusive
  endHour: number     // 0–23, inclusive
}

export type NotificationPreference = {
  userId: string
  channel: Channel
  priority: Priority
  quietHours?: QuietHours
}

export type PreferenceResult = {
  userId: string
  channel: Channel
  effectivePriority: Priority
  willSendNow: boolean
  reason: string
}
```

### Core Logic (src/domain/notifier.ts)

```typescript
// shouldSendNow: returns true if notification should be sent
// urgent priority bypasses quiet hours
// other priorities respect quiet hours
export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean

// computeEffectivePriority: returns the priority that governs delivery
// currently just returns pref.priority — extended by the feature branch
export function computeEffectivePriority(pref: NotificationPreference): Priority
```

### Time Utility (src/utils/time.ts)

```typescript
// isWithinQuietHours: handles overnight ranges (e.g. 22–06)
export function isWithinQuietHours(quietHours: QuietHours, currentHour: number): boolean
```

### Handler (src/handlers/updatePreference.ts)

Accepts `Record<string, unknown>`, validates required fields, constructs `NotificationPreference`, calls domain functions, returns `PreferenceResult | undefined` (intentionally imperfect — mirrors the ticket processor pattern participants already know).

---

## Commit History (5 commits on main)

| # | Message | What it adds |
|---|---------|--------------|
| 1 | `feat: initialise notification preferences service` | package.json, tsconfig, .gitignore, src/domain/preference.ts |
| 2 | `feat: add shouldSendNow logic for priority-based delivery` | src/domain/notifier.ts (without quiet hours yet) |
| 3 | `feat: add quiet hours support` | src/utils/time.ts, update notifier.ts, update preference.ts |
| 4 | `feat: add updatePreference handler and example fixtures` | src/handlers/, examples/ |
| 5 | `test: add tests for notifier and handler` | test/ |

All 5 commits on `main`. Tests pass on `main`.

---

## GitHub Issues

### Issue #1 (open) — linked to the PR

**Title:** "Add admin priority override for compliance notifications"

**Body:**
```
Compliance team needs a way to force urgent delivery for certain notification types,
regardless of the user's channel priority setting.

Requirements:
- Add a `priorityOverride` field to NotificationPreference
- When set to 'urgent', quiet hours must be bypassed — compliance notifications
  must go through even during the user's quiet hours
- Only admin users should be able to set priorityOverride; regular users must not
  be able to set this field themselves
- When not set, existing priority and quiet hours behaviour is unchanged
```

### Issue #2 (open) — not related to the PR

**Title:** "Support multiple notification channels per user"

**Body:**
```
Currently a NotificationPreference is one-to-one with a channel. We should
support multiple channels per user with per-channel priority settings.

This would let a user set email as low priority but SMS as urgent, for example.
Out of scope for the current milestone — tracking for future work.
```

---

## Feature Branch: feature/add-priority-override

One commit on top of `main`. PR linked to Issue #1.

### PR Title

"feat: add priorityOverride field for admin-controlled delivery"

### PR Description

```
Adds `priorityOverride` field to `NotificationPreference`. When set by an admin,
this overrides the channel's default priority. Used by admin tools to force urgent
delivery for compliance notifications.

Changes:
- New optional `priorityOverride` field on NotificationPreference
- computeEffectivePriority now returns priorityOverride when present
- Handler accepts priorityOverride from input

Closes #1
```

### Three Planted Issues in the Branch Code

**Imperfection 1 — Tier 1 (visible in diff):**  
`priorityOverride` is typed as `string` instead of `Priority` (`'low' | 'medium' | 'urgent'`).

```typescript
// What the branch has (wrong):
type NotificationPreference = {
  ...
  priorityOverride?: string   // should be: Priority
}
```

**Imperfection 2 — Tier 2 (visible with PR description):**  
`computeEffectivePriority` returns `priorityOverride` even when the existing `priority` is already `'urgent'`. The PR description says it "overrides the channel's default priority" — implying it should only activate when the current priority is not already urgent. The implementation ignores this.

```typescript
// What the branch has (wrong):
export function computeEffectivePriority(pref: NotificationPreference): Priority {
  if (pref.priorityOverride) {
    return pref.priorityOverride as Priority   // activates unconditionally
  }
  return pref.priority
}
```

**Imperfection 3 — Tier 3 (visible only with linked issue):**  
`computeEffectivePriority` is called in `shouldSendNow` but the branch implementation only calls it for the return value — it does NOT use it for the quiet hours bypass check. Instead, `shouldSendNow` only bypasses quiet hours when `pref.priority === 'urgent'` (the original priority field), not when `priorityOverride` is `'urgent'`. So a user with `priority: 'low'` and `priorityOverride: 'urgent'` will still be blocked by quiet hours, which contradicts Issue #1.

```typescript
// What the branch has (wrong):
export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean {
  if (pref.priority === 'urgent') return true   // bug: checks pref.priority, not computeEffectivePriority
  if (pref.quietHours) {
    return !isWithinQuietHours(pref.quietHours, currentHour)
  }
  return true
}

// What it should do (correct):
export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean {
  const effective = computeEffectivePriority(pref)
  if (effective === 'urgent') return true   // bypasses quiet hours for both native and override urgent
  if (pref.quietHours) {
    return !isWithinQuietHours(pref.quietHours, currentHour)
  }
  return true
}
```

The bug is only visible if you know from Issue #1 that `priorityOverride: 'urgent'` should bypass quiet hours. Without that context, the code looks reasonable.

---

## Automation

Everything is created programmatically inside the demo repo (`ai-development-ws-ticket-demo`):
- Git repo initialised locally
- 5 commits made on `main`
- Pushed to `superluminar-io/ai-development-ws-ticket-demo`
- Issue #1 created via `gh issue create`
- Issue #2 created via `gh issue create`
- Feature branch created locally and pushed
- PR created via `gh pr create` linking to Issue #1

The workshop repo (`ai-development-ws`) is not touched during any of these steps. No manual GitHub steps required after running the plan.

---

## Testing

Tests on `main` must pass (service is correct on main). Tests on the feature branch are not required to fail — the planted issues are logic/type issues, not test failures. The branch code passes tests because the test suite on `main` does not cover the `priorityOverride` path (it didn't exist yet).

---

## Out of Scope

- HTTP server or REST endpoints
- Authentication or actual admin role checking
- Persistent storage
- The `priorityOverride` admin restriction (Issue #1 mentions it; the branch code does not implement it — this is intentional, part of Imperfection 2's teaching moment)
