# Exercise 1: Your First Isolated Subagent

**Goal:** Set up the pipeline project, define a read-only `code-auditor` subagent, and run it against the workshop codebase.

**Duration:** ~25 minutes

---

## The scenario

Apex's (a fictional company) engineering team wants to automate code quality reviews on their TypeScript services. Before adding complex routing logic, you are going to build the simplest version of the pipeline: one orchestrator, one specialist subagent, and a clear tool boundary.

---

## Step 1 — Create the project (~5 min)

Inside the workshop repo, create a directory for the pipeline:

```bash
mkdir agent-pipeline
cd agent-pipeline
```

Create `package.json`:

```json
{
  "name": "apex-agent-pipeline",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "pipeline": "tsx src/pipeline.ts"
  },
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.0.0"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true
  }
}
```

Install dependencies and create the source directory:

```bash
npm install
mkdir src
```

---

## Step 2 — Set your API key (~1 min)

The SDK reads `ANTHROPIC_API_KEY` from the environment. If you have not already set it:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## Step 3 — Write the pipeline (~12 min)

Create `src/pipeline.ts`:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

for await (const message of query({
  prompt: `You are orchestrating a code quality review of the Apex ticket processor service.

The codebase is in the current directory. Use the code-auditor agent to examine the
TypeScript source under src/ and test/.

Ask it to identify the main components, note any code quality issues, and flag
any test coverage gaps.

After the review is complete, summarise the findings in 3–5 bullet points.`,
  options: {
    allowedTools: ['Read', 'Glob', 'Grep', 'Agent'],
    agents: {
      'code-auditor': {
        description: 'Analyses TypeScript code quality and structure. Use for codebase reviews.',
        prompt: `You are a senior software engineer specialising in code quality.
Review the TypeScript codebase in the current directory. Look at:
- The overall structure and component responsibilities
- Code quality issues (complexity, coupling, naming, duplication)
- Test coverage gaps
- Any patterns that could be improved

Be specific. Reference file paths and, where relevant, line numbers.`,
        tools: ['Read', 'Glob', 'Grep'],
      }
    }
  }
})) {
  if ('result' in message) {
    console.log(message.result)
  }
}
```

> **What the tool lists do:**
> The orchestrator has `['Read', 'Glob', 'Grep', 'Agent']`. It can read files and invoke subagents, but not write anything.
> The `code-auditor` has `['Read', 'Glob', 'Grep']`. It can only read — no `Edit`, no `Write`, no `Bash`.

---

## Step 4 — Run the pipeline (~5 min)

From inside `agent-pipeline/`:

```bash
npm run pipeline
```

Watch the output. The orchestrator will invoke `code-auditor`, which will read files across `src/` and `test/`. When it finishes, the orchestrator summarises the findings.

> **Expected runtime:** 30–90 seconds depending on model latency.

---

## Step 5 — Observe the isolation (~3 min)

Read back through the output. Notice:

- The `code-auditor` only called `Read`, `Glob`, or `Grep` — never `Write` or `Edit`
- The orchestrator delegated the actual analysis rather than doing it itself

Now try adding `'Write'` to the `code-auditor`'s `tools` array and re-running. Ask it in the prompt to "also write a summary to summary.md". Observe whether it attempts to write, then remove `Write` again.

The tool list is the enforcement mechanism — not the prompt.

---

## Deliverable

By the end of Exercise 1 you should have:
- A working pipeline in `agent-pipeline/src/pipeline.ts`
- The `code-auditor` subagent completing a review with only read-only tools
- The orchestrator printing a bullet-point summary

<details>
<summary>Hint: "Cannot find package '@anthropic-ai/claude-agent-sdk'"</summary>

Make sure you ran `npm install` inside `agent-pipeline/`, not the repo root. Check that `node_modules/@anthropic-ai/claude-agent-sdk` exists.

</details>

<details>
<summary>Hint: "Must use import to load ES module"</summary>

The pipeline uses top-level `await` and ESM imports. Check that `package.json` has `"type": "module"` and `tsconfig.json` has `"module": "NodeNext"`. If using a different runner, ensure it supports ESM.

</details>

<details>
<summary>Hint: The pipeline hangs without output</summary>

Check that `ANTHROPIC_API_KEY` is set in the same terminal session where you run `npm run pipeline`. The SDK will hang — not error — if the key is missing or invalid.

</details>

<details>
<summary>Hint: The subagent prompt says "write a summary" but nothing was written</summary>

That is expected when `Write` is not in the subagent's `tools` array. The model may acknowledge it cannot write, or it may simply not attempt it. The tool list is enforced by the SDK before any model output — the model receives only the tools it is allowed.

</details>
