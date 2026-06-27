import type { Setting } from '@/payload-types'

export function About({ settings: s }: { settings: Setting }) {
  return (
    <section className="sec about" id="ueber">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-vis reveal">
            <div className="grid-bg" />
            <svg viewBox="0 0 400 448" fill="none" stroke="#e6a85a" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M70 360 L200 150 L330 360 Z" strokeWidth="3" />
              <path d="M70 360 H330" strokeWidth="3" />
              <path d="M200 150 V360 M200 360 L110 250 M200 360 L290 250 M110 250 H290" />
              <path d="M150 215 L250 215" strokeWidth="1.3" opacity=".6" />
              <rect x="150" y="300" width="40" height="60" strokeWidth="1.4" opacity=".7" />
              <rect x="215" y="300" width="40" height="40" strokeWidth="1.4" opacity=".7" />
            </svg>
            <svg className="stamp" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="cir" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1" />
              <text fontFamily="Hanken Grotesk" fontSize="9.5" fontWeight="700" letterSpacing="3" fill="currentColor">
                <textPath href="#cir" startOffset="0%">
                  · MEISTERBETRIEB · SEIT 1989 · NIEDERBAYERN{' '}
                </textPath>
              </text>
              <path d="M48 60 L57 69 L74 50" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="about-info">
            <span className="eyebrow reveal">Über {s.brandName}</span>
            <h2 className="reveal d1">
              Drei Generationen <em>Holzverstand.</em>
            </h2>
            <p className="reveal d1 dropcap">
              Was 1989 in einer kleinen Werkstatt in Niederbayern begann, ist heute ein Meisterbetrieb mit 18 Mitarbeitern — und derselben Haltung wie am
              ersten Tag: Ein Handschlag gilt. Termine halten. Und Holz nur dort verbauen, wo wir auch selbst wohnen würden.
            </p>
            <p className="reveal d2">
              Wir setzen auf heimische Hölzer, kurze Wege und eine eigene Abbundhalle. So behalten wir jede Faser unter Kontrolle — vom Stamm bis zum
              fertigen First.
            </p>
            <ul className="about-list reveal d2">
              {['Eigene Abbundhalle', 'Meister & Azubis im Team', 'Festpreis-Garantie', 'Regional verwurzelt'].map((item) => (
                <li key={item}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>{' '}
                  {item}
                </li>
              ))}
            </ul>
            <div className="sign reveal d3">
              Martin Aigner<small>Zimmermeister &amp; Inhaber</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
