import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { anthropic } from '@/lib/ai/client'

export const maxDuration = 60

const MAX_TEXT = 15000

function buildSystemPrompt(contractType?: string, signerRole?: string): string {
  const ctx = contractType && contractType !== 'OTHER'
    ? `\nContract type: ${contractType.replace(/_/g, ' ')}. Signer role: ${
        signerRole === 'INDIVIDUAL' ? 'individual consumer' :
        signerRole === 'SMALL_BUSINESS' ? 'small business' :
        signerRole === 'COMPANY' ? 'company representative' : 'unspecified'
      }. Flag what is UNUSUAL for this type. Apply jurisdiction-specific protections.\n` : ''

  return `Senior contract attorney reviewing a contract before signing. Protect the signer from every risk.

RULES:
- Detect contract language. Return ALL analysis in that language (JSON keys stay English).
- Identify jurisdiction from governing law clauses, addresses, entity types (GmbH/AG/Ltd/LLC/SAS).
- Flag every problematic clause individually. 20+ issues = 20+ flags.
- Confidence: HIGH (clear risk), MEDIUM (interpretation-dependent), LOW (ambiguous).
- Verify section numbers exist. Say "within the agreement" if unsure.
${ctx}
CHECK ALL: auto-renewal, price escalation, hidden fees, uncapped charges, late payment penalties, tax gross-up, termination penalties, payment during suspension, volume clawbacks | data licensing beyond service, derived/aggregated data ownership, cross-border transfers, subprocessor changes, feedback licenses, custom work ownership, marketing rights, no data deletion timeline | long notice periods (>30d=aggressive), cancellation restrictions, liquidated damages, no termination for convenience, asymmetric termination, post-termination restrictions | one-sided indemnification, low liability caps, warranty disclaimers, beta exclusions, mandatory arbitration, class action waiver, non-disparagement, pricing confidentiality | unilateral term changes, unilateral assignment, audit at signer cost, survival clauses | definitional traps (redefining terms to limit signer rights), AS-IS disclaimers, fitness disclaimers | separate data breach caps, cap carve-outs favoring provider, "preceding 12 months" caps | external document references, "as updated from time to time" clauses.

Return ONLY valid JSON:
{
  "contract_type":"string",
  "language":"ISO code",
  "jurisdiction_detected":"string",
  "jurisdiction_code":"ISO code",
  "parties":{"provider":"string","signer":"string"},
  "risk_score":7.5,
  "power_imbalance_score":8.0,
  "power_imbalance_explanation":"string",
  "executive_summary":"2-3 sentences, use 'you', IN CONTRACT LANGUAGE",
  "financial_summary":{"base_cost":"string|null","hidden_costs":"string|null","total_first_year":"string|null","total_commitment":"string|null","exit_cost":"string|null"},
  "flags":[{"id":1,"section":"string","category":"AUTO_RENEWAL|PRICE_ESCALATION|HIDDEN_FEES|CANCELLATION_TRAP|DATA_RIGHTS|DATA_TRANSFER|IP_OWNERSHIP|FEEDBACK_LICENSE|LIABILITY_CAP|INDEMNIFICATION|WARRANTY_DISCLAIMER|NON_COMPETE|NON_SOLICITATION|NON_DISPARAGEMENT|CONFIDENTIALITY|GOVERNING_LAW|UNILATERAL_CHANGES|UNILATERAL_ASSIGNMENT|AUDIT_RIGHTS|LIQUIDATED_DAMAGES|SCOPE_CREEP|SURVIVAL_CLAUSE|MARKETING_RIGHTS|TAX_OBLIGATIONS|PAYMENT_TERMS|EXTERNAL_REFERENCE|REPRESENTATIONS_EXCLUDED|WAIVER_OF_RIGHTS","severity":"CRITICAL|WARNING|INFO","confidence":"HIGH|MEDIUM|LOW","title":"string","what_it_says":"string","why_it_matters":"string","the_trap":"string|null","original_text":"quote<100words","financial_impact":"string|null","jurisdiction_note":"string|null","negotiation_leverage":"LOW|MEDIUM|HIGH","recommendation":"string"}],
  "missing_protections":[{"protection":"string","why_it_matters":"string","suggested_language":"string"}],
  "negotiation_playbook":[{"priority":1,"target_section":"string","current_language":"string","proposed_language":"string","talking_points":"string","likelihood_of_success":"HIGH|MEDIUM|LOW","fallback":"string"}],
  "external_references":[{"document":"string","url_or_location":"string|null","what_it_governs":"string","risk":"string"}],
  "risk_level":"LOW|MODERATE|ELEVATED|HIGH|EXTREME",
  "recommendation":"2-3 sentences, never say safe to sign or do not sign",
  "analysis_completeness":85
}`
}

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
    } catch (parseErr: any) {
      console.error('[SCAN] Failed to parse request body:', parseErr.message)
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

    // Truncate to stay within timeout limits
    const originalLength = contractText.length
    if (contractText.length > MAX_TEXT) {
      contractText = contractText.slice(0, MAX_TEXT) + `\n\n[Contract truncated for analysis — original was ${originalLength} characters. Key clauses may appear in the omitted portion.]`
    }

    console.log('[SCAN] Calling Claude API...', { originalLength, truncatedTo: contractText.length, sourceType })

    const systemPrompt = buildSystemPrompt(contractType, signerRole)
    const userMessage = `Analyze this contract. Detect language and jurisdiction. Flag EVERY problematic clause. Return JSON per system prompt.\n\n${contractText}`

    // Use streaming to keep Netlify connection alive
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const response = await stream.finalMessage()

    console.log('[SCAN] Claude responded')

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    let result: any
    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('[SCAN] JSON parse failed, raw:', cleaned.slice(0, 200))
      return NextResponse.json({ error: 'Analysis returned invalid data. Please try again.' }, { status: 500 })
    }

    console.log('[SCAN] Parsed OK, flags:', result.flags?.length || 0)

    const flags = result.flags || []
    const externalRefs = result.external_references || []
    const missingProtections = result.missing_protections || []

    const scan = await prisma.contractScan.create({
      data: {
        userId,
        title: title || result.contract_type || 'Contract Scan',
        contractType: contractType || result.contract_type || null,
        signerRole: signerRole || null,
        sourceType,
        sourceFileName: fileName || null,
        sourceUrl: url || null,
        language: result.language || null,
        jurisdictionDetected: result.jurisdiction_detected || null,
        jurisdictionCode: result.jurisdiction_code || null,
        riskScore: result.risk_score,
        powerImbalanceScore: result.power_imbalance_score ?? null,
        riskLevel: result.risk_level || null,
        recommendation: result.recommendation || null,
        executiveSummary: result.executive_summary || null,
        financialSummary: result.financial_summary ? JSON.stringify(result.financial_summary) : null,
        flags: JSON.stringify(flags),
        negotiationPlaybook: result.negotiation_playbook ? JSON.stringify(result.negotiation_playbook) : null,
        missingProtections: JSON.stringify({ protections: missingProtections, externalRefs }),
        flagCountCritical: flags.filter((f: any) => f.severity === 'CRITICAL').length,
        flagCountWarning: flags.filter((f: any) => f.severity === 'WARNING').length,
        flagCountInfo: flags.filter((f: any) => f.severity === 'INFO').length,
        analysisCompleteness: originalLength > MAX_TEXT
          ? Math.round((MAX_TEXT / originalLength) * 100)
          : (result.analysis_completeness ?? null),
      },
    })

    return NextResponse.json({ id: scan.id })
  } catch (error: any) {
    console.error('[SCAN] Error:', error.message || error)

    if (error.status === 429) {
      return NextResponse.json({ error: 'High demand. Please try again in a moment.' }, { status: 429 })
    }
    if (error.status === 401 || error.status === 403 || error.message?.includes('credit')) {
      return NextResponse.json({ error: 'Analysis service unavailable. Please try again later.' }, { status: 503 })
    }

    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
