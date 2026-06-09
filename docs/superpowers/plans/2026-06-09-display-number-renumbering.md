# Display Number Renumbering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a subset of modules is selected via `workshop.json`, displayed module numbers reflect their position in the selected set (not their canonical number), with the `setup` module always keeping `'00'`.

**Architecture:** Add an exported `assignDisplayNumbers` function to `config.ts` that remaps the `number` field after filtering. The `modules` export chains it after `filterModules`. Since `number` is purely presentational (routing uses `id`), no component changes are needed.

**Tech Stack:** TypeScript, Vitest

---

### Task 1: Add `assignDisplayNumbers` to `config.ts` (TDD)

**Files:**
- Modify: `docs-site/src/config.ts`
- Modify: `docs-site/src/__tests__/config.test.ts`

- [ ] **Step 1: Write the failing tests**

Add the following `describe` block to `docs-site/src/__tests__/config.test.ts`, after the existing `filterModules` tests. Also add `assignDisplayNumbers` to the import at the top of the file.

Import line (update the existing import):
```ts
import { filterModules, assignDisplayNumbers } from '../config'
```

New tests:
```ts
describe('assignDisplayNumbers', () => {
  it('setup module keeps number 00', () => {
    const mods = [{ ...makeModule('setup'), number: '00' }]
    expect(assignDisplayNumbers(mods)[0].number).toBe('00')
  })

  it('non-setup modules get sequential two-digit numbers from 01', () => {
    const mods = [makeModule('module-1'), makeModule('module-2'), makeModule('module-3')]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['01', '02', '03'])
  })

  it('fills gaps from a sparse selection', () => {
    const mods = [makeModule('module-1'), makeModule('module-2'), makeModule('module-4')]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['01', '02', '03'])
  })

  it('setup in a mixed list does not consume a counter slot', () => {
    const mods = [
      { ...makeModule('setup'), number: '00' },
      makeModule('module-2'),
      makeModule('module-4'),
    ]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['00', '01', '02'])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -A3 "assignDisplayNumbers"
```

Expected: all four `assignDisplayNumbers` tests fail with an import error (function not exported yet).

- [ ] **Step 3: Add `assignDisplayNumbers` to `config.ts`**

Add this export immediately after the `filterModules` function in `docs-site/src/config.ts`:

```ts
export function assignDisplayNumbers(mods: Module[]): Module[] {
  let counter = 0
  return mods.map((m) => ({
    ...m,
    number: m.id === 'setup' ? m.number : String(++counter).padStart(2, '0'),
  }))
}
```

Then update the `modules` export at the bottom of the file from:

```ts
export const modules: Module[] = filterModules(allModules, workshopConfig.modules)
```

to:

```ts
export const modules: Module[] = assignDisplayNumbers(
  filterModules(allModules, workshopConfig.modules)
)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -A3 "assignDisplayNumbers"
```

Expected: all four `assignDisplayNumbers` tests pass.

- [ ] **Step 5: Run the full test suite and typecheck**

```bash
cd docs-site && npm test && cd .. && npm run typecheck
```

Expected: all tests pass (including the existing `Nav.test.tsx`, `ModuleCard.test.tsx`, and `filterModules` tests), no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/__tests__/config.test.ts
git commit -m "feat: renumber displayed modules to reflect selection order"
```
