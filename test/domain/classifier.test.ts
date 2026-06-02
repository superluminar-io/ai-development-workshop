import { describe, it, expect } from 'vitest'
import { classifyPriority, routeTicket } from '../../src/domain/classifier'
import type { Ticket } from '../../src/domain/ticket'

const base: Ticket = {
  id: 'T-001',
  subject: 'Test',
  body: 'Test body',
  category: 'support',
  customerId: 'C-001',
  createdAt: '2026-06-01T00:00:00Z',
}

describe('classifyPriority', () => {
  it('returns high for incident tickets', () => {
    const ticket: Ticket = { ...base, category: 'incident' }
    expect(classifyPriority(ticket)).toBe('high')
  })

  it('returns escalate for security tickets', () => {
    const ticket: Ticket = { ...base, category: 'security' }
    expect(classifyPriority(ticket)).toBe('escalate')
  })

  it('returns medium for low-value billing tickets', () => {
    const ticket: Ticket = { ...base, category: 'billing', amount: 500 }
    expect(classifyPriority(ticket)).toBe('medium')
  })

  it('returns medium for support tickets', () => {
    expect(classifyPriority(base)).toBe('medium')
  })
})

describe('routeTicket', () => {
  it('routes incident tickets to escalation-queue', () => {
    const ticket: Ticket = { ...base, category: 'incident' }
    expect(routeTicket(ticket)).toBe('escalation-queue')
  })

  it('routes security tickets to escalation-queue', () => {
    const ticket: Ticket = { ...base, category: 'security' }
    expect(routeTicket(ticket)).toBe('escalation-queue')
  })

  it('routes low-value billing tickets to billing-queue', () => {
    const ticket: Ticket = { ...base, category: 'billing', amount: 200 }
    expect(routeTicket(ticket)).toBe('billing-queue')
  })

  it('routes support tickets to standard-queue', () => {
    expect(routeTicket(base)).toBe('standard-queue')
  })
})
