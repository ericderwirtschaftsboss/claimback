import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DollarSign, Mail, Search, FileText, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ClaimBack</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Recover money you{' '}
            <span className="text-primary">didn&apos;t know</span> you were owed
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ClaimBack uses AI to scan your emails and find forgotten subscriptions,
            overcharges, price drops, and more. Then it helps you draft claim letters
            to get your money back.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Recovering
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: '1. Connect your email',
                description:
                  'Securely connect your Gmail account. We only read emails — never send or modify anything.',
              },
              {
                icon: Search,
                title: '2. AI scans for savings',
                description:
                  'Our AI analyzes your receipts, bills, and notifications to find money recovery opportunities.',
              },
              {
                icon: FileText,
                title: '3. Claim your money',
                description:
                  'We draft personalized claim letters for each opportunity. Review, edit, and send to recover your money.',
              },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What we find for you
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Forgotten Subscriptions',
                description: 'Services you signed up for but no longer use',
              },
              {
                icon: DollarSign,
                title: 'Overcharges',
                description: 'Bills higher than expected or billing errors',
              },
              {
                icon: Zap,
                title: 'Price Drops',
                description: 'Items you bought that are now cheaper',
              },
              {
                icon: Shield,
                title: 'Flight Compensation',
                description: 'EU261 claims for delayed or cancelled flights',
              },
              {
                icon: DollarSign,
                title: 'Bank Fees',
                description: 'Overdraft fees and charges that can be waived',
              },
              {
                icon: FileText,
                title: 'AI-Drafted Letters',
                description: 'Professional claim letters ready to send',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop leaving money on the table
          </h2>
          <p className="text-lg mb-8 opacity-90">
            The average person has over $500 in recoverable money hiding in their inbox.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>ClaimBack</span>
          </div>
          <p>Built with AI to help you recover your money.</p>
        </div>
      </footer>
    </div>
  )
}
