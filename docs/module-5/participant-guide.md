# Module 5 Participant Guide

**AI Security & Guardrails**

> Complete **Module 4: The AI Harness** before starting here. You need a working `.claude/settings.json` to configure permissions in these exercises.

---

## The scenario

Your team has been using Claude Code for six months. It is now in CI, in code review workflows, and several engineers use it to process data from external systems. Security has flagged three questions: Can Claude be tricked into acting on instructions embedded in external data? Can it access secrets it should not? Who controls what it can do when nobody is watching?

This module answers all three.

---

## Exercise 1 — Prompt Injection in the Engineering Loop (~20 min)

Craft an adversarial ticket file, observe what happens when Claude processes it in an agentic context, and add a `PreToolUse` hook that enforces a runtime boundary regardless of what Claude decides.

> **In the scenario:** You have been asked to automate ticket triage — read tickets and classify them with Claude. A security engineer asks: what if a customer submits a ticket that contains instructions? You are about to find out.

---

## Exercise 2 — Secrets and the Permission Layer (~20 min)

See what Claude can read without deny rules, add a CLAUDE.md instruction and test whether it is bypassable, then add hard deny rules and verify enforcement.

> **In the scenario:** A teammate's well-intentioned CLAUDE.md edit put an API key into context. It is gone now, but the incident revealed a gap: nothing was stopping Claude from reading `.env` files in the first place. You are closing that gap now.

---

## Exercise 3 — Safe Agentic Patterns (~20 min)

Run `claude -p` with scoped tool allow lists, a deny-first permission mode, and a turn cap. Write a minimal CI wrapper script that is safe to run on a machine with full repo access.

> **In the scenario:** Your CI pipeline needs a Claude-powered lint fixer. The CI machine has full repo access and valid credentials. If the invocation is too permissive, Claude can read anything, write anything, and run anything — unsupervised. You are writing the safest invocation that still gets the job done.

---

## Troubleshooting

**`jq` is not installed**
Install it: `brew install jq` (macOS) or `apt install jq` (Debian/Ubuntu). The hook script in Exercise 1 requires `jq` to parse tool input.

**Hook is not triggering**
Check: (1) the hook file is executable (`ls -la .claude/hooks/`), (2) it is registered in `.claude/settings.json` under `"hooks"."PreToolUse"`, (3) you restarted Claude Code after editing `settings.json`.

**Deny rule is not blocking the file**
Ensure the path in the deny rule matches the actual file. `Read(./.env)` matches `.env` at the project root. Use `Read(./.env.*)` to also cover `.env.local`, `.env.production`, etc. Restart Claude Code after editing `settings.json`.

**`claude -p` is not found**
Run `which claude` — if the binary is not in your PATH, authenticate first with `claude`. Then confirm non-interactive mode works: `claude -p "say hello"`.

**`--permission-mode` flag is not recognised**
Confirm your Claude Code version: `claude --version`. Update if needed: `npm install -g @anthropic-ai/claude-code`.

**`--max-turns` stops Claude mid-edit and leaves the repo in a dirty state**
This is expected. `--max-turns` is a hard cap for CI safety — Claude stops but does not roll back. Always run `npm test` after a headless Claude run to verify the repo is in a good state.

---
