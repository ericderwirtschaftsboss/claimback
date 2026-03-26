import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// On Netlify, NEXTAUTH_URL may not be set but URL is available
if (!process.env.NEXTAUTH_URL && process.env.URL) {
  process.env.NEXTAUTH_URL = process.env.URL
}
console.log('[AUTH] NEXTAUTH_URL:', process.env.NEXTAUTH_URL)

const basePrismaAdapter = PrismaAdapter(prisma)
const adapter = {
  ...basePrismaAdapter,
  linkAccount: async (account: Record<string, any>) => {
    const sanitized = {
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token ?? null,
      access_token: account.access_token ?? null,
      expires_at: account.expires_at ?? null,
      token_type: account.token_type ?? null,
      scope: account.scope ?? null,
      id_token: account.id_token ?? null,
      session_state: account.session_state ?? null,
    }
    return prisma.account.create({ data: sanitized })
  },
}

export const authOptions: NextAuthOptions = {
  adapter: adapter as NextAuthOptions['adapter'],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log('[AUTH] signIn callback:', account?.provider, profile?.email)
      return true
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id: string }).id = token.id as string
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log('[AUTH] User signed in:', user.email)
    },
  },
  logger: {
    error(code, metadata) {
      console.error('[AUTH ERROR]', code, metadata)
    },
  },
}
