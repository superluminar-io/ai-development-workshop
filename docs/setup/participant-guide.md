# Setup

Get your environment ready before starting Module 1.

---

## Prerequisites

You need these installed before the workshop:

- **Node.js 20+** — check with `node --version`
- **Claude Code CLI** — check with `claude --version`
- **A code editor** open on this repository
- **A terminal** in the repository root

If Claude Code is not installed, run:
```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:
```bash
claude
```

Follow the prompts to log in.

---

## Verify the service works

Run these commands from the repository root:

```bash
npm install
npm test           # should show 14 tests passing
npm run typecheck  # should show 0 errors
npm run process:example  # should print a ticket result
```

If any of these fail, ask for help before starting Module 1.

---

## You're ready

Go to Module 1 in the sidebar to begin.
