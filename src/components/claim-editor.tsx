'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ClaimEditorProps {
  claim: {
    id: string
    draftBody: string
    finalBody?: string | null
    status: string
    opportunity: {
      vendor: string
      category: string
      amount: string | number
      description: string
    }
  }
}

export function ClaimEditor({ claim }: ClaimEditorProps) {
  const router = useRouter()
  const [body, setBody] = useState(claim.finalBody || claim.draftBody)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftBody: body }),
      })
      if (res.ok) toast.success('Draft saved')
      else toast.error('Failed to save')
    } catch {
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalBody: body, status: 'SUBMITTED' }),
      })
      if (res.ok) {
        toast.success('Claim submitted! Copy the letter and send it to the vendor.')
        router.refresh()
      } else {
        toast.error('Failed to submit')
      }
    } catch {
      toast.error('Failed to submit')
    }
    setSaving(false)
  }

  const isEditable = claim.status === 'DRAFT'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Claim Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              disabled={!isEditable}
            />
            {isEditable && (
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleSave} disabled={saving}>
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  Mark as Submitted
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Vendor:</span>
              <p className="font-medium">{claim.opportunity.vendor}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{claim.opportunity.category.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <p className="font-medium text-green-600">${Number(claim.opportunity.amount).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Details:</span>
              <p>{claim.opportunity.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
