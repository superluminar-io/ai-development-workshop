import { Link, NavLink, useLocation, useParams } from 'react-router-dom'
import { modules } from '../config'

export function Sidebar() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { pathname } = useLocation()
  const isSummaryActive = pathname === '/summary'
  const readyModules = modules.filter((m) => m.status === 'ready')

  const exerciseLinkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__item${isActive ? ' sidebar__item--active' : ''}`

  return (
    <aside className="sidebar">
      {readyModules.map((m, i) => {
        const isExpanded = m.id === moduleId
        const sidebarLabel = m.id === 'setup' ? 'Setup' : `Module ${i}`

        return (
          <div key={m.id} className="sidebar__module">
            <Link
              to={`/module/${m.id}`}
              className={`sidebar__module-header${isExpanded ? ' sidebar__module-header--active' : ''}`}
            >
              <span className="sidebar__module-number">{sidebarLabel}</span>
            </Link>

            {isExpanded && (
              <div className="sidebar__exercises">
                <NavLink
                  to={`/module/${m.id}/participant-guide`}
                  className={exerciseLinkClass}
                >
                  Participant Guide
                </NavLink>
                {m.exercises.map((ex, i) => (
                  <NavLink
                    key={ex.slug}
                    to={`/module/${m.id}/${ex.slug}`}
                    className={exerciseLinkClass}
                  >
                    {i + 1} · {ex.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <div className="sidebar__module">
        <Link
          to="/summary"
          className={`sidebar__module-header${isSummaryActive ? ' sidebar__module-header--active' : ''}`}
        >
          <span className="sidebar__module-number">Summary</span>
        </Link>
      </div>
    </aside>
  )
}
