# Exercise 2: Connect to AWS

**Goal:** Replace hardcoded data with real DynamoDB and S3 queries, and implement all four tools.

**Duration:** ~30 minutes

---

## The scenario

The hardcoded data in Exercise 1 verified the plumbing. Now you will connect the server to Apex's actual AWS infrastructure. A setup script creates a pre-populated DynamoDB table and S3 bucket — the same structure Apex's internal platform uses — so you can query real data without standing up a full application environment.

---

## Step 1 — Run the setup script (~5 min)

From the workshop repo root:

```bash
bash scripts/setup-custom-mcp.sh
```

The script creates:
- DynamoDB table `apex-services` — five services with owner, SLA, health status, and on-call contact
- DynamoDB table `apex-deployments` — deployment history per service
- S3 bucket `apex-runbooks-<account-id>` — one markdown runbook per service

At the end it prints the bucket name. Copy it — you will need it in Step 4.

<details>
<summary>Hint: "Unable to locate credentials"</summary>

Run `aws sts get-caller-identity` first. If that fails: run `aws configure`, or `aws sso login --profile <your-profile>` and set `export AWS_PROFILE=<your-profile>`.

</details>

<details>
<summary>Hint: "AccessDenied" during setup</summary>

Your credentials need permission to create DynamoDB tables, put items, create S3 buckets, and put objects. Ask your AWS admin to attach `AmazonDynamoDBFullAccess` and `AmazonS3FullAccess` to your IAM user or role for the duration of the workshop.

</details>

---

## Step 2 — Install AWS SDK packages (~2 min)

From inside the `mcp-server/` directory:

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-sdk/client-s3
```

---

## Step 3 — Implement the full server (~18 min)

Replace `src/index.ts` with the four-tool implementation:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const s3 = new S3Client({})

const SERVICES_TABLE = 'apex-services'
const DEPLOYMENTS_TABLE = 'apex-deployments'
const RUNBOOKS_BUCKET = process.env.RUNBOOKS_BUCKET

if (!RUNBOOKS_BUCKET) {
  console.error('RUNBOOKS_BUCKET environment variable is required')
  process.exit(1)
}

const server = new McpServer({
  name: 'apex-platform',
  version: '1.0.0',
})

server.registerTool(
  'get-service-info',
  {
    description: 'Get owner, SLA, health status, and on-call contact for a named service',
    inputSchema: {
      service_name: z.string().describe('The name of the service, e.g. "payments-api"'),
    },
  },
  async ({ service_name }) => {
    const result = await ddb.send(new GetCommand({
      TableName: SERVICES_TABLE,
      Key: { name: service_name },
    }))
    if (!result.Item) {
      return {
        content: [{
          type: 'text',
          text: `Service "${service_name}" not found. Use list-services to see available services.`,
        }],
      }
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(result.Item, null, 2) }],
    }
  }
)

server.registerTool(
  'list-services',
  {
    description: 'List all services in the Apex service catalog, optionally filtered by team',
    inputSchema: {
      team: z.string().optional().describe('Filter by team name, e.g. "payments" or "platform"'),
    },
  },
  async ({ team }) => {
    const result = await ddb.send(new ScanCommand({
      TableName: SERVICES_TABLE,
      ...(team ? {
        FilterExpression: '#team = :team',
        ExpressionAttributeNames: { '#team': 'team' },
        ExpressionAttributeValues: { ':team': team },
      } : {}),
    }))
    return {
      content: [{ type: 'text', text: JSON.stringify(result.Items ?? [], null, 2) }],
    }
  }
)

server.registerTool(
  'get-runbook',
  {
    description: 'Fetch the runbook for a service',
    inputSchema: {
      service_name: z.string().describe('The name of the service'),
    },
  },
  async ({ service_name }) => {
    try {
      const result = await s3.send(new GetObjectCommand({
        Bucket: RUNBOOKS_BUCKET,
        Key: `${service_name}.md`,
      }))
      const content = await result.Body?.transformToString()
      return {
        content: [{ type: 'text', text: content ?? 'Runbook is empty.' }],
      }
    } catch {
      return {
        content: [{
          type: 'text',
          text: `No runbook found for "${service_name}". Check that the service name is correct.`,
        }],
      }
    }
  }
)

server.registerTool(
  'get-recent-deployments',
  {
    description: 'Get recent deployment history for a service, most recent first',
    inputSchema: {
      service_name: z.string().describe('The name of the service'),
      limit: z.number().optional().describe('Maximum number of deployments to return (default: 5)'),
    },
  },
  async ({ service_name, limit = 5 }) => {
    const result = await ddb.send(new QueryCommand({
      TableName: DEPLOYMENTS_TABLE,
      KeyConditionExpression: 'service = :service',
      ExpressionAttributeValues: { ':service': service_name },
      ScanIndexForward: false,
      Limit: limit,
    }))
    const deployments = result.Items ?? []
    if (deployments.length === 0) {
      return {
        content: [{ type: 'text', text: `No deployments found for "${service_name}".` }],
      }
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(deployments, null, 2) }],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

---

## Step 4 — Pass the bucket name to the server (~2 min)

Update `.mcp.json` in the project root, adding an `env` block with the bucket name from Step 1:

```json
{
  "mcpServers": {
    "apex-platform": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "RUNBOOKS_BUCKET": "apex-runbooks-<your-account-id>"
      }
    }
  }
}
```

---

## Step 5 — Build and reload (~2 min)

```bash
cd mcp-server && npm run build
```

Restart Claude Code to reload the updated server and `.mcp.json`.

---

## Step 6 — Run an incident-response demo (~5 min)

Try this prompt:

> "We have an ongoing incident with the notification-service. Using the apex-platform MCP server: check the service info, look at the recent deployments, and fetch the runbook. Give me a summary of what's going on and what I should do first."

Watch Claude orchestrate across multiple tool calls and synthesise the results. Notice whether it connects the recent deployment to the current degraded health status.

---

## Deliverable

By the end of Exercise 2 you should have:
- A server with all four tools backed by live DynamoDB and S3 data
- `RUNBOOKS_BUCKET` set in `.mcp.json`
- A completed incident-response demo where Claude calls at least three tools in sequence

<details>
<summary>Hint: DynamoDB "ResourceNotFoundException"</summary>

The table does not exist yet. Make sure `setup-custom-mcp.sh` completed successfully — look for "Setup complete" at the end of the output. Check the region: by default the script uses `eu-central-1`. If your AWS profile defaults to a different region, set `AWS_DEFAULT_REGION=eu-central-1` before running the script and before starting Claude Code.

</details>

<details>
<summary>Hint: S3 "NoSuchKey" on every get-runbook call</summary>

Runbook files are named `<service-name>.md` in S3. Check that the setup script put objects in the bucket: `aws s3 ls s3://<your-bucket>/`.

</details>

<details>
<summary>Hint: "RUNBOOKS_BUCKET environment variable is required"</summary>

The server reads `RUNBOOKS_BUCKET` from its own process environment, not from your terminal. It must be in the `env` block of `.mcp.json`. Restart Claude Code after editing `.mcp.json`.

</details>
