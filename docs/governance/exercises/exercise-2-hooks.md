# Exercise 2: Team Lead — Automate the Enforcement

---

> **MEMO**
> To: You
> From: Engineering
> Re: The Linter Incident
>
> Yesterday a Claude Code session produced 47 linting errors in a single commit. The engineer did not notice. The reviewer did not notice until CI failed. We now have 12 engineers. Standards written in documents are read once.
>
> Please make the machine enforce them.

---

**Goal:** Write a `PostToolUse` hook that runs tests automatically after every Claude edit, so violations are caught in the session, not in CI.

**Duration:** ~20 minutes
**Prerequisites:** Exercise 1 complete — `.claude/settings.json` exists

---

## What is a hook?

A hook is a shell command that Claude Code runs automatically at specific moments in a session — after Claude edits a file, after Claude runs a bash command, before a session ends. Hooks do not ask Claude to do something. They run regardless of what Claude decided.

They are the difference between:

- *"Claude is instructed not to break the tests"* — a CLAUDE.md rule Claude reads and tries to follow
- *"The tests run every time Claude touches a file, so it is physically impossible to leave the session with failing tests"* — a hook

CLAUDE.md rules depend on Claude reading them, understanding them, and choosing to comply. Hooks depend on nothing. They are shell commands. The shell does not care what Claude wanted.

**When to use a hook instead of CLAUDE.md:**

Use CLAUDE.md for standards that require judgment — things Claude needs to reason about. Use a hook for standards that are binary: either the linter passes or it does not. Either tests pass or they do not. Anything that has a deterministic pass/fail outcome and must never be skipped belongs in a hook.

**Hook events available:**

| Event | When it fires |
|---|---|
| `PreToolUse` | Before Claude uses any tool |
| `PostToolUse` | After Claude uses a tool |
| `Stop` | When Claude finishes a response |

---

## Step 1 — Add a PostToolUse hook (~12 min)

Open `.claude/settings.json`. Add a `hooks` section alongside the existing `permissions`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run typecheck)",
      "Bash(npm run lint)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(rm -rf*)",
      "Bash(npx * --yes)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

What this does:
- **Event:** `PostToolUse` — fires after Claude uses a tool
- **Matcher:** `Write|Edit|MultiEdit` — matches when Claude writes or edits a file
- **Command:** `npm test 2>&1 | tail -20` — runs the test suite and shows the last 20 lines

The `2>&1 | tail -20` keeps the output readable. Without it, the full test output appears in the session after every edit.

Save the file and restart Claude Code.

---

## Step 2 — Trigger the hook (~8 min)

Ask Claude to make a small change to the service — something that will not break tests:

> "Add a comment to the top of `src/domain/classifier.ts` describing what the function does."

Watch the session. After Claude writes the file, the test output should appear automatically — you did not ask for it, Claude did not decide to run it. The hook ran.

Expected output at the bottom of Claude's response:
```
Test Files  2 passed (2)
Tests  14 passed (14)
```

Now ask Claude to make a change that *would* break tests — but stop Claude before it commits:

> "Change the `'escalate'` priority string in `src/domain/classifier.ts` to `'escalated'`."

The hook fires again. This time tests fail. Claude sees the failure in its own output and should offer to fix it.

<details>
<summary>Hint: The hook isn't appearing in the session</summary>

Check that:
1. The `settings.json` is at `.claude/settings.json` (not `~/.claude/settings.json` or elsewhere)
2. The JSON is valid — malformed JSON silently disables the hooks block
3. You restarted Claude Code after saving the file — hooks are loaded at session start

Validate the JSON with: `cat .claude/settings.json | python3 -m json.tool`

</details>

<details>
<summary>Hint: The hook fires but tests take too long</summary>

In a real project, running the full test suite on every file write may be too slow. Common alternatives:
- Run only the linter in the hook (`npm run lint 2>&1 | tail -5`)
- Run a fast subset of tests (`npm test -- --reporter=dot 2>&1 | tail -5`)
- Reserve full test runs for `Stop` hooks (fires when Claude finishes a full response, not each individual file write)

For this exercise, `npm test` is fast enough to demonstrate the mechanism.

</details>

---

## Deliverable

By the end of Exercise 2 you should have:
- [ ] A `PostToolUse` hook in `.claude/settings.json` that runs `npm test` after file edits
- [ ] Observed the hook firing automatically after a Claude edit
- [ ] Observed the hook catching a test failure without being asked

Commit your changes:

```bash
git add .claude/settings.json
git commit -m "feat: add PostToolUse hook to enforce tests after every edit"
```

---

## Reflection questions

- A rule in CLAUDE.md says "run tests after every change." A hook does the same thing. What is the practical difference?
- Which standards in your current codebase should be hooks rather than guidelines?
- What is the risk of making the hook too aggressive — firing on every tool use, running the full test suite each time?
