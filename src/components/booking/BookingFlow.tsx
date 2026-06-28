'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import './booking.css'
import { createBooking, type AnamneseBundle } from '@/app/(frontend)/termin/actions'
import type { ArztView } from '@/app/(frontend)/termin/page'
import { ANAMNESE_FRAGEN } from '@/lib/anamnese'
import { encryptAnamnese } from '@/lib/crypto-client'
import { SlotGrid } from '@/components/booking/SlotGrid'

type Step = 'arzt' | 'anliegen' | 'slot' | 'form' | 'done'
interface ChosenSlot {
  iso: string
  time: string
  dayLabel: string
  weekdayLabel: string
}
interface Opt {
  value: string
  label: string
}
interface Props {
  aerzte: ArztView[]
  brandName: string
  intro: string | null
  terminarten: Opt[]
  versicherungen: Opt[]
  anamnesePublicKey: string | null
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'arzt', label: 'Arzt' },
  { key: 'anliegen', label: 'Anliegen' },
  { key: 'slot', label: 'Termin' },
  { key: 'form', label: 'Ihre Daten' },
]

export function BookingFlow({ aerzte, brandName, intro, terminarten, versicherungen, anamnesePublicKey }: Props) {
  const [step, setStep] = useState<Step>('arzt')
  const [arzt, setArzt] = useState<ArztView | null>(null)
  const [slot, setSlot] = useState<ChosenSlot | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [maskedEmail, setMaskedEmail] = useState('')

  // Schritt „Anliegen"
  const [bereits, setBereits] = useState<'ja' | 'nein' | ''>('')
  const [versicherung, setVersicherung] = useState('')
  const [terminart, setTerminart] = useState('')

  // Schritt „Ihre Daten"
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [monat, setMonat] = useState('')
  const [jahr, setJahr] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [erinnerung, setErinnerung] = useState(false)
  const [einwilligung, setEinwilligung] = useState(false)
  const [anamneseOpen, setAnamneseOpen] = useState(false)
  const [anamnese, setAnamnese] = useState<Record<string, string>>({})

  const istNeupatient = bereits === 'nein'
  const anamneseVerfuegbar = !!anamnesePublicKey
  const setAnswer = (id: string, v: string) => setAnamnese((p) => ({ ...p, [id]: v }))
  const anliegenReady = bereits !== '' && !!versicherung && !!terminart

  const activeIdx = STEPS.findIndex((x) => x.key === (step === 'done' ? 'form' : step))

  const pickArzt = (a: ArztView) => {
    setArzt(a)
    setSlot(null)
    setStep('anliegen')
  }
  const pickSlot = (iso: string, time: string, dayLabel: string, weekdayLabel: string) => {
    setSlot({ iso, time, dayLabel, weekdayLabel })
    setError(null)
    setStep('form')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!arzt || !slot) return
    setError(null)
    const geb = `${jahr}-${monat.padStart(2, '0')}-${tag.padStart(2, '0')}`
    if (!/^\d{4}-\d{2}-\d{2}$/.test(geb) || Number.isNaN(Date.parse(geb))) {
      setError('Bitte geben Sie ein gültiges Geburtsdatum an (Tag, Monat, Jahr).')
      return
    }
    startTransition(async () => {
      let anamneseBundle: AnamneseBundle | null = null
      if (istNeupatient && anamneseOpen && anamnesePublicKey) {
        const filled = Object.fromEntries(Object.entries(anamnese).filter(([, v]) => v?.trim()))
        if (Object.keys(filled).length > 0) {
          try {
            anamneseBundle = await encryptAnamnese(anamnesePublicKey, filled)
          } catch {
            setError('Der Anamnesebogen konnte nicht verschlüsselt werden. Bitte ohne Bogen fortfahren oder erneut versuchen.')
            return
          }
        }
      }
      const res = await createBooking({
        arztId: arzt.id,
        slotIso: slot.iso,
        terminart,
        versicherung,
        name,
        geburtsdatum: geb,
        email,
        telefon,
        istNeupatient,
        erinnerung,
        einwilligung,
        anamnese: anamneseBundle,
      })
      if (res.ok) {
        setMaskedEmail(res.maskedEmail)
        setStep('done')
      } else {
        setError(res.error)
      }
    })
  }

  const DocChip = ({ a }: { a: ArztView }) => (
    <div className="bk-chosen-doc">
      <span className="bk-avatar sm" aria-hidden="true">
        {a.fotoUrl ? <img src={a.fotoUrl} alt="" /> : a.initials}
      </span>
      <div>
        <strong>{a.fullName}</strong>
        <span>{a.fachrichtung}</span>
      </div>
    </div>
  )

  return (
    <main className="bk-wrap">
      <header className="bk-head">
        <Link className="bk-home" href="/">
          ← Zurück zur Startseite
        </Link>
        <h1>Termin online buchen</h1>
        {intro && step === 'arzt' && <p className="bk-intro">{intro}</p>}
        {step !== 'done' && (
          <ol className="bk-steps" aria-label="Fortschritt">
            {STEPS.map((st, i) => (
              <li key={st.key} className={i === activeIdx ? 'is-active' : i < activeIdx ? 'is-done' : ''}>
                <span className="bk-num">{i < activeIdx ? '✓' : i + 1}</span>
                {st.label}
              </li>
            ))}
          </ol>
        )}
      </header>

      {/* 1 — Arzt */}
      {step === 'arzt' && (
        <section className="bk-grid" aria-label="Ärzte">
          {aerzte.length === 0 && <p className="bk-empty">Zurzeit sind keine Ärzte für die Onlinebuchung hinterlegt.</p>}
          {aerzte.map((a) => {
            const next = a.days.find((d) => d.slots.length > 0)
            return (
              <button key={a.id} type="button" className="bk-card" onClick={() => pickArzt(a)}>
                <span className="bk-avatar" aria-hidden="true">
                  {a.fotoUrl ? <img src={a.fotoUrl} alt="" /> : a.initials}
                </span>
                <span className="bk-card-name">{a.fullName}</span>
                <span className="bk-card-fach">{a.fachrichtung}</span>
                {a.vita && <span className="bk-card-vita">{a.vita}</span>}
                <span className={`bk-next ${next ? '' : 'is-none'}`}>
                  {next ? `Nächster Termin: ${next.weekdayLabel}, ${next.dayLabel}` : 'Zurzeit ausgebucht'}
                </span>
              </button>
            )
          })}
        </section>
      )}

      {/* 2 — Anliegen */}
      {step === 'anliegen' && arzt && (
        <section className="bk-panel" aria-label="Anliegen">
          <button type="button" className="bk-back" onClick={() => setStep('arzt')}>
            ← Anderer Arzt
          </button>
          <DocChip a={arzt} />

          <div className="bk-qgroup">
            <h2 className="bk-q">Waren Sie bereits in dieser Praxis?</h2>
            <div className="bk-toggle">
              <button type="button" className={bereits === 'ja' ? 'is-on' : ''} onClick={() => setBereits('ja')}>
                Ja
              </button>
              <button type="button" className={bereits === 'nein' ? 'is-on' : ''} onClick={() => setBereits('nein')}>
                Nein, ich bin neu
              </button>
            </div>
          </div>

          <div className="bk-qgroup">
            <h2 className="bk-q">Wie sind Sie versichert?</h2>
            <div className="bk-arten">
              {versicherungen.map((v) => (
                <button key={v.value} type="button" className={`bk-chip ${versicherung === v.value ? 'is-on' : ''}`} onClick={() => setVersicherung(v.value)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bk-qgroup">
            <h2 className="bk-q">Worum geht es?</h2>
            <div className="bk-arten">
              {terminarten.map((t) => (
                <button key={t.value} type="button" className={`bk-chip ${terminart === t.value ? 'is-on' : ''}`} onClick={() => setTerminart(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className="bk-hint">Bitte keine sensiblen Gesundheitsdetails angeben – die Kategorie genügt.</p>
          </div>

          <button type="button" className="bk-submit" disabled={!anliegenReady} onClick={() => setStep('slot')}>
            Weiter zur Terminwahl
          </button>
        </section>
      )}

      {/* 3 — Termin */}
      {step === 'slot' && arzt && (
        <section className="bk-panel" aria-label="Termin wählen">
          <button type="button" className="bk-back" onClick={() => setStep('anliegen')}>
            ← Zurück
          </button>
          <DocChip a={arzt} />
          <SlotGrid days={arzt.days} onPick={pickSlot} />
        </section>
      )}

      {/* 4 — Ihre Daten */}
      {step === 'form' && arzt && slot && (
        <section className="bk-panel" aria-label="Ihre Daten">
          <button type="button" className="bk-back" onClick={() => setStep('slot')}>
            ← Andere Uhrzeit
          </button>
          <div className="bk-summary">
            <span className="bk-avatar sm" aria-hidden="true">
              {arzt.fotoUrl ? <img src={arzt.fotoUrl} alt="" /> : arzt.initials}
            </span>
            <div>
              <strong>{arzt.fullName}</strong>
              <span>
                {slot.weekdayLabel}, {slot.dayLabel} · {slot.time} Uhr
              </span>
            </div>
          </div>

          <form className="bk-form" onSubmit={submit}>
            <label className="bk-field">
              <span>Name *</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>

            <fieldset className="bk-fieldset">
              <legend>Geburtsdatum *</legend>
              <div className="bk-row">
                <label className="bk-field bk-field-sm">
                  <span>Tag</span>
                  <input inputMode="numeric" placeholder="TT" maxLength={2} value={tag} onChange={(e) => setTag(e.target.value.replace(/\D/g, ''))} required />
                </label>
                <label className="bk-field bk-field-sm">
                  <span>Monat</span>
                  <input inputMode="numeric" placeholder="MM" maxLength={2} value={monat} onChange={(e) => setMonat(e.target.value.replace(/\D/g, ''))} required />
                </label>
                <label className="bk-field bk-field-sm">
                  <span>Jahr</span>
                  <input inputMode="numeric" placeholder="JJJJ" maxLength={4} value={jahr} onChange={(e) => setJahr(e.target.value.replace(/\D/g, ''))} required />
                </label>
              </div>
            </fieldset>

            <div className="bk-row">
              <label className="bk-field">
                <span>E-Mail *</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </label>
              <label className="bk-field">
                <span>Telefon (optional)</span>
                <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} autoComplete="tel" />
              </label>
            </div>

            {istNeupatient && anamneseVerfuegbar && (
              <div className="bk-anamnese">
                <label className="bk-check">
                  <input type="checkbox" checked={anamneseOpen} onChange={(e) => setAnamneseOpen(e.target.checked)} />
                  <span>
                    <strong>Anamnesebogen jetzt ausfüllen</strong> (optional) – das spart Zeit vor Ort.
                  </span>
                </label>
                {anamneseOpen && (
                  <div className="bk-anamnese-body">
                    <p className="bk-lock">🔒 Ende-zu-Ende verschlüsselt – nur die Praxis kann den Bogen lesen, nicht einmal der Server.</p>
                    {ANAMNESE_FRAGEN.map((q) => (
                      <label key={q.id} className="bk-field">
                        <span>{q.label}</span>
                        {q.type === 'textarea' ? (
                          <textarea rows={2} value={anamnese[q.id] ?? ''} onChange={(e) => setAnswer(q.id, e.target.value)} />
                        ) : q.type === 'choice' ? (
                          <select value={anamnese[q.id] ?? ''} onChange={(e) => setAnswer(q.id, e.target.value)}>
                            <option value="">– bitte wählen –</option>
                            {q.options!.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input type="text" value={anamnese[q.id] ?? ''} placeholder={q.placeholder} onChange={(e) => setAnswer(q.id, e.target.value)} />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <label className="bk-check">
              <input type="checkbox" checked={erinnerung} onChange={(e) => setErinnerung(e.target.checked)} />
              <span>Ich möchte eine Terminerinnerung per E-Mail (freiwillig, jederzeit widerrufbar).</span>
            </label>
            <label className="bk-check">
              <input type="checkbox" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} required />
              <span>
                Ich willige in die Verarbeitung meiner Daten zur Terminvereinbarung ein (
                <a href="/datenschutz" target="_blank" rel="noreferrer">
                  Datenschutz
                </a>
                ). *
              </span>
            </label>

            {error && <p className="bk-error">{error}</p>}
            <button type="submit" className="bk-submit" disabled={pending}>
              {pending ? 'Wird gesendet …' : 'Termin anfragen'}
            </button>
          </form>
        </section>
      )}

      {/* 5 — Bestätigung (Double-Opt-In) */}
      {step === 'done' && (
        <section className="bk-done" aria-live="polite">
          <div className="bk-done-ic" aria-hidden="true">
            ✓
          </div>
          <h2>Fast geschafft!</h2>
          <p>
            Wir haben eine Bestätigungs-E-Mail an <strong>{maskedEmail}</strong> geschickt. Bitte klicken Sie auf den Link
            darin – erst dann ist Ihr Termin bei {brandName || 'uns'} verbindlich reserviert.
          </p>
          <p className="bk-hint">Keine E-Mail erhalten? Prüfen Sie den Spam-Ordner. Der Link ist 24 Stunden gültig.</p>
          <Link className="bk-home2" href="/">
            Zur Startseite
          </Link>
        </section>
      )}
    </main>
  )
}
