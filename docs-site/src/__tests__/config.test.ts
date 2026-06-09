import { describe, it, expect } from 'vitest'
import { filterModules } from '../config'
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
