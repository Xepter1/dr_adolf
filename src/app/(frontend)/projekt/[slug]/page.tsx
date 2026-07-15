import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt, currentYear } from '@/lib/format'
import { HeaderSub, FooterSub } from '@/components/SiteChrome'
import type { Projekte, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function loadProjekte() {
  const payload = await getPayloadClient()
  const [settings, res] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'projekte', sort: 'sortOrder', limit: 100, depth: 1 }),
  ])
  return { settings: settings as Setting, projekte: res.docs as Projekte[] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { projekte } = await loadProjekte()
  const p = projekte.find((x) => x.slug === slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.lead,
    openGraph: { type: 'article', title: `${p.title} — Zahnarztpraxis Johannes Adolf`, description: p.lead, images: [mediaUrl(p.hero)] },
  }
}

export default async function ProjektPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { settings, projekte } = await loadProjekte()
  const i = projekte.findIndex((x) => x.slug === slug)
  if (i === -1) notFound()

  const p = projekte[i]
  const n = projekte.length
  const prev = projekte[(i - 1 + n) % n]
  const next = projekte[(i + 1) % n]
  const heroUrl = mediaUrl(p.hero)
  const ba = p.beforeAfter
  const hasBA = ba && mediaUrl(ba.before) && mediaUrl(ba.after)
  const gallery = (p.gallery ?? []).filter((g) => typeof g === 'object')

  return (
    <div className="page page--project">
      <HeaderSub settings={settings} backHref="/#projekte" backLabel="← Alle Projekte" />

      <main>
        {/* HERO */}
        <section className="phero" style={{ ['--hero' as string]: `url('${heroUrl}')` } as CSSProperties}>
          <div className="wrap">
            <div className="crumb">
              <Link href="/">Start</Link> · <Link href="/#projekte">Projekte</Link> · {p.title}
            </div>
            <span className="ptag">
              {p.tag} · {p.location} · {p.year}
            </span>
            <h1>{p.title}</h1>
            <p className="lead">{p.lead}</p>
          </div>
        </section>

        {/* FACTS */}
        {p.facts && p.facts.length > 0 && (
          <section className="facts">
            <div className="wrap">
              <div className="facts-grid">
                {p.facts.map((f, idx) => (
                  <div className="fact" key={idx}>
                    <div className="fl">{f.label}</div>
                    <div className="fv">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STORY */}
        <section className="story">
          <div className="wrap">
            <div className="beam-sep" aria-hidden="true">
              <span className="beam" />
            </div>
            <div className="story-grid">
              <div className="block reveal">
                <span className="eyebrow">Die Aufgabe</span>
                <p>{p.aufgabe}</p>
              </div>
              <div className="block reveal">
                <span className="eyebrow">Unsere Lösung</span>
                <p>{p.loesung}</p>
              </div>
              <div className="block reveal">
                <span className="eyebrow">Das Ergebnis</span>
                <p>{p.ergebnis}</p>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER (optional) */}
        {hasBA && (
          <section className="beforeafter">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">Vorher · Nachher</span>
                <h2>
                  Aus alt wird <em>wertvoll.</em>
                </h2>
                {ba?.caption && <p>{ba.caption}</p>}
              </div>
              <div className="ba reveal" aria-label="Vorher-Nachher-Vergleich">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ba-after" src={mediaUrl(ba?.after)} alt="Nachher: saniert" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ba-before" src={mediaUrl(ba?.before)} alt="Vorher: Bestand" />
                <span className="ba-tag before">Vorher</span>
                <span className="ba-tag after">Nachher</span>
                <div className="ba-handle">
                  <span className="ba-grip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
                    </svg>
                  </span>
                </div>
                <input className="ba-range" type="range" min="0" max="100" defaultValue="50" aria-label="Vergleich Vorher/Nachher verschieben" />
              </div>
            </div>
          </section>
        )}

        {/* GALLERY */}
        {gallery.length > 0 && (
          <section className="gallery">
            <div className="wrap">
              <div className="sec-head reveal">
                <span className="eyebrow">Galerie</span>
                <h2>
                  Bilder vom <em>Projekt</em>
                </h2>
              </div>
              <div className="gal-grid">
                {gallery.map((g, idx) => {
                  const url = mediaUrl(g)
                  return (
                    <button key={idx} className="gal-item span2 reveal" data-full={url} aria-label="Bild vergrößern">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={mediaAlt(g, `${p.title} — Ansicht ${idx + 1}`)} loading="lazy" />
                      <span className="zoom">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="11" cy="11" r="7" />
                          <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
                        </svg>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* NEXT / PREV */}
        <section className="pnav">
          <div className="wrap">
            <div className="pnav-grid">
              <Link className="pnav-card prev" href={`/projekt/${prev.slug}`}>
                <span className="dir">← Vorheriges Projekt</span>
                <span className="nm">{prev.title}</span>
              </Link>
              <Link className="pnav-card next" href={`/projekt/${next.slug}`}>
                <span className="dir">Nächstes Projekt →</span>
                <span className="nm">{next.title}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="wrap">
            <h2>
              Planen Sie <em>Ähnliches?</em>
            </h2>
            <p>Erzählen Sie uns von Ihrem Vorhaben — wir melden uns innerhalb von 24 Stunden mit einer ehrlichen ersten Einschätzung.</p>
            <Link href="/#kontakt" className="btn">
              Projekt besprechen <span className="arr">→</span>
            </Link>
          </div>
        </section>
      </main>

      <FooterSub
        legalName={settings.legalName}
        year={currentYear()}
        links={[
          { href: '/#projekte', label: 'Projekte' },
          { href: '/impressum', label: 'Impressum' },
          { href: '/datenschutz', label: 'Datenschutz' },
          { href: '/', label: 'Startseite' },
        ]}
      />

      {/* LIGHTBOX */}
      <div className="lb" id="lb" role="dialog" aria-modal="true" aria-label="Bildansicht" aria-hidden="true">
        <div className="lb-stage">
          <button className="lb-btn lb-close" id="lbClose" aria-label="Schließen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <button className="lb-btn lb-prev" id="lbPrev" aria-label="Vorheriges Bild">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18 9 12l6-6" />
            </svg>
          </button>
          <button className="lb-btn lb-next" id="lbNext" aria-label="Nächstes Bild">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <figure className="lb-figure">
            {/* src wird beim Öffnen der Lightbox per JS gesetzt (SiteScripts). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id="lbImg" alt="" />
            <figcaption className="lb-cap">
              <span />
              <span className="count" id="lbCount" />
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}
