import Link from 'next/link'
import { Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — SignGuard' }

const tiers = [
  {
    name: 'Free',
    price: '\u20AC0',
    subtitle: '',
    description: '2 scans per month',
    features: ['2 scans per month', 'Full analysis with all flags', 'PDF report download', 'No account required for first scan'],
    cta: 'Start scanning free',
    href: '/scan',
    disabled: false,
    highlight: false,
  },
  {
    name: 'Single Scan',
    price: '\u20AC4.99',
    subtitle: '',
    description: 'Pay when you need it',
    features: ['One full contract analysis', 'Complete risk report', 'Negotiation playbook', 'PDF download'],
    cta: 'Buy now',
    href: '#',
    disabled: true,
    highlight: false,
  },
  {
    name: '5-Pack',
    price: '\u20AC14.99',
    subtitle: '\u20AC3.00/scan',
    description: 'Best for freelancers',
    features: ['5 contract scans', 'Credits never expire', 'Full analysis on each', 'Priority processing'],
    cta: 'Buy now',
    href: '#',
    disabled: true,
    highlight: true,
  },
  {
    name: '20-Pack',
    price: '\u20AC39.99',
    subtitle: '\u20AC2.00/scan',
    description: 'Best for teams',
    features: ['20 contract scans', 'Credits never expire', 'Full analysis on each', 'Priority processing'],
    cta: 'Buy now',
    href: '#',
    disabled: true,
    highlight: false,
  },
  {
    name: 'Unlimited',
    price: '\u20AC19.99',
    subtitle: '/month',
    description: 'Best for legal teams',
    features: ['Unlimited scans', 'Priority processing', 'Full analysis + playbook', 'PDF export'],
    cta: 'Buy now',
    href: '#',
    disabled: true,
    highlight: false,
  },
]

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
            <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Pay only when you need it. No subscriptions, no commitments.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative flex flex-col ${tier.highlight ? 'border-2 border-sky-600 dark:border-sky-400 shadow-lg' : 'border'}`}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold whitespace-nowrap">Best value</span>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="mt-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.subtitle && <span className="text-sm text-muted-foreground ml-1">{tier.subtitle}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="relative">
                  {tier.disabled ? (
                    <div>
                      <Button className="w-full" disabled>{tier.cta}</Button>
                      <Badge variant="secondary" className="absolute -top-2 right-2 text-[10px]">Coming soon</Badge>
                    </div>
                  ) : (
                    <Button asChild className={`w-full ${tier.highlight ? 'bg-sky-600 hover:bg-sky-700 text-white' : ''}`} variant={tier.highlight ? 'default' : 'outline'}>
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-10">
          Currently in beta &mdash; all features free during beta period.
        </p>
      </div>
    </div>
  )
}
