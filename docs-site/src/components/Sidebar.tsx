import { NavLink } from 'react-router-dom'
import type { Module } from '../config'

interface SidebarProps {
  module: Module
}

export function Sidebar({ module }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__item${isActive ? ' sidebar__item--active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar__module-label">Module {module.number}</div>

      <NavLink to={`/module/${module.id}/participant-guide`} className={linkClass}>
        Participant Guide
      </NavLink>

      <div className="sidebar__section-header">Exercises</div>

      {module.exercises.map((ex, i) => (
        <NavLink key={ex.slug} to={`/module/${module.id}/${ex.slug}`} className={linkClass}>
          {i + 1} · {ex.title}
        </NavLink>
      ))}
    </aside>
  )
}
