import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: params.id, userId },
    include: { claims: true },
  })

  if (!opportunity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(opportunity)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const body = await request.json()

  const opportunity = await prisma.opportunity.findFirst({
    where: { id: params.id, userId },
  })

  if (!opportunity) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (body.status === 'DISMISSED') {
    const updated = await prisma.opportunity.update({
      where: { id: params.id },
      data: { status: 'DISMISSED' },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Invalid update' }, { status: 400 })
}
