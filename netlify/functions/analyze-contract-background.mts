import type { Handler } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

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

// Background function — runs up to 15 minutes on Netlify paid plans
export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: 'Missing body' }
  }

  const { scanId, contractText, contractType, signerRole, originalLength } = JSON.parse(event.body)

  console.log('[BG-FUNCTION] Starting analysis for scan:', scanId, 'textLength:', contractText?.length)

  try {
    const systemPrompt = buildSystemPrompt(contractType, signerRole)
    const userMessage = `Analyze this contract. Detect language and jurisdiction. Flag EVERY problematic clause. Return JSON per system prompt.\n\n${contractText}`

    // Use streaming to keep things moving
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-20250514',
      max_tokens: 8000,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const response = await stream.finalMessage()

    console.log('[BG-FUNCTION] Claude responded for scan:', scanId)

    const responseText = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')

    const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(cleaned)

    const flags = result.flags || []
    const externalRefs = result.external_references || []
    const missingProtections = result.missing_protections || []

    const completeness = originalLength && originalLength > 15000
      ? Math.round((15000 / originalLength) * 100)
      : (result.analysis_completeness ?? null)

    await prisma.contractScan.update({
      where: { id: scanId },
      data: {
        status: 'COMPLETE',
        title: result.contract_type || 'Contract Scan',
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
        analysisCompleteness: completeness,
      },
    })

    console.log('[BG-FUNCTION] Scan complete:', scanId, 'flags:', flags.length)
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (error: any) {
    console.error('[BG-FUNCTION] Failed:', scanId, error.message || error)

    await prisma.contractScan.update({
      where: { id: scanId },
      data: {
        status: 'FAILED',
        errorMessage: error.message?.slice(0, 500) || 'Analysis failed',
      },
    }).catch(() => {})

    return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  } finally {
    await prisma.$disconnect()
  }
}
