import type { Module } from '../config'

export function resolvePageFile(module: Module, pageSlug: string): string | null {
  if (pageSlug === 'participant-guide') return module.participantGuide
  const exercise = module.exercises.find((e) => e.slug === pageSlug)
  return exercise?.file ?? null
}
