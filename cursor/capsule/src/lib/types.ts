export type CategoryId = 'joke' | 'foreign' | 'knowledge' | 'book'

export interface JokeContent {
  kind: 'joke'
  content: string
}

export interface ForeignContent {
  kind: 'foreign'
  language: string
  original: string
  translation: string
}

export interface KnowledgeContent {
  kind: 'knowledge'
  title: string
  explanation: string
}

export interface BookContent {
  kind: 'book'
  title: string
  author: string
  summary: string
  recommendation: string
}

export type Content =
  | JokeContent
  | ForeignContent
  | KnowledgeContent
  | BookContent
