# Workshop Frontend — Design Spec

**Date:** 2026-06-03  
**Status:** Approved  

---

## Overview

A locally-served React SPA that renders the workshop's participant-facing markdown content as a polished, branded website. Replaces plain markdown file browsing. Participants run one command and get a navigable, styled view of all modules and exercises.

---

## Goals

- Present all participant-facing content (module overviews, participant guides, exercises) in a readable, navigable UI
- Match the superluminar brand identity
- Support an arbitrary number of modules as the workshop grows
- Zero deployment — served locally via Vite dev server

## Non-goals

- Facilitator guides are not surfaced in the UI
- No authentication, no build/deploy pipeline
- No server-side rendering

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Vite + React + TypeScript | Slickest result, fits existing TS project, fast dev loop |
| Routing | React Router v6 | Standard, well-supported |
| Markdown | `react-markdown` + `remark-gfm` | Clean rendering, supports GFM tables/code blocks |
| Styling | Custom CSS (CSS custom properties) | No extra dependency; brand tokens map directly to CSS vars |
| Fonts | Google Fonts (Fira Sans, Source Sans 3, Fira Code) | Matches superluminar.io exactly |

The frontend lives in a `docs-site/` subdirectory, isolated from the TypeScript service. A new `npm run docs` script starts it.

---

## Brand Tokens

Derived from superluminar.io:

```css
--bg:        #060606;
--bg-alt:    #0B0D0F;
--bg-card:   #151515;
--ac:        #01FEB6;       /* teal accent */
--ac-dim:    rgba(1,254,182,0.09);
--ac-bdr:    rgba(1,254,182,0.22);
--text:      #EDEAE6;
--text-muted: rgba(237,234,230,0.54);
--bdr:       rgba(255,255,255,0.09);

--font-headline: 'Fira Sans', sans-serif;
--font-body:     'Source Sans 3', sans-serif;
--font-code:     'Fira Code', monospace;
```

---

## Content Structure

Only participant-facing files are included. Facilitator guides are excluded.

Each module is defined in a central config (`docs-site/src/config.ts`):

```ts
export interface Exercise {
  slug: string;   // used in URL, e.g. "exercise-1-orientation"
  title: string;
  file: string;   // URL path served by Vite, e.g. "/docs/module-1/exercises/exercise-1-orientation.md"
}

export interface Module {
  id: string;            // used in URL, e.g. "module-1"
  number: string;        // display only, e.g. "01"
  title: string;
  description: string;
  status: 'ready' | 'coming-soon';
  participantGuide: string;  // URL path, e.g. "/docs/module-1/participant-guide.md"
  exercises: Exercise[];
}
```

The `file` and `participantGuide` fields are URL paths served by Vite's dev server. They resolve because `docs-site/public/docs/` is a symlink to the repo's `docs/` directory, so `/docs/…` URLs are available at runtime without a copy step.

Adding a new module = adding one entry to this config.

---

## Pages & Routing

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Lists all modules as vertical framed cards |
| `/module/:moduleId` | redirect | Redirects to `/module/:moduleId/participant-guide` |
| `/module/:moduleId/:pageSlug` | `ModulePage` | Sidebar + rendered markdown |

`pageSlug` maps to a file as follows: `"participant-guide"` resolves to the module's `participantGuide` path; any exercise slug resolves by matching `exercise.slug` in the module config. `ModulePage` looks up the active file by finding the matching slug and passes the URL path to `MarkdownView`.

### HomePage

- Top nav: superluminar logo mark + "AI Development Workshop" wordmark + module count badge
- Hero: label "superluminar workshops", title, subtitle
- Module list: one `ModuleCard` per module, stacked vertically
- `ModuleCard` layout: bordered card, teal number column on left, title + status badge + description + exercise chips on right
- Coming-soon modules rendered at reduced opacity, not linked

### ModulePage

- Same top nav, with "← All modules" back link
- Left sidebar (fixed width ~200px):
  - Module number + title
  - "Participant Guide" link
  - Exercises section: numbered exercise links
  - Active item highlighted with teal left border
- Main content area: `MarkdownView` renders the selected file
- Markdown fetched at runtime via `fetch()` from the public directory (files copied/symlinked at dev time)

---

## Components

```
docs-site/src/
  config.ts               # module definitions (single source of truth)
  main.tsx                # React entry, router setup
  App.tsx                 # Route declarations
  styles/
    tokens.css            # CSS custom properties
    global.css            # resets, base styles, markdown prose styles
  components/
    Nav.tsx               # Top navigation bar
    ModuleCard.tsx        # Card on home page
    Sidebar.tsx           # In-module navigation
    MarkdownView.tsx      # Fetches and renders a markdown file
  pages/
    HomePage.tsx
    ModulePage.tsx
```

---

## Markdown Rendering

`MarkdownView` fetches the markdown file relative to the Vite dev server root, then renders it with `react-markdown`. Styling applied via the `.prose` CSS class:

- Headings: Fira Sans, teal `h1` accent line
- Inline code: Fira Code, dark background pill
- Code blocks: dark background (`#1C2026`), teal syntax highlight for keywords, copy button
- Tables: bordered, alternating row tint
- Blockquotes: left teal border, muted text

Markdown files are served from `docs-site/public/docs/` — a symlink to the repo's `docs/` directory so no copy step is needed.

---

## Dev Setup

```
docs-site/
  package.json       # separate from root — own deps
  vite.config.ts
  tsconfig.json
  public/
    docs -> ../../docs   # symlink
  src/
    ...
```

Root `package.json` gains one script:
```json
"docs": "cd docs-site && npm run dev"
```

Participants run `npm run docs` from the repo root and open `http://localhost:5173`.

---

## Adding Modules

1. Add the markdown files under `docs/module-N/`
2. Add one object to the `modules` array in `docs-site/src/config.ts`
3. No other changes needed — routing and nav auto-update

---

## Out of Scope

- Search
- Progress tracking / completion state
- Dark/light mode toggle (dark only)
- Mobile responsiveness (workshop runs on laptops)
