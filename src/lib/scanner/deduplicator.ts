import { AnalyzedOpportunity } from '@/lib/ai/schemas'
import { prisma } from '@/lib/prisma'

const SOFT_DEDUP_WINDOW_MS = 3 * 24 * 60 * 60 * 1000

export async function deduplicateOpportunities(
  opportunities: AnalyzedOpportunity[],
  userId: string
): Promise<AnalyzedOpportunity[]> {
  const existing = await prisma.opportunity.findMany({
    where: { userId },
    select: { emailMsgId: true, vendor: true, amount: true, createdAt: true },
  })

  const existingMsgIds = new Set(existing.map((o) => o.emailMsgId).filter(Boolean))

  return opportunities.filter((opp) => {
    if (existingMsgIds.has(opp.emailMsgId)) return false

    const hasSoftDup = existing.some((e) => {
      if (e.vendor.toLowerCase() !== opp.vendor.toLowerCase()) return false
      if (Math.abs(Number(e.amount) - opp.amount) > 0.01) return false
      const timeDiff = Date.now() - e.createdAt.getTime()
      return timeDiff < SOFT_DEDUP_WINDOW_MS
    })

    return !hasSoftDup
  })
}
