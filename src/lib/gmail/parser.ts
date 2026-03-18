const MAX_BODY_LENGTH = 4000

export function extractPlainText(payload: { mimeType?: string; body?: { data?: string }; parts?: any[] }): string {
  if (!payload) return ''

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return decodeBase64Url(payload.body.data)
  }

  if (payload.parts) {
    const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain')
    if (textPart) return extractPlainText(textPart)

    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html')
    if (htmlPart) return stripHtml(extractPlainText({ ...htmlPart, mimeType: 'text/plain' }))

    for (const part of payload.parts) {
      const result = extractPlainText(part)
      if (result) return result
    }
  }

  if (payload.mimeType === 'text/html' && payload.body?.data) {
    return stripHtml(decodeBase64Url(payload.body.data))
  }

  return ''
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('utf8')
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateBody(text: string): string {
  if (text.length <= MAX_BODY_LENGTH) return text
  return text.slice(0, MAX_BODY_LENGTH) + '...'
}

export interface ParsedEmail {
  messageId: string
  subject: string
  from: string
  date: string
  bodyText: string
}

export function parseGmailMessage(message: any): ParsedEmail {
  const headers = message.payload?.headers || []
  const getHeader = (name: string) =>
    headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

  const bodyText = truncateBody(extractPlainText(message.payload || {}))

  return {
    messageId: message.id,
    subject: getHeader('Subject'),
    from: getHeader('From'),
    date: getHeader('Date'),
    bodyText,
  }
}
