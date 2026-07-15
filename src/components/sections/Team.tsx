import Link from 'next/link'
import type { Aerzte, Setting } from '@/payload-types'

/** „A, B und C" – natürliche Aufzählung mit „und" vor dem letzten Namen. */
const joinNames = (names: string[]): string =>
  names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]}`

export function Team({ aerzte, settings: s }: { aerzte: Aerzte[]; settings: Setting }) {
  const members = (s.teamMembers ?? []).map((m) => m.name).filter(Boolean)
  const dentist = aerzte[0]?.name ?? 'Johannes Adolf'
  const caption = joinNames([dentist, ...members])

  return (
    <section className="sec team" id="team">
      <div className="wrap">
        <div className="sec-head reveal" data-index="01">
          <span className="eyebrow">Praxis &amp; Team</span>
          <h2>
            {s.teamHeadingPrefix ?? 'Ihr Zahnarzt in '}
            <em>{s.teamHeadingAccent ?? 'Adlkofen.'}</em>
          </h2>
          {s.teamIntro && <p>{s.teamIntro}</p>}
        </div>

        <div className="team-layout">
          <figure className="team-photo reveal">
            <img src="/team/team.jpg" alt="Das Team der Zahnarztpraxis Johannes Adolf in Adlkofen" />
            <figcaption>v. l. {caption}</figcaption>
          </figure>

          <div className="team-side">
            {aerzte.map((a) => (
              <article key={a.id} className="team-bio reveal">
                <h3>{[a.titel, a.name].filter(Boolean).join(' ')}</h3>
                <span className="doc-fach">{a.fachrichtung}</span>
                {a.vita && <p>{a.vita}</p>}
                <Link href="/termin" className="doc-cta">
                  Termin buchen <span className="arr">→</span>
                </Link>
              </article>
            ))}

            {members.length > 0 && (
              <article className="team-staff reveal">
                <h3>{s.teamMembersTitle ?? 'Unser Praxisteam'}</h3>
                {s.teamMembersRole && <span className="doc-fach">{s.teamMembersRole}</span>}
                {s.teamMembersText && <p>{s.teamMembersText}</p>}
                <p className="team-names">{members.join(' · ')}</p>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
