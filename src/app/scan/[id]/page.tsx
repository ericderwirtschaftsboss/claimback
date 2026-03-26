import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ScanResultClient } from './scan-result-client'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const scan = await prisma.contractScan.findUnique({ where: { id: params.id }, select: { title: true } })
  return { title: scan?.title ? `${scan.title} — SignGuard` : 'Scan Result — SignGuard' }
}

export default async function ScanResultPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session

  const scan = await prisma.contractScan.findUnique({ where: { id: params.id } })
  if (!scan) notFound()

  // Processing state — show animated waiting page
  if (scan.status === 'PROCESSING') {
    const { ProcessingPage } = await import('./processing-page')
    return <ProcessingPage scanId={scan.id} />
  }

  // Failed state
  if (scan.status === 'FAILED') {
    const { FailedPage } = await import('./failed-page')
    return <FailedPage error={scan.errorMessage || 'Analysis failed'} />
  }

  // Parse scan data
  const flags = scan.flags ? JSON.parse(scan.flags as string) : []
  const financialSummary = scan.financialSummary ? JSON.parse(scan.financialSummary as string) : null
  const negotiationPlaybook = scan.negotiationPlaybook ? JSON.parse(scan.negotiationPlaybook as string) : []

  let missingProtections: any[] = []
  let externalReferences: any[] = []
  if (scan.missingProtections) {
    const parsed = JSON.parse(scan.missingProtections as string)
    if (Array.isArray(parsed)) {
      missingProtections = parsed.map((p: any) => typeof p === 'string' ? { protection: p, why_it_matters: '', suggested_language: '' } : p)
    } else {
      missingProtections = (parsed.protections || []).map((p: any) => typeof p === 'string' ? { protection: p, why_it_matters: '', suggested_language: '' } : p)
      externalReferences = parsed.externalRefs || []
    }
  }

  return (
    <>
      <ScanResultClient
        scan={{
          id: scan.id, title: scan.title, contractType: scan.contractType,
          sourceType: scan.sourceType, sourceFileName: scan.sourceFileName,
          riskScore: scan.riskScore, powerImbalanceScore: scan.powerImbalanceScore,
          riskLevel: scan.riskLevel, recommendation: scan.recommendation,
          executiveSummary: scan.executiveSummary,
          language: scan.language,
          jurisdictionDetected: scan.jurisdictionDetected,
          jurisdictionCode: scan.jurisdictionCode,
          flagCountCritical: scan.flagCountCritical, flagCountWarning: scan.flagCountWarning,
          flagCountInfo: scan.flagCountInfo,
          analysisCompleteness: scan.analysisCompleteness,
          createdAt: scan.createdAt.toISOString(),
        }}
        flags={flags}
        financialSummary={financialSummary}
        negotiationPlaybook={negotiationPlaybook}
        missingProtections={missingProtections}
        externalReferences={externalReferences}
      />

      {/* Guest CTA — only show for non-logged-in users */}
      {!isLoggedIn && (
        <div className="mt-8 rounded-lg border bg-primary/5 p-6 text-center">
          <p className="font-semibold">Create a free account to save your scans</p>
          <p className="text-sm text-muted-foreground mt-1">Get unlimited scans, scan history, and PDF exports.</p>
          <a href="/register" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 mt-4 text-sm font-medium hover:bg-primary/90 transition-colors">
            Create free account
          </a>
        </div>
      )}
    </>
  )
}
