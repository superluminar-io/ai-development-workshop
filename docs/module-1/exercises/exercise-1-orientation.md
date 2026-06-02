# Exercise 1: Codebase Orientation

**Goal:** Use Claude Code to explore an unfamiliar codebase, understand how Claude Code works as a configured tool, and write your first custom slash command.

**Duration:** ~18 minutes  
**Code changes:** None required (optional at the end)

---

## Step 1 — Read the project instructions (~3 min)

Open `CLAUDE.md` at the repo root.

Read it. This file tells Claude how to behave in this project. Notice:
- What it tells Claude to do before making changes
- What it tells Claude not to do
- How it defines the project's code structure

**Checkpoint:** Can you answer these questions from `CLAUDE.md` alone?
- What must Claude do before editing any file?
- What command runs the tests?
- What does `src/domain/` contain?

---

## Step 2 — Run /explain-codebase (~5 min)

In Claude Code, run:

```
/explain-codebase
```

Read Claude's output. It should describe:
- What the service does
- The data flow from input to output
- The key types and which files own which responsibilities

**Verify two claims:** Pick two specific things Claude said — a function name, a field name, a responsibility assignment — and check them directly in the source files. Do they match?

> Claude Code is useful for orientation, but its output is a model of the code, not the code itself. Verification is always your responsibility.

---

## Step 3 — Look at an existing command (~3 min)

Open `.claude/commands/explain-codebase.md` in your editor.

Notice:
- It is a plain markdown file — just a prompt
- It tells Claude which files to read and in what format to respond
- It explicitly says "Do not edit any files"

This is how Claude Code slash commands work. They are prompt files stored in `.claude/commands/`. You can write, modify, and share them.

---

## Step 4 — Write your own command (~5 min)

Create a new file: `.claude/commands/find-weaknesses.md`

Write a prompt that asks Claude to identify:
1. Fields in `src/domain/ticket.ts` that are typed too loosely
2. Missing or incomplete validation in `src/handlers/processTicket.ts`
3. Test cases that are absent from `test/domain/classifier.test.ts`

Use this skeleton as your starting point:

```markdown
Read the following files. Do not edit any files.

Files to read:
- src/domain/ticket.ts
- src/handlers/processTicket.ts
- test/domain/classifier.test.ts

Then identify:

1. **Typing gaps** — ...
2. **Missing validation** — ...
3. **Missing tests** — ...

Be specific. Quote field names, line numbers, and function names from the files.
Do not speculate. If you are uncertain, say so.
```

Fill in the `...` with your own prompt instructions. Save the file.

---

## Step 5 — Run your command (~2 min)

In Claude Code, run:

```
/find-weaknesses
```

Review the output. Make a list of what Claude identified.

**Checkpoint:** Does the list seem credible? Can you find each issue Claude named in the actual source files?

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A short note (2–4 sentences) describing what the ticket processor does
- [ ] A list of 3–5 suspected improvement areas
- [ ] `.claude/commands/find-weaknesses.md` committed or saved

You have not changed any source or test files yet.

---

## Reflection questions

- What would Claude have done if you had not read `CLAUDE.md` first? Would the output have been different?
- Which of Claude's claims did you verify? Did any of them turn out to be wrong or imprecise?
- What would you add to `CLAUDE.md` to make Claude more useful for this specific project?
