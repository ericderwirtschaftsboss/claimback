'use client'

import { useState, useEffect, useCallback } from 'react'

interface Claim {
  id: string
  status: string
  draftBody: string
  finalBody?: string | null
  resolvedAmount?: string | null
  createdAt: string
  opportunity: {
    vendor: string
    category: string
    amount: string | number
    description: string
  }
}

export function useClaims(status?: string) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)

    const res = await fetch(`/api/claims?${params}`)
    const data = await res.json()
    setClaims(data.claims || [])
    setLoading(false)
  }, [status])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return { claims, loading, refetch: fetch_ }
}
