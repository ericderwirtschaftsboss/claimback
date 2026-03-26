import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runAnalysis } from '@/lib/scan-worker'

export const maxDuration = 60

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  let userId: string | null = null

  if (session?.user) {
    const candidateId = (session.user as { id: string }).id
    const userExists = await prisma.user.findUnique({ where: { id: candidateId }, select: { id: true } })
    userId = userExists ? candidateId : null
  }

  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Request too large or malformed.' }, { status: 400 })
    }

    const { text, url, title, fileName, sourceType: inputSourceType, contractType, signerRole } = body

    let contractText = text || ''
    let sourceType = inputSourceType || 'TEXT'

    if (url && !contractText) {
      sourceType = 'URL'
      try {
        const res = await fetch(url)
        const html = await res.text()
        contractText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      } catch {
        return NextResponse.json({ error: 'Failed to fetch content from the URL.' }, { status: 400 })
      }
    }

    if (!contractText) {
      return NextResponse.json({ error: 'No content to analyze.' }, { status: 400 })
    }

    if (contractText.split(/\s+/).length < 50) {
      return NextResponse.json({ error: 'Document too short for meaningful analysis.' }, { status: 400 })
    }

    // Truncate very long contracts
    const originalLength = contractText.length
    if (contractText.length > 15000) {
      contractText = contractText.slice(0, 15000) + `\n\n[Contract truncated — original was ${originalLength} characters]`
    }

    // Create scan record with PROCESSING status
    const scan = await prisma.contractScan.create({
      data: {
        userId,
        title: title || 'Contract Scan',
        contractType: contractType || null,
        signerRole: signerRole || null,
        sourceType,
        sourceFileName: fileName || null,
        sourceUrl: url || null,
        status: 'PROCESSING',
      },
    })

    console.log('[SCAN] Created scan record:', scan.id, '- triggering analysis')

    // Determine if we're on Netlify (production) or local dev
    const siteUrl = process.env.URL || process.env.NEXTAUTH_URL || ''
    const isNetlify = siteUrl.includes('netlify') || process.env.NETLIFY === 'true'

    if (isNetlify) {
      // Fire-and-forget to Netlify background function
      fetch(`${siteUrl}/.netlify/functions/analyze-contract-background`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId: scan.id,
          contractText,
          contractType,
          signerRole,
          originalLength,
        }),
      }).catch(err => console.error('[SCAN] Failed to trigger background function:', err))
    } else {
      // Local dev: run analysis directly (no background functions locally)
      runAnalysis(scan.id, contractText, contractType, signerRole, originalLength)
        .catch(err => console.error('[SCAN] Local analysis error:', err))
    }

    return NextResponse.json({ id: scan.id })
  } catch (error: any) {
    console.error('[SCAN] Error:', error.message || error)
    return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 })
  }
}
