# Module 4 Design: The AI Harness — Claude Code for Teams and Organisations

**Date:** 2026-06-03
**Status:** Approved

---

## Overview

Module 4 is the organisational capstone of the workshop. The first three modules built individual discipline (module 1), external connectivity (module 2), and structured process (module 3). Module 4 adds the team and org layer: how to configure Claude Code so it behaves consistently and safely for everyone, not just the engineer who set it up.

The module uses a rapid-promotion scenario — participants are elevated through increasingly senior roles during the session — to make the shift from individual to organisational responsibility feel both concrete and comic.

---

## Scenario

The participant has completed modules 1–3 as an individual contributor. Module 4 opens with a recap that names what they've built so far and frames why it is insufficient at team scale. They are then promoted (repeatedly, improbably fast) through three roles via deadpan HR memos. Each promotion unlocks a new exercise with a new scope of responsibility.

The tone is dry corporate parody: formal memo format, escalating stakes, absent forms, Boards that look forward to presentations that do not exist.

---

## Participant Guide

### Opening — before the exercises

Frames the transition from individual to team/org:

> Until now everything you have configured — your CLAUDE.md, your commands, your skills — affected only you. That was fine when you were an individual contributor. It is not fine when six engineers are working in the same repo and Claude Code behaves differently on each machine.
>
> Today you have been promoted. Twice, actually. Possibly three times before lunch. The details are in the memos.

No exercise overview listing. Just scenario, plugin explanation (N/A for this module), and troubleshooting.

---

## Exercises

### Exercise 1 — Team Lead: Establish the Team Harness (~25 min)

**Opening memo (displayed at the top of the exercise):**

> **MEMO**
> To: You
> From: People Operations
> Re: Role Change — Effective Immediately
>
> Congratulations on your promotion to Team Lead. Your team consists of six engineers. It has come to our attention that all six are using Claude Code differently. One accepted a refactoring last week that removed all the error handling. Please establish standards. Forms are attached.
>
> *No forms are attached.*

**What participants do:**

**Part 1 — Team-facing CLAUDE.md standards**

Extend the project-level `CLAUDE.md` with team-facing governance. This is distinct from what was written in Module 1 (which documented the codebase structure and individual review practices). Team standards address what Claude must and must not do for *any* engineer working in the repo:
- Explicit constraints on scope (Claude may not refactor code unrelated to the current task)
- Review requirements (Claude must list every file it intends to modify before touching anything)
- Safety rules (Claude must not modify CI/CD configuration without explicit instruction)

**Part 2 — Permissions**

Add a `permissions` block to `.claude/settings.json` that configures an allow/deny list for tools. Participants learn the distinction between CLAUDE.md (guidance Claude reads and may reason about) and permissions (hard limits Claude cannot override regardless of what the prompt says):

```json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)", "Bash(git diff)"],
    "deny": ["Bash(git push --force*)", "Bash(rm -rf*)"]
  }
}
```

They configure deny rules for operations no team member should want Claude to perform: force-pushing, bulk deletion, modifying production configuration.

---

### Exercise 2 — Still Team Lead: Automate the Enforcement (~20 min)

**Opening memo:**

> **MEMO**
> To: You
> From: Engineering
> Re: The Linter Incident
>
> Yesterday a Claude Code session produced 47 linting errors in a single commit. The engineer did not notice. The reviewer did not notice until CI failed. We have 12 engineers now. Standards written in documents are read once.
>
> Please make the machine enforce them.

**What participants do:**

**Hooks explained — in the exercise body**

Before any configuration, participants read this:

> **What is a hook?**
>
> A hook is a shell command that Claude Code runs automatically at specific moments in a session — after Claude edits a file, after Claude runs a bash command, before a session ends. Hooks don't ask Claude to do something; they run regardless of what Claude decided.
>
> They are the difference between "Claude is instructed not to break the linter" and "the linter runs every time Claude touches a file, so it is physically impossible to leave the session with linting errors."
>
> Hooks are configured in `.claude/settings.json`. Each hook specifies which event triggers it, which tools it applies to, and what command to run.
>
> **When to use them:** When a standard is important enough that you don't want it to depend on Claude reading a document or an engineer remembering to check. Formatting, linting, test runs, and security scans are good candidates. Things that are merely good practice belong in CLAUDE.md; things that must never be skipped belong in a hook.

**Writing the hook**

Participants add a `PostToolUse` hook to `.claude/settings.json` that runs `npm test` after Claude edits any source file:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test"
          }
        ]
      }
    ]
  }
}
```

They then trigger it in a Claude Code session — ask Claude to make a small edit — and observe the hook firing automatically. They see that the test output appears without them asking for it, and understand what this means at team scale: the standard runs itself.

---

### Exercise 3 — Head of AI Engineering Practices: Build the Org Template (~15 min)

**Opening memo:**

> **MEMO**
> To: You
> From: The Board
> Re: New Role — Head of AI Engineering Practices
>
> Your work as Team Lead has been noted at the highest levels. You have been promoted. Your scope is now the entire organisation. Every new project we start must have your standards from day one.
>
> You have until end of day. The Board looks forward to your presentation.
>
> *There is no presentation.*

**What participants do:**

Extract the harness they've built into a reusable `claude-harness/` template directory that any team could copy into a new repo:

```
claude-harness/
  CLAUDE.md          # team standards template (with comments explaining each section)
  settings.json      # permissions + hooks pre-configured
  README.md          # what each piece does, why it exists, how to adopt it
```

The README is the deliverable that makes this distributable — it explains the decisions behind the harness, not just the configuration. A team adopting this template should be able to read the README, understand the intent of each rule, and adapt it to their context without having to guess.

Participants commit the template and reflect on what it would take to make it part of their actual organisation's engineering standards.

---

## Module README

Standard structure matching existing modules. Exercises listed with links. Prerequisites: Modules 1–3 complete.

## Facilitator Guide

Standard structure. Learning goals:
1. Articulate the difference between individual Claude Code configuration and team-level governance
2. Distinguish between CLAUDE.md guidance and permissions enforcement
3. Write a `PostToolUse` hook and explain when hooks are appropriate vs. CLAUDE.md rules
4. Extract a reusable harness template an org could distribute to new projects

Meta-skill: Claude Code is a configurable system, not a fixed tool — the configuration is an engineering asset that teams own, maintain, and distribute like any other shared infrastructure.

---

## Files to Create

```
docs/module-4/
  README.md
  participant-guide.md
  facilitator-guide.md
  exercises/
    exercise-1-team-harness.md
    exercise-2-hooks.md
    exercise-3-org-template.md
```

Config change: add module-4 entry to `docs-site/src/config.ts` and facilitator guide link to root `README.md`.

---

## Out of Scope

- User-level `~/.claude/CLAUDE.md` (covered implicitly in Module 1's CLAUDE.md work)
- MCP configuration for teams (covered in Module 2)
- Plugin distribution (covered in Module 3)
- CI/CD integration of hooks (interesting but beyond a 60-minute module)
