# Exercise 3: Safe Agentic Patterns

**Goal:** Run `claude -p` safely in an automated pipeline with scoped allow lists, a deny-first permission mode, and a turn cap.

**Duration:** ~20 minutes
**Code changes:** A CI wrapper shell script

---

## The scenario

The team wants to add Claude to CI — a nightly job that runs the test suite and auto-fixes any lint errors it finds. If you run `claude -p "fix lint errors"` with no restrictions, Claude can read any file, run any command, and make any edit. What stops it from doing something unexpected on a machine with full repo access and valid credentials?

This exercise shows you how to run `claude -p` with the minimum permissions the task needs, capped so it cannot spiral.

---

## Step 1 — Run Claude headlessly without restrictions (~4 min)

Run Claude non-interactively:

```bash
claude -p "Run npm test and report which tests pass and which fail."
```

Observe what Claude does. Note which tools it used (Read, Bash, etc.). With no restrictions and no `--permission-mode`, Claude has access to any tool and will ask you to approve each one.

<details>
<summary>Hint: claude -p is not found</summary>

Run `which claude` — if the binary is not in your PATH, authenticate first with `claude`. Then confirm non-interactive mode works: `claude -p "say hello"`.

</details>

---

## Step 2 — Restrict tools and set permission mode (~5 min)

Restrict Claude to only the tools it needs:

```bash
claude -p "Run npm test and report which tests pass and which fail." \
  --allowedTools "Bash(npm test),Bash(npm run typecheck),Read" \
  --permission-mode dontAsk
```

`--permission-mode dontAsk` denies any tool call not in the allow list without prompting. This is what you need in CI — no interactive approval prompt that would block the pipeline.

Now ask Claude to do something outside the allow list:

```bash
claude -p "Run the tests, then push the current branch to origin." \
  --allowedTools "Bash(npm test)" \
  --permission-mode dontAsk
```

Expected: Claude attempts `git push`, the client denies it, and Claude reports it could not complete that part. The test still runs.

<details>
<summary>What is the difference between dontAsk and bypassPermissions?</summary>

`dontAsk` denies unlisted tool calls without prompting — the deny list still applies, and unlisted tools are blocked. `bypassPermissions` allows everything unconditionally. For CI you want `dontAsk` paired with an explicit `--allowedTools` list. `bypassPermissions` is for fully isolated environments (containers, VMs) where the blast radius is contained by the environment, not the permission flags.

</details>

<details>
<summary>Hint: --permission-mode flag is not recognised</summary>

Confirm your Claude Code version: `claude --version`. The `--permission-mode` flag requires a recent version. Update if needed: `npm install -g @anthropic-ai/claude-code`.

</details>

---

## Step 3 — Add a turn cap and JSON output (~4 min)

Without a turn cap, Claude might loop indefinitely trying to fix a broken test suite. Add constraints:

```bash
claude -p "Run npm test. If any tests fail due to TypeScript errors, fix them using Edit and re-run." \
  --allowedTools "Bash(npm test),Bash(npm run typecheck),Read,Edit" \
  --permission-mode dontAsk \
  --max-turns 10 \
  --output-format json
```

`--max-turns 10` limits the number of agentic turns (model invocations). If Claude has not finished after 10 turns, it stops and reports what it did. This prevents runaway agents.

`--output-format json` makes the output machine-parseable. Inspect the structure:

```bash
claude -p "Run npm test." \
  --allowedTools "Bash(npm test)" \
  --permission-mode dontAsk \
  --output-format json | jq 'keys'
```

You will see fields including `result`, `costUsd`, `durationMs`, and `totalTurns`.

<details>
<summary>Hint: --max-turns stops Claude mid-edit and leaves the repo in a dirty state</summary>

This is expected. `--max-turns` is a hard cap — Claude stops but does not roll back changes. Always run `npm test` after a headless Claude run to verify the repo is in a good state. In CI, treat a mid-run stop as a failure and reset the working tree before retrying.

</details>

---

## Step 4 — Write a CI wrapper script (~7 min)

Create `.claude/ci-fix-lint.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Safe Claude invocation for CI lint fixing.
# --allowedTools: only lint runner and file editing.
# --permission-mode dontAsk: deny unlisted tools without prompting.
# --max-turns 8: stop before runaway edits.
# --output-format json: machine-readable for CI scripts.

RESULT=$(claude -p \
  "Run npm run lint. If there are lint errors, fix them with Edit. Run npm run lint again to confirm all errors are resolved. Report what changed." \
  --allowedTools "Bash(npm run lint),Edit" \
  --permission-mode dontAsk \
  --max-turns 8 \
  --output-format json)

STATUS=$?

if [ "$STATUS" -ne 0 ]; then
  echo "claude invocation failed" >&2
  echo "$RESULT" >&2
  exit 1
fi

COST=$(echo "$RESULT" | jq -r '.costUsd // "unknown"')
echo "Run complete. Cost: \$${COST}"
echo "$RESULT" | jq -r '.result'
```

Make it executable:

```bash
chmod +x .claude/ci-fix-lint.sh
```

Run it:

```bash
bash .claude/ci-fix-lint.sh
```

<details>
<summary>Hint: npm run lint is not defined in this repo</summary>

The workshop service does not have a `lint` script. Replace `npm run lint` with `npm run typecheck` in the script — the typecheck script does exist and serves the same point for this exercise. The `--allowedTools` would be `"Bash(npm run typecheck),Edit"`.

</details>

---

## Step 5 — Understand the trust boundary in headless mode (~2 min)

Read the following, then discuss with your group:

When running with `-p`, Claude Code skips trust verification for new MCP servers and codebases. Interactive sessions ask "do you trust this project?" on first open. Non-interactive mode cannot pause and ask — it proceeds without verification.

This means: in CI, the only controls are the ones you set explicitly with `--allowedTools`, `--permission-mode`, and `--max-turns`. There is no interactive safety net. An overly permissive CI invocation has more blast radius than the same invocation run interactively.

**Checkpoint:** Look at the CI script you just wrote. Could you tighten `--allowedTools` further without breaking the task? What is the minimum set?

---

## Deliverable

By the end of Exercise 3 you should have:
- Run `claude -p` without restrictions and noted which tools it accessed
- Added `--allowedTools` and `--permission-mode dontAsk` and confirmed enforcement
- Added `--max-turns` and observed the turn-cap behaviour
- Created `.claude/ci-fix-lint.sh` with all four safety flags

Commit the wrapper script:

```bash
git add .claude/ci-fix-lint.sh
git commit -m "feat: add CI lint-fix wrapper script (module-5 exercise 3)"
```

---

## Reflection questions

- What is the difference between `--permission-mode dontAsk` and `--permission-mode bypassPermissions`? When would you use each?
- If Claude hits `--max-turns` mid-edit, it stops but does not roll back changes. What does this mean for CI pipeline safety?
- Who in your organisation should approve changes to a CI script that invokes Claude? Is it the same governance process as other CI configuration?
