import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import { ServiceIcon } from '@/components/ServiceIcon'
import type { Leistungen, Media, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Params = { slug: string; sub: string }

async function loadData() {
  const payload = await getPayloadClient()
  const [settings, res] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'leistungen', sort: 'sortOrder', limit: 100 }),
  ])
  return { settings: settings as Setting, leistungen: res.docs as Leistungen[] }
}

function locate(leistungen: Leistungen[], slug: string, sub: string) {
  const parent = leistungen.find((x) => x.slug === slug) ?? null
  const u = parent?.unterleistungen?.find((x) => x.slug === sub) ?? null
  return { parent, u }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, sub } = await params
  const { leistungen } = await loadData()
  const { parent, u } = locate(leistungen, slug, sub)
  if (!parent || !u) return {}
  const desc = u.lead ?? u.abschnitte?.[0]?.text?.slice(0, 160) ?? parent.description
  return {
    title: u.title,
    description: desc,
    openGraph: { type: 'article', title: `${u.title} — Zahnarztpraxis Johannes Adolf`, description: desc },
  }
}

export default async function UnterleistungPage({ params }: { params: Promise<Params> }) {
  const { slug, sub } = await params
  const { settings, leistungen } = await loadData()
  const { parent, u } = locate(leistungen, slug, sub)
  if (!parent || !u) notFound()

  const subs = parent.unterleistungen ?? []
  const i = subs.findIndex((x) => x.slug === sub)
  const prev = i > 0 ? subs[i - 1] : null
  const next = i >= 0 && i < subs.length - 1 ? subs[i + 1] : null
  const abschnitte = u.abschnitte ?? []

  // Bild rechts im Seitenkopf: eigenes → sonst das der Kategorie → sonst kein Bild
  const uMedia = (u.heroImage && typeof u.heroImage === 'object' ? u.heroImage : null) as Media | null
  const parentMedia = (parent.heroImage && typeof parent.heroImage === 'object' ? parent.heroImage : null) as Media | null
  const heroUrl =
    uMedia?.sizes?.portrait?.url ?? uMedia?.url ?? parentMedia?.sizes?.portrait?.url ?? parentMedia?.url ?? null

  return (
    <div className="page page--leistung">
      <HeaderSub settings={settings} backHref={`/leistungen/${parent.slug}`} backLabel={`← ${parent.title}`} />

      <main>
        {/* HERO */}
        <section className="lhero">
          <div className="lhero-bg" aria-hidden="true" />
          <div className="wrap">
            <div className="crumb">
              <Link href="/">Start</Link> · <Link href="/#leistungen">Leistungen</Link> ·{' '}
              <Link href={`/leistungen/${parent.slug}`}>{parent.title}</Link> · {u.title}
            </div>
            <span className="lhero-ic" aria-hidden="true">
              <ServiceIcon icon={parent.icon} />
            </span>
            <h1>{u.title}</h1>
            {u.lead && <p className="lead">{u.lead}</p>}
            <div className="lhero-cta">
              <Link href="/termin" className="btn">
                Termin buchen <span className="arr">→</span>
              </Link>
              <Link href={`/leistungen/${parent.slug}`} className="btn ghost">
                Zurück zu {parent.title}
              </Link>
            </div>
          </div>
        </section>

        {/* INHALT */}
        {(abschnitte.length > 0 || heroUrl) && (
          <section className="sec lcontent">
            <div className={`wrap${heroUrl ? ' lprose-layout' : ''}`}>
              <div className="lprose reveal">
                {abschnitte.map((a, idx) => (
                  <div key={a.id ?? idx} className="lprose-block">
                    {a.titel && <h2>{a.titel}</h2>}
                    {a.text.split(/\n{2,}/).map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ))}
              </div>
              {heroUrl && (
                <figure className="lfigure reveal">
                  <img src={heroUrl} alt={u.title} />
                </figure>
              )}
            </div>
          </section>
        )}

        {/* PREV / NEXT innerhalb der Kategorie */}
        <section className="pnav">
          <div className="wrap">
            <div className="pnav-grid">
              {prev ? (
                <Link className="pnav-card prev" href={`/leistungen/${parent.slug}/${prev.slug}`}>
                  <span className="dir">← Vorherige</span>
                  <span className="nm">{prev.title}</span>
                </Link>
              ) : (
                <Link className="pnav-card prev" href={`/leistungen/${parent.slug}`}>
                  <span className="dir">← Übersicht</span>
                  <span className="nm">{parent.title}</span>
                </Link>
              )}
              {next ? (
                <Link className="pnav-card next" href={`/leistungen/${parent.slug}/${next.slug}`}>
                  <span className="dir">Nächste →</span>
                  <span className="nm">{next.title}</span>
                </Link>
              ) : (
                <Link className="pnav-card next" href="/termin">
                  <span className="dir">Termin →</span>
                  <span className="nm">Online buchen</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
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
              <a href={`tel:${settings.phoneHref}`} className="btn ghost">
                {settings.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      <FooterSub
        legalName={settings.legalName}
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
