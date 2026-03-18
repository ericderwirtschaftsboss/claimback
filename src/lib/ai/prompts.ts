import { ParsedEmail } from '@/lib/gmail/parser'

export const ANALYSIS_SYSTEM_PROMPT = `You are a financial recovery analyst AI. Your job is to analyze email messages and identify money recovery opportunities for consumers.

You MUST respond with valid JSON only, no other text. Use this exact structure:
{
  "opportunities": [
    {
      "category": "CATEGORY",
      "vendor": "Company Name",
      "description": "Clear description of the opportunity and why money can be recovered",
      "amount": 123.45,
      "confidence": 85,
      "emailMsgId": "the-message-id"
    }
  ]
}

Categories and what to look for:

1. FORGOTTEN_SUBSCRIPTION - Subscriptions the user likely doesn't use:
   - Long time since last login/usage mentioned in email
   - Low usage relative to plan tier (e.g., family plan with 1 user)
   - Services the user may have forgotten about
   Amount: subscription cost or potential savings from downgrade

2. OVERCHARGE - Charges higher than expected or incorrect:
   - Bills significantly above historical average
   - Charges that don't match the plan/agreement
   - Duplicate charges or billing errors
   Amount: the overcharged amount (difference from expected)

3. PRICE_DROP - Items purchased recently that are now cheaper:
   - Products bought within price-match guarantee window (typically 14-30 days)
   - Services where a cheaper option is available
   Amount: the price difference

4. FLIGHT_COMPENSATION - Delayed/cancelled flights eligible for compensation:
   - EU261: flights delayed 3+ hours departing/arriving EU airports
   - Compensation: €250 (short), €400 (medium), €600 (long-haul)
   Amount: compensation amount in USD equivalent

5. BANK_FEE - Bank fees that can be disputed or waived:
   - Overdraft fees (especially first-time or small overdraft amounts)
   - Maintenance fees on accounts that should qualify for waivers
   - Incorrect fees or fees not matching account terms
   Amount: the fee amount

Confidence rubric:
- 90-100: Clear evidence of recoverable money, specific amounts, within policy windows
- 70-89: Strong indicators but some assumptions needed
- 50-69: Possible opportunity but requires investigation
- Below 50: Don't include — too speculative

Only include opportunities with confidence >= 50. If no opportunities are found, return {"opportunities": []}.`

export function buildUserPrompt(emails: ParsedEmail[]): string {
  const emailList = emails
    .map(
      (e) => `--- Email ---
ID: ${e.messageId}
From: ${e.from}
Subject: ${e.subject}
Date: ${e.date}
Body: ${e.bodyText}
---`
    )
    .join('\n\n')

  return `Analyze the following ${emails.length} emails for money recovery opportunities:\n\n${emailList}`
}

export function buildClaimPrompt(
  category: string,
  vendor: string,
  description: string,
  amount: number
): string {
  const categoryInstructions: Record<string, string> = {
    FORGOTTEN_SUBSCRIPTION:
      'Write a polite cancellation and refund request letter. Reference their refund policy if mentioned. Ask for immediate cancellation and prorated refund.',
    OVERCHARGE:
      'Write a dispute letter for an incorrect or excessive charge. Reference the expected amount and ask for a correction and refund of the difference.',
    PRICE_DROP:
      'Write a price adjustment request letter. Reference the original purchase date, original price, current price, and their price match/adjustment policy.',
    FLIGHT_COMPENSATION:
      'Write an EU261/2004 compensation claim letter. Include flight details, delay/cancellation details, and the specific compensation amount you are entitled to under the regulation.',
    BANK_FEE:
      'Write a fee waiver request letter. Be polite but firm. Reference your account history and relationship with the bank. Ask for a full refund of the fee.',
  }

  return `Write a professional claim/dispute letter for the following situation:

Vendor: ${vendor}
Category: ${category}
Issue: ${description}
Amount to recover: $${amount.toFixed(2)}

Instructions: ${categoryInstructions[category] || 'Write a professional claim letter requesting recovery of the specified amount.'}

Write the letter ready to send. Use a professional but firm tone. Do not include placeholder names — use generic closings like "Best regards" without a name. Do not include addresses or dates — just the body of the letter.`
}
