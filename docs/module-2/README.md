# Module 2: Code Review with GitHub MCP

**Duration:** ~50 minutes  
**Type:** Hands-on exercises  
**Prerequisite:** Module 1 complete

---

## What you will practise

- Configuring an MCP server so Claude can access an external system
- Using GitHub MCP to give Claude full PR context — description, linked issues, and more
- Understanding what MCP servers save you from building and maintaining yourself
- Writing a reusable `/review-pr` command that encodes the process for your team

---

## Two repos, two roles

This module uses two repositories. Read this before starting.

| Repo | Your role | What you do here |
|------|-----------|-----------------|
| **[workshop repo]** `ai-development-workshop` | Owner | Run commands, write files, configure MCP, commit your work |
| **[demo repo via MCP]** `ai-development-ws-ticket-demo` | Reviewer | Review a PR on it via GitHub MCP — read-only access |

> **Rule:** All files you create or modify — including `.mcp.json` and `.claude/commands/review-pr.md` — go in the **workshop repo**. The **demo repo** is read-only for participants. You never clone it, edit it, or commit to it.

---

## Exercises

1. [Exercise 1: Configure GitHub MCP and Review a PR](exercises/exercise-1-review-without-context.md)
2. [Exercise 2: Build a Reusable Command](exercises/exercise-2-github-mcp.md)

Or follow the [Participant Guide](participant-guide.md) for the full step-by-step walkthrough.

---

## Prerequisites

- Module 1 complete — you know how slash commands work
- `gh` CLI installed and authenticated: `gh auth status`
- Read access to GitHub (the MCP server is hosted — no local install needed)
- Read access to `superluminar-io/ai-development-ws-ticket-demo` (ask the facilitator)
