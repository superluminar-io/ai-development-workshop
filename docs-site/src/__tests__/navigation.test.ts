import { describe, it, expect } from 'vitest'
import { getNextPage } from '../utils/navigation'
import type { Module } from '../config'

const makeModule = (id: string, exerciseSlugs: string[] = []): Module => ({
  id,
  number: '01',
  title: 'T',
  description: 'd',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: exerciseSlugs.map((slug) => ({
    slug,
    title: slug,
    file: `/docs/${id}/exercises/${slug}.md`,
  })),
  level: 'foundations',
  audience: 'engineer',
})

const modules: Module[] = [
  makeModule('setup'),
  makeModule('module-1', ['ex-1', 'ex-2']),
  makeModule('module-2', ['ex-3']),
]

describe('getNextPage', () => {
  it('from setup participant-guide → module-1 participant-guide', () => {
    expect(getNextPage(modules, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'participant-guide',
    })
  })

  it('from module-1 participant-guide → module-1 ex-1', () => {
    expect(getNextPage(modules, 'module-1', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'ex-1',
    })
  })

  it('from module-1 ex-1 → module-1 ex-2', () => {
    expect(getNextPage(modules, 'module-1', 'ex-1')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'ex-2',
    })
  })

  it('from module-1 ex-2 (last exercise of module) → module-2 participant-guide', () => {
    expect(getNextPage(modules, 'module-1', 'ex-2')).toEqual({
      kind: 'module',
      moduleId: 'module-2',
      pageSlug: 'participant-guide',
    })
  })

  it('from module-2 ex-3 (last page of last module) → summary', () => {
    expect(getNextPage(modules, 'module-2', 'ex-3')).toEqual({ kind: 'summary' })
  })

  it('from a module with no exercises → next module participant-guide', () => {
    const mods: Module[] = [makeModule('setup'), makeModule('module-1', ['ex-1'])]
    expect(getNextPage(mods, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-1',
      pageSlug: 'participant-guide',
    })
  })

  it('returns null for an unknown moduleId/pageSlug combination', () => {
    expect(getNextPage(modules, 'does-not-exist', 'participant-guide')).toBeNull()
  })

  it('skips modules with status coming-soon', () => {
    const mods: Module[] = [
      makeModule('setup'),
      { ...makeModule('module-1'), status: 'coming-soon' },
      makeModule('module-2', ['ex-1']),
    ]
    expect(getNextPage(mods, 'setup', 'participant-guide')).toEqual({
      kind: 'module',
      moduleId: 'module-2',
      pageSlug: 'participant-guide',
    })
  })
})
