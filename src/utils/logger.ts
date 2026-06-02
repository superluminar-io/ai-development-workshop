export function log(message: string): void {
  console.log(`[ticket-processor] ${message}`)
}

export function logError(message: string, error?: unknown): void {
  console.error(`[ticket-processor] ERROR: ${message}`, error ?? '')
}
