import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteFooter } from '@/components/site-footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SignGuard — Never sign anything without scanning it first',
  description: 'AI-powered contract analysis. Find hidden traps, unfair clauses, and financial dangers in any contract — in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
