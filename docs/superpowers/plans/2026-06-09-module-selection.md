# Module Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow facilitators to commit a `workshop.json` file that controls which modules the docs site displays.

**Architecture:** A `workshop.json` at the repo root lists enabled module IDs. `config.ts` imports it and filters the `allModules` array through a pure `filterModules` function before exporting `modules`. All components consume `modules` unchanged.

**Tech Stack:** TypeScript, Vite, React, Vitest

---

### Task 1: Add `filterModules` to `config.ts` (TDD)

**Files:**
- Modify: `docs-site/src/config.ts`
- Create: `docs-site/src/__tests__/config.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `docs-site/src/__tests__/config.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { filterModules } from '../config'
import type { Module } from '../config'

const makeModule = (id: string): Module => ({
  id,
  number: '01',
  title: 'Test',
  description: 'desc',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: [],
})

describe('filterModules', () => {
  it('returns only modules whose id appears in the enabled list', () => {
    const all = [makeModule('setup'), makeModule('module-1'), makeModule('module-2')]
    expect(filterModules(all, ['setup', 'module-2'])).toEqual([
      makeModule('setup'),
      makeModule('module-2'),
    ])
  })

  it('returns an empty array when enabled list is empty', () => {
    const all = [makeModule('module-1')]
    expect(filterModules(all, [])).toEqual([])
  })

  it('ignores ids in the enabled list that have no matching module', () => {
    const all = [makeModule('module-1')]
    expect(filterModules(all, ['module-1', 'does-not-exist'])).toEqual([makeModule('module-1')])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -A3 "filterModules"
```

Expected: `filterModules` tests fail with "filterModules is not a function" (or similar import error).

- [ ] **Step 3: Export `filterModules` from `config.ts`**

Add the following export to `docs-site/src/config.ts` immediately before the `modules` array declaration:

```ts
export function filterModules(all: Module[], enabledIds: string[]): Module[] {
  return all.filter((m) => enabledIds.includes(m.id))
}
```

Do not change anything else yet — the `modules` export stays as-is for now.

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -A3 "filterModules"
```

Expected: all three `filterModules` tests pass.

- [ ] **Step 5: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/__tests__/config.test.ts
git commit -m "feat: add filterModules utility to config"
```

---

### Task 2: Create `workshop.json` and wire it into `config.ts`

**Files:**
- Create: `workshop.json` (repo root)
- Modify: `docs-site/src/config.ts`

- [ ] **Step 1: Create `workshop.json` at the repo root**

```json
{
  "modules": ["setup", "module-1", "module-2", "module-3", "module-4"]
}
```

- [ ] **Step 2: Update `config.ts` to use `workshop.json`**

At the top of `docs-site/src/config.ts`, add the import (after any existing imports):

```ts
import workshopConfig from '../../workshop.json'
```

Then rename the existing `modules` export to `allModules` (keep the type annotation):

```ts
const allModules: Module[] = [
  // ... existing array contents, unchanged ...
]
```

Replace the original `export const modules` line with:

```ts
export const modules: Module[] = filterModules(allModules, workshopConfig.modules)
```

After your edits, the bottom of the file should look like this (the `allModules` array contents are unchanged from the original):

```ts
// ... interfaces and filterModules unchanged above ...

const allModules: Module[] = [
  // keep the five existing module objects exactly as they were
]

export const modules: Module[] = filterModules(allModules, workshopConfig.modules)
```

The only diff from the original is: (a) `import workshopConfig` added at the top, (b) `export const modules` renamed to `const allModules`, (c) one new line exporting `modules` via `filterModules`.

- [ ] **Step 3: Run the full test suite and typecheck**

```bash
cd docs-site && npm test && cd .. && npm run typecheck
```

Expected: all tests pass (including the existing `Nav.test.tsx` and `ModuleCard.test.tsx`), no TypeScript errors.

If `Nav.test.tsx` fails because it expects all ready modules to be present — that is correct behaviour with the default `workshop.json`, so it should still pass. If it does fail, verify that `workshop.json` includes all five module IDs.

- [ ] **Step 4: Commit**

```bash
git add workshop.json docs-site/src/config.ts
git commit -m "feat: filter modules by workshop.json"
```

---

### Task 3: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add facilitator configuration section to `README.md`**

Locate the `## For facilitators` section. After the existing list of facilitator guide links and before the `---` separator (or at the end of the section), add:

```markdown
### Configuring modules for a workshop

Edit `workshop.json` at the repo root before participants clone the repo:

```json
{ "modules": ["setup", "module-1", "module-2"] }
```

List the module IDs you want to include. Participants who clone the repo will only see those modules in the docs site. The default includes all modules.

Available module IDs: `setup`, `module-1`, `module-2`, `module-3`, `module-4`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document workshop.json module configuration"
```
