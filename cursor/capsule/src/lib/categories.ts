import type { CategoryId } from './types'

export interface CategoryMeta {
  id: CategoryId
  label: string
  labelEn: string
  color: string
  tint: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'joke', label: '笑话', labelEn: 'joke', color: '#e07a2f', tint: '#f9e9d8' },
  { id: 'foreign', label: '外语', labelEn: 'phrase', color: '#3b6fd4', tint: '#e3ebfa' },
  { id: 'knowledge', label: '知识点', labelEn: 'fact', color: '#2e9e6b', tint: '#e0f2e8' },
  { id: 'book', label: '书', labelEn: 'book', color: '#7a5cc7', tint: '#eae4f8' },
]

export function randomCategory(exclude?: CategoryId): CategoryMeta {
  const pool = exclude ? CATEGORIES.filter((c) => c.id !== exclude) : CATEGORIES
  return pool[Math.floor(Math.random() * pool.length)]
}
