'use client'

import { Globe } from 'lucide-react'
import { useTranslation } from '@/lib/translations'

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <button
        onClick={() => setLocale('en')}
        className={`px-1 transition-colors ${
          locale === 'en'
            ? 'font-bold text-sky-600'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => setLocale('de')}
        className={`px-1 transition-colors ${
          locale === 'de'
            ? 'font-bold text-sky-600'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        DE
      </button>
    </div>
  )
}
