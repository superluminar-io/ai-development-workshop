# Module 2 Facilitator Guide

**Code Review, Context, and Commands**

---

## Learning goals

By the end of this module participants should be able to:

1. Articulate what a code review cannot tell you from the diff alone
2. Configure GitHub MCP for a project using `.mcp.json`
3. Use GitHub MCP to give Claude access to PR descriptions, linked issues, and commit history
4. Compare the quality of reviews with and without external context
5. Complete a command skeleton and encode a specific process as a reusable slash command
6. Explain what makes a command "team-ready" vs personal

**The meta-skill:** understanding that Claude's output quality is bounded by the context it has access to — and that MCP is a way to expand that context systematically.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Module 1 + intro | 5 min |
| Live demo: GitHub MCP in action | 5 min |
| Exercise 1 | 15 min |
| Debrief Exercise 1 | 4 min |
| Exercise 2 | 25 min |
| Debrief Exercise 2 | 4 min |
| Exercise 3 | 18 min |
| Debrief Exercise 3 + wrap-up | 4 min |
| **Total** | **~80 min** |

> If time is short, see **Simplifications** below.

---

## Before the session — demo repo setup

You must complete this before participants arrive. The demo repo is `superluminar-io/ai-development-ws-ticket-demo`.

### 1. The service

The repo should contain a realistic TypeScript service different from the ticket processor. A good example: a **notification preferences service** — users can set channel preferences (email, SMS, push) and quiet hours. This is familiar enough (it is straightforward CRUD-like logic) but clearly different from ticket routing.

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

This three-tier structure is essential. Issues 1–2 are findable without MCP. Issue 3 is invisible without reading the linked issue via GitHub MCP. Without this structure, the contrast in Exercise 2 does not land.

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

Show the contrast live. Run `/review-diff` with the PR diff pasted into Claude — show what the output looks like. Then set your token, restart, enable GitHub MCP and run the same review. Let the difference speak.

**Say:** "The diff shows you what changed. GitHub MCP shows you why it changed and what constraints the author was working with. Those are different things."

Open `.mcp.json` briefly and say: "This is the whole configuration. One JSON file, checked into the repo. Everyone on the team gets the same MCP setup automatically."

### Before Exercise 3 (~1 min)

Open `.claude/commands/review-pr.md` on screen. Show the skeleton structure. Point out the `[...]` placeholder text in Step 3.

**Say:** "These brackets are where your judgment goes. The structure is given to you. What to look for and how to report it — that is yours to write."

---

## Common participant mistakes

### Not setting the token before launching Claude Code
The `GITHUB_PERSONAL_ACCESS_TOKEN` env variable must be present when Claude Code starts. If participants set it after launching, they need to restart Claude Code. This is the most common setup failure.

### Asking Claude to "review the PR" without specifying the repo
Claude cannot guess which repo to query. Participants must say "in `superluminar-io/ai-development-ws-ticket-demo`" explicitly. Coach them to be specific in their prompts.

### Leaving the `[...]` placeholders in the command
Participants may run `/review-pr` with the skeleton untouched and get vague output. Tell them: "If Claude sounds like it is guessing, check whether you have replaced the bracketed text in the command file."

### Not asking Claude to fetch the linked issue
This is the most common gap. Claude reviews the diff and PR description but skips the linked issue unless asked explicitly. The third planted issue requires the linked issue — if participants cannot find it, this is why. Ask them: "Did your command tell Claude to read the linked issue before reviewing the code?"

### Trying to commit to the demo repo
Participants should never clone or commit to `ai-development-ws-ticket-demo`. Everything goes in the workshop repo. If someone gets confused, remind them: "You are reviewing that repo, not working in it. Your command file goes here, in the workshop repo."

### Treating the two reviews as equivalent
Push back gently: "Read the third planted issue again — is that handled in either review?" The contrast should be stark if the demo repo is set up correctly.

---

## Exercise 1 debrief (4 min)

**Ask the group:**
- "What questions did Claude leave unanswered?"
- "Could you answer any of them from the PR description alone? Which ones?"

**What good looks like:**
- Participants identified at least 2 unanswered questions
- They recognised that "why was this change made" is almost never in the diff

**Teaching point:** A diff is a fraction of the context a reviewer needs. The rest lives in GitHub.

---

## Exercise 2 debrief (4 min)

**Ask the group:**
- "What did the MCP-enabled review find that the diff-only review missed?"
- "Did any of Claude's Exercise 1 unanswered questions get answered? Which ones?"
- "What was in the linked issue that changed how you read the code?"

**What good looks like:**
- Participants can name something specific that the linked issue revealed
- At least one person was surprised by what the issue contained
- The third planted issue (quiet hours bypass) was invisible without the linked issue

**Teaching point:** MCP gives Claude the context that exists in your real engineering system. The quality difference is not incremental — it is qualitative.

---

## Exercise 3 debrief (4 min)

**Ask the group:**
- "What did you write in your Step 3 sections? Did anyone take a different approach?"
- "What would you change before using this command on your own team's repos?"
- "What does 'team-ready' mean to you now?"

**What good looks like:**
- Participants replaced all four `[...]` placeholders with specific instructions
- At least one person iterated the command after a vague first output
- Discussion about what "team-ready" means: agreed prompt language, specific repo name replaced with a variable or prompt, shared in a team repo

**Teaching point:** Reusable commands are the unit of shareable process. The difference between a personal scratch command and a team-ready one is specificity and shared understanding of what good output looks like.

---

## Connecting to the broader workshop arc

**"You now have two layers of Claude Code usage."**

- Layer 1 (Module 1): Claude Code reads your local files and helps you explore, refactor, test, and review your own work
- Layer 2 (Module 2): Claude Code connects to external systems via MCP and brings that context into your process

Module 3 adds the third layer: deploying the ticket processor as a real AWS Lambda, and using Claude to help with the infrastructure code and operational review.

A future module will cover how to establish, store, and distribute these commands as team standards — so the process you practised today becomes a convention your whole team shares automatically.

---

## Simplifications if time is short

If you have only 45 minutes:

- **Skip Exercise 1** entirely. Start with Exercise 2 (GitHub MCP setup). The contrast is less vivid but the core skill is preserved.
- **Pre-fill the `[...]` placeholders** in `.claude/commands/review-pr.md` before the session and have participants just run it in Exercise 3, skipping the writing step.

The non-negotiable steps are: configure GitHub MCP, verify it works, run a review with linked issue context, and discuss what makes a command team-ready.

---

## Optional extensions for advanced participants

- Modify `.mcp.json` to add a second MCP server (e.g. the filesystem server) and explore how multiple servers interact
- Write a `/summarise-sprint` command that fetches all PRs merged in the last two weeks from the demo repo and produces a release note draft
- Investigate what happens when the GitHub token has insufficient permissions — what error does Claude surface?
- Ask Claude to suggest a GitHub Actions workflow that would catch the three planted issues automatically — evaluate whether the output is realistic
