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
        <path
          d="M20 9C18 7.4 15.2 6.8 12.6 6.8 9 6.8 6.7 9.4 6.7 13 6.7 16.5 8 19.2 8.8 22.9 9.4 25.8 9.6 31 11.4 31 13.1 31 13.4 26.6 14.2 24 14.8 22 16.2 21 20 24 23.8 21 25.2 22 25.8 24 26.6 26.6 26.9 31 28.6 31 30.4 31 30.6 25.8 31.2 22.9 32 19.2 33.3 16.5 33.3 13 33.3 9.4 31 6.8 27.4 6.8 24.8 6.8 22 7.4 20 9Z"
          fill={primary}
        />
      </svg>
      <span style={footer ? { fontWeight: 600, color: '#f6faf8' } : { fontWeight: 600 }}>{name}</span>
      <b style={footer ? { color: '#f6faf8' } : undefined}>{suffix}</b>
    </Link>
  )
}
