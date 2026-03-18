import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OpportunityList } from '@/components/opportunity-list'

export default async function OpportunitiesPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const opportunities = await prisma.opportunity.findMany({
    where: { userId },
    orderBy: { amount: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <p className="text-muted-foreground">
          All money recovery opportunities found in your emails
        </p>
      </div>

      <OpportunityList
        initialOpportunities={opportunities.map((o) => ({
          ...o,
          amount: o.amount.toString(),
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
