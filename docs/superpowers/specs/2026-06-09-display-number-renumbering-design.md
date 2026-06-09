# Display Number Renumbering Design

**Date:** 2026-06-09
**Status:** Approved

## Goal

When a facilitator selects a subset of modules via `workshop.json`, the displayed module numbers reflect the position of each module in the selected set rather than the original canonical number. The `setup` module always displays as "Setup" (number `'00'`) regardless of selection.

## Approach

Add a private `assignDisplayNumbers` function to `docs-site/src/config.ts`. It is called after `filterModules` on the `modules` export. It remaps the `number` field on each module in-place. Since `number` is used only for display (routing and identification use `id`), this requires no component changes.

## Data Flow

```
allModules
  → filterModules(allModules, workshopConfig.modules)
  → assignDisplayNumbers(filtered)
  → modules  (exported)
```

## Implementation

```ts
function assignDisplayNumbers(mods: Module[]): Module[] {
  let counter = 0
  return mods.map((m) => ({
    ...m,
    number: m.id === 'setup' ? m.number : String(++counter).padStart(2, '0'),
  }))
}

export const modules = assignDisplayNumbers(
  filterModules(allModules, workshopConfig.modules)
)
```

### Example

`workshop.json`: `["setup", "module-1", "module-2", "module-4"]`

| Module id  | Original number | Display number |
|------------|----------------|----------------|
| `setup`    | `'00'`         | `'00'`         |
| `module-1` | `'01'`         | `'01'`         |
| `module-2` | `'02'`         | `'02'`         |
| `module-4` | `'04'`         | `'03'`         |

`workshop.json`: `["setup", "module-2", "module-4"]`

| Module id  | Original number | Display number |
|------------|----------------|----------------|
| `setup`    | `'00'`         | `'00'`         |
| `module-2` | `'02'`         | `'01'`         |
| `module-4` | `'04'`         | `'02'`         |

## Files Changed

| File | Change |
|------|--------|
| `docs-site/src/config.ts` | Add `assignDisplayNumbers`; chain it onto the `modules` export |
| `docs-site/src/__tests__/config.test.ts` | Add unit tests for `assignDisplayNumbers` |

No component changes required.

## Tests

Cases to cover in `config.test.ts`:

- Setup module always keeps `'00'`
- Numbered modules get sequential two-digit numbers starting from `'01'`
- A gap in selection (e.g. 1, 2, 4) produces `'01'`, `'02'`, `'03'`
- Setup in any list position does not consume a counter slot
