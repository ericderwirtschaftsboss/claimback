import Link from 'next/link'
import { Shield, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — SignGuard' }

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky-600" />
            <span className="text-xl font-bold">SignGuard</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Pay only when you need it. No subscriptions, no commitments.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* FREE */}
          <Card className="flex flex-col border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Free</CardTitle>
              <p className="text-3xl font-bold">&euro;0</p>
              <p className="text-sm text-muted-foreground">2 scans per month</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <ul className="space-y-2 flex-1">
                {['2 scans per month', 'Full analysis with all flags', 'PDF report download', 'No account required for first scan'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link href="/scan" className="inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 text-sm font-medium w-full transition-colors">
                Start scanning free
              </Link>
            </CardContent>
          </Card>

          {/* SINGLE SCAN */}
          <Card className="flex flex-col border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Single Scan</CardTitle>
              <p className="text-3xl font-bold">&euro;4.99</p>
              <p className="text-sm text-muted-foreground">Pay when you need it</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <ul className="space-y-2 flex-1">
                {['One full contract analysis', 'Complete risk report', 'Negotiation playbook', 'PDF download'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <div className="relative">
                <button disabled className="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 text-sm font-medium w-full opacity-50 cursor-not-allowed">Coming soon</button>
              </div>
            </CardContent>
          </Card>

          {/* 5-PACK */}
          <Card className="flex flex-col border-2 border-sky-600 dark:border-sky-400 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold whitespace-nowrap">Best value</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">5-Pack</CardTitle>
              <p className="text-3xl font-bold">&euro;14.99</p>
              <p className="text-sm text-muted-foreground">&euro;3.00/scan &mdash; best for freelancers</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <ul className="space-y-2 flex-1">
                {['5 contract scans', 'Credits never expire', 'Full analysis on each', 'Priority processing'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <div className="relative">
                <button disabled className="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 text-sm font-medium w-full opacity-50 cursor-not-allowed">Coming soon</button>
              </div>
            </CardContent>
          </Card>

          {/* 20-PACK */}
          <Card className="flex flex-col border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">20-Pack</CardTitle>
              <p className="text-3xl font-bold">&euro;39.99</p>
              <p className="text-sm text-muted-foreground">&euro;2.00/scan &mdash; best for teams</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <ul className="space-y-2 flex-1">
                {['20 contract scans', 'Credits never expire', 'Full analysis on each', 'Priority processing'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <div className="relative">
                <button disabled className="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 text-sm font-medium w-full opacity-50 cursor-not-allowed">Coming soon</button>
              </div>
            </CardContent>
          </Card>

          {/* UNLIMITED */}
          <Card className="flex flex-col border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Unlimited</CardTitle>
              <p className="text-3xl font-bold">&euro;19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground">Best for legal teams</p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 space-y-4">
              <ul className="space-y-2 flex-1">
                {['Unlimited scans', 'Priority processing', 'Full analysis + playbook', 'PDF export'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <div className="relative">
                <button disabled className="inline-flex items-center justify-center rounded-md border border-input bg-background h-10 px-4 text-sm font-medium w-full opacity-50 cursor-not-allowed">Coming soon</button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-muted-foreground mt-10">
          Currently in beta &mdash; all features are free during the beta period.
        </p>
      </div>
    </div>
  )
}
