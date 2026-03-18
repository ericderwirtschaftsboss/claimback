'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, categoryConfig } from '@/lib/utils'
import { Eye, X } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: {
    id: string
    category: string
    vendor: string
    description: string
    amount: string | number
    confidence: number
    status: string
    createdAt: string
  }
  onDismiss?: (id: string) => void
}

export function OpportunityCard({ opportunity, onDismiss }: OpportunityCardProps) {
  const config = categoryConfig[opportunity.category as keyof typeof categoryConfig]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${config?.bgColor} ${config?.color} border-0`}>
                {config?.label || opportunity.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {opportunity.confidence}% confidence
              </span>
            </div>
            <h3 className="font-semibold truncate">{opportunity.vendor}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {opportunity.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(opportunity.amount)}
            </p>
            {opportunity.status === 'ACTIVE' && (
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/opportunities/${opportunity.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                {onDismiss && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismiss(opportunity.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
