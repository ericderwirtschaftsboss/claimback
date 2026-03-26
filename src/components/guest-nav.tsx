'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'

export function GuestNav() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sky-600" />
          <span className="text-xl font-bold">SignGuard</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Pricing
          </Link>
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-sky-600 hover:text-sky-700">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}
