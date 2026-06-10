import { Navigate, useParams, Link } from 'react-router-dom'
import { modules } from '../config'
import { resolvePageFile } from '../utils/resolvePageFile'
import { getNextPage } from '../utils/navigation'
import { Sidebar } from '../components/Sidebar'
import { MarkdownView } from '../components/MarkdownView'

export function ModulePage() {
  const { moduleId, pageSlug } = useParams<{ moduleId: string; pageSlug?: string }>()
  const module = modules.find((m) => m.id === moduleId)

  if (!moduleId || !module || module.status !== 'ready') {
    return <Navigate to="/" replace />
  }

  if (!pageSlug) {
    return <Navigate to={`/module/${moduleId}/participant-guide`} replace />
  }

  const file = resolvePageFile(module, pageSlug)
  if (!file) {
    return <Navigate to={`/module/${moduleId}`} replace />
  }

  const nextPage = getNextPage(modules, moduleId, pageSlug)
  const nextHref = nextPage
    ? nextPage.kind === 'module'
      ? `/module/${nextPage.moduleId}/${nextPage.pageSlug}`
      : '/summary'
    : null

  return (
    <div className="module-page">
      <Sidebar />
      <main className="module-page__content">
        <MarkdownView file={file} />
        {nextHref && (
          <div className="page-nav">
            <Link to={nextHref} className="btn-next">
              Next →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
