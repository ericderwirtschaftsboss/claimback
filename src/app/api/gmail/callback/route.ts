import { NextResponse } from 'next/server'
import { createOAuth2Client } from '@/lib/gmail/client'
import { encrypt } from '@/lib/crypto'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard?error=gmail_connect_failed', request.url))
  }

  try {
    const client = createOAuth2Client()
    const { tokens } = await client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(new URL('/dashboard?error=gmail_no_tokens', request.url))
    }

    client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: client })
    const profile = await gmail.users.getProfile({ userId: 'me' })
    const email = profile.data.emailAddress || 'unknown'

    await prisma.emailConnection.upsert({
      where: {
        userId_provider_email: {
          userId: state,
          provider: 'gmail',
          email,
        },
      },
      update: {
        encryptedAccessToken: encrypt(tokens.access_token),
        encryptedRefreshToken: encrypt(tokens.refresh_token),
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
      create: {
        userId: state,
        provider: 'gmail',
        email,
        encryptedAccessToken: encrypt(tokens.access_token),
        encryptedRefreshToken: encrypt(tokens.refresh_token),
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    })

    return NextResponse.redirect(new URL('/dashboard?gmail=connected', request.url))
  } catch (error) {
    console.error('Gmail callback error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=gmail_connect_failed', request.url))
  }
}
