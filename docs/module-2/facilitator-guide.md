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

## Before the session — demo repo setup

You must complete this before participants arrive. The demo repo is `superluminar-io/ai-development-ws-ticket-demo`.

### 1. The service

The repo should contain a realistic TypeScript service different from the ticket processor. A good example: a **notification preferences service** — users can set channel preferences (email, SMS, push) and quiet hours. This is familiar enough (straightforward CRUD-like logic) but clearly different from ticket routing.

The repo needs:
- 3–5 commits of realistic history (not just one initial commit)
- 1–2 open GitHub issues with realistic titles and descriptions
- One open PR (not merged)

### 2. The sample PR

Create a branch (e.g. `feature/add-priority-override`) with a realistic change — for example, adding the ability for admin users to override the notification priority for a specific channel.

**PR description must:**
- State clearly what the change is supposed to do
- Be specific enough that a reviewer can check the implementation against it
- Example: "Adds `priorityOverride` field to `NotificationPreference`. When set, this overrides the channel's default priority. Used by admin tools to force urgent delivery for compliance notifications."

**Linked issue must:**
- Explain why the feature was requested
- Include at least one edge case or constraint that is not obvious from the PR description
- Example issue body: "When `priorityOverride` is set to `urgent`, quiet hours should be ignored — urgent compliance notifications must go through regardless of user preferences. Also, `priorityOverride` should not be settable by regular users, only admins."

### 3. The three planted issues

Plant exactly these three issues in the PR's code changes:

| Tier | What to plant | How participants find it |
|------|--------------|--------------------------|
| 1 — Diff | `priorityOverride` typed as `string` instead of `'low' \| 'medium' \| 'urgent'` | Visible in the diff |
| 2 — PR description | The implementation allows `priorityOverride` to be set even when the priority is already `urgent` — the description says it "overrides the channel's default priority" implying it should only activate when not already urgent | Requires reading the PR description |
| 3 — Linked issue | `priorityOverride: 'urgent'` does not bypass quiet hours — the issue explicitly says it should | Requires reading the linked issue |

This three-tier structure is essential. Issues 1–2 are findable without reading the linked issue. Issue 3 is invisible without it. Without this structure, the value of GitHub MCP does not land.

### 4. Participant access

Grant all participant GitHub accounts read access to `superluminar-io/ai-development-ws-ticket-demo` before the session.

### 5. Pre-session checklist

- [ ] Demo repo has commit history and at least one open issue
- [ ] Sample PR is open (not merged or draft)
- [ ] PR has a clear description and is linked to the GitHub issue
- [ ] All three planted issues are present in the code
- [ ] All participant GitHub accounts have read access to the demo repo
- [ ] Your own `GITHUB_PERSONAL_ACCESS_TOKEN` is set for the live demo

---

## Live demo recommendations

### At the start (~5 min)

Set the premise before anyone opens a laptop. Ask the group:

> "If you wanted Claude to review a PR properly — not just the diff, but the description, the linked issue, CI status — what would you have to do today?"

Let them answer: copy-paste it all in. Or write your own GitHub API integration.

Then say: "MCP servers are the alternative. Pre-built connectors — you configure credentials once, and Claude can call the tool directly. GitHub has one. You don't write it, you don't maintain it."

Open `.mcp.json` briefly: "This is the whole configuration. One JSON file, checked into the repo. The team gets it automatically."

Then show Claude reviewing the PR live — with GitHub MCP active. Let the output speak for itself.

### Before Exercise 2 (~1 min)

Open `.claude/commands/review-pr.md` on screen. Show the skeleton structure. Point out the `[...]` placeholder text in Step 3.

**Say:** "These brackets are where your judgment goes. The structure is given to you. What to look for and how to report it — that is yours to write."

---

## Common participant mistakes

### Not setting the token before launching Claude Code
`GITHUB_PERSONAL_ACCESS_TOKEN` must be present when Claude Code starts. If participants set it after launching, they need to restart. This is the most common setup failure.

### Asking Claude to "review the PR" without specifying the repo
Claude cannot guess which repo to query. Participants must say "in `superluminar-io/ai-development-ws-ticket-demo`" explicitly. Coach them to be specific.

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

**Teaching point:** The value is not just convenience. The integration is maintained by GitHub, not by you. Add `.mcp.json` to your own team's repo and everyone gets the same capability immediately.

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
