'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ScanProgress() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  async function startScan() {
    setScanning(true)
    setStatus('running')

    try {
      const res = await fetch('/api/scan', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Scan failed')
        setStatus('failed')
        setScanning(false)
        return
      }

      await res.json()
      pollStatus()
    } catch {
      toast.error('Failed to start scan')
      setStatus('failed')
      setScanning(false)
    }
  }

  async function pollStatus() {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/scan')
        const data = await res.json()

        if (data.scanLog) {
          setResult(data.scanLog)
          if (data.scanLog.status === 'completed') {
            clearInterval(interval)
            setStatus('completed')
            setScanning(false)
            toast.success(`Found ${data.scanLog.opportunitiesFound} opportunities!`)
            router.refresh()
          } else if (data.scanLog.status === 'failed') {
            clearInterval(interval)
            setStatus('failed')
            setScanning(false)
            toast.error('Scan failed')
          }
        }
      } catch {
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Scan</CardTitle>
      </CardHeader>
      <CardContent>
        {!scanning && !status && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Scan your inbox to find money recovery opportunities
            </p>
            <Button onClick={startScan}>Start Scan</Button>
          </div>
        )}

        {scanning && (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="font-medium">Scanning your emails...</p>
              {result && (
                <p className="text-sm text-muted-foreground">
                  {result.emailsFetched} emails fetched, {result.emailsAnalyzed} analyzed
                </p>
              )}
            </div>
          </div>
        )}

        {status === 'completed' && result && (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Scan complete!</p>
              <p className="text-sm text-muted-foreground">
                Found {result.opportunitiesFound} opportunities from {result.emailsFetched} emails
              </p>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium">Scan failed</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => { setStatus(null); setResult(null) }}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
