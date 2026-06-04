# Module 2 Participant Guide

**Code Review with GitHub MCP**

---

## The scenario

A colleague has opened a PR. The diff looks fine — no obvious bugs, tests pass. But you know there was a feature request last week that added a constraint the author may not have considered. The constraint is in a GitHub issue, not in the code. You want Claude to review the PR against the full picture: the description, the linked issue, everything.

You could copy-paste it all in manually. Or you could give Claude direct access to GitHub — so it can fetch what it needs, the same way you would.

---

## What is an MCP server?

MCP (Model Context Protocol) is an open standard that lets Claude call external tools directly. Instead of you gathering context and pasting it in, Claude fetches it itself — using your credentials, the same way you would.

The important thing is not just convenience. **You do not write the integration.** The MCP server is a pre-built connector, maintained by the tool provider or the open-source community. You configure it once — credentials and a JSON file — and Claude can use that tool from that point on.

If you wanted to give Claude GitHub access without MCP, you would need to write your own tool: call the GitHub API, handle authentication, parse the response, pass it to Claude. Then maintain it every time the API changes. MCP servers exist so you do not have to do that.

GitHub provides an official MCP server. So do Slack, Linear, Jira, and many other tools your team already uses. Each follows the same pattern: add an entry to `.mcp.json`, set a token, and Claude gains access to that system.

---

## Overview

In this module you will configure the GitHub MCP server, use it to do a thorough PR review, and encode that process as a reusable command.

By the end you will have:
- configured GitHub MCP for a project
- used it to review a real PR with full context — PR description, linked issue, and all
- understood why MCP servers exist and what they save you from building
- written a reusable `/review-pr` command your team could use

---

## Two repos — read this first

This module involves two repositories. Every step is labelled so you always know which one you are working in.

| Label | Repo | Your relationship |
|-------|------|-------------------|
| **[workshop repo]** | `ai-development-workshop` | Owner — you run commands, write files, commit here |
| **[demo repo via MCP]** | `ai-development-ws-ticket-demo` | Reviewer — Claude reads it via GitHub MCP, you do not clone it |

**You never clone, edit, or commit to the demo repo.** It is read-only for participants. Every file you create or modify — including `.mcp.json` and `.claude/commands/review-pr.md` — goes in the workshop repo.

> Think of it like another team's codebase: you review it, you don't work in it.

---

## Prerequisites

**Install the GitHub CLI** if you have not already:

```bash
# macOS
brew install gh

# or download from https://cli.github.com
```

Then authenticate:

```bash
gh auth login
```

Follow the prompts — select GitHub.com and authenticate via browser. When asked about the preferred git protocol, run this first to check what you already use:

```bash
git remote get-url origin
```

If the URL starts with `git@github.com:` choose SSH. If it starts with `https://github.com/` choose HTTPS.

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

Ask the facilitator to confirm your GitHub account has read access to `superluminar-io/ai-development-ws-ticket-demo` before starting.

---

## Common issues

**GitHub MCP is not activating**
Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the terminal where you launch Claude Code: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`. If empty, run `export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)` then relaunch Claude Code.

**Claude cannot find the demo repo**
Ask the facilitator to confirm your GitHub account has read access to `superluminar-io/ai-development-ws-ticket-demo`. The token must belong to an account with access.

**`/review-pr` produces vague output**
The command skeleton has placeholder instructions `[...]`. If you have not replaced them yet, do so in Exercise 2. Vague prompts produce vague output — be specific about what to look for.

**Claude does not fetch the linked issue**
Add an explicit instruction to your command: "Fetch all GitHub issues linked in the PR description before reviewing any code." Claude will not fetch linked issues unless asked.

**I accidentally tried to commit to the demo repo**
You should not have cloned the demo repo at all. All commits go in the workshop repo. If you cloned the demo repo by mistake, delete the clone — you only need read access via GitHub MCP.
