import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Security — SignGuard' }

export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm text-primary hover:underline">&larr; Back to home</Link>
        <h1 className="text-3xl font-bold mt-4">Security</h1>
        <p className="text-muted-foreground mt-1">How SignGuard handles your documents</p>
      </div>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-3">How Your Contract Is Processed</h2>
          <div className="space-y-3 pl-4 border-l-2 border-sky-200 dark:border-sky-800">
            <div><span className="font-semibold">1. Upload</span><p className="text-muted-foreground">You upload a PDF, Word document, or paste text. For files, text is extracted entirely in your browser — the original file never leaves your device.</p></div>
            <div><span className="font-semibold">2. Extraction</span><p className="text-muted-foreground">Text extraction happens client-side using pdf.js (for PDFs) or mammoth (for DOCX). Only the extracted text is sent to our server.</p></div>
            <div><span className="font-semibold">3. Analysis</span><p className="text-muted-foreground">The text is forwarded to Anthropic&apos;s Claude AI via an encrypted HTTPS/TLS connection. Claude analyzes the contract and returns structured findings.</p></div>
            <div><span className="font-semibold">4. Storage</span><p className="text-muted-foreground">Only the AI&apos;s analysis results (risk score, flags, recommendations) are stored in your account. The original document text is never written to our database.</p></div>
            <div><span className="font-semibold">5. Deletion</span><p className="text-muted-foreground">You can delete any scan result from your dashboard at any time. Upon deletion, all associated data is permanently removed.</p></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Encryption</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>All connections use HTTPS/TLS 1.3 encryption</li>
            <li>API communication with Anthropic is encrypted end-to-end</li>
            <li>Database (Neon PostgreSQL) is encrypted at rest</li>
            <li>Authentication tokens are signed with secure secrets</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Third-Party Processing</h2>
          <p><strong>Anthropic (Claude AI):</strong> Your document text is processed by Anthropic&apos;s API. Per their API terms, data sent via the API is not used to train their models. Anthropic is SOC 2 Type II certified.</p>
          <p className="mt-2"><strong>Neon (Database):</strong> Scan results are stored in Neon&apos;s managed PostgreSQL with encryption at rest. Neon is SOC 2 Type II certified.</p>
          <p className="mt-2"><strong>Netlify (Hosting):</strong> The application is hosted on Netlify with automatic HTTPS. Netlify is SOC 2 Type II certified.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">What We Do NOT Do</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>We do not store your original documents</li>
            <li>We do not use tracking cookies or analytics</li>
            <li>We do not sell or share your data with advertisers</li>
            <li>We do not use your documents to train AI models</li>
            <li>We do not access your email or any accounts beyond authentication</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Reporting Security Issues</h2>
          <p>If you discover a security vulnerability, please contact us via the email listed in our <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>. We take all reports seriously and will respond promptly.</p>
        </div>
      </section>
    </div>
  )
}
