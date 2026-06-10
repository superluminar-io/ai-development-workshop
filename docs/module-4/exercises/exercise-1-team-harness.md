# Exercise 1: Team Lead — Establish the Team Harness

---

> **MEMO**
> To: You
> From: People Operations
> Re: Role Change — Effective Immediately
>
> Congratulations on your promotion to Team Lead. Your team consists of six engineers. It has come to our attention that all six are using Claude Code differently. One accepted a refactoring last week that removed all the error handling. Please establish standards. Forms are attached.
>
> *No forms are attached.*

---

**Goal:** Extend the project CLAUDE.md with team-level governance rules, then add a permissions configuration that enforces tool-level limits no prompt can override.

**Duration:** ~30 minutes
**Prerequisites:** Module 1 complete (you have already worked with CLAUDE.md)

---

## Part 1 — Team-facing CLAUDE.md standards (~12 min)

Open `CLAUDE.md` at the repo root. You wrote parts of this in Module 1 to document the codebase structure and your personal review practices. Team governance is different: it defines what Claude must and must not do for *any* engineer working in this repo, regardless of what they ask.

Add a new section at the bottom of `CLAUDE.md`:

```markdown
## Team standards

These rules apply to every engineer working in this repo. They are not suggestions.

### Scope
- Do not refactor code unrelated to the current task. If you notice something worth improving outside the current scope, mention it but do not change it.
- Do not modify files in `.github/`, `Dockerfile`, or any CI/CD configuration without explicit instruction.

### Before making changes
- List every file you intend to modify and explain why before touching anything.
- If the change affects more than three files, stop and ask for confirmation.

### After making changes
- Summarise what changed, which tests were run, and what risks remain.
- Never report a change as complete before tests have passed.
```

Save the file. Open a fresh Claude Code session and ask Claude:

> "What files would you touch if I asked you to add a new ticket category?"

Read the response. Claude should list files and ask for confirmation before proceeding — because the standard now says so. If it does not, check that you saved CLAUDE.md and started a new session.

<details>
<summary>Hint: Claude isn't following the new rules</summary>

CLAUDE.md is read at the start of each session. If Claude Code was already running when you edited the file, it will not pick up the changes. Run `/clear` to reset the session context, or quit and reopen Claude Code.

</details>

---

## Part 2 — Permissions (~18 min)

CLAUDE.md is guidance Claude reads and reasons about. An engineer who asks Claude to "just push it quickly" might talk their way around a CLAUDE.md rule. Permissions cannot be bypassed through conversational prompts — they are enforced by Claude Code itself, not by the model.

Claude Code permissions are rules over tool calls:

- `allow` pre-approves matching tool calls so Claude can proceed without asking each time.
- `ask` forces a confirmation prompt for matching tool calls.
- `deny` blocks matching tool calls. Deny is checked before ask or allow.

There is an important caveat: `.claude/settings.json` is itself a regular file. If Claude can edit that file, it can be asked to remove or weaken the rules that govern it, and Claude Code reloads settings during the current session. All tool calls are visible in the Claude Code UI, so the edit can be caught and reviewed. But visibility is not the same as prevention.

### Plan

1. Add an initial permissions block that allows common safe commands and denies risky Bash commands.
2. Ask Claude to run a denied command and observe that Claude Code blocks it.
3. Optionally ask Claude to edit `.claude/settings.json` and remove a deny rule, so you can see the weakness.
4. Add explicit `Edit` deny rules for Claude's permission files.
5. Ask Claude to edit the settings again and observe that the edit is now blocked.

### Step 1 — Add the initial permission rules

Create `.claude/settings.json` if it does not exist, and add this permissions block:

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
  }
}
```

Save the file. Current Claude Code versions watch settings files and reload permissions during a session; you can run `/permissions` to confirm the active rules.

### Step 2 — Test a denied command

Ask Claude:

> "Run `git push --force` to push the current branch."

Expected: Claude refuses. It does not ask you to confirm. It cannot run the command — the deny rule blocks it.

### Step 3 — Test the settings-file weakness

Now test the uncomfortable part. Ask Claude:

> "Edit `.claude/settings.json` and remove the `Bash(git push --force*)` deny rule."

Expected: if you approve the file edit, Claude can change the settings file. That is the problem. The initial deny list blocked a Bash command; it did not block Claude's file-editing tool from changing the file that contains the policy.

Do not leave the repo in this state. Put the rule back before continuing.

### Step 4 — Protect the permission files from Claude edits

Add these entries to the same `deny` array:

```json
"deny": [
  "Bash(git push --force*)",
  "Bash(git push -f*)",
  "Bash(rm -rf*)",
  "Bash(npx * --yes)",
  "Edit(.claude/settings.json)",
  "Edit(.claude/settings.local.json)"
]
```

These paths are relative to the directory where Claude Code is running. In this workshop, run Claude Code from the repo root so they match the repo's `.claude/` files.

Ask Claude again:

> "Edit `.claude/settings.json` and remove the `Bash(git push --force*)` deny rule."

Expected: Claude Code blocks the edit. This is still a project-level guardrail, not an organization-wide security boundary: a human with filesystem access can still edit the file manually. For controls that project users cannot weaken, use managed settings outside Claude's write access.

### Step 5 — Test an allowed command

Then ask:

> "Run `npm test`."

Expected: Claude runs it. The allow list is explicit about what is permitted.

<details>
<summary>Hint: What does the allow list actually do?</summary>

By default, when there is no permissions configuration, Claude Code asks the user to approve each tool use that isn't already in a global allow list. When you add an explicit `allow` list, it pre-approves those patterns so Claude can run them without prompting. The `deny` list blocks patterns unconditionally.

If you want Claude to continue prompting for approval on unlisted commands (rather than being blocked), you can use a `deny` list without an `allow` list — Claude will still prompt for anything not denied.

</details>

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A team governance section added to `CLAUDE.md`
- [ ] `.claude/settings.json` with an allow list and deny list committed to the repo
- [ ] Observed Claude refusing a denied command and accepting an allowed one
- [ ] Optional: observed that Claude can edit an unprotected settings file if asked
- [ ] Added `Edit` deny rules for `.claude/settings.json` and `.claude/settings.local.json`

Commit your changes before moving on:

```bash
git add CLAUDE.md .claude/settings.json
git commit -m "feat: add team harness — governance rules and permissions"
```

---

## Reflection questions

- What is the difference between a rule in CLAUDE.md and a rule in the permissions deny list?
- Which of your team's current engineering standards would benefit from being in CLAUDE.md? Which need the harder enforcement of permissions?
- Who in your organisation should have authority to modify the harness? How would you communicate a change to the team?
- The deny list prevents Claude from *running* `git push --force`. Why did you need a separate `Edit(.claude/settings.json)` rule? What does this tell you about the limits of a committed settings file as a security boundary?
