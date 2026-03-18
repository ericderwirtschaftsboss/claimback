import { prisma } from '@/lib/prisma'
import { fetchEmails } from '@/lib/gmail/fetcher'
import { analyzeBatch } from '@/lib/ai/analyzer'
import { deduplicateOpportunities } from './deduplicator'
import { demoOpportunities } from '@/lib/demo/opportunities'
import { decrypt } from '@/lib/crypto'
import { createAuthenticatedClient } from '@/lib/gmail/client'
import { AnalyzedOpportunity } from '@/lib/ai/schemas'

const activeScansByUser = new Set<string>()

export async function runScan(userId: string): Promise<{ scanLogId: string }> {
  if (activeScansByUser.has(userId)) {
    throw new Error('A scan is already in progress')
  }

  activeScansByUser.add(userId)

  const scanLog = await prisma.scanLog.create({
    data: { userId, status: 'running' },
  })

  try {
    let opportunities: AnalyzedOpportunity[]

    if (process.env.DEMO_MODE === 'true') {
      opportunities = demoOpportunities.map((o) => ({
        category: o.category,
        vendor: o.vendor,
        description: o.description,
        amount: o.amount,
        confidence: o.confidence,
        emailMsgId: o.emailMsgId,
      }))

      await prisma.scanLog.update({
        where: { id: scanLog.id },
        data: { emailsFetched: 15, emailsAnalyzed: 15 },
      })
    } else {
      const connection = await prisma.emailConnection.findFirst({
        where: { userId },
      })

      if (!connection) throw new Error('No email connection found')

      const accessToken = decrypt(connection.encryptedAccessToken)
      const refreshToken = decrypt(connection.encryptedRefreshToken)
      const authClient = createAuthenticatedClient(accessToken, refreshToken)

      const emails = await fetchEmails(authClient)

      await prisma.scanLog.update({
        where: { id: scanLog.id },
        data: { emailsFetched: emails.length },
      })

      opportunities = await analyzeBatch(emails)

      await prisma.scanLog.update({
        where: { id: scanLog.id },
        data: { emailsAnalyzed: emails.length },
      })
    }

    const deduped = await deduplicateOpportunities(opportunities, userId)

    if (deduped.length > 0) {
      await prisma.opportunity.createMany({
        data: deduped.map((opp) => ({
          userId,
          category: opp.category,
          vendor: opp.vendor,
          description: opp.description,
          amount: opp.amount,
          confidence: opp.confidence,
          emailMsgId: opp.emailMsgId,
        })),
      })
    }

    await prisma.scanLog.update({
      where: { id: scanLog.id },
      data: {
        opportunitiesFound: deduped.length,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    return { scanLogId: scanLog.id }
  } catch (error: any) {
    await prisma.scanLog.update({
      where: { id: scanLog.id },
      data: {
        status: 'failed',
        errors: { message: error.message },
        completedAt: new Date(),
      },
    })
    throw error
  } finally {
    activeScansByUser.delete(userId)
  }
}
