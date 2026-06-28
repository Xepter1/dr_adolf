import { getPayloadClient } from '@/lib/payload'
import { sendReminderEmail } from '@/lib/email'
import { formatTerminLabel } from '@/lib/time'
import { siteUrl } from '@/lib/tokens'
import type { Aerzte, Termine } from '@/payload-types'

export const dynamic = 'force-dynamic'

/**
 * Wartungs-Endpunkt, regelmäßig von außen aufzurufen (z. B. stündlich per
 * System-Cron / Container-Cron):  GET /cron?secret=CRON_SECRET
 *
 * Erledigt drei DSGVO-relevante Aufgaben:
 *  1) abgelaufene, unbestätigte Anfragen löschen (Slot freigeben, keine PII halten)
 *  2) Erinnerungen senden (nur mit Einwilligung)
 *  3) Aufbewahrung: Termine mit erreichtem Löschdatum samt Anamnese löschen
 */
async function run(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  const provided =
    new URL(req.url).searchParams.get('secret') || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!secret || provided !== secret) return new Response('Unauthorized', { status: 401 })

  const payload = await getPayloadClient()
  const now = new Date()
  const nowIso = now.toISOString()
  const result = { abgelaufenGeloescht: 0, erinnerungenGesendet: 0, aufbewahrungGeloescht: 0 }

  const deleteAnamnese = async (rel: Termine['anamnese']) => {
    const id = typeof rel === 'object' && rel ? rel.id : typeof rel === 'number' ? rel : null
    if (id != null) await payload.delete({ collection: 'anamnese', id }).catch(() => {})
  }

  // 1) Abgelaufene unbestätigte Anfragen löschen
  const expired = await payload.find({
    collection: 'termine',
    where: { and: [{ status: { equals: 'ausstehend' } }, { verifyExpiresAt: { less_than: nowIso } }] },
    limit: 1000,
    depth: 0,
  })
  for (const t of expired.docs as Termine[]) {
    await deleteAnamnese(t.anamnese)
    await payload.delete({ collection: 'termine', id: t.id }).catch(() => {})
    result.abgelaufenGeloescht++
  }

  // 2) Erinnerungen (bestätigt, gewünscht, noch nicht gesendet, Start in < 24 h)
  const in24 = new Date(now.getTime() + 24 * 3600 * 1000).toISOString()
  const due = await payload.find({
    collection: 'termine',
    where: {
      and: [
        { status: { equals: 'bestaetigt' } },
        { erinnerungErwuenscht: { equals: true } },
        { erinnerungGesendet: { not_equals: true } },
        { start: { greater_than: nowIso } },
        { start: { less_than: in24 } },
      ],
    },
    limit: 500,
    depth: 1,
  })
  const { brandName } = await brand(payload)
  for (const t of due.docs as Termine[]) {
    const arzt = typeof t.arzt === 'object' ? (t.arzt as Aerzte) : null
    try {
      await sendReminderEmail(payload, {
        to: t.patientEmail,
        brandName,
        terminLabel: formatTerminLabel(new Date(t.start)),
        arztName: arzt ? [arzt.titel, arzt.name].filter(Boolean).join(' ') : '',
        manageUrl: t.manageToken ? `${siteUrl()}/termin/verwalten?token=${t.manageToken}` : undefined,
      })
      await payload.update({ collection: 'termine', id: t.id, data: { erinnerungGesendet: true } })
      result.erinnerungenGesendet++
    } catch (err) {
      payload.logger.error({ err }, 'Erinnerung fehlgeschlagen')
    }
  }

  // 3) Aufbewahrung: Termine mit erreichtem Löschdatum entfernen (+ Anamnese)
  const retire = await payload.find({
    collection: 'termine',
    where: { loeschdatum: { less_than: nowIso } },
    limit: 1000,
    depth: 0,
  })
  for (const t of retire.docs as Termine[]) {
    await deleteAnamnese(t.anamnese)
    await payload.delete({ collection: 'termine', id: t.id }).catch(() => {})
    result.aufbewahrungGeloescht++
  }

  return Response.json({ ok: true, ...result, ranAt: nowIso })
}

async function brand(payload: Awaited<ReturnType<typeof getPayloadClient>>): Promise<{ brandName: string }> {
  const s = await payload.findGlobal({ slug: 'settings' })
  return { brandName: [s.brandName, s.brandSuffix].filter(Boolean).join(' ') }
}

export const GET = run
export const POST = run
