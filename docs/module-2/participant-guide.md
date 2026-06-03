# Module 2 Participant Guide

**Code Review, Context, and Commands**

---

## The scenario

A colleague has opened a PR on a shared service. The diff looks reasonable — no obvious bugs, tests pass — but you know there was a feature request last week that introduced edge cases the author may not have considered. The PR description doesn't mention it. How do you review confidently when the diff alone doesn't tell the whole story?

---

## What is MCP?

MCP stands for **Model Context Protocol** — an open standard that lets Claude connect to external tools and data sources beyond your local files.

By default, Claude Code can read and edit files in your repository. That is enough for most coding tasks. But some tasks require context that lives somewhere else: a GitHub PR description, a linked issue, a Jira ticket, a Confluence page, a database. Without access to those, Claude is working with an incomplete picture.

MCP is how you give Claude that access. You configure an MCP server for a specific tool — GitHub, in this module — and Claude can then query it directly: fetch a PR, read linked issues, check commit history. Claude does not scrape websites or guess. It calls the tool the same way you would, using your credentials.

**When to use it:** Any time the context Claude needs is not in your local repository. For code review, that means PR descriptions, linked issues, and the intent behind a change. For other tasks, it might mean support tickets, internal documentation, or deployment logs. MCP turns Claude from a local file reader into a tool that can reach the same systems you work with every day.

In this module you will see exactly what changes — and what Claude finds — when you give it GitHub access compared to reviewing from a diff alone.

---

## Overview

In this module you will experience a concrete limitation of doing code review with only a diff — then solve it with GitHub MCP. You will finish by encoding the improved approach into a reusable command you can take to your own projects.

By the end you will have:
- reviewed a real PR with and without external context
- configured GitHub MCP in a project
- understood why context changes what Claude can find
- written a command that encodes the full review process

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
## Common issues
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
