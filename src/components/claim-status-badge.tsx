import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function ClaimStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: '' }
  return (
    <Badge className={cn('border-0', config.className)}>{config.label}</Badge>
  )
}
