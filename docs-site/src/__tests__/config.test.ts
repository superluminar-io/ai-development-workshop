import { describe, it, expect } from 'vitest'
import { filterModules, assignDisplayNumbers, resolveTracks, filterExercises } from '../config'
import type { Module, Exercise } from '../config'

const makeModule = (id: string): Module => ({
  id,
  number: '01',
  title: 'Test',
  description: 'desc',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: [],
  level: 'foundations',
  audience: 'engineer',
})

const makeExercise = (slug: string, audience?: Exercise['audience']): Exercise => ({
  slug,
  title: slug,
  file: `/docs/ex/${slug}.md`,
  ...(audience ? { audience } : {}),
})

describe('filterModules', () => {
  it('returns only modules whose id appears in the enabled list', () => {
    const all = [makeModule('setup'), makeModule('module-1'), makeModule('module-2')]
    expect(filterModules(all, ['setup', 'module-2'])).toEqual([
      makeModule('setup'),
      makeModule('module-2'),
    ])
  })

  it('returns an empty array when enabled list is empty', () => {
    const all = [makeModule('module-1')]
    expect(filterModules(all, [])).toEqual([])
  })

  it('ignores ids in the enabled list that have no matching module', () => {
    const all = [makeModule('module-1')]
    expect(filterModules(all, ['module-1', 'does-not-exist'])).toEqual([makeModule('module-1')])
  })
})

describe('assignDisplayNumbers', () => {
  it('setup module keeps number 00', () => {
    const mods = [{ ...makeModule('setup'), number: '00' }]
    expect(assignDisplayNumbers(mods)[0].number).toBe('00')
  })

  it('non-setup modules get sequential two-digit numbers from 01', () => {
    const mods = [makeModule('module-1'), makeModule('module-2'), makeModule('module-3')]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['01', '02', '03'])
  })

  it('fills gaps from a sparse selection', () => {
    const mods = [makeModule('module-1'), makeModule('module-2'), makeModule('module-4')]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['01', '02', '03'])
  })

  it('setup in a mixed list does not consume a counter slot', () => {
    const mods = [
      { ...makeModule('setup'), number: '00' },
      makeModule('module-2'),
      makeModule('module-4'),
    ]
    expect(assignDisplayNumbers(mods).map((m) => m.number)).toEqual(['00', '01', '02'])
  })
})

describe('filterExercises', () => {
  it('returns all exercises when audience is "both"', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    expect(filterExercises(exercises, 'both')).toHaveLength(3)
  })

  it('returns engineer and untagged exercises for engineer audience', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    const result = filterExercises(exercises, 'engineer')
    expect(result.map((e) => e.slug)).toEqual(['e1', 'e3'])
  })

  it('returns business and untagged exercises for business audience', () => {
    const exercises = [makeExercise('e1', 'engineer'), makeExercise('e2', 'business'), makeExercise('e3')]
    const result = filterExercises(exercises, 'business')
    expect(result.map((e) => e.slug)).toEqual(['e2', 'e3'])
  })
})

describe('resolveTracks', () => {
  const all = [
    { ...makeModule('setup'), number: '00', audience: 'both' as const },
    makeModule('module-1'),
    makeModule('module-2'),
  ]

  it('treats legacy { modules: [...] } format as a single default track', () => {
    const config = { modules: ['setup', 'module-1'] }
    const tracks = resolveTracks(config, all)
    expect(tracks).toHaveLength(1)
    expect(tracks[0].id).toBe('default')
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['setup', 'module-1'])
  })

  it('resolves multiple tracks from the new format', () => {
    const config = {
      tracks: [
        { id: 'eng', label: 'Engineering', audience: 'engineer' as const, modules: ['module-1', 'module-2'] },
        { id: 'biz', label: 'Business', audience: 'business' as const, modules: ['module-1'] },
      ],
    }
    const tracks = resolveTracks(config, all)
    expect(tracks).toHaveLength(2)
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['module-1', 'module-2'])
    expect(tracks[1].modules.map((m) => m.id)).toEqual(['module-1'])
  })

  it('filters exercises by track audience during resolution', () => {
    const modWithExercises: Module = {
      ...makeModule('module-1'),
      exercises: [
        makeExercise('ex-eng', 'engineer'),
        makeExercise('ex-biz', 'business'),
        makeExercise('ex-all'),
      ],
    }
    const config = {
      tracks: [
        { id: 'eng', label: 'Engineering', audience: 'engineer' as const, modules: ['module-1'] },
      ],
    }
    const tracks = resolveTracks(config, [modWithExercises])
    expect(tracks[0].modules[0].exercises.map((e) => e.slug)).toEqual(['ex-eng', 'ex-all'])
  })

  it('ignores unknown module IDs in a track', () => {
    const config = { tracks: [{ id: 't', label: 'T', audience: 'both' as const, modules: ['module-1', 'does-not-exist'] }] }
    const tracks = resolveTracks(config, all)
    expect(tracks[0].modules.map((m) => m.id)).toEqual(['module-1'])
  })

  it('returns an empty modules array for an empty track', () => {
    const config = { tracks: [{ id: 't', label: 'T', audience: 'both' as const, modules: [] }] }
    const tracks = resolveTracks(config, all)
    expect(tracks[0].modules).toHaveLength(0)
  })
})
