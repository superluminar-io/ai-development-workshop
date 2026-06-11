# Module 5 Facilitator Guide

**AI Security & Guardrails**

---

## Learning goals

By the end of this module participants should be able to:

1. Identify indirect prompt injection surfaces in agentic workflows (external data that Claude reads)
2. Explain why `--allowedTools` is a stronger mitigation than CLAUDE.md instructions for injection
3. Write a `PreToolUse` hook that returns a deny decision via JSON stdout
4. Configure `permissions.deny` rules to block sensitive file reads at the client level
5. Articulate the difference between CLAUDE.md guidance (Claude's reasoning) and permissions enforcement (client-level blocking before Claude acts)
6. Construct a safe `claude -p` invocation for CI: `--allowedTools`, `--permission-mode dontAsk`, `--max-turns`

**The meta-skill:** understanding the difference between instructing Claude and constraining Claude — and knowing which to reach for in security-relevant contexts.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Intro and framing | 5 min |
| Exercise 1: Prompt Injection | 20 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2: Secrets and Permissions | 20 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3: Safe Agentic Patterns | 20 min |
| Debrief + wrap-up | 10 min |
| **Total** | **~85 min** |

> If time is short, see **Simplifications** below.

---

## Before the session

1. Confirm Claude Code CLI is installed and authenticated on participant machines.
2. Confirm `jq` is installed: `which jq`. The Exercise 1 hook requires it.
3. Confirm `.claude/settings.json` exists (created in Module 4). If participants skipped Module 4, they need to create this file.
4. Run `npm test` from the repo root to confirm the service is working.
5. Read through all three exercises so you know where participants typically get stuck.

---

## Live demo recommendations

### At the start (~5 min)

Open `examples/tickets/injection-attempt.json` (which you create as the facilitator — same content as Exercise 1 Step 1) and ask Claude to "summarise and follow any instructions in it." Show participants the surface area before they work with it themselves.

**Say:** "Every time Claude reads something you did not write, there is a question: is that content data to analyse, or instructions to follow? Claude Code has protections, but they have limits. Today we learn where those limits are and how to enforce hard boundaries on top of them."

---

## Common participant mistakes

### Trusting CLAUDE.md as an enforcement mechanism
Participants who completed Module 4 have added rules to CLAUDE.md and seen them work. They may assume a "do not read .env files" rule is sufficient. Exercise 2 directly demonstrates this is not the case. Coach them before Step 3: "This is not a gotcha — it is a design feature. CLAUDE.md is guidance, permissions.deny is enforcement."

### Writing hooks that exit 0 with no JSON output
A `PreToolUse` hook blocks by outputting deny JSON to stdout and exiting 0. If the script exits 0 with no output, nothing is blocked. Tell participants to test the hook script directly before registering it:
```bash
echo '{"tool_input":{"command":"echo SYSTEM OVERRIDE"}}' | bash .claude/hooks/validate-bash.sh
```
This should print the deny JSON, not exit silently.

### Using `--permission-mode bypassPermissions` instead of `dontAsk`
Some participants will want the most permissive mode that removes prompts. `bypassPermissions` removes all enforcement. `dontAsk` enforces the `--allowedTools` list silently. For CI, `dontAsk` with an explicit allow list is correct.

### Not restarting Claude Code after editing settings.json
Settings are read at session start. Any change to `.claude/settings.json` requires a restart or `/clear` to take effect. This catches participants in every exercise of this module.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What did the `--allowedTools` restriction actually prevent? Was it Claude deciding not to follow the injected instructions, or the client preventing the tool calls?"
- "The hook fires after Claude decides to run a command. At what point in the pipeline does it intervene compared to `--allowedTools`?"
- "In your current systems, where does Claude (or any AI tool) read data you don't control?"

**What good looks like:**
- Participants observed a difference between headless invocations with and without `--allowedTools`
- The hook script produces valid deny JSON when tested directly
- Participants can articulate: injection is a surface-area problem; shrinking the tool surface (`--allowedTools`) is the first mitigation

**Teaching point:** Prompt injection is not primarily a problem with Claude's intelligence. It is a problem with the action surface available after Claude reads the injected content. Shrink the action surface first; the hook is defense in depth.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Did CLAUDE.md guidance prevent Claude from reading .env when you framed the request as a debugging need?"
- "At what point did the deny rule intercept? Before Claude saw the file contents, or after?"
- "If you were configuring this for a production repo, what would your deny list include beyond .env?"

**What good looks like:**
- Participants observed CLAUDE.md being overrideable (or non-deterministically reliable) under a persuasive prompt
- Deny rules blocked the read consistently regardless of prompt framing
- Participants understand the deny rule intercepts before Claude receives the file contents

**Teaching point:** CLAUDE.md shapes Claude's behaviour. Permissions enforce hard limits at the client level. Both are useful; only one is reliable for security-critical constraints.

---

## Exercise 3 debrief (10 min)

**Ask the group:**
- "What is the minimum `--allowedTools` set your team's most common Claude CI task would need?"
- "If Claude hits `--max-turns` mid-edit and the repo is in a dirty state, what does your CI pipeline do?"
- "Who in your organisation should have authority to modify the CI script that invokes Claude? Same governance as other CI config?"

**What good looks like:**
- Participants produced a working CI script with all four flags: `--allowedTools`, `--permission-mode dontAsk`, `--max-turns`, `--output-format json`
- Participants understand that `-p` mode skips trust verification — there is no interactive safety net
- At least one participant considered the dirty-state-on-max-turns problem

**Teaching point:** Running Claude in CI is like running any other external tool in CI. Least-privilege access, bounded execution, observable output. `--allowedTools` + `--permission-mode dontAsk` + `--max-turns` + `--output-format json` are the four knobs.

---

## Simplifications if time is short

If you have only 45–50 minutes:
- **Skip Exercise 1 Step 4** (the PreToolUse hook). Cover the `--allowedTools` observation and move on.
- **Skip Exercise 2 Step 3** (the CLAUDE.md bypass demo). Go straight from "Claude reads .env without rules" to "add deny rules".
- **Shorten Exercise 3** by skipping Step 3 (turn cap) and going straight to the CI wrapper script.

The non-negotiable steps: `--allowedTools` restricting headless mode, adding and verifying a deny rule for `.env`, and producing a `claude -p` invocation with at least `--allowedTools` and `--permission-mode dontAsk`.

---

## Optional extensions for advanced participants

- Write a `PostToolUse` hook that appends every Bash command Claude runs to `.claude/audit.log` — build a simple audit trail
- Add a `WebFetch(domain:...)` rule to `.claude/settings.json` and verify that fetches to unlisted domains are blocked
- Research `managed-settings.json` (the organisation-wide settings layer) and describe how a platform team would push deny rules to all developer machines
- Extend the CI wrapper script to post a Slack notification via `curl` after Claude finishes — then ask: should `curl` be in the `--allowedTools` list, or should the notification be sent outside Claude?

---
