'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface ProfileFormProps {
  name: string
  email: string
}

export function ProfileForm({ name: initialName, email }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) toast.success('Profile updated')
      else toast.error('Failed to update profile')
    } catch {
      toast.error('Failed to update profile')
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" value={email} disabled />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
        </div>
        <Button onClick={handleSave} disabled={saving || name === initialName}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
