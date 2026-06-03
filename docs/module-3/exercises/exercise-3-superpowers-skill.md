# Exercise 3: Write a Superpowers-Compatible Skill

**Goal:** Upgrade your `safe-refactoring.md` skill from Module 1 to the full Superpowers frontmatter format, and understand how skills are distributed across projects and teams.

**Duration:** ~15 minutes  
**Prerequisites:** Exercise 1 complete, `.claude/skills/safe-refactoring.md` from Module 1

---

## Skills evolve

In Module 1 you wrote a skill with two frontmatter fields — `name` and `description`. That was enough to make Claude apply it contextually. Superpowers skills use a richer format that makes the skill more precise, more readable, and compatible with the Superpowers plugin ecosystem.

The upgrade is small. The concept is identical.

---

## Step 1 — Read a Superpowers skill's frontmatter (~5 min)

Ask Claude:

> "Show me the frontmatter of the `systematic-debugging` Superpowers skill."

Read the frontmatter fields. A Superpowers skill typically uses:

```yaml
---
name: skill-name
description: One-line description of what this skill does
when_to_use: A specific, situational description of the circumstances that call for this skill
---
```

The key addition is `when_to_use`. This is more explicit than `description` — it describes the *trigger condition*, not just what the skill does.

Notice how specific it is. A vague `when_to_use` like "when writing code" would never be useful — it matches everything. A precise one like "when you encounter an unexpected test failure and do not know what caused it" matches a specific situation and nothing else.

---

## Step 2 — Upgrade your skill (~7 min)

Open `.claude/skills/safe-refactoring.md` in your editor.

Add a `when_to_use` field to the frontmatter. Write it to be:
- A complete sentence describing a specific situation
- Specific enough that it would not trigger on unrelated tasks
- Broad enough to cover the situations where you actually want it to apply

For example:

```yaml
---
name: safe-refactoring
description: Use when asked to modify or improve existing TypeScript code in a codebase you did not write
when_to_use: When asked to refactor, restructure, or improve code that belongs to a system you are unfamiliar with and did not write — especially where tests exist that document the expected behaviour
---
```

You do not need to copy this exactly. Write what fits your skill.

Save the file and commit it:

```bash
git add .claude/skills/safe-refactoring.md
git commit -m "refactor: upgrade safe-refactoring skill to Superpowers format"
```

---

## Step 3 — Understand how skills are distributed (~3 min)

Skills can live in three places, each with a different scope:

| Location | Scope | Who sees it |
|---|---|---|
| `~/.claude/skills/` | Personal | Only you, across all projects |
| `.claude/skills/` | Project | Anyone who clones the repo |
| Plugin (e.g. Superpowers) | Installed | Anyone who installs the plugin |

Your `safe-refactoring.md` is in `.claude/skills/` — it is checked into the workshop repo, so your whole team gets it automatically. That is the right level for a project-specific practice.

If a skill is so generally useful that every TypeScript project should have it, it belongs in a plugin. If it is specific to your team's way of working, it belongs in a shared project config or team repo. If it is experimental or personal, it belongs in `~/.claude/skills/`.

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] `safe-refactoring.md` upgraded with a `when_to_use` field
- [ ] The upgraded skill committed to the workshop repo
- [ ] A clear mental model of the three levels of skill distribution

---

## Reflection questions

- What is the difference between `description` and `when_to_use`? Why have both?
- Which of your current team processes would be worth encoding as a shared project skill?
- At what point does a project skill deserve to become a plugin? What would that decision look like?
