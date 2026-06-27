export function BeforeAfter() {
  return (
    <section className="sec beforeafter">
      <div className="wrap">
        <div className="sec-head reveal center">
          <span className="eyebrow">Vorher · Nachher</span>
          <h2>
            Aus alt wird <em>wertvoll.</em>
          </h2>
          <p>Ziehen Sie den Regler — und sehen Sie, was aus einem in die Jahre gekommenen Dachstuhl bei uns wird.</p>
        </div>
        <div className="ba reveal" aria-label="Vorher-Nachher-Vergleich: Dachsanierung">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ba-after" src="/projekte/sichtdachstuhl-loft.jpg" alt="Nachher: ausgebauter Sichtdachstuhl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ba-before" src="/projekte/pfettendach-vierseithof.jpg" alt="Vorher: alter Dachstuhl" />
          <span className="ba-tag before">Vorher</span>
          <span className="ba-tag after">Nachher</span>
          <div className="ba-handle">
            <span className="ba-grip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
              </svg>
            </span>
          </div>
          <input className="ba-range" type="range" min="0" max="100" defaultValue="50" aria-label="Vergleich Vorher/Nachher verschieben" />
        </div>
      </div>
    </section>
  )
}
