# Module: Communicating with AI — Design

**Date:** 2026-06-11
**Status:** Approved

---

## Goal

Add a new foundations module that teaches developers the fundamentals of prompting: how LLMs process text, the core prompt patterns, and how to iterate on prompts that don't work. This module slots in before module-1 in the foundations track so participants arrive at the Claude Code exercises with a working mental model of how to communicate with AI.

---

## Module Overview

| Field | Value |
|-------|-------|
| ID | `module-prompting` |
| Title | Communicating with AI |
| Level | `foundations` |
| Audience | `engineer` |
| Duration | ~65 min |
| Position | After Setup, before module-1 |

**Learning goals:**
1. Explain at a working level how LLMs process input — tokens, context windows, probability — well enough to reason about why prompts succeed or fail
2. Apply the most common prompt patterns: zero-shot, few-shot, chain-of-thought, structured output
3. Iterate on a failing prompt systematically rather than guessing

---

## Scenario Framing

No fictional scenario. This module is explicitly about learning fundamentals. The participant guide provides a short mental model primer, then participants move directly into standalone exercises. Each exercise supplies all the context needed — no familiarity with the workshop codebase is assumed or required.

---

## Content Structure

### Participant Guide (~5 min)

A concept primer covering three topics, followed by one bullet-point summary per exercise. No troubleshooting section — troubleshooting belongs in each exercise file.

**Concept primer topics:**
- **Tokens** — what they are, why prompt length matters, rough intuition for cost and limits
- **Context window** — what the model "sees" during a conversation, why earlier context can be forgotten or compressed
- **Probabilistic output** — why the same prompt can produce different outputs, and what this means for how you write and test prompts

### Exercise 1 — From Vague to Precise (~15 min)

**Goal:** Experience firsthand how prompt precision affects output quality.

Participants are given three deliberately weak prompts for an information-extraction task: extracting key decisions from a block of meeting notes. They run each prompt, observe output quality, then iteratively improve one prompt by adding specificity, context, and output constraints.

**Patterns introduced:** specificity, context-setting, output constraints

**Scenario:** A provided meeting notes transcript — no codebase context required.

### Exercise 2 — Teaching by Example (~18 min)

**Goal:** Understand when and why to include examples in a prompt.

Participants write a classifier prompt to categorise a set of support messages as one of: bug report / feature request / question / complaint. They start zero-shot, add three few-shot examples, then observe how few-shot changes output quality for edge cases.

**Patterns introduced:** zero-shot vs few-shot

**Scenario:** A set of 8–10 support message excerpts — no codebase context required.

### Exercise 3 — Asking for Reasoning (~15 min)

**Goal:** See when chain-of-thought prompting helps and when it doesn't.

Participants are given a short multi-step reasoning task — determining from a job description whether a candidate profile is a strong match. They compare zero-shot output to output with "explain your reasoning step by step" added, and note what changes.

**Pattern introduced:** chain-of-thought

**Scenario:** A provided job description and candidate profile — no codebase context required.

### Exercise 4 — Structured Output (~15 min)

**Goal:** Reliably get machine-readable output from a language model.

Participants write a prompt that extracts structured fields from a hotel review and returns valid JSON: `{ rating: number, sentiment: string, topics: string[], recommendedFor: string[] }`. They specify the schema in the prompt, add a one-shot example, and validate the output matches the schema.

**Pattern introduced:** structured output, format specification

**Scenario:** A provided hotel review excerpt — no codebase context required.

---

## File Structure

```
docs/module-prompting/
  README.md
  participant-guide.md
  facilitator-guide.md
  exercises/
    exercise-1-vague-to-precise.md
    exercise-2-few-shot.md
    exercise-3-chain-of-thought.md
    exercise-4-structured-output.md
```

---

## config.ts Entry

```ts
{
  id: 'module-prompting',
  number: '01',
  title: 'Communicating with AI',
  description: 'Learn how LLMs process text, practise the core prompt patterns, and iterate on prompts that don\'t work.',
  status: 'ready',
  participantGuide: '/docs/module-prompting/participant-guide.md',
  level: 'foundations',
  audience: 'engineer',
  exercises: [
    {
      slug: 'exercise-1-vague-to-precise',
      title: 'From Vague to Precise',
      file: '/docs/module-prompting/exercises/exercise-1-vague-to-precise.md',
    },
    {
      slug: 'exercise-2-few-shot',
      title: 'Teaching by Example',
      file: '/docs/module-prompting/exercises/exercise-2-few-shot.md',
    },
    {
      slug: 'exercise-3-chain-of-thought',
      title: 'Asking for Reasoning',
      file: '/docs/module-prompting/exercises/exercise-3-chain-of-thought.md',
    },
    {
      slug: 'exercise-4-structured-output',
      title: 'Structured Output',
      file: '/docs/module-prompting/exercises/exercise-4-structured-output.md',
    },
  ],
}
```

---

## workshop.json

`module-prompting` is inserted before `module-1` in the relevant track. No existing module IDs or files change. Display numbers are assigned dynamically by `assignDisplayNumbers`, so existing modules shift from 01–04 to 02–05 automatically.

Example:
```json
{
  "tracks": [
    {
      "id": "engineers",
      "label": "Engineering Session",
      "audience": "engineer",
      "modules": ["setup", "module-prompting", "module-1", "module-2", "module-3", "module-4"]
    }
  ]
}
```

---

## Files to Add or Change

| File | Change |
|------|--------|
| `docs/module-prompting/README.md` | New — module overview, learning goals, exercise list. Prerequisites: Claude Code CLI only, no codebase familiarity required |
| `docs/module-prompting/participant-guide.md` | New — mental model primer + exercise summaries |
| `docs/module-prompting/facilitator-guide.md` | New — learning goals, timing, debrief questions, common mistakes |
| `docs/module-prompting/exercises/exercise-1-vague-to-precise.md` | New |
| `docs/module-prompting/exercises/exercise-2-few-shot.md` | New |
| `docs/module-prompting/exercises/exercise-3-chain-of-thought.md` | New |
| `docs/module-prompting/exercises/exercise-4-structured-output.md` | New |
| `docs-site/src/config.ts` | Add `module-prompting` entry to `allModules` |

No existing module content files change. `workshop.json` is updated by the facilitator — not part of this implementation.
