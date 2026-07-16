import type { Metadata } from 'next'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import type { Aktuelle, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aktuelles',
  description: 'Neuigkeiten und Hinweise aus der Zahnarztpraxis Johannes Adolf in Adlkofen.',
}

const fmtDatum = (iso: string): string =>
  new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))

export default async function AktuellesPage() {
  const payload = await getPayloadClient()

  // Ab Mitternacht heute: eine Meldung „gültig bis heute" ist heute noch sichtbar.
  const heute = new Date()
  heute.setHours(0, 0, 0, 0)

  const [settings, res] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({
      collection: 'aktuelles',
      where: {
        and: [
          { aktiv: { equals: true } },
          { or: [{ gueltigBis: { exists: false } }, { gueltigBis: { greater_than_equal: heute.toISOString() } }] },
        ],
      },
      sort: '-datum',
      limit: 50,
      depth: 0,
    }),
  ])

  const s = settings as Setting
  const meldungen = res.docs as Aktuelle[]

  return (
    <div className="page page--leistung">
      <HeaderSub settings={s} backHref="/" backLabel="← Zurück zur Startseite" />

      <main>
        <section className="lhero">
          <div className="lhero-bg" aria-hidden="true" />
          <div className="wrap">
            <div className="crumb">
              <Link href="/">Start</Link> · Aktuelles
            </div>
            <h1>Aktuelles</h1>
            <p className="lead">Neuigkeiten und Hinweise aus unserer Praxis.</p>
          </div>
        </section>

        <section className="sec lcontent">
          <div className="wrap">
            {meldungen.length > 0 ? (
              <div className="akt-list">
                {meldungen.map((m) => (
                  <article key={m.id} className="akt-item reveal">
                    <time className="akt-date" dateTime={m.datum}>
                      {fmtDatum(m.datum)}
                    </time>
                    <h2>{m.titel}</h2>
                    {m.text.split(/\n{2,}/).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {m.linkUrl && (
                      <a className="akt-link" href={m.linkUrl} target="_blank" rel="noopener noreferrer">
                        {m.linkText || 'Mehr erfahren'} <span className="arr">→</span>
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="akt-empty">Zurzeit gibt es keine aktuellen Meldungen.</p>
            )}
          </div>
        </section>

        <section className="cta" id="kontakt-cta">
          <div className="wrap">
            <h2>
              Brauchen Sie einen <em>Termin?</em>
            </h2>
            <p>Buchen Sie online in unter zwei Minuten — Wunschzeit wählen, bestätigen, fertig. Für Rückfragen erreichen Sie uns telefonisch.</p>
            <div className="cta-row">
              <Link href="/termin" className="btn">
                Termin buchen <span className="arr">→</span>
              </Link>
              <a href={`tel:${s.phoneHref}`} className="btn ghost">
                {s.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterSub
        legalName={s.legalName}
        year={currentYear()}
        links={[
          { href: '/#leistungen', label: 'Leistungen' },
          { href: '/termin', label: 'Termin buchen' },
          { href: '/impressum', label: 'Impressum' },
          { href: '/datenschutz', label: 'Datenschutz' },
          { href: '/', label: 'Startseite' },
        ]}
      />
    </div>
  )
}
