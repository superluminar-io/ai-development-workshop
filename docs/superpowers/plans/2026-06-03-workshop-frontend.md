# Workshop Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + React SPA in `docs-site/` that renders participant-facing workshop markdown as a polished, superluminar-branded website, served locally with `npm run docs`.

**Architecture:** A self-contained `docs-site/` subdirectory holds the React app with its own `package.json`. Markdown files are served via a symlink from `docs-site/public/docs/` to the repo's `docs/` directory — no copy step needed. Module/exercise metadata lives in `config.ts`; adding a module means one config entry.

**Tech Stack:** Vite 5, React 18, TypeScript 5, React Router v6, react-markdown + remark-gfm, custom CSS with CSS custom properties, Vitest + React Testing Library, Google Fonts (Fira Sans / Source Sans 3 / Fira Code)

---

## File Map

```
docs-site/
  .gitignore
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  public/
    docs/                          ← symlink → ../../docs
  src/
    test-setup.ts
    config.ts
    main.tsx
    App.tsx
    utils/
      resolvePageFile.ts
    styles/
      tokens.css
      global.css
    components/
      Nav.tsx
      ModuleCard.tsx
      Sidebar.tsx
      MarkdownView.tsx
    pages/
      HomePage.tsx
      ModulePage.tsx
    __tests__/
      resolvePageFile.test.ts
      Nav.test.tsx
      ModuleCard.test.tsx
```

Modified:
- `package.json` (root): add `"docs"` script

---

## Task 1: Scaffold docs-site

**Files:**
- Create: `docs-site/.gitignore`
- Create: `docs-site/package.json`
- Create: `docs-site/vite.config.ts`
- Create: `docs-site/tsconfig.json`
- Create: `docs-site/index.html`

- [ ] **Step 1: Create docs-site directory and .gitignore**

```bash
mkdir -p docs-site/src docs-site/public
```

`docs-site/.gitignore`:
```
node_modules/
dist/
```

- [ ] **Step 2: Create package.json**

`docs-site/package.json`:
```json
{
  "name": "docs-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.24.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Create vite.config.ts**

`docs-site/vite.config.ts`:
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 4: Create tsconfig.json**

`docs-site/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create index.html**

`docs-site/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Development Workshop</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600;700&family=Source+Sans+3:wght@400;500&family=Fira+Code&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Install dependencies**

```bash
cd docs-site && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
git add docs-site/
git commit -m "feat: scaffold docs-site project"
```

---

## Task 2: CSS Design System

**Files:**
- Create: `docs-site/src/test-setup.ts`
- Create: `docs-site/src/styles/tokens.css`
- Create: `docs-site/src/styles/global.css`

- [ ] **Step 1: Create test-setup.ts**

`docs-site/src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 2: Create tokens.css**

`docs-site/src/styles/tokens.css`:
```css
:root {
  --bg: #060606;
  --bg-alt: #0B0D0F;
  --bg-card: #151515;
  --ac: #01FEB6;
  --ac-dim: rgba(1, 254, 182, 0.09);
  --ac-bdr: rgba(1, 254, 182, 0.22);
  --text: #EDEAE6;
  --text-muted: rgba(237, 234, 230, 0.54);
  --bdr: rgba(255, 255, 255, 0.09);

  --font-headline: 'Fira Sans', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-code: 'Fira Code', monospace;
}
```

- [ ] **Step 3: Create global.css**

`docs-site/src/styles/global.css`:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
}

/* ── Nav ── */
.nav {
  background: var(--bg);
  border-bottom: 1px solid var(--bdr);
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.nav-logo-mark {
  width: 24px;
  height: 24px;
  background: var(--ac);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--bg);
  font-weight: 800;
  flex-shrink: 0;
}
.nav-badge {
  font-size: 11px;
  color: var(--ac);
  border: 1px solid var(--ac-bdr);
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--ac-dim);
}
.nav-back {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
}
.nav-back:hover { color: var(--ac); }

/* ── Home page ── */
.home { display: flex; flex-direction: column; min-height: 100vh; }

.home__hero {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 32px 32px;
  width: 100%;
}
.hero__label {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ac);
  font-family: var(--font-headline);
  font-weight: 600;
  margin-bottom: 10px;
}
.hero__title {
  font-family: var(--font-headline);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}
.hero__subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.home__modules {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 32px 48px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Module card ── */
.module-card__link { text-decoration: none; display: block; }
.module-card {
  border: 1px solid var(--bdr);
  border-radius: 6px;
  background: var(--bg-card);
  display: flex;
  overflow: hidden;
  transition: border-color 0.15s;
}
.module-card__link:hover .module-card { border-color: var(--ac-bdr); }
.module-card--upcoming { opacity: 0.4; }

.module-card__number-col {
  flex-shrink: 0;
  width: 64px;
  background: var(--ac-dim);
  border-right: 1px solid var(--ac-bdr);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 0 0;
}
.module-card__number {
  font-family: var(--font-code);
  font-size: 22px;
  font-weight: 600;
  color: var(--ac);
}
.module-card__body { flex: 1; padding: 20px; }
.module-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.module-card__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}
.module-card__badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-headline);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.module-card__badge--ready {
  background: var(--ac-dim);
  color: var(--ac);
  border: 1px solid var(--ac-bdr);
}
.module-card__badge--coming-soon {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border: 1px solid var(--bdr);
}
.module-card__desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 14px;
}
.module-card__exercises { display: flex; flex-wrap: wrap; gap: 6px; }
.exercise-chip {
  font-size: 12px;
  color: rgba(237, 234, 230, 0.6);
  font-family: var(--font-code);
  padding: 3px 10px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--bdr);
}
.exercise-chip::before { content: '→ '; color: var(--ac); }

/* ── Module page ── */
.module-page { display: flex; flex-direction: column; min-height: 100vh; }
.module-page__body { display: flex; flex: 1; overflow: hidden; height: calc(100vh - 56px); }
.module-page__content { flex: 1; padding: 40px 48px; overflow-y: auto; }

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-alt);
  border-right: 1px solid var(--bdr);
  padding: 24px 0;
  overflow-y: auto;
}
.sidebar__module-label {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 16px 12px;
  font-family: var(--font-headline);
  font-weight: 600;
}
.sidebar__item {
  display: block;
  font-size: 13px;
  padding: 7px 16px;
  color: var(--text-muted);
  border-left: 2px solid transparent;
  text-decoration: none;
  line-height: 1.4;
}
.sidebar__item:hover { color: var(--text); }
.sidebar__item--active {
  color: var(--text);
  border-left-color: var(--ac);
  background: var(--ac-dim);
}
.sidebar__section-header {
  font-family: var(--font-headline);
  font-weight: 600;
  color: rgba(237, 234, 230, 0.4);
  font-size: 10px;
  padding: 16px 16px 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── MarkdownView ── */
.markdown-loading { color: var(--text-muted); padding: 40px 0; font-size: 14px; }
.markdown-error { color: #ff3b61; padding: 40px 0; font-size: 14px; }

/* ── Prose (rendered markdown) ── */
.prose { max-width: 680px; line-height: 1.65; }

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  font-family: var(--font-headline);
  color: var(--text);
  margin: 1.75em 0 0.5em;
}
.prose h1:first-child,
.prose h2:first-child { margin-top: 0; }
.prose h1 {
  font-size: 1.75rem;
  font-weight: 700;
  border-bottom: 2px solid var(--ac);
  padding-bottom: 0.3em;
  margin-bottom: 0.75em;
}
.prose h2 { font-size: 1.2rem; font-weight: 600; }
.prose h3 { font-size: 1rem; font-weight: 600; }

.prose p { color: var(--text-muted); margin-bottom: 1em; }
.prose a { color: var(--ac); text-decoration: none; }
.prose a:hover { text-decoration: underline; }
.prose strong { color: var(--text); font-weight: 600; }

.prose code {
  font-family: var(--font-code);
  font-size: 0.85em;
  background: #1C2026;
  color: var(--ac);
  padding: 2px 6px;
  border-radius: 3px;
}
.prose pre {
  background: #1C2026;
  border-radius: 6px;
  padding: 16px 20px;
  overflow-x: auto;
  margin-bottom: 1.25em;
  border: 1px solid var(--bdr);
}
.prose pre code {
  background: none;
  padding: 0;
  color: var(--text);
  font-size: 0.875rem;
}

.prose blockquote {
  border-left: 3px solid var(--ac);
  padding-left: 1em;
  color: var(--text-muted);
  margin: 1em 0;
  font-style: italic;
}

.prose table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1.25em;
  font-size: 0.9rem;
}
.prose th,
.prose td { border: 1px solid var(--bdr); padding: 8px 12px; }
.prose th { background: var(--bg-alt); font-family: var(--font-headline); font-weight: 600; color: var(--text); }
.prose tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }

.prose ul,
.prose ol { padding-left: 1.5em; margin-bottom: 1em; color: var(--text-muted); }
.prose li { margin-bottom: 0.3em; }

.prose details { margin-bottom: 1em; }
.prose details summary {
  cursor: pointer;
  color: var(--ac);
  font-family: var(--font-headline);
  font-weight: 600;
  padding: 4px 0;
}
.prose details summary:hover { opacity: 0.8; }
.prose details[open] summary { margin-bottom: 0.5em; }

.prose hr {
  border: none;
  border-top: 1px solid var(--bdr);
  margin: 2em 0;
}
```

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/
git commit -m "feat: add CSS design system and test setup"
```

---

## Task 3: Config and resolvePageFile Utility

**Files:**
- Create: `docs-site/src/config.ts`
- Create: `docs-site/src/utils/resolvePageFile.ts`
- Create: `docs-site/src/__tests__/resolvePageFile.test.ts`

- [ ] **Step 1: Write the failing test**

`docs-site/src/__tests__/resolvePageFile.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { resolvePageFile } from '../utils/resolvePageFile'
import type { Module } from '../config'

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
}

describe('resolvePageFile', () => {
  it('returns participantGuide for "participant-guide" slug', () => {
    expect(resolvePageFile(mod, 'participant-guide')).toBe('/docs/module-1/participant-guide.md')
  })

  it('returns exercise file for a known exercise slug', () => {
    expect(resolvePageFile(mod, 'exercise-1-orientation')).toBe(
      '/docs/module-1/exercises/exercise-1-orientation.md',
    )
  })

  it('returns null for an unknown slug', () => {
    expect(resolvePageFile(mod, 'does-not-exist')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd docs-site && npm test
```

Expected: FAIL — `Cannot find module '../utils/resolvePageFile'`

- [ ] **Step 3: Create config.ts**

`docs-site/src/config.ts`:
```ts
export interface Exercise {
  slug: string
  title: string
  file: string // Vite-served URL path, e.g. /docs/module-1/exercises/exercise-1-orientation.md
}

export interface Module {
  id: string
  number: string
  title: string
  description: string
  status: 'ready' | 'coming-soon'
  participantGuide: string // Vite-served URL path, e.g. /docs/module-1/participant-guide.md
  exercises: Exercise[]
}

export const modules: Module[] = [
  {
    id: 'module-1',
    number: '01',
    title: 'Claude Code in the Engineering Loop',
    description:
      'Explore a codebase, refactor safely, write tests, and prepare a PR summary — all with Claude.',
    status: 'ready',
    participantGuide: '/docs/module-1/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-orientation',
        title: 'Codebase Orientation',
        file: '/docs/module-1/exercises/exercise-1-orientation.md',
      },
      {
        slug: 'exercise-2-refactoring',
        title: 'Safe Refactoring',
        file: '/docs/module-1/exercises/exercise-2-refactoring.md',
      },
      {
        slug: 'exercise-3-tests-and-review',
        title: 'Tests, Review & PR Prep',
        file: '/docs/module-1/exercises/exercise-3-tests-and-review.md',
      },
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'From Prompts to Repeatable AI Workflows',
    description:
      'Configure GitHub MCP, review PRs with full context, and build reusable slash commands.',
    status: 'ready',
    participantGuide: '/docs/module-2/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-review-without-context',
        title: 'Review Without Context',
        file: '/docs/module-2/exercises/exercise-1-review-without-context.md',
      },
      {
        slug: 'exercise-2-github-mcp',
        title: 'GitHub MCP Setup',
        file: '/docs/module-2/exercises/exercise-2-github-mcp.md',
      },
      {
        slug: 'exercise-3-reusable-command',
        title: 'Build a Reusable Command',
        file: '/docs/module-2/exercises/exercise-3-reusable-command.md',
      },
    ],
  },
]
```

- [ ] **Step 4: Create resolvePageFile.ts**

`docs-site/src/utils/resolvePageFile.ts`:
```ts
import type { Module } from '../config'

export function resolvePageFile(module: Module, pageSlug: string): string | null {
  if (pageSlug === 'participant-guide') return module.participantGuide
  const exercise = module.exercises.find((e) => e.slug === pageSlug)
  return exercise?.file ?? null
}
```

- [ ] **Step 5: Run the tests to confirm they pass**

```bash
cd docs-site && npm test
```

Expected: 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add docs-site/src/config.ts docs-site/src/utils/ docs-site/src/__tests__/resolvePageFile.test.ts
git commit -m "feat: add module config and resolvePageFile utility"
```

---

## Task 4: Nav and ModuleCard Components

**Files:**
- Create: `docs-site/src/components/Nav.tsx`
- Create: `docs-site/src/components/ModuleCard.tsx`
- Create: `docs-site/src/__tests__/Nav.test.tsx`
- Create: `docs-site/src/__tests__/ModuleCard.test.tsx`

- [ ] **Step 1: Write failing tests**

`docs-site/src/__tests__/Nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from '../components/Nav'

describe('Nav', () => {
  it('renders the workshop title', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('AI Development Workshop')).toBeInTheDocument()
  })

  it('shows module count badge by default', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText(/modules/)).toBeInTheDocument()
  })

  it('shows back link when backLink prop is set', () => {
    render(
      <MemoryRouter>
        <Nav backLink />
      </MemoryRouter>,
    )
    expect(screen.getByText('← All modules')).toBeInTheDocument()
  })
})
```

`docs-site/src/__tests__/ModuleCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModuleCard } from '../components/ModuleCard'
import type { Module } from '../config'

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
}

const comingSoonModule: Module = {
  ...readyModule,
  id: 'module-3',
  number: '03',
  status: 'coming-soon',
  title: 'Future Module',
}

describe('ModuleCard', () => {
  it('renders the module title', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText('Claude Code in the Engineering Loop')).toBeInTheDocument()
  })

  it('renders the module number', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText('01')).toBeInTheDocument()
  })

  it('renders exercise chips for ready modules', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText(/Orientation/)).toBeInTheDocument()
  })

  it('renders coming-soon badge for upcoming modules', () => {
    render(<MemoryRouter><ModuleCard module={comingSoonModule} /></MemoryRouter>)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd docs-site && npm test
```

Expected: FAIL — `Cannot find module '../components/Nav'`

- [ ] **Step 3: Create Nav.tsx**

`docs-site/src/components/Nav.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { modules } from '../config'

interface NavProps {
  backLink?: boolean
}

export function Nav({ backLink }: NavProps) {
  const readyCount = modules.filter((m) => m.status === 'ready').length

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">S</span>
        AI Development Workshop
      </Link>
      {backLink ? (
        <Link to="/" className="nav-back">
          ← All modules
        </Link>
      ) : (
        <span className="nav-badge">{readyCount} modules</span>
      )}
    </nav>
  )
}
```

- [ ] **Step 4: Create ModuleCard.tsx**

`docs-site/src/components/ModuleCard.tsx`:
```tsx
import { Link } from 'react-router-dom'
import type { Module } from '../config'

interface ModuleCardProps {
  module: Module
}

export function ModuleCard({ module }: ModuleCardProps) {
  const isReady = module.status === 'ready'

  const inner = (
    <div className={`module-card${isReady ? '' : ' module-card--upcoming'}`}>
      <div className="module-card__number-col">
        <span className="module-card__number">{module.number}</span>
      </div>
      <div className="module-card__body">
        <div className="module-card__meta">
          <span className="module-card__title">{module.title}</span>
          <span className={`module-card__badge module-card__badge--${module.status}`}>
            {isReady ? 'Ready' : 'Coming soon'}
          </span>
        </div>
        <p className="module-card__desc">{module.description}</p>
        {isReady && (
          <div className="module-card__exercises">
            {module.exercises.map((ex) => (
              <span key={ex.slug} className="exercise-chip">
                {ex.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return isReady ? (
    <Link to={`/module/${module.id}`} className="module-card__link">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  )
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
cd docs-site && npm test
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add docs-site/src/components/Nav.tsx docs-site/src/components/ModuleCard.tsx docs-site/src/__tests__/Nav.test.tsx docs-site/src/__tests__/ModuleCard.test.tsx
git commit -m "feat: add Nav and ModuleCard components"
```

---

## Task 5: Sidebar and MarkdownView Components

**Files:**
- Create: `docs-site/src/components/Sidebar.tsx`
- Create: `docs-site/src/components/MarkdownView.tsx`

- [ ] **Step 1: Create Sidebar.tsx**

`docs-site/src/components/Sidebar.tsx`:
```tsx
import { NavLink } from 'react-router-dom'
import type { Module } from '../config'

interface SidebarProps {
  module: Module
}

export function Sidebar({ module }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__item${isActive ? ' sidebar__item--active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar__module-label">Module {module.number}</div>

      <NavLink to={`/module/${module.id}/participant-guide`} className={linkClass}>
        Participant Guide
      </NavLink>

      <div className="sidebar__section-header">Exercises</div>

      {module.exercises.map((ex, i) => (
        <NavLink key={ex.slug} to={`/module/${module.id}/${ex.slug}`} className={linkClass}>
          {i + 1} · {ex.title}
        </NavLink>
      ))}
    </aside>
  )
}
```

- [ ] **Step 2: Create MarkdownView.tsx**

`docs-site/src/components/MarkdownView.tsx`:
```tsx
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownViewProps {
  file: string // Vite-served URL path, e.g. /docs/module-1/participant-guide.md
}

export function MarkdownView({ file }: MarkdownViewProps) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setContent(null)
    setError(false)

    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.text()
      })
      .then(setContent)
      .catch(() => setError(true))
  }, [file])

  if (error) return <p className="markdown-error">Could not load content ({file})</p>
  if (content === null) return <p className="markdown-loading">Loading…</p>

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 3: Run existing tests to confirm nothing broke**

```bash
cd docs-site && npm test
```

Expected: all tests still PASS

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/components/Sidebar.tsx docs-site/src/components/MarkdownView.tsx
git commit -m "feat: add Sidebar and MarkdownView components"
```

---

## Task 6: HomePage

**Files:**
- Create: `docs-site/src/pages/HomePage.tsx`

- [ ] **Step 1: Create HomePage.tsx**

`docs-site/src/pages/HomePage.tsx`:
```tsx
import { modules } from '../config'
import { Nav } from '../components/Nav'
import { ModuleCard } from '../components/ModuleCard'

export function HomePage() {
  return (
    <div className="home">
      <Nav />
      <div className="home__hero">
        <div className="hero__label">superluminar workshops</div>
        <h1 className="hero__title">AI Development Workshop</h1>
        <p className="hero__subtitle">
          Hands-on exercises for using Claude Code in real engineering workflows.
        </p>
      </div>
      <div className="home__modules">
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add docs-site/src/pages/HomePage.tsx
git commit -m "feat: add HomePage"
```

---

## Task 7: ModulePage, App, and Entry Point

**Files:**
- Create: `docs-site/src/pages/ModulePage.tsx`
- Create: `docs-site/src/App.tsx`
- Create: `docs-site/src/main.tsx`

- [ ] **Step 1: Create ModulePage.tsx**

`docs-site/src/pages/ModulePage.tsx`:
```tsx
import { Navigate, useParams } from 'react-router-dom'
import { modules } from '../config'
import { resolvePageFile } from '../utils/resolvePageFile'
import { Nav } from '../components/Nav'
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
    return <Navigate to={`/module/${moduleId}/participant-guide`} replace />
  }

  return (
    <div className="module-page">
      <Nav backLink />
      <div className="module-page__body">
        <Sidebar module={module} />
        <main className="module-page__content">
          <MarkdownView file={file} />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create App.tsx**

`docs-site/src/App.tsx`:
```tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/module/:moduleId/:pageSlug" element={<ModulePage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Create main.tsx**

`docs-site/src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: Run all tests**

```bash
cd docs-site && npm test
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add docs-site/src/pages/ModulePage.tsx docs-site/src/App.tsx docs-site/src/main.tsx
git commit -m "feat: add ModulePage, App routing, and entry point"
```

---

## Task 8: Symlink, Root Script, and Smoke Test

**Files:**
- Create: `docs-site/public/docs` (symlink)
- Modify: `package.json` (root)

- [ ] **Step 1: Create the docs symlink**

```bash
cd docs-site/public && ln -sf ../../docs docs
```

Verify the symlink resolves:
```bash
ls docs-site/public/docs/module-1/
```

Expected: `KNOWN-IMPERFECTIONS.md  README.md  exercises  facilitator-guide.md  participant-guide.md`

- [ ] **Step 2: Add docs script to root package.json**

Open `package.json` (root) and add the `"docs"` script:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit",
  "process:example": "tsx src/index.ts examples/tickets/billing-high.json",
  "docs": "cd docs-site && npm run dev"
}
```

- [ ] **Step 3: Start the dev server and verify**

```bash
npm run docs
```

Open `http://localhost:5173` in a browser.

Verify:
- Home page loads with both module cards (Module 01 and 02)
- Clicking a module card navigates to the participant guide
- Sidebar shows "Participant Guide" and all 3 exercises
- Clicking an exercise loads the markdown content
- Active sidebar item has a teal left border
- "← All modules" link returns to home

- [ ] **Step 4: Commit**

```bash
git add docs-site/public/docs package.json
git commit -m "feat: add docs symlink and npm run docs script"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|---|---|
| Participant-facing content only | `config.ts` only lists participant guide + exercises; facilitator guide excluded |
| superluminar brand colors | `tokens.css` — exact hex values from superluminar.io |
| Fira Sans / Source Sans 3 / Fira Code | `index.html` Google Fonts + `tokens.css` font vars |
| Vertical framed module cards | `ModuleCard.tsx` + `.module-card` styles in `global.css` |
| Teal number column on cards | `.module-card__number-col` + `.module-card__number` |
| Coming-soon modules at reduced opacity, not linked | `ModuleCard.tsx` — renders `<div>` not `<Link>`, `.module-card--upcoming` |
| Sidebar with active teal border | `Sidebar.tsx` + `.sidebar__item--active` |
| Markdown rendered with prose styles | `MarkdownView.tsx` + `.prose` styles in `global.css` |
| GFM tables, blockquotes, code blocks | `remarkGfm` plugin + prose CSS |
| `/module/:id` redirects to participant-guide | `ModulePage.tsx` — `!pageSlug` → Navigate |
| Slug-to-file mapping | `resolvePageFile.ts` |
| Adding a module = one config entry | `config.ts` + symlink |
| `npm run docs` from repo root | root `package.json` `"docs"` script |
