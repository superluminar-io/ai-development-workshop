# Participant Guide: Agent Orchestration and Workload Isolation

---

## Concepts

### Why multiple agents?

A single agent with access to all tools is powerful but unpredictable — it can read, write, delete, and execute in whatever order it chooses. For automated pipelines, this is a problem. You want each step to do one thing, with access to only the tools that step requires.

Multi-agent architectures solve this by splitting work across specialist agents, each with a minimal toolset. A code auditor that can only read files cannot accidentally modify them. A report writer that can only write to `output/` cannot overwrite source code. The constraint is not a limitation — it is the design.

### The Claude Agent SDK

The Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) lets you run Claude programmatically as part of a larger system. The core function is `query()`, an async generator that drives a Claude agent and yields messages as it works.

You can define subagents inline, each with its own system prompt and restricted tool list:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

for await (const message of query({
  prompt: 'Orchestrate a review of the codebase.',
  options: {
    allowedTools: ['Read', 'Glob', 'Grep', 'Agent'],
    agents: {
      'code-auditor': {
        description: 'Reviews code quality. Use for codebase analysis.',
        prompt: 'You are a code quality specialist. Read files and report issues.',
        tools: ['Read', 'Glob', 'Grep'],  // no Write, no Bash
      }
    }
  }
})) {
  if ('result' in message) console.log(message.result)
}
```

The orchestrator delegates to `code-auditor` by invoking the `Agent` tool. The subagent receives a fresh context — only its own system prompt and the task the orchestrator gives it. It cannot see the orchestrator's conversation history.

### Hooks

Hooks are callbacks that fire at key points in the agent's execution cycle. They let you enforce policy at the application layer without modifying the agent's prompts.

Two hooks are relevant here:

- **`PreToolUse`** — fires before a tool call. You can deny the call by returning a block decision. Use this to enforce boundaries (e.g., block writes outside `output/`).
- **`PostToolUse`** — fires after a tool call returns. You can log the call, add context, or surface the result for audit. The action has already happened.

```typescript
hooks: {
  PreToolUse: [{ matcher: 'Write|Edit', hooks: [enforceOutputBoundary] }],
  PostToolUse: [{ hooks: [auditLogger] }],
}
```

Hooks apply to all tool calls including those made inside subagents. The `agent_type` field on the input tells you which agent triggered the call.

### Workload isolation in production

The Agent SDK enforces isolation inside your Node.js process. A misbehaving agent prompt or a model error could bypass code-level constraints. For production multi-agent systems running on AWS, isolation is enforced at the infrastructure layer:

- Each Amazon Bedrock Agent gets its own IAM execution role
- Permissions are enforced by AWS regardless of what the agent prompts say
- Knowledge bases and action groups are scoped per agent by IAM resource policy

The exercises use the SDK. The third exercise explains where Bedrock fits in and when you would reach for it.

---

## Exercises

- **Exercise 1** — Set up the pipeline project, write the orchestrator, define a read-only `code-auditor` subagent, and run it against the workshop codebase.
- **Exercise 2** — Add a `security-scanner` subagent, then write a `PostToolUse` audit logger and a `PreToolUse` output boundary enforcer.
- **Exercise 3** — Add a `report-writer` subagent with write access, complete the full pipeline, and compare SDK isolation to Bedrock infrastructure-level isolation.

---

## Prerequisites

Before starting:

1. Node.js 20 or later installed — verify with `node --version`
2. The workshop repo cloned locally
3. An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

Set your API key in the terminal before running any exercise:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```
