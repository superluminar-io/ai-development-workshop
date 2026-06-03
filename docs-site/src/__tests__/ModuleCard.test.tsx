import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModuleCard } from '../components/ModuleCard'
import type { Module } from '../config'

const readyModule: Module = {
  id: 'module-1',
  number: '01',
  title: 'Claude Code in the Engineering Loop',
  description: 'Learn to use Claude Code.',
  status: 'ready',
  participantGuide: '/docs/module-1/participant-guide.md',
  exercises: [
    { slug: 'ex-1', title: 'Orientation', file: '/docs/module-1/exercises/ex-1.md' },
  ],
}

const comingSoonModule: Module = {
  ...readyModule,
  id: 'module-3',
  number: '03',
  status: 'coming-soon',
  title: 'Future Module',
}

describe('ModuleCard', () => {
  it('renders the module title', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText('Claude Code in the Engineering Loop')).toBeInTheDocument()
  })

  it('renders the module number', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText('01')).toBeInTheDocument()
  })

  it('renders exercise chips for ready modules', () => {
    render(<MemoryRouter><ModuleCard module={readyModule} /></MemoryRouter>)
    expect(screen.getByText(/Orientation/)).toBeInTheDocument()
  })

  it('renders coming-soon badge for upcoming modules', () => {
    render(<MemoryRouter><ModuleCard module={comingSoonModule} /></MemoryRouter>)
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })
})
