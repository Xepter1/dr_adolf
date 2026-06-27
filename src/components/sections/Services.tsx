import { ServiceIcon } from '@/components/ServiceIcon'
import type { Leistungen } from '@/payload-types'

const REVEAL_SVC = ['d1', 'd2', 'd3', 'd1', 'd2', 'd3']

export function Services({ leistungen }: { leistungen: Leistungen[] }) {
  return (
    <section className="sec services" id="leistungen">
      <div className="wrap">
        <div className="sec-head reveal" data-index="01">
          <span className="eyebrow">Was wir können</span>
          <h2>
            Ein Gewerk. <em>Volle Verantwortung.</em>
          </h2>
          <p>
            Wir planen, fertigen und montieren — vom ersten Aufmaß bis zur letzten Schraube. So bleibt die Qualität in einer Hand und Sie haben einen
            Ansprechpartner.
          </p>
        </div>
        <div className="svc-grid">
          {leistungen.map((l, i) => (
            <article key={l.id} className={`svc reveal ${REVEAL_SVC[i % REVEAL_SVC.length]}`}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <ServiceIcon icon={l.icon} />
              <h3>{l.title}</h3>
              <p>{l.description}</p>
              <span className="more">Mehr erfahren →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
