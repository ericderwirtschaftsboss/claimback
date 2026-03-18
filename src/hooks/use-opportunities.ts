'use client'

import { useState, useEffect, useCallback } from 'react'

interface Opportunity {
  id: string
  category: string
  vendor: string
  description: string
  amount: string | number
  confidence: number
  status: string
  createdAt: string
}

interface UseOpportunitiesOptions {
  status?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}

export function useOpportunities(options: UseOpportunitiesOptions = {}) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (options.status) params.set('status', options.status)
    if (options.category) params.set('category', options.category)
    if (options.sort) params.set('sort', options.sort)
    if (options.page) params.set('page', options.page.toString())
    if (options.limit) params.set('limit', options.limit.toString())

    const res = await fetch(`/api/opportunities?${params}`)
    const data = await res.json()
    setOpportunities(data.opportunities || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [options.status, options.category, options.sort, options.page, options.limit])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return { opportunities, total, loading, refetch: fetch_ }
}
