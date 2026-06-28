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
  switch (icon) {
    case 'heart':
      return (
        <svg {...common}>
          <path d="M24 39C12 31 6 23.5 6 16.5A8.5 8.5 0 0 1 24 11a8.5 8.5 0 0 1 18 5.5C42 23.5 36 31 24 39Z" />
          <path d="M13 23h5l2-4 3 8 2-4h6" strokeWidth="1.5" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M24 6l14 5v9c0 9-6 16-14 22-8-6-14-13-14-22v-9z" />
          <path d="M17 23l5 5 9-10" />
        </svg>
      )
    case 'child':
      return (
        <svg {...common}>
          <circle cx="24" cy="13" r="6" />
          <path d="M14 40v-6a10 10 0 0 1 20 0v6" />
        </svg>
      )
    case 'lab':
      return (
        <svg {...common}>
          <path d="M20 6v11L10 35a4 4 0 0 0 4 6h20a4 4 0 0 0 4-6L28 17V6" />
          <path d="M17 6h14M15 30h18" />
        </svg>
      )
    case 'housecall':
      return (
        <svg {...common}>
          <path d="M8 22 24 8l16 14" />
          <path d="M11 20v20h26V20" />
          <path d="M24 28v8M20 32h8" />
        </svg>
      )
    case 'stethoscope':
    default:
      return (
        <svg {...common}>
          <path d="M15 8v8a9 9 0 0 0 18 0V8" />
          <path d="M13 8h4M31 8h4" />
          <path d="M24 25v3" />
          <circle cx="24" cy="33" r="5" />
        </svg>
      )
  }
}
