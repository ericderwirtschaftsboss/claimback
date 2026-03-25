import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  console.warn('[AI CLIENT] ANTHROPIC_API_KEY is not set — Claude API calls will fail')
} else {
  console.log('[AI CLIENT] Anthropic client initialized, key starts with:', apiKey.slice(0, 12) + '...')
}

const globalForAnthropic = globalThis as unknown as { anthropic: Anthropic }

export const anthropic =
  globalForAnthropic.anthropic ||
  new Anthropic({
    apiKey: apiKey || '',
  })

if (process.env.NODE_ENV !== 'production') globalForAnthropic.anthropic = anthropic
