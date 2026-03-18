import { DollarSign, Search, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface StatsCardsProps {
  recoveryPotential: number
  opportunitiesFound: number
  claimsInProgress: number
  moneyRecovered: number
}

export function StatsCards({
  recoveryPotential,
  opportunitiesFound,
  claimsInProgress,
  moneyRecovered,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Recovery Potential',
      value: formatCurrency(recoveryPotential),
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      title: 'Opportunities Found',
      value: opportunitiesFound.toString(),
      icon: Search,
      color: 'text-blue-600',
    },
    {
      title: 'Claims In Progress',
      value: claimsInProgress.toString(),
      icon: FileText,
      color: 'text-orange-600',
    },
    {
      title: 'Money Recovered',
      value: formatCurrency(moneyRecovered),
      icon: DollarSign,
      color: 'text-green-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
