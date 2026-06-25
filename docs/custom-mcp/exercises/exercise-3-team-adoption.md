# Exercise 3: Make It Team-Ready

**Goal:** Commit the server to the repo so teammates get the same tools automatically, write a reusable slash command for incident response, and discuss what production deployment looks like.

**Duration:** ~20 minutes

---

## The scenario

Right now only you have this MCP server running. Your `.mcp.json` references the compiled server at `mcp-server/dist/index.js`, but `dist/` should not be committed — it is build output. Teammates who clone the repo need to run `npm install` and `npm run build` once after cloning; after that they get the same four tools with no additional setup.

---

## Step 1 — Prepare the server for version control (~5 min)

Add a `.gitignore` inside `mcp-server/`:

```
node_modules/
dist/
```

Verify the files you will commit:

```bash
git status mcp-server/
```

Expected: `mcp-server/package.json`, `mcp-server/tsconfig.json`, `mcp-server/src/index.ts` are shown as new files. `node_modules/` and `dist/` should not appear.

`.mcp.json` at the project root also belongs in the repo — it is the shared team configuration. Your teammates will need the same `RUNBOOKS_BUCKET` value; the bucket is shared, so the value is identical for everyone.

---

## Step 2 — Write the `/incident-check` command (~10 min)

Create `.claude/commands/incident-check.md`:

```markdown
You are helping an on-call engineer diagnose a production incident at Apex (a fictional company).

The engineer has reported an issue with: $ARGUMENTS

Using the apex-platform MCP server, do the following in order:
1. Call `get-service-info` to get the current owner, SLA, health status, and on-call contact.
2. Call `get-recent-deployments` to get the last 5 deployments. Note whether any were in the last 24 hours.
3. Call `get-runbook` to fetch the recovery runbook for the service.

Then produce an incident summary in this format:

## Incident Summary

**Service:** [name]
**Owner:** [email]
**SLA:** [value]
**Current status:** [healthy / degraded / down]
**On-call:** [email]

## Recent Deployments

[Table: timestamp | version | deployed by | change summary]

## Runbook

[Full runbook content]

## Recommended first steps

Based on the runbook and deployment history, list 2–3 specific steps the engineer should take immediately.
```

Test the command:

```
/incident-check notification-service
```

Iterate on the output. If the recommended steps are vague, tighten the prompt — add explicit criteria for what "specific" means, or tell Claude to prioritise runbook steps over general advice.

---

## Step 3 — Discuss: from local to production (~5 min)

This server runs as a local stdio process — every engineer has their own copy. That works well for individual use but creates two problems at scale:

**Credential distribution:** each engineer needs AWS credentials that can read the DynamoDB tables and S3 bucket. For read-only access this is manageable with a scoped IAM policy; for write access it becomes harder to govern.

**Version drift:** if you update a tool definition, every engineer needs to rebuild. With a deployed HTTP server, everyone gets the new version immediately.

The production pattern is to deploy the server to Lambda or ECS and expose it over HTTP transport. Claude Code supports `"type": "http"` in `.mcp.json` — no local process at all. Authentication is a Bearer token in the `headers` field, identical to the GitHub MCP server you configured in Module 2.

The server code you wrote in Exercises 1 and 2 would deploy unchanged. The only difference is the transport: swap `StdioServerTransport` for a Streamable HTTP handler, deploy behind an API Gateway or Application Load Balancer, and update `.mcp.json` to point at the URL.

---

## Deliverable

By the end of Exercise 3 you should have:
- `mcp-server/` ready to commit (source only, no `dist/` or `node_modules/`)
- `.mcp.json` at the project root with `RUNBOOKS_BUCKET` configured
- A `/incident-check` command that produces a structured incident summary when given a service name
