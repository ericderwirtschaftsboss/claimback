import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function OpportunitiesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-52 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-md" />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-32 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-44 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-7 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
