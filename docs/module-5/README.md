# Module 5: AI Security & Guardrails

**Duration:** ~60–85 minutes
**Level:** Advanced
**Prerequisites:** Module 4 (The AI Harness) — you should have a working `.claude/settings.json` before starting.

## What you will practise

- Recognising prompt injection surfaces in agentic workflows
- Writing `PreToolUse` hooks to enforce runtime tool boundaries
- Blocking Claude from accessing sensitive files using `permissions.deny` rules
- Understanding the difference between CLAUDE.md guidance and hard permission enforcement
- Running `claude -p` safely in automated pipelines with scoped allow lists, permission modes, and turn caps

## Permission rule syntax reference

| Rule | What it matches |
|------|----------------|
| `Bash(npm test)` | Exactly `npm test` |
| `Bash(npm test *)` | `npm test` with any arguments |
| `Bash(git push *)` | Any `git push` command |
| `Read(./.env)` | `.env` in the project root |
| `Read(./.env.*)` | `.env.local`, `.env.production`, etc. |
| `Read(./secrets/**)` | All files under `secrets/` at any depth |
| `WebFetch(domain:github.com)` | Fetches to github.com only |
| `mcp__*` | All MCP tools |

Rules evaluate in order: **deny → ask → allow**. A deny at any settings level blocks lower-level allows.

## Exercises

1. [Exercise 1: Prompt Injection in the Engineering Loop](exercises/exercise-1-prompt-injection.md)
2. [Exercise 2: Secrets and the Permission Layer](exercises/exercise-2-secrets-permissions.md)
3. [Exercise 3: Safe Agentic Patterns](exercises/exercise-3-safe-agentic-patterns.md)

Or follow the [Participant Guide](participant-guide.md) for the full walkthrough with scenario context.

## Prerequisites

- Node.js 20+
- Claude Code CLI installed and authenticated (`claude --version`)
- Module 4 complete (you have a `.claude/settings.json`)
- `npm install` run in the repo root
