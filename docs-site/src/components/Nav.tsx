import { Link, NavLink } from 'react-router-dom'
import { modules } from '../config'

export function Nav() {
  const readyModules = modules.filter((m) => m.status === 'ready')

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">S</span>
        AI Development Workshop
      </Link>
      <div className="nav-modules">
        {readyModules.map((m) => (
          <NavLink
            key={m.id}
            to={`/module/${m.id}`}
            className={({ isActive }) =>
              'nav-module-link' + (isActive ? ' nav-module-link--active' : '')
            }
          >
            {m.number === '00' ? 'Setup' : `Module ${m.number}`}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
