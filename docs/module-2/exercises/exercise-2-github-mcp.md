# Exercise 2: GitHub MCP Setup and Re-review

**Goal:** Configure GitHub MCP, verify it works, and re-run the PR review with full context. Compare the two reviews.

**Duration:** ~25 minutes

**Repo guide for this exercise:**
- **[workshop repo]** — where you edit config files, run terminal commands, and commit
- **[demo repo via MCP]** — what Claude reads when you ask it about the PR, issues, and commits

---

## Step 1 — Set your GitHub token (~3 min)

**[workshop repo]** In your terminal:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

Verify it worked:

```bash
echo $GITHUB_PERSONAL_ACCESS_TOKEN | head -c 10
```

Expected: a token string starting with `gh` or `ghu` (not blank).

> This environment variable must be set **before** you launch Claude Code. If Claude Code is already running, set the variable and restart it.

---

## Step 2 — Read the MCP configuration (~3 min)

**[workshop repo]** Open `.mcp.json` in your editor.

Read it. Notice:
- It defines a server named `"github"`
- The server runs via `npx` — no separate install required
- It reads `GITHUB_PERSONAL_ACCESS_TOKEN` from your environment
- Claude Code loads this automatically when the project is opened

This is how MCP servers are configured for a project. The file is version-controlled — your team gets the same configuration.

---

## Step 3 — Verify GitHub MCP is active (~3 min)

**[workshop repo]** In Claude Code, ask:

> "What MCP servers do you have access to? Can you see the GitHub MCP server?"

Expected: Claude confirms the `github` MCP server is available.

Then ask:

> "Using GitHub MCP, what open pull requests exist in the repo `superluminar-io/ai-development-ws-ticket-demo`?"

Expected: Claude lists the open PR(s) by number and title. If it cannot find the repo, check that your token has read access to the demo repo (ask the facilitator).

---

## Step 4 — Re-run the PR review with GitHub MCP (~10 min)

**[demo repo via MCP]** Ask Claude to review the same PR from Exercise 1, this time using GitHub MCP:

> "Using GitHub MCP, please review PR #<number> in `superluminar-io/ai-development-ws-ticket-demo`. Before reviewing the code, fetch the PR description and all linked issues. Then review the diff against what the PR and issue say the change is supposed to do."

Read the review carefully.

---

## Step 5 — Compare the two reviews (~6 min)

Put your Exercise 1 review and the Exercise 2 review side by side.

Answer these questions:
1. What did the MCP-enabled review find that the diff-only review missed?
2. Did Claude's unanswered questions from Exercise 1 get answered? Which ones?
3. Was there anything in the linked issue that changed how you read the code?

**Checkpoint:** If the MCP review did not find significantly more than the diff-only review, the demo repo may not have a linked issue with edge case detail. Ask the facilitator.

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] GitHub MCP configured and verified working
- [ ] A second PR review using full GitHub context
- [ ] A written comparison of the two reviews
- [ ] A clear example of something the linked issue revealed that the diff did not

No source code changes. No commits needed (MCP config was already committed).

---

## Reflection questions

- What changed in Claude's analysis when it had access to the linked issue?
- The MCP server runs via `npx` — it starts fresh each time. What are the implications for speed and reliability?
- If you were setting this up for your own team's repo, what would you change in `.mcp.json`?
