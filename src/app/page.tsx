'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Lock,
  Eye,
  Check,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from '@/lib/translations'
import { CheckoutModal } from '@/components/checkout-modal'

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [checkoutProduct, setCheckoutProduct] = useState<string | null>(null)

  const trustItems = [
    { icon: Shield, label: t('landing.trustDocuments') },
    { icon: Lock, label: t('landing.trustEncryption') },
    { icon: Eye, label: t('landing.trustNoEmail') },
    { icon: Check, label: t('landing.trustGdpr') },
  ]

  const catchItems = [
    t('landing.autoRenewal'),
    t('landing.priceEscalation'),
    t('landing.cancellationPenalties'),
    t('landing.dataExploitation'),
    t('landing.liabilityTraps'),
    t('landing.hiddenFees'),
    t('landing.nonCompete'),
    t('landing.ipGrabs'),
    t('landing.indemnification'),
    t('landing.unilateralChanges'),
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            <span className="text-xl font-bold">SignGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              {t('landing.howItWorks')}
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              {t('pricing.title')}
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
              <Link href="/login">{t('landing.signIn')}</Link>
            </Button>
            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <Link href="/scan">{t('landing.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing.heroSubtitle')}
          </p>
          <Button
            size="lg"
            asChild
            className="bg-sky-600 hover:bg-sky-700 text-white text-lg px-8 py-6"
          >
            <Link href="/scan">
              {t('landing.heroCta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            {t('landing.heroNoCreditCard')}
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 px-4 border-y bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30">
                <item.icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
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
          <h2 className="text-3xl font-bold text-center mb-14">{t('landing.howItWorks')}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { number: '1', title: t('landing.step1Title'), desc: t('landing.step1Desc') },
              { number: '2', title: t('landing.step2Title'), desc: t('landing.step2Desc') },
              { number: '3', title: t('landing.step3Title'), desc: t('landing.step3Desc') },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-600 text-white text-xl font-bold mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we catch */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">{t('landing.whatWeCatch')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {catchItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 shrink-0">
                  <Check className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{t('pricing.title')}</h2>
          <p className="text-center text-muted-foreground mb-12">{t('pricing.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {/* Free */}
            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.free')}</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;0
                </p>
                <p className="text-sm text-muted-foreground">{t('pricing.freeDesc')}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    t('pricing.feature_2ScansMonth'),
                    t('pricing.feature_fullAnalysis'),
                    t('pricing.feature_pdfDownload'),
                    t('pricing.feature_noAccountRequired'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link href="/scan">{t('pricing.startFree')}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Single */}
            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.single')}</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;4.99
                </p>
                <p className="text-sm text-muted-foreground">{t('pricing.singleDesc')}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    t('pricing.feature_oneContractAnalysis'),
                    t('pricing.feature_completeRiskReport'),
                    t('pricing.feature_negotiationPlaybook'),
                    t('pricing.feature_pdfDownload'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setCheckoutProduct('single')}
                >
                  {t('pricing.buyNow')}
                </Button>
              </CardContent>
            </Card>

            {/* 5-Pack */}
            <Card className="border-2 border-sky-600 dark:border-sky-400 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold whitespace-nowrap">
                  Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.fivePack')}</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;14.99
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (&euro;3/{t('pricing.perScan')})
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{t('pricing.fivePackDesc')}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    t('pricing.feature_5Scans'),
                    t('pricing.feature_neverExpire'),
                    t('pricing.feature_bestForFreelancers'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setCheckoutProduct('5pack')}
                >
                  {t('pricing.buyNow')}
                </Button>
              </CardContent>
            </Card>

            {/* 20-Pack */}
            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.twentyPack')}</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;39.99
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (&euro;2/{t('pricing.perScan')})
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{t('pricing.twentyPackDesc')}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    t('pricing.feature_20Scans'),
                    t('pricing.feature_neverExpire'),
                    t('pricing.feature_bestForTeams'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setCheckoutProduct('20pack')}
                >
                  {t('pricing.buyNow')}
                </Button>
              </CardContent>
            </Card>

            {/* Unlimited */}
            <Card className="border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('pricing.unlimited')}</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  &euro;19.99
                  <span className="text-base font-normal text-muted-foreground">
                    /{t('pricing.perMonth')}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{t('pricing.unlimitedDesc')}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {[
                    t('pricing.feature_unlimitedScans'),
                    t('pricing.feature_priorityProcessing'),
                    t('pricing.feature_bestForLegalTeams'),
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setCheckoutProduct('unlimited')}
                >
                  {t('pricing.buyNow')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {t('pricing.beta')}
          </p>
        </div>
      </section>

      {/* Checkout modal */}
      <CheckoutModal productId={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </div>
  )
}
