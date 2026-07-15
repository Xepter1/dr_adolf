import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import { ServiceIcon } from '@/components/ServiceIcon'
import type { Leistungen, Media, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function loadLeistungen() {
  const payload = await getPayloadClient()
  const [settings, res] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'leistungen', sort: 'sortOrder', limit: 100 }),
  ])
  return { settings: settings as Setting, leistungen: res.docs as Leistungen[] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { leistungen } = await loadLeistungen()
  const l = leistungen.find((x) => x.slug === slug)
  if (!l) return {}
  return {
    title: l.title, // Layout-Template ergänzt „— Zahnarztpraxis Johannes Adolf"
    description: l.description,
    openGraph: { type: 'article', title: `${l.title} — Zahnarztpraxis Johannes Adolf`, description: l.description },
  }
}

export default async function LeistungPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { settings, leistungen } = await loadLeistungen()
  const i = leistungen.findIndex((x) => x.slug === slug)
  if (i === -1) notFound()

  const l = leistungen[i]
  const n = leistungen.length
  const prev = leistungen[(i - 1 + n) % n]
  const next = leistungen[(i + 1) % n]
  const punkte = l.leistungspunkte ?? []
  const ablauf = l.ablauf ?? []
  const faq = l.faq ?? []

  // Bild rechts im Seitenkopf (optional) → ohne Bild steht der Text allein
  const heroMedia = (l.heroImage && typeof l.heroImage === 'object' ? l.heroImage : null) as Media | null
  const heroUrl = heroMedia?.sizes?.portrait?.url ?? heroMedia?.url ?? null

  return (
    <div className="page page--leistung">
      <HeaderSub settings={settings} backHref="/#leistungen" backLabel="← Alle Leistungen" />

      <main>
        {/* HERO */}
        <section className="lhero">
          <div className="lhero-bg" aria-hidden="true" />
          <div className="wrap">
            <div className="crumb">
              <Link href="/">Start</Link> · <Link href="/#leistungen">Leistungen</Link> · {l.title}
            </div>
            <span className="lhero-ic" aria-hidden="true">
              <ServiceIcon icon={l.icon} />
            </span>
            <h1>{l.title}</h1>
            {l.lead && <p className="lead">{l.lead}</p>}
            <div className="lhero-cta">
              <Link href="/termin" className="btn">
                Termin buchen <span className="arr">→</span>
              </Link>
              <a href="#kontakt-cta" className="btn ghost">
                Fragen? Kontakt
              </a>
            </div>
          </div>
        </section>

        {/* INTRO + PUNKTE */}
        {(l.intro || punkte.length > 0 || heroUrl) && (
          <section className="sec lcontent">
            <div className="wrap">
              <div className="lcontent-grid">
                <div className="lintro reveal">
                  {l.intro && <p>{l.intro}</p>}
                </div>
                {(heroUrl || punkte.length > 0) && (
                  <div className="lcontent-side">
                    {heroUrl && (
                      <figure className="lfigure reveal">
                        <img src={heroUrl} alt={l.title} />
                      </figure>
                    )}
                    {punkte.length > 0 && (
                      <aside className="lpoints reveal">
                        <h2>Das bieten wir</h2>
                        <ul>
                          {punkte.map((p) => (
                            <li key={p.id ?? p.text}>{p.text}</li>
                          ))}
                        </ul>
                      </aside>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* UNTERLEISTUNGEN */}
        {(l.unterleistungen?.length ?? 0) > 0 && (
          <section className="sec lsubs">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">Im Detail</span>
                <h2>
                  Unsere Leistungen im <em>Einzelnen.</em>
                </h2>
              </div>
              <div className="lsubs-grid">
                {l.unterleistungen!.map((u, idx) => (
                  <Link key={u.slug ?? idx} href={`/leistungen/${l.slug}/${u.slug}`} className="lsub-card reveal">
                    <h3>{u.title}</h3>
                    {u.lead && <p>{u.lead}</p>}
                    <span className="lsub-go" aria-hidden="true">
                      Mehr erfahren →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ABLAUF */}
        {ablauf.length > 0 && (
          <section className="sec lablauf">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">Ablauf</span>
                <h2>
                  So läuft Ihr <em>Besuch ab.</em>
                </h2>
              </div>
              <ol className="lsteps">
                {ablauf.map((s, idx) => (
                  <li key={s.id ?? idx} className="lstep reveal">
                    <span className="lstep-n">{String(idx + 1).padStart(2, '0')}</span>
                    <h3>{s.titel}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="sec lfaq">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">Häufige Fragen</span>
                <h2>
                  Gut zu <em>wissen.</em>
                </h2>
              </div>
              <div className="lfaq-list">
                {faq.map((f, idx) => (
                  <details key={f.id ?? idx} className="lfaq-item reveal" open={idx === 0}>
                    <summary>{f.frage}</summary>
                    <p>{f.antwort}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PREV / NEXT */}
        <section className="pnav">
          <div className="wrap">
            <div className="pnav-grid">
              <Link className="pnav-card prev" href={`/leistungen/${prev.slug}`}>
                <span className="dir">← Vorherige Leistung</span>
                <span className="nm">{prev.title}</span>
              </Link>
              <Link className="pnav-card next" href={`/leistungen/${next.slug}`}>
                <span className="dir">Nächste Leistung →</span>
                <span className="nm">{next.title}</span>
              </Link>
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
