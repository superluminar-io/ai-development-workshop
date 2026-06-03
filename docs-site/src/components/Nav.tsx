import { Link, useLocation } from 'react-router-dom'
import { modules } from '../config'

export function Nav() {
  const { pathname } = useLocation()
  const isModulePage = pathname.startsWith('/module/')
  const readyCount = modules.filter((m) => m.status === 'ready').length

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">S</span>
        AI Development Workshop
      </Link>
      {isModulePage ? (
        <Link to="/" className="nav-back">
          ← All modules
        </Link>
      ) : (
        <span className="nav-badge">{readyCount} modules</span>
      )}
    </nav>
  )
}
