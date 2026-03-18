'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ClaimActions({ claimId }: { claimId: string }) {
  const router = useRouter()
  const [resolvedAmount, setResolvedAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleResolve(status: 'RESOLVED' | 'REJECTED') {
    setLoading(true)
    try {
      const body: any = { status }
      if (status === 'RESOLVED' && resolvedAmount) {
        body.resolvedAmount = parseFloat(resolvedAmount)
      }

      const res = await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(status === 'RESOLVED' ? 'Claim resolved!' : 'Claim marked as rejected')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    } catch {
      toast.error('Failed to update')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Update Claim Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Amount Recovered</label>
            <Input
              type="number"
              step="0.01"
              value={resolvedAmount}
              onChange={(e) => setResolvedAmount(e.target.value)}
              placeholder="0.00"
              className="w-32"
            />
          </div>
          <Button onClick={() => handleResolve('RESOLVED')} disabled={loading}>
            Mark Resolved
          </Button>
          <Button variant="outline" onClick={() => handleResolve('REJECTED')} disabled={loading}>
            Mark Rejected
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
