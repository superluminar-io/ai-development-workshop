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

})
