'use client'

import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/translations'

export default function SettingsPage() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>

      <Card>
        <CardHeader><CardTitle>{t('settings.account')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('settings.email')}</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('settings.name')}</p>
            <p className="font-medium">{session?.user?.name || t('settings.notSet')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-destructive">{t('settings.dangerZone')}</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/login' })}>
            {t('common.signOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
