'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Lock,
  Eye,
  Check,
  ArrowRight,
  CreditCard,
  AlertTriangle,
  Scale,
  FileText,
  Users,
  Briefcase,
  Home,
  Code,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'

const trustItems = [
  { icon: Shield, label: 'Analyzed in memory only' },
  { icon: Lock, label: 'Bank-grade encryption' },
  { icon: Eye, label: 'No email access required' },
  { icon: Check, label: 'GDPR compliant' },
]

const steps = [
  {
    number: '1',
    title: 'Upload any contract',
    description: 'PDF, Word, images, or paste text',
  },
  {
    number: '2',
    title: 'AI analyzes every clause',
    description: 'Our AI attorney reviews every section for hidden dangers',
  },
  {
    number: '3',
    title: 'Get your risk report',
    description: 'Risk score, plain-english flags, and a negotiation playbook',
  },
]

const catchItems = [
  { icon: AlertTriangle, title: 'Auto-renewal traps' },
  { icon: CreditCard, title: 'Price escalation' },
  { icon: Scale, title: 'Cancellation penalties' },
  { icon: Eye, title: 'Data exploitation' },
  { icon: Shield, title: 'Liability traps' },
  { icon: CreditCard, title: 'Hidden fees' },
  { icon: Briefcase, title: 'Non-compete restrictions' },
  { icon: FileText, title: 'IP ownership grabs' },
  { icon: Scale, title: 'One-sided indemnification' },
  { icon: AlertTriangle, title: 'Unilateral amendments' },
]

const useCases = [
  {
    icon: Home,
    title: 'Signing a lease?',
    description:
      'Catch unfair clauses, hidden fees, and landlord-favored terms before you commit to a rental or property agreement.',
  },
  {
    icon: Briefcase,
    title: 'New job offer?',
    description:
      'Understand non-competes, IP assignments, and termination clauses hiding in your employment contract.',
  },
  {
    icon: Code,
    title: 'SaaS subscription?',
    description:
      'Spot auto-renewals, price hikes, and data usage rights buried in terms of service agreements.',
  },
  {
    icon: Users,
    title: 'Freelance contract?',
    description:
      'Protect your rights with AI analysis of payment terms, liability, scope creep clauses, and IP ownership.',
  },
]

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            <span className="text-xl font-bold">SignGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Never sign anything without{' '}
            <span className="text-violet-600 dark:text-violet-400">
              scanning it first.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            SignGuard uses AI to find hidden traps, unfair clauses, and financial
            dangers in any contract — in seconds.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-8 py-6"
          >
            <Link href="/scan">
              Scan a contract free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Your documents are never stored.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 px-4 border-y bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30">
                <item.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-600 text-white text-xl font-bold mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we catch */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">What we catch</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {catchItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 shrink-0">
                  <item.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            Built for every agreement
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc) => (
              <Card
                key={uc.title}
                className="hover:shadow-lg transition-shadow border"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 mb-3">
                    <uc.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <CardTitle className="text-lg">{uc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {uc.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple pricing
          </h2>
          <div className="mb-10 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold">
              Beta: All features free during beta
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free tier */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  $0
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {['3 scans/month', 'Full risk report', 'Flag detection'].map(
                    (feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/register">Get started free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro tier */}
            <Card className="border-2 border-violet-600 dark:border-violet-400 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  Most popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;9.99
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    'Unlimited scans',
                    'PDF export',
                    'Negotiation playbook',
                    'Scan history',
                    'Priority analysis',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Link href="/register">Start free trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="font-medium">&copy; 2026 SignGuard</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/security" className="hover:text-foreground transition-colors">Security</Link>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground/70">
            SignGuard is an AI analysis tool, not a law firm. Our analysis does not constitute legal advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
