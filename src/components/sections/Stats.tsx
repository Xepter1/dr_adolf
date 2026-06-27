import type { Setting } from '@/payload-types'

export function Stats({ settings: s }: { settings: Setting }) {
  return (
    <section className="sec stats">
      <div className="band-atmo" aria-hidden="true" />
      <div className="wrap">
        <div className="stats-grid">
          {(s.stats ?? []).map((st, i) => (
            <div key={i} className={`stat reveal d${i + 1}`}>
              <div className="n" data-count={st.count} data-suffix={st.suffix ?? ''}>
                0
              </div>
              <div className="l">{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
