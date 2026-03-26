'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TranslationProvider } from '@/lib/translations'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TranslationProvider>
          {children}
          <Toaster position="top-right" richColors />
        </TranslationProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
