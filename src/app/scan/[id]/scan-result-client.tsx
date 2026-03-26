'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { generatePdfReport } from '@/lib/pdf-report'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XOctagon,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ArrowLeft,
  Banknote,
  Scale,
  FileText,
  Check,
  Info,
  ThumbsDown,
  ExternalLink,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScanData {
  id: string
  title: string | null
  contractType: string | null
  sourceType: string
  sourceFileName: string | null
  riskScore: number | null
  powerImbalanceScore: number | null
  riskLevel: string | null
  recommendation: string | null
  executiveSummary: string | null
  language: string | null
  jurisdictionDetected: string | null
  jurisdictionCode: string | null
  flagCountCritical: number
  flagCountWarning: number
  flagCountInfo: number
  analysisCompleteness: number | null
  createdAt: string
}

interface Flag {
  id: number
  section?: string
  category: string
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  title: string
  what_it_says: string
  why_it_matters: string
  the_trap?: string | null
  original_text?: string
  financial_impact?: string | null
  negotiation_leverage?: string
  recommendation?: string
  jurisdiction_note?: string | null
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  confidence_reason?: string | null
}

interface FinancialSummary {
  base_cost?: string
  hidden_costs?: string
  total_first_year?: string
  total_commitment?: string
  exit_cost?: string
}

interface NegotiationItem {
  priority?: number
  target_section?: string
  current_language?: string
  proposed_language?: string
  talking_points?: string
  likelihood_of_success?: string
  fallback?: string
}

interface MissingProtection {
  protection: string
  why_it_matters?: string
  suggested_language?: string
}

interface ExternalReference {
  document: string
  url_or_location?: string
  what_it_governs?: string
  risk?: string
}

interface ScanResultClientProps {
  scan: ScanData
  flags: Flag[]
  financialSummary: FinancialSummary | null
  negotiationPlaybook: NegotiationItem[]
  missingProtections: (string | MissingProtection)[]
  externalReferences?: ExternalReference[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, WARNING: 1, INFO: 2 }

function sortedFlags(flags: Flag[]) {
  return [...flags].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  )
}

function severityColor(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    case 'WARNING':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'INFO':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function confidenceColor(confidence: string) {
  switch (confidence) {
    case 'HIGH':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'LOW':
      return 'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function gaugeColor(score: number) {
  if (score <= 3) return '#22c55e'
  if (score <= 6) return '#f59e0b'
  return '#ef4444'
}

function completenessColor(pct: number) {
  if (pct >= 90) return 'bg-emerald-500'
  if (pct >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

// ---------------------------------------------------------------------------
// Circular Gauge SVG
// ---------------------------------------------------------------------------

function CircularGauge({
  score,
  size = 120,
  strokeWidth = 10,
  label,
}: {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(score / 10, 1)
  const offset = circumference * (1 - pct)
  const color = gaugeColor(score)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      {label && (
        <span className="text-xs font-medium text-muted-foreground mt-1">{label}</span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Risk Level Banner
// ---------------------------------------------------------------------------

function RiskLevelBanner({
  riskLevel,
  recommendation,
}: {
  riskLevel: string
  recommendation: string | null
}) {
  const config: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode; label: string }
  > = {
    LOW: {
      bg: 'bg-emerald-500/10 border border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      label: 'Low Risk',
    },
    MODERATE: {
      bg: 'bg-amber-400/10 border border-amber-400/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: <AlertTriangle className="h-7 w-7 text-amber-500 dark:text-amber-400 shrink-0" />,
      label: 'Moderate Risk',
    },
    ELEVATED: {
      bg: 'bg-amber-500/15 border border-amber-500/30',
      text: 'text-amber-800 dark:text-amber-300',
      icon: <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400 shrink-0" />,
      label: 'Elevated Risk',
    },
    HIGH: {
      bg: 'bg-orange-500/10 border border-orange-500/30',
      text: 'text-orange-700 dark:text-orange-400',
      icon: <XOctagon className="h-7 w-7 text-orange-600 dark:text-orange-400 shrink-0" />,
      label: 'High Risk',
    },
    EXTREME: {
      bg: 'bg-red-500/10 border border-red-500/30',
      text: 'text-red-700 dark:text-red-400',
      icon: <XOctagon className="h-7 w-7 text-red-600 dark:text-red-400 shrink-0" />,
      label: 'Extreme Risk',
    },
  }

  const c = config[riskLevel] ?? config.MODERATE

  return (
    <div className={`${c.bg} rounded-xl px-5 py-4 space-y-2`}>
      <div className="flex items-center gap-3">
        {c.icon}
        <span className={`text-2xl font-bold tracking-tight ${c.text}`}>{c.label}</span>
      </div>
      {recommendation && (
        <p className={`text-sm leading-relaxed ${c.text} opacity-90`}>{recommendation}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------------------------

export function ScanResultClient({
  scan,
  flags,
  financialSummary,
  negotiationPlaybook,
  missingProtections,
  externalReferences = [],
}: ScanResultClientProps) {
  const { data: session } = useSession()
  const isLoggedIn = !!session
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL')
  const [highConfidenceOnly, setHighConfidenceOnly] = useState(false)
  const [expandedFlagId, setExpandedFlagId] = useState<number | null>(null)
  const [expandedPlaybookId, setExpandedPlaybookId] = useState<number | null>(null)
  const [copiedPlaybook, setCopiedPlaybook] = useState(false)
  const [reportingFlagId, setReportingFlagId] = useState<number | null>(null)

  // Language toggle state
  const isNonEnglish = scan.language && scan.language !== 'en'
  const [viewLang, setViewLang] = useState<'original' | 'en'>('original')
  const [translating, setTranslating] = useState(false)
  const [translatedData, setTranslatedData] = useState<{
    executiveSummary: string
    flags: Flag[]
    negotiationPlaybook: NegotiationItem[]
    missingProtections: string[]
  } | null>(null)

  async function handleTranslate() {
    if (viewLang === 'original') {
      if (!translatedData) {
        setTranslating(true)
        try {
          const res = await fetch('/api/scan/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scanId: scan.id }),
          })
          const data = await res.json()
          if (!res.ok) {
            toast.error(data.error || 'Translation failed')
            setTranslating(false)
            return
          }
          setTranslatedData(data)
        } catch {
          toast.error('Translation failed')
          setTranslating(false)
          return
        }
        setTranslating(false)
      }
      setViewLang('en')
    } else {
      setViewLang('original')
    }
  }

  // Use translated data when viewing in English
  const displayFlags = viewLang === 'en' && translatedData ? translatedData.flags : flags
  const displaySummary =
    viewLang === 'en' && translatedData ? translatedData.executiveSummary : scan.executiveSummary
  const displayPlaybook =
    viewLang === 'en' && translatedData ? translatedData.negotiationPlaybook : negotiationPlaybook
  const displayProtections =
    viewLang === 'en' && translatedData ? translatedData.missingProtections : missingProtections

  // Separate external reference flags from regular flags
  const externalRefFlags = displayFlags.filter((f) => f.category === 'EXTERNAL_REFERENCE')
  const regularFlags = displayFlags.filter((f) => f.category !== 'EXTERNAL_REFERENCE')

  // Apply filters and sorting
  const sorted = sortedFlags(regularFlags)
  const filtered = sorted
    .filter((f) => activeFilter === 'ALL' || f.severity === activeFilter)
    .filter((f) => !highConfidenceOnly || f.confidence === 'HIGH')

  const riskScore = scan.riskScore ?? 0
  const powerScore = scan.powerImbalanceScore ?? 0

  // ---- Report inaccuracy ----
  async function handleReportInaccuracy(flagId: number) {
    setReportingFlagId(flagId)
    try {
      const res = await fetch('/api/scan/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: scan.id, flagId, feedback: 'INACCURATE' }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit feedback')
      } else {
        toast.success('Thanks for your feedback. We will review this flag.')
      }
    } catch {
      toast.error('Failed to submit feedback')
    }
    setReportingFlagId(null)
  }

  // ---- Copy negotiation playbook ----
  const copyPlaybook = useCallback(() => {
    const lines = displayPlaybook.map((item, i) => {
      const parts = [
        `${i + 1}. ${item.target_section ?? 'Section'}`,
        item.current_language ? `   Current: "${item.current_language}"` : null,
        item.proposed_language ? `   Proposed: "${item.proposed_language}"` : null,
        item.talking_points ? `   Talking points: ${item.talking_points}` : null,
        item.fallback ? `   Fallback: ${item.fallback}` : null,
      ]
      return parts.filter(Boolean).join('\n')
    })
    navigator.clipboard.writeText(lines.join('\n\n'))
    setCopiedPlaybook(true)
    toast.success('Negotiation playbook copied to clipboard')
    setTimeout(() => setCopiedPlaybook(false), 2000)
  }, [displayPlaybook])

  // ---- Share as PNG ----
  const shareResult = useCallback(async () => {
    try {
      const canvas = document.createElement('canvas')
      const w = 600
      const h = 340
      canvas.width = w * 2
      canvas.height = h * 2
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.scale(2, 2)

      // Background
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, '#1e1b4b')
      grad.addColorStop(1, '#0f172a')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(0, 0, w, h, 16)
      ctx.fill()

      // Title
      ctx.fillStyle = '#94a3b8'
      ctx.font = '500 14px system-ui, sans-serif'
      ctx.fillText('SignGuard Contract Analysis', 32, 44)

      ctx.fillStyle = '#f8fafc'
      ctx.font = '700 22px system-ui, sans-serif'
      const title = scan.title || 'Untitled Contract'
      ctx.fillText(title.length > 40 ? title.slice(0, 37) + '...' : title, 32, 78)

      // Risk score circle
      const cx = 120
      const cy = 180
      const r = 56
      const color = gaugeColor(riskScore)

      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = color
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * riskScore) / 10)
      ctx.stroke()

      ctx.fillStyle = color
      ctx.font = '700 36px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(riskScore), cx, cy + 12)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '500 12px system-ui, sans-serif'
      ctx.fillText('Risk Score', cx, cy + r + 24)
      ctx.textAlign = 'start'

      // Risk level
      const riskLevelLabel =
        scan.riskLevel === 'LOW'
          ? 'Low Risk'
          : scan.riskLevel === 'MODERATE'
            ? 'Moderate Risk'
            : scan.riskLevel === 'ELEVATED'
              ? 'Elevated Risk'
              : scan.riskLevel === 'HIGH'
                ? 'High Risk'
                : 'Extreme Risk'
      const riskLevelColor =
        scan.riskLevel === 'LOW'
          ? '#22c55e'
          : scan.riskLevel === 'MODERATE'
            ? '#f59e0b'
            : scan.riskLevel === 'ELEVATED'
              ? '#d97706'
              : scan.riskLevel === 'HIGH'
                ? '#ea580c'
                : '#ef4444'

      ctx.fillStyle = riskLevelColor
      ctx.font = '700 28px system-ui, sans-serif'
      ctx.fillText(riskLevelLabel, 240, 170)

      // Flag counts
      ctx.font = '600 15px system-ui, sans-serif'
      const flagY = 210
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`${scan.flagCountCritical} Critical`, 240, flagY)
      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`${scan.flagCountWarning} Warning`, 370, flagY)
      ctx.fillStyle = '#3b82f6'
      ctx.fillText(`${scan.flagCountInfo} Info`, 490, flagY)

      // Date
      ctx.fillStyle = '#64748b'
      ctx.font = '400 13px system-ui, sans-serif'
      ctx.fillText(
        `Scanned ${format(new Date(scan.createdAt), 'MMM d, yyyy')}`,
        240,
        250
      )

      // Watermark
      ctx.fillStyle = '#475569'
      ctx.font = '500 12px system-ui, sans-serif'
      ctx.fillText('signguard.app', 32, h - 24)

      canvas.toBlob(async (blob) => {
        if (!blob) return
        if (navigator.share) {
          const file = new File([blob], 'scan-result.png', { type: 'image/png' })
          try {
            await navigator.share({ files: [file], title: 'Contract Scan Result' })
            return
          } catch {
            // fallback to download
          }
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scan-${scan.id}.png`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Scan result image downloaded')
      }, 'image/png')
    } catch {
      toast.error('Could not generate share image')
    }
  }, [scan, riskScore])

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="space-y-8 pb-16 max-w-full overflow-x-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* Back link                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={isLoggedIn ? '/dashboard' : '/scan'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isLoggedIn ? 'Back to My Scans' : 'Scan another contract'}
          </Link>
        </Button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Legal Disclaimer Banner                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-600 px-4 py-3">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            SignGuard provides AI-assisted analysis to help you understand contracts. This is
            not legal advice and does not replace professional legal review. AI can miss issues
            or misinterpret clauses. For important agreements, consult a qualified attorney in
            your jurisdiction.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Title Section                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
            {scan.title || 'Untitled Contract'}
          </h1>
          {scan.contractType && (
            <Badge variant="secondary" className="text-xs shrink-0">
              <FileText className="mr-1 h-3 w-3" />
              {scan.contractType}
            </Badge>
          )}
          {scan.jurisdictionDetected && (
            <Badge
              variant="outline"
              className="text-xs border-sky-300 text-sky-700 dark:border-sky-700 dark:text-sky-400 shrink-0"
            >
              <Scale className="mr-1 h-3 w-3" />
              {scan.jurisdictionDetected}
            </Badge>
          )}
          {scan.language && scan.language !== 'en' && (
            <Badge variant="outline" className="text-xs shrink-0">
              {scan.language.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground">
            Scanned on {format(new Date(scan.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            {scan.sourceFileName && (
              <span className="ml-2 text-muted-foreground/70">
                &middot; {scan.sourceFileName}
              </span>
            )}
          </p>
          {isNonEnglish && (
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              {translating
                ? 'Translating...'
                : viewLang === 'original'
                  ? 'View in English'
                  : `View original (${scan.language?.toUpperCase()})`}
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Analysis Completeness Bar                                        */}
      {/* ---------------------------------------------------------------- */}
      {scan.analysisCompleteness != null && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Analysis completeness: {scan.analysisCompleteness}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${completenessColor(scan.analysisCompleteness)}`}
              style={{ width: `${Math.min(scan.analysisCompleteness, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Risk Level Banner                                                */}
      {/* ---------------------------------------------------------------- */}
      {scan.riskLevel && (
        <RiskLevelBanner riskLevel={scan.riskLevel} recommendation={scan.recommendation} />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Risk Score + Power Imbalance Gauges                              */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-start gap-6 flex-wrap">
        <div className="relative flex flex-col items-center">
          <CircularGauge score={riskScore} size={120} strokeWidth={10} label="Risk Score" />
        </div>
        <div className="relative flex flex-col items-center">
          <CircularGauge
            score={powerScore}
            size={88}
            strokeWidth={8}
            label="Power Imbalance"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Executive Summary                                                */}
      {/* ---------------------------------------------------------------- */}
      {displaySummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{displaySummary}</p>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Financial Exposure                                               */}
      {/* ---------------------------------------------------------------- */}
      {financialSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-emerald-500" />
              Financial Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {(
                [
                  { label: 'Base Cost', key: 'base_cost' as const },
                  { label: 'Hidden Costs', key: 'hidden_costs' as const },
                  { label: 'Total First Year', key: 'total_first_year' as const },
                  { label: 'Total Commitment', key: 'total_commitment' as const },
                  { label: 'Exit Cost', key: 'exit_cost' as const },
                ] as const
              ).map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-lg font-bold">{financialSummary[key] ?? '--'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* External References                                              */}
      {/* ---------------------------------------------------------------- */}
      {externalRefFlags.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="bg-amber-500/5">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
              <ExternalLink className="h-5 w-5" />
              External References
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
              This contract references {externalRefFlags.length} external document
              {externalRefFlags.length !== 1 ? 's' : ''} that may contain additional terms,
              obligations, or restrictions not analyzed here.
            </p>
            <ul className="space-y-2">
              {externalRefFlags.map((flag) => (
                <li
                  key={flag.id}
                  className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{flag.title}</span>
                    {flag.why_it_matters && (
                      <p className="text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                        {flag.why_it_matters}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Flags                                                            */}
      {/* ---------------------------------------------------------------- */}
      {regularFlags.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Flags &amp; Issues
            </h2>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'ALL' as const, label: 'All', count: regularFlags.length },
                {
                  key: 'CRITICAL' as const,
                  label: 'Critical',
                  count: regularFlags.filter((f) => f.severity === 'CRITICAL').length,
                },
                {
                  key: 'WARNING' as const,
                  label: 'Warning',
                  count: regularFlags.filter((f) => f.severity === 'WARNING').length,
                },
                {
                  key: 'INFO' as const,
                  label: 'Info',
                  count: regularFlags.filter((f) => f.severity === 'INFO').length,
                },
              ] as const
            ).map(({ key, label, count }) => (
              <Button
                key={key}
                variant={activeFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(key)}
              >
                {label} ({count})
              </Button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={highConfidenceOnly}
                  onChange={(e) => setHighConfidenceOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  High confidence only
                </span>
              </label>
            </div>
          </div>

          {/* Showing count */}
          {(activeFilter !== 'ALL' || highConfidenceOnly) && (
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} of {regularFlags.length} flags
            </p>
          )}

          {/* Flag cards */}
          <div className="space-y-3">
            {filtered.map((flag) => {
              const isExpanded = expandedFlagId === flag.id
              const isLowConfidence = flag.confidence === 'LOW'
              return (
                <Card
                  key={flag.id}
                  className={`overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${isLowConfidence ? 'opacity-70' : ''}`}
                  onClick={() => setExpandedFlagId(isExpanded ? null : flag.id)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 flex-wrap">
                    <Badge className={`${severityColor(flag.severity)} shrink-0`}>
                      {flag.severity}
                    </Badge>
                    <Badge className={`${confidenceColor(flag.confidence)} shrink-0 text-xs`}>
                      {flag.confidence}
                    </Badge>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {flag.category}
                    </Badge>
                    <span className="font-medium flex-1 text-sm min-w-0 break-words">
                      {flag.title}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      className="border-t px-4 pb-5 pt-4 space-y-4 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {flag.what_it_says && (
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">
                            What it says
                          </p>
                          <p>{flag.what_it_says}</p>
                        </div>
                      )}

                      {flag.why_it_matters && (
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">
                            Why it matters
                          </p>
                          <p>{flag.why_it_matters}</p>
                        </div>
                      )}

                      {flag.the_trap && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                          <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                            The Trap
                          </p>
                          <p className="text-red-700 dark:text-red-300">{flag.the_trap}</p>
                        </div>
                      )}

                      {flag.original_text && (
                        <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground break-words">
                          &ldquo;{flag.original_text}&rdquo;
                        </blockquote>
                      )}

                      {flag.financial_impact && (
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">
                            Financial Impact
                          </p>
                          <p>{flag.financial_impact}</p>
                        </div>
                      )}

                      {flag.negotiation_leverage && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Scale className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Negotiation Leverage:
                          </span>
                          <Badge variant="outline">{flag.negotiation_leverage}</Badge>
                        </div>
                      )}

                      {flag.recommendation && (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                            Recommendation
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-300">
                            {flag.recommendation}
                          </p>
                        </div>
                      )}

                      {flag.jurisdiction_note && (
                        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3">
                          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-1.5">
                            <Scale className="h-3.5 w-3.5" />
                            Jurisdiction Note
                          </p>
                          <p className="text-sky-700 dark:text-sky-300 text-sm">
                            {flag.jurisdiction_note}
                          </p>
                        </div>
                      )}

                      {flag.confidence_reason && (
                        <p className="text-xs italic text-muted-foreground">
                          Confidence: {flag.confidence_reason}
                        </p>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-red-600"
                          disabled={reportingFlagId === flag.id}
                          onClick={() => handleReportInaccuracy(flag.id)}
                        >
                          <ThumbsDown className="mr-1.5 h-3.5 w-3.5" />
                          {reportingFlagId === flag.id
                            ? 'Reporting...'
                            : 'Report inaccuracy'}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No flags match the current filters.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* External References                                              */}
      {/* ---------------------------------------------------------------- */}
      {externalReferences.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ExternalLink className="h-5 w-5 text-amber-500" />
              External References ({externalReferences.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This contract references documents we could not analyze. Request copies before signing.
            </p>
            {externalReferences.map((ref, idx) => (
              <div key={idx} className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-1">
                <p className="font-medium text-sm">{ref.document}</p>
                {ref.what_it_governs && <p className="text-xs text-muted-foreground">Governs: {ref.what_it_governs}</p>}
                {ref.risk && <p className="text-xs text-amber-700 dark:text-amber-400">{ref.risk}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Missing Protections                                              */}
      {/* ---------------------------------------------------------------- */}
      {displayProtections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-amber-500" />
              Missing Protections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {displayProtections.map((item, idx) => {
                const mp = typeof item === 'string' ? { protection: item } : item
                return (
                  <li key={idx} className="text-sm space-y-1">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-medium">{(mp as MissingProtection).protection}</p>
                        {(mp as MissingProtection).why_it_matters && (
                          <p className="text-muted-foreground text-xs mt-0.5">{(mp as MissingProtection).why_it_matters}</p>
                        )}
                        {(mp as MissingProtection).suggested_language && (
                          <p className="text-xs text-green-700 dark:text-green-400 mt-1 italic">
                            Suggested clause: &ldquo;{(mp as MissingProtection).suggested_language}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Negotiation Playbook                                             */}
      {/* ---------------------------------------------------------------- */}
      {displayPlaybook.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Negotiation Playbook
            </h2>
            <Button variant="outline" size="sm" onClick={copyPlaybook}>
              {copiedPlaybook ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copiedPlaybook ? 'Copied' : 'Copy all'}
            </Button>
          </div>

          <div className="space-y-3">
            {displayPlaybook.map((item, idx) => {
              const isExpanded = expandedPlaybookId === idx
              return (
                <Card
                  key={idx}
                  className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => setExpandedPlaybookId(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {item.priority ?? idx + 1}
                    </span>
                    <span className="font-medium flex-1 text-sm min-w-0 break-words">
                      {item.target_section ?? `Point ${idx + 1}`}
                    </span>
                    {item.likelihood_of_success && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {item.likelihood_of_success}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {isExpanded && (
                    <div
                      className="border-t px-4 pb-5 pt-4 space-y-4 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.current_language && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                          <p className="font-semibold text-red-600 dark:text-red-400 text-xs uppercase tracking-wider mb-1">
                            Current Language
                          </p>
                          <p className="text-red-700 dark:text-red-300 break-words">
                            &ldquo;{item.current_language}&rdquo;
                          </p>
                        </div>
                      )}

                      {item.proposed_language && (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider mb-1">
                            Proposed Language
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-300 break-words">
                            &ldquo;{item.proposed_language}&rdquo;
                          </p>
                        </div>
                      )}

                      {item.talking_points && (
                        <div>
                          <p className="font-semibold text-muted-foreground mb-2">
                            Talking Points
                          </p>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {item.talking_points}
                          </p>
                        </div>
                      )}

                      {item.fallback && (
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">
                            Fallback Position
                          </p>
                          <p className="text-muted-foreground">{item.fallback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Bottom Actions                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await generatePdfReport(
                scan,
                displayFlags,
                financialSummary,
                displayPlaybook,
                displayProtections as any,
                externalReferences
              )
              toast.success('PDF report downloaded')
            } catch {
              toast.error('Failed to generate PDF')
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF Report
        </Button>
        <Button onClick={shareResult} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Share Result
        </Button>
        <Button asChild>
          <Link href="/scan">
            <FileText className="mr-2 h-4 w-4" />
            Scan Another Contract
          </Link>
        </Button>
      </div>

      {/* Bottom liability disclaimer */}
      <p className="text-xs text-muted-foreground/60 leading-relaxed mt-6">
        SignGuard analyses are generated by AI and may contain errors or omissions. Contract law varies by jurisdiction and specific circumstances. This analysis does not consider verbal agreements, course of dealing, or external context not present in the uploaded document. Always consult a qualified legal professional before making decisions based on this analysis.
      </p>
    </div>
  )
}
