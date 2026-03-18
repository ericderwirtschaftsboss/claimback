'use client'

import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
