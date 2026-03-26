'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { useTranslation } from '@/lib/translations'

export default function PricingPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">{t('pricing.title')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* FREE */}
        <div className="rounded-lg border bg-card p-5 flex flex-col">
          <h3 className="text-lg font-bold">Free</h3>
          <p className="text-3xl font-bold mt-1">&euro;0</p>
          <p className="text-sm text-muted-foreground mb-4">2 scans per month</p>
          <ul className="space-y-2 flex-1 mb-4">
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />Full analysis</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />PDF download</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />No account required</li>
          </ul>
          <Link href="/scan" className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white h-10 px-4 text-sm font-medium w-full transition-colors">
            Start scanning free
          </Link>
        </div>

        {/* SINGLE */}
        <div className="rounded-lg border bg-card p-5 flex flex-col">
          <h3 className="text-lg font-bold">Single Scan</h3>
          <p className="text-3xl font-bold mt-1">&euro;4.99</p>
          <p className="text-sm text-muted-foreground mb-4">Pay when you need it</p>
          <ul className="space-y-2 flex-1 mb-4">
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />One contract analysis</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Complete risk report</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Negotiation playbook</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />PDF download</li>
          </ul>
          <button disabled className="rounded-md border bg-muted h-10 px-4 text-sm font-medium w-full text-muted-foreground cursor-not-allowed">Coming soon</button>
        </div>

        {/* 5-PACK */}
        <div className="rounded-lg border-2 border-sky-600 bg-card p-5 flex flex-col relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-600 text-white text-xs font-semibold">Popular</span>
          <h3 className="text-lg font-bold">5-Pack</h3>
          <p className="text-3xl font-bold mt-1">&euro;14.99</p>
          <p className="text-sm text-muted-foreground mb-4">&euro;3/scan</p>
          <ul className="space-y-2 flex-1 mb-4">
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />5 scans</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Never expire</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Best for freelancers</li>
          </ul>
          <button disabled className="rounded-md border bg-muted h-10 px-4 text-sm font-medium w-full text-muted-foreground cursor-not-allowed">Coming soon</button>
        </div>

        {/* 20-PACK */}
        <div className="rounded-lg border bg-card p-5 flex flex-col">
          <h3 className="text-lg font-bold">20-Pack</h3>
          <p className="text-3xl font-bold mt-1">&euro;39.99</p>
          <p className="text-sm text-muted-foreground mb-4">&euro;2/scan</p>
          <ul className="space-y-2 flex-1 mb-4">
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />20 scans</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Never expire</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Best for teams</li>
          </ul>
          <button disabled className="rounded-md border bg-muted h-10 px-4 text-sm font-medium w-full text-muted-foreground cursor-not-allowed">Coming soon</button>
        </div>

        {/* UNLIMITED */}
        <div className="rounded-lg border bg-card p-5 flex flex-col">
          <h3 className="text-lg font-bold">Unlimited</h3>
          <p className="text-3xl font-bold mt-1">&euro;19.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          <p className="text-sm text-muted-foreground mb-4">Best for legal teams</p>
          <ul className="space-y-2 flex-1 mb-4">
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Unlimited scans</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Priority processing</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />Best for legal teams</li>
          </ul>
          <button disabled className="rounded-md border bg-muted h-10 px-4 text-sm font-medium w-full text-muted-foreground cursor-not-allowed">Coming soon</button>
        </div>
      </div>

      <p className="text-center text-muted-foreground mt-10">
        {t('pricing.beta')}
      </p>
    </div>
  )
}
