import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export function createOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/gmail/callback`
  )
}

export function createAuthenticatedClient(accessToken: string, refreshToken: string): OAuth2Client {
  const client = createOAuth2Client()
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return client
}
