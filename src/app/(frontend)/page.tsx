import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderHome, FooterHome } from '@/components/SiteChrome'
import { Hero } from '@/components/sections/Hero'
import { Team } from '@/components/sections/Team'
import { Testimonials } from '@/components/sections/Testimonials'
import { Career } from '@/components/sections/Career'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import type { Aerzte, Leistungen, Testimonial, Job, Faq as FaqType, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [settings, aerzteRes, leistungenRes, testimonialsRes, jobsRes, faqsRes] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'aerzte', where: { aktiv: { equals: true } }, sort: 'sortOrder', limit: 100, depth: 1 }),
    payload.find({ collection: 'leistungen', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'testimonials', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'jobs', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'faqs', sort: 'sortOrder', limit: 100 }),
  ])

  const s = settings as Setting
  const aerzte = aerzteRes.docs as Aerzte[]
  const leistungen = leistungenRes.docs as Leistungen[]
  const testimonials = testimonialsRes.docs as Testimonial[]
  const jobs = jobsRes.docs as Job[]
  const faqs = faqsRes.docs as FaqType[]

  return (
    <>
      <a className="skip" href="#main">
        Zum Inhalt springen
      </a>

      <HeaderHome settings={s} leistungen={leistungen} />

      <main id="main">
        <Hero settings={s} leistungen={leistungen} />
        <Team aerzte={aerzte} />
        <Testimonials testimonials={testimonials} />
        <Career settings={s} jobs={jobs} />
        <Faq faqs={faqs} />
        <Contact settings={s} />
      </main>

      <FooterHome settings={s} year={currentYear()} leistungen={leistungen} />
    </>
  )
}
