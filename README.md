# AI Development Workshop — Ticket Processor

A local TypeScript service for processing support tickets. Used in Module 1 of the AI Development Workshop.

## Quick start

```bash
npm install
npm test
npm run typecheck
npm run process:example
```

## What this service does

`processTicket` accepts a raw input object, classifies the ticket by priority, and routes it to a named queue. There is no HTTP server or external dependency — it is a pure TypeScript function you can run and test locally.

## Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests with Vitest |
| `npm run typecheck` | TypeScript strict check |
| `npm run process:example` | Process `examples/tickets/billing-high.json` |

## Project structure

```
src/
  domain/         # ticket types and routing logic
  handlers/       # input parsing and main handler function
  utils/          # shared utilities
test/             # mirrors src/ structure
examples/tickets/ # sample input files
```

## Workshop exercises

See [docs/module-1/participant-guide.md](docs/module-1/participant-guide.md) to get started.

---

## Hints

The starter code has some intentional imperfections. If you get stuck, expand the hints below.

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
