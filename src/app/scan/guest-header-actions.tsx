'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'

export function GuestHeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <LanguageToggle />
      <ThemeToggle />
      <Link href="/login" className="text-sm text-primary hover:underline">Sign in</Link>
    </div>
  )
}
