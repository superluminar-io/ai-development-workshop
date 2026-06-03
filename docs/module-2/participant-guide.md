# Module 2 Participant Guide

**From Prompts to Repeatable AI Workflows**

---

## The scenario

A colleague has opened a PR on a shared service. The diff looks reasonable — no obvious bugs, tests pass — but you know there was a feature request last week that introduced edge cases the author may not have considered. The PR description doesn't mention it. How do you review confidently when the diff alone doesn't tell the whole story?

---

## Overview

In this module you will experience a concrete limitation of the Module 1 review workflow — then solve it with GitHub MCP. You will finish by encoding the improved workflow into a reusable command that you can take to your own projects.

By the end you will have:
- reviewed a real PR with and without external context
- configured GitHub MCP in a project
- understood why context changes what Claude can find
- written a command that encodes the full review workflow

---

## Two repos — read this first

This module involves two repositories. Every step below is labelled so you always know which one you are working in.

| Label | Repo | Your relationship |
|-------|------|-------------------|
| **[workshop repo]** | `ai-development-workshop` | Owner — you run commands, write files, commit here |
| **[demo repo via MCP]** | `ai-development-ws-ticket-demo` | Reviewer — Claude reads it via GitHub MCP, you do not clone it |

**You never clone, edit, or commit to the demo repo.** It is read-only for participants. Every file you create or modify — including the new `/review-pr` command — goes in the workshop repo. The demo repo is purely the thing you are reviewing.

> Think of it like another team's codebase: you review it, you don't commit to it. Your work product (the review, the command you wrote) lives in your own repo.

---

## Prerequisites

**[workshop repo]** Verify everything is in place:

```bash
npm test          # 14 tests passing
gh auth status    # authenticated to GitHub
```

Then set your GitHub token:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
echo $GITHUB_PERSONAL_ACCESS_TOKEN | head -c 10   # should be non-empty
```

> This variable must be set **before** launching Claude Code. If Claude Code is already running when you set it, restart Claude Code.

Ask the facilitator to confirm your GitHub account has read access to `superluminar-io/ai-development-ws-ticket-demo` before starting Exercise 2.

---

## Exercise 1 — Review Without Context (~15 min)

Full instructions: [exercises/exercise-1-review-without-context.md](exercises/exercise-1-review-without-context.md)

**Quick summary:**
1. **[demo repo via MCP]** Get the open PR URL from the facilitator. Read the title and description in your browser.
2. **[workshop repo]** Run `/review-diff` with the pasted diff — no GitHub MCP yet
3. **[workshop repo]** Note what Claude cannot answer from the diff alone
4. **[workshop repo]** Try to fill those gaps from the PR description — note what remains unanswered

**Checkpoint after Exercise 1:**
- [ ] I have a review produced by `/review-diff`
- [ ] I have a list of unanswered questions
- [ ] I understand what context the diff does not provide
- [ ] I have not changed any files

---

## Exercise 2 — GitHub MCP Setup and Re-review (~25 min)

Full instructions: [exercises/exercise-2-github-mcp.md](exercises/exercise-2-github-mcp.md)

**Quick summary:**
1. **[workshop repo]** Set `GITHUB_PERSONAL_ACCESS_TOKEN` and restart Claude Code if needed
2. **[workshop repo]** Read `.mcp.json` — understand what it configures
3. **[workshop repo]** Verify GitHub MCP is active by asking Claude what it can see
4. **[demo repo via MCP]** Re-run the PR review with full GitHub context
5. **[workshop repo]** Compare the two reviews — what did MCP reveal?

**Checkpoint after Exercise 2:**
- [ ] GitHub MCP is configured and verified working
- [ ] I have a second review using full GitHub context
- [ ] I can name something the linked issue revealed that the diff did not
- [ ] I understand why the third planted issue was invisible without MCP

---

## Exercise 3 — Build a Reusable Command (~18 min)

Full instructions: [exercises/exercise-3-reusable-command.md](exercises/exercise-3-reusable-command.md)

**Quick summary:**
1. **[workshop repo]** Open `.claude/commands/review-pr.md` — read the skeleton
2. **[workshop repo]** Complete the four prompt sections with your own instructions
3. **[workshop repo]** Run `/review-pr` — Claude will read the **[demo repo via MCP]** PR
4. **[workshop repo]** Commit your completed command

**Checkpoint after Exercise 3:**
- [ ] `.claude/commands/review-pr.md` is complete and committed to the workshop repo
- [ ] `/review-pr` found at least the first two planted issues in the demo PR
- [ ] I have a list of refinements I would make before using this on my own team's repos

---

## Troubleshooting

**GitHub MCP is not activating**  
Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the terminal where you launch Claude Code: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`. If empty, run `export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)` then relaunch Claude Code.

**Claude cannot find the demo repo**  
Ask the facilitator to confirm your GitHub account has read access to `superluminar-io/ai-development-ws-ticket-demo`. The MCP token must belong to an account with access.

**`/review-pr` produces vague output**  
The command skeleton has placeholder instructions `[...]`. If you have not replaced them yet, do so in Step 2 of Exercise 3. Vague prompts produce vague output — be specific about what to look for.

**Claude does not fetch the linked issue**  
Add an explicit instruction to Step 1 of your command: "Fetch all GitHub issues linked in the PR description before reviewing any code." Claude will not fetch linked issues unless asked.

**The two reviews look the same**  
The key difference is the third planted issue — an edge case from the linked issue. If the reviews look identical, check whether your Exercise 2 prompt explicitly asked Claude to read the linked issue. If not, ask again with: "Read all issues linked in the PR description and check whether each edge case mentioned is handled in the code."

**I accidentally tried to commit to the demo repo**  
You should not have cloned the demo repo at all. All commits go in the workshop repo (`ai-development-workshop`). If you cloned the demo repo by mistake, delete the clone — you only need read access via GitHub MCP.
