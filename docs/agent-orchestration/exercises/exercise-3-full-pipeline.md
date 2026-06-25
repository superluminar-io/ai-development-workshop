# Exercise 3: Full Pipeline and Production Patterns

**Goal:** Add a `report-writer` subagent that synthesises findings into a structured report, then compare SDK-level isolation to AWS Bedrock infrastructure-level isolation.

**Duration:** ~20 minutes

---

## Step 1 — Add the report-writer subagent (~10 min)

The `report-writer` is different from the two auditors: it needs `Write` access to produce a report file. The output boundary hook from Exercise 2 already ensures any write stays inside `output/` — so you can safely give it `Write` without it being able to touch source code.

Add a third agent to the `agents` object:

```typescript
'report-writer': {
  description: 'Writes the final review report. Use after both auditors have completed.',
  prompt: `You produce structured technical reports.
You will be given findings from a code quality review and a security review.
Write a well-formatted markdown report to output/report.md covering both sets of findings.

Structure the report with:
- An executive summary (2–3 sentences)
- A "Code Quality" section with numbered findings
- A "Security" section with numbered findings
- A "Recommended next steps" section

Write only to output/report.md. Do not read or modify any source files.`,
  tools: ['Write'],
},
```

> **Why only `Write`?** The report-writer receives the findings as part of its prompt — the orchestrator passes them in when invoking the `Agent` tool. It does not need to read any files itself.

Update the orchestrator prompt to chain all three agents and pass findings to the report-writer:

```typescript
prompt: `You are orchestrating a code quality review of the Apex ticket processor service.

The codebase is in the current directory.

1. Use the code-auditor agent to review the code quality under src/ and test/.
2. Use the security-scanner agent to check for security issues in src/.
3. Collect the full output from both agents. Then use the report-writer agent to
   produce a report at output/report.md. Pass it the complete findings from both
   agents in its prompt.

After the report-writer finishes, print the path to the report.`,
```

Run the pipeline:

```bash
npm run pipeline
```

When it completes, verify the report exists:

```bash
cat output/report.md
```

Also check `output/audit.log` — you should see `Write` entries from the `report-writer`, and all the `Read`/`Glob`/`Grep` entries from the two auditors. Every tool call from every agent is logged.

---

## Step 2 — Verify the boundary holds (~3 min)

The `report-writer` has `Write` in its tools, but the output boundary hook is still active. Test that the boundary still blocks it from writing outside `output/`.

Temporarily add this instruction to the `report-writer` prompt:

```
Also save a copy to src/REPORT.md.
```

Run the pipeline. The hook should block the write to `src/REPORT.md` even though the `report-writer` has `Write` in its tools. Remove the instruction when confirmed.

The enforcement is in the hook, not in the agent definition — the tool list says *what kind of action*, the hook says *within what scope*.

---

## Step 3 — SDK isolation vs Bedrock isolation (~7 min)

Read this section, then discuss with your pair or group.

### What the SDK gives you

The Claude Agent SDK enforces isolation inside your Node.js process:

- `tools` arrays restrict which Claude tools a subagent can call
- `PreToolUse` hooks intercept calls before they execute
- Both are enforced by the SDK runtime, not by the model

This is **application-level isolation**. It is fast to iterate on and easy to test locally. The constraint is that the enforcement runs in the same process as your code — a bug in your hook, a misconfigured `tools` array, or a future SDK version change could affect the isolation.

### What Bedrock gives you

Amazon Bedrock Agents takes a different approach: each agent is a distinct managed resource with its own IAM execution role. To connect an agent to a database, you create an action group backed by a Lambda function — and that Lambda has only the IAM permissions it needs. A collaborator agent cannot exceed its IAM role regardless of what its prompt says.

The supervisor + collaborator pattern in Bedrock maps directly to what you built here:

| SDK concept | Bedrock concept |
|-------------|-----------------|
| `agents` object entry | Collaborator Agent resource |
| `tools` array | IAM policy on the execution role |
| `PreToolUse` hook | IAM deny policy (enforced by AWS) |
| `allowedTools` on orchestrator | Supervisor agent action groups |

### When to use which

Use the **Agent SDK** for:
- Local development and prototyping
- Pipelines you run on your own infrastructure
- Scenarios where you want code-level control over the orchestration logic

Use **Bedrock** for:
- Production pipelines where you need infra-level permission enforcement
- Multi-team environments where agents are owned by different teams
- Compliance requirements that mandate IAM-enforced access control

### Optional: run the SDK against Bedrock

If you have AWS credentials configured, you can run the same SDK code through Bedrock instead of the Anthropic API directly. Set two environment variables before running:

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_DEFAULT_REGION=eu-central-1   # or your region
npm run pipeline
```

The orchestration logic and hooks are identical — only the underlying API call changes.

---

## Deliverable

By the end of Exercise 3 you should have:
- `output/report.md` containing a structured review from the `report-writer`
- `output/audit.log` containing entries from all three subagents
- The output boundary hook blocking a write outside `output/` even for the `report-writer`
- A clear mental model of where SDK isolation ends and infrastructure isolation begins

<details>
<summary>Hint: The report-writer writes nothing</summary>

Check that `'Write'` is in the `report-writer`'s `tools` array (capital W, matching the Claude tool name exactly). Also check that `output/` exists — `mkdir` should have created it at startup.

</details>

<details>
<summary>Hint: The report-writer produces a good report but the orchestrator doesn't print the path</summary>

This is an orchestrator prompt issue — Claude may have printed the report content rather than the path. Update the final instruction to say "print only the path `output/report.md`" to constrain the output.

</details>

<details>
<summary>Hint: CLAUDE_CODE_USE_BEDROCK=1 gives a credentials error</summary>

The SDK uses the standard AWS credential chain. Run `aws sts get-caller-identity` to confirm credentials are configured. If using SSO: `aws sso login --profile <profile>` first.

</details>
