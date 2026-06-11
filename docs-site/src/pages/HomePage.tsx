import { modules } from '../config'
import { ModuleCard } from '../components/ModuleCard'

export function HomePage() {
  const foundations = modules.filter((m) => m.level === 'foundations')
  const advanced = modules.filter((m) => m.level === 'advanced')
  const showHeadings = foundations.length > 0 && advanced.length > 0

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
        {showHeadings && foundations.length > 0 && (
          <h2 className="home__section-heading">Foundations</h2>
        )}
        {foundations.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
        {showHeadings && advanced.length > 0 && (
          <h2 className="home__section-heading">Advanced</h2>
        )}
        {advanced.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </div>
  )
}
