'use client'

import { useState } from 'react'

const VORHABEN = [
  { value: 'dachstuhl-neubau', label: 'Dachstuhl / Neubau' },
  { value: 'holzhaus', label: 'Holzhaus' },
  { value: 'carport-terrasse', label: 'Carport / Terrasse' },
  { value: 'dachsanierung', label: 'Dachsanierung' },
  { value: 'aufstockung', label: 'Aufstockung' },
  { value: 'innenausbau', label: 'Innenausbau' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Kontaktformular – sendet echte Einsendungen an die Payload Form-Builder API. */
export default function ContactForm({ formId }: { formId: string | number | null }) {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formId) {
      setStatus('error')
      return
    }
    const fd = new FormData(e.currentTarget)
    const submissionData = ['name', 'telefon', 'email', 'vorhaben', 'nachricht'].map((field) => ({
      field,
      value: String(fd.get(field) ?? ''),
    }))
    setStatus('sending')
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const label =
    status === 'done'
      ? 'Danke — wir melden uns!'
      : status === 'sending'
        ? 'Wird gesendet …'
        : status === 'error'
          ? 'Erneut versuchen'
          : 'Anfrage senden'

  return (
    <form className="form reveal d2" onSubmit={onSubmit}>
      <div className="row">
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" name="name" type="text" placeholder="Ihr Name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="f-tel">Telefon</label>
          <input id="f-tel" name="telefon" type="tel" placeholder="Für Rückfragen" autoComplete="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-mail">E-Mail</label>
        <input id="f-mail" name="email" type="email" placeholder="name@email.de" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="f-vorhaben">Ihr Vorhaben</label>
        <select id="f-vorhaben" name="vorhaben" defaultValue="dachstuhl-neubau">
          {VORHABEN.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-msg">Nachricht</label>
        <textarea id="f-msg" name="nachricht" placeholder="Erzählen Sie uns kurz von Ihrem Projekt …" />
      </div>
      <button
        type="submit"
        className="btn"
        disabled={status === 'sending' || status === 'done'}
        style={status === 'done' ? { background: 'var(--wood-2)' } : undefined}
      >
        {label} {status === 'idle' && <span className="arr">→</span>}
      </button>
      <p className="fine">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben gemäß{' '}
        <a href="/datenschutz" className="ulink">
          Datenschutzerklärung
        </a>{' '}
        zu. Keine Weitergabe an Dritte.
      </p>
      {status === 'error' && (
        <p className="fine" style={{ color: 'var(--wood-2)' }}>
          Senden fehlgeschlagen. Bitte rufen Sie uns an oder versuchen Sie es später erneut.
        </p>
      )}
    </form>
  )
}
