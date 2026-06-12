# Exercise 3: Head of AI Engineering Practices — Write the Adoption Plan

---

> **MEMO**
> To: You
> From: The Board
> Re: New Role — Head of AI Engineering Practices
>
> Your work as Team Lead has been noted at the highest levels. You have been promoted. Your scope is now the entire organisation. Every new project we start must have sensible AI development defaults from day one.
>
> You have until end of day. The Board looks forward to your presentation.
>
> *There is no presentation.*

---

**Goal:** Turn what you learned in this module into a short adoption plan for standardising AI-assisted development across projects.

**Duration:** ~15 minutes
**Prerequisites:** Exercises 1 and 2 complete

---

## The problem with one-off harnesses

You have now built a harness for this repo. It works here. But the organisation has more than one repo, more than one team, and more than one kind of project.

Copying this repo's exact `CLAUDE.md`, permissions, and hook into every project would be too blunt. A ticket processor, a frontend app, a Terraform repo, and an SDK need different local instructions. What they do need is a shared process for deciding:

- What should be standardised across all repos?
- What must stay project-specific?
- What belongs in `CLAUDE.md`, permissions, hooks, MCP config, or managed policy?
- Who owns the standard?
- How do teams adopt it without breaking their workflows?

This exercise is about that process. You are not building a perfect enterprise governance platform. You are creating a practical starting point for a small company or early platform team.

At enterprise scale, there is more to learn. Our advanced workshop covers this topic in greater breadth and depth: managed settings, device policy deployment, approved MCP servers, plugin marketplace governance, agent isolation, data governance, audit requirements, and exception handling.

In a real organisation, this plan would usually live in a dedicated standards repo or engineering handbook, not inside an individual product repo. In this workshop, you will create it inside the current repo so you can practise the thinking without switching repositories.

---

## Step 1 — Create the plan (~2 min)

Create a file at the repo root:

```bash
touch ai-adoption-plan.md
```

Add this structure:

```markdown
# AI-Assisted Development Adoption Plan

## 1. What we will standardise

<!-- Which AI development practices should every repo start with? -->

## 2. What stays project-specific

<!-- Which practices need to be adapted per repo or team? -->

## 3. Where each control belongs

| Control | Where it belongs | Why |
|---|---|---|
|  |  |  |

## 4. Ownership and change process

<!-- Who owns the standard? How do teams propose changes? -->

## 5. Rollout plan

<!-- How would you introduce this across several repos? -->

## 6. Not covered in this workshop

<!-- What belongs in a future advanced or enterprise rollout? -->
```

---

## Step 2 — Fill in the plan (~10 min)

Answer the prompts in your own words. Keep it practical: imagine your organisation wants to start next week, not after a six-month platform programme.

### 1. What we will standardise

Write 3-5 defaults every project should start with.

<details>
<summary>Hint: possible answers</summary>

- Every repo has a project `CLAUDE.md` committed to version control.
- Every repo documents its test, lint, and typecheck commands for Claude.
- Every repo has a small deny list for obviously risky commands like force-push and bulk deletion.
- Every repo protects `.claude/settings.json` and `.claude/settings.local.json` from Claude edits.
- Every repo chooses one fast feedback hook, such as tests, linting, or typechecking.

</details>

### 2. What stays project-specific

List the things that should not be copied blindly between repos.

<details>
<summary>Hint: possible answers</summary>

- Architecture notes and domain language in `CLAUDE.md`.
- Test and lint commands.
- Hook commands and when they run.
- Protected paths such as infrastructure, generated code, migrations, or release files.
- Which MCP servers a project actually needs.
- Which files Claude should avoid unless explicitly asked.

</details>

### 3. Where each control belongs

Fill in the table. Use the categories `CLAUDE.md`, project permissions, hooks, MCP config, user/local settings, or future managed policy.

<details>
<summary>Hint: possible answers</summary>

| Control | Where it belongs | Why |
|---|---|---|
| Explain project architecture | `CLAUDE.md` | Claude needs this context while coding |
| Run tests after file edits | Hook | It is an automatic check, not a guideline |
| Deny `git push --force` | Project permissions; later managed policy | Useful team guardrail; may become non-negotiable |
| Approved GitHub access | MCP config plus org policy | Access depends on company security rules |
| Personal tone or planning preference | User/local settings | Should not be forced on the team |
| Protect `.claude/settings.json` | Project permissions | Prevents Claude from weakening repo-local rules |

</details>

### 4. Ownership and change process

Decide who owns the standard and how changes are reviewed.

<details>
<summary>Hint: possible answers</summary>

- A platform, enablement, or engineering-practices group owns the starter standard.
- Product teams own their repo-specific `CLAUDE.md`, hooks, and settings.
- Security reviews changes to permissions, MCP access, and managed policies.
- Changes go through pull requests in a dedicated standards repo.
- Teams can propose improvements after trying the standard in real work.

</details>

### 5. Rollout plan

Write a short rollout plan.

<details>
<summary>Hint: possible answers</summary>

1. Pilot the standard in one repo.
2. Collect friction for one week.
3. Adjust the defaults.
4. Roll out to two or three more repos.
5. Add the standard to new-project setup.
6. Move non-negotiable security controls into managed settings later.

</details>

### 6. Not covered in this workshop

Name the topics that should be handled in the advanced workshop or enterprise rollout.

<details>
<summary>Hint: possible answers</summary>

- Managed settings and OS/device policy deployment.
- Central MCP allowlists and approval workflows.
- Plugin marketplace governance.
- Agent isolation and safe execution environments.
- Data governance: what context agents may access, retain, or send to external systems.
- Audit logging and compliance evidence.
- Exception processes for teams with unusual needs.
- Measuring adoption across many repos.

</details>

---

## Commit and reflect

Commit the plan:

```bash
git add ai-adoption-plan.md
git commit -m "docs: add AI-assisted development adoption plan"
```

Now look back at the module. You combined:

- **CLAUDE.md** for project and team guidance
- **Permissions** for tool-level limits
- **Hooks** for automatic checks
- **MCP thinking** from earlier modules for approved external context
- **An adoption plan** so this becomes a shared organisational process

That is the shift from individual AI usage to organisational AI practice.

---

## Bonus — Sketch your standards repo

If you want to take this further after the workshop, turn your adoption plan into a dedicated standards repository. In a real organisation this would usually be a separate internal repo, not a folder inside a product codebase.

This is a useful next step, but it is not the end of the journey. A standards repo helps smaller teams share good defaults; it does not replace enterprise controls for agent isolation, data governance, central policy enforcement, auditability, or exception handling. Those are covered in greater breadth and depth in the advanced workshop.

One possible structure:

```text
standards-repo/
├── README.md
├── templates/
│   ├── node-service/
│   │   ├── CLAUDE.md
│   │   └── settings.json
│   ├── frontend-app/
│   │   ├── CLAUDE.md
│   │   └── settings.json
│   └── infrastructure/
│       ├── CLAUDE.md
│       └── settings.json
└── rollout.md
```

This can become a final showcase of everything you have learned:

- **CLAUDE.md templates** for repo-specific context, team workflow, verification commands, and protected areas.
- **Settings templates** for baseline permissions, deny rules, hooks, and safe defaults.
- **Commands** for repeatable workflows such as review, test generation, release checks, or PR preparation.
- **Skills** for reusable practices that need instructions, examples, or supporting files.
- **MCP guidance** for which external systems teams may connect to, and what approvals are needed.
- **Rollout notes** for pilot projects, ownership, review process, and how teams propose changes.

<details>
<summary>Hint: what might differ by repo type?</summary>

- `node-service`: test/typecheck commands, API contract rules, logging/error-handling expectations.
- `frontend-app`: design-system rules, accessibility checks, browser test commands, component boundaries.
- `infrastructure`: stricter permissions, plan-before-apply workflow, protected Terraform state and deployment files.

</details>

<details>
<summary>Hint: what belongs in the standards repo README?</summary>

- Who owns the standard.
- How a new project adopts it.
- Which files are copied into each repo.
- Which parts teams must customise.
- Which restrictions are recommendations now but may become managed policy later.
- How teams request exceptions or propose improvements.

</details>

---

## Deliverable

By the end of Exercise 3 you should have:
- `claude-harness/CLAUDE.md` — team standards template with explanatory comments
- `claude-harness/settings.json` — permissions and hooks pre-configured
- `claude-harness/README.md` — adoption guide explaining each decision
- Everything committed to the repo

---

## Reflection questions

- Which parts of your team's AI workflow should be standardised across every repo?
- Which parts must remain project-specific?
- Which rules are important enough to become managed enterprise policy later?
- Who should review changes to the standard?
- How would you know three months from now whether the standard is helping?
