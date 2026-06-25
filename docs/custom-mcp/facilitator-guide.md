# Custom MCP Module Facilitator Guide

**Building an Internal MCP Server**

---

## Learning goals

By the end of this module participants should be able to:

1. Explain what problem a custom MCP server solves compared to using pre-built connectors
2. Scaffold a TypeScript MCP server using `@modelcontextprotocol/sdk` with `registerTool` and Zod schemas
3. Connect a stdio MCP server to Claude Code via `.mcp.json`
4. Replace hardcoded tool responses with live AWS SDK calls (DynamoDB + S3)
5. Commit a team-ready MCP server and explain what production deployment would change

**The meta-skill:** understanding that MCP is not just a library of pre-built connectors — it is a protocol you can implement for any internal system, giving Claude access to data it otherwise cannot reach.

---

## Recommended timing

| Segment | Duration |
|---------|----------|
| Recap of Module 2 + intro | 5 min |
| Live demo | 5 min |
| Exercise 1 | 20 min |
| Debrief Exercise 1 | 5 min |
| Exercise 2 | 30 min |
| Debrief Exercise 2 | 5 min |
| Exercise 3 | 20 min |
| Debrief + wrap-up | 5 min |
| **Total** | **~95 min** |

> If time is short, see **Simplifications** below. This is the longest module in the workshop — budget accordingly.

---

## Before the session

### Prerequisites to verify

- Every participant has AWS credentials configured: `aws sts get-caller-identity` must return valid JSON
- Every participant has permission to create DynamoDB tables and S3 buckets (or ask the facilitator to run the setup script once and share the bucket name)
- Node.js 20+ is installed: `node --version`
- TypeScript is not required to be pre-installed — `npm install` handles it

### Run the setup script yourself first

```bash
bash scripts/setup-custom-mcp.sh
```

Confirm the three resources exist in your AWS account:
- DynamoDB tables `apex-services` and `apex-deployments` are ACTIVE
- S3 bucket `apex-runbooks-<your-account-id>` contains five `.md` files

The setup script is idempotent — running it again skips existing resources. Note the bucket name; participants who cannot create their own resources can use yours (read-only access is sufficient for the exercises).

### The planted incident

The notification-service in the seed data is deliberately `health_status: degraded`, and its most recent deployment is from ~3 hours ago. The runbook for notification-service explains that a deployment in the last 24 hours is the most likely cause of degradation. Exercise 2's demo prompt is designed to surface this — Claude should connect the dots without being told to.

---

## Live demo recommendations

### At the start (~5 min)

Open with the question:

> "What internal systems does your team pull data from manually when something goes wrong?"

Common answers: Slack, internal wiki, deployment history, monitoring dashboards, a homegrown service catalog. Let the room answer, then say:

> "Every one of those is a data source you could expose to Claude — not by writing a prompt with pasted content, but by writing a small MCP server that fetches it directly. That is what this module is about."

Show your completed server live: ask Claude about the notification-service incident, watch it call `get-service-info`, `get-recent-deployments`, and `get-runbook` in sequence. Keep this brief — the value is in building it, not watching it.

### Before Exercise 2 (~1 min)

Remind participants: `RUNBOOKS_BUCKET` goes in the `env` block of `.mcp.json`, not as a shell variable. If it is set in the terminal but not in `.mcp.json`, the server process will not see it.

---

## Common participant mistakes

### Using `console.log()` in the server
The server communicates with Claude over stdout. Any `console.log()` output corrupts the JSON-RPC stream and causes cryptic failures. The error may not appear immediately — Claude may just stop responding. Direct participants to use `console.error()` for any debug output.

### `.mcp.json` in the wrong directory
`.mcp.json` must be in the directory where `claude` is launched — typically the repo root. If a participant puts it inside `mcp-server/`, Claude Code will not find it. The most reliable check: `cat .mcp.json` from the project root should show the server config.

### Not rebuilding after changes
Every change to `src/index.ts` requires `npm run build` inside `mcp-server/`. The most common symptom is Claude calling a tool that should exist but getting "tool not found" or returning stale data. Ask: "Did you rebuild and restart Claude Code?"

### `RUNBOOKS_BUCKET` not in `.mcp.json`
Participants often set this as a shell environment variable and expect the server to pick it up. The server runs as a child process of Claude Code — it only inherits what is in the `env` block of `.mcp.json`.

### AWS credentials not available to the server process
Similar issue: if credentials come from a shell profile (e.g., `~/.aws/config` with SSO), they should be available to the child process. If credentials are set via `export AWS_ACCESS_KEY_ID=...` in the current terminal and the server was started by Claude Code from a different session, the server will not see them. Advise participants to use `~/.aws/config` profile-based credentials rather than shell exports.

---

## Exercise 1 debrief (5 min)

**Ask the group:**
- "What did the `.mcp.json` actually do? What happens without it?"
- "What does `StdioServerTransport` mean — what is Claude sending and receiving?"
- "What happens if you add a `console.log()` to the handler and rebuild?"

**What good looks like:**
- The server compiled and Claude called `get-service-info` without any special prompting
- Participants can explain that the tool *description* is what guides Claude — not the tool name alone

**Teaching point:** The tool description in `registerTool` is not documentation for a human — it is the signal Claude reads to decide when to call the tool and with what arguments. A good description is the difference between Claude using the tool correctly and ignoring it.

---

## Exercise 2 debrief (5 min)

**Ask the group:**
- "Did Claude connect the recent deployment to the degraded status on its own?"
- "What would you have to do to give Claude the same context without MCP?"
- "What internal system in your own company could you connect this way?"

**What good looks like:**
- Claude called all three tools in sequence without being told which to use
- At least one participant noticed that Claude inferred the deployment was the likely cause of degradation
- Participants can name one real internal system they would want to connect

**Teaching point:** Claude is not just calling tools mechanically — it reasons about the outputs. The incident demo works because the runbook and the deployment history together form a coherent picture. This is the same reasoning a senior engineer would apply; Claude does it in seconds.

---

## Exercise 3 debrief (5 min)

**Ask the group:**
- "What needs to happen before a teammate can use this server on their own machine?"
- "What breaks if you update the tool schema but a teammate has an old build?"
- "What is the one thing you would change to move from local to production?"

**What good looks like:**
- Participants understand that `dist/` is build output and should not be committed
- The `/incident-check` command produces a structured summary without requiring the user to specify which tools to call
- Discussion surfaces the HTTP transport as the natural next step

**Teaching point:** A project-level `.mcp.json` is the team-sharing mechanism. It is checked in, it points to a relative path, and every engineer who clones the repo gets the same tools after one build step. This is the equivalent of a shared Makefile or a shared `.eslintrc` — a piece of team automation that travels with the code.

---

## Connecting to the broader workshop arc

**"You have now built all three layers."**

- Layer 1 (assisted-dev): Claude reads your local files and helps you explore, refactor, test, and review
- Layer 2 (mcp): Claude connects to external systems via pre-built MCP servers and brings that context into your process
- Layer 3 (this module): Claude connects to *your own* internal systems via a server you built — data no pre-built connector covers

The incident-response demo is a concrete example of what Layer 3 enables: an engineer who would have spent 10 minutes checking four dashboards now describes the problem and gets a structured summary in 30 seconds.

---

## Simplifications if time is short

If you have only 60 minutes:

- **Skip Exercise 3 entirely.** The team-adoption discussion is valuable but not essential for understanding how custom MCP servers work.
- **Pre-run the setup script** before the session and give participants the bucket name directly, skipping Step 1 of Exercise 2.
- **Stop after Exercise 2** once participants have a working multi-tool demo. The `/incident-check` command can be a take-home exercise.

The non-negotiable steps are: compile a TypeScript server, connect it to Claude Code, and see Claude call a real tool against real AWS data.

---

## Optional extensions for advanced participants

- Add a `create-incident-ticket` write tool that posts to a real or mock ticketing API — discuss the risk surface of write tools vs read-only tools
- Swap `StdioServerTransport` for a Streamable HTTP handler, deploy to Lambda using the AWS CDK, and update `.mcp.json` to `"type": "http"` pointing at the Lambda URL
- Add a `search-runbooks` tool that uses S3 Select or a DynamoDB scan with a filter to find runbooks matching a keyword — compare the query cost to a vector search approach
- Write a second MCP server that connects to a mock Slack API and returns the last 10 messages from an `#incidents` channel — then ask Claude to correlate the Slack thread with the DynamoDB deployment history
