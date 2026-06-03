# AI Development Workshop

A hands-on workshop by [superluminar](https://superluminar.io) on using Claude Code as an engineering tool, and not just a chatbot. Participants work with a realistic TypeScript service, run exercises inside a disciplined review loop, and build habits around AI-assisted development that hold up in production codebases.

The workshop is structured as self-contained modules, each ~60 minutes. Content is served through a local web frontend.

---

## For participants

### Before you start

You need these installed:

- **Node.js 20+** — `node --version`
- **Claude Code CLI** — `npm install -g @anthropic-ai/claude-code`, then `claude` to authenticate

Clone the repository, then from the repo root:

```bash
npm install
npm run docs
```

Open **http://localhost:5173** in your browser. Start with the **Setup** module.

---

## For facilitators

Each module has a facilitator guide with learning goals, timing, and common participant issues:

- [Module 1 Facilitator Guide](docs/module-1/facilitator-guide.md) — Claude Code in the Engineering Loop
- [Module 2 Facilitator Guide](docs/module-2/facilitator-guide.md) — From Prompts to Repeatable AI Workflows

The participant-facing workshop frontend is started with `npm run docs` from the repo root. Participants run it locally on their own machines — there is nothing to host or deploy.

---

## For maintainers

### Project structure

```
src/                          # TypeScript ticket-processing service (workshop subject)
test/                         # Vitest tests for the service
docs/
  setup/                      # Setup module shown first in the frontend
  module-1/                   # Module 1 content (exercises, guides)
  module-2/                   # Module 2 content
docs-site/                    # Vite + React frontend that renders the docs
examples/tickets/             # Sample input files for the service
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run service tests (Vitest) |
| `npm run typecheck` | TypeScript strict check |
| `npm run process:example` | Process `examples/tickets/billing-high.json` |
| `npm run docs` | Start the workshop frontend at http://localhost:5173 |

### Adding a module

1. Create `docs/module-N/` with `participant-guide.md`, `facilitator-guide.md`, and `exercises/`
2. Add one entry to the `modules` array in `docs-site/src/config.ts`
3. No other changes needed — routing and navigation update automatically

### Service internals

`processTicket` accepts a raw input object, classifies the ticket by priority, and routes it to a named queue. There is no HTTP server or external dependency — it is a pure TypeScript function.

The starter code has intentional imperfections that participants discover during the exercises:

<details>
<summary>Hint: typing issues</summary>

Look at `src/domain/ticket.ts`. Are all fields typed as precisely as they could be?
Consider: what values are actually valid for `category`? What type should `createdAt` be?
Is `priority` something a caller should provide, or something the service should compute?

</details>

<details>
<summary>Hint: validation and error handling</summary>

What happens when `processTicket` receives an object with missing fields?
Is the caller told what went wrong, or do they have to guess?
Is there a validation library already installed that could help?

</details>

<details>
<summary>Hint: separation of concerns</summary>

Look at `processTicket` in `src/handlers/processTicket.ts`.
How many things does this one function do?
Which parts belong in the domain layer and which belong in the handler?

</details>

<details>
<summary>Hint: the routing bug</summary>

Try running `npm run process:example`. The example is a high-value billing ticket.
Look at the `queue` field in the output. Does that seem right?
Check the routing table in `docs/module-1/README.md` against what the code actually does.

</details>

<details>
<summary>Hint: missing test coverage</summary>

Look at `test/domain/classifier.test.ts`. The billing tests only cover low-value amounts.
What happens to a billing ticket with `amount: 2400`?
Write the test, run it, and see what happens.

</details>

<details>
<summary>Hint: logging inconsistency</summary>

`src/utils/logger.ts` exists. Is it used everywhere it should be?

</details>
