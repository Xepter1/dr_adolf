import type { ReactNode } from 'react'
import Link from 'next/link'
import '@/components/booking/booking.css'
import { getPayloadClient } from '@/lib/payload'
import { formatTerminLabel } from '@/lib/time'
import { siteUrl } from '@/lib/tokens'
import { sendConfirmationEmail } from '@/lib/email'
import type { Aerzte, Setting, Termine } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Outcome = 'ok' | 'expired' | 'invalid' | 'cancelled'

function Result({ outcome, label, arztName, icsUrl, brandName }: { outcome: Outcome; label?: string; arztName?: string; icsUrl?: string; brandName: string }) {
  if (outcome === 'ok') {
    return (
      <section className="bk-done">
        <div className="bk-done-ic" aria-hidden="true">✓</div>
        <h2>Termin bestätigt</h2>
        <p>
          Ihr Termin{arztName ? <> bei <strong>{arztName}</strong></> : ''} ist verbindlich reserviert:
        </p>
        <p><strong>{label}</strong></p>
        {icsUrl && <p style={{ marginTop: 20 }}><a className="bk-submit" href={icsUrl} style={{ display: 'inline-block', textDecoration: 'none' }}>Zum Kalender hinzufügen (.ics)</a></p>}
        <p className="bk-hint">Wir haben Ihnen die Details zusätzlich per E-Mail geschickt. Bitte sagen Sie rechtzeitig ab, falls Sie verhindert sind.</p>
        <Link className="bk-home2" href="/">Zur Startseite</Link>
      </section>
    )
  }
  const msg: Record<Exclude<Outcome, 'ok'>, { h: string; p: string }> = {
    expired: { h: 'Link abgelaufen', p: 'Dieser Bestätigungslink ist nicht mehr gültig. Bitte buchen Sie den Termin erneut.' },
    invalid: { h: 'Link ungültig', p: 'Dieser Bestätigungslink ist uns nicht bekannt. Möglicherweise wurde der Termin bereits storniert.' },
    cancelled: { h: 'Termin storniert', p: 'Dieser Termin wurde inzwischen abgesagt.' },
  }
  const m = msg[outcome]
  return (
    <section className="bk-done">
      <h2>{m.h}</h2>
      <p>{m.p}</p>
      <Link className="bk-home2" href="/termin">Neuen Termin buchen</Link>
    </section>
  )
}

export default async function BestaetigenPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  const payload = await getPayloadClient()
  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting
  const brandName = [settings.brandName, settings.brandSuffix].filter(Boolean).join(' ')
  const address = [settings.addressStreet, settings.addressCity].filter(Boolean).join(', ')

  const wrap = (children: ReactNode) => (
    <main className="bk-wrap">
      <div className="bk-head"><h1>Terminbestätigung</h1></div>
      {children}
    </main>
  )

  if (!token) return wrap(<Result outcome="invalid" brandName={brandName} />)

  const found = await payload.find({ collection: 'termine', where: { verifyToken: { equals: token } }, limit: 1, depth: 1 })
  const termin = found.docs[0] as Termine | undefined

  // Bereits bestätigt? (idempotent – z. B. zweiter Klick auf den Link)
  if (!termin) {
    const already = await payload.find({ collection: 'termine', where: { manageToken: { equals: token } }, limit: 1, depth: 1 })
    const t2 = already.docs[0] as Termine | undefined
    if (t2 && t2.status === 'bestaetigt') {
      const arzt = typeof t2.arzt === 'object' ? (t2.arzt as Aerzte) : null
      return wrap(
        <Result
          outcome="ok"
          brandName={brandName}
          label={formatTerminLabel(new Date(t2.start))}
          arztName={arzt ? [arzt.titel, arzt.name].filter(Boolean).join(' ') : undefined}
          icsUrl={t2.manageToken ? `${siteUrl()}/termin/ics?token=${t2.manageToken}` : undefined}
        />,
      )
    }
    return wrap(<Result outcome="invalid" brandName={brandName} />)
  }

  if (termin.status === 'abgesagt') return wrap(<Result outcome="cancelled" brandName={brandName} />)
  if (termin.verifyExpiresAt && new Date(termin.verifyExpiresAt).getTime() < Date.now()) {
    return wrap(<Result outcome="expired" brandName={brandName} />)
  }

  const arzt = typeof termin.arzt === 'object' ? (termin.arzt as Aerzte) : null
  const arztName = arzt ? [arzt.titel, arzt.name].filter(Boolean).join(' ') : ''
  const start = new Date(termin.start)
  const icsUrl = termin.manageToken ? `${siteUrl()}/termin/ics?token=${termin.manageToken}` : undefined

  // Scharf schalten: bestätigen, Verify-Token entwerten, Löschdatum setzen.
  await payload.update({
    collection: 'termine',
    id: termin.id,
    data: {
      status: 'bestaetigt',
      verifyToken: null,
      verifyExpiresAt: null,
      loeschdatum: new Date(start.getTime() + 14 * 86400000).toISOString(),
    },
  })

  try {
    await sendConfirmationEmail(payload, {
      to: termin.patientEmail,
      brandName,
      terminLabel: formatTerminLabel(start),
      arztName,
      icsUrl: icsUrl ?? '',
      manageUrl: termin.manageToken ? `${siteUrl()}/termin/verwalten?token=${termin.manageToken}` : undefined,
      address: address || undefined,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Bestätigungsmail fehlgeschlagen')
  }

  return wrap(<Result outcome="ok" brandName={brandName} label={formatTerminLabel(start)} arztName={arztName} icsUrl={icsUrl} />)
}
