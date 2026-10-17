import { useEffect, useRef, useState } from 'react'

interface Props {
  initialKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function SettingsModal({ initialKey, onSave, onClose }: Props) {
  const [value, setValue] = useState(initialKey)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const save = () => {
    if (value.trim()) onSave(value.trim())
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="设置 API key"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <h2 className="modal-title">设置 API key</h2>
        <p className="modal-hint">
          内容由 DeepSeek 生成，需要一个 API key。它只保存在你本机浏览器里，不会上传。
          <a href="https://platform.deepseek.com/" target="_blank" rel="noreferrer">
            去获取 →
          </a>
        </p>
        <input
          ref={inputRef}
          className="modal-input"
          type="password"
          placeholder="sk-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
          }}
        />
        <button className="btn-primary" onClick={save} disabled={!value.trim()}>
          保存
        </button>
      </div>
    </div>
  )
}
