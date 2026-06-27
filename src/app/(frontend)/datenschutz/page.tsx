import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import type { Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der AIGNER Holzbau GmbH.',
  robots: { index: false, follow: true },
}

export default async function DatenschutzPage() {
  const payload = await getPayloadClient()
  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting

  return (
    <div className="page page--legal">
      <HeaderSub settings={settings} backHref="/" backLabel="← Zurück zur Startseite" showButton={false} />

      <main className="legal">
        <div className="wrap">
          <span className="eyebrow">Rechtliches</span>
          <h1>Datenschutz&shy;erklärung</h1>
          <p className="updated">Gemäß Datenschutz-Grundverordnung (DSGVO)</p>

          <h2>1. Verantwortlicher</h2>
          <p className="addr">
            <strong>AIGNER Holzbau GmbH</strong>
            <br />
            Martin Aigner
            <br />
            Sägewerkstraße 4, 84028 Landshut
            <br />
            Telefon: <a href="tel:+498711234567">0871 123 45 67</a>
            <br />
            E-Mail: <a href="mailto:servus@aigner-holzbau.de">servus@aigner-holzbau.de</a>
          </p>

          <h2>2. Allgemeines zur Datenverarbeitung</h2>
          <p>
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
            unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers oder auf Grundlage einer
            gesetzlichen Erlaubnis (Art. 6 DSGVO).
          </p>

          <h2>3. Hosting &amp; Server-Logfiles</h2>
          <p>
            Diese Website wird auf einem Server in Deutschland gehostet. Bei jedem Aufruf erfasst der Server automatisch Informationen, die Ihr Browser
            übermittelt (Server-Logfiles):
          </p>
          <ul>
            <li>aufgerufene Seite / Datei</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>übertragene Datenmenge</li>
            <li>verwendeter Browsertyp und Betriebssystem</li>
            <li>anonymisierte IP-Adresse</li>
          </ul>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technischen Bereitstellung und Sicherheit). Die Logfiles werden nach
            spätestens 7 Tagen gelöscht.
          </p>

          <h2>4. Kontaktformular &amp; Kontaktaufnahme</h2>
          <p>
            Wenn Sie uns über das Formular oder per E-Mail kontaktieren, werden Ihre Angaben (Name, E-Mail, Telefon, Nachricht) zur Bearbeitung Ihrer Anfrage
            gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung/Erfüllung eines Vertrags) bzw. lit. f DSGVO. Diese Daten geben wir nicht ohne
            Ihre Einwilligung weiter und löschen sie, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten
            entgegenstehen.
          </p>

          <h2>5. Schriftarten (lokal gehostet)</h2>
          <p>
            Diese Website verwendet die Schriftarten „Fraunces" und „Hanken Grotesk". Diese werden <strong>lokal vom eigenen Server</strong> ausgeliefert. Es
            besteht <strong>keine Verbindung zu Servern Dritter</strong> (z.&nbsp;B. Google Fonts), und es werden hierbei keine Daten an Dritte übertragen.
          </p>

          <h2>6. Cookies &amp; Tracking</h2>
          <p>
            Diese Website setzt <strong>keine Cookies</strong> und nutzt <strong>keine Tracking- oder Analyse-Dienste</strong>. Es findet keine Erstellung von
            Nutzerprofilen statt.
          </p>

          <h2>7. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren — etwa beim Bayerischen Landesamt für Datenschutzaufsicht
            (BayLDA).
          </p>

          <h2>8. Datensicherheit</h2>
          <p>
            Wir setzen eine SSL/TLS-Verschlüsselung ein, um die Übertragung Ihrer Daten zu schützen. Eine verschlüsselte Verbindung erkennen Sie am „https://"
            und dem Schloss-Symbol in Ihrer Browserzeile.
          </p>

          <div className="note">
            <strong>Hinweis (für dieses Muster):</strong> AIGNER Holzbau ist ein fiktives Demonstrationsprojekt. Diese Datenschutzerklärung ist ein anpassbarer
            Mustertext und ersetzt keine Rechtsberatung. Vor dem produktiven Einsatz bitte an die tatsächlich eingesetzten Dienste, das Hosting und den
            Verantwortlichen anpassen und prüfen lassen.
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
