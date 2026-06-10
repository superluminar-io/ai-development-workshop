# Exercise 3: Head of AI Engineering Practices — Build the Org Starter Kit

---

> **MEMO**
> To: You
> From: The Board
> Re: New Role — Head of AI Engineering Practices
>
> Your work as Team Lead has been noted at the highest levels. You have been promoted. Your scope is now the entire organisation. Every new project we start must have sensible AI development defaults from day one.
>
> You have until end of day. The Board looks forward to your presentation.
>
> *There is no presentation.*

---

**Goal:** Turn the practices from this workshop into a starter kit a smaller organisation could use to standardise AI-assisted development across projects.

**Duration:** ~15 minutes
**Prerequisites:** Exercises 1 and 2 complete

---

## The problem with one-off harnesses

You have now built a harness for this repo. It works here. But the organisation has more than one repo, more than one team, and more than one kind of project.

Copying this repo's exact `CLAUDE.md`, permissions, and hook into every project would be too blunt. A ticket processor, a frontend app, a Terraform repo, and an SDK need different local instructions. What they do need is a shared process for deciding:

- What should every project start with?
- What must each team customise?
- What should be centrally owned?
- What is only a personal preference?
- How do changes to the standard get reviewed?

This exercise is about that process. You are not building a perfect enterprise governance platform. You are creating a practical starting point for a small company or early platform team: shared defaults, version-controlled templates, and clear ownership.

At enterprise scale, there is more to learn: managed settings, device policy deployment, approved MCP servers, plugin marketplace governance, audit requirements, and exception handling. Those topics belong in the advanced workshop.

In a real organisation, this starter kit would live in its own repository — for example `ai-engineering-standard` or `developer-ai-standards` — not inside an individual product repo. Teams would open pull requests against that standards repo, and new projects would copy or generate their starting Claude Code setup from it. In this workshop, you will create the directory inside the current repo only so you can practise the structure without switching repositories.

---

## Step 1 — Sort the pieces by scope (~5 min)

Create a directory at the repo root to represent that separate standards repository:

```bash
mkdir ai-engineering-standard
```

Inside it, create `ai-engineering-standard/adoption-plan.md`:

```markdown
# AI Engineering Standard — Adoption Plan

## Scope decisions

| Practice | Scope | Why |
|---|---|---|
| Project architecture and test commands | Project `CLAUDE.md` | Specific to each repo |
| Team workflow rules | Project `CLAUDE.md` | Shared by everyone working in that repo |
| Deny `git push --force` | Project or managed permissions | Safe default for teams; managed if non-negotiable |
| Protect `.claude/settings.json` from Claude edits | Project permissions | Prevents Claude from weakening repo-local rules |
| Run tests after Claude edits files | Project hook | Test command differs by repo |
| Approved MCP servers | Organisation policy, then project config | Access depends on company security rules |
| Personal editor or prompt preferences | User or local settings | Should not be forced on the team |

## Baseline rollout

1. Start with one pilot repo.
2. Add a project `CLAUDE.md`, project permissions, and one lightweight hook.
3. Keep repo-specific details in the repo, not in the global template.
4. Review the first week of friction with the team.
5. Update the starter kit before rolling it out to more projects.

## Ownership

- The platform or engineering-practices team owns the starter kit.
- Each product team owns its repo-specific `CLAUDE.md`, hooks, and project settings.
- Security owns non-negotiable restrictions that should eventually move to managed settings.

## Advanced workshop topics

This starter kit is not the whole enterprise model. For larger organisations, continue with managed settings, central MCP governance, plugin marketplace policy, audit requirements, and exception workflows.
```

This document is the main learning artifact. It shows that standardisation is not "copy one config everywhere"; it is deciding what belongs at each level.

---

## Step 2 — Create starter templates (~7 min)

Create a `templates/` directory:

```bash
mkdir ai-engineering-standard/templates
```

Create `ai-engineering-standard/templates/PROJECT_CLAUDE.md`:

```markdown
# [Project Name] — Claude Code Instructions

These instructions apply to Claude Code sessions in this repository.

## Project context

- Main source directories:
- Test directories:
- Important domain concepts:
- Commands Claude should know:

## Team workflow

- If asked for a plan or approach, do not edit files. List the likely files or areas involved and wait for confirmation.
- Ask for confirmation before changing shared contracts, public APIs, data models, release behaviour, auth, billing, or infrastructure.
- Do not create commits, branches, tags, pushes, or pull requests unless explicitly asked.

## Verification

- Test command:
- Typecheck command:
- Lint command:
- If a check cannot be run locally, explain why in the final summary.
```

Create `ai-engineering-standard/templates/project-settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Edit(.claude/settings.json)",
      "Edit(.claude/settings.local.json)"
    ]
  }
}
```

Create `ai-engineering-standard/templates/hook-notes.md`:

```markdown
# Hook Notes

Every project should choose one fast feedback hook.

Examples:

- TypeScript library: `npm test 2>&1 | tail -20`
- Frontend app: `npm run lint 2>&1 | tail -20`
- Python service: `pytest -q 2>&1 | tail -20`

Do not blindly copy another repo's hook. The hook should be fast enough that developers do not disable it.
```

---

## Step 3 — Add the adoption README (~3 min)

Create `ai-engineering-standard/README.md`:

```markdown
# AI Engineering Standard Starter Kit

This starter kit helps teams adopt consistent Claude Code practices across projects.

## What every new project gets

- A project `CLAUDE.md` adapted from `templates/PROJECT_CLAUDE.md`
- A project `.claude/settings.json` adapted from `templates/project-settings.json`
- One fast feedback hook chosen from `templates/hook-notes.md`
- A short review from the owning team before the standard is merged

## What each team must customise

- Project architecture and domain language
- Test, lint, and typecheck commands
- Protected files and risky workflows
- Which MCP servers are appropriate for the repo
- Which checks are fast enough to run in hooks

## What this starter kit does not solve

- Enterprise-wide enforcement
- Device policy deployment
- Central MCP allowlists
- Plugin marketplace governance
- Audit and exception workflows

Those are advanced workshop topics.

## Change process

Changes to this starter kit go through code review. If a team finds a better default, they propose it here so the next project benefits too.
```

---

## Commit and reflect

Commit the starter kit:

```bash
git add ai-engineering-standard/
git commit -m "feat: add AI engineering standard starter kit"
```

Now look back at the module. You combined:

- **CLAUDE.md** for project and team guidance
- **Permissions** for tool-level limits
- **Hooks** for automatic checks
- **MCP thinking** from earlier modules for approved external context
- **A rollout plan** so this becomes a shared organisational process

That is the shift from individual AI usage to organisational AI practice.

---

## Deliverable

By the end of Exercise 3 you should have:

- [ ] `ai-engineering-standard/adoption-plan.md` — scope decisions, rollout, and ownership
- [ ] `ai-engineering-standard/templates/PROJECT_CLAUDE.md` — reusable project instruction template
- [ ] `ai-engineering-standard/templates/project-settings.json` — baseline project permissions
- [ ] `ai-engineering-standard/templates/hook-notes.md` — guidance for choosing repo-specific hooks
- [ ] `ai-engineering-standard/README.md` — adoption guide for other teams

---

## Reflection questions

- Which parts of your team's AI workflow should be standardised across every repo?
- Which parts must remain project-specific?
- Which rules are important enough to become managed enterprise policy later?
- Who should review changes to the starter kit?
- How would you know three months from now whether the standard is helping?
