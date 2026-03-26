import Link from 'next/link'
import { Shield, Check, Zap, Users, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing — SignGuard' }

const tiers = [
  {
    name: 'Free',
    price: '€0',
    period: '',
    description: '2 free scans per month',
    features: ['2 scans per month', 'Full risk analysis', 'All flags and recommendations', 'PDF report download'],
    cta: 'Get started free',
    href: '/scan',
    highlight: false,
    icon: Shield,
    badge: null,
  },
  {
    name: 'Single Scan',
    price: '€4.99',
    period: '/scan',
    description: 'Pay when you need it',
    features: ['1 full contract analysis', 'Complete risk report', 'Negotiation playbook', 'PDF download'],
    cta: 'Buy a scan',
    href: '/scan',
    highlight: false,
    icon: Zap,
    badge: null,
  },
  {
    name: '5-Pack',
    price: '€14.99',
    period: '',
    description: '€3.00 per scan — best for freelancers',
    features: ['5 contract scans', 'Never expires', 'Full analysis on each', 'Priority processing'],
    cta: 'Buy 5-Pack',
    href: '/scan',
    highlight: true,
    icon: Users,
    badge: 'Best value',
  },
  {
    name: '20-Pack',
    price: '€39.99',
    period: '',
    description: '€2.00 per scan — best for teams',
    features: ['20 contract scans', 'Never expires', 'Full analysis on each', 'Priority processing'],
    cta: 'Buy 20-Pack',
    href: '/scan',
    highlight: false,
    icon: Building,
    badge: null,
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
          <Link href="/login" className="text-sm text-primary hover:underline">Sign in</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Pay per scan. No subscriptions required.</p>
          <div className="mt-4 inline-block px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-sm font-semibold">
            Beta: All features free during beta
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`relative ${tier.highlight ? 'border-2 border-sky-600 dark:border-sky-400 shadow-lg' : 'border'}`}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold">{tier.badge}</span>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <tier.icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                </div>
                <p className="text-3xl font-bold">{tier.price}<span className="text-sm font-normal text-muted-foreground">{tier.period}</span></p>
                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full ${tier.highlight ? 'bg-sky-600 hover:bg-sky-700 text-white' : ''}`} variant={tier.highlight ? 'default' : 'outline'}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Need unlimited scans? <span className="font-semibold">€19.99/month</span> for unlimited access.</p>
          <p className="text-sm text-muted-foreground mt-2">All prices include VAT. Payment integration coming soon.</p>
        </div>
      </div>
    </div>
  )
}
