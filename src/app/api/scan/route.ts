import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { anthropic } from '@/lib/ai/client'

// Allow up to 60s for Claude API analysis (Netlify/Vercel serverless timeout)
export const maxDuration = 60

function buildSystemPrompt(contractType?: string, signerRole?: string): string {
  const contextBlock = contractType && contractType !== 'OTHER'
    ? `\nThe user identified this as a ${contractType.replace(/_/g, ' ')} contract and they are signing as ${
        signerRole === 'INDIVIDUAL' ? 'an individual (consumer/employee/tenant)' :
        signerRole === 'SMALL_BUSINESS' ? 'a representative of a small business' :
        signerRole === 'COMPANY' ? 'a company representative (procurement/legal)' :
        'an unspecified role'
      }. Calibrate your analysis: compare against standard terms for this specific contract type. Flag what is UNUSUAL for this type, not just what is unfavorable in general. Apply jurisdiction-specific protections relevant to this contract type.\n`
    : ''

  return `You are a senior contract attorney with 25 years of commercial litigation experience. A client has asked you to review this contract BEFORE they sign it. Your job is to protect them from every possible risk — obvious and subtle.

LANGUAGE RULE: Detect the language of the contract. Return your ENTIRE analysis in the same language as the contract. If the contract is in German, write all titles, descriptions, recommendations, and summaries in German. If in French, write in French. The JSON field names stay in English (they're code), but all VALUE strings must be in the contract's language.

JURISDICTION: Identify the governing law from the contract (governing law clauses, registered addresses, entity types: GmbH/AG/Ltd/LLC/SAS/BV). Interpret every legal term according to that jurisdiction's legal system. Flag terms with different legal meaning than their plain-language reading. Note when clauses may be unenforceable under the detected jurisdiction's consumer protection laws. If you cannot determine the jurisdiction, default to general EU/continental European law.
${contextBlock}
ANALYSIS METHODOLOGY — follow this exact process:

STEP 1: Read the entire contract to understand the structure, parties, and relationship.

STEP 2: Go through EVERY section and clause systematically. For EACH clause, ask:
- What obligation does this create for the signer?
- What right does this give to the other party?
- Is this clause mutual or one-sided?
- What happens in the worst case under this clause?
- Is this standard for this contract type, or unusually aggressive?
- Does this clause reference external documents the signer hasn't seen?
- Could this clause cost the signer money they don't expect?
- Does this clause survive termination?

STEP 3: Look for INTERACTIONS between clauses:
- "Reasonable" termination + liquidated damages making termination prohibitively expensive
- "We protect your data" + broad license to use derived data forever
- "Fair pricing" + uncapped usage-based charges
- Indemnification making the signer liable for the provider's own failures

STEP 4: Check for MISSING protections:
- No SLA with meaningful remedies? No data portability on termination? No price cap? No termination for convenience? No mutual indemnification? No breach notification timeline? No force majeure for the signer?

STEP 5: Check for POWER ASYMMETRIES:
- Can the provider do things the signer can't? (assign, modify terms, terminate)
- Are liability caps equal or one-sided? Who bears dispute costs? Who owns what after termination?

CRITICAL CATEGORIES — check ALL of these:

FINANCIAL TRAPS: Auto-renewal (notice period? renewal length?), price escalation (caps?), hidden fees (activation, processing, maintenance, overage, surcharges), volume commitment clawbacks, uncapped variable charges, late payment penalties (interest, compounding), tax gross-up clauses, professional services billed regardless of satisfaction, early termination penalties, payment during service suspension.

DATA AND IP TRAPS: Broad license beyond service provision, provider owns derived/aggregated data, data transfer to any country, subprocessor changes without remedy, perpetual feedback/suggestion license, provider owns custom work, marketing rights without opt-in, no data deletion timeline after termination.

EXIT TRAPS: Long notice periods (>30 days = aggressive), cancellation method restrictions, liquidated damages framed as "not a penalty," no termination for convenience, asymmetric termination rights, post-termination restrictions, short data export window.

LIABILITY AND LEGAL TRAPS: One-sided indemnification, low liability caps, broad warranty disclaimers, beta features excluded from warranties, mandatory arbitration, class action waiver, non-disparagement, pricing confidentiality, signer acknowledges no reliance on representations.

UNILATERAL POWER: Modify terms by posting to URL, change features/pricing unilaterally, assign freely but signer cannot, audit at signer's cost, survival clauses extending aggressive terms, sales representations excluded from contract.

DEFINITIONAL TRAPS: Does the contract redefine common terms to limit the signer's rights? E.g., defining "Customer Data" to EXCLUDE aggregated, derived, or usage data — carving up the signer's data before data rights apply. Are terms defined early then used to quietly expand the provider's rights? Read definitions carefully and cross-reference every defined term. Flag any definition that narrows what the signer owns or broadens what the provider owns.

WARRANTY AND GUARANTEE TRAPS: "AS IS" / "AS AVAILABLE" disclaimers — flag explicitly even if common, they eliminate all quality guarantees. Pre-release/beta/early access features excluded from warranties AND indemnification — zero legal recourse if beta causes damage. Disclaimers of fitness for particular purpose — provider takes no responsibility for suitability.

TAX AND PAYMENT TRAPS: Tax gross-up clauses (signer pays additional to ensure provider receives full amount after withholding — can add 20-30% in cross-border). Late payment interest rates (calculate annualized: 1.5%/month = 18%/year; flag >10% annualized as aggressive). Payment obligation surviving suspension (double penalty). Collection costs and attorney's fees charged to signer.

LIABILITY CAP DETAILS: Separate cap for data breaches vs general? Is the data breach cap adequate? (2x annual fees for a major breach is extremely low.) Carve-outs from cap that only benefit provider (signer's payment obligations excluded from caps but provider's obligations are not). Cap referencing "amounts paid in preceding 12 months" — for new customers this could be nearly zero.

You MUST flag every instance. Do not summarize or group related issues. A contract with 20+ problematic clauses should generate 20+ flags.

For each flag, assess confidence:
- HIGH: Clause clearly creates the described risk
- MEDIUM: Interpretation-dependent
- LOW: Possible concern, language is ambiguous

If referencing a section number, verify it exists. Do not invent section numbers — say "within the agreement" if unsure.

Return ONLY valid JSON:
{
  "contract_type": "string",
  "language": "ISO 639-1 code",
  "jurisdiction_detected": "Detected governing law and basis for detection",
  "jurisdiction_code": "ISO country code",
  "parties": { "provider": "string", "signer": "string" },
  "risk_score": 8.5,
  "power_imbalance_score": 8.0,
  "power_imbalance_explanation": "string",
  "executive_summary": "2-3 sentences using 'you' and 'your', IN THE CONTRACT'S LANGUAGE",
  "financial_summary": {
    "base_cost": "string or null",
    "hidden_costs": "string or null",
    "total_first_year": "string or null",
    "total_commitment": "string or null",
    "exit_cost": "string or null"
  },
  "flags": [
    {
      "id": 1,
      "section": "string",
      "category": "AUTO_RENEWAL|PRICE_ESCALATION|HIDDEN_FEES|CANCELLATION_TRAP|DATA_RIGHTS|DATA_TRANSFER|IP_OWNERSHIP|FEEDBACK_LICENSE|LIABILITY_CAP|INDEMNIFICATION|WARRANTY_DISCLAIMER|NON_COMPETE|NON_SOLICITATION|NON_DISPARAGEMENT|CONFIDENTIALITY|GOVERNING_LAW|UNILATERAL_CHANGES|UNILATERAL_ASSIGNMENT|AUDIT_RIGHTS|LIQUIDATED_DAMAGES|SCOPE_CREEP|SURVIVAL_CLAUSE|MARKETING_RIGHTS|TAX_OBLIGATIONS|PAYMENT_TERMS|EXTERNAL_REFERENCE|REPRESENTATIONS_EXCLUDED|WAIVER_OF_RIGHTS",
      "severity": "CRITICAL|WARNING|INFO",
      "confidence": "HIGH|MEDIUM|LOW",
      "title": "string IN CONTRACT LANGUAGE",
      "what_it_says": "string",
      "why_it_matters": "string",
      "the_trap": "string or null",
      "original_text": "exact quote under 100 words",
      "financial_impact": "string or null",
      "jurisdiction_note": "string or null",
      "negotiation_leverage": "LOW|MEDIUM|HIGH",
      "recommendation": "string"
    }
  ],
  "missing_protections": [
    {
      "protection": "string",
      "why_it_matters": "string",
      "suggested_language": "string"
    }
  ],
  "negotiation_playbook": [
    {
      "priority": 1,
      "target_section": "string",
      "current_language": "string",
      "proposed_language": "string",
      "talking_points": "string",
      "likelihood_of_success": "HIGH|MEDIUM|LOW",
      "fallback": "string"
    }
  ],
  "external_references": [
    {
      "document": "string",
      "url_or_location": "string or null",
      "what_it_governs": "string",
      "risk": "string"
    }
  ],
  "risk_level": "LOW|MODERATE|ELEVATED|HIGH|EXTREME",
  "recommendation": "2-3 sentences, never say 'safe to sign' or 'do not sign'",
  "analysis_completeness": 85
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
      return NextResponse.json({ error: 'Request too large or malformed. Try a smaller file or paste text directly.' }, { status: 400 })
    }

    const { text, url, title, documentBase64, documentMediaType, fileName, sourceType: inputSourceType, contractType, signerRole } = body

    console.log('[SCAN] Request received:', {
      hasText: !!text,
      textLen: text?.length || 0,
      hasDoc: !!documentBase64,
      docLen: documentBase64?.length || 0,
      docType: documentMediaType,
      fileName,
      sourceType: inputSourceType,
    })

    let contractText = text || ''
    let sourceType = inputSourceType || 'TEXT'

    if (url && !text && !documentBase64) {
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
          .slice(0, 50000)
      } catch {
        return NextResponse.json({ error: 'Failed to fetch content from the URL. Check the address and try again.' }, { status: 400 })
      }
    }

    if (!contractText && !documentBase64) {
      return NextResponse.json({ error: 'No content to analyze. Please upload a file, paste text, or enter a URL.' }, { status: 400 })
    }

    // Check minimum content length for text-based input
    if (contractText && contractText.split(/\s+/).length < 50) {
      return NextResponse.json({ error: 'The document appears too short for meaningful analysis. Try uploading the complete contract or pasting more text.' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt(contractType, signerRole)
    const analysisInstruction = 'Analyze this contract thoroughly. Detect language and jurisdiction. Flag EVERY problematic clause individually. Return the FULL analysis in the contract\'s language as JSON per the system prompt.'
    const messages: any[] = []

    if (documentBase64 && documentMediaType) {
      const contentType = documentMediaType === 'application/pdf' ? 'document' : 'image'
      messages.push({
        role: 'user',
        content: [
          { type: contentType, source: { type: 'base64', media_type: documentMediaType, data: documentBase64 } },
          { type: 'text', text: analysisInstruction },
        ],
      })
    } else {
      messages.push({ role: 'user', content: `${analysisInstruction}\n\n${contractText.slice(0, 50000)}` })
    }

    // Call Claude API
    console.log('[SCAN] Calling Claude API...', { hasDocBase64: !!documentBase64, textLength: contractText?.length || 0 })

    let result: any
    let lastError: any = null

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          temperature: 0,
          system: systemPrompt,
          messages,
        })

        console.log('[SCAN] Claude responded, parsing JSON...')

        const responseText = response.content
          .filter(b => b.type === 'text')
          .map(b => (b as { type: 'text'; text: string }).text)
          .join('')

        const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
        result = JSON.parse(cleaned)
        console.log('[SCAN] Parsed successfully, flags:', result.flags?.length || 0)
        break
      } catch (err: any) {
        lastError = err
        console.error(`[SCAN] Attempt ${attempt + 1} failed:`, err.message || err)

        // Don't retry on auth/billing errors — they won't resolve
        if (err.status === 401 || err.status === 403 || err.message?.includes('credit')) {
          console.error('[SCAN] Auth/billing error, not retrying')
          break
        }

        if (attempt === 1) {
          console.error('[SCAN] Both attempts failed')
        }
      }
    }

    if (!result) {
      const msg = lastError?.message || 'Unknown error'
      console.error('[SCAN] Analysis failed completely:', msg)

      if (lastError?.status === 401 || lastError?.status === 403) {
        return NextResponse.json({ error: 'API authentication failed. Check your API key configuration.' }, { status: 503 })
      }
      if (msg.includes('credit')) {
        return NextResponse.json({ error: 'Analysis service temporarily unavailable. Please try again later.' }, { status: 503 })
      }
      return NextResponse.json({ error: 'We had trouble analyzing this document. Please try again.' }, { status: 500 })
    }

    const flags = result.flags || []
    const criticalCount = flags.filter((f: any) => f.severity === 'CRITICAL').length
    const warningCount = flags.filter((f: any) => f.severity === 'WARNING').length
    const infoCount = flags.filter((f: any) => f.severity === 'INFO').length

    // Store external_references as part of flags or separately in missingProtections
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
        flagCountCritical: criticalCount,
        flagCountWarning: warningCount,
        flagCountInfo: infoCount,
        analysisCompleteness: result.analysis_completeness ?? null,
      },
    })

    return NextResponse.json({ id: scan.id })
  } catch (error: any) {
    console.error('Scan error:', error)

    // User-friendly error messages
    if (error.status === 429) {
      return NextResponse.json({ error: 'Analysis temporarily unavailable due to high demand. Please try again in a moment.' }, { status: 429 })
    }
    if (error.status === 401 || error.message?.includes('credit')) {
      return NextResponse.json({ error: 'Analysis service temporarily unavailable. Please try again later.' }, { status: 503 })
    }
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return NextResponse.json({ error: 'Connection timed out. Please try again.' }, { status: 504 })
    }

    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
