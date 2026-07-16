import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import type { Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum der Zahnarztpraxis Johannes Adolf, Adlkofen.',
  robots: { index: false, follow: true },
}

export default async function ImpressumPage() {
  const payload = await getPayloadClient()
  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting

  return (
    <div className="page page--legal">
      <HeaderSub settings={settings} backHref="/" backLabel="← Zurück zur Startseite" showButton={false} />

      <main className="legal">
        <div className="wrap">
          <span className="eyebrow">Rechtliches</span>
          <h1>Impressum</h1>
          <p className="updated">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>

          <h2>Anbieter</h2>
          <p className="addr">
            <strong>Zahnarztpraxis Johannes Adolf</strong>
            <br />
            Johannes Adolf, Zahnarzt
            <br />
            Hauptstraße 26<br />
            84166 Adlkofen
            <br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p className="addr">
            Telefon: <a href="tel:+498707266">08707 266</a>
            <br />
            E-Mail: <a href="mailto:landpraxis-adolf@gmx.de">landpraxis-adolf@gmx.de</a>
          </p>

          <h2>Zahnärztlich verantwortlich</h2>
          <p>Johannes Adolf, Zahnarzt (Anschrift wie oben)</p>

          <h2>Berufsbezeichnung &amp; berufsrechtliche Regelungen</h2>
          <p className="addr">
            Gesetzliche Berufsbezeichnung: Zahnarzt (verliehen in der Bundesrepublik Deutschland)
            <br />
            Zuständige Kammer: Bayerische Landeszahnärztekammer (BLZK), Fallstraße 34, 81369 München — www.blzk.de
            <br />
            Zuständige Kassenzahnärztliche Vereinigung: Kassenzahnärztliche Vereinigung Bayerns (KZVB), Fallstraße 34, 81369 München — www.kzvb.de
          </p>
          <p>
            Es gelten insbesondere das Zahnheilkundegesetz, die Berufsordnung der Bayerischen Landeszahnärztekammer, die Gebührenordnung für Zahnärzte (GOZ)
            sowie das Heilberufe-Kammergesetz. Die vollständigen Bestimmungen sind auf der Website der BLZK (www.blzk.de) unter der Rubrik „Recht" einsehbar.
          </p>

          <h2>Umsatzsteuer</h2>
          <p>Heilbehandlungen sind gemäß § 4 Nr. 14 UStG von der Umsatzsteuer befreit.</p>

          <h2>Berufshaftpflichtversicherung</h2>
          <p className="addr">
            Angaben zur Berufshaftpflichtversicherung (Versicherer, Sitz, Geltungsraum) bitte ergänzen.
            <br />
            Geltungsraum: Deutschland
          </p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
            10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte
            auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als
            solche gekennzeichnet. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.
          </p>
        </div>
      </main>

      <FooterSub
        legalName={settings.legalName}
        year={currentYear()}
        links={[
          { href: '/impressum', label: 'Impressum' },
          { href: '/datenschutz', label: 'Datenschutz' },
          { href: '/', label: 'Startseite' },
        ]}
      />
    </div>
  )
}
