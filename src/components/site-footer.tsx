'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { useTranslation } from '@/lib/translations'
import { LanguageToggle } from '@/components/language-toggle'

export function SiteFooter() {
  const { t, locale } = useTranslation()

  return (
    <footer className="border-t py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="font-medium">{t('footer.allRights')}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
            {locale === 'de' ? (
              <>
                <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
                <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
                <Link href="/agb" className="hover:text-foreground transition-colors">AGB</Link>
              </>
            ) : (
              <>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/security" className="hover:text-foreground transition-colors">Security</Link>
              </>
            )}
            <span className="text-muted-foreground/30">|</span>
            <LanguageToggle />
          </div>
        </div>
        <p className="text-[11px] text-center text-muted-foreground/60">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  )
}
