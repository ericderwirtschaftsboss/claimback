import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  draftBody: z.string().optional(),
  finalBody: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'RESOLVED', 'REJECTED']).optional(),
  resolvedAmount: z.number().optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const claim = await prisma.claim.findFirst({
    where: { id: params.id, userId },
    include: { opportunity: true },
  })

  if (!claim) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(claim)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const body = await request.json()

  try {
    const data = updateSchema.parse(body)

    const claim = await prisma.claim.findFirst({
      where: { id: params.id, userId },
    })

    if (!claim) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (data.draftBody) updateData.draftBody = data.draftBody
    if (data.finalBody) updateData.finalBody = data.finalBody
    if (data.status) {
      updateData.status = data.status
      if (data.status === 'RESOLVED' || data.status === 'REJECTED') {
        updateData.resolvedAt = new Date()
      }
    }
    if (data.resolvedAmount !== undefined) updateData.resolvedAmount = data.resolvedAmount

    const updated = await prisma.claim.update({
      where: { id: params.id },
      data: updateData,
      include: { opportunity: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
