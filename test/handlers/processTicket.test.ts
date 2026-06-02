import { describe, it, expect } from 'vitest'
import { processTicket } from '../../src/handlers/processTicket'

describe('processTicket', () => {
  it('returns undefined when id is missing', () => {
    expect(processTicket({ subject: 'Test', category: 'support' })).toBeUndefined()
  })

  it('returns undefined when subject is missing', () => {
    expect(processTicket({ id: 'T-001', category: 'support' })).toBeUndefined()
  })

  it('returns undefined when category is missing', () => {
    expect(processTicket({ id: 'T-001', subject: 'Test' })).toBeUndefined()
  })

  it('processes a valid support ticket', () => {
    const result = processTicket({
      id: 'T-001',
      subject: 'Cannot log in',
      body: 'Login broken since this morning',
      category: 'support',
      customerId: 'C-001',
      createdAt: '2026-06-01T09:00:00Z',
    })

    expect(result).toBeDefined()
    expect(result?.ticketId).toBe('T-001')
    expect(result?.priority).toBe('medium')
    expect(result?.queue).toBe('standard-queue')
    expect(result?.processedAt).toBeDefined()
  })

  it('processes a low-value billing ticket', () => {
    const result = processTicket({
      id: 'T-002',
      subject: 'Wrong charge',
      body: 'Incorrect charge on invoice',
      category: 'billing',
      customerId: 'C-002',
      amount: 85,
      createdAt: '2026-06-01T10:00:00Z',
    })

    expect(result?.queue).toBe('billing-queue')
    expect(result?.priority).toBe('medium')
  })

  it('processes an incident ticket', () => {
    const result = processTicket({
      id: 'T-003',
      subject: 'Database down',
      body: 'All writes failing',
      category: 'incident',
      customerId: 'C-003',
      createdAt: '2026-06-01T11:00:00Z',
    })

    expect(result?.queue).toBe('escalation-queue')
    expect(result?.priority).toBe('high')
  })
})
