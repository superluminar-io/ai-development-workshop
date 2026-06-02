# Module 1 Facilitator Guide

**Claude Code in the Engineering Loop**

---

## Learning goals

By the end of this module participants should be able to:

1. Use Claude Code to explore and understand an unfamiliar TypeScript codebase
2. Read and understand `CLAUDE.md` project instructions, and know why they matter
3. Write a basic custom slash command (prompt file in `.claude/commands/`)
4. Ask Claude for an implementation plan before making changes
5. Introduce stronger types and Zod validation in small, reviewable steps
6. Run tests and inspect `git diff` before accepting AI-generated changes
7. Use Claude to identify missing test coverage and surface a real bug
8. Use Claude to produce a PR-style review and summary

**The meta-skill:** knowing when to accept Claude's output, when to redirect it, and when to verify it yourself.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Intro and setup check | 5 min |
| Live demo: what Claude Code is | 5 min |
| Exercise 1 | 18 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 22 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 18 min |
| Debrief Exercise 3 + wrap-up | 7 min |
| **Total** | **~85 min** |

> If time is short, see **Simplifications** below.

---

## Before the session

1. Confirm Node.js 20+ is installed on participant machines.
2. Confirm Claude Code CLI is installed and authenticated (`claude --version`).
3. Run `npm install && npm test` in the repo to confirm it works on your machine.
4. Read `docs/module-1/KNOWN-IMPERFECTIONS.md` — know all 8 issues and their file locations.
5. Run `npm run process:example` and note the (buggy) output — `billing-queue` instead of `escalation-queue`.

---

## Live demo recommendations

### At the start (~5 min)

Demonstrate Claude Code in the terminal on your machine. Show:
- Running `/explain-codebase` — let participants see Claude read files and produce a structured explanation
- Opening `.claude/commands/explain-codebase.md` — show it is just a prompt file
- Opening `CLAUDE.md` — show it shapes Claude's behaviour

**Say:** "We are not using Claude as a chatbot. We are configuring it for this specific project and running it inside an engineering loop. The commands are prompts. The project instructions are constraints. You are always the reviewer."

### Before Exercise 2 (~2 min)

Run `/propose-change` live and show what a plan looks like before accepting it.  
Deliberately scope it down: "Only the types first."

### Before Exercise 3 (~1 min)

Run `npm run process:example` and ask: "Does this output look right to you?"  
Let participants think before explaining.

---

## Common participant mistakes

### Accepting Claude's output without reading it
Claude will sometimes propose correct changes in an overly broad diff. Participants who accept without reading `git diff` will not notice. Ask: "What does `git diff` show?"

### Skipping `/propose-change`
Participants will be tempted to describe the change and let Claude immediately edit files. Pause them: "Did you run `/propose-change` first? What did the plan say?"

### Running `npm test` before the change, not after
Participants will run tests to confirm the baseline, then forget to run them again after the change. Remind them: tests are a check on the change, not just a baseline.

### Treating Claude's review as authoritative
During Exercise 3, `/review-diff` will produce a review. Participants may treat it as a green light. Ask: "Do you agree with every finding? Is there anything it missed?"

### Writing a `find-weaknesses.md` command that is too vague
Participants often write "find all the problems" without specifying what to look at. This produces vague output. Coach them: specify which files to read and what categories of issues to report.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What did `/explain-codebase` get right? What did it get wrong or miss?"
- "Did anyone's `find-weaknesses` command produce output that surprised them?"
- "What would you add to `CLAUDE.md` to make it more useful for this project?"

**What good looks like:**
- Participants verified at least one Claude claim against the source
- They wrote a `find-weaknesses` command that references specific files and asks for specific categories of issues
- They noticed that `CLAUDE.md` constrains Claude — they did not just run commands blindly

**Teaching point:** Claude Code is useful for orientation, but its output is a model of the code. Verification is always the engineer's responsibility.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Did Claude propose anything you rejected? Why?"
- "When you ran `git diff`, did the changes match what you asked for?"
- "Did TypeScript catch anything after the union type change?"

**What good looks like:**
- At least 3 focused commits, not one large one
- Participants ran `npm test` after each meaningful change
- At least one person rejected or scoped down a Claude proposal
- The handler now throws instead of returning `undefined`

**Teaching point:** The git diff is the source of truth — not Claude's description of what it did.

---

## Exercise 3 debrief (7 min)

**Ask the group:**
- "All starter tests were passing. The bug was present. What does that tell us?"
- "When you wrote the failing test — did Claude point to the bug, or did the test failure do that?"
- "How much of `/review-diff` output would you act on immediately?"

**What good looks like:**
- Participants wrote the test *before* looking for the bug, and let the test failure guide them
- The fix was one word: `'high'` → `'escalate'`
- Participants edited or critiqued the PR summary from `/prepare-pr-summary` rather than accepting it wholesale

**Teaching point:** Tests are how you confirm Claude's output is actually correct. A passing test suite is not evidence of correctness — it is evidence that the written tests pass.

---

## Connecting to the broader workshop arc

Use the wrap-up to preview the next modules:

**"What you practised today is the foundation."**

- Module 1: Claude Code as a configured tool in a local engineering loop
- Module 2: Turning these workflows into repeatable, shareable patterns — custom commands as team conventions, MCP servers to connect Claude to your real systems (GitHub, Jira, CloudWatch)
- Module 3: Deploying the ticket processor as a real AWS Lambda — and using Claude to generate and review the infrastructure code

The consulting angle: the value is not in Claude generating code faster. It is in faster comprehension of unfamiliar systems, more explicit planning, safer changes, and better review discipline — especially in client engagements where you are new to the codebase.

---

## Simplifications if time is short

If you have only 45–50 minutes:

- **Skip Step 4 of Exercise 2** (separating parsing from domain logic). The Zod validation step is more important.
- **Shorten Exercise 1** by pre-filling `.claude/commands/find-weaknesses.md` and having participants just run it rather than write it.
- **Skip `/review-diff`** in Exercise 3 and go straight to `/prepare-pr-summary`.

The non-negotiable steps are: run `/explain-codebase`, write one custom command, run `/propose-change` before a change, inspect `git diff`, write the failing test, and fix the bug.

---

## Optional extensions for advanced participants

- Add a second Zod schema for the `TicketResult` output and validate it in a test
- Write a `/check-types` command that asks Claude to review the Ticket type specifically and suggest improvements with reasoning
- Extend `classifyPriority` to handle a new category (e.g., `'compliance'`) — ask Claude to propose the change, review the plan, then accept or modify it
- Add a `routeSecurityTicket` function that separates security routing from general routing — use TDD
- Write an additional command that Claude uses to summarise the current test coverage gaps at any point
