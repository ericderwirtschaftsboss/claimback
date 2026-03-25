import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { anthropic } from '@/lib/ai/client'

// POST: Translate a scan's analysis to English (on-demand, cached in DB)
export async function POST(request: Request) {
  try {
    const { scanId } = await request.json()
    if (!scanId) return NextResponse.json({ error: 'Missing scanId' }, { status: 400 })

    const scan = await prisma.contractScan.findUnique({ where: { id: scanId } })
    if (!scan) return NextResponse.json({ error: 'Scan not found' }, { status: 404 })

    // If already translated or already in English, return cached
    if (scan.language === 'en') {
      return NextResponse.json({
        executiveSummary: scan.executiveSummary,
        flags: scan.flags ? JSON.parse(scan.flags) : [],
        negotiationPlaybook: scan.negotiationPlaybook ? JSON.parse(scan.negotiationPlaybook) : [],
        missingProtections: scan.missingProtections ? JSON.parse(scan.missingProtections) : [],
      })
    }

    if (scan.flagsEn) {
      return NextResponse.json({
        executiveSummary: scan.executiveSummaryEn,
        flags: JSON.parse(scan.flagsEn),
        negotiationPlaybook: scan.negotiationPlaybookEn ? JSON.parse(scan.negotiationPlaybookEn) : [],
        missingProtections: scan.missingProtectionsEn ? JSON.parse(scan.missingProtectionsEn) : [],
      })
    }

    // Generate English translation
    const analysisData = {
      executive_summary: scan.executiveSummary,
      flags: scan.flags ? JSON.parse(scan.flags) : [],
      negotiation_playbook: scan.negotiationPlaybook ? JSON.parse(scan.negotiationPlaybook) : [],
      missing_protections: scan.missingProtections ? JSON.parse(scan.missingProtections) : [],
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `Translate the following contract analysis from ${scan.language} to English. Keep the EXACT same JSON structure — only translate the text values. Keep category names, severity levels, and field names in English (they already are). Translate: title, what_it_says, why_it_matters, the_trap, recommendation, jurisdiction_note, talking_points, proposed_language, current_language, fallback, executive_summary, and missing_protections items.

Return ONLY valid JSON with the same structure:
${JSON.stringify(analysisData, null, 2)}`,
      }],
    })

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const translated = JSON.parse(cleaned)

    // Cache the translation
    await prisma.contractScan.update({
      where: { id: scanId },
      data: {
        executiveSummaryEn: translated.executive_summary,
        flagsEn: JSON.stringify(translated.flags),
        negotiationPlaybookEn: translated.negotiation_playbook ? JSON.stringify(translated.negotiation_playbook) : null,
        missingProtectionsEn: translated.missing_protections ? JSON.stringify(translated.missing_protections) : null,
      },
    })

    return NextResponse.json({
      executiveSummary: translated.executive_summary,
      flags: translated.flags,
      negotiationPlaybook: translated.negotiation_playbook || [],
      missingProtections: translated.missing_protections || [],
    })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: `Translation failed: ${error.message}` }, { status: 500 })
  }
}
