# Agent Orchestration and Workload Isolation — Facilitator Guide

---

## Learning goals

By the end of this module participants should be able to:

1. Explain why multi-agent pipelines with scoped tool access are safer than a single agent with full access
2. Define a subagent using the Claude Agent SDK with a restricted `tools` array
3. Write a `PostToolUse` hook that audit-logs tool calls across all agents in a pipeline
4. Write a `PreToolUse` hook that blocks unauthorised write operations
5. Articulate the difference between SDK-level and infrastructure-level (Bedrock IAM) isolation

**The meta-skill:** The principle of least privilege applies to AI agents as much as it does to human operators or service accounts. "Give it only the tools it needs for this task" is a design constraint, not an afterthought.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Intro + concept framing | 5 min |
| Exercise 1 | 25 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 25 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 20 min |
| Wrap-up discussion | 5 min |
| **Total** | **~90 min** |

> If time is short, skip Exercise 3's boundary verification step and the Bedrock discussion. Exercises 1 and 2 cover the core concepts; Exercise 3 is consolidation and context.

---

## Before the session

### Prerequisites to verify

- Node.js 20+ installed: `node --version`
- Each participant has an `ANTHROPIC_API_KEY` — they should have set this up during the setup module, or they can create one at [console.anthropic.com](https://console.anthropic.com)
- The workshop repo cloned locally

No AWS resources are required for Exercises 1 and 2. Exercise 3 mentions Bedrock as an optional extension — verify AWS credentials if participants want to attempt it.

### Test the pipeline yourself

Run through Exercises 1–3 in your own environment before the session. The pipeline takes 30–90 seconds per run depending on model latency — budget for multiple runs.

Confirm that:
- `npm run pipeline` completes with a summary
- `output/audit.log` is created and contains one line per tool call
- A write to `src/REVIEW.md` is blocked by the hook

---

## Live demo recommendations

### At the start (~3 min)

Open with a scenario:

> "You are about to run an AI agent in CI. It has access to Read, Write, Edit, and Bash. What can go wrong?"

Let the room answer. Common answers: it could overwrite files, delete things, run arbitrary commands, exfiltrate secrets. Then say:

> "The fix is not better prompting. It is restricting what the agent can do at the SDK layer — the same way you restrict what a database user can do at the IAM layer."

Show the `tools` array in the code. That is the entire enforcement mechanism for Exercise 1 — two lines of config.

### At the start of Exercise 2 (~1 min)

Point out that hooks fire on every tool call, including calls inside subagents. The `agent_type` field tells you which agent triggered the call. Ask:

> "What would you put in the audit log besides the timestamp and tool name?"

(Session ID, user ID, the tool input — these are all available on `input.tool_input`.)

---

## Common participant mistakes

### `tools` arrays use the wrong tool names

Tool names are case-sensitive: `'Read'`, `'Glob'`, `'Grep'`, `'Write'`, `'Edit'`, `'Bash'`, `'Agent'`. A common mistake is lowercasing them (`'read'`) or using the wrong name (`'Search'` instead of `'Grep'`). The SDK silently ignores unrecognised tool names — the agent simply does not have that tool, which can cause confusing failures.

### `allowedTools` vs `tools`

`allowedTools` is on the root options object and applies to the orchestrator. `tools` is on each agent definition and applies to that subagent. Participants sometimes put both in the wrong place. A useful check: does the orchestrator need `'Agent'` in `allowedTools`? Yes — without it the orchestrator cannot invoke subagents.

### Hooks not firing

The most common cause is a typo in the hook event name. `PostToolUse` and `PreToolUse` are exact strings — check casing. Also check that the `hooks` key is inside `options`, not at the top level of the `query()` call.

### `appendFile` throwing and silently failing

The `auditLogger` in Exercise 2 uses `.catch(() => {})` to swallow errors from `appendFile`. If the `output/` directory does not exist, `appendFile` throws and the log is never written. If participants get an empty `audit.log`, ask them to verify `output/` was created (the `mkdir` at the top of the file creates it).

### PreToolUse denial has wrong structure

The denial return value must match exactly:
```typescript
{
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: '...',
  }
}
```
Any field name misspelling or wrong casing causes the hook to silently allow the action. A useful test: log the return value before returning it to verify the shape.

### `resolve()` produces an unexpected path

`resolve('./output')` is relative to the process working directory, which is `agent-pipeline/`. If participants run the pipeline from a different directory, the path arithmetic breaks. The reliable fix: run `npm run pipeline` from inside `agent-pipeline/`, not the repo root.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What tools did the code-auditor call? How do you know?"
- "What would happen if you removed `'Agent'` from the orchestrator's `allowedTools`?"
- "The subagent prompt says 'be specific, reference line numbers' — did it? What does that tell you about how prompt + tools interact?"

**What good looks like:**
- The `code-auditor` only called `Read`, `Glob`, or `Grep`
- Participants can describe what the orchestrator delegated and what it retained
- At least one participant tried adding `Write` to the subagent and observed the behaviour change

**Teaching point:** The `description` field on the agent definition is what the orchestrator reads to decide *when* to use that agent. The `prompt` is what the agent reads to decide *how* to do its job. Both matter.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Open your `audit.log`. How many entries are there? Which agent made the most calls?"
- "What happens if your `auditLogger` throws an error?"
- "The boundary hook fires on `Write|Edit` — what other tool should it probably also cover?"

**What good looks like:**
- `output/audit.log` has one entry per tool call across both subagents
- Participants noticed that `agent_type` identifies which subagent triggered each entry
- The boundary hook blocked a write to `src/` and the orchestrator received a denial message

**Teaching point:** The `matcher` in a hook spec is a regex run against the tool name. `'Write|Edit'` covers both write-path tools. `'^mcp__'` would match all MCP tools. Hook scope is composable without changing the agent prompts.

---

## Exercise 3 debrief + wrap-up (5 min)

**Ask the group:**
- "The `report-writer` has `Write` in its `tools`. Why does the boundary hook still stop it from writing to `src/`?"
- "What is the difference between `tools: ['Write']` (SDK) and an IAM policy that allows `s3:PutObject` on one bucket?"
- "If you were deploying this pipeline to production, what would you change?"

**What good looks like:**
- `output/report.md` contains a structured report with the two sections
- Participants can articulate that the SDK enforces constraints in the process, while IAM enforces them at the AWS control plane — one can be bypassed by changing code, the other cannot
- At least one participant has a concrete idea of a pipeline they would build at their company

**Teaching point:** SDK isolation is fast to iterate on. Bedrock isolation is harder to bypass. In production you want both: SDK hooks for application logic and auditability, Bedrock/IAM for the hard permissions boundary.

---

## Simplifications if time is short

If you have only 60 minutes:
- **Skip Exercise 3** — the first two exercises cover the core concepts. Exercise 3 is synthesis.
- **Skip the boundary verification** in Exercise 2 — the audit logger alone demonstrates hook concepts.
- **Pre-populate `output/`** so participants do not have to add the `mkdir` and imports themselves — just show them the completed code.

---

## Optional extensions for advanced participants

- Add a `SubagentStop` hook that logs when each subagent completes and how many tool calls it made in total (count by filtering `audit.log` by `agent_type`)
- Modify the `report-writer` so it reads `output/audit.log` and includes a "Tool usage" section in the report showing call counts per agent
- Replace the hardcoded `./src` target with a CLI argument so the pipeline can review any directory
- Deploy the pipeline as a GitHub Actions workflow — export the report as a build artefact and post a summary comment on the PR using the GitHub CLI
- Wire up the pipeline to the custom MCP server from Module 7 so it can pull deployment history and correlate recent changes with the findings
