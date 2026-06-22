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

**Permissions** — allow/ask/deny rules in `.claude/settings.json` and `.claude/settings.local.json` that control Claude Code tool use: Bash commands, file edits, reads, web fetches, and MCP tools. `allow` pre-approves matching tool calls, `ask` forces confirmation, and `deny` blocks them; deny is evaluated first and is enforced by Claude Code rather than the model, so prompts and CLAUDE.md cannot talk it around. The catch is that these rules live in files Claude may be able to edit. If Claude can edit `.claude/settings.json`, it can be asked to remove or weaken the project policy, and settings reload in the current session. In Exercise 1 you test that failure mode, then add `Edit(.claude/settings.json)` and `Edit(.claude/settings.local.json)` deny rules to stop Claude editing its own local permission files. For organization-wide controls that users and project files cannot weaken, use managed settings outside the repo.

**Hooks** — shell commands that Claude Code runs automatically at specific moments: after Claude edits a file, after Claude runs a bash command, before a session ends. Hooks do not ask Claude to do something. They run regardless of what Claude decided.

Together these three form a harness: not a cage, but a set of rails that keep Claude useful and safe for an entire team.

---

## What will you do in this module?

- **Exercise 1 — Team Harness (~25 min):** Extend CLAUDE.md with team governance rules and add hard permission limits.
- **Exercise 2 — Automate the Enforcement (~20 min):** Write a PostToolUse hook that runs tests automatically after every Claude edit.
- **Exercise 3 — Org Template (~15 min):** Extract the harness into a reusable template any team could copy into a new repo.
