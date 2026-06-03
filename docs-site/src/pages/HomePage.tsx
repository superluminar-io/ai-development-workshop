import { modules } from '../config'
import { ModuleCard } from '../components/ModuleCard'

export function HomePage() {
  return (
    <div className="home">
      <div className="home__hero">
        <div className="hero__label">superluminar workshops</div>
        <h1 className="hero__title">AI Development Workshop</h1>
        <p className="hero__subtitle">
          Hands-on exercises for using Claude Code in real engineering work.
        </p>
      </div>
      <div className="home__modules">
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </div>
  )
}
