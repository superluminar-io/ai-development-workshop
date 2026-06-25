# Exercise 1: Scaffold a Local MCP Server

**Goal:** Create a TypeScript MCP server with one tool backed by hardcoded data, connect it to Claude Code, and verify Claude can call it.

**Duration:** ~20 minutes

---

## The scenario

Before connecting to AWS, you are going to build the server skeleton with hardcoded data. This lets you verify the plumbing works — tool definitions, Claude Code configuration, and the call/response cycle — without writing any AWS code yet.

---

## Step 1 — Create the project (~5 min)

Inside the workshop repo, create a directory for the server:

```bash
mkdir mcp-server
cd mcp-server
```

Create `package.json`:

```json
{
  "name": "apex-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
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
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```

Install dependencies and create the source directory:

```bash
npm install
mkdir src
```

---

## Step 2 — Implement the first tool (~8 min)

Create `src/index.ts`:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'apex-platform',
  version: '1.0.0',
})

const SERVICES: Record<string, { team: string; owner: string; sla: string; status: string }> = {
  'payments-api': {
    team: 'payments',
    owner: 'alice@apex.io',
    sla: '99.99%',
    status: 'healthy',
  },
  'auth-service': {
    team: 'platform',
    owner: 'bob@apex.io',
    sla: '99.9%',
    status: 'healthy',
  },
  'notification-service': {
    team: 'platform',
    owner: 'carol@apex.io',
    sla: '99.5%',
    status: 'degraded',
  },
}

server.registerTool(
  'get-service-info',
  {
    description: 'Get owner, SLA, health status, and team for a named service',
    inputSchema: {
      service_name: z.string().describe('The name of the service, e.g. "payments-api"'),
    },
  },
  async ({ service_name }) => {
    const service = SERVICES[service_name]
    if (!service) {
      return {
        content: [{
          type: 'text',
          text: `Service "${service_name}" not found. Available: ${Object.keys(SERVICES).join(', ')}`,
        }],
      }
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ name: service_name, ...service }, null, 2),
      }],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

> **Important:** Never use `console.log()` in a stdio MCP server. The server communicates with Claude over stdout — any output to stdout outside the JSON-RPC protocol breaks the connection. Use `console.error()` if you need to debug.

---

## Step 3 — Build the server (~2 min)

From inside `mcp-server/`:

```bash
npm run build
```

Expected: a `dist/` directory containing `index.js`. Fix any TypeScript errors before continuing.

---

## Step 4 — Connect to Claude Code (~3 min)

Create `.mcp.json` in the **project root** (not inside `mcp-server/`):

```json
{
  "mcpServers": {
    "apex-platform": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"]
    }
  }
}
```

Restart Claude Code to pick up the new configuration. Then verify:

> "What MCP servers do you have access to?"

Expected: Claude lists `apex-platform`.

---

## Step 5 — Verify Claude can call the tool (~5 min)

Ask:

> "Using the apex-platform MCP server, what can you tell me about the payments-api service?"

Expected: Claude calls `get-service-info` and returns the owner, SLA, and status.

Then ask:

> "Which of Apex's services are currently degraded?"

Watch how Claude decides which tool to call and with what arguments to answer a question you did not phrase as a direct tool invocation.

---

## Deliverable

By the end of Exercise 1 you should have:
- A compiled TypeScript MCP server at `mcp-server/dist/index.js`
- `.mcp.json` at the project root connecting Claude to the server
- Claude successfully calling `get-service-info` and returning data

<details>
<summary>Hint: Claude says it has no MCP servers</summary>

`.mcp.json` must be in the project root — the same directory where you run `claude`. Restart Claude Code after creating or editing the file.

</details>

<details>
<summary>Hint: "Cannot find module" when Claude calls the tool</summary>

Check that you ran `npm run build` inside `mcp-server/` and that `mcp-server/dist/index.js` exists.

</details>

<details>
<summary>Hint: TypeScript compilation errors</summary>

With `"module": "NodeNext"`, imports of local files need `.js` extensions even in TypeScript source (the compiled output uses the same path). If you get module resolution errors, check your import paths. The top-level `await server.connect(transport)` requires `"target": "ES2022"` or later.

</details>
