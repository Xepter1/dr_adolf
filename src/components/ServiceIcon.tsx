/** Liniensymbole für die Leistungs-Kacheln, ausgewählt über den `icon`-Schlüssel. */
export function ServiceIcon({ icon }: { icon: string }) {
  const common = {
    className: 'ic',
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
  }
  // Gemeinsame Zahn-Silhouette (Krone mit zwei Wurzeln), für mehrere Symbole genutzt.
  const toothPath =
    'M24 9c-2.5-2-5-2.6-8-2.6C11 6.4 7.5 10 7.5 15c0 3.8 1.2 6.8 2.2 10.8.9 3.6 1.4 8.7 2.6 11 .5 1 1.2 1.6 2 1.6 1.5 0 2-2.4 2.5-5.4.6-3.3.9-6 3.2-6s2.6 2.7 3.2 6c.5 3 1 5.4 2.5 5.4.8 0 1.5-.6 2-1.6 1.2-2.3 1.7-7.4 2.6-11 1-4 2.2-7 2.2-10.8 0-5-3.5-8.6-8.5-8.6-3 0-5.5.6-8 2.6z'

  switch (icon) {
    case 'denture': // Zahnersatz – Zahn mit Kronenrand
      return (
        <svg {...common}>
          <path d={toothPath} />
          <path d="M13.5 19c6.5 3.5 14.5 3.5 21 0" strokeWidth="1.6" />
        </svg>
      )
    case 'implant': // Implantologie – Implantatschraube mit Aufbau
      return (
        <svg {...common}>
          <path d="M18.5 8h11l-1.5 8h-8z" />
          <path d="M24 16v24" />
          <path d="M19 20h10M19 24.5h10M19.5 29h9M21 33.5h6M22.5 38h3" strokeWidth="1.6" />
        </svg>
      )
    case 'braces': // Kieferorthopädie – Drahtbogen mit Brackets
      return (
        <svg {...common}>
          <path d="M6 24c6-3 30-3 36 0" />
          <rect x="11" y="20" width="6" height="8" rx="1.5" />
          <rect x="21" y="20" width="6" height="8" rx="1.5" />
          <rect x="31" y="20" width="6" height="8" rx="1.5" />
        </svg>
      )
    case 'sparkle': // Zahnästhetik – strahlendes Funkeln
      return (
        <svg {...common}>
          <path d="M21 7c2 9 4 11 13 13-9 2-11 4-13 13-2-9-4-11-13-13 9-2 11-4 13-13z" />
          <path d="M37 9l1.3 3.2 3.2 1.3-3.2 1.3L37 19l-1.3-3.2L32.5 14.5l3.2-1.3z" strokeWidth="1.4" />
        </svg>
      )
    case 'child': // Kinderbehandlung – lächelnder Zahn
      return (
        <svg {...common}>
          <path d={toothPath} />
          <circle cx="19.5" cy="20" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="28.5" cy="20" r="1.1" fill="currentColor" stroke="none" />
          <path d="M19 24.5c2.5 2.6 7.5 2.6 10 0" strokeWidth="1.6" />
        </svg>
      )
    case 'tooth':
    default: // Zahnerhalt
      return (
        <svg {...common}>
          <path d={toothPath} />
        </svg>
      )
  }
}
