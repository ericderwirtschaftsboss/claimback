import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { parseGmailMessage, ParsedEmail } from './parser'
import { demoEmails } from '@/lib/demo/emails'

const CONCURRENCY_LIMIT = 5
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

export async function fetchEmails(authClient: OAuth2Client): Promise<ParsedEmail[]> {
  if (process.env.DEMO_MODE === 'true') {
    return demoEmails
  }

  const gmail = google.gmail({ version: 'v1', auth: authClient })
  const after = Math.floor((Date.now() - NINETY_DAYS_MS) / 1000)

  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${after} (subject:subscription OR subject:receipt OR subject:invoice OR subject:charge OR subject:refund OR subject:flight OR subject:booking OR subject:fee OR subject:payment OR subject:renewal)`,
    maxResults: 200,
  })

  const messageIds = listResponse.data.messages?.map((m) => m.id!) || []
  if (messageIds.length === 0) return []

  const emails: ParsedEmail[] = []

  for (let i = 0; i < messageIds.length; i += CONCURRENCY_LIMIT) {
    const batch = messageIds.slice(i, i + CONCURRENCY_LIMIT)
    const results = await Promise.all(
      batch.map(async (id) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id,
          format: 'full',
        })
        return parseGmailMessage(msg.data)
      })
    )
    emails.push(...results)
  }

  return emails
}
