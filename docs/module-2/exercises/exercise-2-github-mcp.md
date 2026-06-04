# Exercise 2: Upgrade the review-pr Command

**Goal:** Check the existing `/review-pr` command, see where it falls short, and upgrade it to use the GitHub MCP server you set up in Exercise 1.

**Duration:** ~20 minutes

**Repo guide for this exercise:**
- **[workshop repo]** — where you edit and commit the command file
- **[demo repo via MCP]** — what Claude reads when you run `/review-pr`

---

## The scenario

While you were setting up GitHub MCP, a colleague had already added a `/review-pr` command to the repository. They wanted a consistent review format — same structure every time. Good idea. But they wrote it before anyone thought about MCP.

---

## Step 1 — See what the existing command does (~5 min)

**[workshop repo]** Open `.claude/commands/review-pr.md` and read it.

Then run it:

```
/review-pr
```

When Claude asks which PR to review:

> "PR #3 in `superluminar-io/ai-development-ws-ticket-demo`"

Read the output. The command works — but it can only review what Claude can see in the diff. It has no way to fetch the PR description, the linked issue, or any context your team recorded in GitHub.

---

## Step 2 — Upgrade it (~12 min)

You have just seen exactly what GitHub MCP can do. You cannot go back.

**[workshop repo]** Update `.claude/commands/review-pr.md` to use your new MCP server. You know what it can fetch and how to ask for it — use that.

While you are in there, tighten up the four review criteria too. Vague instructions produce vague output.

---

## Step 3 — Run it again and compare (~5 min)

```
/review-pr
```

> "PR #3 in `superluminar-io/ai-development-ws-ticket-demo`"

Did Claude fetch and use the linked issue? Did it find something the first run missed?

If the output is still vague, the instructions are probably still too general — refine and run again.

---

## Step 4 — Commit (~2 min)

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
- [ ] `.claude/commands/review-pr.md` upgraded and committed
- [ ] A before/after: at least one finding that came from the linked issue, not the diff
- [ ] A view on what "team-ready" means for a shared command
