# Exercise 2: Pipeline with Hooks

**Goal:** Add a second specialist subagent, then write two hooks — an audit logger and an output boundary enforcer.

**Duration:** ~25 minutes

---

## What you are adding

By the end of this exercise your pipeline will have:

- A `security-scanner` subagent alongside the `code-auditor`
- A `PostToolUse` hook that writes every tool call to `output/audit.log`
- A `PreToolUse` hook that blocks any write operation outside `output/`

---

## Step 1 — Create the output directory (~1 min)

The pipeline needs a designated output directory. Add this at the top of `src/pipeline.ts`, before the `query()` call:

```typescript
import { mkdir, appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'

await mkdir('./output', { recursive: true })
```

Update the imports at the top of the file so they read:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'
import { mkdir, appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'
```

---

## Step 2 — Add the security-scanner subagent (~5 min)

Add a second agent entry inside the `agents` object, alongside `code-auditor`:

```typescript
'security-scanner': {
  description: 'Checks for security vulnerabilities. Use for security-focused code reviews.',
  prompt: `You are a security specialist reviewing TypeScript code.
Look for:
- Input validation gaps (missing checks on external data)
- Injection risks (command injection, path traversal)
- Hardcoded secrets or credentials in source files
- Error handling that exposes internal details
- Overly broad permissions or missing authorisation checks

Reference specific file paths and line numbers. Do not suggest fixes — report findings only.`,
  tools: ['Read', 'Glob', 'Grep'],
},
```

Update the orchestrator prompt so it invokes both agents:

```typescript
prompt: `You are orchestrating a code quality review of the Apex ticket processor service.

The codebase is in the current directory.

1. Use the code-auditor agent to review the code quality under src/ and test/.
2. Use the security-scanner agent to check for security issues in src/.

After both agents complete, print a combined summary with two sections:
- Code quality findings (from code-auditor)
- Security findings (from security-scanner)`,
```

Also add `'Write'` to the orchestrator's `allowedTools` — the orchestrator will need it in Exercise 3:

```typescript
allowedTools: ['Read', 'Glob', 'Grep', 'Write', 'Agent'],
```

Run the pipeline to confirm both agents work before adding hooks:

```bash
npm run pipeline
```

---

## Step 3 — Write the audit logger (~8 min)

Now add the hooks. Add the following above the `query()` call (but after the `mkdir`):

```typescript
const outputBoundary = resolve('./output')

// TODO: implement the audit logger
// It should write one JSON line per tool call to output/audit.log.
// Each line should include: timestamp, which agent fired the call, and the tool name.
//
// Use: appendFile('./output/audit.log', entry + '\n')
// The hook input has: input.tool_name, input.agent_type (undefined if orchestrator)
// Return {} to allow the action through unchanged.

const auditLogger = async (input: any): Promise<any> => {
  // your code here
  return {}
}
```

Implement `auditLogger` so it appends one JSON line to `output/audit.log` per tool call. The line should include at minimum the timestamp, the agent that made the call, and the tool name.

Then wire it in — add a `hooks` key to the `options` object:

```typescript
hooks: {
  PostToolUse: [{ hooks: [auditLogger] }],
},
```

Run the pipeline and inspect `output/audit.log` when it finishes. You should see one entry per tool call, including calls from inside the subagents.

<details>
<summary>Reference implementation</summary>

```typescript
const auditLogger = async (input: any): Promise<any> => {
  const entry = JSON.stringify({
    ts: new Date().toISOString(),
    agent: input.agent_type ?? 'orchestrator',
    tool: input.tool_name,
  })
  await appendFile('./output/audit.log', entry + '\n').catch(() => {})
  return {}
}
```

</details>

---

## Step 4 — Write the output boundary enforcer (~8 min)

Add a second hook:

```typescript
// TODO: implement the output boundary enforcer.
// It should block any Write or Edit call where the target file is outside output/.
//
// The tool input has: input.tool_input?.file_path (the path the agent wants to write to)
// Use resolve() to get the absolute path, then check if it starts with outputBoundary + '/'.
//
// To block: return { hookSpecificOutput: { hookEventName: 'PreToolUse',
//   permissionDecision: 'deny', permissionDecisionReason: '...' } }
// To allow: return {}

const enforceOutputBoundary = async (input: any): Promise<any> => {
  // your code here
  return {}
}
```

Wire it into the hooks config alongside the audit logger:

```typescript
hooks: {
  PostToolUse: [{ hooks: [auditLogger] }],
  PreToolUse: [{ matcher: 'Write|Edit', hooks: [enforceOutputBoundary] }],
},
```

To test that the hook fires, temporarily add a write step to the orchestrator prompt:

```
After the summary, also write the summary to src/REVIEW.md.
```

Run the pipeline. The hook should block the write and the orchestrator should see a denial message. Remove the test instruction from the prompt when you are satisfied.

<details>
<summary>Reference implementation</summary>

```typescript
const enforceOutputBoundary = async (input: any): Promise<any> => {
  const filePath = input.tool_input?.file_path as string | undefined
  if (!filePath) return {}
  const resolved = resolve(filePath)
  if (!resolved.startsWith(outputBoundary + '/') && resolved !== outputBoundary) {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Write outside output/ blocked. Attempted: ${filePath}`,
      }
    }
  }
  return {}
}
```

</details>

---

## Deliverable

By the end of Exercise 2 you should have:
- Both `code-auditor` and `security-scanner` running in sequence
- `output/audit.log` populated with one entry per tool call, including subagent calls
- A write outside `output/` blocked by the `PreToolUse` hook

<details>
<summary>Hint: audit.log is empty</summary>

Check that `PostToolUse` is spelled correctly in the `hooks` object (it is case-sensitive). Also confirm the `auditLogger` function is not throwing — the `.catch(() => {})` swallows errors from `appendFile`, so add a `console.error` inside the catch temporarily to debug.

</details>

<details>
<summary>Hint: The boundary hook fires but does not block</summary>

The denial response requires the exact structure: `hookSpecificOutput.hookEventName` must be `'PreToolUse'` (not `'preToolUse'` or another casing) and `permissionDecision` must be `'deny'`. Returning `{}` always allows.

</details>

<details>
<summary>Hint: Hook input fields</summary>

For `PostToolUse`: `input.hook_event_name`, `input.tool_name`, `input.tool_input`, `input.tool_result`, `input.agent_type` (string if inside a subagent, otherwise undefined).

For `PreToolUse`: same fields, but `input.tool_result` is not set (the tool has not run yet).

</details>
