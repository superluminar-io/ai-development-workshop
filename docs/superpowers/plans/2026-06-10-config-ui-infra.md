# Config & UI Infra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the workshop config system and docs-site UI to support multi-track workshops with level/audience-tagged modules, step-by-step Next navigation, a track summary page, and level/audience badges on module cards.

**Architecture:** `workshop.json` adopts a `tracks` format (backwards-compatible with the old `modules` format). `config.ts` resolves tracks into typed `Module[]` arrays, filtering exercises by audience. A new `navigation.ts` utility computes the next page in the linear sequence. UI components (`ModuleCard`, `HomePage`, `ModulePage`, `SummaryPage`) consume the resolved data.

**Tech Stack:** TypeScript, React, React Router v6, Vite, Vitest, @testing-library/react

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `docs-site/src/config.ts` | Modify | Add `Track` type, `level`/`audience` to `Module`/`Exercise`, `resolveTracks`, new exports |
| `docs-site/src/__tests__/config.test.ts` | Modify | Extend for Track resolution, backwards compat, exercise filtering |
| `docs-site/src/utils/navigation.ts` | **Create** | Pure function `getNextPage` — linear page sequence |
| `docs-site/src/__tests__/navigation.test.ts` | **Create** | Unit tests for `getNextPage` |
| `docs-site/src/components/ModuleCard.tsx` | Modify | Add level + audience badges |
| `docs-site/src/__tests__/ModuleCard.test.tsx` | Modify | Update fixture, add badge assertions |
| `docs-site/src/__tests__/resolvePageFile.test.ts` | Modify | Add required `level`/`audience` to fixture |
| `docs-site/src/pages/HomePage.tsx` | Modify | Group modules by level under section headings |
| `docs-site/src/pages/ModulePage.tsx` | Modify | Compute and render Next button |
| `docs-site/src/pages/SummaryPage.tsx` | **Create** | Track summary page with End button |
| `docs-site/src/components/Sidebar.tsx` | Modify | Add Summary link at bottom |
| `docs-site/src/App.tsx` | Modify | Add `/summary` route |
| `docs-site/src/styles/global.css` | Modify | Add badge variants, section heading, page-nav, btn-next, btn-end |
| `workshop.json` | Modify | Update to tracks format |
| `docs/summaries/default.md` | **Create** | Default fallback summary content |
| `docs/module-1/participant-guide.md` | Modify | Remove `[Full instructions →]` links |
| `docs/module-2/participant-guide.md` | Modify | Remove `[Full instructions →]` links |
| `docs/module-3/participant-guide.md` | Modify | Remove `[Full instructions →]` links |
| `docs/module-4/participant-guide.md` | Modify | Remove `[Full instructions →]` links |
| `README.md` | Modify | Update facilitator section with new module IDs and track format |

---

## Task 1: Extend Module and Exercise types — add `level` and `audience`

**Files:**
- Modify: `docs-site/src/config.ts`
- Modify: `docs-site/src/__tests__/config.test.ts`
- Modify: `docs-site/src/__tests__/ModuleCard.test.tsx`
- Modify: `docs-site/src/__tests__/resolvePageFile.test.ts`

- [ ] **Step 1: Run typecheck to confirm current baseline**

```bash
cd docs-site && npm run typecheck
```
Expected: no errors.

- [ ] **Step 2: Add `level` and `audience` to the `Module` interface in `config.ts`**

Replace the existing `Module` interface:

```ts
export interface Module {
  id: string
  number: string
  title: string
  description: string
  status: 'ready' | 'coming-soon'
  participantGuide: string
  exercises: Exercise[]
  level: 'essentials' | 'advanced'
  audience: 'engineer' | 'business' | 'both'
}
```

Add an optional `audience` to the `Exercise` interface:

```ts
export interface Exercise {
  slug: string
  title: string
  file: string
  audience?: 'engineer' | 'business' | 'both'
}
```

- [ ] **Step 3: Add `level` and `audience` to every entry in `allModules`**

Update the `allModules` array so every module has the two new fields. Apply these values:

| id | level | audience |
|----|-------|----------|
| `setup` | `essentials` | `both` |
| `module-1` | `essentials` | `engineer` |
| `module-2` | `essentials` | `engineer` |
| `module-3` | `essentials` | `engineer` |
| `module-4` | `essentials` | `engineer` |

Example for the first entry (replicate pattern for all):

```ts
{
  id: 'setup',
  number: '00',
  title: 'Environment Setup',
  description: 'Install Node.js, Claude Code, and verify the service runs before starting the exercises.',
  status: 'ready',
  participantGuide: '/docs/setup/participant-guide.md',
  exercises: [],
  level: 'essentials',
  audience: 'both',
},
```

- [ ] **Step 4: Update `makeModule` helper in `config.test.ts`**

```ts
const makeModule = (id: string): Module => ({
  id,
  number: '01',
  title: 'Test',
  description: 'desc',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: [],
  level: 'essentials',
  audience: 'engineer',
})
```

- [ ] **Step 5: Update fixtures in `ModuleCard.test.tsx`**

```ts
const readyModule: Module = {
  id: 'module-1',
  number: '01',
  title: 'Claude Code in the Engineering Loop',
  description: 'Learn to use Claude Code.',
  status: 'ready',
  participantGuide: '/docs/module-1/participant-guide.md',
  exercises: [
    { slug: 'ex-1', title: 'Orientation', file: '/docs/module-1/exercises/ex-1.md' },
  ],
  level: 'essentials',
  audience: 'engineer',
}

const comingSoonModule: Module = {
  ...readyModule,
  id: 'module-3',
  number: '03',
  status: 'coming-soon',
  title: 'Future Module',
}
```

- [ ] **Step 6: Update fixture in `resolvePageFile.test.ts`**

Add the two new fields to the `mod` object at the top of that file:

```ts
const mod: Module = {
  id: 'module-1',
  number: '01',
  title: 'Test Module',
  description: 'desc',
  status: 'ready',
  participantGuide: '/docs/module-1/participant-guide.md',
  exercises: [
    {
      slug: 'exercise-1-orientation',
      title: 'Orientation',
      file: '/docs/module-1/exercises/exercise-1-orientation.md',
    },
    {
      slug: 'exercise-2-refactoring',
      title: 'Refactoring',
      file: '/docs/module-1/exercises/exercise-2-refactoring.md',
    },
  ],
  level: 'essentials',
  audience: 'engineer',
}
```

- [ ] **Step 7: Run typecheck and tests to confirm everything passes**

```bash
cd docs-site && npm run typecheck && npm test
```
Expected: all tests pass, no type errors.

- [ ] **Step 8: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/__tests__/config.test.ts docs-site/src/__tests__/ModuleCard.test.tsx docs-site/src/__tests__/resolvePageFile.test.ts
git commit -m "feat(config): add level and audience fields to Module and Exercise types"
```

---

## Task 2: Add Track type and multi-track resolution to config.ts

**Files:**
- Modify: `docs-site/src/config.ts`
- Modify: `docs-site/src/__tests__/config.test.ts`
- Modify: `workshop.json`

- [ ] **Step 1: Write failing tests for new config functions**

Add these test blocks to `docs-site/src/__tests__/config.test.ts` after the existing `assignDisplayNumbers` block. They will fail because `resolveTracks` and `filterExercises` don't exist yet.

```ts
import { filterModules, assignDisplayNumbers, resolveTracks, filterExercises } from '../config'
import type { Module, Exercise } from '../config'

// Keep existing makeModule helper from Task 1

const makeExercise = (slug: string, audience?: Exercise['audience']): Exercise => ({
  slug,
  title: slug,
  file: `/docs/ex/${slug}.md`,
  ...(audience ? { audience } : {}),
})

describe('filterExercises', () => {
  it('returns all exercises when audience is "both"', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    expect(filterExercises(exercises, 'both')).toHaveLength(3)
  })

  it('returns engineer and untagged exercises for engineer audience', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    const result = filterExercises(exercises, 'engineer')
    expect(result.map((e) => e.slug)).toEqual(['e1', 'e3'])
  })

  it('returns business and untagged exercises for business audience', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    const result = filterExercises(exercises, 'business')
    expect(result.map((e) => e.slug)).toEqual(['e2', 'e3'])
  })
})

describe('resolveTracks', () => {
  const all = [
    { ...makeModule('setup'), number: '00', level: 'essentials' as const, audience: 'both' as const },
    makeModule('module-1'),
    makeModule('module-2'),
  ]

  it('treats legacy { modules: [...] } format as a single default track', () => {
    const config = { modules: ['setup', 'module-1'] }
    const tracks = resolveTracks(config, all)
    expect(tracks).toHaveLength(1)
    expect(tracks[0].id).toBe('default')
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['setup', 'module-1'])
  })

  it('resolves multiple tracks from the new format', () => {
    const config = {
      tracks: [
        { id: 'eng', label: 'Engineering', audience: 'engineer' as const, modules: ['module-1', 'module-2'] },
        { id: 'biz', label: 'Business', audience: 'business' as const, modules: ['module-1'] },
      ],
    }
    const tracks = resolveTracks(config, all)
    expect(tracks).toHaveLength(2)
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['module-1', 'module-2'])
    expect(tracks[1].modules.map((m) => m.id)).toEqual(['module-1'])
  })

  it('filters exercises by track audience during resolution', () => {
    const modWithExercises: Module = {
      ...makeModule('module-1'),
      exercises: [
        makeExercise('ex-eng', 'engineer'),
        makeExercise('ex-biz', 'business'),
        makeExercise('ex-all'),
      ],
    }
    const config = {
      tracks: [
        { id: 'eng', label: 'Engineering', audience: 'engineer' as const, modules: ['module-1'] },
      ],
    }
    const tracks = resolveTracks(config, [modWithExercises])
    expect(tracks[0].modules[0].exercises.map((e) => e.slug)).toEqual(['ex-eng', 'ex-all'])
  })

  it('ignores unknown module IDs in a track', () => {
    const config = { tracks: [{ id: 't', label: 'T', audience: 'both' as const, modules: ['module-1', 'does-not-exist'] }] }
    const tracks = resolveTracks(config, all)
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['module-1'])
  })

  it('returns an empty modules array for an empty track', () => {
    const config = { tracks: [{ id: 't', label: 'T', audience: 'both' as const, modules: [] }] }
    const tracks = resolveTracks(config, all)
    expect(tracks[0].modules).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail as expected**

```bash
cd docs-site && npm test -- --reporter=verbose 2>&1 | grep -E "FAIL|cannot find|resolveTracks|filterExercises"
```
Expected: compilation errors or test failures because `resolveTracks` and `filterExercises` are not exported yet.

- [ ] **Step 3: Add Track type and new functions to `config.ts`**

Add these declarations after the existing `Module` interface and before `allModules`:

```ts
export interface Track {
  id: string
  label: string
  audience: 'engineer' | 'business' | 'both'
  modules: Module[]
  summary?: string
}

type RawTrack = {
  id: string
  label: string
  audience: 'engineer' | 'business' | 'both'
  modules: string[]
  summary?: string
}

type WorkshopConfig =
  | { modules: string[] }
  | { tracks: RawTrack[] }

export function filterExercises(
  exercises: Exercise[],
  audience: 'engineer' | 'business' | 'both'
): Exercise[] {
  if (audience === 'both') return exercises
  return exercises.filter(
    (ex) => !ex.audience || ex.audience === audience || ex.audience === 'both'
  )
}

export function resolveTracks(config: WorkshopConfig, allMods: Module[]): Track[] {
  if ('modules' in config) {
    return [
      {
        id: 'default',
        label: 'Workshop',
        audience: 'both',
        modules: assignDisplayNumbers(filterModules(allMods, config.modules)),
      },
    ]
  }
  return config.tracks.map((raw) => ({
    id: raw.id,
    label: raw.label,
    audience: raw.audience,
    summary: raw.summary,
    modules: assignDisplayNumbers(
      filterModules(allMods, raw.modules).map((m) => ({
        ...m,
        exercises: filterExercises(m.exercises, raw.audience),
      }))
    ),
  }))
}
```

- [ ] **Step 4: Update the import and exports in `config.ts`**

At the top of the file, replace the existing JSON import:
```ts
import workshopConfig from '../../workshop.json'
```
with:
```ts
import workshopConfigJson from '../../workshop.json'
const workshopConfig = workshopConfigJson as unknown as WorkshopConfig
```

At the bottom of the file, replace the existing `export const modules` line:
```ts
// remove this:
// export const modules: Module[] = assignDisplayNumbers(
//   filterModules(allModules, workshopConfig.modules)
// )

// add these three instead:
export const tracks: Track[] = resolveTracks(workshopConfig, allModules)
export const activeTrack: Track | null = tracks[0] ?? null
export const modules: Module[] = activeTrack?.modules ?? []
```

- [ ] **Step 5: Update `workshop.json` to the new tracks format**

```json
{
  "tracks": [
    {
      "id": "default",
      "label": "Workshop",
      "audience": "both",
      "modules": ["setup", "module-1", "module-2", "module-3", "module-4"]
    }
  ]
}
```

- [ ] **Step 6: Run typecheck and all tests**

```bash
cd docs-site && npm run typecheck && npm test
```
Expected: all tests pass, no type errors.

- [ ] **Step 7: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/__tests__/config.test.ts workshop.json
git commit -m "feat(config): add Track type, resolveTracks, multi-track workshop.json format"
```

---

## Task 3: Navigation utility — `getNextPage`

**Files:**
- Create: `docs-site/src/utils/navigation.ts`
- Create: `docs-site/src/__tests__/navigation.test.ts`

- [ ] **Step 1: Write the test file first**

Create `docs-site/src/__tests__/navigation.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getNextPage } from '../utils/navigation'
import type { Module } from '../config'

const makeModule = (id: string, exerciseSlugs: string[] = []): Module => ({
  id,
  number: '01',
  title: 'T',
  description: 'd',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: exerciseSlugs.map((slug) => ({
    slug,
    title: slug,
    file: `/docs/${id}/exercises/${slug}.md`,
  })),
  level: 'essentials',
  audience: 'engineer',
})

const modules: Module[] = [
  makeModule('setup'),
  makeModule('module-1', ['ex-1', 'ex-2']),
  makeModule('module-2', ['ex-3']),
]

describe('getNextPage', () => {
  it('from setup participant-guide → module-1 participant-guide', () => {
    expect(getNextPage(modules, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'participant-guide',
    })
  })

  it('from module-1 participant-guide → module-1 ex-1', () => {
    expect(getNextPage(modules, 'module-1', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'ex-1',
    })
  })

  it('from module-1 ex-1 → module-1 ex-2', () => {
    expect(getNextPage(modules, 'module-1', 'ex-1')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'ex-2',
    })
  })

  it('from module-1 ex-2 (last exercise) → module-2 participant-guide', () => {
    expect(getNextPage(modules, 'module-1', 'ex-2')).toEqual({
      kind: 'module',
      moduleId: 'module-2',
      pageSlug: 'participant-guide',
    })
  })

  it('from module-2 ex-3 (last page of last module) → summary', () => {
    expect(getNextPage(modules, 'module-2', 'ex-3')).toEqual({ kind: 'summary' })
  })

  it('from a module with no exercises → next module participant-guide', () => {
    const mods: Module[] = [makeModule('setup'), makeModule('module-1', ['ex-1'])]
    expect(getNextPage(mods, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'participant-guide',
    })
  })

  it('returns null for an unknown moduleId/pageSlug combination', () => {
    expect(getNextPage(modules, 'does-not-exist', 'participant-guide')).toBeNull()
  })

  it('skips modules with status coming-soon', () => {
    const mods: Module[] = [
      makeModule('setup'),
      { ...makeModule('module-1'), status: 'coming-soon' },
      makeModule('module-2', ['ex-1']),
    ]
    expect(getNextPage(mods, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-2',
      pageSlug: 'participant-guide',
    })
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd docs-site && npm test -- navigation
```
Expected: FAIL — `getNextPage` not found.

- [ ] **Step 3: Create `docs-site/src/utils/navigation.ts`**

```ts
import type { Module } from '../config'

export type NextPage =
  | { kind: 'module'; moduleId: string; pageSlug: string }
  | { kind: 'summary' }

export function getNextPage(
  modules: Module[],
  moduleId: string,
  pageSlug: string
): NextPage | null {
  const ready = modules.filter((m) => m.status === 'ready')

  const pages: Array<{ moduleId: string; pageSlug: string }> = []
  for (const m of ready) {
    pages.push({ moduleId: m.id, pageSlug: 'participant-guide' })
    for (const ex of m.exercises) {
      pages.push({ moduleId: m.id, pageSlug: ex.slug })
    }
  }

  const idx = pages.findIndex((p) => p.moduleId === moduleId && p.pageSlug === pageSlug)
  if (idx === -1) return null
  if (idx === pages.length - 1) return { kind: 'summary' }
  return { kind: 'module', ...pages[idx + 1] }
}
```

- [ ] **Step 4: Run navigation tests**

```bash
cd docs-site && npm test -- navigation
```
Expected: all 8 tests pass.

- [ ] **Step 5: Run full test suite**

```bash
cd docs-site && npm test
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add docs-site/src/utils/navigation.ts docs-site/src/__tests__/navigation.test.ts
git commit -m "feat(navigation): add getNextPage utility for linear workshop flow"
```

---

## Task 4: Level and audience badges on ModuleCard

**Files:**
- Modify: `docs-site/src/components/ModuleCard.tsx`
- Modify: `docs-site/src/__tests__/ModuleCard.test.tsx`
- Modify: `docs-site/src/styles/global.css`

- [ ] **Step 1: Write failing tests for badge rendering**

Add these tests to `ModuleCard.test.tsx` inside the existing `describe('ModuleCard')` block:

```ts
it('renders the level badge', () => {
  render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
  expect(screen.getByText('Essentials')).toBeInTheDocument()
})

it('renders the audience badge as "Engineer"', () => {
  render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
  expect(screen.getByText('Engineer')).toBeInTheDocument()
})

it('renders audience badge as "All" for audience "both"', () => {
  const bothModule: Module = { ...readyModule, audience: 'both' }
  render(<MemoryRouter><ModuleCard module={bothModule} /></MemoryRouter>)
  expect(screen.getByText('All')).toBeInTheDocument()
})

it('renders "Advanced" level badge for advanced modules', () => {
  const advModule: Module = { ...readyModule, level: 'advanced' }
  render(<MemoryRouter><ModuleCard module={advModule} /></MemoryRouter>)
  expect(screen.getByText('Advanced')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd docs-site && npm test -- ModuleCard
```
Expected: 4 new tests fail — badges not rendered yet.

- [ ] **Step 3: Update `ModuleCard.tsx` to render level and audience badges**

Replace the `module-card__meta` div inside the component:

```tsx
<div className="module-card__meta">
  <span className="module-card__title">{module.title}</span>
  <span className={`module-card__badge module-card__badge--${module.status}`}>
    {isReady ? 'Ready' : 'Coming soon'}
  </span>
  <span className={`module-card__badge module-card__badge--${module.level}`}>
    {module.level === 'essentials' ? 'Essentials' : 'Advanced'}
  </span>
  <span className="module-card__badge module-card__badge--audience">
    {module.audience === 'engineer'
      ? 'Engineer'
      : module.audience === 'business'
        ? 'Business'
        : 'All'}
  </span>
</div>
```

- [ ] **Step 4: Add badge CSS to `global.css`**

Append after the existing `.module-card__badge--coming-soon` rule:

```css
.module-card__badge--essentials {
  background: var(--ac-dim);
  color: var(--ac);
  border: 1px solid var(--ac-bdr);
}
.module-card__badge--advanced {
  background: rgba(255,255,255,0.05);
  color: var(--text-muted);
  border: 1px solid var(--bdr);
}
.module-card__badge--audience {
  background: rgba(255,255,255,0.05);
  color: var(--text-muted);
  border: 1px solid var(--bdr);
}
```

- [ ] **Step 5: Run ModuleCard tests**

```bash
cd docs-site && npm test -- ModuleCard
```
Expected: all tests pass.

- [ ] **Step 6: Run full suite**

```bash
cd docs-site && npm test
```
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add docs-site/src/components/ModuleCard.tsx docs-site/src/__tests__/ModuleCard.test.tsx docs-site/src/styles/global.css
git commit -m "feat(ui): add level and audience badges to ModuleCard"
```

---

## Task 5: Group modules by level on HomePage

**Files:**
- Modify: `docs-site/src/pages/HomePage.tsx`
- Modify: `docs-site/src/styles/global.css`

No test file exists for `HomePage` — this is a visual layout change. Verify manually after implementation.

- [ ] **Step 1: Update `HomePage.tsx` to group by level**

Replace the entire file content:

```tsx
import { modules } from '../config'
import { ModuleCard } from '../components/ModuleCard'

export function HomePage() {
  const essentials = modules.filter((m) => m.level === 'essentials')
  const advanced = modules.filter((m) => m.level === 'advanced')
  const showHeadings = essentials.length > 0 && advanced.length > 0

  return (
    <div className="home">
      <div className="home__hero">
        <div className="hero__label">superluminar workshops</div>
        <h1 className="hero__title">AI Development Workshop</h1>
        <p className="hero__subtitle">
          Hands-on exercises for using Claude Code in real engineering work.
        </p>
      </div>
      <div className="home__modules">
        {showHeadings && essentials.length > 0 && (
          <h2 className="home__section-heading">Essentials</h2>
        )}
        {essentials.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
        {showHeadings && advanced.length > 0 && (
          <h2 className="home__section-heading">Advanced</h2>
        )}
        {advanced.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add section heading CSS to `global.css`**

Append after the `.home__modules` rule:

```css
.home__section-heading {
  font-family: var(--font-headline);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 8px 0 4px;
}
```

- [ ] **Step 3: Run full test suite**

```bash
cd docs-site && npm test
```
Expected: all tests pass (existing Nav test checks for ready modules, unaffected by grouping).

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/pages/HomePage.tsx docs-site/src/styles/global.css
git commit -m "feat(ui): group modules by level with Essentials / Advanced headings on home page"
```

---

## Task 6: Next button on ModulePage

**Files:**
- Modify: `docs-site/src/pages/ModulePage.tsx`
- Modify: `docs-site/src/styles/global.css`

- [ ] **Step 1: Update `ModulePage.tsx` to compute and render the Next button**

Replace the entire file:

```tsx
import { Navigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { modules } from '../config'
import { resolvePageFile } from '../utils/resolvePageFile'
import { getNextPage } from '../utils/navigation'
import { Sidebar } from '../components/Sidebar'
import { MarkdownView } from '../components/MarkdownView'

export function ModulePage() {
  const { moduleId, pageSlug } = useParams<{ moduleId: string; pageSlug?: string }>()
  const module = modules.find((m) => m.id === moduleId)

  if (!module || module.status !== 'ready') {
    return <Navigate to="/" replace />
  }

  if (!pageSlug) {
    return <Navigate to={`/module/${moduleId}/participant-guide`} replace />
  }

  const file = resolvePageFile(module, pageSlug)
  if (!file) {
    return <Navigate to={`/module/${moduleId}`} replace />
  }

  const nextPage = getNextPage(modules, moduleId, pageSlug)
  const nextHref = nextPage
    ? nextPage.kind === 'module'
      ? `/module/${nextPage.moduleId}/${nextPage.pageSlug}`
      : '/summary'
    : null

  return (
    <div className="module-page">
      <Sidebar />
      <main className="module-page__content">
        <MarkdownView file={file} />
        {nextHref && (
          <div className="page-nav">
            <Link to={nextHref} className="btn-next">
              Next →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Add page-nav and btn-next CSS to `global.css`**

Append after the `.prose hr` rule:

```css
/* ── Page navigation (Next / End buttons) ── */
.page-nav {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--bdr);
  display: flex;
  justify-content: flex-end;
}
.btn-next {
  font-family: var(--font-headline);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 20px;
  border-radius: 4px;
  background: var(--ac-dim);
  color: var(--ac);
  border: 1px solid var(--ac-bdr);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-next:hover {
  border-color: var(--ac);
}
```

- [ ] **Step 3: Run full test suite**

```bash
cd docs-site && npm test
```
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/pages/ModulePage.tsx docs-site/src/styles/global.css
git commit -m "feat(ui): add Next button to module and exercise pages"
```

---

## Task 7: SummaryPage, route, Sidebar summary link

**Files:**
- Create: `docs-site/src/pages/SummaryPage.tsx`
- Create: `docs/summaries/default.md`
- Modify: `docs-site/src/App.tsx`
- Modify: `docs-site/src/components/Sidebar.tsx`
- Modify: `docs-site/src/styles/global.css`

- [ ] **Step 1: Create `docs/summaries/default.md`**

```markdown
# Workshop Complete

Well done — you've reached the end of the workshop.

## What you covered

You worked through a hands-on sequence of modules, building habits and tooling that hold up in real engineering environments.

## Next steps

- Apply what you practised in your own codebase this week — the first real project is where the skills stick.
- Share the workshop repo with a colleague and walk through Module 1 together.
- Revisit the facilitator guides if you want to run a session yourself.

---

*This workshop was built by [superluminar](https://superluminar.io).*
```

- [ ] **Step 2: Create `docs-site/src/pages/SummaryPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { activeTrack } from '../config'
import { MarkdownView } from '../components/MarkdownView'
import { Sidebar } from '../components/Sidebar'

export function SummaryPage() {
  const summaryFile = activeTrack?.summary ?? '/docs/summaries/default.md'

  return (
    <div className="module-page">
      <Sidebar />
      <main className="module-page__content">
        <MarkdownView file={summaryFile} />
        <div className="page-nav">
          <Link to="/" className="btn-end">
            End Workshop
          </Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Add the `/summary` route to `App.tsx`**

Replace the entire file:

```tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { SummaryPage } from './pages/SummaryPage'

export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Nav />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/module/:moduleId/:pageSlug" element={<ModulePage />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Add Summary link to `Sidebar.tsx`**

Add a `NavLink` to `/summary` at the bottom of the sidebar, after the module map. Replace the entire file:

```tsx
import { Link, NavLink, useParams } from 'react-router-dom'
import { modules } from '../config'

export function Sidebar() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const readyModules = modules.filter((m) => m.status === 'ready')

  const exerciseLinkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__item${isActive ? ' sidebar__item--active' : ''}`

  return (
    <aside className="sidebar">
      {readyModules.map((m) => {
        const isExpanded = m.id === moduleId

        return (
          <div key={m.id} className="sidebar__module">
            <Link
              to={`/module/${m.id}`}
              className={`sidebar__module-header${isExpanded ? ' sidebar__module-header--active' : ''}`}
            >
              <span className="sidebar__module-number">Module {m.number}</span>
            </Link>

            {isExpanded && (
              <div className="sidebar__exercises">
                <NavLink
                  to={`/module/${m.id}/participant-guide`}
                  className={exerciseLinkClass}
                >
                  Participant Guide
                </NavLink>
                {m.exercises.map((ex, i) => (
                  <NavLink
                    key={ex.slug}
                    to={`/module/${m.id}/${ex.slug}`}
                    className={exerciseLinkClass}
                  >
                    {i + 1} · {ex.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <div className="sidebar__module">
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `sidebar__module-header${isActive ? ' sidebar__module-header--active' : ''}`
          }
        >
          <span className="sidebar__module-number">Summary</span>
        </NavLink>
      </div>
    </aside>
  )
}
```

- [ ] **Step 5: Add `btn-end` CSS to `global.css`**

Append after the `.btn-next:hover` rule:

```css
.btn-end {
  font-family: var(--font-headline);
  font-weight: 600;
  font-size: 13px;
  padding: 8px 20px;
  border-radius: 4px;
  background: var(--ac);
  color: var(--bg);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-end:hover {
  opacity: 0.9;
}
```

- [ ] **Step 6: Run typecheck and full test suite**

```bash
cd docs-site && npm run typecheck && npm test
```
Expected: all tests pass, no type errors.

- [ ] **Step 7: Commit**

```bash
git add docs-site/src/pages/SummaryPage.tsx docs-site/src/App.tsx docs-site/src/components/Sidebar.tsx docs-site/src/styles/global.css docs/summaries/default.md
git commit -m "feat(ui): add SummaryPage with End button, summary link in sidebar"
```

---

## Task 8: Remove "Full instructions →" links from participant guides

**Files:**
- Modify: `docs/module-1/participant-guide.md`
- Modify: `docs/module-2/participant-guide.md`
- Modify: `docs/module-3/participant-guide.md`
- Modify: `docs/module-4/participant-guide.md`

Each participant guide has lines of the form:
```
[Full instructions →](exercises/exercise-N-*.md)
```

- [ ] **Step 1: Remove all `[Full instructions →]` links from module-1 participant guide**

Open `docs/module-1/participant-guide.md`. Remove the four link lines (one per exercise). Each looks like:

```
[Full instructions →](exercises/exercise-1-orientation.md)
```

Leave the exercise heading, duration, description, and scenario callout intact. Only the link line is removed.

After editing, the Exercise 1 section should look like:

```markdown
## Exercise 1 — Codebase Orientation (~18 min)

Explore the service with Claude, understand how slash commands work, and write your first custom command.

> **In the scenario:** This is day one. …
```

Repeat for Exercises 2, 3, and 4 in the same file.

- [ ] **Step 2: Remove `[Full instructions →]` links from module-2 participant guide**

Open `docs/module-2/participant-guide.md`. Remove the two `[Full instructions →]` link lines (one per exercise). Leave all other content intact.

- [ ] **Step 3: Remove `[Full instructions →]` links from module-3 participant guide**

Open `docs/module-3/participant-guide.md`. Remove the three `[Full instructions →]` link lines. Leave all other content intact.

- [ ] **Step 4: Remove `[Full instructions →]` links from module-4 participant guide**

Open `docs/module-4/participant-guide.md`. Remove the three `[Full instructions →]` link lines. Leave all other content intact.

- [ ] **Step 5: Run full test suite (confirms no regressions)**

```bash
cd docs-site && npm test
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add docs/module-1/participant-guide.md docs/module-2/participant-guide.md docs/module-3/participant-guide.md docs/module-4/participant-guide.md
git commit -m "docs: remove redundant Full instructions links from participant guides"
```

---

## Task 9: Update README for facilitators

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update the facilitator section in `README.md`**

Replace the existing "Configuring modules for a workshop" block with:

```markdown
### Configuring modules for a workshop

Edit `workshop.json` at the repo root before participants clone the repo.

**Single-session workshop (all participants together):**

```json
{
  "tracks": [
    {
      "id": "session",
      "label": "Workshop",
      "audience": "both",
      "modules": ["setup", "module-1", "module-2"]
    }
  ]
}
```

**Two-session workshop (engineers + business/leadership separately):**

```json
{
  "tracks": [
    {
      "id": "engineers",
      "label": "Engineering Session",
      "audience": "engineer",
      "modules": ["setup", "module-1", "module-2", "module-5", "module-8"]
    },
    {
      "id": "leadership",
      "label": "Leadership Session",
      "audience": "business",
      "modules": ["bridge", "module-6", "module-7"]
    }
  ]
}
```

Configure the session before participants clone. Each session (engineer vs. leadership) is a separate clone — not in-browser switching.

**Optional: custom summary page**

Add a `"summary"` field to any track pointing to a markdown file:

```json
{ ..., "summary": "/docs/summaries/my-session.md" }
```

If omitted, the default summary at `docs/summaries/default.md` is shown.

**Available module IDs:** `setup`, `module-1`, `module-2`, `module-3`, `module-4`, `bridge`, `module-5`, `module-6`, `module-7`, `module-8`

> Note: `bridge`, `module-5` through `module-8` are advanced modules. Their content is added in a separate workstream.
```

- [ ] **Step 2: Run full test suite one final time**

```bash
cd docs-site && npm run typecheck && npm test
```
Expected: all tests pass, no type errors.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update facilitator section with multi-track workshop.json format"
```
