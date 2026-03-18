'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmailConnectButton } from '@/components/email-connect-button'
import { DollarSign, Mail, Search, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const steps = [
  { id: 'welcome', title: 'Welcome to ClaimBack', icon: DollarSign },
  { id: 'connect', title: 'Connect Your Email', icon: Mail },
  { id: 'scan', title: 'Run Your First Scan', icon: Search },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanDone, setScanDone] = useState(false)

  async function handleScan() {
    setScanning(true)
    try {
      const res = await fetch('/api/scan', { method: 'POST' })
      if (res.ok) {
        const checkInterval = setInterval(async () => {
          const statusRes = await fetch('/api/scan')
          const data = await statusRes.json()
          if (data.scanLog?.status === 'completed') {
            clearInterval(checkInterval)
            setScanDone(true)
            setScanning(false)
            toast.success(`Found ${data.scanLog.opportunitiesFound} opportunities!`)
          } else if (data.scanLog?.status === 'failed') {
            clearInterval(checkInterval)
            setScanning(false)
            toast.error('Scan failed, but you can try again from the dashboard')
          }
        }, 2000)
      }
    } catch {
      setScanning(false)
      toast.error('Failed to start scan')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <DollarSign className="h-16 w-16 text-primary mx-auto" />
              <p className="text-muted-foreground">
                ClaimBack scans your emails to find money you can recover — forgotten
                subscriptions, overcharges, price drops, and more.
              </p>
              <p className="text-muted-foreground">
                Let&apos;s get you set up in just a few steps.
              </p>
              <Button className="w-full" onClick={() => setCurrentStep(1)}>
                Let&apos;s Go
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <Mail className="h-16 w-16 text-primary mx-auto" />
              <p className="text-muted-foreground">
                Connect your Gmail account so we can scan for money recovery
                opportunities. We only read emails — never send or modify.
              </p>
              <EmailConnectButton />
              <div className="pt-2">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  Skip for now
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-4">
              {!scanDone ? (
                <>
                  <Search className="h-16 w-16 text-primary mx-auto" />
                  <p className="text-muted-foreground">
                    Run your first scan to discover money recovery opportunities.
                  </p>
                  <Button onClick={handleScan} disabled={scanning} className="w-full">
                    {scanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      'Start Scan'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <p className="font-medium">All set! Your scan is complete.</p>
                  <Button className="w-full" onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
              {!scanDone && (
                <div className="pt-2">
                  <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    Skip to Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
