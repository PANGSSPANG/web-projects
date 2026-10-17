import type { CategoryMeta } from './categories'
import type { CategoryId, Content } from './types'

const API_URL = 'https://api.deepseek.com/chat/completions'
const MODEL = 'deepseek-chat'

// 每个分类一份提示词，强制输出 JSON，并加防编造约束。
const PROMPTS: Record<CategoryId, string> = {
  joke: [
    '你是一个讲中文短笑话的助手。',
    '生成一个原创、干净、简短的笑话，两三句以内，纯文字，不要标题、不要解释。',
    '只输出 json，格式：{"content":"笑话正文"}',
  ].join(' '),
  foreign: [
    '你是一个语言学习助手。',
    '随机选一种常见外语（英语、日语、法语、西班牙语、德语、韩语等），给一句日常实用的句子。',
    '语法必须正确，附中文翻译，并标出语种的中文名。',
    '只输出 json，格式：{"language":"语种中文名","original":"外文原句","translation":"中文翻译"}',
  ].join(' '),
  knowledge: [
    '你是一个科普助手，给一个常识级、可验证的知识点。',
    '必须是公认事实，不要冷门数据，不要编造统计数字，不要有争议的观点。',
    '只输出 json，格式：{"title":"一句话标题","explanation":"两三句解释"}',
  ].join(' '),
  book: [
    '你是一个图书推荐助手，推荐一本真实存在、广为人知的经典书籍。',
    '书名和作者必须真实准确，严禁虚构；简介真实客观。',
    '只输出 json，格式：{"title":"书名","author":"作者","summary":"两三句简介","recommendation":"一句推荐理由"}',
  ].join(' '),
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    /* fall through */
  }
  // 去掉可能的 markdown 代码块围栏
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) {
    try {
      return JSON.parse(fenced[1])
    } catch {
      /* fall through */
    }
  }
  // 退一步：取第一对 { } 之间的内容
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1))
    } catch {
      /* fall through */
    }
  }
  throw new Error('无法解析模型返回的内容')
}

export async function generateContent(
  category: CategoryMeta,
  apiKey: string,
): Promise<Content> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: PROMPTS[category.id] }],
      temperature: 1.1,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('API key 无效，点右上角重新设置')
    if (res.status === 429) throw new Error('请求太频繁或余额不足')
    if (res.status >= 500) throw new Error('服务暂时不可用，稍后再试')
    throw new Error(`请求失败（${res.status}）`)
  }

  const data = await res.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ''
  const parsed = parseJson(raw) as Record<string, string>
  return { kind: category.id, ...parsed } as unknown as Content
}
