/** Liniensymbole für die Leistungs-Kacheln, ausgewählt über den `icon`-Schlüssel. */
export function ServiceIcon({ icon }: { icon: string }) {
  const common = {
    className: 'ic',
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (icon) {
    case 'house':
      return (
        <svg {...common}>
          <path d="M8 22 24 8l16 14v18H8z" />
          <path d="M20 40V28h8v12" />
        </svg>
      )
    case 'carport':
      return (
        <svg {...common}>
          <path d="M6 18 24 8l18 10" />
          <path d="M10 18v22M38 18v22M10 40h28" />
          <path d="M18 40V26h12v14" />
        </svg>
      )
    case 'renovation':
      return (
        <svg {...common}>
          <path d="M6 28 24 12l18 16" />
          <path d="M30 6l4 4-4 4-4-4z" />
          <path d="M10 28v12h28V28" />
        </svg>
      )
    case 'addition':
      return (
        <svg {...common}>
          <path d="M8 40V20l16-12 16 12v20" />
          <path d="M8 26h32M24 8v32" />
        </svg>
      )
    case 'interior':
      return (
        <svg {...common}>
          <path d="M6 12h36v24H6z" />
          <path d="M6 20h36M14 12v24M26 20v16" />
        </svg>
      )
    case 'roof':
    default:
      return (
        <svg {...common}>
          <path d="M6 30 24 10l18 20" />
          <path d="M12 30 24 18l12 12" />
          <path d="M6 30h36v8H6z" />
        </svg>
      )
  }
}
