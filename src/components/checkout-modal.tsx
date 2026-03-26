'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, CreditCard, Shield } from 'lucide-react'

interface Product {
  id: string
  name: string
  nameDE: string
  price: string
  priceDE: string
  description: string
  descriptionDE: string
  credits: string
}

const PRODUCTS: Record<string, Product> = {
  single: {
    id: 'single',
    name: 'Single Scan',
    nameDE: 'Einzelscan',
    price: '€4.99 (incl. VAT)',
    priceDE: '4,99 € (inkl. MwSt.)',
    description: 'One full contract analysis with risk report, negotiation playbook, and PDF download.',
    descriptionDE: 'Eine vollständige Vertragsanalyse mit Risikobericht, Verhandlungsleitfaden und PDF-Download.',
    credits: '1 scan credit',
  },
  '5pack': {
    id: '5pack',
    name: '5-Pack',
    nameDE: '5er-Paket',
    price: '€14.99 (incl. VAT)',
    priceDE: '14,99 € (inkl. MwSt.)',
    description: '5 contract scans. Credits never expire.',
    descriptionDE: '5 Vertragsscans. Guthaben verfällt nie.',
    credits: '5 scan credits',
  },
  '20pack': {
    id: '20pack',
    name: '20-Pack',
    nameDE: '20er-Paket',
    price: '€39.99 (incl. VAT)',
    priceDE: '39,99 € (inkl. MwSt.)',
    description: '20 contract scans. Credits never expire.',
    descriptionDE: '20 Vertragsscans. Guthaben verfällt nie.',
    credits: '20 scan credits',
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited Monthly',
    nameDE: 'Unbegrenzt Monatlich',
    price: '€19.99/month (incl. VAT)',
    priceDE: '19,99 €/Monat (inkl. MwSt.)',
    description: 'Unlimited scans with priority processing.',
    descriptionDE: 'Unbegrenzte Scans mit Prioritätsverarbeitung.',
    credits: 'Unlimited',
  },
}

interface CheckoutModalProps {
  productId: string | null
  onClose: () => void
}

export function CheckoutModal({ productId, onClose }: CheckoutModalProps) {
  const { locale } = useTranslation()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptCancellation, setAcceptCancellation] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptDigitalWaiver, setAcceptDigitalWaiver] = useState(false)

  if (!productId) return null
  const product = PRODUCTS[productId]
  if (!product) return null

  const isDE = locale === 'de'
  const allChecked = acceptTerms && acceptCancellation && acceptPrivacy && acceptDigitalWaiver

  const termsLink = isDE ? '/agb' : '/terms'
  const privacyLink = isDE ? '/datenschutz' : '/privacy'
  const termsLabel = isDE ? 'AGB' : 'Terms of Service'
  const cancellationLabel = isDE ? 'Widerrufsbelehrung' : 'Cancellation Policy'
  const privacyLabel = isDE ? 'Datenschutzerklärung' : 'Privacy Policy'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">
            {isDE ? 'Bestellung' : 'Order Summary'}
          </CardTitle>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Product details */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{isDE ? product.nameDE : product.name}</h3>
                <p className="text-sm text-muted-foreground">{isDE ? product.descriptionDE : product.description}</p>
              </div>
              <p className="font-bold text-lg shrink-0 ml-4">{isDE ? product.priceDE : product.price}</p>
            </div>
            <p className="text-xs text-muted-foreground">{product.credits}</p>
          </div>

          {/* Legal checkboxes — required per German law (§312j BGB) */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              {isDE ? 'Pflichtangaben vor der Bestellung:' : 'Required before purchase:'}
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
              <span className="text-sm">
                {isDE ? 'Ich habe die ' : 'I have read and accept the '}
                <a href={termsLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{termsLabel}</a>
                {isDE ? ' gelesen und akzeptiert.' : '.'}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptCancellation} onChange={e => setAcceptCancellation(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
              <span className="text-sm">
                {isDE
                  ? <>Ich habe die <a href={termsLink + '#widerruf'} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{cancellationLabel}</a> zur Kenntnis genommen.</>
                  : <>I have read the <a href={termsLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{cancellationLabel}</a>.</>
                }
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptPrivacy} onChange={e => setAcceptPrivacy(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
              <span className="text-sm">
                {isDE ? 'Ich habe die ' : 'I have read the '}
                <a href={privacyLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{privacyLabel}</a>
                {isDE ? ' gelesen.' : '.'}
              </span>
            </label>

            {/* §356 Abs. 5 BGB — digital goods waiver */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptDigitalWaiver} onChange={e => setAcceptDigitalWaiver(e.target.checked)} className="mt-1 h-4 w-4 rounded" />
              <span className="text-sm">
                {isDE
                  ? 'Ich stimme zu, dass die digitale Dienstleistung sofort beginnt, und nehme zur Kenntnis, dass ich mein Widerrufsrecht verliere, sobald die Leistung vollständig erbracht wurde (§356 Abs. 5 BGB).'
                  : 'I agree that the digital service begins immediately and I acknowledge that I lose my right of withdrawal once the service has been fully provided.'
                }
              </span>
            </label>
          </div>

          {/* Payment section — beta placeholder */}
          <div className="rounded-lg border border-dashed p-4 space-y-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium">
                {isDE ? 'Zahlungsmethode' : 'Payment method'}
              </p>
            </div>
            <div className="rounded-md border bg-background p-3 opacity-50">
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="flex gap-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-sky-50 dark:bg-sky-950/20 p-3">
              <Shield className="h-4 w-4 text-sky-600 shrink-0" />
              <p className="text-xs text-sky-700 dark:text-sky-400">
                {isDE
                  ? 'Zahlungsabwicklung kommt bald — alle Funktionen sind während der Beta-Phase kostenlos.'
                  : 'Payment processing coming soon — all features are free during the beta period.'
                }
              </p>
            </div>
          </div>

          {/* Buy button — §312j BGB requires specific wording */}
          <Button disabled={!allChecked} className="w-full bg-sky-600 hover:bg-sky-700 text-white" size="lg">
            {isDE ? 'Zahlungspflichtig bestellen' : 'Buy now'}
          </Button>

          {!allChecked && (
            <p className="text-xs text-center text-muted-foreground">
              {isDE
                ? 'Bitte bestätigen Sie alle Pflichtangaben vor der Bestellung.'
                : 'Please accept all required terms before purchasing.'
              }
            </p>
          )}

          <p className="text-[11px] text-center text-muted-foreground">
            {isDE
              ? 'Sichere Zahlung. Sie erhalten eine Bestellbestätigung per E-Mail (§312i BGB).'
              : 'Secure payment. You will receive an order confirmation by email.'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
