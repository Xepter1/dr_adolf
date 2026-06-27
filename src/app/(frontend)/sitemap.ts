import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import type { Projekte } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'projekte', limit: 100, depth: 0 })
  const projekte = res.docs as Projekte[]
  const now = new Date()

  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/impressum`, lastModified: now, priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: now, priority: 0.2 },
    ...projekte.map((p) => ({
      url: `${base}/projekt/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.7,
    })),
  ]
}
