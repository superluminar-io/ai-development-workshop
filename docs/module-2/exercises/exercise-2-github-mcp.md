# Exercise 2: Integrate GitHub MCP into the Project

**Goal:** Move the GitHub MCP configuration from your personal settings into the project so it is version-controlled and shared automatically with your team. Then upgrade the `/review-pr` command to use it.

**Duration:** ~25 minutes

---

## The scenario

GitHub MCP works for you, but your teammates still have to configure it themselves. Committing a `.mcp.json` to the repo solves that. A colleague also added a `/review-pr` command for consistent reviews — written before anyone thought about MCP.

---

## Step 1 — Move the configuration into the project (~5 min)

**[workshop repo]** Create a file named `.mcp.json` at the root of the repository with the same content you added to `~/.claude.json`:

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

The token itself is still read from the environment — it is not stored in the file. The file is safe to commit.

Commit it:

```bash
git add .mcp.json
git commit -m "feat: add GitHub MCP server configuration"
```

Anyone who clones this repo now gets GitHub MCP automatically. They only need to set `GITHUB_PERSONAL_ACCESS_TOKEN` in their environment.

---

## Step 2 — Read the existing command (~3 min)

**[workshop repo]** Open `.claude/commands/review-pr.md` and read it.

The command works — but it can only review what Claude can see in the diff. It has no way to fetch the PR description, the linked issue, or any context your team recorded in GitHub.

---

## Step 3 — Upgrade it (~12 min)

You have just seen exactly what GitHub MCP can do. You cannot go back.

**[workshop repo]** Update `.claude/commands/review-pr.md` to use your new MCP server. You know what it can fetch and how to ask for it — use that.

While you are in there, tighten up the four review criteria too. Vague instructions produce vague output.

<details>
<summary>Hints</summary>

**Where to start:** The command jumps straight to reviewing the diff. What should happen before that?

**The hardcoded repo:** The command has a repo name baked in. That will break for anyone using their own fork — the command should detect the repo from the project's git remote instead.

**The four criteria:** Each one is a question Claude will answer as specifically as the question is asked.
- *Intent match* — currently checks the PR title. What else describes intent?
- *Type safety* — fine as-is.
- *Test coverage* — fine as-is.
- *Edge cases* — where did you find the constraint Claude missed in Exercise 1?

</details>

<details>
<summary>Solution</summary>

```markdown
You are reviewing a pull request. Do not approve or merge anything. Produce a structured review only.

The repo is this project's GitHub repository. Determine it from the git remote if needed. If no PR number was provided, use GitHub MCP to list open PRs and ask the user to choose one.

---

## Step 1: Fetch GitHub context

Using GitHub MCP, fetch:
- The PR title and description
- All issues linked in the PR description
- The PR diff

Read all of this before reviewing any code.

---

## Step 2: Review the diff

For each of the following, be specific — quote file names and line numbers:

1. **Intent match** — does the implementation do what the PR description says it should? Does it satisfy the requirements and constraints in any linked issues?
2. **Type safety** — are new types as precise as they should be?
3. **Test coverage** — what new behaviour is untested?
4. **Edge cases** — are there constraints or scenarios mentioned in linked issues that the implementation does not handle?

---

## Step 3: Produce a structured review

- **Summary:** what the PR does (one sentence)
- **Issues found:** list each issue, noting whether it was visible in the diff, the PR description, or only in a linked issue
- **Risk:** Low / Medium / High — and why
- **Recommendation:** Approve / Request changes / Needs discussion
```

</details>

---

## Step 4 — Run it again and compare (~5 min)

```
/review-pr
```

> "The open PR in `<your-github-username>/<your-repo-name>`"

Did Claude fetch and use the linked issue? Did it find something the first run missed?

If the output is still vague, the instructions are probably still too general — refine and run again.

---

## Step 5 — Commit (~2 min)

```bash
git add .claude/commands/review-pr.md
git commit -m "feat: upgrade review-pr command with GitHub MCP"
```

---

## Reflect

- What did the upgraded command find that the original missed?
- Was the improvement from MCP access, from more specific instructions, or both?
- What would need to be true before you shared this command with your whole team?

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] `.mcp.json` created and committed to the workshop repo
- [ ] `.claude/commands/review-pr.md` upgraded and committed
- [ ] A before/after: at least one finding that came from the linked issue, not the diff
- [ ] A view on what "team-ready" means for a shared command
