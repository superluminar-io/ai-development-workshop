import { Navigate, useParams } from 'react-router-dom'
import { modules } from '../config'
import { resolvePageFile } from '../utils/resolvePageFile'
import { Nav } from '../components/Nav'
import { Sidebar } from '../components/Sidebar'
import { MarkdownView } from '../components/MarkdownView'

export function ModulePage() {
  const { moduleId, pageSlug } = useParams<{ moduleId: string; pageSlug?: string }>()
  const module = modules.find((m) => m.id === moduleId)

  if (!module || module.status !== 'ready') {
    return <Navigate to="/" replace />
  }

  if (!pageSlug) {
    return <Navigate to={`/module/${moduleId}/participant-guide`} replace />
  }

  const file = resolvePageFile(module, pageSlug)
  if (!file) {
    return <Navigate to={`/module/${moduleId}/participant-guide`} replace />
  }

  return (
    <div className="module-page">
      <Nav backLink />
      <div className="module-page__body">
        <Sidebar module={module} />
        <main className="module-page__content">
          <MarkdownView file={file} />
        </main>
      </div>
    </div>
  )
}
