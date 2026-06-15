# Module 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create Module 4 — "The AI Harness: Claude Code for Teams and Organisations" — covering team-level CLAUDE.md governance, permissions, hooks, and a distributable org template, delivered through a rapid-promotion scenario with deadpan HR memos.

**Architecture:** Pure documentation and configuration — no source code changes. Seven tasks create the module files, update the frontend config, and add a facilitator guide link to the root README. All files follow the established pattern of existing modules (README, participant-guide, facilitator-guide, three exercise files).

**Tech Stack:** Markdown, JSON (settings.json examples), docs-site config.ts (TypeScript), git

---

## File Map

```
docs/module-4/                              ← new
  README.md
  participant-guide.md
  facilitator-guide.md
  exercises/
    exercise-1-team-harness.md
    exercise-2-hooks.md
    exercise-3-org-template.md
docs-site/src/config.ts                    ← modified (add module-4 entry)
README.md                                  ← modified (add facilitator guide link)
```

---

## Task 1: Module directory and README

**Files:**
- Create: `docs/module-4/README.md`
- Create: `docs/module-4/exercises/` (directory)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p docs/module-4/exercises
```

- [ ] **Step 2: Create README.md**

`docs/module-4/README.md`:
```markdown
# Module 4: The AI Harness — Claude Code for Teams and Organisations

**Duration:** ~60 minutes
**Type:** Hands-on exercises
**Prerequisite:** Modules 1, 2, and 3 complete

---

## What you will practise

- Extending a project CLAUDE.md with team-level governance rules that apply to every engineer in the repo
- Configuring permissions — hard limits Claude cannot override — using `.claude/settings.json`
- Writing a `PostToolUse` hook that enforces standards automatically after every Claude edit
- Extracting the harness into a reusable org template another team could adopt on day one

---

## Exercises

1. [Exercise 1: Team Lead — Establish the Team Harness](exercises/exercise-1-team-harness.md)
2. [Exercise 2: Team Lead — Automate the Enforcement](exercises/exercise-2-hooks.md)
3. [Exercise 3: Head of AI Engineering Practices — Build the Org Template](exercises/exercise-3-org-template.md)

Or follow the [Participant Guide](participant-guide.md) for the full walkthrough.

---

## Prerequisites

- Modules 1, 2, and 3 complete
- The workshop repo open with Claude Code running
- Node.js 20+ installed (for `npm test` hook verification)
```

- [ ] **Step 3: Commit**

```bash
git add docs/module-4/
git commit -m "feat: add module 4 directory and README"
```

---

## Task 2: Participant Guide

**Files:**
- Create: `docs/module-4/participant-guide.md`

- [ ] **Step 1: Create participant-guide.md**

`docs/module-4/participant-guide.md`:
```markdown
# Module 4 Participant Guide

**The AI Harness — Claude Code for Teams and Organisations**

> Modules 1, 2, and 3 must be complete before starting here.

---

## The scenario

Until now everything you have configured — your CLAUDE.md, your commands, your skills, your plugin — affected only you. That was fine when you were working as an individual contributor learning the ropes.

It is not fine when six engineers are working in the same repo and Claude Code behaves differently on each machine. One person's Claude commits directly. Another's always proposes a plan. A third has no constraints at all and last week accepted a refactoring that silently removed the error handling.

Today you have been promoted. Twice, actually. Possibly three times before lunch. The details are in the memos.

---

## What is the AI harness?

The harness is the full configuration layer that controls how Claude Code behaves in a project — for everyone, not just you. It has three components:

**CLAUDE.md** — instructions Claude reads at the start of every session. It can be layered: a project-level file sets team standards, sub-directory files can tighten or adjust for specific contexts. Claude reads and reasons about these instructions, but they are guidance, not enforcement.

**Permissions** — an allow/deny list in `.claude/settings.json` that defines hard limits on what Claude can do. Unlike CLAUDE.md, these cannot be overridden by a clever prompt or a confused model. Claude simply cannot run a denied command.

**Hooks** — shell commands that Claude Code runs automatically at specific moments: after Claude edits a file, after Claude runs a bash command, before a session ends. Hooks do not ask Claude to do something. They run regardless of what Claude decided.

Together these three form a harness: not a cage, but a set of rails that keep Claude useful and safe for an entire team.

---

## Troubleshooting

**My CLAUDE.md changes don't seem to affect Claude's behaviour**
Start a fresh Claude Code session after editing CLAUDE.md — changes take effect at session start, not mid-session.

**Permissions aren't blocking the command I denied**
Check that your `settings.json` is in the `.claude/` directory at the repo root (not in a subdirectory), and that the JSON is valid. Run `cat .claude/settings.json | python3 -m json.tool` to validate.

**The hook isn't firing**
Verify the hook is in `.claude/settings.json` (not `settings.local.json`). The event name must be exactly `PostToolUse` (case-sensitive). Restart Claude Code after editing settings.

**`npm test` is too slow for a hook**
That is a valid concern — and worth raising in the debrief. For the purposes of this exercise, it demonstrates the mechanism. In production you might hook a faster check (linter only) and run full tests in CI.
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-4/participant-guide.md
git commit -m "feat: add module 4 participant guide"
```

---

## Task 3: Exercise 1 — Team Harness

**Files:**
- Create: `docs/module-4/exercises/exercise-1-team-harness.md`

- [ ] **Step 1: Create exercise-1-team-harness.md**

`docs/module-4/exercises/exercise-1-team-harness.md`:
```markdown
# Exercise 1: Team Lead — Establish the Team Harness

---

> **MEMO**
> To: You
> From: People Operations
> Re: Role Change — Effective Immediately
>
> Congratulations on your promotion to Team Lead. Your team consists of six engineers. It has come to our attention that all six are using Claude Code differently. One accepted a refactoring last week that removed all the error handling. Please establish standards. Forms are attached.
>
> *No forms are attached.*

---

**Goal:** Extend the project CLAUDE.md with team-level governance rules, then add a permissions configuration that enforces hard limits no prompt can override.

**Duration:** ~25 minutes
**Prerequisites:** Module 1 complete (you have already worked with CLAUDE.md)

---

## Part 1 — Team-facing CLAUDE.md standards (~12 min)

Open `CLAUDE.md` at the repo root. You wrote parts of this in Module 1 to document the codebase structure and your personal review practices. Team governance is different: it defines what Claude must and must not do for *any* engineer working in this repo, regardless of what they ask.

Add a new section at the bottom of `CLAUDE.md`:

```markdown
## Team standards

These rules apply to every engineer working in this repo. They are not suggestions.

### Scope
- Do not refactor code unrelated to the current task. If you notice something worth improving outside the current scope, mention it but do not change it.
- Do not modify files in `.github/`, `Dockerfile`, or any CI/CD configuration without explicit instruction.

### Before making changes
- List every file you intend to modify and explain why before touching anything.
- If the change affects more than three files, stop and ask for confirmation.

### After making changes
- Summarise what changed, which tests were run, and what risks remain.
- Never report a change as complete before tests have passed.
```

Save the file. Open a fresh Claude Code session and ask Claude:

> "What files would you touch if I asked you to add a new ticket category?"

Read the response. Claude should list files and ask for confirmation before proceeding — because the standard now says so. If it does not, check that you saved CLAUDE.md and started a new session.

<details>
<summary>Hint: Claude isn't following the new rules</summary>

CLAUDE.md is read at the start of each session. If Claude Code was already running when you edited the file, it will not pick up the changes. Run `/clear` to reset the session context, or quit and reopen Claude Code.

</details>

---

## Part 2 — Permissions (~13 min)

CLAUDE.md is guidance Claude reads and reasons about. An engineer who asks Claude to "just push it quickly" might talk their way around a CLAUDE.md rule. Permissions cannot be talked around.

Create `.claude/settings.json` if it does not exist, and add a permissions block:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Bash(npx * --yes)"
    ]
  }
}
```

Save the file and restart Claude Code. Then ask Claude:

> "Run `git push --force` to push the current branch."

Expected: Claude refuses. It does not ask you to confirm. It cannot run the command — the permission is denied at the system level.

Then ask:

> "Run `npm test`."

Expected: Claude runs it. The allow list is explicit about what is permitted.

<details>
<summary>Hint: What does the allow list actually do?</summary>

By default, when there is no permissions configuration, Claude Code asks the user to approve each tool use that isn't already in a global allow list. When you add an explicit `allow` list, it pre-approves those patterns so Claude can run them without prompting. The `deny` list blocks patterns unconditionally.

If you want Claude to continue prompting for approval on unlisted commands (rather than being blocked), you can use a `deny` list without an `allow` list — Claude will still prompt for anything not denied.

</details>

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A team governance section added to `CLAUDE.md`
- [ ] `.claude/settings.json` with an allow list and deny list committed to the repo
- [ ] Observed Claude refusing a denied command and accepting an allowed one

Commit your changes before moving on:

```bash
git add CLAUDE.md .claude/settings.json
git commit -m "feat: add team harness — governance rules and permissions"
```

---

## Reflection questions

- What is the difference between a rule in CLAUDE.md and a rule in the permissions deny list?
- Which of your team's current engineering standards would benefit from being in CLAUDE.md? Which need the harder enforcement of permissions?
- Who in your organisation should have authority to modify the harness? How would you communicate a change to the team?
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-4/exercises/exercise-1-team-harness.md
git commit -m "feat: add module 4 exercise 1 — team harness"
```

---

## Task 4: Exercise 2 — Hooks

**Files:**
- Create: `docs/module-4/exercises/exercise-2-hooks.md`

- [ ] **Step 1: Create exercise-2-hooks.md**

`docs/module-4/exercises/exercise-2-hooks.md`:
```markdown
# Exercise 2: Team Lead — Automate the Enforcement

---

> **MEMO**
> To: You
> From: Engineering
> Re: The Linter Incident
>
> Yesterday a Claude Code session produced 47 linting errors in a single commit. The engineer did not notice. The reviewer did not notice until CI failed. We now have 12 engineers. Standards written in documents are read once.
>
> Please make the machine enforce them.

---

**Goal:** Write a `PostToolUse` hook that runs tests automatically after every Claude edit, so violations are caught in the session, not in CI.

**Duration:** ~20 minutes
**Prerequisites:** Exercise 1 complete — `.claude/settings.json` exists

---

## What is a hook?

A hook is a shell command that Claude Code runs automatically at specific moments in a session — after Claude edits a file, after Claude runs a bash command, before a session ends. Hooks do not ask Claude to do something. They run regardless of what Claude decided.

They are the difference between:

- *"Claude is instructed not to break the tests"* — a CLAUDE.md rule Claude reads and tries to follow
- *"The tests run every time Claude touches a file, so it is physically impossible to leave the session with failing tests"* — a hook

CLAUDE.md rules depend on Claude reading them, understanding them, and choosing to comply. Hooks depend on nothing. They are shell commands. The shell does not care what Claude wanted.

**When to use a hook instead of CLAUDE.md:**

Use CLAUDE.md for standards that require judgment — things Claude needs to reason about. Use a hook for standards that are binary: either the linter passes or it does not. Either tests pass or they do not. Anything that has a deterministic pass/fail outcome and must never be skipped belongs in a hook.

**Hook events available:**

| Event | When it fires |
|---|---|
| `PreToolUse` | Before Claude uses any tool |
| `PostToolUse` | After Claude uses a tool |
| `Stop` | When Claude finishes a response |

---

## Step 1 — Add a PostToolUse hook (~12 min)

Open `.claude/settings.json`. Add a `hooks` section alongside the existing `permissions`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Bash(npx * --yes)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

What this does:
- **Event:** `PostToolUse` — fires after Claude uses a tool
- **Matcher:** `Write|Edit|MultiEdit` — matches when Claude writes or edits a file
- **Command:** `npm test 2>&1 | tail -20` — runs the test suite and shows the last 20 lines

The `2>&1 | tail -20` keeps the output readable. Without it, the full test output appears in the session after every edit.

Save the file and restart Claude Code.

---

## Step 2 — Trigger the hook (~8 min)

Ask Claude to make a small change to the service — something that will not break tests:

> "Add a comment to the top of `src/domain/classifier.ts` describing what the function does."

Watch the session. After Claude writes the file, the test output should appear automatically — you did not ask for it, Claude did not decide to run it. The hook ran.

Expected output at the bottom of Claude's response:
```
Test Files  2 passed (2)
Tests  14 passed (14)
```

Now ask Claude to make a change that *would* break tests — but stop Claude before it commits:

> "Change the `'escalate'` priority string in `src/domain/classifier.ts` to `'escalated'`. Do not touch any other file."

The hook fires again. This time tests fail. Claude sees the failure in its own output and should offer to fix it.

<details>
<summary>Hint: The hook isn't appearing in the session</summary>

Check that:
1. The `settings.json` is at `.claude/settings.json` (not `~/.claude/settings.json` or elsewhere)
2. The JSON is valid — malformed JSON silently disables the hooks block
3. You restarted Claude Code after saving the file — hooks are loaded at session start

Validate the JSON with: `cat .claude/settings.json | python3 -m json.tool`

</details>

<details>
<summary>Hint: The hook fires but tests take too long</summary>

In a real project, running the full test suite on every file write may be too slow. Common alternatives:
- Run only the linter in the hook (`npm run lint 2>&1 | tail -5`)
- Run a fast subset of tests (`npm test -- --reporter=dot 2>&1 | tail -5`)
- Reserve full test runs for `Stop` hooks (fires when Claude finishes a full response, not each individual file write)

For this exercise, `npm test` is fast enough to demonstrate the mechanism.

</details>

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] A `PostToolUse` hook in `.claude/settings.json` that runs `npm test` after file edits
- [ ] Observed the hook firing automatically after a Claude edit
- [ ] Observed the hook catching a test failure without being asked

Commit your changes:

```bash
git add .claude/settings.json
git commit -m "feat: add PostToolUse hook to enforce tests after every edit"
```

---

## Reflection questions

- A rule in CLAUDE.md says "run tests after every change." A hook does the same thing. What is the practical difference?
- Which standards in your current codebase should be hooks rather than guidelines?
- What is the risk of making the hook too aggressive — firing on every tool use, running the full test suite each time?
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-4/exercises/exercise-2-hooks.md
git commit -m "feat: add module 4 exercise 2 — hooks"
```

---

## Task 5: Exercise 3 — Org Template

**Files:**
- Create: `docs/module-4/exercises/exercise-3-org-template.md`

- [ ] **Step 1: Create exercise-3-org-template.md**

`docs/module-4/exercises/exercise-3-org-template.md`:
```markdown
# Exercise 3: Head of AI Engineering Practices — Build the Org Template

---

> **MEMO**
> To: You
> From: The Board
> Re: New Role — Head of AI Engineering Practices
>
> Your work as Team Lead has been noted at the highest levels. You have been promoted. Your scope is now the entire organisation. Every new project we start must have your standards from day one.
>
> You have until end of day. The Board looks forward to your presentation.
>
> *There is no presentation.*

---

**Goal:** Extract the harness you built in Exercises 1 and 2 into a reusable template directory any team could copy into a new repo.

**Duration:** ~15 minutes
**Prerequisites:** Exercises 1 and 2 complete

---

## The problem with bespoke harnesses

You have now built a harness for this repo. It works. But when a new project starts next month, the team will begin from scratch — no governance rules, no permissions, no hooks — unless someone remembers to set them up and knows how.

The solution is a template: a directory containing a starter harness that encodes the decisions you made here, with comments that explain the reasoning. A team can copy it, read the README, adapt what doesn't fit their context, and start with good defaults rather than no defaults.

---

## Step 1 — Create the template directory (~5 min)

Create a `claude-harness/` directory at the repo root:

```bash
mkdir claude-harness
```

Create three files inside it:

**`claude-harness/CLAUDE.md`** — the team standards template:

```markdown
# [Project Name] — Claude Code Standards

These rules apply to every engineer working in this repo.

## Scope
- Do not refactor code unrelated to the current task.
- Do not modify CI/CD configuration, Dockerfiles, or infrastructure files without explicit instruction.

## Before making changes
- List every file you intend to modify and explain why before touching anything.
- If the change affects more than three files, stop and ask for confirmation.

## After making changes
- Summarise what changed, which tests were run, and what risks remain.
- Never report a change as complete before tests have passed.

## Code structure
<!-- Add your project's file structure and responsibilities here -->

## Test commands
<!-- Add your project's test commands here -->
```

**`claude-harness/settings.json`** — the base permissions and hooks:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Bash(npx * --yes)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

**`claude-harness/README.md`** — the adoption guide:

```markdown
# Claude Code Harness Template

A starter harness for Claude Code in a team engineering context. Copy the contents
of this directory into your repo's `.claude/` directory, rename `CLAUDE.md` to the
repo root, and adapt to your project.

## What's included

### CLAUDE.md
Team-level governance rules Claude reads at the start of every session. Adapt:
- **Scope section** — adjust the list of protected files for your project structure
- **Code structure section** — describe your actual directory layout
- **Test commands section** — add your project's test and typecheck commands

### settings.json
Drop this into your `.claude/` directory.

**Permissions:** The allow list pre-approves common safe commands so Claude
doesn't prompt for each one. The deny list blocks operations no Claude session
should perform — force-pushing, bulk deletion, running untrusted packages.
Adapt both lists to your project's tooling.

**Hooks:** The `PostToolUse` hook runs `npm test` after every file write.
If your test suite is slow, replace with a faster check:
- Linter only: `npm run lint 2>&1 | tail -5`
- Jest watch: `npx jest --passWithNoTests 2>&1 | tail -10`

## What this doesn't cover

- User-level personal preferences (each engineer's `~/.claude/CLAUDE.md`)
- MCP server configuration (project-specific, add to `.mcp.json`)
- Plugin installation (each engineer installs plugins individually)

## Updating the harness

Treat this like any other shared configuration. Changes go through code review.
Breaking changes (removing a permission, tightening a rule) warrant a team
discussion before merging.
```

---

## Step 2 — Commit and reflect (~10 min)

Commit the template:

```bash
git add claude-harness/
git commit -m "feat: add claude-harness org template"
```

Now read through what you have built across all three exercises. You started with a repo where six engineers used Claude Code however they liked. You now have:

- **CLAUDE.md** — team standards every session reads
- **Permissions** — hard limits no prompt can override
- **Hooks** — automated enforcement that runs without being asked
- **A template** — so the next project starts with all of this on day one

The harness is not locked. It should evolve as the team learns. Add it to your team's code review process: if someone wants to change the deny list or modify a hook, it goes through the same review as any other code change.

---

## Deliverable

By the end of Exercise 3 you should have:
- [ ] `claude-harness/CLAUDE.md` — team standards template with explanatory comments
- [ ] `claude-harness/settings.json` — permissions and hooks pre-configured
- [ ] `claude-harness/README.md` — adoption guide explaining each decision
- [ ] Everything committed to the repo

---

## Reflection questions

- What would a team need to do to adopt this template? What would they need to change?
- Who should own the harness in your organisation — each team independently, or a central platform team?
- What happens when two teams have conflicting standards? How would you resolve that?
- Three months from now, how would you know if the harness was working?
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-4/exercises/exercise-3-org-template.md
git commit -m "feat: add module 4 exercise 3 — org template"
```

---

## Task 6: Facilitator Guide

**Files:**
- Create: `docs/module-4/facilitator-guide.md`

- [ ] **Step 1: Create facilitator-guide.md**

`docs/module-4/facilitator-guide.md`:
```markdown
# Module 4 Facilitator Guide

**The AI Harness — Claude Code for Teams and Organisations**

---

## Learning goals

By the end of this module participants should be able to:

1. Articulate the difference between individual Claude Code configuration and team-level governance
2. Add team-facing governance rules to a project CLAUDE.md and explain why they differ from individual rules
3. Configure a permissions allow/deny list in `.claude/settings.json` and explain the difference between CLAUDE.md guidance and hard permission limits
4. Write a `PostToolUse` hook and explain when hooks are the right tool versus CLAUDE.md rules
5. Extract a reusable harness template another team could adopt on day one
6. Explain the harness as an engineering asset — something teams own, review, and evolve

**The meta-skill:** Claude Code is a configurable system, not a fixed tool. The configuration is shared infrastructure. It belongs in version control, goes through code review, and should improve over time.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Modules 1–3 + intro to team context | 5 min |
| Exercise 1 | 25 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 20 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 15 min |
| Debrief + wrap-up | 5 min |
| **Total** | **~80 min** |

---

## Before the session

No external setup needed. Participants work in their own workshop repo throughout. Verify that `.claude/settings.json` does not already exist in the repo — if it does (from a previous session), clear its contents before the module starts.

---

## Exercise 1 facilitation notes

**The key teaching moment is the distinction between CLAUDE.md and permissions.** Many participants will assume that writing a rule in CLAUDE.md is equivalent to enforcing it. The moment they ask Claude to run a denied command and watch it refuse — without prompting, without negotiation — is when the distinction lands.

Ask participants: "Could you write a prompt that would make Claude run `git push --force` anyway?" The answer should be no — and that is the point.

**Common confusion:** participants sometimes add deny rules but forget to restart Claude Code. Hooks and permissions are loaded at session start. Remind them that editing `settings.json` mid-session requires a restart.

---

## Exercise 2 facilitation notes

**The hook explanation in the exercise body is intentional.** Hooks are not intuitive. The exercise asks participants to read the explanation before configuring anything. Do not rush past it.

**The test failure demonstration is the payoff.** When participants ask Claude to make a breaking change and the hook fires — showing test failures they didn't ask for — the value proposition becomes concrete. Facilitate a brief discussion: "How would this have played out without the hook?"

**Slow tests are a real concern.** If participants raise this (and they will), validate it. `npm test` for this repo is fast. In a real project with a long test suite, the right answer is a faster hook (linter, type check) with full tests in CI. The hook demonstrates the mechanism; the production decision is context-dependent.

---

## Exercise 3 facilitation notes

This is the synthesis exercise. Participants are not learning a new concept — they are packaging what they have built into something distributable.

**The README is the most important deliverable.** A `settings.json` with no explanation is opaque. A team that copies the template and does not understand the `deny` list will either remove it or resent it. The README is what makes the template adoptable.

**End with the governance question.** Who owns the harness? Individual teams, or a central platform team? There is no right answer, but the question surfaces real organisational dynamics. It is a good discussion to close the module with.

---

## Connection to the broader arc

| Module | Individual focus | Org focus added |
|--------|-----------------|-----------------|
| 1 | Commands, skills, review loop | — |
| 2 | MCP, external context | Shared commands in the repo |
| 3 | Spec-driven development | Shared plugins and skills |
| 4 | — | Permissions, hooks, org template |

Module 4 completes the arc: the practices participants built for themselves are now things the whole organisation can share, enforce, and evolve.

---

## Simplifications

If time is short, Exercise 3 can be cut — it is synthesis, not new concepts. The core learning is in Exercises 1 and 2.

If participants struggle with JSON syntax in `settings.json`, have them validate with:
```bash
cat .claude/settings.json | python3 -m json.tool
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/module-4/facilitator-guide.md
git commit -m "feat: add module 4 facilitator guide"
```

---

## Task 7: Config and README Updates

**Files:**
- Modify: `docs-site/src/config.ts` (add module-4 entry)
- Modify: `README.md` (add facilitator guide link)

- [ ] **Step 1: Add module-4 to config.ts**

In `docs-site/src/config.ts`, add after the module-2 entry (before the closing `]`):

```ts
  {
    id: 'module-3',
    // ... existing module-3 entry ...
  },
  {
    id: 'module-4',
    number: '04',
    title: 'The AI Harness — Claude Code for Teams and Organisations',
    description:
      'Configure team governance, permissions, and hooks. Build a reusable org template for Claude Code standards.',
    status: 'ready',
    participantGuide: '/docs/module-4/participant-guide.md',
    exercises: [
      {
        slug: 'exercise-1-team-harness',
        title: 'Team Lead: Establish the Team Harness',
        file: '/docs/module-4/exercises/exercise-1-team-harness.md',
      },
      {
        slug: 'exercise-2-hooks',
        title: 'Team Lead: Automate the Enforcement',
        file: '/docs/module-4/exercises/exercise-2-hooks.md',
      },
      {
        slug: 'exercise-3-org-template',
        title: 'Head of AI Engineering Practices: Build the Org Template',
        file: '/docs/module-4/exercises/exercise-3-org-template.md',
      },
    ],
  },
```

- [ ] **Step 2: Add facilitator guide link to root README.md**

In `README.md`, in the `## For facilitators` section, add after the module-3 line:

```markdown
- [Module 4 Facilitator Guide](docs/module-4/facilitator-guide.md) — The AI Harness: Claude Code for Teams and Organisations
```

- [ ] **Step 3: Run tests**

```bash
cd docs-site && npm test
```

Expected: 10 tests pass (no change to test count — config.ts is typed but not tested directly).

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/config.ts README.md
git commit -m "feat: add module 4 to frontend config and README"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Covered by |
|---|---|
| Rapid-promotion scenario with deadpan HR memos | Exercise 1, 2, 3 opening memos |
| Participant guide: recap individual work, frame team shift | Task 2 |
| Exercise 1: team CLAUDE.md governance rules | Task 3, Part 1 |
| Exercise 1: permissions allow/deny in settings.json | Task 3, Part 2 |
| Exercise 2: hook explanation in exercise body | Task 4, "What is a hook?" section |
| Exercise 2: PostToolUse hook writing and triggering | Task 4, Steps 1–2 |
| Exercise 3: claude-harness/ template directory | Task 5, Step 1 |
| Exercise 3: README explaining decisions | Task 5, Step 1 |
| Facilitator guide with learning goals and timing | Task 6 |
| Frontend config update | Task 7 |
| Root README facilitator link | Task 7 |
| No exercise overview in participant guide | Task 2 |
| Out of scope: user-level CLAUDE.md, MCP, plugins, CI/CD hooks | Not included |
