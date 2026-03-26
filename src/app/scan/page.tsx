'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Shield, Upload, FileText, File, X, Loader2, ArrowLeft,
  Briefcase, Home, Code, CreditCard, FileSearch,
  Dumbbell, Lock, ScrollText, Handshake
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { extractTextFromFile } from '@/lib/extract-text'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.heic']

const CONTRACT_TYPES = [
  { label: 'Employment', value: 'EMPLOYMENT', icon: Briefcase },
  { label: 'Freelance', value: 'FREELANCE', icon: Handshake },
  { label: 'Lease/Rental', value: 'LEASE', icon: Home },
  { label: 'SaaS/Software', value: 'SAAS', icon: Code },
  { label: 'Gym/Membership', value: 'GYM', icon: Dumbbell },
  { label: 'Insurance', value: 'INSURANCE', icon: FileSearch },
  { label: 'Loan/Credit', value: 'LOAN', icon: CreditCard },
  { label: 'NDA', value: 'NDA', icon: Lock },
  { label: 'Terms of Service', value: 'TOS', icon: ScrollText },
  { label: 'Other/Not Sure', value: 'OTHER', icon: File },
] as const

const SIGNER_ROLES = [
  { label: "I'm an individual signing", value: 'INDIVIDUAL' },
  { label: 'Signing for my small business', value: 'SMALL_BUSINESS' },
  { label: 'Signing for a company', value: 'COMPANY' },
  { label: 'Not sure', value: 'UNKNOWN' },
] as const

const LOADING_MESSAGES = [
  'Reading your document...',
  'Analyzing clauses...',
  'Checking for hidden traps...',
  'Evaluating financial terms...',
  'Assessing exit conditions...',
  'Building negotiation playbook...',
  'Generating report...',
]

export default function ScanPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const isLoggedIn = !!session

  // Form state
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'url'>('upload')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [contractType, setContractType] = useState('')
  const [signerRole, setSignerRole] = useState('')
  const [consent, setConsent] = useState(false)

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [fileType, setFileType] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Loading state
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  useEffect(() => {
    if (!loading) return
    setLoadingMessage(LOADING_MESSAGES[0])
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[i])
    }, 3000)
    return () => clearInterval(interval)
  }, [loading])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function isImageFile(file: File): boolean {
    const name = file.name.toLowerCase()
    return IMAGE_EXTENSIONS.some(ext => name.endsWith(ext)) || file.type.startsWith('image/')
  }

  async function processFile(file: File) {
    if (isImageFile(file)) {
      toast.error('For accurate analysis, please upload a PDF or Word document.')
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File too large. Maximum 25MB.')
      return
    }

    setUploadedFile(file)
    setExtractedText('')
    setExtracting(true)

    try {
      // Extract text client-side — avoids Netlify's 6MB body size limit
      const result = await extractTextFromFile(file)
      setFileType(result.fileType)
      setExtractedText(result.text)

      if (!result.text.trim()) {
        toast.error('Could not extract text from this file. Try pasting the text directly.')
        setUploadedFile(null)
        return
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to process file')
      setUploadedFile(null)
    } finally {
      setExtracting(false)
    }
  }

  function clearFile() {
    setUploadedFile(null)
    setExtractedText('')
    setFileType('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function hasContent(): boolean {
    if (activeTab === 'upload') return !!extractedText
    if (activeTab === 'text') return !!text.trim()
    if (activeTab === 'url') return !!url.trim()
    return false
  }

  const canSubmit = hasContent() && consent && !extracting

  async function handleScan() {
    if (!hasContent()) {
      toast.error('Please provide a contract to analyze.')
      return
    }
    if (!consent) {
      toast.error('Please accept the consent terms before scanning.')
      return
    }

    setLoading(true)

    try {
      const payload: Record<string, unknown> = {
        title: title || undefined,
        contractType: contractType || undefined,
        signerRole: signerRole || undefined,
      }

      if (activeTab === 'upload') {
        payload.text = extractedText
        payload.fileName = uploadedFile?.name
        payload.sourceType = 'FILE'
      } else if (activeTab === 'text') {
        payload.text = text
        payload.sourceType = 'TEXT'
      } else {
        payload.url = url
        payload.sourceType = 'URL'
      }

      // Step 1: Create scan record (returns immediately)
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Analysis failed')
        setLoading(false)
        return
      }

      // Step 2: Poll for completion
      const scanId = data.id
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/scan/${scanId}/status`)
          const statusData = await statusRes.json()

          if (statusData.status === 'COMPLETE') {
            clearInterval(pollInterval)
            router.push(`/scan/${scanId}`)
          } else if (statusData.status === 'FAILED') {
            clearInterval(pollInterval)
            toast.error(statusData.error || 'Analysis failed. Please try again.')
            setLoading(false)
          }
          // PROCESSING — keep polling
        } catch {
          // Network error during poll — keep trying
        }
      }, 3000)
    } catch {
      toast.error('Scan failed. Please try again.')
      setLoading(false)
    }
  }

  // Loading animation — full screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 px-4">
        <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
          <Shield className="h-12 w-12 text-primary" />
          <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Analyzing your contract...</h2>
          <p className="text-muted-foreground animate-pulse">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="inline-flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SignGuard</span>
          </Link>
          <h1 className="text-3xl font-bold">Scan a Contract</h1>
          <p className="text-muted-foreground">Upload, paste, or enter a URL to analyze any agreement</p>
        </div>

        {isLoggedIn && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Scans
              </Link>
            </Button>
          </div>
        )}

        {/* Single card with all inputs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex gap-2">
              {(['upload', 'text', 'url'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tab === 'upload' ? 'Upload File' : tab === 'text' ? 'Paste Text' : 'Enter URL'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload tab */}
            {activeTab === 'upload' && (
              !uploadedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 sm:p-10 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">Drop a contract here, or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a PDF, Word document, or text file — up to 25MB
                  </p>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-8 w-8 text-red-400" />
                      <span className="text-xs text-muted-foreground">PDF</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <File className="h-8 w-8 text-blue-400" />
                      <span className="text-xs text-muted-foreground">DOCX</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-muted-foreground">TXT</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) processFile(f)
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(0)} KB — {fileType}
                      {extractedText && ` — ${extractedText.length.toLocaleString()} chars`}
                    </p>
                  </div>
                  {extracting && <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />}
                  <Button variant="ghost" size="sm" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            )}

            {/* Paste tab */}
            {activeTab === 'text' && (
              <Textarea
                placeholder="Paste the contract, terms of service, or agreement text..."
                className="min-h-[200px] resize-y"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            )}

            {/* URL tab */}
            {activeTab === 'url' && (
              <Input
                type="url"
                placeholder="https://example.com/terms-of-service"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            )}

            {/* Title input */}
            <Input
              placeholder="Name this scan (optional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            {/* Contract type selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">What type of contract is this? <span className="text-muted-foreground font-normal">(optional — AI detects automatically)</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONTRACT_TYPES.map(ct => {
                  const Icon = ct.icon
                  const isSelected = contractType === ct.value
                  return (
                    <button
                      key={ct.value}
                      onClick={() => setContractType(isSelected ? '' : ct.value)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{ct.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Signer role selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Who are you signing as? <span className="text-muted-foreground font-normal">(optional)</span></label>
              <div className="grid grid-cols-1 gap-2">
                {SIGNER_ROLES.map(sr => {
                  const isSelected = signerRole === sr.value
                  return (
                    <button
                      key={sr.value}
                      onClick={() => setSignerRole(isSelected ? '' : sr.value)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary' : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span>{sr.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Consent section */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-sm font-medium">By scanning this document, you agree that:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Your document text will be sent to our AI provider (Anthropic) for analysis</li>
                <li>The original file is deleted immediately after text extraction</li>
                <li>Only the analysis results are stored — never your document content</li>
                <li>You have the right to upload this document</li>
                <li>This analysis is for informational purposes only and is not legal advice</li>
                <li>AI analysis may contain errors — always verify important findings independently</li>
              </ul>
              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">I understand and consent to these terms</span>
              </label>
            </div>

            {/* Analyze button */}
            <Button
              onClick={handleScan}
              disabled={!canSubmit}
              className="w-full"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Analyze Contract
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-center text-muted-foreground">
              SignGuard uses AI to highlight potential issues. Results are informational only and do not constitute legal advice.
            </p>
          </CardContent>
        </Card>

        {!isLoggedIn && (
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Sign in</Link> to save your scans and get unlimited analysis.
          </p>
        )}
      </div>
    </div>
  )
}
