import type { CSSProperties } from 'react'
import Link from 'next/link'

import { mediaUrl } from '@/lib/format'
import type { Projekte } from '@/payload-types'

const ph = (url: string): CSSProperties => ({ ['--ph' as string]: `url(${url}) center/cover no-repeat` }) as CSSProperties
const REVEAL_PROJ = ['d1', 'd2', 'd1', 'd2', 'd3', 'd4']

export function Projects({ projekte }: { projekte: Projekte[] }) {
  return (
    <section className="sec projects" id="projekte">
      <div className="wrap">
        <div className="proj-head">
          <div className="reveal">
            <span className="eyebrow">Ausgewählte Projekte</span>
            <h2 style={{ fontSize: 'clamp(2.1rem,4.6vw,3.6rem)', fontWeight: 330, marginTop: 18, letterSpacing: '-.03em' }}>
              Gebaut in <em style={{ fontStyle: 'italic', color: 'var(--wood-2)' }}>Niederbayern</em>
            </h2>
          </div>
          <a href="#kontakt" className="btn ghost reveal d2">
            Projekt anfragen →
          </a>
        </div>
        <div className="proj-grid">
          {projekte.map((p, i) => (
            <Link
              key={p.id}
              className={`proj ${p.featuredSize ?? 'wide'} reveal ${REVEAL_PROJ[i % REVEAL_PROJ.length]}`}
              href={`/projekt/${p.slug}`}
              style={ph(mediaUrl(p.hero))}
              aria-label={`Projekt ansehen: ${p.title}`}
            >
              <span className="open">→</span>
              <div className="meta">
                <span className="tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <div className="loc">
                  {p.location} · {p.year}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
