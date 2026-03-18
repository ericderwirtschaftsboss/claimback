import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OpportunityStatus, Category, Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status') as OpportunityStatus | null
  const category = searchParams.get('category') as Category | null
  const sort = searchParams.get('sort') || 'amount'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Prisma.OpportunityWhereInput = { userId }
  if (status) where.status = status
  if (category) where.category = category

  const orderBy: Prisma.OpportunityOrderByWithRelationInput =
    sort === 'date' ? { createdAt: 'desc' } :
    sort === 'confidence' ? { confidence: 'desc' } :
    { amount: 'desc' }

  const [opportunities, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.opportunity.count({ where }),
  ])

  return NextResponse.json({ opportunities, total, page, limit })
}
