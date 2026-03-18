'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function GenerateClaimButton({ opportunityId }: { opportunityId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/claim`, {
        method: 'POST',
      })
      if (res.ok) {
        const claim = await res.json()
        toast.success('Claim letter generated!')
        router.push(`/claims/${claim.id}`)
      } else {
        toast.error('Failed to generate claim')
      }
    } catch {
      toast.error('Failed to generate claim')
    }
    setLoading(false)
  }

  return (
    <Button onClick={handleGenerate} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileText className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Generating...' : 'Generate Claim Letter'}
    </Button>
  )
}
