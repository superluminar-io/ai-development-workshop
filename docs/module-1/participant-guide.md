# Module 1 Participant Guide

**Claude Code in the Engineering Loop**

> Complete the **Setup** module before starting here.

---

## The scenario

It's your first week at a new company. You've been handed a codebase that processes support tickets and told there's a bug affecting billing customers — no handover, no context, just the repo and a vague description of the problem. Your task is to understand the code quickly, improve what you find, and ship a clean change without breaking anything.

---

## Overview

In this module you will use Claude Code to work with a realistic TypeScript backend service that has intentional imperfections. You will not be using Claude as a chatbot. You will be using it as a repo-aware engineering tool — one that reads your files, proposes changes, and operates inside a disciplined review loop.

By the end you will have:
- explored an unfamiliar codebase with Claude
- written a custom slash command
- refactored code with Claude in small, reviewable steps
- found and fixed a real bug through test generation
- produced a PR-style review and summary

---

## How Claude Code slash commands work

A slash command is a prompt file stored in `.claude/commands/`. Each `.md` file in that directory becomes a command — the filename (without `.md`) is the command name. Running `/explain-codebase` is equivalent to pasting the contents of `.claude/commands/explain-codebase.md` into Claude, but repeatable and consistent every time.

```
/explain-codebase      # understand the codebase structure
/propose-change        # plan a change before touching any files
/generate-tests        # find missing test coverage
/review-diff           # review everything you've changed
/prepare-pr-summary    # produce a PR description
```

**When to use them:** Whenever you find yourself typing the same instructions to Claude more than once — "read these files, don't edit anything, give me X" — that's a command waiting to be written. Commands also make workflows shareable: anyone on the team who clones the repo gets the same starting point.

**Scope:** Commands in `.claude/commands/` are project-level — they're checked into the repo and apply to everyone who works in it. You can also have personal commands in `~/.claude/commands/` that follow you across all projects. Project commands take precedence when there's a name collision.

**They're just markdown:** Open any command file in your editor. There's no special syntax. The prompt is exactly what Claude reads — you can read it, edit it, and understand precisely what you're asking Claude to do. This transparency is intentional. You should never run a command you haven't read.

---

