import Link from 'next/link'

/** Wortmarke mit Dachstuhl-Logo. `footer` schaltet auf die helleren Töne um. */
export function Brand({
  name,
  suffix,
  href = '/',
  footer = false,
}: {
  name: string
  suffix: string
  href?: string
  footer?: boolean
}) {
  const primary = footer ? '#e6a85a' : '#bd6b2c'
  const secondary = footer ? '#d08a36' : '#a3551e'
  return (
    <Link href={href} className="brand" aria-label={`${name} ${suffix} Startseite`}>
      <svg className="logomark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke={secondary} strokeWidth="1.5" />
        <path d="M8 27 L20 9 L32 27" stroke={primary} strokeWidth="2" strokeLinejoin="round" />
        <path d="M13 27 L20 16 L27 27 M20 9 V20" stroke={secondary} strokeWidth="1.6" />
        <line x1="8" y1="27" x2="32" y2="27" stroke={primary} strokeWidth="2" />
      </svg>
      <span style={footer ? { fontWeight: 600, color: '#faf6ec' } : { fontWeight: 600 }}>{name}</span>
      <b style={footer ? { color: '#faf6ec' } : undefined}>{suffix}</b>
    </Link>
  )
}
