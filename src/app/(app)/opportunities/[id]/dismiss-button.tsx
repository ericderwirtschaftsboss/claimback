'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DismissButton({ opportunityId }: { opportunityId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDismiss() {
    setLoading(true)
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISMISSED' }),
      })
      if (res.ok) {
        toast.success('Opportunity dismissed')
        router.push('/opportunities')
      } else {
        toast.error('Failed to dismiss')
      }
    } catch {
      toast.error('Failed to dismiss')
    }
    setLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleDismiss} disabled={loading}>
      <X className="h-4 w-4 mr-2" />
      Dismiss
    </Button>
  )
}
