# Module 2 Workshop Design: From Prompts to Repeatable AI Workflows

**Date:** 2026-06-02  
**Status:** Approved  
**Duration:** ~60 minutes  
**Audience:** Client developers — competent TypeScript engineers learning to use Claude Code more effectively in their own daily workflow

---

## Overview

Module 2 teaches participants how to move from ad-hoc Claude Code usage (Module 1) toward a more powerful, context-aware workflow. The central tool is the GitHub MCP server, which gives Claude Code access to PR descriptions, linked issues, and commit history — context that is invisible when reviewing only a diff.

The module is structured as "problem first, tool second": participants hit the ceiling of what Claude can do without external context, then configure GitHub MCP and experience the contrast directly. They finish by encoding the best workflow into a reusable slash command.

**This module does not add Claude API calls to the ticket processor.** It is about improving the engineering workflow, not building AI-powered applications.

---

## Audience and Framing

Participants are client developers at their own companies. The workshop is delivered to them by the consulting company. All framing should speak to "your team, your codebase, your PRs" — not consulting scenarios.

The consulting company runs this session as a training deliverable. Participants take the workflow home and apply it to their own repos.

---

## Exercise Structure

### Exercise 1 — Review Without Context (~15 min)

**Goal:** Establish the baseline and surface the limitations of diff-only review.

Participants review a sample PR on the demo repo using `/review-diff` from Module 1. Claude can see the code changes but has no access to the PR description, the linked issue, or commit history.

Participants note what questions Claude cannot answer:
- Why was this change made?
- Does the implementation match what was requested?
- Is there a business rule being violated that isn't visible in the diff?

**Deliverable:** A list of unanswered questions from the diff-only review. No tool configuration yet.

**Teaching point:** A diff is a fraction of the context a reviewer needs. The rest lives in GitHub.

---

### Exercise 2 — Configure GitHub MCP and Re-review (~25 min)

**Goal:** Configure GitHub MCP, verify it works, and experience the contrast.

Steps:
1. Add a `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable (from `gh auth token`)
2. Observe that `.mcp.json` is already committed in the workshop repo — read it, understand what it configures, and see that MCP servers are just JSON config pointing at a command to run
3. Restart Claude Code — verify MCP is active by asking Claude what it can see about the demo repo
4. Re-run the PR review with GitHub MCP active
5. Compare the two reviews — what did MCP reveal that the diff alone could not?

Issue 3 (the business rule conflict) should only surface now — it requires reading the linked GitHub issue to understand the intent.

**Deliverable:** A second review note showing what GitHub MCP added. A written comparison of the two reviews.

**Teaching point:** MCP gives Claude the context that exists in your real engineering system. The workflow becomes qualitatively different, not just incrementally better.

---

### Exercise 3 — Build a Reusable Command (~18 min)

**Goal:** Encode the best review workflow into a reusable slash command.

Participants complete `.claude/commands/review-pr.md` — a pre-committed skeleton. The command should:
- Ask Claude to fetch the PR description and linked issue via GitHub MCP
- Ask Claude to check whether the implementation matches the stated intent
- Ask Claude to review the diff against the issue context
- Ask Claude to produce a structured review: correctness, missing tests, risk, follow-up

Participants run the completed command on the sample PR and evaluate the output.

Discussion: what makes a command "team-ready" vs personal scratch work? (Specificity, file references, explicit assumptions, no vague instructions.)

**Deliverable:** A completed `.claude/commands/review-pr.md` committed to the workshop repo.

**Teaching point:** Reusable commands are the unit of shareable workflow. A well-written command is a team convention.

---

## GitHub MCP Configuration

**File:** `.mcp.json` at the workshop repo root (pre-committed)

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

**Participant prerequisites:**
- `gh` CLI installed and authenticated (`gh auth status`)
- `npx` available (Node 20+, already required from Module 1)
- Read access to `superluminar-io/ai-development-ws-ticket-demo`

**Token setup (documented in participant guide):**
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

No extra installs — the MCP server runs via `npx` on demand.

---

## Demo Repo

**Repo:** `superluminar-io/ai-development-ws-ticket-demo`  
**Created by:** The workshop facilitator before the session  
**Contents:** A realistic TypeScript service (different domain from the ticket processor), with commit history, open GitHub issues, and one open sample PR

### Sample PR Requirements

The facilitator must set up the sample PR before each session. Requirements:

**PR description:** States clear intent — what the change is supposed to do and why. Should be specific enough that a reviewer can check the implementation against it.

**Linked GitHub issue:** Explains the business context — why the feature was requested, what problem it solves, and any constraints or edge cases mentioned by the requester. At least one edge case from the issue must NOT be handled in the implementation.

**Three planted issues (one per tier):**

| Tier | Findable with | Issue |
|------|--------------|-------|
| 1 | Diff alone | A new field typed as `string` instead of an appropriate union type |
| 2 | PR description | The implementation behaviour does not match what the PR description says it does |
| 3 | Linked issue | An edge case mentioned in the issue is not handled — visible only if you read the issue |

This three-tier structure is essential to the teaching arc. Issues 1–2 can be found without MCP; issue 3 cannot. Without this structure, the MCP contrast in Exercise 2 does not land.

**Facilitator checklist before each session:**
- [ ] Sample PR is open (not merged or closed)
- [ ] PR description is written and clear
- [ ] PR is linked to a GitHub issue with edge case detail
- [ ] All three planted issues are present in the code
- [ ] Participants have been granted read access to the repo

---

## New Files Added to Workshop Repo

```
.mcp.json                                         # GitHub MCP server config
.claude/commands/review-pr.md                     # skeleton — participants complete in Ex 3

docs/module-2/
  README.md                                       # module overview
  participant-guide.md                            # step-by-step with checkpoints
  facilitator-guide.md                            # timing, demo notes, sample PR setup
  exercises/
    exercise-1-review-without-context.md
    exercise-2-github-mcp.md
    exercise-3-reusable-command.md
```

**No changes to existing source code.** The ticket processor (`src/`, `test/`, `examples/`) is untouched.

---

## Connections to Other Modules

**From Module 1:** Participants already know `/review-diff`. Exercise 1 reuses it deliberately, establishing continuity and making the MCP contrast more vivid.

**To Module 3:** GitHub MCP for PR review is not the only MCP pattern. Module 3 (AWS serverless deployment) is a natural place to introduce AWS-specific MCP servers (CloudWatch, SSM) for operational context — without requiring that setup in Module 2.

**Future module (team standards):** The `/review-pr` command participants write in Exercise 3 is a preview of the team standards module — where commands become shared conventions, stored in a central repo, and distributed across teams.

---

## Repo Clarity Requirement

Participants work across two repos in Module 2. Every exercise file, the participant guide, and the facilitator guide must make it unambiguous which repo each action targets. Use a consistent visual convention:

- **Workshop repo** (`ai-development-workshop`) — where participants run commands, write files, configure MCP, and commit their work
- **Demo repo** (`ai-development-ws-ticket-demo`) — the repo they are *reviewing*, accessed read-only via GitHub MCP

Each exercise step that involves a terminal command or a file action must be prefixed with a clear label:

> **In the workshop repo:** `git add .claude/commands/review-pr.md`  
> **Via GitHub MCP (demo repo):** ask Claude to fetch the open PR

The participant guide introduction must explain both repos upfront, before any exercises begin, with a diagram or table showing which repo is which and what participants do in each.

---

## Assumptions

- Participants have a GitHub account and `gh` CLI authenticated
- The demo repo is set up by the facilitator before each session
- The sample PR is open and has a linked issue at session start
- Participants have read access to `superluminar-io/ai-development-ws-ticket-demo`
- `npx` works without network issues in the workshop environment
- Module 1 is a prerequisite — participants already know `CLAUDE.md`, slash commands, and the Module 1 review workflow

---

## Out of Scope for Module 2

- Claude API calls in the ticket processor application code
- AWS MCP servers or CloudWatch integration (future module)
- Team standards distribution and versioning (future module)
- Writing or modifying the demo repo content (facilitator responsibility)
- GitHub Actions, CI/CD, or automated review workflows
