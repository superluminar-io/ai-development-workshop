# Exercise 1: Codebase Orientation

**Goal:** Use Claude Code to explore an unfamiliar codebase, understand how Claude Code works as a configured tool, and write your first custom slash command.

**Duration:** ~18 minutes  
**Code changes:** None required (optional at the end)

---

## Step 1 — Read the project instructions (~3 min)

Open `CLAUDE.md` at the repo root in your editor and read it. This file tells Claude how to behave in this project — what it must do before making changes, what it must not do, and how the code is structured. Claude reads this file automatically at the start of every session.

**Checkpoint:** Can you answer these questions from `CLAUDE.md` alone?
- What must Claude do before editing any file?
- What command runs the tests?
- What does `src/domain/` contain?

---

## Step 2 — Run /explain-codebase (~5 min)

In the Claude Code terminal (the same terminal where you ran `npm install`), type:

```
/explain-codebase
```

and press Enter. Claude will read the source files and produce a structured explanation of what the service does, how data flows through it, and which files own which responsibilities.

Read the output carefully. Then **verify two claims**: pick two specific things Claude said — a function name, a field name, a file responsibility — and check them directly in the source files. Do they match?

> Claude Code is useful for orientation, but its output is a model of the code, not the code itself. Verification is always your responsibility.

---

## Step 3 — Look at an existing command (~3 min)

Open `.claude/commands/explain-codebase.md` in your editor. Notice:
- It is a plain markdown file — just a prompt written in plain English
- It lists which files to read and what format to respond in
- It explicitly says "Do not edit any files"

This is how every slash command works. When you type `/explain-codebase`, Claude reads this file as its instructions. There is no magic — you can read, edit, and fully understand what you're asking Claude to do.

---

## Step 4 — Write your own command (~5 min)

You are going to create a new slash command that asks Claude to look for weaknesses in the codebase.

**Create the file** in your editor: `.claude/commands/find-weaknesses.md`

The filename determines the command name — `find-weaknesses.md` becomes `/find-weaknesses`. The file can live anywhere inside `.claude/commands/`.

Write a prompt that asks Claude to identify:
1. Fields in `src/domain/ticket.ts` that are typed too loosely
2. Missing or incomplete validation in `src/handlers/processTicket.ts`
3. Test cases that are absent from `test/domain/classifier.test.ts`

Use this skeleton as your starting point — replace the `...` sections with your own instructions:

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

Save the file. Claude Code picks up new commands automatically — no restart needed.

<details>
<summary>Hint: I'm not sure what to write in the prompt</summary>

Be as specific as you would be in a code review comment. Instead of "look for typing issues", write something like: "List every field in the Ticket type that is typed as `string` but could be a more specific type. For each one, explain what values are actually valid and what a better type would look like."

The more specific your prompt, the more specific Claude's output. Vague instructions produce vague output.

</details>

<details>
<summary>Hint: My command isn't showing up when I type /find-weaknesses</summary>

Check two things:
1. The file is saved at exactly `.claude/commands/find-weaknesses.md` — not in a subdirectory, and with the `.md` extension
2. You are running Claude Code from the repository root (the same directory that contains `CLAUDE.md`)

You can confirm commands are loading by running `/explain-codebase` — if that works, Claude Code is reading the commands directory correctly.

</details>

---

## Step 5 — Run your command (~2 min)

In the Claude Code terminal, type:

```
/find-weaknesses
```

Review the output and make a list of what Claude identified. For each finding, check whether you can locate the issue in the actual source file.

**Checkpoint:** Does the list seem credible? Can you find each issue Claude named in the code?

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A short note (2–4 sentences) describing what the ticket processor does
- [ ] A list of 3–5 suspected improvement areas
- [ ] `.claude/commands/find-weaknesses.md` saved or committed

You have not changed any source or test files yet.

---

## Reflection questions

- What would Claude have done if you had not read `CLAUDE.md` first? Would the output have been different?
- Which of Claude's claims did you verify? Did any of them turn out to be wrong or imprecise?
- What would you add to `CLAUDE.md` to make Claude more useful for this specific project?
