import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Datenschutzerkl\u00e4rung — SignGuard' }

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm text-primary hover:underline">&larr; Zur Startseite</Link>
        <h1 className="text-3xl font-bold mt-4">Datenschutzerkl&auml;rung</h1>
        <p className="text-muted-foreground mt-1">Stand: M&auml;rz 2026</p>
      </div>
      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Verantwortlicher</h2>
          <p>[VORNAME NACHNAME]<br />[STRASSE HAUSNUMMER]<br />[PLZ] [ORT]<br />E-Mail: [EMAIL@BEISPIEL.DE]</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Erhebung personenbezogener Daten</h2>
          <p><strong>Kontodaten:</strong> Bei der Registrierung speichern wir Ihren Namen und Ihre E-Mail-Adresse (bereitgestellt &uuml;ber Google OAuth). Passw&ouml;rter werden nicht gespeichert.</p>
          <p className="mt-2"><strong>Hochgeladene Dokumente:</strong> Wenn Sie einen Vertrag scannen, wird der Dokumenttext in Ihrem Browser extrahiert (clientseitig) und an unseren Server gesendet. Die Originaldatei verl&auml;sst Ihr Ger&auml;t nicht. Der extrahierte Text wird &uuml;ber eine verschl&uuml;sselte API-Verbindung an Anthropic&apos;s Claude AI zur Analyse gesendet. Der Text wird NICHT in unserer Datenbank gespeichert.</p>
          <p className="mt-2"><strong>Analyseergebnisse:</strong> Die KI-Analyse (Risikobewertung, Warnungen, Empfehlungen) wird in Ihrem Konto gespeichert. Sie k&ouml;nnen jedes Ergebnis jederzeit l&ouml;schen.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">3. Zweck der Datenverarbeitung</h2>
          <p>Wir verarbeiten Ihre Daten ausschlie&szlig;lich zur Bereitstellung des Vertragsanalyse-Dienstes.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Rechtsgrundlage</h2>
          <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Vertragserf&uuml;llung).</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Vertragsanalyse und KI-Verarbeitung</h2>
          <p>Der Dokumenttext wird an Anthropic (USA) zur KI-Analyse &uuml;ber eine verschl&uuml;sselte API-Verbindung gesendet. Gem&auml;&szlig; den API-Nutzungsbedingungen von Anthropic werden &uuml;ber die API gesendete Daten nicht zum Training ihrer Modelle verwendet. Die Originaldatei wird sofort nach der Textextraktion gel&ouml;scht. Nur die Analyseergebnisse werden gespeichert.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Drittanbieter</h2>
          <p><strong>Anthropic (Claude AI):</strong> Auftragsverarbeiter f&uuml;r die KI-Analyse. Sitz in den USA. Rechtsgrundlage f&uuml;r den Datentransfer: Standardvertragsklauseln (SCCs) gem&auml;&szlig; Art. 46 DSGVO.</p>
          <p className="mt-2"><strong>Neon (Datenbank):</strong> Hosting der Analyseergebnisse in einer PostgreSQL-Datenbank mit Verschl&uuml;sselung.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">7. Cookies</h2>
          <p>Wir verwenden ausschlie&szlig;lich essenzielle Session-Cookies f&uuml;r die Authentifizierung. Wir verwenden keine Tracking-, Analyse- oder Werbe-Cookies.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Betroffenenrechte</h2>
          <p>Sie haben das Recht auf:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Auskunft &uuml;ber Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>L&ouml;schung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschr&auml;nkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Daten&uuml;bertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">9. Beschwerderecht</h2>
          <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbeh&ouml;rde zu beschweren.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">10. Datenl&ouml;schung</h2>
          <p>Analyseergebnisse werden gespeichert, bis Sie sie l&ouml;schen. Kontodaten werden bis zur Kontol&ouml;schung aufbewahrt. Dokumenttexte werden nie dauerhaft gespeichert.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">11. SSL-Verschl&uuml;sselung</h2>
          <p>Diese Seite nutzt aus Sicherheitsgr&uuml;nden eine SSL- bzw. TLS-Verschl&uuml;sselung. Eine verschl&uuml;sselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt.</p>
        </div>
      </section>
    </div>
  )
}
