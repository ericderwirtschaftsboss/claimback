import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { draftClaimLetter } from '@/lib/ai/claim-drafter'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id

  const opportunity = await prisma.opportunity.findFirst({
    where: { id: params.id, userId },
  })

  if (!opportunity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const draftBody = await draftClaimLetter({
    category: opportunity.category,
    vendor: opportunity.vendor,
    description: opportunity.description,
    amount: Number(opportunity.amount),
  })

  const claim = await prisma.claim.create({
    data: {
      userId,
      opportunityId: opportunity.id,
      draftBody,
    },
  })

  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: { status: 'CLAIMED' },
  })

  return NextResponse.json(claim, { status: 201 })
}
