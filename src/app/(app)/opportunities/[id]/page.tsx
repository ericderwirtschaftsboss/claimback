import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, categoryConfig } from '@/lib/utils'
import { GenerateClaimButton } from './generate-claim-button'
import { DismissButton } from './dismiss-button'
import Link from 'next/link'

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const opportunity = await prisma.opportunity.findFirst({
    where: { id: params.id, userId },
    include: { claims: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })

  if (!opportunity) notFound()

  const config = categoryConfig[opportunity.category]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/opportunities">&larr; Back to Opportunities</Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Badge className={`${config.bgColor} ${config.color} border-0`}>
            {config.label}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {opportunity.confidence}% confidence
          </span>
        </div>
        <h1 className="text-3xl font-bold">{opportunity.vendor}</h1>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {formatCurrency(opportunity.amount.toString())}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{opportunity.description}</p>
          {opportunity.emailDate && (
            <p className="text-sm text-muted-foreground mt-4">
              Email date: {new Date(opportunity.emailDate).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {opportunity.status === 'ACTIVE' && (
        <div className="flex gap-3">
          <GenerateClaimButton opportunityId={opportunity.id} />
          <DismissButton opportunityId={opportunity.id} />
        </div>
      )}

      {opportunity.claims.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">A claim has been generated for this opportunity.</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href={`/claims/${opportunity.claims[0].id}`}>View Claim</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
