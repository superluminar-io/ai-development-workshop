import { classifyPriority, routeTicket } from '../domain/classifier'
import type { Ticket, TicketResult } from '../domain/ticket'

export function processTicket(input: Record<string, unknown>): TicketResult | undefined {
  if (!input.id || !input.subject || !input.category) {
    return undefined
  }

  const ticket: Ticket = {
    id: String(input.id),
    subject: String(input.subject),
    body: String(input.body ?? ''),
    category: String(input.category),
    customerId: String(input.customerId ?? ''),
    amount: typeof input.amount === 'number' ? input.amount : undefined,
    createdAt: String(input.createdAt ?? new Date().toISOString()),
    priority: input.priority !== undefined ? String(input.priority) : undefined,
  }

  const priority = classifyPriority(ticket)
  const queue = routeTicket(ticket)

  console.log(`Processing ticket ${ticket.id} — priority: ${priority}, queue: ${queue}`)

  return {
    ticketId: ticket.id,
    priority,
    queue,
    processedAt: new Date().toISOString(),
  }
}
