# Module Selection Design

**Date:** 2026-06-09
**Status:** Approved

## Goal

Allow facilitators to choose which modules are shown in the workshop docs site before participants clone the repo. The selection is committed to git so all participants automatically get the configured view.

## Approach

A `workshop.json` file at the repo root lists the module IDs to include. `config.ts` imports this file and filters the `modules` array before exporting it. No changes are needed to any component.

## Files changed

| File | Change |
|------|--------|
| `workshop.json` | New file — lists enabled module IDs |
| `docs-site/src/config.ts` | Import `workshop.json`; filter `modules` before export |
| `README.md` | Add facilitator section explaining how to configure modules |
| `docs-site/src/__tests__/` | Unit test for filtering logic |

## `workshop.json` format

```json
{ "modules": ["setup", "module-1", "module-2", "module-3", "module-4"] }
```

The default includes all modules so the repo works out of the box. Facilitators remove IDs they don't need and commit.

## `config.ts` change

The current export becomes two declarations: `allModules` (the full static array, unchanged) and `modules` (filtered by `workshop.json`):

```ts
import workshopConfig from '../../workshop.json'

const allModules: Module[] = [ /* existing array */ ]

export const modules: Module[] = allModules.filter(
  (m) => workshopConfig.modules.includes(m.id)
)
```

The existing `status === 'ready'` filter in `Nav` and `Sidebar` is left as-is — it controls modules that aren't built yet, which is a separate concern from modules not in scope for a given workshop.

## Edge cases

- **Unknown ID in `workshop.json`** — silently ignored; the filter produces nothing for it
- **Empty `modules` array** — no modules shown; valid, not a crash
- **Missing `modules` key** — caught at build time by TypeScript (typed import)

## Testing

- The existing component tests mock `config.ts` directly and are unaffected
- Add a unit test that verifies the filtering logic: given a `workshop.json` with a subset of IDs, only those modules are exported

## README addition

Add a short "Configuring modules for a workshop" block to the facilitator section of `README.md`, explaining that facilitators edit `workshop.json`, commit it, and participants get the filtered view on clone.
