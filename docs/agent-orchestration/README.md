# Agent Orchestration and Workload Isolation

**Level:** Advanced | **Audience:** Engineer | **Duration:** ~75 minutes

---

## Overview

This module covers multi-agent orchestration using the Claude Agent SDK. You will build a code quality pipeline where a supervisor agent delegates to specialist subagents, each locked to a minimal toolset. You will then add hook-based policy enforcement to audit every action and block writes outside a designated output directory.

The result is a practical pattern for running AI agents in automated pipelines where workload isolation and auditability matter.

---

## What you will build

A TypeScript pipeline script that:

1. Spawns a read-only `code-auditor` subagent to review the workshop codebase
2. Adds a `security-scanner` subagent with the same read-only constraint
3. Adds a `report-writer` subagent that can write — but only inside `output/`
4. Enforces the output boundary with a `PreToolUse` hook that blocks unauthorised writes
5. Records every tool call to an audit log with a `PostToolUse` hook

---

## Prerequisites

- Node.js 20 or later: `node --version`
- The workshop repo cloned locally (used as the codebase under review)
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
- No previous modules required

---

## Exercises

| # | Title | Duration |
|---|-------|----------|
| 1 | [Your First Isolated Subagent](exercises/exercise-1-first-subagent.md) | ~25 min |
| 2 | [Pipeline with Hooks](exercises/exercise-2-pipeline-and-hooks.md) | ~25 min |
| 3 | [Full Pipeline and Production Patterns](exercises/exercise-3-full-pipeline.md) | ~20 min |

---

## Participant guide

[participant-guide.md](participant-guide.md)
