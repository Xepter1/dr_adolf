import { getPayloadClient } from '@/lib/payload'
import { buildICS } from '@/lib/ics'
import type { Setting, Termine } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return new Response('Nicht gefunden', { status: 404 })

  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'termine', where: { manageToken: { equals: token } }, limit: 1, depth: 0 })
  const termin = found.docs[0] as Termine | undefined
  if (!termin || termin.status === 'abgesagt') return new Response('Nicht gefunden', { status: 404 })

  const settings = (await payload.findGlobal({ slug: 'settings' })) as Setting
  const brandName = [settings.brandName, settings.brandSuffix].filter(Boolean).join(' ')
  const address = [settings.addressStreet, settings.addressCity].filter(Boolean).join(', ')

  const start = new Date(termin.start)
  const end = termin.ende ? new Date(termin.ende) : new Date(start.getTime() + 20 * 60000)

  // Bewusst neutral: kein Fachgebiet, keine Terminart im Kalendereintrag.
  const ics = buildICS({
    uid: `termin-${termin.id}-${termin.manageToken}@praxis`,
    start,
    end,
    summary: brandName ? `Termin – ${brandName}` : 'Termin',
    description: 'Bitte bringen Sie Ihre Versichertenkarte mit. Bei Verhinderung bitte rechtzeitig absagen.',
    location: address || undefined,
    organizerName: brandName || undefined,
    organizerEmail: settings.email || undefined,
  })

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="termin.ics"',
      'Cache-Control': 'no-store',
    },
  })
}
