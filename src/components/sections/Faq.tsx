import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Faq as FaqType } from '@/payload-types'

export function Faq({ faqs }: { faqs: FaqType[] }) {
  return (
    <section className="sec faq" id="faq">
      <div className="wrap">
        <div className="sec-head reveal center" data-index="04">
          <span className="eyebrow">Häufige Fragen</span>
          <h2>
            Gut zu <em>wissen.</em>
          </h2>
          <p>Die Fragen, die uns Patienten am häufigsten stellen — klar beantwortet.</p>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={f.id} className={`qa reveal d${Math.floor(i / 2) + 1}`}>
              <summary>
                {f.question}
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <div className="ans">
                <RichText data={f.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
