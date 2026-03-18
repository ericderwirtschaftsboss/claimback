'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Check } from 'lucide-react'
import { toast } from 'sonner'

interface EmailConnectButtonProps {
  isConnected?: boolean
}

export function EmailConnectButton({ isConnected }: EmailConnectButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      toast.success('Demo mode: Email connection simulated!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/gmail/connect')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to start Gmail connection')
      }
    } catch {
      toast.error('Failed to connect')
    }
    setLoading(false)
  }

  if (isConnected) {
    return (
      <Button variant="outline" disabled>
        <Check className="h-4 w-4 mr-2" />
        Gmail Connected
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={loading}>
      <Mail className="h-4 w-4 mr-2" />
      {loading ? 'Connecting...' : 'Connect Gmail'}
    </Button>
  )
}
