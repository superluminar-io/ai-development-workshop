import { Link } from 'react-router-dom'

export function Nav() {
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
            {m.id === 'setup' ? 'Setup' : m.number === '00' ? m.title : `Module ${m.number}`}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
