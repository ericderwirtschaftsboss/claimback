import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ClaimStatus, Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as ClaimStatus | null

  const where: Prisma.ClaimWhereInput = { userId }
  if (status) where.status = status

  const claims = await prisma.claim.findMany({
    where,
    include: { opportunity: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ claims })
}
