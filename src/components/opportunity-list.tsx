'use client'

import { useState } from 'react'
import { OpportunityCard } from './opportunity-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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

interface OpportunityListProps {
  initialOpportunities: Opportunity[]
}

const statusTabs = ['ALL', 'ACTIVE', 'CLAIMED', 'DISMISSED'] as const
const categories = [
  'ALL',
  'FORGOTTEN_SUBSCRIPTION',
  'OVERCHARGE',
  'PRICE_DROP',
  'FLIGHT_COMPENSATION',
  'BANK_FEE',
] as const

export function OpportunityList({ initialOpportunities }: OpportunityListProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('amount')

  async function handleDismiss(id: string) {
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISMISSED' }),
      })
      if (res.ok) {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: 'DISMISSED' } : o))
        )
        toast.success('Opportunity dismissed')
      }
    } catch {
      toast.error('Failed to dismiss')
    }
  }

  const filtered = opportunities
    .filter((o) => statusFilter === 'ALL' || o.status === statusFilter)
    .filter((o) => categoryFilter === 'ALL' || o.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'amount') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'confidence') return b.confidence - a.confidence
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {statusTabs.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <select
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'All Categories' : cat.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="amount">Sort by Amount</option>
          <option value="confidence">Sort by Confidence</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No opportunities found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onDismiss={opp.status === 'ACTIVE' ? handleDismiss : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
