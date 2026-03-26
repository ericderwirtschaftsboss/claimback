import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Impressum — SignGuard' }

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm text-primary hover:underline">&larr; Zur Startseite</Link>
        <h1 className="text-3xl font-bold mt-4">Impressum</h1>
      </div>
      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
          <p>Eric Garcia<br />Reichenbachstra&szlig;e 65D<br />01217 Dresden<br />Deutschland</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Kontakt</h2>
          <p>Telefon: +49 174 209 1951<br />E-Mail: ericgkonto@gmail.com</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Verantwortlich f&uuml;r den Inhalt nach &sect; 55 Abs. 2 RStV</h2>
          <p>Eric Garcia<br />Reichenbachstra&szlig;e 65D<br />01217 Dresden</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">EU-Streitschlichtung</h2>
          <p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
          <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Haftung f&uuml;r Inhalte</h2>
          <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Haftung f&uuml;r Links</h2>
          <p>Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Urheberrecht</h2>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
        </div>
      </section>
    </div>
  )
}
