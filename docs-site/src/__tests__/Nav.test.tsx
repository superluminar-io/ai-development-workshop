import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from '../components/Nav'

describe('Nav', () => {
  it('renders the workshop title', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('AI Development Workshop')).toBeInTheDocument()
  })

  it('shows module count badge on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText(/modules/)).toBeInTheDocument()
  })

  it('shows back link on module pages', () => {
    render(
      <MemoryRouter initialEntries={['/module/module-1/participant-guide']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('← All modules')).toBeInTheDocument()
  })
})
