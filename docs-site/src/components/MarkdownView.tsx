import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownViewProps {
  file: string // Vite-served URL path, e.g. /docs/module-1/participant-guide.md
}

export function MarkdownView({ file }: MarkdownViewProps) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setContent(null)
    setError(false)

    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`)
        return res.text()
      })
      .then(setContent)
      .catch(() => setError(true))
  }, [file])

  if (error) return <p className="markdown-error">Could not load content ({file})</p>
  if (content === null) return <p className="markdown-loading">Loading…</p>

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
