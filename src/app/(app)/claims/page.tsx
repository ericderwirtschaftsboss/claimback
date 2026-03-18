import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ClaimStatusBadge } from '@/components/claim-status-badge'
import { formatCurrency } from '@/lib/utils'

export default async function ClaimsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const claims = await prisma.claim.findMany({
    where: { userId },
    include: { opportunity: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Claims</h1>
        <p className="text-muted-foreground">Track your money recovery claims</p>
      </div>

      {claims.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No claims yet. Generate a claim from an opportunity to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <Link key={claim.id} href={`/claims/${claim.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{claim.opportunity.vendor}</h3>
                        <ClaimStatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {claim.opportunity.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(claim.opportunity.amount.toString())}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
