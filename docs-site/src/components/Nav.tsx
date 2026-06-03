import { Link } from 'react-router-dom'
import { modules } from '../config'

interface NavProps {
  backLink?: boolean
}

export function Nav({ backLink }: NavProps) {
  const readyCount = modules.filter((m) => m.status === 'ready').length

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">S</span>
        AI Development Workshop
      </Link>
      {backLink ? (
        <Link to="/" className="nav-back">
          ← All modules
        </Link>
      ) : (
        <span className="nav-badge">{readyCount} modules</span>
      )}
    </nav>
  )
}
