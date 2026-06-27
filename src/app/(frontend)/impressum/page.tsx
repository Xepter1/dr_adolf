import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import type { Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum der AIGNER Holzbau GmbH, Landshut.',
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
            <strong>AIGNER Holzbau GmbH</strong>
            <br />
            Sägewerkstraße 4<br />
            84028 Landshut
            <br />
            Deutschland
          </p>

          <h2>Vertreten durch</h2>
          <p>Martin Aigner (Geschäftsführer)</p>

          <h2>Kontakt</h2>
          <p className="addr">
            Telefon: <a href="tel:+498711234567">0871 123 45 67</a>
            <br />
            E-Mail: <a href="mailto:servus@aigner-holzbau.de">servus@aigner-holzbau.de</a>
          </p>

          <h2>Registereintrag</h2>
          <p className="addr">
            Eintragung im Handelsregister
            <br />
            Registergericht: Amtsgericht Landshut
            <br />
            Registernummer: HRB 12345
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
            <br />
            DE 123 456 789
          </p>

          <h2>Berufsrechtliche Angaben</h2>
          <p className="addr">
            Berufsbezeichnung: Zimmerermeister (verliehen in der Bundesrepublik Deutschland)
            <br />
            Zuständige Kammer: Handwerkskammer Niederbayern-Oberpfalz
            <br />
            Eingetragen in die Handwerksrolle.
          </p>

          <h2>Berufshaftpflichtversicherung</h2>
          <p className="addr">
            Musterversicherung AG, 80331 München
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

          <div className="note">
            <strong>Hinweis (für dieses Muster):</strong> AIGNER Holzbau ist ein fiktives Demonstrationsprojekt. Sämtliche Angaben — Firma, Adresse, Register-
            und Steuernummern — sind frei erfunden. Vor dem produktiven Einsatz für einen echten Betrieb bitte alle Daten ersetzen und das Impressum rechtlich
            prüfen lassen.
          </div>
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
