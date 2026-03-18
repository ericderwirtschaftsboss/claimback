import { anthropic } from './client'
import { analysisResponseSchema, AnalyzedOpportunity } from './schemas'
import { ANALYSIS_SYSTEM_PROMPT, buildUserPrompt } from './prompts'
import { ParsedEmail } from '@/lib/gmail/parser'

const BATCH_SIZE = 20
const MAX_RETRIES = 3
const BACKOFF_MS = [1000, 2000, 4000]

export async function analyzeBatch(emails: ParsedEmail[]): Promise<AnalyzedOpportunity[]> {
  const allOpportunities: AnalyzedOpportunity[] = []

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE)
    try {
      const opportunities = await analyzeWithRetry(batch)
      allOpportunities.push(...opportunities)
    } catch (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed after retries:`, error)
    }
  }

  return allOpportunities
}

async function analyzeWithRetry(emails: ParsedEmail[]): Promise<AnalyzedOpportunity[]> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await callClaude(emails)
    } catch (error: any) {
      const status = error?.status || error?.statusCode
      const isRetryable = status === 429 || status === 500 || status === 529

      if (!isRetryable || attempt === MAX_RETRIES - 1) throw error

      await sleep(BACKOFF_MS[attempt])
    }
  }
  return []
}

async function callClaude(emails: ParsedEmail[]): Promise<AnalyzedOpportunity[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(emails) }],
  })

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')

  try {
    const parsed = JSON.parse(text)
    const validated = analysisResponseSchema.parse(parsed)
    return validated.opportunities
  } catch (error) {
    console.error('Failed to parse Claude response:', error)
    return []
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
