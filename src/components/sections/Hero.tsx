import Link from 'next/link'
import { ServiceIcon } from '@/components/ServiceIcon'
import { ToothVideo } from '@/components/ToothVideo'
import type { Leistungen, Setting } from '@/payload-types'

export function Hero({ settings: s, leistungen }: { settings: Setting; leistungen: Leistungen[] }) {
  return (
    <section className="hero" id="leistungen">
      <div className="hero-bg2" aria-hidden="true">
        <div className="hero-img" />
        <div className="hero-tint" />
      </div>

      <div className="wrap hero-inner">
        <div className="hero-tooth" aria-hidden="true">
          <ToothVideo className="hero-tooth-video" />
        </div>

        <div className="hero-content">
          <h1 className="anim a2">
            {s.heroHeadingLine1}
            <br />
            {s.heroHeadingPrefix}
            <span className="it">{s.heroHeadingAccent}</span>
          </h1>
          <div className="hero-cta anim a4">
            <Link href="/termin" className="btn">
              Termin buchen <span className="arr">→</span>
            </Link>
          </div>
        </div>

        {leistungen.length > 0 && (
          <aside className="hero-tiles anim a5" aria-label="Unsere Leistungen">
            {leistungen.slice(0, 6).map((l) => {
              const subs = (l.unterleistungen ?? []).filter((s) => s.slug)
              const hasSubs = subs.length > 0
              return (
                <div key={l.id} className="hero-tile" data-subs={hasSubs ? subs.length : 0}>
                  {/* gläserne Fläche, die nach außen morpht — enthält die Unterpunkte */}
                  <div className="hero-tile-card">
                    {hasSubs && (
                      <ul className="hero-tile-subs" aria-label={`${l.title} – Unterleistungen`}>
                        {subs.map((s) => (
                          <li key={s.slug}>
                            <Link href={`/leistungen/${l.slug}/${s.slug}`} className="hero-tile-sub">
                              {s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Kategorie bleibt fix auf der Original-Kachel und klickbar */}
                  <Link href={`/leistungen/${l.slug}`} className="hero-tile-cat">
                    <span className="hero-tile-ic" aria-hidden="true">
                      <ServiceIcon icon={l.icon} />
                    </span>
                    <span className="hero-tile-t">{l.title}</span>
                    <span className="hero-tile-go" aria-hidden="true">→</span>
                  </Link>
                </div>
              )
            })}
          </aside>
        )}
      </div>

      <a href="#leistungen" className="hero-scroll" aria-label="Nach unten scrollen">
        <span />
      </a>
    </section>
  )
}
