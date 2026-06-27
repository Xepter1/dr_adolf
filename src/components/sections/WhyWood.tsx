export function WhyWood() {
  return (
    <section className="sec why">
      <div className="band-atmo" aria-hidden="true" />
      <svg className="why-deco" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M20 150 100 40l80 110z" />
        <path d="M50 150 100 80l50 70zM100 40v110" />
      </svg>
      <div className="wrap">
        <div className="beam-sep on-dark reveal" aria-hidden="true" style={{ marginBottom: 54 }}>
          <span className="beam" />
        </div>
        <div className="sec-head reveal">
          <span className="eyebrow">Warum Holz</span>
          <h2>
            Der Baustoff mit <em>Zukunft.</em>
          </h2>
          <p>Holz ist nicht nur schön — es ist der durchdachteste Baustoff unserer Zeit. Nachwachsend, CO₂-speichernd und behaglich.</p>
        </div>
        <div className="why-grid">
          <div className="why-card reveal d1">
            <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 28V14M16 14c0-6 5-10 11-10 0 6-5 10-11 10zM16 18c0-5-4-8-9-8 0 5 4 8 9 8z" />
            </svg>
            <h3>Nachhaltig</h3>
            <p>Jeder Kubikmeter verbautes Holz bindet rund eine Tonne CO₂ — dauerhaft in Ihrem Gebäude.</p>
          </div>
          <div className="why-card reveal d2">
            <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3 4 9v8c0 7 5 11 12 13 7-2 12-6 12-13V9z" />
              <path d="M11 16l3 3 6-6" />
            </svg>
            <h3>Wohngesund</h3>
            <p>Diffusionsoffene Wände regulieren Feuchte natürlich — für ein angenehmes, allergenarmes Raumklima.</p>
          </div>
          <div className="why-card reveal d3">
            <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4v6M16 22v6M4 16h6M22 16h6M8 8l4 4M20 20l4 4M24 8l-4 4M12 20l-4 4" />
            </svg>
            <h3>Schnell trocken</h3>
            <p>Vorgefertigt in der Halle, in Tagen montiert. Keine Trockenzeiten, kein monatelanger Baulärm.</p>
          </div>
          <div className="why-card reveal d4">
            <svg className="ic" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 26 16 6l10 20zM11 26l5-10 5 10z" />
            </svg>
            <h3>Hoch gedämmt</h3>
            <p>Schlanke Wände, top U-Werte. Mehr Wohnfläche bei besserer Energiebilanz — KfW-fähig.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
