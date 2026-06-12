# Module 2 Facilitator Guide

**Code Review with GitHub MCP**

---

## Learning goals

By the end of this module participants should be able to:

1. Explain what an MCP server is and why it exists — specifically what it saves you from building yourself
2. Configure GitHub MCP for a project using `.mcp.json`
3. Use GitHub MCP to give Claude access to PR descriptions, linked issues, and commit history
4. Articulate the difference between a diff-only review and one with full GitHub context
5. Complete a command skeleton and encode a specific process as a reusable slash command
6. Explain what makes a command "team-ready" vs personal

**The meta-skill:** understanding that Claude's output quality is bounded by the context it has access to — and that MCP servers are a way to expand that context without writing and maintaining your own integrations.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Module 1 + intro | 5 min |
| Live demo: GitHub MCP in action | 5 min |
| Exercise 1 | 25 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 20 min |
| Debrief Exercise 2 + wrap-up | 5 min |
| **Total** | **~65 min** |

> If time is short, see **Simplifications** below.

---

## Before the session

The demo scenario is built into the workshop repo itself — no separate repo to maintain. Participants push the workshop repo to their own GitHub account and run `scripts/setup-module-2.sh`, which creates the issue and PR they will review.

### The scenario

The `demo/vip-routing` branch adds VIP customer routing to the ticket processor. The PR and linked issue contain three planted bugs at increasing depth:

| Tier | What is planted | How participants find it |
|------|----------------|--------------------------|
| 1 — Diff | `vipTier` typed as `string` instead of `'gold' \| 'platinum'` | Visible in the diff |
| 2 — PR description | PR says "platinum tier" but code routes any non-null `vipTier` — gold tier customers get fast-tracked too | Requires reading the PR description against the code |
| 3 — Linked issue | Issue says incident/security tickets must still escalate; code sends them to `vip-queue` regardless | Requires reading the linked issue |

This three-tier structure is essential. Tiers 1–2 are findable without the linked issue. Tier 3 is invisible without it. Without this structure, the value of GitHub MCP does not land.

### Pre-session checklist

- Run `scripts/setup-module-2.sh` against your own fork to verify it works end-to-end
- Confirm the PR is open, linked to the issue, and the three-tier bugs are present
- Your own `GITHUB_PERSONAL_ACCESS_TOKEN` is set for the live demo
- Participants have push access to their own GitHub accounts (no special permissions needed)

---

## Live demo recommendations

### At the start (~5 min)

Set the premise before anyone opens a laptop. Ask the group:

> "If you wanted Claude to review a PR properly — not just the diff, but the description, the linked issue, CI status — what would you have to do today?"

Let them answer: copy-paste it all in. Or write your own GitHub API integration.

Then say: "MCP servers are the alternative. Pre-built connectors — you configure credentials once, and Claude can call the tool directly. GitHub has one. You don't write it, you don't maintain it."

Open `.mcp.json` briefly: "This is the whole configuration. One JSON file, checked into the repo. The team gets it automatically."

Then show Claude reviewing the open PR in your fork live — with GitHub MCP active. Let the output speak for itself.

### Before Exercise 2 (~1 min)

Open `.claude/commands/review-pr.md` on screen. Show the skeleton structure. Point out the `[...]` placeholder text in Step 3.

**Say:** "These brackets are where your judgment goes. The structure is given to you. What to look for and how to report it — that is yours to write."

---

## Common participant mistakes

### Not setting the token before launching Claude Code
`GITHUB_PERSONAL_ACCESS_TOKEN` must be present when Claude Code starts. If participants set it after launching, they need to restart. This is the most common setup failure.

### Asking Claude to "review the PR" without specifying the repo
Claude cannot guess which repo to query. Participants must say "in `<their-username>/<their-repo>`" explicitly. Coach them to be specific.

### Not asking Claude to fetch the linked issue
Claude reviews the diff and PR description but skips the linked issue unless asked. The third planted issue requires the linked issue — if participants cannot find it, this is why. Ask them: "Did your prompt tell Claude to read the linked issue before reviewing the code?"

### Leaving the `[...]` placeholders in the command
Participants may run `/review-pr` with the skeleton untouched and get vague output. Tell them: "If Claude sounds like it is guessing, check whether you replaced the bracketed text."

### Trying to commit to the demo repo
Participants should never clone or commit to `ai-development-ws-ticket-demo`. Everything goes in the workshop repo. If someone gets confused: "You are reviewing that repo, not working in it."

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What did Claude include in the review that you didn't have to provide?"
- "What would have been involved in giving Claude the same context manually?"
- "What was in the linked issue that the diff didn't tell you?"

**What good looks like:**
- Participants can name at least one thing Claude surfaced from the linked issue
- They understand that `.mcp.json` is what enabled it — and that it works for any repo their token can access

**Teaching point:** The value is not just convenience. The integration is maintained by GitHub, not by you. They configured it personally in `~/.claude.json` here; Exercise 2 shows how committing `.mcp.json` to the repo gives the whole team the same capability automatically.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "What did you write in your Step 3 sections?"
- "What made the difference between vague output and specific output?"
- "What would 'team-ready' mean for this command?"

**What good looks like:**
- Participants replaced all four `[...]` placeholders with specific instructions
- At least one person iterated the command after a vague first output
- Discussion about what "team-ready" means: agreed prompt language, shared in a team repo, tested on real PRs

**Teaching point:** Reusable commands are the unit of shareable process. The difference between a personal scratch command and a team-ready one is specificity and shared understanding of what good output looks like.

---

## Connecting to the broader workshop arc

**"You now have two layers of Claude Code usage."**

- Layer 1 (Module 1): Claude Code reads your local files and helps you explore, refactor, test, and review your own work
- Layer 2 (Module 2): Claude Code connects to external systems via MCP and brings that context into your process

Module 3 adds the third layer: deploying the ticket processor as a real AWS Lambda, and using Claude to help with the infrastructure code and operational review.

---

## Simplifications if time is short

If you have only 40 minutes:

- **Skip Step 5 (reflect)** in Exercise 1. The token setup and first review are the non-negotiable steps.
- **Pre-fill the `[...]` placeholders** in `.claude/commands/review-pr.md` before the session and have participants just run the command in Exercise 2, skipping the writing step.

The non-negotiable steps are: configure GitHub MCP, verify it works, run a review with linked issue context, and discuss what makes a command team-ready.

---

## Optional extensions for advanced participants

- Modify `.mcp.json` to add a second MCP server (e.g. the filesystem server) and explore how multiple servers interact
- Write a `/summarise-sprint` command that fetches all PRs merged in the last two weeks and produces a release note draft
- Investigate what happens when the GitHub token has insufficient permissions — what error does Claude surface?
- Ask Claude to suggest a GitHub Actions workflow that would catch the three planted issues automatically — evaluate whether the output is realistic
