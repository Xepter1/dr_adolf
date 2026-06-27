/** Statisches Markup des Farbwelt-Umschalters – Logik liegt in SiteScripts. */
export function ThemeSwitch() {
  return (
    <div className="theme-switch" role="group" aria-label="Materialwelt wählen">
      <span className="theme-switch__label">Materialwelt</span>
      <button type="button" className="tsw tsw-holz" data-theme-set="holz" aria-label="Holz & Espresso" aria-pressed="true">
        <i />
      </button>
      <button type="button" className="tsw tsw-schiefer" data-theme-set="schiefer" aria-label="Schiefer & Kupfer" aria-pressed="false">
        <i />
      </button>
      <button type="button" className="tsw tsw-kalk" data-theme-set="kalk" aria-label="Kalk & Eiche" aria-pressed="false">
        <i />
      </button>
    </div>
  )
}
