import type { Testimonial } from '@/payload-types'

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="sec testi">
      <div className="wrap">
        <div className="sec-head reveal center" data-index="03">
          <span className="eyebrow">Das sagen unsere Patienten</span>
          <h2>
            Was am Ende <em>zählt.</em>
          </h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <article key={t.id} className={`quote reveal d${i + 1}`}>
              <div className="stars">{'★'.repeat(t.rating ?? 5)}</div>
              <p>„{t.quote}"</p>
              <div className="who">
                <div className="av">{t.initials}</div>
                <div>
                  <b>{t.author}</b>
                  <span>{t.project}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
