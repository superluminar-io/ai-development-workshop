# Module 5 Participant Guide

**AI Security & Guardrails**

> Complete **Module 4: The AI Harness** before starting here. You need a working `.claude/settings.json` to configure permissions in these exercises.

---

## The scenario

Your team has been using Claude Code for six months. It is now in CI, in code review workflows, and several engineers use it to process data from external systems. Security has flagged three questions: Can Claude be tricked into acting on instructions embedded in external data? Can it access secrets it should not? Who controls what it can do when nobody is watching?

This module answers all three.

---

## What will you do in this module?

- **Exercise 1 — Prompt Injection (~20 min):** Craft an adversarial ticket, observe the injection surface, add a PreToolUse hook that enforces a runtime boundary.
- **Exercise 2 — Secrets and the Permission Layer (~20 min):** See what Claude can read without deny rules, test CLAUDE.md guidance against a persuasive prompt, add hard deny rules.
- **Exercise 3 — Safe Agentic Patterns (~20 min):** Run `claude -p` with scoped tool lists, deny-first permission mode, and a turn cap. Write a minimal CI wrapper script.

---
