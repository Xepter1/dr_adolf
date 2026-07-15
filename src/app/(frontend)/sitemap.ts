import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import type { Leistungen } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'leistungen', limit: 100, depth: 0 })
  const leistungen = res.docs as Leistungen[]
  const now = new Date()

  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/termin`, lastModified: now, priority: 0.9 },
    ...leistungen.map((l) => ({
      url: `${base}/leistungen/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      priority: 0.7,
    })),
    // Impressum & Datenschutz bewusst NICHT in der Sitemap: beide Seiten sind auf
    // `noindex` gesetzt (enthalten personenbezogene Daten) — sie sollen nicht bei
    // Google erscheinen. Eine noindex-Seite in der Sitemap zu listen wäre ein
    // widersprüchliches Signal und löst eine Search-Console-Warnung aus.
  ]
}
