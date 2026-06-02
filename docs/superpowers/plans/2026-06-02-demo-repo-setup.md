# Demo Repo Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **IMPORTANT: All implementation work happens in the demo repo (`ai-development-ws-ticket-demo`), NOT in this workshop repo.** This plan file lives in the workshop repo for reference only. Every `git`, `npm`, and file creation command in this plan must be run from inside the demo repo directory.

**Goal:** Set up the `ai-development-ws-ticket-demo` repo as a realistic TypeScript notification preferences service with 5 commits of history, 2 GitHub issues, and an open PR containing 3 precisely planted teaching issues for the Module 2 workshop exercises.

**Architecture:** Pure TypeScript functions (no HTTP), same structural pattern as the ticket processor. Main branch is correct and all tests pass. Feature branch adds `priorityOverride` with three planted bugs: one type regression visible in the diff, one logic issue visible with the PR description, and one quiet-hours bypass visible only with the linked GitHub issue.

**Tech Stack:** TypeScript 5.x, Vitest 2.x, Node 20+, GitHub CLI (`gh`) for issue and PR creation

---

## File Map

```
# Created in the demo repo (ai-development-ws-ticket-demo)

package.json
tsconfig.json
vitest.config.ts
.gitignore
README.md

src/
  domain/
    preference.ts        # NotificationPreference type, Channel, Priority, QuietHours, PreferenceResult
    notifier.ts          # computeEffectivePriority, shouldSendNow
  handlers/
    updatePreference.ts  # input parsing + domain calls, returns PreferenceResult | undefined
  utils/
    time.ts              # isWithinQuietHours (handles overnight ranges)

test/
  domain/
    notifier.test.ts
  handlers/
    updatePreference.test.ts

examples/
  preferences/
    email-preference.json
    sms-urgent.json
```

---

## Phase 1: Main Branch — Correct Service

### Task 1: Project Scaffold and Domain Types

**Working directory:** `ai-development-ws-ticket-demo`

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `README.md`
- Create: `src/domain/preference.ts`

- [ ] **Step 1: Initialise git**

```bash
git init
git branch -m main
```

Expected: `Initialized empty Git repository`

- [ ] **Step 2: Create package.json**

```json
{
  "name": "notification-preferences",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.DS_Store
coverage/
```

- [ ] **Step 6: Create README.md**

```markdown
# Notification Preferences Service

A TypeScript service for managing user notification preferences — channel selection, priority levels, and quiet hours.

## Scripts

```bash
npm test          # run all tests
npm run typecheck # TypeScript strict check
```

## Domain

A `NotificationPreference` defines how and when a user receives notifications:
- **channel**: `email`, `sms`, or `push`
- **priority**: `low`, `medium`, or `urgent`
- **quietHours**: optional time window during which non-urgent notifications are suppressed
```

- [ ] **Step 7: Create src/domain/preference.ts**

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

- [ ] **Step 8: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts .gitignore README.md src/domain/preference.ts package-lock.json
git commit -m "feat: initialise notification preferences service"
```

---

### Task 2: Notifier — Core Logic and Tests

**Files:**
- Create: `src/domain/notifier.ts` (without quiet hours — added in Task 3)
- Create: `test/domain/notifier.test.ts` (basic tests, quiet hours tests added in Task 3)

- [ ] **Step 1: Write the failing tests**

Create `test/domain/notifier.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { shouldSendNow, computeEffectivePriority } from '../../src/domain/notifier'
import type { NotificationPreference } from '../../src/domain/preference'

const base: NotificationPreference = {
  userId: 'U-001',
  channel: 'email',
  priority: 'low',
}

describe('computeEffectivePriority', () => {
  it('returns the preference priority', () => {
    expect(computeEffectivePriority(base)).toBe('low')
  })

  it('returns urgent for urgent preferences', () => {
    expect(computeEffectivePriority({ ...base, priority: 'urgent' })).toBe('urgent')
  })
})

describe('shouldSendNow', () => {
  it('sends urgent notifications immediately', () => {
    expect(shouldSendNow({ ...base, priority: 'urgent' }, 3)).toBe(true)
  })

  it('sends when no quiet hours are set', () => {
    expect(shouldSendNow(base, 14)).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../../src/domain/notifier'`

- [ ] **Step 3: Create src/domain/notifier.ts**

```typescript
import type { NotificationPreference, Priority } from './preference'

export function computeEffectivePriority(pref: NotificationPreference): Priority {
  return pref.priority
}

export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean {
  const effective = computeEffectivePriority(pref)
  if (effective === 'urgent') return true
  return true   // quiet hours support added in next commit
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected: 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/domain/notifier.ts test/domain/notifier.test.ts
git commit -m "feat: add shouldSendNow and computeEffectivePriority"
```

---

### Task 3: Quiet Hours Support

**Files:**
- Create: `src/utils/time.ts`
- Modify: `src/domain/notifier.ts` (add quiet hours to `shouldSendNow`)
- Modify: `test/domain/notifier.test.ts` (add quiet hours tests)

- [ ] **Step 1: Write the failing quiet hours tests**

Replace `test/domain/notifier.test.ts` entirely with:

```typescript
import { describe, it, expect } from 'vitest'
import { shouldSendNow, computeEffectivePriority } from '../../src/domain/notifier'
import type { NotificationPreference } from '../../src/domain/preference'

const base: NotificationPreference = {
  userId: 'U-001',
  channel: 'email',
  priority: 'low',
}

describe('computeEffectivePriority', () => {
  it('returns the preference priority', () => {
    expect(computeEffectivePriority(base)).toBe('low')
  })

  it('returns urgent for urgent preferences', () => {
    expect(computeEffectivePriority({ ...base, priority: 'urgent' })).toBe('urgent')
  })
})

describe('shouldSendNow', () => {
  it('sends urgent notifications immediately', () => {
    expect(shouldSendNow({ ...base, priority: 'urgent' }, 3)).toBe(true)
  })

  it('sends when no quiet hours are set', () => {
    expect(shouldSendNow(base, 14)).toBe(true)
  })

  it('suppresses during overnight quiet hours', () => {
    const pref: NotificationPreference = {
      ...base,
      quietHours: { startHour: 22, endHour: 8 },
    }
    expect(shouldSendNow(pref, 2)).toBe(false)   // 2am is within 22–8
  })

  it('sends outside overnight quiet hours', () => {
    const pref: NotificationPreference = {
      ...base,
      quietHours: { startHour: 22, endHour: 8 },
    }
    expect(shouldSendNow(pref, 14)).toBe(true)   // 2pm is outside 22–8
  })

  it('urgent bypasses quiet hours', () => {
    const pref: NotificationPreference = {
      ...base,
      priority: 'urgent',
      quietHours: { startHour: 22, endHour: 8 },
    }
    expect(shouldSendNow(pref, 2)).toBe(true)   // urgent ignores quiet hours
  })

  it('handles same-day quiet hours range', () => {
    const pref: NotificationPreference = {
      ...base,
      quietHours: { startHour: 9, endHour: 17 },
    }
    expect(shouldSendNow(pref, 12)).toBe(false)   // noon is within 9–17
    expect(shouldSendNow(pref, 20)).toBe(true)    // 8pm is outside 9–17
  })
})
```

- [ ] **Step 2: Run tests — verify new tests fail**

```bash
npm test
```

Expected: 3 new tests FAIL (quiet hours not yet implemented).

- [ ] **Step 3: Create src/utils/time.ts**

```typescript
import type { QuietHours } from '../domain/preference'

export function isWithinQuietHours(quietHours: QuietHours, currentHour: number): boolean {
  const { startHour, endHour } = quietHours
  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour <= endHour
  }
  // Overnight range (e.g. 22–8)
  return currentHour >= startHour || currentHour <= endHour
}
```

- [ ] **Step 4: Update src/domain/notifier.ts to use quiet hours**

Replace the entire file:

```typescript
import type { NotificationPreference, Priority } from './preference'
import { isWithinQuietHours } from '../utils/time'

export function computeEffectivePriority(pref: NotificationPreference): Priority {
  return pref.priority
}

export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean {
  const effective = computeEffectivePriority(pref)
  if (effective === 'urgent') return true
  if (pref.quietHours) {
    return !isWithinQuietHours(pref.quietHours, currentHour)
  }
  return true
}
```

- [ ] **Step 5: Run tests — verify all pass**

```bash
npm test
```

Expected: 8 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/utils/time.ts src/domain/notifier.ts test/domain/notifier.test.ts
git commit -m "feat: add quiet hours support with overnight range handling"
```

---

### Task 4: Handler and Handler Tests

**Files:**
- Create: `src/handlers/updatePreference.ts`
- Create: `test/handlers/updatePreference.test.ts`

- [ ] **Step 1: Write the failing handler tests**

Create `test/handlers/updatePreference.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { updatePreference } from '../../src/handlers/updatePreference'

describe('updatePreference', () => {
  it('returns undefined when userId is missing', () => {
    expect(updatePreference({ channel: 'email', priority: 'low' })).toBeUndefined()
  })

  it('returns undefined when channel is missing', () => {
    expect(updatePreference({ userId: 'U-001', priority: 'low' })).toBeUndefined()
  })

  it('returns undefined when priority is missing', () => {
    expect(updatePreference({ userId: 'U-001', channel: 'email' })).toBeUndefined()
  })

  it('processes a valid low-priority email preference', () => {
    const result = updatePreference({
      userId: 'U-001',
      channel: 'email',
      priority: 'low',
    })
    expect(result).toBeDefined()
    expect(result?.userId).toBe('U-001')
    expect(result?.channel).toBe('email')
    expect(result?.effectivePriority).toBe('low')
    expect(result?.willSendNow).toBe(true)
  })

  it('sends urgent notifications even with all-day quiet hours', () => {
    const result = updatePreference({
      userId: 'U-002',
      channel: 'sms',
      priority: 'urgent',
      quietHours: { startHour: 0, endHour: 23 },
    })
    expect(result?.willSendNow).toBe(true)
    expect(result?.effectivePriority).toBe('urgent')
  })
})
```

- [ ] **Step 2: Run tests — verify handler tests fail**

```bash
npm test
```

Expected: 5 new tests FAIL — `Cannot find module '../../src/handlers/updatePreference'`

- [ ] **Step 3: Create src/handlers/updatePreference.ts**

```typescript
import type { NotificationPreference, PreferenceResult } from '../domain/preference'
import { computeEffectivePriority, shouldSendNow } from '../domain/notifier'

export function updatePreference(input: Record<string, unknown>): PreferenceResult | undefined {
  if (!input.userId || !input.channel || !input.priority) {
    return undefined
  }

  const pref: NotificationPreference = {
    userId: String(input.userId),
    channel: input.channel as NotificationPreference['channel'],
    priority: input.priority as NotificationPreference['priority'],
    quietHours: input.quietHours as NotificationPreference['quietHours'],
  }

  const currentHour = new Date().getHours()
  const effectivePriority = computeEffectivePriority(pref)
  const willSendNow = shouldSendNow(pref, currentHour)

  return {
    userId: pref.userId,
    channel: pref.channel,
    effectivePriority,
    willSendNow,
    reason: willSendNow
      ? `Sending via ${pref.channel} (priority: ${effectivePriority})`
      : `Suppressed — within quiet hours (priority: ${effectivePriority})`,
  }
}
```

- [ ] **Step 4: Run all tests — verify 13 pass**

```bash
npm test && npm run typecheck
```

Expected: 13 tests passing, 0 TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/handlers/updatePreference.ts test/handlers/updatePreference.test.ts
git commit -m "feat: add updatePreference handler with input validation"
```

---

### Task 5: Example Fixtures

**Files:**
- Create: `examples/preferences/email-preference.json`
- Create: `examples/preferences/sms-urgent.json`

- [ ] **Step 1: Create examples/preferences/email-preference.json**

```json
{
  "userId": "U-001",
  "channel": "email",
  "priority": "low",
  "quietHours": {
    "startHour": 22,
    "endHour": 8
  }
}
```

- [ ] **Step 2: Create examples/preferences/sms-urgent.json**

```json
{
  "userId": "U-002",
  "channel": "sms",
  "priority": "urgent"
}
```

- [ ] **Step 3: Run final verification**

```bash
npm test
```

Expected: 13 tests passing.

- [ ] **Step 4: Commit**

```bash
git add examples/
git commit -m "feat: add example preference fixtures"
```

---

## Phase 2: Push to GitHub and Create Issues

### Task 6: Push Main Branch

- [ ] **Step 1: Add remote and push**

```bash
git remote add origin git@github.com:superluminar-io/ai-development-ws-ticket-demo.git
git push -u origin main
```

Expected: main branch pushed, all 5 commits visible on GitHub.

- [ ] **Step 2: Verify push**

```bash
gh repo view superluminar-io/ai-development-ws-ticket-demo --web
```

Confirm 5 commits are visible on GitHub.

---

### Task 7: Create GitHub Issues

- [ ] **Step 1: Create Issue #1 — the one linked to the PR**

```bash
gh issue create \
  --repo superluminar-io/ai-development-ws-ticket-demo \
  --title "Add admin priority override for compliance notifications" \
  --body "$(cat <<'EOF'
Compliance team needs a way to force urgent delivery for certain notification types,
regardless of the user's channel priority setting.

Requirements:
- Add a \`priorityOverride\` field to NotificationPreference
- When set to \`'urgent'\`, quiet hours must be bypassed — compliance notifications
  must go through even during the user's quiet hours
- Only admin users should be able to set priorityOverride; regular users must not
  be able to set this field themselves
- When not set, existing priority and quiet hours behaviour is unchanged
EOF
)"
```

Expected output: Issue URL printed, e.g. `https://github.com/superluminar-io/ai-development-ws-ticket-demo/issues/1`

Note the issue number — you need it for the PR in Task 9.

- [ ] **Step 2: Create Issue #2 — unrelated future work**

```bash
gh issue create \
  --repo superluminar-io/ai-development-ws-ticket-demo \
  --title "Support multiple notification channels per user" \
  --body "$(cat <<'EOF'
Currently a NotificationPreference is one-to-one with a channel. We should
support multiple channels per user with per-channel priority settings.

This would let a user set email as low priority but SMS as urgent, for example.
Out of scope for the current milestone — tracking for future work.
EOF
)"
```

Expected: Issue #2 created.

---

## Phase 3: Feature Branch with Planted Bugs

### Task 8: Create Feature Branch with Three Planted Issues

**Files:**
- Modify: `src/domain/preference.ts` (add `priorityOverride?: string` — Bug 1)
- Modify: `src/domain/notifier.ts` (two bugs in the logic — Bugs 2 and 3)

- [ ] **Step 1: Create and switch to feature branch**

```bash
git checkout -b feature/add-priority-override
```

- [ ] **Step 2: Update src/domain/preference.ts to add priorityOverride**

Replace the entire file with:

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
  priorityOverride?: string   // Bug 1: should be Priority, not string
}

export type PreferenceResult = {
  userId: string
  channel: Channel
  effectivePriority: Priority
  willSendNow: boolean
  reason: string
}
```

- [ ] **Step 3: Update src/domain/notifier.ts with the two logic bugs**

Replace the entire file with:

```typescript
import type { NotificationPreference, Priority } from './preference'
import { isWithinQuietHours } from '../utils/time'

export function computeEffectivePriority(pref: NotificationPreference): Priority {
  if (pref.priorityOverride) {
    return pref.priorityOverride as Priority   // Bug 2: activates even when pref.priority is already 'urgent'
  }
  return pref.priority
}

export function shouldSendNow(pref: NotificationPreference, currentHour: number): boolean {
  if (pref.priority === 'urgent') return true   // Bug 3: checks pref.priority, not computeEffectivePriority
  if (pref.quietHours) {
    return !isWithinQuietHours(pref.quietHours, currentHour)
  }
  return true
}
```

- [ ] **Step 4: Update src/handlers/updatePreference.ts to pass priorityOverride through**

Replace the `pref` construction block only (lines 9–15 of the handler):

```typescript
import type { NotificationPreference, PreferenceResult } from '../domain/preference'
import { computeEffectivePriority, shouldSendNow } from '../domain/notifier'

export function updatePreference(input: Record<string, unknown>): PreferenceResult | undefined {
  if (!input.userId || !input.channel || !input.priority) {
    return undefined
  }

  const pref: NotificationPreference = {
    userId: String(input.userId),
    channel: input.channel as NotificationPreference['channel'],
    priority: input.priority as NotificationPreference['priority'],
    quietHours: input.quietHours as NotificationPreference['quietHours'],
    priorityOverride: input.priorityOverride !== undefined ? String(input.priorityOverride) : undefined,
  }

  const currentHour = new Date().getHours()
  const effectivePriority = computeEffectivePriority(pref)
  const willSendNow = shouldSendNow(pref, currentHour)

  return {
    userId: pref.userId,
    channel: pref.channel,
    effectivePriority,
    willSendNow,
    reason: willSendNow
      ? `Sending via ${pref.channel} (priority: ${effectivePriority})`
      : `Suppressed — within quiet hours (priority: ${effectivePriority})`,
  }
}
```

- [ ] **Step 5: Run tests — verify all still pass**

```bash
npm test
```

Expected: 13 tests passing. The bugs exist but existing tests don't cover `priorityOverride` paths.

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors. (The `string` type for `priorityOverride` is loose but valid TypeScript.)

- [ ] **Step 7: Commit the feature branch**

```bash
git add src/domain/preference.ts src/domain/notifier.ts src/handlers/updatePreference.ts
git commit -m "feat: add priorityOverride field for admin-controlled delivery"
```

- [ ] **Step 8: Push feature branch**

```bash
git push -u origin feature/add-priority-override
```

---

## Phase 4: Create the Pull Request

### Task 9: Open PR on GitHub

- [ ] **Step 1: Create the PR**

Replace `<ISSUE_NUMBER>` with the number from Task 7 Step 1 (likely `1`):

```bash
gh pr create \
  --repo superluminar-io/ai-development-ws-ticket-demo \
  --title "feat: add priorityOverride field for admin-controlled delivery" \
  --body "$(cat <<'EOF'
Adds \`priorityOverride\` field to \`NotificationPreference\`. When set by an admin,
this overrides the channel's default priority. Used by admin tools to force urgent
delivery for compliance notifications.

Changes:
- New optional \`priorityOverride\` field on \`NotificationPreference\`
- \`computeEffectivePriority\` now returns \`priorityOverride\` when present
- Handler accepts and passes through \`priorityOverride\` from input

Closes #<ISSUE_NUMBER>
EOF
)" \
  --base main \
  --head feature/add-priority-override
```

Expected: PR URL printed, e.g. `https://github.com/superluminar-io/ai-development-ws-ticket-demo/pull/3`

- [ ] **Step 2: Verify PR is open and linked**

```bash
gh pr view --repo superluminar-io/ai-development-ws-ticket-demo
```

Expected: PR is open (not merged, not draft), linked to Issue #1.

- [ ] **Step 3: Final check — verify all three planted issues are present**

Confirm in the PR diff on GitHub:
- [ ] `priorityOverride?: string` visible in preference.ts diff (Bug 1)
- [ ] `computeEffectivePriority` returns override unconditionally in notifier.ts diff (Bug 2)
- [ ] `shouldSendNow` checks `pref.priority` not `computeEffectivePriority` in notifier.ts diff (Bug 3)

---

## Self-Review Notes

### Spec coverage

| Spec requirement | Task |
|---|---|
| 5 commits of realistic history on main | Tasks 1–5 |
| All tests pass on main | Tasks 2–4 (verified each time) |
| Issue #1 linked to PR with quiet hours requirement | Task 7 |
| Issue #2 unrelated future work | Task 7 |
| Feature branch with 1 commit | Task 8 |
| Bug 1: `priorityOverride?: string` | Task 8 Step 2 |
| Bug 2: override activates unconditionally | Task 8 Step 3 |
| Bug 3: `pref.priority` not `computeEffectivePriority` | Task 8 Step 3 |
| PR open, linked to Issue #1 | Task 9 |
| Tests still pass on feature branch | Task 8 Step 5 |
| No local paths in committed files | Confirmed — only repo names used |
