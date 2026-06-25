# Advanced Workshop Tracks Design

**Date:** 2026-06-10
**Status:** Approved

---

## Goal

Extend the workshop to serve enterprise customers who already use AI but want to improve their practices. Add advanced modules covering security, governance, strategy, and workflow patterns. Support two separate audience groups — engineers and business/leadership — each getting a tailored session. Facilitate this through a multi-track configuration system while keeping the existing single-track format working unchanged.

Also improve the participant navigation: replace the current open-ended sidebar-first flow with a linear step-by-step experience using "Next" buttons.

---

## Approach

One workshop, one repo, two tracks. Modules are tagged with a level (`essentials` or `advanced`) and an audience (`engineer`, `business`, or `both`). Facilitators configure tracks in `workshop.json` before participants clone the repo. The docs site renders the configured module list — there is no track selector in the UI. Participants navigate linearly through the workshop via "Next" buttons.

---

## Configuration

### `workshop.json` — new format

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

The facilitator edits `workshop.json` to set up the session before participants clone the repo. Each session is configured separately — no in-browser switching. The docs site always renders the first track in the array.

### Backwards compatibility

If `workshop.json` uses the old `{ "modules": [...] }` format, it is treated as a single anonymous track. All existing single-track workshops continue to work with no changes.

### `Module` type additions

```ts
export interface Module {
  // existing fields unchanged
  id: string
  number: string
  title: string
  description: string
  status: 'ready' | 'coming-soon'
  participantGuide: string
  exercises: Exercise[]
  // new fields
  level: 'essentials' | 'advanced'
  audience: 'engineer' | 'business' | 'both'
}
```

### `Exercise` type addition

```ts
export interface Exercise {
  slug: string
  title: string
  file: string
  audience?: 'engineer' | 'business' | 'both'  // omit = shown to all
}
```

### `Track` type

```ts
export interface Track {
  id: string
  label: string
  audience: 'engineer' | 'business' | 'both'
  modules: Module[]  // resolved from IDs, display numbers assigned
}
```

### `config.ts` exports

- `tracks: Track[]` — all resolved tracks
- `modules: Module[]` — modules from the first (or only) track; retained for backwards compatibility with components that don't need track awareness

---

## Module Catalog

| ID | Title | Level | Audience | Duration |
|----|-------|-------|----------|----------|
| `setup` | Environment Setup | essentials | both | ~15 min |
| `module-1` | Claude Code in the Engineering Loop | essentials | engineer | ~60 min |
| `module-2` | Code Review, Context, and Commands | essentials | engineer | ~50 min |
| `module-3` | Plugins, Superpowers, and Spec-Driven Development | essentials | engineer | ~60 min |
| `module-4` | The AI Harness — Claude Code for Teams and Organisations | essentials | engineer | ~60 min |
| `bridge` | AI Tools Baseline | essentials | both | ~30 min |
| `module-5` | AI Security & Guardrails | advanced | engineer | ~60 min |
| `module-6` | Cost, Governance & Compliance | advanced | both | ~60 min |
| `module-7` | Organisational AI Strategy | advanced | business | ~60 min |
| `module-8` | Advanced Workflow Patterns | advanced | engineer | ~60 min |

### New module briefs

**`bridge` — AI Tools Baseline**
Fast-tracks an experienced team to the Claude Code baseline: CLAUDE.md, skills, harness basics. For enterprise customers who don't need the full essentials sequence. Optional — facilitator includes it or not.

**`module-5` — AI Security & Guardrails**
Hands-on, engineer-facing. Topics: prompt injection, secrets leaking through context, tool permission boundaries, safe agentic patterns. Exercises use the existing TypeScript service and Claude Code config.

**`module-6` — Cost, Governance & Compliance**
Mixed audience. Topics: model selection policies, spend visibility, audit logging, data residency. Has two parallel exercise sets — one technical (implementing controls), one business (policy decisions, vendor evaluation). The facilitator's track audience setting determines which set participants see.

**`module-7` — Organisational AI Strategy**
Business-facing. Topics: AI readiness assessment, building an internal AI practice, measuring ROI, change management. Exercises are guided activities (frameworks, case studies, discussion prompts) plus simple vibe coding tasks — lightweight Claude interactions that let non-technical participants experience AI firsthand and build intuition for business decisions.

**`module-8` — Advanced Workflow Patterns**
Engineer-facing. Topics: multi-agent orchestration, AI-gated CI/CD pipelines, agentic task loops, when not to use AI.

---

## Docs Site UI

### Styling constraint

All UI changes use existing CSS classes and design tokens. No new colours, font families, or font styles are introduced.

### No track selector

The docs site does not show a track selector. The facilitator configures `workshop.json` before participants clone the repo. Participants always see the modules for their session; they cannot switch tracks.

### Module cards

Each module card displays:
- Module number (renumbered within the track, as today)
- Level badge (`Essentials` or `Advanced`) — using existing badge CSS
- Audience badge (`Engineer`, `Business`, or `All`) — using existing badge CSS
- Title and description

### Module grouping

On the homepage, modules are grouped under two headings: **Essentials** and **Advanced**. When only one level is present (e.g. an all-advanced session), no headings are shown.

### Step-by-step navigation

The workshop guides participants linearly through modules and exercises via "Next" buttons. The sidebar stays visible on all pages so participants can always navigate back to review any topic — it is not removed or hidden. The "Next" button is the primary forward path only.

**Navigation sequence:**

```
Home
 └─ Module 00 (setup participant guide)
     └─ [Next] → Module 01 participant guide
         └─ [Next] → Module 01 Exercise 1
             └─ [Next] → Module 01 Exercise 2
                 └─ [Next] → … last exercise of last module
                     └─ [Next] → Track Summary page
                         └─ [End] → Home (workshop overview)
```

The "Next" button is rendered at the bottom of every participant guide and every exercise page, including the last exercise of the last module. It computes the next destination from the full linear sequence: participant guides, then exercises, in module order, ending at the track summary page.

**Track summary page**

Each track ends with a summary page — the final step in the linear sequence. It is a markdown page that wraps up the session (key takeaways, what was covered, suggested next steps). The summary page shows an "End" button instead of a "Next" button; clicking it returns the participant to the home overview page (`/`).

Each track references its summary file via a `summary` field in `workshop.json`:

```json
{
  "tracks": [
    {
      "id": "engineers",
      "label": "Engineering Session",
      "audience": "engineer",
      "modules": ["setup", "module-1", "module-2"],
      "summary": "/docs/summaries/engineering-session.md"
    }
  ]
}
```

If no `summary` is specified, a generated summary listing the modules covered is shown as a fallback.

The sidebar lists the summary page as the last item in the module list when the participant is on or past the last exercise.

**Remove "Full instructions →" links from participant guides**

Each existing participant guide (e.g. `docs/module-1/participant-guide.md`) contains links of the form `[Full instructions →](exercises/exercise-N-*.md)`. These are removed. The "Next" button from the participant guide navigates to the first exercise, making the links redundant.

---

## Content Structure for New Modules

All new modules follow the existing file layout:

```
docs/module-N/
  README.md
  participant-guide.md
  facilitator-guide.md
  exercises/
    exercise-N-*.md
```

**Mixed modules** (`module-6`) have audience-tagged exercise files:

```
docs/module-6/
  exercises/
    exercise-1-cost-controls-engineer.md
    exercise-1-cost-policy-business.md
    exercise-2-audit-logging-engineer.md
    exercise-2-vendor-eval-business.md
```

The docs site renders only exercises whose `audience` matches the active track's audience. Exercises with no `audience` field are shown to all.

**Business module exercises** are a mix of:
- Guided activities: case studies, framework worksheets, facilitated discussion prompts
- Vibe coding tasks: simple, guided Claude interactions with no terminal or `npm install` required — designed to give non-technical participants a direct feel for AI to inform business decisions

---

## Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Old `{ "modules": [...] }` format | Treated as a single anonymous track; backwards compatible |
| Unknown module ID in a track | Silently filtered; consistent with current behaviour |
| Empty `modules` array in a track | No modules shown; valid, not a crash |
| `tracks: []` | No modules shown |
| Last exercise of last module | "Next" button leads to the track summary page |
| Track summary page | "End" button leads to `/`; no "Next" button |
| Track has no `summary` field | A generated summary listing the covered modules is shown |
| Module with no exercises | "Next" from participant guide goes directly to next module's participant guide |

---

## Testing

- Extend existing `filterModules` and `assignDisplayNumbers` unit tests to cover multi-track input
- Add a unit test for the backwards-compatibility shim: old `{ "modules": [...] }` format resolves to a single track
- Add unit tests for audience-based exercise filtering
- Add unit tests for the linear next-page computation (given a module list and a current page, assert the correct next destination, including the transition to the summary page)
- Existing component tests mock `config.ts` directly — unaffected

---

## Implementation note

This spec covers two independent workstreams that can be planned and executed separately:

1. **Config & UI infra** — `workshop.json` format, `config.ts` types, level/audience badges, exercise filtering, "Next" button navigation, removal of "Full instructions →" links. Can be built and tested without any new module content.
2. **Module content** — The five new module folders (`bridge`, `module-5` through `module-8`). Can be written incrementally once the infra is in place.

Recommend two separate implementation plans.

---

## Files to Change or Add

| File | Change |
|------|--------|
| `workshop.json` | Update to multi-track format (or keep old format for existing workshops) |
| `docs-site/src/config.ts` | Add `Track` type, `level`/`audience` fields on `Module`/`Exercise`, multi-track resolution, backwards-compat shim |
| `docs-site/src/pages/ModulePage.tsx` | Add "Next" button; compute next destination from linear page sequence (including summary) |
| `docs-site/src/pages/SummaryPage.tsx` | New page — renders track summary markdown, shows "End" button leading to `/` |
| `docs-site/src/pages/HomePage.tsx` | Group modules by level (Essentials / Advanced headings) |
| `docs-site/src/components/ModuleCard.tsx` | Add level and audience badges using existing badge CSS |
| `docs-site/src/__tests__/config.test.ts` | Extend for multi-track, backwards-compat, and exercise-filtering cases |
| `docs/module-1/participant-guide.md` | Remove "Full instructions →" links |
| `docs/module-2/participant-guide.md` | Remove "Full instructions →" links |
| `docs/module-3/participant-guide.md` | Remove "Full instructions →" links |
| `docs/module-4/participant-guide.md` | Remove "Full instructions →" links |
| `docs/summaries/` | New folder — one summary `.md` per track (e.g. `engineering-session.md`, `leadership-session.md`) |
| `docs/bridge/` | New module content (ID: `bridge`) |
| `docs/module-5/` | New module content |
| `docs/module-6/` | New module content |
| `docs/module-7/` | New module content |
| `docs/module-8/` | New module content |
| `README.md` | Update facilitator section: available module IDs, track config format |
