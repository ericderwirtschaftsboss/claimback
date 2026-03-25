'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Shield, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Change {
  type: 'ADDED' | 'REMOVED' | 'MODIFIED'
  section: string
  description: string
  favors: 'PROVIDER' | 'SIGNER' | 'NEUTRAL'
  significance: 'HIGH' | 'MEDIUM' | 'LOW'
  old_text: string | null
  new_text: string | null
}

interface CompareResult {
  overall_direction: 'IMPROVED' | 'WORSENED' | 'MIXED'
  summary: string
  changes: Change[]
}

export default function ComparePage() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompareResult | null>(null)

  async function handleCompare() {
    if (!oldText.trim() || !newText.trim()) {
      toast.error('Please paste both contract versions.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/scan/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldText, newText }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Comparison failed'); return }
      setResult(data)
    } catch { toast.error('Comparison failed') }
    finally { setLoading(false) }
  }

  const directionConfig = {
    IMPROVED: { label: 'Improved for you', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    WORSENED: { label: 'Worsened for you', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    MIXED: { label: 'Mixed changes', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compare Contracts</h1>
        <p className="text-muted-foreground">Paste two versions to see what changed and who it favors</p>
      </div>

      {!result && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Original Version</CardTitle></CardHeader>
              <CardContent>
                <Textarea placeholder="Paste the original contract..." className="min-h-[250px] resize-y" value={oldText} onChange={e => setOldText(e.target.value)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Revised Version</CardTitle></CardHeader>
              <CardContent>
                <Textarea placeholder="Paste the revised contract..." className="min-h-[250px] resize-y" value={newText} onChange={e => setNewText(e.target.value)} />
              </CardContent>
            </Card>
          </div>
          <Button onClick={handleCompare} disabled={loading} size="lg" className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Comparing...</> : <><Shield className="h-4 w-4 mr-2" />Compare Versions</>}
          </Button>
        </>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={directionConfig[result.overall_direction].color}>
                  {result.overall_direction === 'IMPROVED' ? <ArrowUp className="h-3 w-3 mr-1" /> :
                   result.overall_direction === 'WORSENED' ? <ArrowDown className="h-3 w-3 mr-1" /> :
                   <Minus className="h-3 w-3 mr-1" />}
                  {directionConfig[result.overall_direction].label}
                </Badge>
                <span className="text-sm text-muted-foreground">{result.changes.length} changes found</span>
              </div>
              <p className="text-sm">{result.summary}</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {result.changes.map((change, i) => (
              <Card key={i} className={`border-l-4 ${
                change.favors === 'SIGNER' ? 'border-l-green-500' :
                change.favors === 'PROVIDER' ? 'border-l-red-500' : 'border-l-gray-400'
              }`}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={change.type === 'ADDED' ? 'default' : change.type === 'REMOVED' ? 'destructive' : 'secondary'}>
                      {change.type}
                    </Badge>
                    <Badge variant="outline" className={
                      change.significance === 'HIGH' ? 'border-red-300 text-red-700' :
                      change.significance === 'MEDIUM' ? 'border-amber-300 text-amber-700' : ''
                    }>{change.significance}</Badge>
                    <span className="text-xs text-muted-foreground">{change.section}</span>
                    <Badge className={
                      change.favors === 'SIGNER' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      change.favors === 'PROVIDER' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }>Favors {change.favors.toLowerCase()}</Badge>
                  </div>
                  <p className="text-sm">{change.description}</p>
                  {change.old_text && (
                    <div className="rounded bg-red-50 dark:bg-red-950/20 p-2 text-xs">
                      <span className="font-medium text-red-600">Removed:</span>
                      <p className="text-red-700 dark:text-red-400 mt-0.5">{change.old_text}</p>
                    </div>
                  )}
                  {change.new_text && (
                    <div className="rounded bg-green-50 dark:bg-green-950/20 p-2 text-xs">
                      <span className="font-medium text-green-600">Added:</span>
                      <p className="text-green-700 dark:text-green-400 mt-0.5">{change.new_text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setResult(null) }}>Compare Again</Button>
            <Button variant="outline" asChild><Link href="/scan">Scan a Contract</Link></Button>
          </div>
        </div>
      )}
    </div>
  )
}
