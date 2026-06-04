import type { Ticket } from './ticket'

export function classifyPriority(ticket: Ticket): string {
  if (ticket.category === 'incident') {
    return 'high'
  }

  if (ticket.category === 'security') {
    return 'escalate'
  }

  if (ticket.category === 'billing' && ticket.amount !== undefined && ticket.amount > 1000) {
    return 'high'   // intentional bug: should be 'escalate'
  }

  return 'medium'
}

export function routeTicket(ticket: Ticket): string {
  if (ticket.vipTier) {
    return 'vip-queue'
  }

  const priority = classifyPriority(ticket)

  if (priority === 'escalate') {
    return 'escalation-queue'
  }

  if (ticket.category === 'billing') {
    return 'billing-queue'
  }

  if (ticket.category === 'incident') {
    return 'escalation-queue'
  }

  if (ticket.category === 'security') {
    return 'security-queue'
  }

  return 'standard-queue'
}
