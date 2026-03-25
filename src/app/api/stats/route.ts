import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await prisma.contractScan.count()
    return NextResponse.json({ scansCount: count })
  } catch {
    return NextResponse.json({ scansCount: 0 })
  }
}
