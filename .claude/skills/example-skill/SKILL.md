---
# Display name shown in /skills listing. Defaults to the directory name if omitted.
name: example-skill

# Claude reads this to decide whether to load the skill automatically.
# Be specific: vague descriptions trigger too broadly, or not at all.
description: Verify the codebase is clean before committing. Use when the user asks if the code is ready to commit, wants to check for issues, or says they are done with a change.

# Prevents Claude from triggering this skill on its own.
# Use this for skills with side effects or where you want to control timing.
disable-model-invocation: true

# Tools Claude may use without asking for approval while this skill is active.
allowed-tools: Bash(npm *)
---

Run the following steps in order. Stop immediately if any step fails and report the error.

1. Run `npm run typecheck` — confirm there are no TypeScript errors
2. Run `npm test` — confirm all tests pass
3. Run `git diff --stat HEAD` — summarise which files changed and by how much
4. Report: tests passed, types clean, and a one-sentence summary of what changed

Do not suggest a commit message. Do not stage or commit anything. Report only.
