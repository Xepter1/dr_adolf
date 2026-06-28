import type { Payload } from 'payload'
import { rt } from './richtext'

/**
 * Einmaliges, idempotentes Befüllen der Demo-Inhalte (Muster-Arztpraxis
 * „Praxis am Stadtpark"). Jeder Schritt prüft selbst, ob er schon erledigt ist –
 * so kann der Seed jederzeit gefahrlos erneut laufen. Dies ist die kanonische
 * Inhaltsquelle für den Umbau (siehe CLAUDE.md).
 */
export const seed = async (payload: Payload): Promise<void> => {
  await seedAdmin(payload)
  await seedLeistungen(payload)
  await seedAerzte(payload)
  await seedTestimonials(payload)
  await seedJobs(payload)
  await seedFaqs(payload)
  await seedSettings(payload)
}

// ---------------------------------------------------------------------------

async function seedAdmin(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return
  const email = process.env.ADMIN_EMAIL || 'admin@praxis-am-stadtpark.de'
  const password = process.env.ADMIN_PASSWORD || 'praxis-admin'
  await payload.create({ collection: 'users', data: { email, password, name: 'Administrator' } })
  payload.logger.info(`✓ Admin-Benutzer angelegt: ${email} (Passwort bitte ändern!)`)
}

async function seedLeistungen(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'leistungen' })
  if (totalDocs > 0) return
  const leistungen: Array<{
    title: string
    icon: 'stethoscope' | 'heart' | 'shield' | 'child' | 'lab' | 'housecall'
    description: string
    lead: string
    intro: string
    leistungspunkte: Array<{ text: string }>
    ablauf: Array<{ titel: string; text: string }>
    faq: Array<{ frage: string; antwort: string }>
  }> = [
    {
      title: 'Hausärztliche Versorgung',
      icon: 'stethoscope',
      description: 'Ihre erste Anlaufstelle bei Beschwerden — Diagnostik, Behandlung und die Begleitung chronischer Erkrankungen, alles aus einer Hand.',
      lead: 'Ihre erste Anlaufstelle für alle gesundheitlichen Fragen — von akuten Beschwerden bis zur langfristigen Begleitung.',
      intro:
        'Als Hausarztpraxis sind wir Ihr fester Ansprechpartner: Wir kennen Ihre Krankengeschichte, koordinieren Fachärzte und behalten den Überblick über Ihre Medikamente. Ob grippaler Infekt, Rückenschmerzen oder eine chronische Erkrankung — bei uns bekommen Sie Diagnostik, Behandlung und Beratung aus einer Hand, mit Zeit für das persönliche Gespräch.',
      leistungspunkte: [
        { text: 'Akutsprechstunde bei Infekten, Schmerzen und Verletzungen' },
        { text: 'Betreuung chronischer Erkrankungen (Bluthochdruck, Diabetes, Asthma)' },
        { text: 'Disease-Management-Programme (DMP) und Vorsorgeplanung' },
        { text: 'Wundversorgung, Verbände und kleine Eingriffe' },
        { text: 'Überweisungs- und Medikamentenmanagement, Rezepte' },
      ],
      ablauf: [
        { titel: 'Termin buchen', text: 'Wählen Sie online einen freien Termin oder rufen Sie uns an. Als Neupatient können Sie den Anamnesebogen vorab verschlüsselt ausfüllen.' },
        { titel: 'Untersuchung & Gespräch', text: 'Wir hören zu, untersuchen und besprechen die nächsten Schritte verständlich mit Ihnen.' },
        { titel: 'Behandlung & Begleitung', text: 'Sie erhalten einen klaren Plan — und bei Bedarf Folgetermine, Überweisungen oder Rezepte.' },
      ],
      faq: [
        { frage: 'Brauche ich eine Überweisung?', antwort: 'Nein. Als Hausarztpraxis sind wir Ihre direkte Anlaufstelle — Sie können sich jederzeit ohne Überweisung bei uns vorstellen.' },
        { frage: 'Bekomme ich Folgerezepte auch ohne Termin?', antwort: 'Für Dauermedikamente genügt oft ein kurzer Anruf an der Anmeldung. Bei Änderungen vereinbaren wir einen kurzen Termin.' },
      ],
    },
    {
      title: 'Vorsorge & Check-ups',
      icon: 'heart',
      description: 'Gesundheits-Check-up, Hautkrebs-Screening und Herz-Kreislauf-Vorsorge — damit kleine Auffälligkeiten früh erkannt werden.',
      lead: 'Früh erkennen, statt spät behandeln — strukturierte Vorsorge, die zu Ihrem Alter und Risiko passt.',
      intro:
        'Viele Erkrankungen lassen sich vermeiden oder gut behandeln, wenn man sie früh erkennt. In der Vorsorge nehmen wir uns Zeit, Ihre Werte einzuordnen und gemeinsam mit Ihnen die richtigen Schritte zu planen — vom gesetzlichen Gesundheits-Check-up bis zur individuellen Herz-Kreislauf-Vorsorge.',
      leistungspunkte: [
        { text: 'Gesundheits-Check-up (ab 18 bzw. ab 35 Jahren, gesetzlich)' },
        { text: 'Hautkrebs-Screening' },
        { text: 'Herz-Kreislauf-Vorsorge inkl. Blutdruck- und Blutfettwerte' },
        { text: 'Krebsfrüherkennung und Beratung zu weiteren Untersuchungen' },
        { text: 'Impfstatus-Check und Vorsorgeplanung' },
      ],
      ablauf: [
        { titel: 'Anamnese', text: 'Wir besprechen Ihre Vorgeschichte, Lebensgewohnheiten und mögliche Risiken.' },
        { titel: 'Untersuchung & Labor', text: 'Körperliche Untersuchung, Blutdruck, EKG und bei Bedarf eine Blutprobe direkt in der Praxis.' },
        { titel: 'Auswertung', text: 'Sie erhalten Ihre Ergebnisse verständlich erklärt — mit konkreten Empfehlungen.' },
      ],
      faq: [
        { frage: 'Wie oft steht mir ein Check-up zu?', antwort: 'Gesetzlich Versicherte haben ab 35 Jahren alle drei Jahre Anspruch auf den Gesundheits-Check-up; zwischen 18 und 34 einmalig. Wir beraten Sie zum richtigen Intervall.' },
      ],
    },
    {
      title: 'Impfungen & Reisemedizin',
      icon: 'shield',
      description: 'Schutzimpfungen nach STIKO, Auffrischungen und eine individuelle Reiseberatung inklusive der nötigen Impfungen.',
      lead: 'Gut geschützt — im Alltag wie auf Reisen. Wir prüfen Ihren Impfstatus und beraten individuell.',
      intro:
        'Impfungen gehören zum wirksamsten Schutz, den die Medizin kennt. Wir impfen nach den Empfehlungen der STIKO, frischen abgelaufene Impfungen auf und beraten Sie vor Fernreisen, welche Impfungen und Prophylaxen sinnvoll sind — abgestimmt auf Reiseziel, Dauer und Ihre Gesundheit.',
      leistungspunkte: [
        { text: 'Standard- und Auffrischimpfungen nach STIKO' },
        { text: 'Grippe- und weitere saisonale Impfungen' },
        { text: 'Reiseberatung inkl. empfohlener Reiseimpfungen' },
        { text: 'Malaria-Prophylaxe und Reiseapotheke' },
        { text: 'Impfausweis prüfen und vervollständigen' },
      ],
      ablauf: [
        { titel: 'Impfpass-Check', text: 'Bringen Sie Ihren Impfausweis mit — wir prüfen, was fehlt oder aufgefrischt werden sollte.' },
        { titel: 'Beratung', text: 'Bei Reisen besprechen wir Ziel, Route und Zeitplan und empfehlen die passenden Impfungen.' },
        { titel: 'Impfung', text: 'Viele Impfungen sind sofort möglich; Reiseimpfungen planen wir rechtzeitig vor Abreise.' },
      ],
      faq: [
        { frage: 'Wie früh vor einer Reise sollte ich kommen?', antwort: 'Am besten vier bis sechs Wochen vorher, da manche Impfungen mehrere Dosen oder einen Vorlauf brauchen. Auch kurzfristig beraten wir Sie gern.' },
      ],
    },
    {
      title: 'Kinder- & Jugendmedizin',
      icon: 'child',
      description: 'U-Untersuchungen, Impfberatung und akute Erkrankungen — einfühlsame Betreuung vom Säugling bis zum Teenager.',
      lead: 'Einfühlsame Begleitung vom Säugling bis zum Teenager — medizinisch fundiert und kindgerecht.',
      intro:
        'Kinder brauchen eine Medizin, die auf ihr Alter eingeht. Wir begleiten die Entwicklung Ihres Kindes durch die Vorsorgeuntersuchungen, beraten zu Impfungen und sind bei akuten Erkrankungen schnell für Sie da — ruhig, geduldig und auf Augenhöhe mit den kleinen Patienten.',
      leistungspunkte: [
        { text: 'U-Untersuchungen (Früherkennung der Entwicklung)' },
        { text: 'Impfungen und Impfberatung nach STIKO' },
        { text: 'Akute Erkrankungen im Kindesalter' },
        { text: 'Beratung zu Ernährung, Schlaf und Entwicklung' },
        { text: 'Jugend- und Sporttauglichkeitsuntersuchungen' },
      ],
      ablauf: [],
      faq: [
        { frage: 'Werden die U-Untersuchungen von der Kasse übernommen?', antwort: 'Ja, die regulären Vorsorgeuntersuchungen für Kinder sind Leistungen der gesetzlichen Krankenkassen. Bringen Sie das gelbe Untersuchungsheft mit.' },
      ],
    },
    {
      title: 'Labor & Diagnostik',
      icon: 'lab',
      description: 'Blutbild, EKG, Langzeitmessungen und Ultraschall direkt in der Praxis — schnelle Klarheit ohne lange Wege.',
      lead: 'Klarheit ohne lange Wege — moderne Diagnostik direkt bei uns in der Praxis.',
      intro:
        'Gute Behandlung beginnt mit einer guten Diagnose. Viele Untersuchungen führen wir direkt vor Ort durch, sodass Sie schnell Gewissheit haben. Von der Blutabnahme über das EKG bis zum Ultraschall — kurze Wege, schnelle Ergebnisse und eine verständliche Einordnung.',
      leistungspunkte: [
        { text: 'Blutabnahme und Labordiagnostik' },
        { text: 'Ruhe- und Belastungs-EKG' },
        { text: 'Langzeit-Blutdruck- und Langzeit-EKG-Messung' },
        { text: 'Ultraschall (Sonografie) von Bauch und Schilddrüse' },
        { text: 'Lungenfunktionstest (Spirometrie)' },
      ],
      ablauf: [
        { titel: 'Untersuchung', text: 'Die Messung oder Probenentnahme erfolgt direkt in der Praxis — meist in wenigen Minuten.' },
        { titel: 'Auswertung', text: 'Laborwerte und Befunde werten wir aus und besprechen sie verständlich mit Ihnen.' },
      ],
      faq: [
        { frage: 'Muss ich für die Blutabnahme nüchtern sein?', antwort: 'Für einige Werte ist Nüchternheit nötig. Wir sagen Ihnen bei der Terminvergabe, ob und wie lange Sie vorher nichts essen sollten.' },
      ],
    },
    {
      title: 'Hausbesuche',
      icon: 'housecall',
      description: 'Wenn der Weg zu uns nicht möglich ist, kommen wir zu Ihnen — für unsere Patienten im Einzugsgebiet.',
      lead: 'Wenn der Weg in die Praxis nicht möglich ist, kommen wir zu Ihnen nach Hause.',
      intro:
        'Nicht immer ist der Weg in die Praxis machbar — etwa bei schwerer Erkrankung, eingeschränkter Mobilität oder in der letzten Lebensphase. Für unsere Patienten im Einzugsgebiet bieten wir Hausbesuche an, damit eine gute Versorgung auch zu Hause sichergestellt ist.',
      leistungspunkte: [
        { text: 'Hausbesuche bei akuter Erkrankung und eingeschränkter Mobilität' },
        { text: 'Betreuung pflegebedürftiger Patienten zu Hause' },
        { text: 'Versorgung in Zusammenarbeit mit Pflegediensten und Angehörigen' },
        { text: 'Palliative Begleitung in der letzten Lebensphase' },
      ],
      ablauf: [],
      faq: [
        { frage: 'Wie vereinbare ich einen Hausbesuch?', antwort: 'Bitte rufen Sie uns möglichst am Vormittag an. Wir klären den Bedarf und stimmen einen passenden Zeitpunkt im Einzugsgebiet der Praxis ab.' },
      ],
    },
  ]
  for (let i = 0; i < leistungen.length; i++) {
    await payload.create({ collection: 'leistungen', data: { ...leistungen[i], sortOrder: i } })
  }
  payload.logger.info('✓ 6 Leistungen angelegt')
}

async function seedAerzte(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'aerzte' })
  if (totalDocs > 0) return
  // Sprechzeiten: 1 = Mo … 5 = Fr.
  const vormittag = (tage: string[]) => tage.map((t) => ({ wochentag: t, von: '08:00', bis: '12:00' }))
  const nachmittag = (tage: string[]) => tage.map((t) => ({ wochentag: t, von: '14:00', bis: '17:00' }))
  const aerzte = [
    {
      titel: 'Dr. med.',
      name: 'Anna Berger',
      fachrichtung: 'Fachärztin für Allgemeinmedizin',
      vita: 'Hausärztliche Versorgung, Vorsorge und Reisemedizin. Seit 2012 in der Praxis.',
      slotDauerMin: 20,
      sprechzeiten: [...vormittag(['1', '2', '3', '4', '5']), ...nachmittag(['1', '2', '4'])],
    },
    {
      titel: 'Dr. med.',
      name: 'Jonas Frey',
      fachrichtung: 'Facharzt für Innere Medizin',
      vita: 'Schwerpunkte Herz-Kreislauf und Diabetologie. Internistische Diagnostik und Langzeitbetreuung.',
      slotDauerMin: 30,
      sprechzeiten: [...vormittag(['1', '2', '3', '4']), ...nachmittag(['2', '3'])],
    },
    {
      name: 'Sofia Klein',
      fachrichtung: 'Fachärztin für Kinder- und Jugendmedizin',
      vita: 'Kindervorsorge (U-Untersuchungen), Impfberatung und akute Erkrankungen im Kindesalter.',
      slotDauerMin: 20,
      sprechzeiten: [...vormittag(['1', '3', '5']), ...nachmittag(['1', '4', '5'])],
    },
  ]
  for (let i = 0; i < aerzte.length; i++) {
    await payload.create({ collection: 'aerzte', data: { ...aerzte[i], aktiv: true, sortOrder: i } as never })
  }
  payload.logger.info('✓ 3 Ärzte angelegt')
}

async function seedTestimonials(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'testimonials' })
  if (totalDocs > 0) return
  const stimmen = [
    { initials: 'FH', author: 'Familie Hofmann', project: 'Patienten seit 2019', rating: 5, quote: 'Termine online buchen, kurze Wartezeit, und man fühlt sich ernst genommen. Genau so wünscht man sich eine Hausarztpraxis.' },
    { initials: 'KS', author: 'Karin S.', project: 'Vorsorge', rating: 5, quote: 'Den Anamnesebogen konnte ich vorab in Ruhe von zuhause ausfüllen — beim Termin blieb dann richtig Zeit fürs Gespräch.' },
    { initials: 'TB', author: 'Thomas B.', project: 'Gesundheits-Check', rating: 5, quote: 'Freundliches Team, modernes Labor direkt vor Ort. Meine Ergebnisse hatte ich schneller als je zuvor.' },
  ]
  for (let i = 0; i < stimmen.length; i++) {
    await payload.create({ collection: 'testimonials', data: { ...stimmen[i], sortOrder: i } })
  }
  payload.logger.info('✓ 3 Stimmen angelegt')
}

async function seedJobs(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'jobs' })
  if (totalDocs > 0) return
  const jobs = [
    { title: 'Medizinische:r Fachangestellte:r (m/w/d)', type: 'Vollzeit · ab sofort' },
    { title: 'MFA für die Anmeldung (m/w/d)', type: 'Teilzeit · flexible Zeiten' },
    { title: 'Auszubildende:r zur/zum MFA (m/w/d)', type: 'Ausbildung ab September' },
  ]
  for (let i = 0; i < jobs.length; i++) {
    await payload.create({ collection: 'jobs', data: { ...jobs[i], sortOrder: i } })
  }
  payload.logger.info('✓ 3 Stellen angelegt')
}

async function seedFaqs(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'faqs' })
  if (totalDocs > 0) return
  const faqs = [
    { question: 'Wie bekomme ich einen Termin?', answer: ['Am einfachsten online über „Termin buchen": Sie wählen Ihren Arzt und eine Wunschzeit und bestätigen per E-Mail. Telefonisch und persönlich an der Anmeldung geht es natürlich weiterhin.'] },
    { question: 'Nehmen Sie neue Patienten auf?', answer: ['Ja, wir freuen uns über neue Patienten. Als Neupatient können Sie den Anamnesebogen bequem vorab online ausfüllen — Ende-zu-Ende verschlüsselt und nur für unsere Praxis lesbar.'] },
    { question: 'Welche Versicherungen akzeptieren Sie?', answer: ['Wir behandeln gesetzlich und privat Versicherte sowie Selbstzahler. Bitte bringen Sie zum ersten Termin Ihre Versichertenkarte mit.'] },
    { question: 'Was muss ich zum ersten Termin mitbringen?', answer: ['Ihre Versichertenkarte, eine Liste Ihrer aktuellen Medikamente sowie relevante Vorbefunde. Den Anamnesebogen können Sie vorab bequem online ausfüllen.'] },
    { question: 'Bieten Sie Hausbesuche an?', answer: ['Für Patienten, die nicht in die Praxis kommen können, bieten wir im Einzugsgebiet Hausbesuche an. Bitte sprechen Sie uns dazu telefonisch an.'] },
    { question: 'Wie erhalte ich ein Folgerezept oder eine Überweisung?', answer: ['Folge- und Dauerrezepte können Sie telefonisch oder über die Anmeldung anfordern. Überweisungen stellen wir im Rahmen der Behandlung aus.'] },
  ]
  for (let i = 0; i < faqs.length; i++) {
    await payload.create({
      collection: 'faqs',
      data: { question: faqs[i].question, answer: rt(faqs[i].answer), sortOrder: i },
    })
  }
  payload.logger.info('✓ 6 FAQ angelegt')
}

async function seedSettings(payload: Payload): Promise<void> {
  const current = await payload.findGlobal({ slug: 'settings' })
  // Nur befüllen, wenn die Listen-Felder noch leer sind (sonst Editor-Eingaben nicht überschreiben).
  if (Array.isArray(current?.heroStats) && current.heroStats.length > 0) return
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      brandName: 'Praxis am',
      brandSuffix: 'Stadtpark',
      legalName: 'Gemeinschaftspraxis am Stadtpark',
      region: 'Musterstadt',
      tagline: 'Ihre Hausarztpraxis im Herzen von Musterstadt — moderne Medizin, ein herzliches Team und Termine, die Sie bequem online buchen.',
      phoneDisplay: '0123 456 78 90',
      phoneHref: '+491234567890',
      email: 'praxis@praxis-am-stadtpark.de',
      addressStreet: 'Stadtparkallee 12',
      addressCity: '12345 Musterstadt',
      oeffnungszeiten: [
        { tag: 'Montag', zeit: '08:00 – 12:00 · 14:00 – 17:00' },
        { tag: 'Dienstag', zeit: '08:00 – 12:00 · 14:00 – 17:00' },
        { tag: 'Mittwoch', zeit: '08:00 – 12:00' },
        { tag: 'Donnerstag', zeit: '08:00 – 12:00 · 14:00 – 17:00' },
        { tag: 'Freitag', zeit: '08:00 – 12:00' },
        { tag: 'Samstag & Sonntag', zeit: 'geschlossen' },
      ],
      heroBadge: 'Hausärztliche Gemeinschaftspraxis · Musterstadt',
      heroHeadingLine1: 'Willkommen',
      heroHeadingPrefix: 'in der ',
      heroHeadingAccent: 'Praxis',
      heroLead: '',
      heroStats: [
        { value: '3', label: 'Ärzte im Team' },
        { value: '< 24 h', label: 'online buchbar' },
        { value: '4,9 ★', label: 'Patientenbewertung' },
      ],
      marquee: [
        { word: 'Hausärztliche Versorgung' },
        { word: 'Vorsorge' },
        { word: 'Impfungen' },
        { word: 'Kindermedizin' },
        { word: 'Labor & Diagnostik' },
        { word: 'Reisemedizin' },
        { word: 'Hausbesuche' },
      ],
      stats: [
        { count: 3, suffix: '', label: 'Ärzte' },
        { count: 12, suffix: '', label: 'im gesamten Team' },
        { count: 9500, suffix: '+', label: 'Patienten betreut' },
        { count: 24, suffix: ' h', label: 'online buchbar' },
      ],
      careerHeadingPrefix: 'Werde Teil ',
      careerHeadingAccent: 'unseres Teams.',
      careerText:
        'Wir suchen Menschen, die mit Herz und Sorgfalt arbeiten. Bei uns erwarten dich ein freundliches Team, moderne Ausstattung, geregelte Arbeitszeiten und faire Bezahlung.',
      buchungIntro:
        'Buchen Sie Ihren Termin online — wählen Sie Ihren Arzt und eine Wunschzeit und bestätigen Sie per E-Mail. Bitte geben Sie keine sensiblen Gesundheitsdetails an; die Terminart genügt.',
    },
  })
  payload.logger.info('✓ Einstellungen befüllt')
}
