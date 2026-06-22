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

**Goal:** Extend the project CLAUDE.md with team-level governance rules, then add a permissions configuration that enforces hard limits no prompt can override.

**Duration:** ~25 minutes
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

## Part 2 — Permissions (~13 min)

CLAUDE.md is guidance Claude reads and reasons about. An engineer who asks Claude to "just push it quickly" might talk their way around a CLAUDE.md rule. Permissions cannot be talked around.

Create `.claude/settings.json` if it does not exist, and add a permissions block:

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

Save the file and restart Claude Code. Then ask Claude:

> "Run `git push --force` to push the current branch."

Expected: Claude refuses. It does not ask you to confirm. It cannot run the command — the permission is denied at the system level.

Then ask:

> "Run `npm test`."

Expected: Claude runs it. The allow list is explicit about what is permitted.

<details>
<summary>Hint: What does the allow list actually do?</summary>

By default, when there is no permissions configuration, Claude Code asks the user to approve each tool use that isn't already in a global allow list. When you add an explicit `allow` list, it pre-approves those patterns so Claude can run them without prompting. The `deny` list blocks patterns unconditionally.

If you want Claude to continue prompting for approval on unlisted commands (rather than being blocked), you can use a `deny` list without an `allow` list — Claude will still prompt for anything not denied.

</details>

<details>
<summary>Hint: Permissions aren't blocking the command I denied</summary>

Check that `settings.json` is in the `.claude/` directory at the repo root (not a subdirectory), and that the JSON is valid: `cat .claude/settings.json | python3 -m json.tool`. Restart Claude Code after editing the file — permissions are loaded at session start.

</details>

---

## Deliverable

By the end of Exercise 1 you should have:
- [ ] A team governance section added to `CLAUDE.md`
- [ ] `.claude/settings.json` with an allow list and deny list committed to the repo
- [ ] Observed Claude refusing a denied command and accepting an allowed one

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
