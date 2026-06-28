import Link from 'next/link'
import { ServiceIcon } from '@/components/ServiceIcon'
import { HelixVideo } from '@/components/HelixVideo'
import type { Leistungen, Setting } from '@/payload-types'

export function Hero({ settings: s, leistungen }: { settings: Setting; leistungen: Leistungen[] }) {
  return (
    <section className="hero" id="leistungen">
      <div className="hero-bg2" aria-hidden="true">
        <div className="hero-img" />
        <div className="hero-tint" />
      </div>

      <div className="wrap hero-inner">
        <div className="hero-helix" aria-hidden="true">
          <HelixVideo className="hero-helix-video" />
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
            <a href="#leistungen" className="btn ghost">
              Unsere Leistungen
            </a>
          </div>
        </div>

        {leistungen.length > 0 && (
          <aside className="hero-tiles anim a5" aria-label="Unsere Leistungen">
            {leistungen.slice(0, 6).map((l) => (
              <Link key={l.id} href={`/leistungen/${l.slug}`} className="hero-tile">
                <span className="hero-tile-ic" aria-hidden="true">
                  <ServiceIcon icon={l.icon} />
                </span>
                <span className="hero-tile-t">{l.title}</span>
                <span className="hero-tile-go" aria-hidden="true">→</span>
              </Link>
            ))}
          </aside>
        )}
      </div>

      <a href="#leistungen" className="hero-scroll" aria-label="Nach unten scrollen">
        <span />
      </a>
    </section>
  )
}
