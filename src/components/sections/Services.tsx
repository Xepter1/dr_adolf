import { ServiceIcon } from '@/components/ServiceIcon'
import type { Leistungen } from '@/payload-types'

const REVEAL_SVC = ['d1', 'd2', 'd3', 'd1', 'd2', 'd3']

export function Services({ leistungen }: { leistungen: Leistungen[] }) {
  return (
    <section className="sec services" id="leistungen">
      <div className="wrap">
        <div className="sec-head reveal" data-index="01">
          <span className="eyebrow">Unsere Leistungen</span>
          <h2>
            Medizin, <em>die mitdenkt.</em>
          </h2>
          <p>
            Von der hausärztlichen Versorgung bis zur Vorsorge — bei uns sind Sie in guten Händen. Diagnostik, Behandlung und Begleitung aus einer Hand,
            mit Zeit für das persönliche Gespräch.
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
