import { Link } from 'react-router-dom'
import type { Module } from '../config'

interface ModuleCardProps {
  module: Module
}

export function ModuleCard({ module }: ModuleCardProps) {
  const isReady = module.status === 'ready'

  const inner = (
    <div className={`module-card${isReady ? '' : ' module-card--upcoming'}`}>
      <div className="module-card__number-col">
        <span className="module-card__number">{module.number}</span>
      </div>
      <div className="module-card__body">
        <div className="module-card__meta">
          <span className="module-card__title">{module.title}</span>
          <span className={`module-card__badge module-card__badge--${module.status}`}>
            {isReady ? 'Ready' : 'Coming soon'}
          </span>
        </div>
        <p className="module-card__desc">{module.description}</p>
        {isReady && (
          <div className="module-card__exercises">
            {module.exercises.map((ex) => (
              <span key={ex.slug} className="exercise-chip">
                {ex.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return isReady ? (
    <Link to={`/module/${module.id}`} className="module-card__link">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  )
}
