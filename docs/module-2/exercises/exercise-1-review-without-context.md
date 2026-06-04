# Exercise 1: Configure GitHub MCP and Review a PR

**Goal:** Configure the GitHub MCP server yourself, verify it works, and run a PR review that uses full GitHub context — PR description, linked issue, and all.

**Duration:** ~25 minutes  
**Repo guide:** This exercise uses the **[demo repo via MCP]** as the target, but you run all commands from the **[workshop repo]**.

---

## Before you start

**Quick check — GitHub CLI (should be set up from the module introduction):**

```bash
gh --version
gh auth status
```

Expected: a version string, then `Logged in to github.com as <your username>`. If either command fails or shows unauthenticated, you may have missed the prerequisite setup — follow the [GitHub CLI setup instructions in the module participant guide](../participant-guide.md#prerequisites) before continuing.

---

## Step 1 — Create the MCP configuration (~5 min)

**[workshop repo]** Create a file named `.mcp.json` at the root of the repository with this content:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

What each field does:
- `"type": "http"` — connects to a remote server over HTTP rather than running a local process
- `"url"` — GitHub's hosted MCP server, maintained by GitHub
- `"headers"` — the Bearer token Claude passes with every request; `${GITHUB_PERSONAL_ACCESS_TOKEN}` is expanded from your environment at startup

This is how any MCP server is configured for a project. The file is version-controlled — commit it and your team gets the same setup automatically.

---

## Step 2 — Set your GitHub token (~2 min)

**[workshop repo]** In your terminal:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

Verify it worked:

```bash
echo $GITHUB_PERSONAL_ACCESS_TOKEN | head -c 10
```

Expected: a non-empty string starting with `gh` or `ghu`.

> This variable must be set **before** launching Claude Code. If Claude Code is already running, set the variable and **restart Claude Code** so it picks up the new `.mcp.json` and token.

---

## Step 3 — Verify GitHub MCP is active (~3 min)

**[workshop repo]** In Claude Code, ask:

> "What MCP servers do you have access to?"

Expected: Claude confirms the `github` MCP server is available.

Then ask:

> "Using GitHub MCP, what open pull requests exist in the repo `superluminar-io/ai-development-ws-ticket-demo`?"

Expected: Claude lists the open PR(s) by number and title. If it cannot find the repo, check that your token has read access (ask the facilitator).

---

## Step 4 — Review the PR with full GitHub context (~10 min)

**[demo repo via MCP]** Ask Claude to review the open PR:

> "Using GitHub MCP, please review PR #3 in `superluminar-io/ai-development-ws-ticket-demo`. Before reviewing the code, fetch the PR description and all linked issues. Then review the diff against what the PR and linked issue say the change is supposed to do."

Read the review carefully. Notice what Claude includes without you having to provide it:
- The PR description and what it claims the change does
- Any constraints or edge cases mentioned in the linked issue
- Whether the implementation matches the stated intent

---

## Step 5 — Commit your configuration (~2 min)

**[workshop repo]** Commit `.mcp.json` so your team can use the same setup:

```bash
git add .mcp.json
git commit -m "feat: add GitHub MCP server configuration"
```

---

## Step 6 — Reflect (~3 min)

Think about what you would have had to do manually to give Claude the same context:
- Open the PR, copy the description
- Follow any linked issues, copy those too
- Paste all of it into your chat alongside the diff

With GitHub MCP, Claude fetched all of that itself. And this configuration works for any GitHub repository your token can access — not just the demo repo.

**Consider:** this is one MCP server. The same pattern works for Slack, Linear, Jira, your database. Each one is an integration you did not have to build or maintain yourself.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] `.mcp.json` created and committed to the workshop repo
- [ ] GitHub MCP verified working
- [ ] A PR review that used the linked issue — not just the diff
- [ ] A clear example of something Claude found by reading the linked issue that was not visible in the diff
