# Module 2: Code Review, Context, and Commands

**Duration:** ~60 minutes  
**Type:** Hands-on exercises  
**Prerequisite:** Module 1 complete

---

## What you will practise

- Reviewing a pull request using only a diff — and experiencing its limits
- Configuring GitHub MCP to give Claude access to PR descriptions, issues, and commit history
- Comparing reviews with and without external context
- Writing a reusable `/review-pr` command that encodes the full process

---

## Two repos, two roles

This module uses two repositories. Read this before starting.

| Repo | Your role | What you do here |
|------|-----------|-----------------|
| **Workshop repo** `ai-development-workshop` | Owner | Run commands, write files, configure MCP, commit your work |
| **Demo repo** `ai-development-ws-ticket-demo` | Reviewer | Review a PR on it via GitHub MCP — read-only access |

> **Rule:** All files you create or modify — including `.mcp.json` and `.claude/commands/review-pr.md` — go in the **workshop repo**. The **demo repo** is read-only for participants. You never clone it, edit it, or commit to it.

Every exercise step is labelled **[workshop repo]** or **[demo repo via MCP]** so you always know where you are.

---

## Exercises

1. [Exercise 1: Review Without Context](exercises/exercise-1-review-without-context.md)
2. [Exercise 2: GitHub MCP Setup and Re-review](exercises/exercise-2-github-mcp.md)
3. [Exercise 3: Build a Reusable Command](exercises/exercise-3-reusable-command.md)

Or follow the [Participant Guide](participant-guide.md) for the full step-by-step walkthrough.

---

## Prerequisites

- Module 1 complete — you know `/review-diff` and how slash commands work
- `gh` CLI installed and authenticated: `gh auth status`
- `npx` available (comes with Node 20+ from Module 1)
- Read access to `superluminar-io/ai-development-ws-ticket-demo` (ask the facilitator)
