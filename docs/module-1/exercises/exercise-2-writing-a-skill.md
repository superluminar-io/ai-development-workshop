# Exercise 2: Writing a Skill

**Goal:** Write a skill that Claude recognises and applies automatically when the situation calls for it — without you having to ask.

**Duration:** ~12 minutes  
**Prerequisites:** Exercise 1 complete

---

## Skills vs commands

In Exercise 1 you wrote a **command** — a prompt in `.claude/commands/` that you invoke explicitly by typing `/find-weaknesses`. You decide when to run it.

A **skill** is different. Skills live in `.claude/skills/`, and Claude decides when to apply them, based on what you are asking it to do. Each skill is a **directory** containing a `SKILL.md` file:

```
.claude/skills/
└── safe-refactoring/
    └── SKILL.md
```

Claude Code discovers skills automatically — no configuration in `CLAUDE.md` is needed. When you describe a task, Claude reads the `description` field of every skill and decides whether the current situation is a match. If it is, the skill's instructions are loaded and Claude follows them.

This means the `description` is the trigger. Write it too vaguely and Claude will either never apply the skill or apply it when it shouldn't. Write it with a clear, specific situation and Claude will apply it reliably and automatically.

> **Reference:** Open `.claude/skills/example-skill/SKILL.md` to see a complete skill with all frontmatter fields annotated.

---

## Step 1 — Create your first skill (~8 min)

Create the directory and file: `.claude/skills/safe-refactoring/SKILL.md`

You are about to refactor a TypeScript codebase you have only just met. Write a skill that encodes how Claude should approach that — the caution, the order of operations, the constraints — so you do not have to repeat them every time you ask for a change.

Use this structure:

```markdown
---
name: safe-refactoring
description: ...
---

When this skill applies:

1. ...
2. ...
```

**Your job is to write the `description` and the numbered steps.**

For the description, think about the exact situation this skill should cover. Compare:

- `Use when refactoring code` — too broad. This would fire on almost anything.
- `Use when asked to modify or improve existing TypeScript code in a codebase I did not write` — specific situation, clear trigger.

For the steps, think about what you would tell a careful engineer who had never seen this repo:
- What should they do before touching any code?
- What is the safe order of operations?
- What should they never do in a single step?

<details>
<summary>Hint: I'm not sure what steps to write</summary>

Think about what makes refactoring risky when you don't know the codebase. A reasonable set of steps:

1. Read the existing tests before touching any code — they document intended behaviour
2. Run `npm test` to confirm a passing baseline before making any changes
3. Change one thing at a time — never modify types and runtime behaviour in the same step
4. Run `npm test` after each change
5. If a test fails unexpectedly, stop and read the failure before continuing
6. Do not refactor code outside the current task scope

You do not need to copy these exactly. Write what you think matters.

</details>

<details>
<summary>Hint: How do I know if my description is specific enough?</summary>

Ask yourself: if someone read only this description, would they know exactly which tasks this skill applies to and which it does not?

If the description would also match unrelated tasks — like "review this PR" or "explain what this function does" — it is too broad. Tighten it to the specific action and context.

</details>

---

## Step 2 — Test whether the skill triggers (~4 min)

Start a fresh Claude Code session (or run `/clear` to reset context). Then describe a task that should match your skill:

> "I want to improve the TypeScript types in this codebase. I didn't write this code and I want to be careful."

Read Claude's response. Did it apply your skill? You can tell by whether Claude's approach matches the steps you wrote — does it mention running tests first? Does it propose one change at a time?

If the skill did not trigger, read your `description` again. Is it specific enough? Does it match the language you used when describing the task? Adjust and try again.

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] `.claude/skills/safe-refactoring/SKILL.md` with frontmatter and numbered steps
- [ ] Observed Claude applying the skill automatically — or iterated on the description until it does

You have not changed any source or test files.

---

## Reflection questions

- What is the difference between a skill and a command? When would you choose one over the other?
- How specific does the `description` need to be before Claude applies the skill reliably?
- What other situations in your daily work might benefit from a skill?
- In Module 3 you will install skills written by others. What would you need to trust before using a skill you didn't write?
