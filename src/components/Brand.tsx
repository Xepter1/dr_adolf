import Link from 'next/link'

/** Wortmarke mit Kreuz-/Puls-Logo. `footer` schaltet auf die helleren Töne um. */
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
  const primary = footer ? '#5dcaa5' : '#0f6e56'
  const secondary = footer ? '#1d9e75' : '#0b5743'
  return (
    <Link href={href} className="brand" aria-label={`${name} ${suffix} Startseite`}>
      <svg className="logomark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke={secondary} strokeWidth="1.5" />
        <path d="M20 10 V30 M10 20 H30" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <path d="M9 20 h4 l2-4 3 8 2-4 h8" stroke={secondary} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity=".6" />
      </svg>
      <span style={footer ? { fontWeight: 600, color: '#f6faf8' } : { fontWeight: 600 }}>{name}</span>
      <b style={footer ? { color: '#f6faf8' } : undefined}>{suffix}</b>
    </Link>
  )
}
