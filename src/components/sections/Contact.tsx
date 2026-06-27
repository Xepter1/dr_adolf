import ContactForm from '@/components/ContactForm'
import type { Setting } from '@/payload-types'

export function Contact({ settings: s, formId }: { settings: Setting; formId: number | null }) {
  return (
    <section className="sec contact" id="kontakt">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="eyebrow reveal">Kontakt</span>
            <h2 className="reveal d1">
              Reden wir über <em>Ihr Projekt.</em>
            </h2>
            <p className="reveal d1">
              Egal ob konkrete Anfrage oder erste Idee — schreiben Sie uns. Wir melden uns innerhalb von 24 Stunden mit einer ehrlichen ersten
              Einschätzung.
            </p>
            <div className="cinfo reveal d2">
              <span className="lbl">Telefon</span>
              <a href={`tel:${s.phoneHref}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>{' '}
                {s.phoneDisplay}
              </a>
              <span className="lbl">E-Mail</span>
              <a href={`mailto:${s.email}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>{' '}
                {s.email}
              </a>
              <span className="lbl">Werkstatt &amp; Halle</span>
              <span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>{' '}
                {s.addressStreet}, {s.addressCity}
              </span>
            </div>
          </div>
          <ContactForm formId={formId} />
        </div>
      </div>
    </section>
  )
}
