import type { Setting } from '@/payload-types'

export function Welcome({ settings: s }: { settings: Setting }) {
  const text = s.welcomeText
  if (!text) return null
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="sec welcome" id="willkommen">
      <div className="wrap welcome-wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Willkommen</span>
          {s.welcomeHeading && <h2>{s.welcomeHeading}</h2>}
        </div>
        <div className="welcome-body reveal">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {s.welcomeSignature && <p className="welcome-sign">{s.welcomeSignature}</p>}
        </div>
      </div>
    </section>
  )
}
