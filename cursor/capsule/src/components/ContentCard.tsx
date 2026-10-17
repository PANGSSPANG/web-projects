import type { CSSProperties } from 'react'
import type { CategoryMeta } from '../lib/categories'
import type { Content } from '../lib/types'

interface Props {
  category: CategoryMeta
  content: Content
  loading: boolean
}

function renderBody(content: Content) {
  switch (content.kind) {
    case 'joke':
      return <p className="body-joke">{content.content}</p>
    case 'foreign':
      return (
        <>
          <p className="body-foreign">{content.original}</p>
          <p className="translation">{content.translation}</p>
          <p className="lang-tag">{content.language}</p>
        </>
      )
    case 'knowledge':
      return (
        <>
          <h2 className="body-title">{content.title}</h2>
          <p className="body-text">{content.explanation}</p>
        </>
      )
    case 'book':
      return (
        <>
          <h2 className="body-title">{content.title}</h2>
          <p className="body-author">{content.author}</p>
          <p className="body-text">{content.summary}</p>
          <p className="body-reco">{content.recommendation}</p>
        </>
      )
  }
}

export default function ContentCard({ category, content, loading }: Props) {
  const style = {
    '--accent': category.color,
    '--tint': category.tint,
  } as CSSProperties

  return (
    <article className="card" style={style}>
      <span className="tag">
        {category.label}
        <em>{category.labelEn}</em>
      </span>
      <div className="card-body">{renderBody(content)}</div>
      {loading && (
        <div className="veil">
          <div className="veil-inner">
            <div className="spinner" />
            <div className="loading-label">扭蛋中…</div>
          </div>
        </div>
      )}
    </article>
  )
}
