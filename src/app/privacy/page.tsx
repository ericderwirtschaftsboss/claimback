import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — SignGuard' }

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm text-primary hover:underline">&larr; Back to home</Link>
        <h1 className="text-3xl font-bold mt-4">Privacy Policy</h1>
        <p className="text-muted-foreground mt-1">Last updated: March 2026</p>
      </div>

      <section className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">1. Who We Are</h2>
        <p>SignGuard is an AI-powered contract analysis service. For contact details, see our <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>.</p>

        <h2 className="text-xl font-semibold">2. Data We Collect</h2>
        <p><strong>Account data:</strong> When you create an account, we store your name and email address (provided via Google OAuth). We do not store passwords — authentication is handled by Google.</p>
        <p><strong>Uploaded documents:</strong> When you scan a contract, the document text is extracted in your browser (client-side) and sent to our server. The original file never leaves your device. We send the extracted text to Anthropic&apos;s Claude AI for analysis via an encrypted API connection. The text is NOT stored in our database.</p>
        <p><strong>Scan results:</strong> The AI&apos;s analysis (risk score, flags, recommendations) is stored in your account so you can access it later. You can delete any scan result at any time.</p>
        <p><strong>Usage data:</strong> We do not use analytics trackers, advertising cookies, or fingerprinting.</p>

        <h2 className="text-xl font-semibold">3. How Documents Are Processed</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>You upload a document — text is extracted in your browser</li>
          <li>The extracted text is sent to our server via HTTPS</li>
          <li>Our server forwards the text to Anthropic&apos;s Claude API for analysis</li>
          <li>Claude returns a structured analysis (risk score, flags, recommendations)</li>
          <li>We store only the analysis results — never the original document text</li>
        </ol>

        <h2 className="text-xl font-semibold">4. Third-Party Processing</h2>
        <p><strong>Anthropic (Claude AI):</strong> Your document text is sent to Anthropic&apos;s API for analysis. Per Anthropic&apos;s API data usage policy, data sent via the API is not used to train their models. Anthropic processes data in the United States. The legal basis for this transfer is Standard Contractual Clauses (SCCs) as per GDPR Article 46.</p>
        <p><strong>Neon (Database):</strong> Scan results are stored in a PostgreSQL database hosted by Neon, encrypted at rest.</p>

        <h2 className="text-xl font-semibold">5. Cookies</h2>
        <p>We use only essential session cookies for authentication. We do not use tracking cookies, analytics cookies, or advertising cookies.</p>

        <h2 className="text-xl font-semibold">6. Data Retention</h2>
        <p>Scan results are stored until you delete them from your dashboard. Account data is retained until you delete your account. We do not retain document text — it is processed in memory and never written to our database.</p>

        <h2 className="text-xl font-semibold">7. Your Rights (GDPR)</h2>
        <p>If you are in the EU/EEA, you have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Delete your data (&quot;right to be forgotten&quot;)</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Object to processing</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
        <p>To exercise these rights, contact us via the email in our <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>.</p>

        <h2 className="text-xl font-semibold">8. Changes</h2>
        <p>We may update this policy. Material changes will be communicated via the app or email.</p>
      </section>
    </div>
  )
}
