# Module 4: The AI Harness — Claude Code for Teams and Organisations

**Duration:** ~60 minutes
**Type:** Hands-on exercises
**Prerequisite:** Modules 1, 2, and 3 complete

---

## What you will practise

- Extending a project CLAUDE.md with team-level governance rules that apply to every engineer in the repo
- Configuring permissions — tool-level limits Claude cannot prompt its way around — using `.claude/settings.json`
- Writing a `PostToolUse` hook that enforces standards automatically after every Claude edit
- Extracting the harness into a reusable org template another team could adopt on day one

---

## Exercises

1. [Exercise 1: Team Lead — Establish the Team Harness](exercises/exercise-1-team-harness.md)
2. [Exercise 2: Team Lead — Automate the Enforcement](exercises/exercise-2-hooks.md)
3. [Exercise 3: Head of AI Engineering Practices — Build the Org Template](exercises/exercise-3-org-template.md)

Or follow the [Participant Guide](participant-guide.md) for the scenario overview and troubleshooting reference.

---

## Prerequisites

- Modules 1, 2, and 3 complete
- The workshop repo open with Claude Code running
- Node.js 20+ installed (for `npm test` hook verification)
