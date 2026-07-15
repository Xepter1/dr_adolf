import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderHome, FooterHome } from '@/components/SiteChrome'
import { Hero } from '@/components/sections/Hero'
import { Welcome } from '@/components/sections/Welcome'
import { Team } from '@/components/sections/Team'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import type { Aerzte, Leistungen, Faq as FaqType, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [settings, aerzteRes, leistungenRes, faqsRes] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'aerzte', where: { aktiv: { equals: true } }, sort: 'sortOrder', limit: 100, depth: 1 }),
    payload.find({ collection: 'leistungen', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'faqs', sort: 'sortOrder', limit: 100 }),
  ])

  const s = settings as Setting
  const aerzte = aerzteRes.docs as Aerzte[]
  const leistungen = leistungenRes.docs as Leistungen[]
  const faqs = faqsRes.docs as FaqType[]

  return (
    <>
      <a className="skip" href="#main">
        Zum Inhalt springen
      </a>

      <HeaderHome settings={s} leistungen={leistungen} />

      <main id="main">
        <Hero settings={s} leistungen={leistungen} />
        <Welcome settings={s} />
        <Team aerzte={aerzte} settings={s} />
        <Faq faqs={faqs} />
        <Contact settings={s} />
      </main>

      <FooterHome settings={s} year={currentYear()} leistungen={leistungen} />
    </>
  )
}
