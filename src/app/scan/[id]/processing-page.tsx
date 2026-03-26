'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

const MESSAGES = [
  'Reading your contract...',
  'Analyzing clauses for hidden traps...',
  'Checking jurisdiction-specific protections...',
  'Evaluating financial exposure...',
  'Building your negotiation playbook...',
  'Finalizing your risk report...',
]

export function ProcessingPage({ scanId }: { scanId: string }) {
  const router = useRouter()
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 3000)

    const pollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/scan/${scanId}/status`)
        const data = await res.json()
        if (data.status === 'COMPLETE' || data.status === 'FAILED') {
          clearInterval(pollTimer)
          clearInterval(msgTimer)
          router.refresh()
        }
      } catch {}
    }, 3000)

    return () => { clearInterval(msgTimer); clearInterval(pollTimer) }
  }, [scanId, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <Shield className="h-12 w-12 text-primary" />
        <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Analyzing your contract...</h2>
        <p className="text-muted-foreground animate-pulse">{MESSAGES[msgIndex]}</p>
        <p className="text-xs text-muted-foreground mt-4">This may take up to 2 minutes for complex contracts.</p>
      </div>
    </div>
  )
}
