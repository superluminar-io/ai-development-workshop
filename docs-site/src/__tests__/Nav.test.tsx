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

  it('shows links for all ready modules', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('Setup')).toBeInTheDocument()
    expect(screen.getByText('Module 01')).toBeInTheDocument()
    expect(screen.getByText('Module 03')).toBeInTheDocument()
  })

  it('highlights the active module when on a module page', () => {
    render(
      <MemoryRouter initialEntries={['/module/module-1/participant-guide']}>
        <Nav />
      </MemoryRouter>,
    )
    const activeLink = screen.getByText('Module 01').closest('a')
    expect(activeLink).toHaveClass('nav-module-link--active')
  })
})
