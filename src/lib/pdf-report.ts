// pdfmake loaded dynamically in generatePdfReport to avoid SSR issues

interface Flag {
  id?: number
  section?: string
  category: string
  severity: string
  confidence?: string
  title: string
  what_it_says: string
  why_it_matters: string
  the_trap?: string | null
  original_text?: string
  financial_impact?: string | null
  recommendation?: string
  jurisdiction_note?: string | null
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

interface FinancialSummary {
  base_cost?: string
  hidden_costs?: string
  total_first_year?: string
  total_commitment?: string
  exit_cost?: string
}

interface MissingProtection {
  protection: string
  why_it_matters?: string
  suggested_language?: string
}

interface ExternalRef {
  document: string
  what_it_governs?: string
  risk?: string
}

interface ScanData {
  title: string | null
  contractType: string | null
  riskScore: number | null
  riskLevel: string | null
  recommendation: string | null
  executiveSummary: string | null
  jurisdictionDetected: string | null
  language: string | null
  createdAt: string
}

const COLORS = {
  primary: '#4F46E5',
  critical: '#DC2626',
  warning: '#D97706',
  info: '#2563EB',
  green: '#16A34A',
  purple: '#7C3AED',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
}

function sevColor(s: string) {
  return s === 'CRITICAL' ? COLORS.critical : s === 'WARNING' ? COLORS.warning : COLORS.info
}

function riskColor(level: string) {
  const m: Record<string, string> = {
    LOW: '#22C55E', MODERATE: '#F59E0B', ELEVATED: '#D97706', HIGH: '#F97316', EXTREME: '#DC2626',
  }
  return m[level] || COLORS.gray
}

export async function generatePdfReport(
  scan: ScanData,
  flags: Flag[],
  financialSummary: FinancialSummary | null,
  negotiationPlaybook: NegotiationItem[],
  missingProtections: (string | MissingProtection)[],
  externalReferences: ExternalRef[] = []
) {
  // Dynamic import — pdfmake must be loaded client-side only
  const pdfMakeModule = await import('pdfmake/build/pdfmake')
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts')
  const pdfMake: any = pdfMakeModule.default || pdfMakeModule
  pdfMake.vfs = (pdfFontsModule as any).pdfMake?.vfs || (pdfFontsModule as any).default?.pdfMake?.vfs || pdfFontsModule

  const dateStr = new Date(scan.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const content: any[] = []

  // Header is rendered via the header function below — no content header needed
  // Add spacer to push content below the header bar
  content.push({ text: '', margin: [0, 0, 0, 0] })

  // === LEGAL DISCLAIMER ===
  content.push({
    text: 'AI-powered analysis — not legal advice. This report highlights potential issues but may miss problems or misinterpret clauses. For significant agreements, consult a qualified attorney.',
    fontSize: 7.5,
    italics: true,
    color: COLORS.gray,
    fillColor: '#F8F8FF',
    margin: [0, 0, 0, 12],
  })

  // === TITLE ===
  content.push({
    text: scan.title || 'Contract Analysis',
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 4],
  })

  const metaParts: string[] = []
  if (scan.contractType) metaParts.push(`Type: ${scan.contractType}`)
  if (scan.jurisdictionDetected) metaParts.push(`Jurisdiction: ${scan.jurisdictionDetected}`)
  if (scan.language) metaParts.push(`Language: ${scan.language.toUpperCase()}`)
  if (metaParts.length > 0) {
    content.push({
      text: metaParts.join('  |  '),
      fontSize: 8,
      color: COLORS.gray,
      margin: [0, 0, 0, 8],
    })
  }

  // === RISK LEVEL ===
  if (scan.riskLevel) {
    const rc = riskColor(scan.riskLevel)
    const scoreText = scan.riskScore !== null ? `  —  Score: ${scan.riskScore.toFixed(1)}/10` : ''
    content.push({
      text: [
        { text: ` ${scan.riskLevel} RISK `, bold: true, color: 'white', background: rc, fontSize: 11 },
        { text: scoreText, bold: true, fontSize: 11 },
      ],
      margin: [0, 0, 0, 8],
    })
  }

  // === RECOMMENDATION ===
  if (scan.recommendation) {
    content.push({
      text: scan.recommendation,
      fontSize: 9.5,
      color: '#374151',
      fillColor: '#F8F8FF',
      margin: [0, 0, 0, 12],
    })
  }

  // === EXECUTIVE SUMMARY ===
  if (scan.executiveSummary) {
    content.push({ text: 'Executive Summary', style: 'sectionHeader' })
    content.push({
      text: scan.executiveSummary,
      fontSize: 10,
      margin: [0, 0, 0, 12],
    })
  }

  // === FINANCIAL SUMMARY ===
  if (financialSummary) {
    const rows: [string, string][] = [
      ['Base Cost', financialSummary.base_cost || 'Not specified'],
      ['Hidden Costs', financialSummary.hidden_costs || 'None identified'],
      ['Total First Year', financialSummary.total_first_year || 'Cannot be determined'],
      ['Total Commitment', financialSummary.total_commitment || 'Cannot be determined'],
      ['Exit Cost', financialSummary.exit_cost || 'Not specified'],
    ]

    content.push({ text: 'Financial Exposure', style: 'sectionHeader' })
    content.push({
      table: {
        widths: [100, '*'],
        body: rows.map(([label, value]) => [
          { text: label, bold: true, fontSize: 9, color: COLORS.gray },
          { text: value, fontSize: 9 },
        ]),
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => '#E5E7EB',
        paddingTop: () => 3,
        paddingBottom: () => 3,
      },
      margin: [0, 0, 0, 12],
    })
  }

  // === EXTERNAL REFERENCES ===
  if (externalReferences.length > 0) {
    content.push({ text: `External References (${externalReferences.length})`, style: 'sectionHeader' })
    content.push({
      text: 'This contract references documents not included in the analysis. Obtain and review these before signing.',
      fontSize: 8,
      italics: true,
      color: COLORS.warning,
      margin: [0, 0, 0, 6],
    })
    for (const ref of externalReferences) {
      const parts: any[] = [{ text: `- ${ref.document}`, bold: true, fontSize: 9 }]
      if (ref.what_it_governs) parts.push({ text: `\n  Governs: ${ref.what_it_governs}`, fontSize: 8 })
      if (ref.risk) parts.push({ text: `\n  Risk: ${ref.risk}`, fontSize: 8, color: COLORS.warning })
      content.push({ text: parts, margin: [0, 0, 0, 4] })
    }
    content.push({ text: '', margin: [0, 0, 0, 8] })
  }

  // === FLAGS ===
  if (flags.length > 0) {
    const sortOrder: Record<string, number> = { CRITICAL: 0, WARNING: 1, INFO: 2 }
    const sorted = [...flags].sort((a, b) => (sortOrder[a.severity] ?? 3) - (sortOrder[b.severity] ?? 3))

    content.push({ text: `Issues Found (${flags.length})`, style: 'sectionHeader' })

    for (const flag of sorted) {
      const sc = sevColor(flag.severity)

      // Severity + Category line
      content.push({
        text: [
          { text: ` ${flag.severity} `, bold: true, color: 'white', background: sc, fontSize: 7 },
          { text: `  ${flag.category.replace(/_/g, ' ')}`, fontSize: 7, color: COLORS.gray },
          flag.section ? { text: `  [${flag.section}]`, fontSize: 7, color: COLORS.gray } : {},
        ],
        margin: [0, 6, 0, 2],
      })

      // Title
      content.push({ text: flag.title, bold: true, fontSize: 10, margin: [0, 0, 0, 2] })

      // What it says
      if (flag.what_it_says) {
        content.push({ text: flag.what_it_says, fontSize: 9, margin: [0, 0, 0, 2] })
      }

      // Why it matters
      if (flag.why_it_matters) {
        content.push({ text: `Why it matters: ${flag.why_it_matters}`, fontSize: 9, italics: true, margin: [0, 0, 0, 2] })
      }

      // The trap
      if (flag.the_trap) {
        content.push({ text: `[TRAP] ${flag.the_trap}`, fontSize: 9, bold: true, color: COLORS.critical, margin: [4, 0, 0, 2] })
      }

      // Financial impact
      if (flag.financial_impact) {
        content.push({ text: `Financial impact: ${flag.financial_impact}`, fontSize: 9, bold: true, color: COLORS.critical, margin: [0, 0, 0, 2] })
      }

      // Recommendation
      if (flag.recommendation) {
        content.push({ text: `Recommendation: ${flag.recommendation}`, fontSize: 9, color: COLORS.green, margin: [0, 0, 0, 2] })
      }

      // Jurisdiction note
      if (flag.jurisdiction_note) {
        content.push({ text: `Jurisdiction: ${flag.jurisdiction_note}`, fontSize: 8, italics: true, color: COLORS.purple, margin: [0, 2, 0, 2] })
      }

      // Separator
      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#E5E7EB' }],
        margin: [0, 4, 0, 2],
      })
    }
  }

  // === MISSING PROTECTIONS ===
  if (missingProtections.length > 0) {
    content.push({ text: 'Missing Protections', style: 'sectionHeader' })
    for (const mp of missingProtections) {
      const prot = typeof mp === 'string' ? mp : mp.protection
      content.push({ text: `- ${prot}`, bold: true, fontSize: 9, margin: [0, 0, 0, 1] })
      if (typeof mp !== 'string') {
        if (mp.why_it_matters) content.push({ text: `  ${mp.why_it_matters}`, fontSize: 8, margin: [4, 0, 0, 1] })
        if (mp.suggested_language) content.push({ text: `  Suggested: "${mp.suggested_language}"`, fontSize: 8, italics: true, color: COLORS.green, margin: [4, 0, 0, 1] })
      }
      content.push({ text: '', margin: [0, 0, 0, 3] })
    }
  }

  // === NEGOTIATION PLAYBOOK ===
  if (negotiationPlaybook.length > 0) {
    content.push({ text: 'Negotiation Playbook', style: 'sectionHeader' })
    for (let i = 0; i < negotiationPlaybook.length; i++) {
      const item = negotiationPlaybook[i]
      content.push({
        text: `${item.priority || i + 1}. ${item.target_section || 'Section'}`,
        bold: true, fontSize: 10, margin: [0, 4, 0, 2],
      })
      if (item.current_language) {
        content.push({ text: `Current: "${item.current_language}"`, fontSize: 9, color: COLORS.critical, margin: [8, 0, 0, 1] })
      }
      if (item.proposed_language) {
        content.push({ text: `Proposed: "${item.proposed_language}"`, fontSize: 9, color: COLORS.green, margin: [8, 0, 0, 1] })
      }
      if (item.talking_points) {
        content.push({ text: `Talking points: ${item.talking_points}`, fontSize: 8, italics: true, margin: [8, 0, 0, 1] })
      }
      if (item.likelihood_of_success) {
        content.push({ text: `Likelihood: ${item.likelihood_of_success}`, fontSize: 8, color: COLORS.gray, margin: [8, 0, 0, 1] })
      }
      if (item.fallback) {
        content.push({ text: `Fallback: ${item.fallback}`, fontSize: 9, margin: [8, 0, 0, 1] })
      }
      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.3, lineColor: '#E5E7EB' }],
        margin: [0, 4, 0, 0],
      })
    }
  }

  // === IMPORTANT LIMITATIONS ===
  content.push({ text: '', margin: [0, 0, 0, 12] })
  content.push({ text: 'Important Limitations', style: 'sectionHeader' })
  const limitations = [
    'AI analysis may miss issues, misinterpret clauses, or flag standard terms as problematic.',
    'This analysis only covers the text provided - referenced documents were not analyzed unless included.',
    'Legal interpretation depends on jurisdiction, context, and specific circumstances not available to the AI.',
    'This report does not constitute legal advice and should not be the sole basis for legal or financial decisions.',
    'For contracts involving significant commitments, consult a qualified attorney in the relevant jurisdiction.',
  ]
  for (const lim of limitations) {
    content.push({ text: `- ${lim}`, fontSize: 8, margin: [0, 0, 0, 2] })
  }
  content.push({
    text: 'SignGuard accepts no liability for decisions made based on this analysis.',
    bold: true, fontSize: 8, color: COLORS.gray, margin: [0, 6, 0, 0],
  })

  // === BUILD DOCUMENT ===
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 50],
    content,
    styles: {
      sectionHeader: {
        fontSize: 13,
        bold: true,
        margin: [0, 12, 0, 6],
        decoration: 'underline',
        decorationColor: '#E5E7EB',
      },
    },
    header: (currentPage: number) => {
      if (currentPage === 1) {
        // Page 1: prominent branded header with shield symbol
        return {
          stack: [
            // Indigo background bar
            {
              canvas: [
                { type: 'rect', x: 0, y: 0, w: 595.28, h: 44, color: COLORS.primary },
              ],
            },
            // Text overlay positioned on top of the bar
            {
              columns: [
                {
                  text: [
                    { text: '\u25C6 ', fontSize: 14 }, // diamond as shield stand-in
                    { text: 'SignGuard', fontSize: 16, bold: true },
                  ],
                  color: 'white',
                  margin: [40, 0, 0, 0],
                },
                {
                  text: `Contract Risk Analysis Report\n${dateStr}`,
                  fontSize: 8,
                  color: '#C7D2FE', // light indigo
                  alignment: 'right',
                  margin: [0, 3, 40, 0],
                },
              ],
              margin: [0, -32, 0, 0], // pull up onto the canvas bar
            },
          ],
        }
      }
      // Pages 2+: subtle text header
      return {
        text: `SignGuard  —  ${scan.title || 'Contract Analysis'}`,
        fontSize: 8,
        color: COLORS.gray,
        margin: [40, 20, 40, 0],
      }
    },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: 'Generated by SignGuard | AI-powered analysis — not a substitute for legal review', fontSize: 7, color: COLORS.gray },
        { text: `Page ${currentPage} of ${pageCount}`, fontSize: 7, color: COLORS.gray, alignment: 'right' },
      ],
      margin: [40, 10, 40, 0],
    }),
    defaultStyle: {
      font: 'Roboto',
    },
  }

  const safeTitle = (scan.title || 'contract').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 40)
  const dateFile = new Date(scan.createdAt).toISOString().slice(0, 10)

  pdfMake.createPdf(docDefinition).download(`SignGuard_Report_${safeTitle}_${dateFile}.pdf`)
}
