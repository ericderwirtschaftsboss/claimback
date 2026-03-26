import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const scan = await prisma.contractScan.findUnique({
    where: { id: params.id },
    select: { status: true, errorMessage: true },
  })

  if (!scan) {
    return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json({
    status: scan.status,
    error: scan.errorMessage || undefined,
  })
}
