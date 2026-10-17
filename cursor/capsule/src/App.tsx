import { useCallback, useEffect, useRef, useState } from 'react'
import ContentCard from './components/ContentCard'
import SettingsModal from './components/SettingsModal'
import { randomCategory } from './lib/categories'
import type { CategoryMeta } from './lib/categories'
import { generateContent } from './lib/generate'
import type { Content } from './lib/types'

const STORAGE_KEY = 'capsule.apiKey'

function loadKey(): string {
  return localStorage.getItem(STORAGE_KEY) ?? ''
}

export default function App() {
  const [apiKey, setApiKey] = useState<string>(loadKey)
  const [content, setContent] = useState<Content | null>(null)
  const [category, setCategory] = useState<CategoryMeta | null>(null)
  const [loading, setLoading] = useState(() => loadKey() !== '')
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(() => loadKey() === '')
  const [drawId, setDrawId] = useState(0)
  const pendingRef = useRef(false)

  const draw = useCallback(async () => {
    if (!apiKey || pendingRef.current) return
    pendingRef.current = true
    const cat = randomCategory(category?.id)
    try {
      const result = await generateContent(cat, apiKey)
      setCategory(cat)
      setContent(result)
      setDrawId((n) => n + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败，请重试')
    } finally {
      setLoading(false)
      pendingRef.current = false
    }
  }, [apiKey, category?.id])

  // 首次加载自动来一条（draw 是 async，所有 setState 都在 await 之后）
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if (apiKey && !content) void draw()
  }, [apiKey, content, draw])

  const handlePageClick = () => {
    if (loading || showSettings || !apiKey) return
    setLoading(true)
    setError(null)
    void draw()
  }

  const handleSaveKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    setShowSettings(false)
    setContent(null)
    setError(null)
    setLoading(true)
  }

  return (
    <div className="page" onClick={handlePageClick}>
      <header className="topbar">
        <span className="brand">扭蛋</span>
        <button
          className="gear"
          aria-label="设置"
          onClick={(e) => {
            e.stopPropagation()
            setShowSettings(true)
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      <main className="stage">
        {content && category ? (
          <ContentCard
            key={drawId}
            category={category}
            content={content}
            loading={loading}
          />
        ) : loading ? (
          <div className="boot">
            <div className="spinner" />
            <div className="loading-label">扭蛋中…</div>
          </div>
        ) : (
          <div className="boot boot-hint">点一下，扭一个</div>
        )}
      </main>

      {error && <p className="error">{error}</p>}

      <footer className="hint">点一下，扭一个</footer>

      {showSettings && (
        <SettingsModal
          initialKey={apiKey}
          onSave={handleSaveKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
