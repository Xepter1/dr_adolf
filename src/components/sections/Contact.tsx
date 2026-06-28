import Link from 'next/link'
import type { Setting } from '@/payload-types'

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
)
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export function Contact({ settings: s }: { settings: Setting }) {
  const zeiten = s.oeffnungszeiten ?? []
  return (
    <section className="sec contact" id="kontakt">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="eyebrow reveal">Kontakt</span>
            <h2 className="reveal d1">
              Wir sind <em>für Sie da.</em>
            </h2>
            <p className="reveal d1">
              Für einen Termin nutzen Sie am besten die Online-Buchung. Für alles andere — Rezepte, Rückfragen oder ein Anliegen — erreichen Sie uns
              telefonisch oder per E-Mail.
            </p>
            <div className="cinfo reveal d2">
              <span className="lbl">Telefon</span>
              <a href={`tel:${s.phoneHref}`}>
                <PhoneIcon /> {s.phoneDisplay}
              </a>
              <span className="lbl">E-Mail</span>
              <a href={`mailto:${s.email}`}>
                <MailIcon /> {s.email}
              </a>
              <span className="lbl">Praxis</span>
              <span>
                <PinIcon /> {s.addressStreet}, {s.addressCity}
              </span>
            </div>
          </div>

          <div className="hours reveal d2" id="oeffnungszeiten">
            <h3>Öffnungszeiten</h3>
            <ul>
              {zeiten.map((z, i) => (
                <li key={i}>
                  <span className="tag">{z.tag}</span>
                  <span className={`zeit ${/geschlossen/i.test(z.zeit) ? 'is-closed' : ''}`}>{z.zeit}</span>
                </li>
              ))}
            </ul>
            <Link href="/termin" className="btn">
              Termin online buchen <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
