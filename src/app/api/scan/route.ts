import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runScan } from '@/lib/scanner/orchestrator'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id

  try {
    const result = await runScan(userId)
    return NextResponse.json(result)
  } catch (error: any) {
    if (error.message === 'A scan is already in progress') {
      return NextResponse.json({ error: error.message }, { status: 429 })
    }
    console.error('Scan error:', error)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const latest = await prisma.scanLog.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  })

  return NextResponse.json({ scanLog: latest })
}
