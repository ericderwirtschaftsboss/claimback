import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { anthropic } from '@/lib/ai/client'

const COMPARE_PROMPT = `You are comparing two versions of a contract. Identify all differences and assess whether each change favors the provider or the signer.

Return ONLY valid JSON:
{
  "overall_direction": "IMPROVED|WORSENED|MIXED",
  "summary": "Plain english summary of key changes (2-3 sentences)",
  "changes": [
    {
      "type": "ADDED|REMOVED|MODIFIED",
      "section": "Where in the contract",
      "description": "What changed in plain english",
      "favors": "PROVIDER|SIGNER|NEUTRAL",
      "significance": "HIGH|MEDIUM|LOW",
      "old_text": "Original wording (for MODIFIED/REMOVED), or null",
      "new_text": "New wording (for MODIFIED/ADDED), or null"
    }
  ]
}`

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to compare contracts' }, { status: 401 })
  }

  try {
    const { oldText, newText } = await request.json()

    if (!oldText || !newText) {
      return NextResponse.json({ error: 'Both contract versions are required' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0,
      system: COMPARE_PROMPT,
      messages: [{
        role: 'user',
        content: `Compare these two contract versions:\n\n--- VERSION 1 (ORIGINAL) ---\n${oldText.slice(0, 15000)}\n\n--- VERSION 2 (REVISED) ---\n${newText.slice(0, 15000)}`,
      }],
    })

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Compare error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
