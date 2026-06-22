# Exercise 1: Configure GitHub MCP for Personal Use

**Goal:** Configure the GitHub MCP server yourself, verify it works, and run a PR review that uses full GitHub context — PR description, linked issue, and all.

**Duration:** ~25 minutes

---

## The scenario

You are reviewing a pull request on a colleague's codebase. The diff looks fine — reasonable changes, nothing obviously broken. But there is a linked issue that contains a constraint the author may have missed. You cannot see that constraint in the diff.

This is the realistic case where MCP changes the outcome: Claude fetches the issue itself, the same way you would, and uses it in the review. The setup script created exactly this scenario in your repo — there is an open PR with a planted constraint in its linked issue that the implementation ignores.

---

## Before you start

**Quick check — GitHub CLI (should be set up from the module introduction):**

```bash
gh --version
gh auth status
```

Expected: a version string, then `Logged in to github.com as <your username>`. If either command fails or shows unauthenticated, you may have missed the prerequisite setup — follow the [GitHub CLI setup instructions in the module participant guide](../participant-guide.md#prerequisites) before continuing.

---

## Step 1 — Understand the configuration hierarchy (~3 min)

Claude Code reads MCP server configuration from two places, applied in order:

| Scope | File | Who it applies to |
|-------|------|-------------------|
| **User** | `~/.claude.json` | You, across all projects |
| **Project** | `.mcp.json` in the project root | Everyone who checks out the repo |

When the same server name appears in both, the project-level config takes precedence.

There is also a **local** scope — also stored in `~/.claude.json` but under a specific project path — for personal overrides that should not be committed.

---

## Step 2 — Create the personal MCP configuration (~5 min)

Add the GitHub MCP server to `~/.claude.json`. This file may not exist yet, or it may already have other content — do not overwrite it.

If the file does not exist, create it with:

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

If the file already exists, add the `"mcpServers"` block alongside whatever is already there — do not replace the whole file.

What each field does:
- `"type": "http"` — connects to a remote server over HTTP rather than running a local process
- `"url"` — GitHub's hosted MCP server, maintained by GitHub
- `"headers"` — the Bearer token Claude passes with every request; `${GITHUB_PERSONAL_ACCESS_TOKEN}` is expanded from your environment at startup

Because this lives in `~/.claude.json`, it is never committed to any repository. It is personal to your machine.

---

## Step 3 — Set your GitHub token (~2 min)

In your terminal:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

Verify it worked:

```bash
echo $GITHUB_PERSONAL_ACCESS_TOKEN | head -c 10
```

Expected: a non-empty string starting with `gh` or `ghu`.

> This variable must be set **before** launching Claude Code. If Claude Code is already running, set the variable and **restart Claude Code** so it picks up the new `~/.claude.json` and token.

---

## Step 4 — Verify GitHub MCP is active (~3 min)

In Claude Code, ask:

> "What MCP servers do you have access to?"

Expected: Claude confirms the `github` MCP server is available.

Then ask:

> "Using GitHub MCP, what open pull requests exist in the repo `<your-github-username>/<your-repo-name>`?"

Expected: Claude lists the open PR(s) by number and title. If it cannot find the repo, check that your token belongs to the same GitHub account that owns the repo.

<details>
<summary>Hint: GitHub MCP is not activating</summary>

Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the terminal where you launched Claude Code: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`. If empty, run `export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)` then relaunch Claude Code.

</details>

<details>
<summary>Hint: Claude cannot find my repo</summary>

Make sure you are using the exact repo name printed at the end of `setup-module-2.sh`. Your token must belong to the same GitHub account that owns the repo.

</details>

---

## Step 5 — Review the PR with full GitHub context (~10 min)

Ask Claude to review the open PR:

> "Using GitHub MCP, please review the open PR in `<your-github-username>/<your-repo-name>`. Before reviewing the code, fetch the PR description and all linked issues. Then review the diff against what the PR and linked issue say the change is supposed to do."

Read the review carefully. Notice what Claude includes without you having to provide it:
- The PR description and what it claims the change does
- Any constraints or edge cases mentioned in the linked issue
- Whether the implementation matches the stated intent

---

## Step 6 — Reflect (~3 min)

Think about what you would have had to do manually to give Claude the same context:
- Open the PR, copy the description
- Follow any linked issues, copy those too
- Paste all of it into your chat alongside the diff

With GitHub MCP, Claude fetched all of that itself. And because this lives in `~/.claude.json`, it works in any project on this machine — not just this repo.

**Consider:** this is one MCP server. The same pattern works for Slack, Linear, Jira, your database. Each one is an integration you did not have to build or maintain yourself.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] `~/.claude.json` updated with the GitHub MCP server configuration
- [ ] GitHub MCP verified working
- [ ] A PR review that used the linked issue — not just the diff
- [ ] A clear example of something Claude found by reading the linked issue that was not visible in the diff
