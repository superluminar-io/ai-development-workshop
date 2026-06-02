import { readFileSync } from 'fs'
import { processTicket } from './handlers/processTicket'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: tsx src/index.ts <path-to-ticket.json>')
  process.exit(1)
}

let raw: Record<string, unknown>

try {
  raw = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, unknown>
} catch {
  console.error(`Failed to read or parse file: ${filePath}`)
  process.exit(1)
}

const result = processTicket(raw)

if (!result) {
  console.error('Failed to process ticket: missing required fields (id, subject, category)')
  process.exit(1)
}

console.log(JSON.stringify(result, null, 2))
