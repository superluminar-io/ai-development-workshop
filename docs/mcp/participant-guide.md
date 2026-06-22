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

## What will you do in this module?

- **Exercise 1 — Configure GitHub MCP (~25 min):** Set up the GitHub MCP server and run a PR review with full context — PR description, linked issue, and all.
- **Exercise 2 — Integrate GitHub MCP into the Project (~25 min):** Move the MCP config to the repo and upgrade the review command.
- **Exercise 3 — Build a Reusable Command (~18 min):** Complete the `/review-pr` command skeleton with precise review logic.

---

## Prerequisites

### 1 — GitHub CLI

Install if you have not already:

```bash
# macOS
brew install gh

# or download from https://cli.github.com
```

Authenticate:

```bash
gh auth login
```

Follow the prompts — select GitHub.com and authenticate via browser. When asked about the preferred git protocol, run this first to check what you already use:

```bash
git remote get-url origin
```

If the URL starts with `git@github.com:` choose SSH. If it starts with `https://github.com/` choose HTTPS.

### 2 — Push the workshop repo to your own GitHub account

The exercises in this module review a PR on a real GitHub repo. You will use your own fork so you can run the setup script independently.

If you have not already done this, create a new repository on GitHub (any name, public or private) and push:

```bash
git remote set-url origin git@github.com:<your-username>/<your-repo-name>.git
git push -u origin main
git push origin demo/vip-routing
```

### 3 — Run the module setup script

This creates the issue and PR you will review in the exercises:

```bash
bash scripts/setup-mcp.sh
```

Expected output: two URLs — one for the issue and one for the PR. The script prints your repo name at the end; note it down, you will use it in the exercises.

<details>
<summary>The setup script fails</summary>

Check that `gh auth status` shows you are authenticated and that you have pushed `demo/vip-routing` to your remote: `git push origin demo/vip-routing`.

</details>

### 4 — Set your GitHub token

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
echo $GITHUB_PERSONAL_ACCESS_TOKEN | head -c 10   # should be non-empty
```

> This variable must be set **before** launching Claude Code. If Claude Code is already running when you set it, restart Claude Code.

<details>
<summary>GitHub MCP is not activating</summary>

Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the terminal where you launch Claude Code: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`. If empty, run `export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)` then relaunch Claude Code.

</details>

### 5 — Verify

```bash
npm test          # 15 tests passing
gh auth status    # authenticated to GitHub
```

