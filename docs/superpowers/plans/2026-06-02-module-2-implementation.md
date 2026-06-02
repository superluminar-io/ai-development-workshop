# Module 2 Workshop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all workshop materials for Module 2 — GitHub MCP configuration, a reusable command skeleton, three exercise files, participant guide, and facilitator guide (including demo repo setup instructions).

**Architecture:** Documentation and configuration only — no changes to the TypeScript ticket processor. Two repos are involved: the workshop repo (`ai-development-workshop`, where all files are committed) and the demo repo (`ai-development-ws-ticket-demo`, accessed read-only via GitHub MCP). Every participant-facing file must visually distinguish which repo each action targets.

**Tech Stack:** Markdown, JSON (`.mcp.json`), GitHub MCP (`@modelcontextprotocol/server-github` via npx), GitHub CLI (`gh`)

---

## File Map

```
# New files — workshop repo only
.mcp.json                                                  # GitHub MCP server config
.claude/commands/review-pr.md                              # skeleton — participants complete in Ex 3

docs/module-2/
  README.md                                                # module overview + repo orientation table
  participant-guide.md                                     # step-by-step with repo labels on every action
  facilitator-guide.md                                     # timing, live demo notes, demo repo setup instructions
  exercises/
    exercise-1-review-without-context.md
    exercise-2-github-mcp.md
    exercise-3-reusable-command.md
```

No changes to: `src/`, `test/`, `examples/`, `CLAUDE.md`, existing `.claude/commands/`

---

## Task 1: GitHub MCP Configuration

**Files:**
- Create: `.mcp.json`

- [ ] **Step 1: Create .mcp.json**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

- [ ] **Step 2: Verify it is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.mcp.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add .mcp.json
git commit -m "chore: add GitHub MCP server configuration

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: review-pr.md Command Skeleton

**Files:**
- Create: `.claude/commands/review-pr.md`

This is a skeleton — participants complete the numbered sections in Exercise 3. The structure and GitHub MCP invocation pattern are pre-filled; participants write the "what to check" content.

- [ ] **Step 1: Create .claude/commands/review-pr.md**

```markdown
You are reviewing a pull request. Use GitHub MCP to gather full context before reviewing.
Do not approve or merge anything. Produce a structured review only.

**Demo repo:** `superluminar-io/ai-development-ws-ticket-demo`

---

## Step 1: Gather context via GitHub MCP

Use GitHub MCP to fetch:
- The open PR: title, description, and all comments
- All issues linked in the PR description
- The list of commits in the PR

Read all of this before looking at any code.

## Step 2: State the intent

Based on the PR description and linked issue, write one sentence describing what this change is supposed to do. Quote directly from the PR description or issue.

## Step 3: Review the diff against the intent

For each of the following, be specific — quote file names, line numbers, and relevant text from the PR or issue:

1. **Intent match** — [does the implementation do what the PR description says?]
2. **Type safety** — [are new types as precise as they should be?]
3. **Test coverage** — [what new behaviour is untested?]
4. **Edge cases** — [what cases from the linked issue are not handled?]

## Step 4: Produce a structured review

- **Summary:** what the PR does (one sentence)
- **Issues found:** list each issue, labelled by what context was needed to find it (diff / PR description / linked issue)
- **Risk:** Low / Medium / High — and why
- **Recommendation:** Approve / Request changes / Needs discussion
```

Note: the bracketed `[...]` text in Step 3 is placeholder instruction text for participants — they replace it with their own prompt wording during Exercise 3.

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/review-pr.md
git commit -m "chore: add review-pr command skeleton for module-2 exercise 3

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Module 2 README

**Files:**
- Create: `docs/module-2/README.md`

- [ ] **Step 1: Create docs/module-2/README.md**

```markdown
# Module 2: From Prompts to Repeatable AI Workflows

**Duration:** ~60 minutes  
**Type:** Hands-on exercises  
**Prerequisite:** Module 1 complete

---

## What you will practise

- Reviewing a pull request using only a diff — and experiencing its limits
- Configuring GitHub MCP to give Claude access to PR descriptions, issues, and commit history
- Comparing reviews with and without external context
- Writing a reusable `/review-pr` command that encodes the full workflow

---

## Two repos, two roles

This module uses two repositories. Read this before starting.

| Repo | Your role | What you do here |
|------|-----------|-----------------|
| **Workshop repo** `ai-development-workshop` | Owner | Run commands, write files, configure MCP, commit your work |
| **Demo repo** `ai-development-ws-ticket-demo` | Reviewer | Review a PR on it via GitHub MCP — read-only access |

Every exercise step is labelled **[workshop repo]** or **[demo repo via MCP]** so you always know where you are.

> **Rule:** All files you create or modify — including `.mcp.json` and `.claude/commands/review-pr.md` — go in the **[workshop repo]**. The **[demo repo]** is read-only for participants. You never clone it, edit it, or commit to it.

---

## Exercises

1. [Exercise 1: Review Without Context](exercises/exercise-1-review-without-context.md)
2. [Exercise 2: GitHub MCP Setup and Re-review](exercises/exercise-2-github-mcp.md)
3. [Exercise 3: Build a Reusable Command](exercises/exercise-3-reusable-command.md)

Or follow the [Participant Guide](participant-guide.md) for the full step-by-step walkthrough.

---

## Prerequisites

- Module 1 complete — you know `/review-diff` and how slash commands work
- `gh` CLI installed and authenticated: `gh auth status`
- `npx` available (comes with Node 20+ from Module 1)
- Read access to `superluminar-io/ai-development-ws-ticket-demo` (ask the facilitator)
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/README.md
git commit -m "docs: add module-2 README with two-repo orientation table

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Exercise 1 — Review Without Context

**Files:**
- Create: `docs/module-2/exercises/exercise-1-review-without-context.md`

- [ ] **Step 1: Create the file**

```markdown
# Exercise 1: Review Without Context

**Goal:** Use the review workflow from Module 1 on a real PR — and discover what it cannot tell you.

**Duration:** ~15 minutes  
**Repo:** This entire exercise uses the **[demo repo via MCP]** as the target, but you run commands from the **[workshop repo]**.

---

## Before you start

**[workshop repo]** Confirm your baseline is clean:

```bash
npm test
```

Expected: 14 tests passing.

---

## Step 1 — Find the open PR (~2 min)

Ask the facilitator for the URL of the open PR on the demo repo:

`https://github.com/superluminar-io/ai-development-ws-ticket-demo/pull/<number>`

Open it in your browser. Read the PR title and description. Do not look at the code yet.

**Note:** You are looking at the **[demo repo]** in the browser. You will review it using Claude Code running in the **[workshop repo]**.

---

## Step 2 — Copy the diff into Claude (~3 min)

In your browser, open the PR's **Files changed** tab. This is the diff.

**[workshop repo]** In Claude Code, paste the diff and run:

```
/review-diff
```

If `/review-diff` asks for a git diff, tell Claude:
> "I am pasting a diff from a GitHub PR. Please review it as if you were a pull request reviewer."

Then paste the diff content.

> **Note:** `/review-diff` was built in Module 1. It runs `git diff HEAD` on the workshop repo — which won't see the demo repo's PR. For this exercise, paste the diff manually. In Exercise 2, GitHub MCP solves this.

---

## Step 3 — Note what Claude cannot answer (~5 min)

Read Claude's review. Then ask:

> "What questions do you still have that the diff alone could not answer?"

Write down Claude's unanswered questions. You should see gaps like:
- Why was this change made?
- Does the implementation match what was requested?
- Are there business rules being violated that are not visible in the code?

Keep this list — you will compare it to the Exercise 2 review.

---

## Step 4 — Try to answer the gaps yourself (~5 min)

Without any tools, try to answer Claude's unanswered questions using only:
- The PR title and description you read in Step 1
- The diff

Note which questions you can answer and which you cannot.

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A review of the sample PR produced by `/review-diff`
- [ ] A list of unanswered questions from Claude
- [ ] A note on which questions the PR description answered and which it did not

You have not changed any files. No commits yet.

---

## Reflection questions

- Which gaps surprised you? Which did you expect?
- If you were the PR author, what would you add to the PR description to help a reviewer?
- What would a reviewer need to see that neither the diff nor the description provided?
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/exercises/exercise-1-review-without-context.md
git commit -m "docs: add module-2 exercise 1 (review without context)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Exercise 2 — GitHub MCP Setup and Re-review

**Files:**
- Create: `docs/module-2/exercises/exercise-2-github-mcp.md`

- [ ] **Step 1: Create the file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/exercises/exercise-2-github-mcp.md
git commit -m "docs: add module-2 exercise 2 (GitHub MCP setup and re-review)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Exercise 3 — Reusable Command

**Files:**
- Create: `docs/module-2/exercises/exercise-3-reusable-command.md`

- [ ] **Step 1: Create the file**

```markdown
# Exercise 3: Build a Reusable Command

**Goal:** Complete the `/review-pr` command skeleton and encode the best review workflow you practised in Exercises 1 and 2.

**Duration:** ~18 minutes

**Repo guide for this exercise:**
- **[workshop repo]** — where you write and commit the command file
- **[demo repo via MCP]** — what Claude reads when you run `/review-pr`

---

## Step 1 — Read the skeleton (~3 min)

**[workshop repo]** Open `.claude/commands/review-pr.md` in your editor.

Read the structure:
- Step 1 tells Claude which repo to query and what to fetch via GitHub MCP
- Step 2 asks Claude to state the intent from the PR and issue
- Step 3 has four numbered sections with placeholder text in brackets `[...]`
- Step 4 defines the output format

Your job is to replace the bracketed `[...]` placeholders in Step 3 with real prompt instructions. Each section should tell Claude *specifically* what to look for — not just "check this", but what evidence to look for and how to report it.

---

## Step 2 — Complete the command (~8 min)

**[workshop repo]** Edit `.claude/commands/review-pr.md`.

Replace the four bracketed placeholders in Step 3 with your own instructions. Use what you learned in Exercises 1 and 2 as guidance. Here are prompts to help you write each one:

**Intent match:**
> What should Claude check to know if the code does what the PR description says? Should it quote the description and compare it to specific lines?

**Type safety:**
> What type patterns were visible in the diff? What should Claude look for specifically?

**Test coverage:**
> Should Claude list the new functions or branches that have no test? Should it propose test names?

**Edge cases:**
> How should Claude find edge cases from the linked issue? Should it quote the issue text?

Save the file. The command is now yours.

---

## Step 3 — Run your command on the sample PR (~4 min)

**[workshop repo]** In Claude Code, run:

```
/review-pr
```

When Claude asks which PR to review, provide:

> "PR #<number> in `superluminar-io/ai-development-ws-ticket-demo`"

Read the output. Check:
- Did Claude fetch the PR description and linked issue before reviewing the code?
- Did it use language from the issue in its review?
- Did the structured output format (summary, issues, risk, recommendation) appear?

If the output is vague or misses the planted issues, refine your Step 3 instructions and run again.

---

## Step 4 — Commit and reflect (~3 min)

**[workshop repo]** When you are satisfied with the command output:

```bash
git add .claude/commands/review-pr.md
git commit -m "feat: complete review-pr command with GitHub MCP workflow"
```

Then discuss with the group:
- What made the difference between a vague Claude output and a specific one?
- What would you change in this command before using it on your own team's repos?
- What would "team-ready" mean for this command — what would need to be true before you shared it with colleagues?

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] A completed `.claude/commands/review-pr.md` committed to the workshop repo
- [ ] A PR review produced by your command that found at least the first two planted issues
- [ ] A list of refinements you would make before using this command on your own repos

---

## Reflection questions

- The command skeleton gave you the structure — what did writing the prompts yourself teach you?
- How does a well-specified command compare to asking Claude the same thing conversationally?
- What other commands from your daily workflow could be encoded this way?
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/exercises/exercise-3-reusable-command.md
git commit -m "docs: add module-2 exercise 3 (reusable command)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Participant Guide

**Files:**
- Create: `docs/module-2/participant-guide.md`

- [ ] **Step 1: Create docs/module-2/participant-guide.md**

```markdown
# Module 2 Participant Guide

**From Prompts to Repeatable AI Workflows**

---

## Overview

In this module you will experience a concrete limitation of the Module 1 review workflow — then solve it with GitHub MCP. You will finish by encoding the improved workflow into a reusable command that you can take to your own projects.

By the end you will have:
- reviewed a real PR with and without external context
- configured GitHub MCP in a project
- understood why context changes what Claude can find
- written a command that encodes the full review workflow

---

## Two repos — read this first

This module involves two repositories. Every step below is labelled so you always know which one you are working in.

| Label | Repo | Your relationship |
|-------|------|-------------------|
| **[workshop repo]** | `ai-development-workshop` | Owner — you run commands, write files, commit here |
| **[demo repo via MCP]** | `ai-development-ws-ticket-demo` | Reviewer — Claude reads it via GitHub MCP, you do not clone it |

**You never clone, edit, or commit to the demo repo.** It is read-only for participants. Every file you create or modify — including the new `/review-pr` command — goes in the workshop repo. The demo repo is purely the thing you are reviewing.

> Think of it like a client's codebase: you review it, you don't commit to it. Your work product (the review, the command you wrote) lives in your own repo.

---

## Prerequisites

**[workshop repo]** Verify everything is in place:

```bash
npm test          # 14 tests passing
gh auth status    # authenticated to GitHub
echo $GITHUB_PERSONAL_ACCESS_TOKEN  # should be non-empty, or run:
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

Ask the facilitator for your read access to `superluminar-io/ai-development-ws-ticket-demo` before starting Exercise 2.

---

## Exercise 1 — Review Without Context (~15 min)

Full instructions: [exercises/exercise-1-review-without-context.md](exercises/exercise-1-review-without-context.md)

**Quick summary:**
1. **[demo repo via MCP]** Get the open PR URL from the facilitator. Read the title and description in your browser.
2. **[workshop repo]** Run `/review-diff` with the pasted diff — no GitHub MCP yet
3. Note what Claude cannot answer from the diff alone
4. Try to fill those gaps from the PR description — note what remains unanswered

**Checkpoint after Exercise 1:**
- [ ] I have a review produced by `/review-diff`
- [ ] I have a list of unanswered questions
- [ ] I understand what context the diff does not provide
- [ ] I have not changed any files

---

## Exercise 2 — GitHub MCP Setup and Re-review (~25 min)

Full instructions: [exercises/exercise-2-github-mcp.md](exercises/exercise-2-github-mcp.md)

**Quick summary:**
1. **[workshop repo]** Set `GITHUB_PERSONAL_ACCESS_TOKEN` and restart Claude Code
2. **[workshop repo]** Read `.mcp.json` — understand what it configures
3. **[workshop repo]** Verify GitHub MCP is active by asking Claude what it can see
4. **[demo repo via MCP]** Re-run the PR review with full GitHub context
5. Compare the two reviews — what did MCP reveal?

**Checkpoint after Exercise 2:**
- [ ] GitHub MCP is configured and verified working
- [ ] I have a second review using full GitHub context
- [ ] I can name something the linked issue revealed that the diff did not
- [ ] I understand why the third planted issue was invisible without MCP

---

## Exercise 3 — Build a Reusable Command (~18 min)

Full instructions: [exercises/exercise-3-reusable-command.md](exercises/exercise-3-reusable-command.md)

**Quick summary:**
1. **[workshop repo]** Open `.claude/commands/review-pr.md` — read the skeleton
2. **[workshop repo]** Complete the four prompt sections with your own instructions
3. **[workshop repo]** Run `/review-pr` on the demo PR — evaluate the output
4. **[workshop repo]** Commit your completed command

**Checkpoint after Exercise 3:**
- [ ] `.claude/commands/review-pr.md` is complete and committed
- [ ] `/review-pr` found at least the first two planted issues in the demo PR
- [ ] I have a list of refinements I would make before using this on my own team's repos

---

## Troubleshooting

**GitHub MCP is not activating**  
Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the terminal where you launch Claude Code: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`. If empty, run `export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)` then relaunch Claude Code.

**Claude cannot find the demo repo**  
Ask the facilitator to confirm your GitHub account has read access to `superluminar-io/ai-development-ws-ticket-demo`. The MCP token must belong to an account with access.

**`/review-pr` produces vague output**  
The command skeleton has placeholder instructions `[...]`. If you have not replaced them yet, do so in Step 2 of Exercise 3. Vague prompts produce vague output — be specific about what to look for.

**Claude does not fetch the linked issue**  
Add an explicit instruction to Step 1 of your command: "Fetch all GitHub issues linked in the PR description before reviewing any code." Claude will not fetch linked issues unless asked.

**The two reviews look the same**  
The key difference is issue 3 — the edge case from the linked issue. If the reviews look identical, check whether your Exercise 2 command explicitly asked Claude to read the linked issue. If not, ask again with: "Read all issues linked in the PR description and check whether each edge case mentioned is handled in the code."
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/participant-guide.md
git commit -m "docs: add module-2 participant guide

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Facilitator Guide

**Files:**
- Create: `docs/module-2/facilitator-guide.md`

- [ ] **Step 1: Create docs/module-2/facilitator-guide.md**

```markdown
# Module 2 Facilitator Guide

**From Prompts to Repeatable AI Workflows**

---

## Learning goals

By the end of this module participants should be able to:

1. Articulate what a code review cannot tell you from the diff alone
2. Configure GitHub MCP for a project using `.mcp.json`
3. Use GitHub MCP to give Claude access to PR descriptions, linked issues, and commit history
4. Compare the quality of reviews with and without external context
5. Complete a command skeleton and encode a specific workflow as a reusable slash command
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

The repo should contain a realistic TypeScript service different from the ticket processor. A good example: a **notification preferences service** — users can set channel preferences (email, SMS, push) and quiet hours. This is familiar enough (it's just CRUD-like logic) but clearly different from ticket routing.

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
- Include at least one edge case or constraint that is not obvious from the description
- Example issue body: "When `priorityOverride` is set to `urgent`, quiet hours should be ignored — urgent compliance notifications must go through regardless of user preferences. Also, `priorityOverride` should not be settable by regular users, only admins."

### 3. The three planted issues

Plant exactly these three issues in the PR's code changes:

| Tier | What to plant | How participants find it |
|------|--------------|--------------------------|
| 1 — Diff | `priorityOverride` typed as `string` instead of `'low' \| 'medium' \| 'urgent'` | Visible in the diff |
| 2 — PR description | The implementation allows `priorityOverride` to be set even when the priority is already `urgent` — the description says it "overrides the channel's default priority" implying it should only activate when not already urgent | Requires reading the PR description |
| 3 — Linked issue | `priorityOverride: 'urgent'` does not bypass quiet hours — the issue explicitly says it should | Requires reading the linked issue |

### 4. Participant access

Grant all participant GitHub accounts read access to the repo before the session.

### 5. Pre-session checklist

- [ ] Demo repo has commit history and open issues
- [ ] Sample PR is open (not merged or draft)
- [ ] PR has a clear description and links to the issue
- [ ] All three planted issues are present in the code
- [ ] All participant GitHub accounts have read access
- [ ] Your own `GITHUB_PERSONAL_ACCESS_TOKEN` is set for the live demo

---

## Live demo recommendations

### At the start (~5 min)

Show the contrast live. Run `/review-diff` with the PR diff pasted in — show what Claude produces. Then enable GitHub MCP and run the same review. Let the difference speak.

**Say:** "The diff shows you what changed. GitHub MCP shows you why it changed and what constraints the author was working with. Those are different things."

### Before Exercise 3 (~1 min)

Open `.claude/commands/review-pr.md` on screen. Show the skeleton structure. Point out the `[...]` placeholders.

**Say:** "These brackets are where your judgment goes. The structure is given to you. The prompting — what to look for and how to report it — is yours to write."

---

## Common participant mistakes

### Not setting the token before launching Claude Code  
The `GITHUB_PERSONAL_ACCESS_TOKEN` env variable must be present when Claude Code starts — not after. If participants set it after launching, they need to restart Claude Code.

### Asking Claude to "review the PR" without specifying the repo  
Claude cannot guess which repo to query. Participants must say "in `superluminar-io/ai-development-ws-ticket-demo`" explicitly. Coach them to be specific in their prompts.

### Leaving the `[...]` placeholders in the command  
Participants may run `/review-pr` with the skeleton untouched. The output will be vague. Tell them: "If Claude sounds like it's guessing, check whether you've replaced the bracketed text."

### Not asking Claude to fetch the linked issue  
This is the most common gap. Claude will review the diff and the PR description but skip the linked issue unless asked explicitly. The third planted issue requires the linked issue — if participants can't find it, this is why.

### Treating the two reviews as equivalent  
Push back gently: "Read issue 3 again. Is that in either review?" The contrast should be stark if the demo repo is set up correctly.

---

## Exercise 1 debrief (4 min)

**Ask the group:**
- "What questions did Claude leave unanswered?"
- "Could you answer any of them from the PR description alone? Which ones?"

**What good looks like:**
- Participants identified at least 2 unanswered questions
- They recognised that "why was this change made" is almost never answered by a diff

**Teaching point:** A diff is a fraction of the context a reviewer needs. The rest lives in GitHub.

---

## Exercise 2 debrief (4 min)

**Ask the group:**
- "What did the MCP-enabled review find that the diff-only review missed?"
- "Did any of Claude's Exercise 1 unanswered questions get answered? Which ones?"

**What good looks like:**
- Participants can name something specific that the linked issue revealed
- At least one person was surprised by what the issue contained

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
- Discussion about what "team-ready" means: agreed prompt language, specific repo names removed, shared in a team repo

**Teaching point:** Reusable commands are the unit of shareable workflow. The difference between a personal scratch command and a team-ready command is specificity, generality, and shared understanding of what "good output" looks like.

---

## Connecting to the broader workshop arc

**"You now have two layers of Claude Code usage."**

- Layer 1 (Module 1): Claude Code reads your local files and helps you explore, refactor, test, and review your own work
- Layer 2 (Module 2): Claude Code connects to external systems via MCP and brings that context into your workflow

Module 3 adds the third layer: deploying the ticket processor as a real AWS Lambda, and using Claude to help with the infrastructure code and operational review.

A future module will cover how to establish, store, and distribute these commands as team standards — so the workflow you practised today becomes a convention your whole team shares.

---

## Simplifications if time is short

If you have only 45 minutes:

- **Skip Exercise 1** entirely. Start with Exercise 2 (GitHub MCP setup). The contrast is less vivid but the core skill is preserved.
- **Pre-fill the `[...]` placeholders** in `.claude/commands/review-pr.md` before the session and have participants just run it in Exercise 3, skipping the writing step.

The non-negotiable steps are: configure GitHub MCP, verify it works, run a review with linked issue context, and discuss what makes a command team-ready.

---

## Optional extensions for advanced participants

- Modify `.mcp.json` to add a second MCP server (e.g. the filesystem server) and explore how multiple servers interact
- Write a `/summarise-sprint` command that fetches all PRs merged in the last two weeks and produces a release note draft
- Investigate what happens when the GitHub token has insufficient permissions — what error does Claude surface?
- Ask Claude to write a GitHub Actions workflow that runs the ticket processor tests — evaluate whether the output is correct without running it
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-2/facilitator-guide.md
git commit -m "docs: add module-2 facilitator guide with demo repo setup instructions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Final Verification

**Files:** none new

- [ ] **Step 1: Verify all files exist**

```bash
ls .mcp.json \
   .claude/commands/review-pr.md \
   docs/module-2/README.md \
   docs/module-2/participant-guide.md \
   docs/module-2/facilitator-guide.md \
   docs/module-2/exercises/exercise-1-review-without-context.md \
   docs/module-2/exercises/exercise-2-github-mcp.md \
   docs/module-2/exercises/exercise-3-reusable-command.md
```

Expected: all 8 files listed with no "No such file" errors.

- [ ] **Step 2: Verify .mcp.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.mcp.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Verify tests still pass (ticket processor untouched)**

```bash
npm test && npm run typecheck
```

Expected: 14 tests passing, 0 TypeScript errors.

- [ ] **Step 4: Verify git log shows clean commit history**

```bash
git log --oneline
```

Expected: 8 module-2 commits on top of the 7 module-1 commits (total ~15).

- [ ] **Step 5: Push to remote**

```bash
git push
```

---

## Self-Review Notes

### Spec coverage

| Spec requirement | Covered by |
|---|---|
| GitHub MCP config (`.mcp.json`) | Task 1 |
| `review-pr.md` command skeleton | Task 2 |
| Module README with two-repo table | Task 3 |
| Exercise 1: review without context | Task 4 |
| Exercise 2: configure MCP and re-review | Task 5 |
| Exercise 3: complete and run reusable command | Task 6 |
| Participant guide with repo labels on every step | Task 7 |
| Facilitator guide with demo repo setup instructions | Task 8 |
| Three-tier planted issues documented | Task 8 (facilitator guide) |
| Repo clarity requirement (two-repo labelling) | Tasks 3, 4, 5, 6, 7 |
| No changes to ticket processor source code | Confirmed — file map has no src/ changes |
| `GITHUB_PERSONAL_ACCESS_TOKEN` setup documented | Tasks 5, 7 |
| Troubleshooting for common MCP failures | Task 7 |
