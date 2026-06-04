export type Ticket = {
  id: string
  subject: string
  body: string
  category: string       // should be: 'support' | 'billing' | 'incident' | 'security'
  customerId: string
  amount?: number
  createdAt: string      // should be: Date
  priority?: string      // should not be an input field — it should be computed
  vipTier?: string       // should be: 'gold' | 'platinum'
}

export type TicketResult = {
  ticketId: string
  priority: string
  queue: string
  processedAt: string
}
