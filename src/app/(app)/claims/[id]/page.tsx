import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ClaimEditor } from '@/components/claim-editor'
import { ClaimStatusBadge } from '@/components/claim-status-badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ClaimActions } from './claim-actions'

export default async function ClaimDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const claim = await prisma.claim.findFirst({
    where: { id: params.id, userId },
    include: { opportunity: true },
  })

  if (!claim) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/claims">&larr; Back to Claims</Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Claim: {claim.opportunity.vendor}</h1>
          <ClaimStatusBadge status={claim.status} />
        </div>
      </div>

      {claim.status === 'SUBMITTED' && (
        <ClaimActions claimId={claim.id} />
      )}

      <ClaimEditor
        claim={{
          ...claim,
          opportunity: {
            ...claim.opportunity,
            amount: claim.opportunity.amount.toString(),
          },
        }}
      />
    </div>
  )
}
