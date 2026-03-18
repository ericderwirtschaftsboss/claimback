import { anthropic } from './client'
import { buildClaimPrompt } from './prompts'
import { demoClaims } from '@/lib/demo/claims'
import { demoOpportunities } from '@/lib/demo/opportunities'

interface ClaimDraftInput {
  category: string
  vendor: string
  description: string
  amount: number
}

export async function draftClaimLetter(input: ClaimDraftInput): Promise<string> {
  if (process.env.DEMO_MODE === 'true') {
    const oppIndex = demoOpportunities.findIndex(
      (o) => o.vendor === input.vendor && o.category === input.category
    )
    const demoClaim = demoClaims.find((c) => c.opportunityIndex === oppIndex)
    if (demoClaim) return demoClaim.draftBody

    return generateGenericDemoLetter(input)
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: buildClaimPrompt(input.category, input.vendor, input.description, input.amount),
      },
    ],
  })

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')
}

function generateGenericDemoLetter(input: ClaimDraftInput): string {
  return `Dear ${input.vendor} Customer Service,

I am writing to request a review and resolution regarding a charge of $${input.amount.toFixed(2)}.

${input.description}

I kindly request that this matter be investigated and resolved promptly. I believe I am entitled to a refund or adjustment of the specified amount.

Please confirm receipt of this request and provide a timeline for resolution.

Best regards`
}
