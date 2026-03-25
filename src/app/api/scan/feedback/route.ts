import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user ? (session.user as { id: string }).id : null

  try {
    const { scanId, flagId, feedback, comment } = await request.json()

    if (!scanId || flagId === undefined || !feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['ACCURATE', 'INACCURATE'].includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 })
    }

    await prisma.scanFeedback.create({
      data: { scanId, flagId, userId, feedback, comment },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
