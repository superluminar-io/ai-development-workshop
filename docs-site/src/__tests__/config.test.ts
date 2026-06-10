import { describe, it, expect } from 'vitest'
import { filterModules, assignDisplayNumbers } from '../config'
import type { Module } from '../config'

const makeModule = (id: string): Module => ({
  id,
  number: '01',
  title: 'Test',
  description: 'desc',
  status: 'ready',
  participantGuide: `/docs/${id}/participant-guide.md`,
  exercises: [],
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
