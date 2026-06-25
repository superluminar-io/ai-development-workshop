# Custom MCP Module Participant Guide

**Building an Internal MCP Server**

---

## When to build your own MCP server

Pre-built MCP servers exist for common tools: GitHub, Slack, Linear, Jira. But most companies have internal systems that no pre-built connector covers — a proprietary service catalog, an internal deployment tracker, a private documentation system. For those, you build your own.

Building a custom MCP server is a small TypeScript project. You declare a set of tools, define what each one accepts as input, and write a handler that calls your internal system. Claude discovers the tools automatically at startup — no prompt engineering required.

The pattern is always the same: define tools, wire them to your data source, connect via stdio or HTTP. Once connected, Claude can call those tools the same way it calls any other — choosing when to use them, chaining them together, and synthesising results into a coherent response.

---

## The scenario

Apex (a fictional company) runs 12 microservices on AWS. When an incident happens, the on-call engineer manually checks three places:

1. An internal wiki to find the service owner and SLA
2. An S3 bucket of runbooks to find recovery steps
3. A deployment dashboard to see what was released recently

You are going to give Claude direct access to all three — backed by real DynamoDB and S3 resources — so instead of checking dashboards, the engineer can describe the problem and Claude has what it needs.

---

## What you will build

A TypeScript MCP server called `apex-platform` with four tools:

- `get-service-info` — owner, team, SLA, and health status for a named service
- `list-services` — all services, optionally filtered by team
- `get-runbook` — the runbook markdown for a service, fetched from S3
- `get-recent-deployments` — deployment history for a service from DynamoDB

---

## What you will do in this module

- **Exercise 1 — Scaffold a local MCP server (~20 min):** Create a TypeScript project, implement one tool with hardcoded data, connect it to Claude Code via `.mcp.json`, and verify Claude can call it.
- **Exercise 2 — Connect to AWS (~30 min):** Run the module setup script to create a pre-populated DynamoDB table and S3 runbooks bucket. Replace your hardcoded data with real AWS SDK calls and run a full incident-response demo.
- **Exercise 3 — Make it team-ready (~20 min):** Commit the server to the repo so teammates get the same tools automatically, write a reusable `/incident-check` slash command, and discuss what production deployment looks like.

---

## Prerequisites

### 1 — Node.js 20+

```bash
node --version
```

Expected: `v20.x.x` or later.

### 2 — AWS CLI configured

```bash
aws sts get-caller-identity
```

Expected: a JSON response with your account ID and ARN. If this fails, run `aws configure` or set `AWS_PROFILE` to a valid profile and run `aws sso login --profile <profile>`.

### 3 — Verify

```bash
npm test
node --version
aws sts get-caller-identity
```

All three should succeed before starting Exercise 1.
