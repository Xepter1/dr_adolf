import Link from 'next/link'
import type { Aerzte, Media } from '@/payload-types'

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

export function Team({ aerzte }: { aerzte: Aerzte[] }) {
  if (aerzte.length === 0) return null
  return (
    <section className="sec team" id="team">
      <div className="wrap">
        <div className="sec-head reveal" data-index="02">
          <span className="eyebrow">Unser Team</span>
          <h2>
            Ärzte, die <em>zuhören.</em>
          </h2>
          <p>Wählen Sie Ihren Arzt — und buchen Sie direkt einen freien Termin.</p>
        </div>
        <div className="team-grid">
          {aerzte.map((a, i) => {
            const foto = a.foto && typeof a.foto === 'object' ? (a.foto as Media) : null
            return (
              <article key={a.id} className="doc reveal">
                <span className={`doc-avatar${foto?.url ? ' has-photo' : ''}`} data-av={i % 4} aria-hidden="true">
                  {foto?.url ? <img src={foto.url} alt="" /> : <span className="doc-initials">{initialsOf(a.name)}</span>}
                </span>
                <h3>{[a.titel, a.name].filter(Boolean).join(' ')}</h3>
                <span className="doc-fach">{a.fachrichtung}</span>
                {a.vita && <p>{a.vita}</p>}
                <Link href="/termin" className="doc-cta">
                  Termin buchen <span className="arr">→</span>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
