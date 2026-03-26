import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'AGB — SignGuard' }

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm text-primary hover:underline">&larr; Zur Startseite</Link>
        <h1 className="text-3xl font-bold mt-4">Allgemeine Gesch&auml;ftsbedingungen (AGB)</h1>
        <p className="text-muted-foreground mt-1">Stand: M&auml;rz 2026</p>
      </div>
      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 1 Geltungsbereich</h2>
          <p>Diese AGB gelten f&uuml;r alle Vertr&auml;ge zwischen dem Betreiber von SignGuard (siehe <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>) und dem Nutzer &uuml;ber die Plattform SignGuard.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 2 Vertragsgegenstand</h2>
          <p>SignGuard bietet einen KI-gest&uuml;tzten Vertragsanalyse-Dienst an. Der Nutzer kann Vertr&auml;ge hochladen oder einf&uuml;gen, die dann von einer k&uuml;nstlichen Intelligenz auf potenzielle Risiken, unfaire Klauseln und finanzielle Gefahren analysiert werden.</p>
        </div>
        <div className="rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
          <h2 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400">&sect; 3 Keine Rechtsberatung</h2>
          <p className="text-red-700 dark:text-red-400"><strong>SignGuard ist keine Anwaltskanzlei und bietet keine Rechtsberatung an.</strong> Die KI-Analyse dient ausschlie&szlig;lich zu Informationszwecken. Die Analyse kann Fehler, Auslassungen oder Fehlinterpretationen enthalten. F&uuml;r rechtlich verbindliche Entscheidungen konsultieren Sie bitte einen qualifizierten Rechtsanwalt.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 4 Nutzung des Dienstes</h2>
          <p>Der Dienst akzeptiert Dokumente in den Formaten PDF, DOCX und TXT sowie per Texteingabe oder URL. Der Nutzer versichert, dass er das Recht hat, die hochgeladenen Dokumente analysieren zu lassen.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 5 Preise und Zahlung</h2>
          <p>Die aktuellen Preise sind auf der <Link href="/pricing" className="text-primary hover:underline">Preisseite</Link> einsehbar. Preis&auml;nderungen werden mit angemessener Frist angek&uuml;ndigt. W&auml;hrend der Beta-Phase sind alle Funktionen kostenlos verf&uuml;gbar.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 6 Widerrufsrecht</h2>
          <p><strong>Widerrufsbelehrung:</strong> Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr&uuml;nden diesen Vertrag zu widerrufen. Die Widerrufsfrist betr&auml;gt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
          <p className="mt-2">Um Ihr Widerrufsrecht auszu&uuml;ben, m&uuml;ssen Sie uns mittels einer eindeutigen Erkl&auml;rung (z.B. per E-Mail) &uuml;ber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Kontaktdaten finden Sie im <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>.</p>
          <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung &uuml;ber die Aus&uuml;bung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
          <p className="mt-2"><strong>Folgen des Widerrufs:</strong> Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverz&uuml;glich und sp&auml;testens binnen vierzehn Tagen ab dem Tag zur&uuml;ckzuzahlen, an dem die Mitteilung &uuml;ber Ihren Widerruf bei uns eingegangen ist.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 7 Haftungsbeschr&auml;nkung</h2>
          <p>SignGuard haftet nicht f&uuml;r Entscheidungen, die auf Grundlage der KI-Analyse getroffen werden. Die Analyse wird ohne Gew&auml;hr f&uuml;r Vollst&auml;ndigkeit, Richtigkeit oder Eignung f&uuml;r einen bestimmten Zweck bereitgestellt.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 8 Gew&auml;hrleistung</h2>
          <p>Eine Garantie f&uuml;r die Vollst&auml;ndigkeit oder Richtigkeit der KI-Analyse wird nicht &uuml;bernommen. KI-basierte Analysen k&ouml;nnen Fehler enthalten.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 9 Datenschutz</h2>
          <p>Einzelheiten zur Datenverarbeitung finden Sie in unserer <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerkl&auml;rung</Link>.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 10 K&uuml;ndigung</h2>
          <p>Sie k&ouml;nnen Ihr Konto jederzeit l&ouml;schen. Bei L&ouml;schung werden alle gespeicherten Analyseergebnisse unwiderruflich entfernt.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 11 Salvatorische Klausel</h2>
          <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein, so ber&uuml;hrt dies die Wirksamkeit der &uuml;brigen Bestimmungen nicht.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">&sect; 12 Anwendbares Recht und Gerichtsstand</h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland. F&uuml;r Verbraucher in der EU gelten zus&auml;tzlich die zwingenden Verbraucherschutzgesetze des Wohnsitzlandes.</p>
        </div>
      </section>
    </div>
  )
}
