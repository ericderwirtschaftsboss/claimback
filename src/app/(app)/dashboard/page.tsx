import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatsCards } from '@/components/stats-cards'
import { ScanProgress } from '@/components/scan-progress'
import { OpportunityCard } from '@/components/opportunity-card'
import { EmailConnectButton } from '@/components/email-connect-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const [activeOpps, claimsInProgress, resolvedClaims, connection] = await Promise.all([
    prisma.opportunity.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { amount: 'desc' },
      take: 5,
    }),
    prisma.claim.count({ where: { userId, status: { in: ['DRAFT', 'SUBMITTED'] } } }),
    prisma.claim.findMany({
      where: { userId, status: 'RESOLVED' },
      select: { resolvedAmount: true },
    }),
    prisma.emailConnection.findFirst({ where: { userId } }),
  ])

  const totalOpps = await prisma.opportunity.count({ where: { userId, status: 'ACTIVE' } })
  const recoveryPotential = await prisma.opportunity.aggregate({
    where: { userId, status: 'ACTIVE' },
    _sum: { amount: true },
  })

  const moneyRecovered = resolvedClaims.reduce(
    (sum, c) => sum + Number(c.resolvedAmount || 0),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your money recovery overview</p>
        </div>
        <EmailConnectButton isConnected={!!connection} />
      </div>

      <StatsCards
        recoveryPotential={Number(recoveryPotential._sum.amount || 0)}
        opportunitiesFound={totalOpps}
        claimsInProgress={claimsInProgress}
        moneyRecovered={moneyRecovered}
      />

      <ScanProgress />

      {activeOpps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Opportunities</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/opportunities">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {activeOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={{
                  ...opp,
                  amount: opp.amount.toString(),
                  createdAt: opp.createdAt.toISOString(),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
