'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, FileSearch, Trash2, AlertTriangle, CheckCircle, XOctagon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Scan {
  id: string
  title: string | null
  contractType: string | null
  sourceType: string
  riskScore: number | null
  riskLevel: string | null
  flagCountCritical: number
  flagCountWarning: number
  flagCountInfo: number
  createdAt: string
}

const riskLevelConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  LOW: { label: 'Low Risk', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  MODERATE: { label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: AlertTriangle },
  ELEVATED: { label: 'Elevated', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
  HIGH: { label: 'High Risk', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: XOctagon },
  EXTREME: { label: 'Extreme Risk', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: XOctagon },
}

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scan/history')
      .then(r => r.json())
      .then(data => { setScans(data.scans || []); setTotal(data.total || 0) })
      .catch(() => toast.error('Failed to load scan history'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/scan/history?id=${id}`, { method: 'DELETE' })
      setScans(prev => prev.filter(s => s.id !== id))
      setTotal(prev => prev - 1)
      toast.success('Scan deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Scans</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `You've scanned ${total} contract${total !== 1 ? 's' : ''}` : 'No scans yet'}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/scan">
            <FileSearch className="h-5 w-5 mr-2" />
            Scan a Contract
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />)}
        </div>
      )}

      {!loading && scans.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No contracts scanned yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload a contract, paste terms of service, or enter a URL to get an instant AI-powered risk analysis.
            </p>
            <Button asChild size="lg">
              <Link href="/scan">
                <FileSearch className="h-5 w-5 mr-2" />
                Scan your first contract
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {scans.length > 0 && (
        <div className="space-y-3">
          {scans.map(scan => {
            const v = scan.riskLevel ? riskLevelConfig[scan.riskLevel] : null
            const VerdictIcon = v?.icon || Shield

            return (
              <Link key={scan.id} href={`/scan/${scan.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Risk score */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shrink-0 ${
                        (scan.riskScore ?? 0) <= 3 ? 'border-green-500 text-green-600' :
                        (scan.riskScore ?? 0) <= 6 ? 'border-amber-500 text-amber-600' :
                        'border-red-500 text-red-600'
                      }`}>
                        <span className="text-sm font-bold">{scan.riskScore?.toFixed(1) ?? '?'}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{scan.title || 'Untitled Scan'}</h3>
                          {v && (
                            <Badge className={`${v.bg} ${v.color} border-0 shrink-0`}>
                              <VerdictIcon className="h-3 w-3 mr-1" />
                              {v.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {scan.contractType && <span>{scan.contractType}</span>}
                          <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                          <span className="flex gap-2">
                            {scan.flagCountCritical > 0 && <span className="text-red-600">{scan.flagCountCritical} critical</span>}
                            {scan.flagCountWarning > 0 && <span className="text-amber-600">{scan.flagCountWarning} warnings</span>}
                            {scan.flagCountInfo > 0 && <span className="text-blue-600">{scan.flagCountInfo} info</span>}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <Button variant="ghost" size="sm" onClick={e => { e.preventDefault(); handleDelete(scan.id) }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
