'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XOctagon, RefreshCw } from 'lucide-react'

export function FailedPage({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
      <XOctagon className="h-16 w-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Analysis Failed</h2>
        <p className="text-muted-foreground max-w-md">{error}</p>
      </div>
      <Button asChild>
        <Link href="/scan">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Link>
      </Button>
    </div>
  )
}
