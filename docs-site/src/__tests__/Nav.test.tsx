import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from '../components/Nav'

describe('Nav', () => {
  it('renders the workshop title', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('AI Development Workshop')).toBeInTheDocument()
  })

  it('shows module count badge by default', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText(/modules/)).toBeInTheDocument()
  })

  it('shows back link when backLink prop is set', () => {
    render(
      <MemoryRouter>
        <Nav backLink />
      </MemoryRouter>,
    )
    expect(screen.getByText('← All modules')).toBeInTheDocument()
  })
})
