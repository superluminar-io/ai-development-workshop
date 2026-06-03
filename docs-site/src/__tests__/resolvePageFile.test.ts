import { describe, it, expect } from 'vitest'
import { resolvePageFile } from '../utils/resolvePageFile'
import type { Module } from '../config'

const mod: Module = {
  id: 'module-1',
  number: '01',
  title: 'Test Module',
  description: 'desc',
  status: 'ready',
  participantGuide: '/docs/module-1/participant-guide.md',
  exercises: [
    {
      slug: 'exercise-1-orientation',
      title: 'Orientation',
      file: '/docs/module-1/exercises/exercise-1-orientation.md',
    },
    {
      slug: 'exercise-2-refactoring',
      title: 'Refactoring',
      file: '/docs/module-1/exercises/exercise-2-refactoring.md',
    },
  ],
}

describe('resolvePageFile', () => {
  it('returns participantGuide for "participant-guide" slug', () => {
    expect(resolvePageFile(mod, 'participant-guide')).toBe('/docs/module-1/participant-guide.md')
  })

  it('returns exercise file for a known exercise slug', () => {
    expect(resolvePageFile(mod, 'exercise-1-orientation')).toBe(
      '/docs/module-1/exercises/exercise-1-orientation.md',
    )
  })

  it('returns null for an unknown slug', () => {
    expect(resolvePageFile(mod, 'does-not-exist')).toBeNull()
  })
})
