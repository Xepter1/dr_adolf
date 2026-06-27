import type { Setting } from '@/payload-types'

export function Hero({ settings: s }: { settings: Setting }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="badge anim a1">
              <span className="dot" /> {s.heroBadge}
            </div>
            <h1 className="anim a2">
              {s.heroHeadingLine1}
              <br />
              {s.heroHeadingPrefix}
              <span className="it">{s.heroHeadingAccent}</span>
            </h1>
            <p className="lead anim a3">{s.heroLead}</p>
            <div className="hero-cta anim a4">
              <a href="#kontakt" className="btn">
                Projekt besprechen <span className="arr">→</span>
              </a>
              <a href="#projekte" className="btn ghost">
                Referenzen ansehen
              </a>
            </div>
            <div className="hero-meta anim a5">
              {(s.heroStats ?? []).map((st, i) => (
                <div key={i}>
                  <span className="n">{st.value}</span>
                  <span className="l">{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="truss-card">
              <div className="grid-bg" />
              <span className="label">Abbundplan · Pfettendach</span>
              <svg viewBox="0 0 400 440" fill="none" stroke="#d08a36" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path className="draw" style={{ animationDelay: '.4s' }} d="M40 300 L200 90 L360 300" stroke="#e6a85a" strokeWidth="3" />
                <path className="draw" style={{ animationDelay: '.7s' }} d="M40 300 L360 300" stroke="#e6a85a" strokeWidth="3" />
                <path className="draw" style={{ animationDelay: '1s' }} d="M200 90 L200 300" />
                <path className="draw" style={{ animationDelay: '1.2s' }} d="M200 300 L120 195" />
                <path className="draw" style={{ animationDelay: '1.2s' }} d="M200 300 L280 195" />
                <path className="draw" style={{ animationDelay: '1.4s' }} d="M120 195 L280 195" />
                <path className="draw" style={{ animationDelay: '1.55s' }} d="M120 195 L160 145 M280 195 L240 145" strokeWidth="1.4" opacity=".7" />
                <circle cx="200" cy="90" r="5" fill="#d08a36" stroke="none" />
                <circle cx="120" cy="195" r="4" fill="#d08a36" stroke="none" />
                <circle cx="280" cy="195" r="4" fill="#d08a36" stroke="none" />
                <circle cx="200" cy="300" r="4" fill="#d08a36" stroke="none" />
                <path d="M40 330 L360 330" stroke="#8a6a3a" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M40 324 L40 336 M360 324 L360 336" stroke="#8a6a3a" strokeWidth="1" />
                <text x="200" y="324" fill="#bca27a" fontSize="13" fontFamily="Hanken Grotesk" textAnchor="middle" stroke="none">
                  11,40 m
                </text>
              </svg>
              <div className="caption">
                <span>Konstruktion · KVH / BSH</span>
                <span>Maßstab 1:50</span>
              </div>
            </div>
            <div className="spec-chip one">
              <div className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div className="t">
                <b>PEFC</b>zertifiziertes Holz
              </div>
            </div>
            <div className="spec-chip two">
              <div className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div className="t">
                <b>10 Tage</b>vom Plan zur Montage
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
