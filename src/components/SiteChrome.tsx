import Link from 'next/link'
import { Brand } from './Brand'

export interface ChromeSettings {
  brandName: string
  brandSuffix: string
  legalName: string
  tagline?: string | null
  phoneDisplay: string
  phoneHref: string
  email: string
  addressStreet?: string | null
  addressCity?: string | null
}

export interface NavSubleistung {
  title: string
  slug?: string | null
}
export interface NavLeistung {
  title: string
  slug?: string | null
  unterleistungen?: (NavSubleistung | null)[] | null
}

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export function HeaderHome({ settings, leistungen = [] }: { settings: ChromeSettings; leistungen?: NavLeistung[] }) {
  return (
    <header className="site-header site-header--home" id="hdr">
      <div className="wrap nav">
        <Brand name={settings.brandName} suffix={settings.brandSuffix} href="/" />
        <nav>
          <ul>
            {/* „Leistungen" bewusst nicht in der Nav — die Hero-Kacheln sind die Leistungsübersicht. */}
            <li><a href="#team">Praxis &amp; Team</a></li>
            <li><a href="#oeffnungszeiten">Öffnungszeiten</a></li>
            <li><Link href="/aktuelles">Aktuelles</Link></li>
            <li><a href="#kontakt">Kontakt</a></li>
          </ul>
        </nav>
        <div className="nav-cta">
          <a href={`tel:${settings.phoneHref}`} className="tel">
            <PhoneIcon /> {settings.phoneDisplay}
          </a>
          <Link href="/termin" className="btn">
            Termin buchen <span className="arr">→</span>
          </Link>
        </div>
        <button className="burger" id="burger" aria-label="Menü öffnen">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export function HeaderSub({
  settings,
  backHref,
  backLabel,
  showButton = true,
}: {
  settings: ChromeSettings
  backHref: string
  backLabel: string
  showButton?: boolean
}) {
  return (
    <header className="site-header site-header--sub">
      <div className="wrap nav">
        <Brand name={settings.brandName} suffix={settings.brandSuffix} href="/" />
        <div className="nav-right">
          <Link href={backHref} className="back">
            {backLabel}
          </Link>
          {showButton && (
            <Link href="/termin" className="btn">
              Termin buchen <span className="arr">→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export function FooterHome({ settings, year, leistungen = [] }: { settings: ChromeSettings; year: number; leistungen?: NavLeistung[] }) {
  const footLeistungen = leistungen.slice(0, 5)
  return (
    <footer className="site-footer--home">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Brand name={settings.brandName} suffix={settings.brandSuffix} href="/" footer />
            {settings.tagline && <p>{settings.tagline}</p>}
          </div>
          <div className="foot-col">
            <h4>Leistungen</h4>
            <ul>
              {footLeistungen.length > 0 ? (
                footLeistungen.map((l) => (
                  <li key={l.slug ?? l.title}>
                    <Link href={`/leistungen/${l.slug}`}>{l.title}</Link>
                  </li>
                ))
              ) : (
                <li><Link href="/#leistungen">Unsere Leistungen</Link></li>
              )}
            </ul>
          </div>
          <div className="foot-col">
            <h4>Praxis</h4>
            <ul>
              <li><Link href="/termin">Termin buchen</Link></li>
              <li><Link href="/#team">Praxis &amp; Team</Link></li>
              <li><Link href="/#oeffnungszeiten">Öffnungszeiten</Link></li>
              <li><Link href="/aktuelles">Aktuelles</Link></li>
              <li><Link href="/#kontakt">Kontakt</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Kontakt</h4>
            <ul>
              <li><a href={`tel:${settings.phoneHref}`}>{settings.phoneDisplay}</a></li>
              <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li>
                <a href="#">
                  {settings.addressStreet}
                  <br />
                  {settings.addressCity}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {year} {settings.legalName} · Alle Rechte vorbehalten</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </span>
          <span className="made">
            Gestaltet von{' '}
            <a href="https://xepter.de" target="_blank" rel="noopener">
              xepter.de
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export function FooterSub({
  legalName,
  year,
  links,
}: {
  legalName: string
  year: number
  links: Array<{ href: string; label: string }>
}) {
  return (
    <footer className="site-footer--sub">
      <div className="wrap">
        <span>© {year} {legalName}</span>
        <span className="links">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </span>
      </div>
    </footer>
  )
}
