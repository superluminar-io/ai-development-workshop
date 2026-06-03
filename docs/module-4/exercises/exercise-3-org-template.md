# Exercise 3: Head of AI Engineering Practices — Build the Org Template

---

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

---

**Goal:** Extract the harness you built in Exercises 1 and 2 into a reusable template directory any team could copy into a new repo.

**Duration:** ~15 minutes
**Prerequisites:** Exercises 1 and 2 complete

---

## The problem with bespoke harnesses

You have now built a harness for this repo. It works. But when a new project starts next month, the team will begin from scratch — no governance rules, no permissions, no hooks — unless someone remembers to set them up and knows how.

The solution is a template: a directory containing a starter harness that encodes the decisions you made here, with comments that explain the reasoning. A team can copy it, read the README, adapt what doesn't fit their context, and start with good defaults rather than no defaults.

---

## Step 1 — Create the template directory (~5 min)

Create a `claude-harness/` directory at the repo root:

```bash
mkdir claude-harness
```

Create three files inside it:

**`claude-harness/CLAUDE.md`** — the team standards template:

```markdown
# [Project Name] — Claude Code Standards

These rules apply to every engineer working in this repo.

## Scope
- Do not refactor code unrelated to the current task.
- Do not modify CI/CD configuration, Dockerfiles, or infrastructure files without explicit instruction.

## Before making changes
- List every file you intend to modify and explain why before touching anything.
- If the change affects more than three files, stop and ask for confirmation.

## After making changes
- Summarise what changed, which tests were run, and what risks remain.
- Never report a change as complete before tests have passed.

## Code structure
<!-- Add your project's file structure and responsibilities here -->

## Test commands
<!-- Add your project's test commands here -->
```

**`claude-harness/settings.json`** — the base permissions and hooks:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Bash(npx * --yes)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

**`claude-harness/README.md`** — the adoption guide:

```markdown
# Claude Code Harness Template

A starter harness for Claude Code in a team engineering context. Copy the contents
of this directory into your repo's `.claude/` directory, rename `CLAUDE.md` to the
repo root, and adapt to your project.

## What's included

### CLAUDE.md
Team-level governance rules Claude reads at the start of every session. Adapt:
- **Scope section** — adjust the list of protected files for your project structure
- **Code structure section** — describe your actual directory layout
- **Test commands section** — add your project's test and typecheck commands

### settings.json
Drop this into your `.claude/` directory.

**Permissions:** The allow list pre-approves common safe commands so Claude
doesn't prompt for each one. The deny list blocks operations no Claude session
should perform — force-pushing, bulk deletion, running untrusted packages.
Adapt both lists to your project's tooling.

**Hooks:** The `PostToolUse` hook runs `npm test` after every file write.
If your test suite is slow, replace with a faster check:
- Linter only: `npm run lint 2>&1 | tail -5`
- Vitest fast run: `npx vitest run --reporter=dot 2>&1 | tail -10`

## What this doesn't cover

- User-level personal preferences (each engineer's `~/.claude/CLAUDE.md`)
- MCP server configuration (project-specific, add to `.mcp.json`)
- Plugin installation (each engineer installs plugins individually)

## Updating the harness

Treat this like any other shared configuration. Changes go through code review.
Breaking changes (removing a permission, tightening a rule) warrant a team
discussion before merging.
```

---

## Step 2 — Commit and reflect (~10 min)

Commit the template:

```bash
git add claude-harness/
git commit -m "feat: add claude-harness org template"
```

Now read through what you have built across all three exercises. You started with a repo where six engineers used Claude Code however they liked. You now have:

- **CLAUDE.md** — team standards every session reads
- **Permissions** — hard limits no prompt can override
- **Hooks** — automated enforcement that runs without being asked
- **A template** — so the next project starts with all of this on day one

The harness is not locked. It should evolve as the team learns. Add it to your team's code review process: if someone wants to change the deny list or modify a hook, it goes through the same review as any other code change.

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] `claude-harness/CLAUDE.md` — team standards template with explanatory comments
- [ ] `claude-harness/settings.json` — permissions and hooks pre-configured
- [ ] `claude-harness/README.md` — adoption guide explaining each decision
- [ ] Everything committed to the repo

---

## Reflection questions

- What would a team need to do to adopt this template? What would they need to change?
- Who should own the harness in your organisation — each team independently, or a central platform team?
- What happens when two teams have conflicting standards? How would you resolve that?
- Three months from now, how would you know if the harness was working?
