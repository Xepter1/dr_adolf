import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'
import { rt } from './richtext'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imgPath = (file: string) => path.resolve(dirname, '../../public/projekte', file)

/**
 * Einmaliges, idempotentes Befüllen der Demo-Inhalte ("Muster"-Daten von
 * AIGNER Holzbau). Jeder Schritt prüft selbst, ob er schon erledigt ist –
 * so kann der Seed jederzeit gefahrlos erneut laufen.
 */
export const seed = async (payload: Payload): Promise<void> => {
  await seedAdmin(payload)
  const media = await seedMedia(payload)
  await seedProjekte(payload, media)
  await seedLeistungen(payload)
  await seedTestimonials(payload)
  await seedJobs(payload)
  await seedFaqs(payload)
  await seedContactForm(payload)
  await seedSettings(payload)
}

// ---------------------------------------------------------------------------

async function seedAdmin(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return
  const email = process.env.ADMIN_EMAIL || 'admin@aigner-holzbau.de'
  const password = process.env.ADMIN_PASSWORD || 'aigner-admin'
  await payload.create({ collection: 'users', data: { email, password, name: 'Administrator' } })
  payload.logger.info(`✓ Admin-Benutzer angelegt: ${email} (Passwort bitte ändern!)`)
}

const IMAGES: Record<string, string> = {
  'wohnhaus-isarhang.jpg': 'Holzhaus-Neubau am Isarhang',
  'pfettendach-vierseithof.jpg': 'Pfettendach eines Vierseithofs',
  'geschossaufbau.jpg': 'Geschossaufbau in Holztafelbauweise',
  'carport-laerche.jpg': 'Doppelcarport aus Lärchenholz',
  'denkmal-dachsanierung.jpg': 'Sanierter denkmalgeschützter Dachstuhl',
  'sichtdachstuhl-loft.jpg': 'Ausgebauter Sichtdachstuhl als Loft',
}

async function seedMedia(payload: Payload): Promise<Record<string, number>> {
  const map: Record<string, number> = {}
  for (const [file, alt] of Object.entries(IMAGES)) {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: file } },
      limit: 1,
    })
    if (existing.docs.length) {
      map[file] = existing.docs[0].id as number
      continue
    }
    const created = await payload.create({
      collection: 'media',
      filePath: imgPath(file),
      data: { alt },
    })
    map[file] = created.id as number
  }
  return map
}

async function seedProjekte(payload: Payload, media: Record<string, number>): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'projekte' })
  if (totalDocs > 0) return

  const projekte = [
    {
      slug: 'wohnhaus-isarhang',
      title: 'Wohnhaus am Isarhang',
      tag: 'Holzhaus · Neubau',
      location: 'Landshut',
      year: '2024',
      hero: media['wohnhaus-isarhang.jpg'],
      featuredSize: 'big' as const,
      lead: 'Ein diffusionsoffenes Holzrahmenhaus am Hang — hoch gedämmt, lichtdurchflutet und in nur sieben Monaten schlüsselfertig.',
      facts: [
        { label: 'Bauweise', value: 'Holzrahmenbau' },
        { label: 'Wohnfläche', value: '184 m²' },
        { label: 'Bauzeit', value: '7 Monate' },
        { label: 'Holzart', value: 'Fichte / Lärche' },
      ],
      aufgabe:
        'Die Bauherren wünschten sich ein modernes Effizienzhaus an einem steilen Südhang mit Blick ins Isartal — wohngesund, energiesparend und mit viel sichtbarem Holz. Die Hanglage und ein enges Zeitfenster vor dem Winter machten die Vorfertigung zur Schlüsselfrage.',
      loesung:
        'Wände, Decken und Dach haben wir komplett in unserer Halle vorgefertigt — millimetergenau abgebunden und gedämmt. Innerhalb von drei Tagen stand der wetterfeste Rohbau auf der vorbereiteten Bodenplatte. Großflächige Lärchen-Fenster nach Süden, eine Holzfassade aus heimischer Lärche und eine diffusionsoffene Konstruktion sorgen für ein behagliches Raumklima.',
      ergebnis:
        'Ein KfW-fähiges Effizienzhaus, das im Sommer kühl und im Winter warm bleibt — und das dank Vorfertigung pünktlich vor dem ersten Schnee unter Dach war. Jeder verbaute Kubikmeter Holz bindet hier dauerhaft CO₂.',
      gallery: ['wohnhaus-isarhang.jpg', 'geschossaufbau.jpg', 'sichtdachstuhl-loft.jpg'],
    },
    {
      slug: 'pfettendach-vierseithof',
      title: 'Pfettendach Vierseithof',
      tag: 'Dachstuhl',
      location: 'Ergolding',
      year: '2024',
      hero: media['pfettendach-vierseithof.jpg'],
      featuredSize: 'tall' as const,
      lead: 'Ein weitgespanntes Pfettendach für einen denkmalnahen Vierseithof — traditionell gefügt, modern berechnet.',
      facts: [
        { label: 'Konstruktion', value: 'Pfettendach' },
        { label: 'Spannweite', value: '11,40 m' },
        { label: 'Material', value: 'KVH / BSH' },
        { label: 'Montage', value: '2 Tage' },
      ],
      aufgabe:
        'Der historische Vierseithof brauchte einen neuen, statisch tragfähigen Dachstuhl, der sich harmonisch in das bestehende Ensemble einfügt — bei großer Spannweite und ohne störende Stützen im Inneren.',
      loesung:
        'Wir haben ein klassisches Pfettendach mit liegendem Stuhl geplant, statisch in BSH ausgeführt und in unserer Halle CNC-abgebunden. Die sichtbaren Verbindungen sind traditionell gezimmert — Versätze und Zapfen statt Stahlwinkel, wo es das Auge sieht.',
      ergebnis:
        'Ein Dachtragwerk, das Generationen hält und dem Hof seine Würde zurückgibt. Die Montage war an zwei Tagen abgeschlossen, der Innenraum bleibt stützenfrei nutzbar.',
      gallery: ['pfettendach-vierseithof.jpg', 'denkmal-dachsanierung.jpg', 'sichtdachstuhl-loft.jpg'],
    },
    {
      slug: 'geschossaufbau',
      title: 'Geschossaufbau in Holz',
      tag: 'Aufstockung',
      location: 'Dingolfing',
      year: '2023',
      hero: media['geschossaufbau.jpg'],
      featuredSize: 'wide' as const,
      lead: 'Ein komplettes Wohngeschoss in Holztafelbauweise — aufgesetzt auf den Bestand, bei laufendem Betrieb darunter.',
      facts: [
        { label: 'Bauweise', value: 'Holztafelbau' },
        { label: 'Neue Fläche', value: '96 m²' },
        { label: 'Aufrichtung', value: '1 Tag' },
        { label: 'Last', value: 'leicht & trocken' },
      ],
      aufgabe:
        'Eine Familie brauchte mehr Platz, wollte aber nicht umziehen. Auf dem bestehenden Flachdachbungalow sollte ein vollwertiges Wohngeschoss entstehen — ohne die Bewohner über Wochen auszuquartieren.',
      loesung:
        'Holz ist hier der ideale Baustoff: leicht genug für die vorhandene Statik, trocken und schnell. Die kompletten Wand- und Dachelemente wurden vorgefertigt und an einem einzigen Tag per Kran aufgesetzt. Das Bestandsdach war abends wieder regensicher geschlossen.',
      ergebnis:
        'Zwei neue Kinderzimmer, ein Bad und ein Studio — ohne monatelange Baustelle und ohne Umzug. Die Trockenbauweise machte den Innenausbau unmittelbar möglich.',
      gallery: ['geschossaufbau.jpg', 'wohnhaus-isarhang.jpg', 'pfettendach-vierseithof.jpg'],
    },
    {
      slug: 'doppelcarport-laerche',
      title: 'Doppelcarport Lärche',
      tag: 'Carport',
      location: 'Vilsbiburg',
      year: '2023',
      hero: media['carport-laerche.jpg'],
      featuredSize: 'wide' as const,
      lead: 'Ein freitragender Doppelcarport aus heimischer Lärche — offen, elegant und ohne störende Mittelstütze.',
      facts: [
        { label: 'Holzart', value: 'Lärche, sägerau' },
        { label: 'Stellplätze', value: '2 + Geräteraum' },
        { label: 'Konstruktion', value: 'freitragend' },
        { label: 'Schutz', value: 'naturbelassen' },
      ],
      aufgabe:
        'Gewünscht war ein Unterstand für zwei Fahrzeuge plus Stauraum, der nicht wie ein Fremdkörper wirkt, sondern zum Holzhaus und Garten passt — und der ohne Mittelstütze bequem befahrbar ist.',
      loesung:
        'Aus heimischer Lärche haben wir eine freitragende Konstruktion mit verdeckten Stahlverbindern gefertigt. Das Holz bleibt naturbelassen und vergraut mit der Zeit zu einem edlen Silbergrau — wartungsfrei und langlebig.',
      ergebnis:
        'Ein Carport, der mehr ist als ein Zweckbau: ein ruhiges, handwerklich sauberes Element, das den Hof aufwertet und Jahrzehnte ohne Pflege übersteht.',
      gallery: ['carport-laerche.jpg', 'wohnhaus-isarhang.jpg', 'geschossaufbau.jpg'],
    },
    {
      slug: 'denkmal-dachsanierung',
      title: 'Denkmal-Dachsanierung',
      tag: 'Sanierung',
      location: 'Landshut Altstadt',
      year: '2022',
      hero: media['denkmal-dachsanierung.jpg'],
      featuredSize: 'wide' as const,
      lead: 'Die behutsame Sanierung eines denkmalgeschützten Dachstuhls in der Landshuter Altstadt — Substanz erhalten, Statik ertüchtigt.',
      facts: [
        { label: 'Objekt', value: 'Denkmalschutz' },
        { label: 'Baujahr', value: 'um 1780' },
        { label: 'Leistung', value: 'Reparatur & Dämmung' },
        { label: 'Verbindungen', value: 'handgezimmert' },
      ],
      aufgabe:
        'Der über 240 Jahre alte Dachstuhl eines Altstadthauses war an tragenden Punkten geschädigt. In enger Abstimmung mit dem Denkmalschutz sollte so viel historische Substanz wie möglich erhalten und das Dach zugleich energetisch ertüchtigt werden.',
      loesung:
        'Wir haben jeden Balken einzeln begutachtet, schadhafte Hölzer mit traditionellen Holzverbindungen — Blattungen und Zapfen — partiell ausgetauscht und gesundes Eichenholz erhalten. Eine diffusionsoffene Aufdachdämmung bringt den Altbau auf einen zeitgemäßen Stand, ohne das Erscheinungsbild zu verändern.',
      ergebnis:
        'Ein gerettetes Stück Stadtgeschichte: statisch sicher, gedämmt und für weitere Generationen vorbereitet — vom Denkmalamt ausdrücklich gelobt.',
      beforeAfter: {
        before: 'pfettendach-vierseithof.jpg',
        after: 'denkmal-dachsanierung.jpg',
        caption: 'Vom geschädigten Bestand zum sanierten Dachstuhl — ziehen Sie den Regler.',
      },
      gallery: ['denkmal-dachsanierung.jpg', 'pfettendach-vierseithof.jpg', 'sichtdachstuhl-loft.jpg'],
    },
    {
      slug: 'sichtdachstuhl-loft',
      title: 'Sichtdachstuhl Loft',
      tag: 'Innenausbau',
      location: 'Essenbach',
      year: '2022',
      hero: media['sichtdachstuhl-loft.jpg'],
      featuredSize: 'wide' as const,
      lead: 'Ein offener Sichtdachstuhl wird zum Herzstück eines Loft-Ausbaus — Konstruktion als Gestaltung.',
      facts: [
        { label: 'Charakter', value: 'Sichtkonstruktion' },
        { label: 'Fläche', value: '72 m²' },
        { label: 'Oberfläche', value: 'geseift / geölt' },
        { label: 'Detail', value: 'sichtbare Zapfen' },
      ],
      aufgabe:
        'Unter einem alten Scheunendach sollte ein Wohn-Loft entstehen, das die mächtige Holzkonstruktion nicht verkleidet, sondern feiert — und dabei wohnliche Behaglichkeit erreicht.',
      loesung:
        'Wir haben das Tragwerk freigelegt, gereinigt und mit einer natürlichen Seifen- und Öl-Oberfläche veredelt. Neue Einbauten — Galerie, Treppe und Wandschränke — sind präzise auf die bestehenden Sparren abgestimmt und maßgefertigt.',
      ergebnis:
        'Ein Raum mit Charakter, in dem jede Verbindung sichtbar bleibt. Handwerk wird hier zur Architektur — warm, ehrlich und einzigartig.',
      gallery: ['sichtdachstuhl-loft.jpg', 'geschossaufbau.jpg', 'denkmal-dachsanierung.jpg'],
    },
  ]

  for (let i = 0; i < projekte.length; i++) {
    const p = projekte[i]
    await payload.create({
      collection: 'projekte',
      data: {
        slug: p.slug,
        title: p.title,
        tag: p.tag,
        location: p.location,
        year: p.year,
        hero: p.hero,
        featuredSize: p.featuredSize,
        sortOrder: i,
        lead: p.lead,
        facts: p.facts,
        aufgabe: p.aufgabe,
        loesung: p.loesung,
        ergebnis: p.ergebnis,
        gallery: p.gallery.map((f) => media[f]),
        ...(p.beforeAfter
          ? {
              beforeAfter: {
                before: media[p.beforeAfter.before],
                after: media[p.beforeAfter.after],
                caption: p.beforeAfter.caption,
              },
            }
          : {}),
      },
    })
  }
  payload.logger.info('✓ 6 Projekte angelegt')
}

async function seedLeistungen(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'leistungen' })
  if (totalDocs > 0) return
  const leistungen: Array<{
    title: string
    icon: 'roof' | 'house' | 'carport' | 'renovation' | 'addition' | 'interior'
    description: string
  }> = [
    { title: 'Dachstühle', icon: 'roof', description: 'Pfetten-, Sparren- und Kehlbalkendächer — millimetergenau abgebunden in unserer Halle, sturmsicher montiert auf Ihrem Rohbau.' },
    { title: 'Holzhäuser', icon: 'house', description: 'Holzrahmen- und Holztafelbau für Wohngebäude — diffusionsoffen, hoch gedämmt und schlüsselfertig auf Wunsch.' },
    { title: 'Carports & Terrassen', icon: 'carport', description: 'Freitragende Carports, überdachte Terrassen und Pergolen aus heimischem Lärchen- und Douglasienholz.' },
    { title: 'Dachsanierung', icon: 'renovation', description: 'Energetische Sanierung, neue Dämmung und Eindeckung — wir bringen Ihren Altbau auf den heutigen Stand.' },
    { title: 'Aufstockungen', icon: 'addition', description: 'Mehr Wohnraum ohne Umzug: wir setzen ganze Geschosse in Holzbauweise auf bestehende Gebäude — schnell und trocken.' },
    { title: 'Innenausbau', icon: 'interior', description: 'Sichtbare Holzdecken, Trockenbau, Böden und maßgefertigte Einbauten — der warme letzte Schliff im Innenraum.' },
  ]
  for (let i = 0; i < leistungen.length; i++) {
    await payload.create({ collection: 'leistungen', data: { ...leistungen[i], sortOrder: i } })
  }
  payload.logger.info('✓ 6 Leistungen angelegt')
}

async function seedTestimonials(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'testimonials' })
  if (totalDocs > 0) return
  const stimmen = [
    { initials: 'FH', author: 'Familie Huber', project: 'Einfamilienhaus, Ergolding', rating: 5, quote: 'Der Dachstuhl stand an einem Tag — und alles passte auf den Millimeter. So eine saubere Baustelle haben wir noch nie erlebt.' },
    { initials: 'SB', author: 'S. Brandl', project: 'Aufstockung, Dingolfing', rating: 5, quote: 'Festpreis war Festpreis. Keine bösen Überraschungen, ehrliche Beratung und ein Team, dem man beim Arbeiten gern zuschaut.' },
    { initials: 'RW', author: 'Dr. R. Weiß', project: 'Sanierung, Landshut', rating: 5, quote: 'Unser denkmalgeschütztes Dach war eine Herausforderung. Aigner hat sie mit echtem Handwerksstolz gelöst. Absolute Empfehlung.' },
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
    { title: 'Zimmerer (m/w/d)', type: 'Vollzeit · Landshut' },
    { title: 'Azubi Zimmerer (m/w/d)', type: 'Ausbildung ab Sept. · 3 Plätze' },
    { title: 'Holzbau-Vorarbeiter (m/w/d)', type: 'Vollzeit · Montage' },
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
    { question: 'Was kostet ein neuer Dachstuhl?', answer: ['Das hängt von Spannweite, Dachform und Ausführung ab — ein einfaches Satteldach kalkuliert sich anders als ein Krüppelwalmdach mit Gauben. Nach einem kostenlosen Vor-Ort-Termin erhalten Sie von uns einen verbindlichen Festpreis, mit dem Sie sicher planen können.'] },
    { question: 'Wie lange dauert Planung und Montage?', answer: ['Vom Auftrag bis zur Montage vergehen in der Regel wenige Wochen. Weil wir in unserer Halle vorfertigen, steht der Dachstuhl auf der Baustelle dann oft in ein bis zwei Tagen — wetterunabhängig und ohne langen Baulärm.'] },
    { question: 'Übernehmen Sie auch Statik und Planung?', answer: ['Ja — alles aus einer Hand. Wir liefern Statik, 3D-Abbundplanung und die komplette Ausführung. Sie haben einen Ansprechpartner vom ersten Aufmaß bis zur besenreinen Übergabe.'] },
    { question: 'Gibt es Förderungen für den Holzbau?', answer: ['Energetische Maßnahmen und effiziente Neubauten sind häufig über KfW- oder BAFA-Programme förderfähig. Wir kennen die gängigen Anforderungen und bauen KfW-fähig — die Antragstellung läuft über Ihren Energieberater, wir liefern die nötigen Nachweise zu.'] },
    { question: 'Bauen Sie auch außerhalb von Landshut?', answer: ['Unser Stammgebiet ist Niederbayern — Landshut, Ergolding, Dingolfing, Vilsbiburg und Umgebung. Für größere Projekte sind wir auch darüber hinaus unterwegs. Fragen Sie einfach an, wir sagen Ihnen ehrlich, ob wir der richtige Partner sind.'] },
    { question: 'Festpreis — wirklich ohne Nachträge?', answer: ['Was wir anbieten, gilt. Unser Festpreis umfasst die vereinbarte Leistung vollständig — Mehrkosten entstehen nur, wenn Sie den Umfang ändern. Keine versteckten Posten, keine bösen Überraschungen.'] },
  ]
  for (let i = 0; i < faqs.length; i++) {
    await payload.create({
      collection: 'faqs',
      data: { question: faqs[i].question, answer: rt(faqs[i].answer), sortOrder: i },
    })
  }
  payload.logger.info('✓ 6 FAQ angelegt')
}

async function seedContactForm(payload: Payload): Promise<void> {
  const existing = await payload.find({ collection: 'forms', where: { title: { equals: 'Kontakt' } }, limit: 1 })
  if (existing.docs.length) return
  // Felder 1:1 wie das ursprüngliche statische Formular.
  const fields = [
    { blockType: 'text', name: 'name', label: 'Name', required: true, width: 50 },
    { blockType: 'text', name: 'telefon', label: 'Telefon', required: false, width: 50 },
    { blockType: 'email', name: 'email', label: 'E-Mail', required: true, width: 100 },
    {
      blockType: 'select',
      name: 'vorhaben',
      label: 'Ihr Vorhaben',
      required: false,
      width: 100,
      options: [
        { label: 'Dachstuhl / Neubau', value: 'dachstuhl-neubau' },
        { label: 'Holzhaus', value: 'holzhaus' },
        { label: 'Carport / Terrasse', value: 'carport-terrasse' },
        { label: 'Dachsanierung', value: 'dachsanierung' },
        { label: 'Aufstockung', value: 'aufstockung' },
        { label: 'Innenausbau', value: 'innenausbau' },
        { label: 'Sonstiges', value: 'sonstiges' },
      ],
    },
    { blockType: 'textarea', name: 'nachricht', label: 'Nachricht', required: false, width: 100 },
  ]

  await payload.create({
    collection: 'forms',
    // Das Block-Union des Form-Builders ist sehr breit typisiert – hier bewusst gelockert.
    data: {
      title: 'Kontakt',
      submitButtonLabel: 'Anfrage senden',
      confirmationType: 'message',
      confirmationMessage: rt(['Danke — wir melden uns innerhalb von 24 Stunden bei Ihnen!']),
      emails: [
        {
          emailTo: process.env.CONTACT_TO || 'servus@aigner-holzbau.de',
          subject: 'Neue Anfrage über die Website',
          message: rt([
            'Neue Anfrage von {{name}} ({{email}}, Telefon: {{telefon}}).',
            'Vorhaben: {{vorhaben}}',
            'Nachricht: {{nachricht}}',
          ]),
        },
      ],
      fields,
    } as never,
  })
  payload.logger.info('✓ Kontaktformular angelegt')
}

async function seedSettings(payload: Payload): Promise<void> {
  const current = await payload.findGlobal({ slug: 'settings' })
  // Nur befüllen, wenn die Listen-Felder noch leer sind (sonst Editor-Eingaben nicht überschreiben).
  if (Array.isArray(current?.heroStats) && current.heroStats.length > 0) return
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      heroStats: [
        { value: '35+', label: 'Jahre Erfahrung' },
        { value: '640', label: 'Projekte realisiert' },
        { value: '18', label: 'Mitarbeiter & Meister' },
      ],
      marquee: [
        { word: 'Dachstühle' },
        { word: 'Holzrahmenbau' },
        { word: 'Carports' },
        { word: 'Aufstockungen' },
        { word: 'Dachsanierung' },
        { word: 'Terrassen' },
        { word: 'Innenausbau' },
      ],
      stats: [
        { count: 35, suffix: '+', label: 'Jahre am Markt' },
        { count: 640, suffix: '', label: 'Dächer & Häuser gebaut' },
        { count: 100, suffix: '%', label: 'Termintreue 2024' },
        { count: 12000, suffix: ' m³', label: 'Holz verbaut' },
      ],
    },
  })
  payload.logger.info('✓ Einstellungen befüllt')
}
