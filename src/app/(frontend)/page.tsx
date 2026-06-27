import { getPayloadClient } from '@/lib/payload'
import { currentYear } from '@/lib/format'
import { HeaderHome, FooterHome } from '@/components/SiteChrome'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { WhyWood } from '@/components/sections/WhyWood'
import { Process } from '@/components/sections/Process'
import { About } from '@/components/sections/About'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { Career } from '@/components/sections/Career'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import type { Projekte, Leistungen, Testimonial, Job, Faq as FaqType, Setting } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [settings, projekteRes, leistungenRes, testimonialsRes, jobsRes, faqsRes, formRes] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({ collection: 'projekte', sort: 'sortOrder', limit: 100, depth: 1 }),
    payload.find({ collection: 'leistungen', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'testimonials', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'jobs', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'faqs', sort: 'sortOrder', limit: 100 }),
    payload.find({ collection: 'forms', where: { title: { equals: 'Kontakt' } }, limit: 1, depth: 0 }),
  ])

  const s = settings as Setting
  const projekte = projekteRes.docs as Projekte[]
  const leistungen = leistungenRes.docs as Leistungen[]
  const testimonials = testimonialsRes.docs as Testimonial[]
  const jobs = jobsRes.docs as Job[]
  const faqs = faqsRes.docs as FaqType[]
  const formId = (formRes.docs[0]?.id as number | undefined) ?? null
  const marquee = (s.marquee ?? []).map((m) => m.word)

  return (
    <>
      <a className="skip" href="#main">
        Zum Inhalt springen
      </a>

      <HeaderHome settings={s} />

      <main id="main">
        <Hero settings={s} />
        <Marquee words={marquee} />
        <Projects projekte={projekte} />
        <Services leistungen={leistungen} />
        <BeforeAfter />
        <WhyWood />
        <Process />
        <About settings={s} />
        <Stats settings={s} />
        <Testimonials testimonials={testimonials} />
        <Career settings={s} jobs={jobs} />
        <Faq faqs={faqs} />
        <Contact settings={s} formId={formId} />
      </main>

      <FooterHome settings={s} year={currentYear()} />
      <ThemeSwitch />
    </>
  )
}
