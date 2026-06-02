# Exercise 3: Build a Reusable Command

**Goal:** Complete the `/review-pr` command skeleton and encode the best review workflow you practised in Exercises 1 and 2.

**Duration:** ~18 minutes

**Repo guide for this exercise:**
- **[workshop repo]** — where you write and commit the command file
- **[demo repo via MCP]** — what Claude reads when you run `/review-pr`

---

## Step 1 — Read the skeleton (~3 min)

**[workshop repo]** Open `.claude/commands/review-pr.md` in your editor.

Read the structure:
- Step 1 tells Claude which repo to query and what to fetch via GitHub MCP
- Step 2 asks Claude to state the intent from the PR and issue
- Step 3 has four numbered sections with placeholder text in brackets `[...]`
- Step 4 defines the output format

Your job is to replace the bracketed `[...]` placeholders in Step 3 with real prompt instructions. Each section should tell Claude *specifically* what to look for — not just "check this", but what evidence to look for and how to report it.

---

## Step 2 — Complete the command (~8 min)

**[workshop repo]** Edit `.claude/commands/review-pr.md`.

Replace the four bracketed placeholders in Step 3 with your own instructions. Use what you learned in Exercises 1 and 2 as guidance. Here are prompts to help you write each one:

**Intent match:**
> What should Claude check to know if the code does what the PR description says? Should it quote the description and compare it to specific lines?

**Type safety:**
> What type patterns were visible in the diff? What should Claude look for specifically?

**Test coverage:**
> Should Claude list the new functions or branches that have no test? Should it propose test names?

**Edge cases:**
> How should Claude find edge cases from the linked issue? Should it quote the issue text?

Save the file. The command is now yours.

---

## Step 3 — Run your command on the sample PR (~4 min)

**[workshop repo]** In Claude Code, run:

```
/review-pr
```

**[demo repo via MCP]** When Claude asks which PR to review, provide:

> "PR #<number> in `superluminar-io/ai-development-ws-ticket-demo`"

Read the output. Check:
- Did Claude fetch the PR description and linked issue before reviewing the code?
- Did it use language from the issue in its review?
- Did the structured output format (summary, issues, risk, recommendation) appear?

If the output is vague or misses the planted issues, refine your Step 3 instructions and run again.

---

## Step 4 — Commit and reflect (~3 min)

**[workshop repo]** When you are satisfied with the command output:

```bash
git add .claude/commands/review-pr.md
git commit -m "feat: complete review-pr command with GitHub MCP workflow"
```

Then discuss with the group:
- What made the difference between a vague Claude output and a specific one?
- What would you change in this command before using it on your own team's repos?
- What would "team-ready" mean for this command — what would need to be true before you shared it with colleagues?

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] A completed `.claude/commands/review-pr.md` committed to the workshop repo
- [ ] A PR review produced by your command that found at least the first two planted issues
- [ ] A list of refinements you would make before using this command on your own repos

---

## Reflection questions

- The command skeleton gave you the structure — what did writing the prompts yourself teach you?
- How does a well-specified command compare to asking Claude the same thing conversationally?
- What other commands from your daily workflow could be encoded this way?
