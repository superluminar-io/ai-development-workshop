import { Link } from 'react-router-dom'
import { activeTrack } from '../config'
import { MarkdownView } from '../components/MarkdownView'
import { Sidebar } from '../components/Sidebar'

export function SummaryPage() {
  const summaryFile = activeTrack?.summary ?? '/docs/summaries/default.md'

  return (
    <div className="module-page">
      <Sidebar />
      <main className="module-page__content">
        <MarkdownView file={summaryFile} />
        <div className="page-nav">
          <Link to="/" className="btn-end">
            End Workshop
          </Link>
        </div>
      </main>
    </div>
  )
}
