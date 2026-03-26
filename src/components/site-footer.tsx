'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export function SiteFooter() {
  const [lang, setLang] = useState<'en' | 'de'>('en')

  useEffect(() => {
    const saved = localStorage.getItem('signguard-footer-lang')
    if (saved === 'de' || saved === 'en') setLang(saved)
  }, [])

  function toggleLang(newLang: 'en' | 'de') {
    setLang(newLang)
    localStorage.setItem('signguard-footer-lang', newLang)
  }

  return (
    <footer className="border-t py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="font-medium">&copy; 2026 SignGuard. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
            {lang === 'en' ? (
              <>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/security" className="hover:text-foreground transition-colors">Security</Link>
              </>
            ) : (
              <>
                <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
                <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
                <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
              </>
            )}
            <span className="text-muted-foreground/30">|</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleLang('en')}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${lang === 'en' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-muted-foreground hover:text-foreground'}`}
              >
                EN
              </button>
              <span className="text-muted-foreground/40">|</span>
              <button
                onClick={() => toggleLang('de')}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${lang === 'de' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-muted-foreground hover:text-foreground'}`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-center text-muted-foreground/60">
          SignGuard is an AI analysis tool, not a law firm. Our analysis does not constitute legal advice.
        </p>
      </div>
    </footer>
  )
}
