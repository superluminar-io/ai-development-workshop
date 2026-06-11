import type { Module } from '../config'

export type NextPage =
  | { kind: 'module'; moduleId: string; pageSlug: string; title: string }
  | { kind: 'summary' }

export function getNextPage(
  modules: Module[],
  moduleId: string,
  pageSlug: string
): NextPage | null {
  const ready = modules.filter((m) => m.status === 'ready')

  const pages: Array<{ moduleId: string; pageSlug: string; title: string }> = []
  for (const m of ready) {
    pages.push({ moduleId: m.id, pageSlug: 'participant-guide', title: m.title })
    for (const ex of m.exercises) {
      pages.push({ moduleId: m.id, pageSlug: ex.slug, title: ex.title })
    }
  }

  const idx = pages.findIndex((p) => p.moduleId === moduleId && p.pageSlug === pageSlug)
  if (idx === -1) return null
  if (idx === pages.length - 1) return { kind: 'summary' }
  return { kind: 'module', ...pages[idx + 1] }
}
