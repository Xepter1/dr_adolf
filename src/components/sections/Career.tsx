import type { Job, Setting } from '@/payload-types'

export function Career({ settings: s, jobs }: { settings: Setting; jobs: Job[] }) {
  return (
    <section className="sec career" id="karriere">
      <svg className="career-deco" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M20 150 100 40l80 110zM50 150 100 80l50 70zM100 40v110" />
      </svg>
      <div className="wrap">
        <div className="career-grid">
          <div>
            <span className="eyebrow">Karriere bei {s.brandName}</span>
            <h2>
              {s.careerHeadingPrefix}
              <em>{s.careerHeadingAccent}</em>
            </h2>
            <p>{s.careerText}</p>
            <a href="#kontakt" className="btn" style={{ background: 'var(--cream)', color: 'var(--espresso)' }}>
              Initiativ bewerben <span className="arr">→</span>
            </a>
          </div>
          <div className="jobs">
            {jobs.map((j) => (
              <a key={j.id} href="#kontakt" className="job">
                <div>
                  <b>{j.title}</b>
                  <div className="type">{j.type}</div>
                </div>
                <span className="go">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
