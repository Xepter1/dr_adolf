'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import './booking.css'
import { cancelTermin, rescheduleTermin } from '@/app/(frontend)/termin/manage-actions'
import { SlotGrid } from '@/components/booking/SlotGrid'
import type { DaySlots } from '@/lib/slots'

type Mode = 'view' | 'reschedule' | 'cancelled' | 'rescheduled'

interface Props {
  token: string
  status: string
  currentLabel: string
  arztName: string
  days: DaySlots[]
}

export function ManageTermin({ token, status, currentLabel, arztName, days }: Props) {
  const [mode, setMode] = useState<Mode>(status === 'abgesagt' ? 'cancelled' : 'view')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)

  const doCancel = () =>
    startTransition(async () => {
      setError(null)
      const res = await cancelTermin(token)
      if (res.ok) setMode('cancelled')
      else setError(res.error ?? 'Fehler.')
    })

  const doReschedule = (iso: string) =>
    startTransition(async () => {
      setError(null)
      const res = await rescheduleTermin(token, iso)
      if (res.ok) {
        setNewLabel(res.label ?? '')
        setMode('rescheduled')
      } else setError(res.error ?? 'Fehler.')
    })

  return (
    <main className="bk-wrap">
      <div className="bk-head">
        <Link className="bk-home" href="/">← Zur Startseite</Link>
        <h1>Termin verwalten</h1>
      </div>

      {mode === 'cancelled' && (
        <section className="bk-done">
          <h2>Termin abgesagt</h2>
          <p>Ihr Termin ist storniert. Es ist nichts weiter zu tun.</p>
          <Link className="bk-home2" href="/termin">Neuen Termin buchen</Link>
        </section>
      )}

      {mode === 'rescheduled' && (
        <section className="bk-done">
          <div className="bk-done-ic" aria-hidden="true">✓</div>
          <h2>Termin verschoben</h2>
          <p>Ihr neuer Termin:</p>
          <p><strong>{newLabel}</strong></p>
          <p className="bk-hint">Wir haben Ihnen die neue Bestätigung per E-Mail geschickt.</p>
          <Link className="bk-home2" href="/">Zur Startseite</Link>
        </section>
      )}

      {mode === 'view' && (
        <section className="bk-panel">
          <div className="bk-summary">
            <div>
              <strong>{currentLabel}</strong>
              {arztName && <span>{arztName}</span>}
            </div>
          </div>
          {error && <p className="bk-error">{error}</p>}
          <div className="bk-manage-actions">
            <button type="button" className="bk-submit" onClick={() => setMode('reschedule')} disabled={pending || days.length === 0}>
              Termin verschieben
            </button>
            {!confirmCancel ? (
              <button type="button" className="bk-danger" onClick={() => setConfirmCancel(true)} disabled={pending}>
                Termin absagen
              </button>
            ) : (
              <span className="bk-confirm">
                Wirklich absagen?
                <button type="button" className="bk-danger" onClick={doCancel} disabled={pending}>
                  {pending ? '…' : 'Ja, absagen'}
                </button>
                <button type="button" className="bk-back" onClick={() => setConfirmCancel(false)}>Zurück</button>
              </span>
            )}
          </div>
          {days.length === 0 && <p className="bk-hint">Aktuell sind keine alternativen Termine verfügbar.</p>}
        </section>
      )}

      {mode === 'reschedule' && (
        <section className="bk-panel">
          <button type="button" className="bk-back" onClick={() => setMode('view')}>← Zurück</button>
          <p className="bk-hint" style={{ marginBottom: 12 }}>Neuen Termin{arztName ? ` bei ${arztName}` : ''} wählen:</p>
          {error && <p className="bk-error">{error}</p>}
          <SlotGrid days={days} onPick={(iso) => doReschedule(iso)} />
        </section>
      )}
    </main>
  )
}
