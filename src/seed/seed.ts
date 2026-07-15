import path from 'path'
import type { Payload } from 'payload'
import { rt } from './richtext'
import { computeSlots } from '../lib/slots'

/**
 * Einmaliges, idempotentes Befüllen der Inhalte der **Zahnarztpraxis Johannes Adolf**
 * (Adlkofen). Inhalte stammen aus der bisherigen Website (zahnarzt-adlkofen.de) und
 * sind die kanonische Inhaltsquelle (siehe CLAUDE.md / PROJEKT.md). Jeder Schritt
 * prüft selbst, ob er schon erledigt ist – der Seed kann jederzeit erneut laufen.
 */
export const seed = async (payload: Payload): Promise<void> => {
  await seedAdmin(payload)
  await seedLeistungen(payload)
  await seedAerzte(payload)
  await seedTermine(payload)
  await seedFaqs(payload)
  await seedSettings(payload)
}

// ---------------------------------------------------------------------------

async function seedAdmin(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return
  const email = process.env.ADMIN_EMAIL || 'admin@zahnarzt-adlkofen.de'
  const password = process.env.ADMIN_PASSWORD || 'adlkofen-admin'
  await payload.create({ collection: 'users', data: { email, password, name: 'Administrator' } })
  payload.logger.info(`✓ Admin-Benutzer angelegt: ${email} (Passwort bitte ändern!)`)
}

// Kategorie-Titel → Bilddatei in src/seed/assets/leistungen/ (Unterleistungen: `${slug}.jpg`)
const KATEGORIE_BILD: Record<string, string> = {
  Zahnerhalt: 'zahnerhalt.jpg',
  Zahnersatz: 'zahnersatz.jpg',
  Implantologie: 'implantologie.jpg',
  Kieferorthopädie: 'kieferorthopaedie.jpg',
  Zahnästhetik: 'zahnaesthetik.jpg',
  Kinderbehandlung: 'kinderbehandlung.jpg',
}

/** Legt ein Media-Dokument aus src/seed/assets/leistungen/ an und gibt die ID zurück. */
async function createLeistungBild(payload: Payload, file: string, alt: string): Promise<number | undefined> {
  try {
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(process.cwd(), 'src/seed/assets/leistungen', file),
    })
    return media.id as number
  } catch (e) {
    payload.logger.warn(`Leistungsbild „${file}" nicht angelegt: ${(e as Error).message}`)
    return undefined
  }
}

async function seedLeistungen(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'leistungen' })
  if (totalDocs > 0) return
  const leistungen: Array<{
    title: string
    icon: 'tooth' | 'denture' | 'implant' | 'braces' | 'sparkle' | 'child'
    description: string
    lead: string
    intro: string
    leistungspunkte: Array<{ text: string }>
    ablauf: Array<{ titel: string; text: string }>
    faq: Array<{ frage: string; antwort: string }>
    unterleistungen?: Array<{ title: string; slug: string; lead?: string; abschnitte: Array<{ titel?: string; text: string }> }>
  }> = [
    {
      title: 'Zahnerhalt',
      icon: 'tooth',
      description: 'Zahnerhaltung mit Vorbeugung an erster Stelle: Prophylaxe, professionelle Zahnreinigung, Füllungen, Wurzelbehandlung und Parodontologie.',
      lead: 'Die Zahnerhaltung hat bei uns oberste Priorität — mit der Vorbeugung an erster Stelle.',
      intro:
        'Damit Ihre Zähne auch noch im hohen Alter gesund und schön sind, hat die Zahnerhaltung oberste Priorität. Die Vorbeugung von Krankheiten (Prophylaxe) hat bei uns höchsten Stellenwert. Unter Prophylaxe bzw. Prävention versteht man vorbeugende Maßnahmen, die der Krankheitsverhinderung dienen. Auf der primären Präventionsebene können Sie bereits Einfluss nehmen, indem Sie geeignete Mundhygienemaßnahmen zu Ihrer alltäglichen Aufgabe machen und die Gesundheit Ihrer Zähne allgemein fördern, indem Sie auf eine ausgewogene und zahngesunde Ernährung achten (z. B. Vermeidung von häufigem Zuckerkonsum). Durch regelmäßige Kontrollen können wir als Zahnspezialisten existierende Krankheitsfälle früh diagnostizieren und so eine weitere Ausbreitung begrenzen. Neben der Prophylaxe umfasst die Zahnerhaltungskunde vor allem die Rekonstruktion zerstörter Zähne sowie die Behandlung von erkranktem Zahnmark (Endodontie).',
      leistungspunkte: [
        { text: 'Professionelle Zahnreinigung — für eine möglichst plaquefreie, belagfreie Zahnoberfläche' },
        { text: 'Zahnfarbene Kompositfüllungen — als amalgamfreie Praxis, von der Kassenleistung bis zur unsichtbaren Kompositrestauration' },
        { text: 'Endodontie (Wurzelbehandlung) mit superelastischen Nickel-Titan-Feilen und ultraschallaktivierten Spüllösungen' },
        { text: 'Parodontologie — Behandlung des Zahnhalteapparats mit Ultraschallreinigung, Wurzelglättung und antibakterieller Spülung' },
        { text: 'Regelmäßige Kontrollen und jährliche Prophylaxe' },
      ],
      ablauf: [],
      faq: [],
      unterleistungen: [
        {
          title: 'Professionelle Zahnreinigung',
          slug: 'professionelle-zahnreinigung',
          lead: 'Für eine möglichst plaquefreie, belagfreie Zahnoberfläche.',
          abschnitte: [
            { text: 'Eine gute Mundhygiene ist wesentliche Grundvoraussetzung für schöne und gesunde Zähne. Das Ziel von Mundhygienemaßnahmen ist die Schaffung einer möglichst plaquefreien Zahnoberfläche. Unter Plaque versteht man Zahnbelag, der aus Speichelbestandteilen, Nahrungsresten und Bakterien besteht und durch gründliche Reinigung mit Zahnbürste und Zahnseide beseitigt werden kann.' },
            { text: 'Allerdings gibt es Zahnablagerungen wie beispielsweise Zahnstein, Verfärbungen und Konkremente, die weder durch Spülungen noch durch Zähneputzen beseitigt werden können. Deshalb ist es empfehlenswert, in regelmäßigen Abständen eine professionelle Zahnreinigung vornehmen zu lassen, durch die ein völlig belagfreier Zustand erreicht werden kann.' },
          ],
        },
        {
          title: 'Zahnfüllungen',
          slug: 'zahnfuellungen',
          lead: 'Zahnfarbene Kompositfüllungen — als amalgamfreie Praxis.',
          abschnitte: [
            { text: 'Zahnfüllungen spielen bei der Behandlung zum Zwecke des Zahnerhalts eine elementare Rolle. Notwendig werden Zahnfüllungen, sobald der Zahn von Zahnkaries betroffen ist.' },
            { text: 'Bei der Karies wird die Zahnhartsubstanz durch die in weichen Zahnbelägen befindlichen säurebildenden Bakterien irreversibel zerstört. Bleibt eine Behandlung aus, ist die Karies ein fortschreitendes Krankheitsbild und führt schließlich zum Zahnverlust. Durch mechanische Entfernung beseitigen wir die Karies, d. h. die erweichte Zahnhartsubstanz. Nach erfolgter Kariesentfernung muss der entstandene Defekt verschlossen werden, da andernfalls Bakterien und Keime eindringen und dadurch Entzündungen entstehen könnten. Das Verschließen erfolgt mit Hilfe einer Füllung.' },
            { text: 'Um den Defekt zu verschließen, gibt es verschiedene Methoden. Als amalgamfreie Praxis verwenden wir in der Regel Kompositfüllungen. Die mit keramischen Partikeln gefüllten, zahnfarbenen Kunststoffe füllen das entstandene Loch und härten unter Einsatz von Lichtbestrahlung aus. Dabei bieten wir Ihnen Füllungen an, die komplett von der Krankenkasse übernommen werden — bis hin zu einer hochästhetischen, unsichtbaren Kompositrestauration.' },
          ],
        },
        {
          title: 'Endodontie',
          slug: 'endodontie',
          lead: 'Wurzelbehandlung zum Erhalt des eigenen Zahnes.',
          abschnitte: [
            { text: 'Die Endodontie oder auch Wurzelbehandlung beschäftigt sich mit dem Innenleben des Zahnes, der Pulpa. Der sogenannte Nerv liegt geschützt von Zahnhartsubstanz im Inneren des Zahnes und ist für die Sensibilität des Zahnes verantwortlich.' },
            { text: 'Leider kann sich dieser Nerv durch äußere Einflüsse wie tiefe Karies oder Traumata entzünden oder sogar absterben. Dies kann zu bakteriellen Besiedelungen und über die Wurzelspitze zu ernsteren Erkrankungen im umliegenden Gewebe führen, etwa zu Zysten und Abszessen (sog. „Dicke Backe").' },
            { text: 'In solchen Fällen ist eine Wurzelbehandlung notwendig. Dabei wird das vitale bzw. abgestorbene Pulpagewebe akribisch aus dem Zahninneren entfernt und den Wurzelkanälen eine konische Form gegeben. Dadurch lassen sich die Kanäle letztendlich dicht verschließen und der Zahnerhalt ist gewährleistet. Die Präzision der Behandlung und damit die Prognose des Zahnes sind durch moderne Methodiken — wie zum Beispiel superelastische Nickel-Titan-Feilen und ultraschallaktivierte Spüllösungen — bei uns auf hohem Niveau.' },
          ],
        },
        {
          title: 'Parodontologie',
          slug: 'parodontologie',
          lead: 'Behandlung des Zahnhalteapparats — von Gingivitis bis Parodontitis.',
          abschnitte: [
            { text: 'Die Parodontologie beschäftigt sich mit dem Zahnhalteapparat, also dem Zahnfleisch und der bindegewebigen Aufhängung des Zahnes in seinem Knochenfach.' },
            { text: 'Durch ständige Präsenz von Zahnbelag kann es zu Entzündungen der genannten Gewebe kommen. Anfänglich ist dies eine Gingivitis bzw. Zahnfleischentzündung, bei der das Zahnfleisch anschwillt und blutet. Zu diesem Zeitpunkt ist die Entzündung noch gut durch intensivierte Pflege und eine professionelle Zahnreinigung in den Griff zu bekommen. Bleibt die Therapie allerdings aus, entwickelt sich aus der bestehenden Gingivitis eine Entzündung der tiefergelegenen Gewebe — die Parodontitis. Hierbei kommt es durch bakterielle Aggression wie auch durch die körperliche Abwehr zu einem fortschreitenden Verlust des zahnstützenden Knochens. Es bilden sich Zahnfleischtaschen, das Zahnfleisch geht zurück, es entstehen übler Mundgeruch und lockere Zähne sowie letzten Endes Zahnverlust.' },
            { text: 'Um dies zu vermeiden, ist eine fundierte und generalisierte Parodontitistherapie notwendig. Dabei werden die entzündeten Zahnfleischtaschen durch Ultraschallreinigung und Wurzelglättung sowie eine unterstützende antibakterielle Spülung behandelt. Bei rechtzeitigem Einschreiten und guter Mundhygiene kann sich das Zahnfleisch wieder straff und entzündungsfrei an den Zahn anlegen, wodurch die Parodontitis — und damit der fortschreitende Verlust des Zahnhalteapparats — gestoppt wird und sich die Zähne im besten Fall wieder verfestigen können.' },
            { text: 'Eine regelmäßige Prophylaxe in Form von jährlichen Zahnreinigungen und Kontrollen ist für einen langfristigen Behandlungserfolg bei dieser chronischen Erkrankung unentbehrlich.' },
          ],
        },
      ],
    },
    {
      title: 'Zahnersatz',
      icon: 'denture',
      description: 'Hochwertiger fester und herausnehmbarer Zahnersatz: vollkeramische Kronen und Brücken, Prothesen und implantatgetragener Ersatz.',
      lead: 'Festsitzender und herausnehmbarer Zahnersatz hoher Qualität — aus unserem deutschen Meisterlabor.',
      intro:
        'Zahnverlust entsteht durch fortschreitende Erkrankungen wie Karies und Parodontitis, äußere Traumata oder auch allgemeine Grunderkrankungen. Der Verlust eines Zahnes ist eine unschöne Erfahrung und hinterlässt Lücken. Nicht in jedem Fall muss eine Zahnlücke therapiert werden. Kommt es jedoch durch die entstandene Lücke zum Abstützungsverlust und damit verbundenen Zahnwanderungen, oder ist ein Frontzahn betroffen, wird Zahnersatz notwendig. Dabei bieten wir Ihnen festsitzenden wie auch herausnehmbaren Zahnersatz von hoher Qualität an, wofür wir und unser deutsches Meisterlabor garantieren.',
      leistungspunkte: [
        { text: 'Vollkeramische Kronen — hochästhetisch, vom echten Zahn nicht zu unterscheiden' },
        { text: 'Vollkeramische Brücken — festsitzender Ersatz fehlender Zähne auf der Eigenbezahnung' },
        { text: 'Herausnehmbarer Zahnersatz mit höchstem Tragekomfort (gaumenfreie bzw. sublingualbügelfreie Gestaltung)' },
        { text: 'Totalprothesen — optional mit Implantaten unterstützt' },
        { text: 'Implantatgetragener Zahnersatz für festen Halt' },
      ],
      ablauf: [],
      faq: [],
      unterleistungen: [
        {
          title: 'Kronen und Brücken',
          slug: 'kronen-und-bruecken',
          lead: 'Vollkeramische Kronen und Brücken — hochästhetisch und natürlich.',
          abschnitte: [
            { titel: 'Kronen', text: 'Unter Kronen versteht man einen vollständigen Ersatz der klinischen Zahnkrone. Eine Überkronung wird notwendig, wenn der Zahn durch ausgedehnte Karies bzw. sehr große Füllungen ein deutlich erhöhtes Bruchrisiko aufweist und ohne Überkronung nicht erhaltungsfähig ist. Dabei können wir Ihnen durch vollkeramische Systeme hochästhetische Kronen anbieten, die vom echten Zahn nicht zu unterscheiden sind.' },
            { titel: 'Brücken', text: 'Brücken können fehlende Zähne festsitzend auf der Eigenbezahnung ersetzen. Dafür werden die lückenbegrenzenden Zähne zur Brückenaufnahme präpariert und die Brücke schließlich fest auf diesen Zähnen eingesetzt. Auch hier sind hochästhetische, vollkeramische Lösungen möglich, die den Zahn natürlich ersetzen. Besonders empfehlenswert sind sie, wenn die die Zahnlücke begrenzenden Zähne selbst umfangreiche Defekte aufweisen und damit überkronungsbedürftig sind. Sollten die Nachbarzähne allerdings karies- und füllungsfrei sein, empfiehlt sich implantatgetragener Zahnersatz, um eine Präparation gesunder Zähne zur Brückenaufnahme zu vermeiden.' },
          ],
        },
        {
          title: 'Herausnehmbarer Zahnersatz',
          slug: 'herausnehmbarer-zahnersatz',
          lead: 'Höchster Tragekomfort — gaumenfreie Lösungen möglich.',
          abschnitte: [
            { text: 'Herausnehmbarer Zahnersatz wird bei umfangreichem Zahnverlust und vor allem bei Freiend-Situationen angewendet, bei denen kein endständiger Zahn mehr vorhanden ist. Diese Art von Zahnersatz ist schleimhautgetragen, stützt sich aber auf die Restbezahnung. Dabei sind durchaus angenehme und hochqualitative Lösungen möglich.' },
            { text: 'Wir legen besonderen Wert auf den Tragekomfort und versuchen, den Zahnersatz so filigran wie nur möglich zu gestalten. Besonders stolz sind wir auf Techniken, die eine gaumenfreie bzw. sublingualbügelfreie Gestaltung ermöglichen und somit höchsten Tragekomfort garantieren. Sollte es zu vollständigem Zahnverlust gekommen sein, bieten wir Ihnen auch Totalprothesen an, bei denen der Prothesenhalt optional mit Implantaten unterstützt werden kann.' },
          ],
        },
        {
          title: 'Implantatgetragener Zahnersatz',
          slug: 'implantatgetragener-zahnersatz',
          lead: 'Implantate als Vorbild der natürlichen Zahnwurzel.',
          abschnitte: [
            { text: 'Zahnimplantate orientieren sich am Vorbild des natürlichen Zahnes. Unter einem Zahnimplantat versteht man eine künstliche Zahnwurzel, welche die natürliche Zahnwurzel in Form und Funktion ersetzt. Mit Hilfe von Implantaten kann sowohl festsitzender als auch herausnehmbarer Zahnersatz realisiert werden.' },
            { text: 'Beim festsitzenden Zahnersatz können auf bestehende Implantate Kronen wie auch Brücken befestigt werden. Diese Form des Zahnersatzes kommt den natürlichen Zähnen am allernächsten. Aber auch bei herausnehmbarem Zahnersatz sind Implantate äußerst wertvoll: Durch verschiedene Verbindungselemente — wie zum Beispiel Teleskopkronen oder sogenannte Locatoren (vergleichbar mit Kugelknopfankern) — kann der Prothesenhalt maßgeblich verbessert werden.' },
          ],
        },
      ],
    },
    {
      title: 'Implantologie',
      icon: 'implant',
      description: 'Implantate als künstliche Zahnwurzeln für festen oder stabilisierten Zahnersatz — ambulant, mit bewährter Camlog®-Qualität.',
      lead: 'Künstliche Zahnwurzeln für festen Zahnersatz — ambulant in unserer Praxis.',
      intro:
        'Implantate sind künstliche Zahnwurzeln, die in den Kieferknochen eingebracht werden und mit diesem einheilen. Diese Technik ermöglicht sowohl festsitzenden Zahnersatz — wenn die Präparation von Nachbarzähnen vermieden werden soll — als auch die Stabilisierung von herausnehmbarem Zahnersatz. Wir bieten Ihnen dieses Verfahren ambulant in unserer Praxis an und verwenden ausschließlich die bewährtesten Produkte des renommierten Herstellers Camlog®. Somit steht einer guten Prognose Ihrer künstlichen Zahnwurzel nichts im Wege. Sprechen Sie uns an — wir freuen uns, Sie individuell zu diesem Thema beraten zu dürfen.',
      leistungspunkte: [
        { text: 'Festsitzender Zahnersatz, ohne Nachbarzähne beschleifen zu müssen' },
        { text: 'Stabilisierung von herausnehmbarem Zahnersatz' },
        { text: 'Ambulanter Eingriff in unserer Praxis' },
        { text: 'Ausschließlich bewährte Markenimplantate des Herstellers Camlog®' },
      ],
      ablauf: [],
      faq: [],
    },
    {
      title: 'Kieferorthopädie',
      icon: 'braces',
      description: 'Zahn- und Kieferfehlstellungen schonend korrigieren: herausnehmbare und feste Apparaturen mit moderner, schmerzarmer Technik.',
      lead: 'Fehlstellungen von Zähnen und Kiefern — am besten in der Wachstumsphase korrigiert.',
      intro:
        'Die Kieferorthopädie befasst sich mit Fehlentwicklungen von Ober- und Unterkiefer sowie mit Zahnfehlstellungen. Diese Abweichungen können am besten während der Wachstumsphase eines Kindes korrigiert werden. Daher empfehlen wir, kieferorthopädische Untersuchungen im Einschulungsalter und spätestens bis zum 10. Lebensjahr durchführen zu lassen. Die Behandlung lässt sich auf zwei Arten vornehmen — mit herausnehmbaren und mit festsitzenden Apparaturen. Um den Behandlungsablauf zu beschleunigen und möglichst schmerzfrei zu gestalten, greifen wir auf moderne Methodik zurück: selbstligierende, passive Brackets und thermoelastische Drahtbögen aus einer Nickel-Titan-Legierung.',
      leistungspunkte: [
        { text: 'Herausnehmbare Apparaturen — vor allem in der Wachstumsphase und zur Retention' },
        { text: 'Festsitzende Apparaturen (Multi-Bracket)' },
        { text: 'Selbstligierende, passive Brackets — Behandlungsdauer häufig unter zwei Jahren' },
        { text: 'Thermoelastische Nickel-Titan-Drahtbögen für eine möglichst schmerzarme Behandlung' },
        { text: 'Erste Untersuchung im Einschulungsalter, spätestens bis zum 10. Lebensjahr' },
      ],
      ablauf: [],
      faq: [],
    },
    {
      title: 'Zahnästhetik',
      icon: 'sparkle',
      description: 'Ästhetische Zahnmedizin für schöne, weiße Zähne — Veneers und professionelles Bleaching.',
      lead: 'Damit Sie mit einem strahlenden Lächeln durch das Leben gehen.',
      intro:
        'Die ästhetische Zahnmedizin beschäftigt sich mit dem Aussehen, der Ästhetik der Zähne. Zähne spielen eine große Rolle für das menschliche Erscheinungsbild. Dabei implizieren schöne und weiße Zähne Gesundheit und Selbstbewusstsein. Verfärbte und defekte Zähne beeinträchtigen hingegen das Aussehen, unser Wohlbefinden und die Lebensqualität. Deshalb ist es uns ein besonderes Anliegen, dass Sie mit einem strahlenden Lächeln durch das Leben gehen.',
      leistungspunkte: [
        { text: 'Veneers — hauchdünne Keramik-Verblendschalen für die ästhetische Frontzahnversorgung' },
        { text: 'Home-Bleaching — mit individuell angefertigter, passgenauer Schiene (Anwendung 2–6 Wochen)' },
        { text: 'In-Office-/Chairside-Bleaching — sofortiges Ergebnis direkt am Behandlungsstuhl' },
        { text: 'Walking-Bleach-Technik — für verfärbte, nicht mehr vitale Zähne' },
      ],
      ablauf: [],
      faq: [],
      unterleistungen: [
        {
          title: 'Veneers',
          slug: 'veneers',
          lead: 'Hauchdünne Keramikschalen für die ästhetische Frontzahnversorgung.',
          abschnitte: [
            { text: 'Veneers sind hauchdünne Verblendschalen aus Keramik und zählen zu den innovativen, adhäsiven Restaurationen. Sie sind vor allem in der ästhetischen Frontzahnversorgung bedeutend. Um eine kosmetische Zahnkorrektur vorzunehmen, werden die Verblendschalen auf den natürlichen Zähnen aufgeklebt. Veneers werden insbesondere eingesetzt bei anatomischen Fehlbildungen (kleine Fehlstellungen, Zahnlücken oder Absplitterungen), bei Zahnschmelzdefekten sowie zur Korrektur von verfärbten Zähnen oder unregelmäßigen Zahnoberflächen.' },
            { titel: 'Der Behandlungsverlauf', text: 'Wir beraten Sie gerne, ob Veneers für Sie das Richtige sind und welche vorbereitenden Maßnahmen notwendig wären. Im Rahmen der Beratung und Untersuchung erhalten Sie auch den Kostenvoranschlag. Der erste und ein sehr wichtiger Schritt zum Veneer sind die vorbereitenden Maßnahmen: Zum einen müssen die Zähne gründlich gereinigt werden, zum anderen bedarf es gegebenenfalls einer Aufbereitung des Zahnes — etwa wenn ältere Zahnfüllungen erneuert werden müssen, Karies zu behandeln ist oder vorher eine Bleichung der Zähne durchzuführen ist.' },
            { text: 'Je nach Art des Veneers wird der entsprechende Zahn leicht abgeschliffen. Diese Schmelzreduktion ist nötig, damit die Verblendschale möglichst natürlich aussieht und der Zahn durch das aufgeklebte Veneer optisch nicht zu dick wirkt. Damit der Zahntechniker eine für Sie optimale Verblendschale herstellen kann, wird eine präzise Abformung genommen. Um den Zeitraum bis zur fertigen Schale zu überbrücken, fertigen wir für Sie eine provisorische Verblendschale aus Kunststoff an, damit Sie auch während der Herstellung durch das Labor weder praktische noch optische Einbußen in Kauf nehmen müssen.' },
            { text: 'Sobald das Keramik-Veneer durch den Zahntechniker angefertigt worden ist, erfolgt in unserer Praxis die Einprobe. Dabei wird überprüft, ob das Veneer gut passt und ästhetisch einwandfrei ist. Abschließend wird das Veneer mit einem adhäsiven Befestigungskomposit, einem Spezialkleber, endgültig befestigt. Über das Ergebnis werden Sie sich lange Zeit freuen können.' },
          ],
        },
        {
          title: 'Bleaching',
          slug: 'bleaching',
          lead: 'Verfärbte Zähne aufhellen — drei Verfahren.',
          abschnitte: [
            { text: 'Eine weitere Möglichkeit, der Natur auf die Sprünge zu helfen, ist das Aufhellen durch Bleichen der Zähne (sog. Bleaching). Denn häufig können sich die Zahnoberflächen durch Farbstoffe in Nahrungs- und Genussmitteln verfärben — solche finden sich beispielsweise in Kaffee, Tee, Rotwein und Tabak. Mit solchen Verfärbungen muss sich heutzutage niemand mehr abfinden: Das Bleaching-Verfahren ermöglicht es, die Zähne aufzuhellen und wieder strahlen zu lassen. Dabei gibt es drei Alternativen.' },
            { titel: 'Home-Bleaching', text: 'Dabei handelt es sich um ein Verfahren, bei dem in eine tiefgezogene, durch uns angefertigte passgenaue, weichbleibende Schiene ein Bleichgel eingefüllt und diese dann je nach Präparat mehrere Stunden täglich getragen wird. Die Aufhellung der dunklen Farbpigmente erfolgt in der Regel durch Carbamidperoxid. Den eigentlichen Vorgang des Bleichens führen Sie selbstständig unter Einhaltung unserer Anweisungen daheim durch, weshalb dieses Verfahren auch Home-Bleaching genannt wird. Je nach Grad der Verfärbung beträgt die Anwendungsdauer zwei bis sechs Wochen.' },
            { titel: 'In-Office-Bleaching', text: 'Bei diesem Verfahren werden die Zähne mit einem höher konzentrierten Präparat in einem wesentlich kürzeren Zeitraum aufgehellt. Das Bleaching erfolgt direkt auf dem Behandlungsstuhl in unserer Praxis, weshalb dieses Verfahren auch Chairside-Bleaching genannt wird. Dabei wird das höher konzentrierte Bleichgel mit Hilfe von UV-Licht aktiviert, sodass ein schnelles Ergebnis erzielt wird und Sie sich unmittelbar nach der Behandlung über schöne, weiße Zähne freuen dürfen. Empfehlenswert ist es allerdings, zusätzlich eine mit Bleichgel zu befüllende Schiene anfertigen zu lassen, um die Freude an den weißen Zähnen möglichst lange aufrechtzuerhalten.' },
            { titel: 'Walking-Bleach-Technik', text: 'Bei der Walking-Bleach-Technik werden verfärbte und nicht mehr vitale Zähne innerhalb von mehreren Tagen behutsam aufgehellt. Auch Medikamente oder Wurzelkanalfüllungsmaterial können zu Zahnverfärbungen führen. Diese Methode hellt den Zahn behutsam auf, indem in ihn ein Bleichmittel eingelegt wird, das über mehrere Tage hinweg seine Wirkung entfaltet. Nach Abschluss der Aufhellungstherapie wird der Zahn mit einer Kompositfüllung wieder verschlossen.' },
          ],
        },
      ],
    },
    {
      title: 'Kinderbehandlung',
      icon: 'child',
      description: 'Einfühlsame, spielerische Zahnbehandlung für Kinder — angstfrei von klein auf, mit individueller Prophylaxe.',
      lead: 'Auch unsere kleinen Patienten werden bei uns ganz groß geschrieben.',
      intro:
        'Auch unsere kleinen Patienten werden bei uns ganz groß geschrieben. Der Grundstein für gesunde Zähne wird bereits im Kindesalter gelegt. Deshalb ist es uns besonders wichtig, schon in jungen Jahren den Besuch so angenehm wie möglich zu gestalten und dem Kind die Angst vor weiteren Zahnarztbesuchen zu nehmen. Damit Ihr Kind den Besuch bei uns als positives Erlebnis empfindet, nehmen wir uns ausreichend Zeit, um in ruhiger und entspannter Atmosphäre auf Ihr Kind einzugehen und es spielerisch, schonend und einfühlsam durch eine individuelle Prophylaxe zu behandeln. Denn die Gesundheit von Kinderzähnen ist nicht nur grundlegend für eine lebenslange Zahngesundheit, sondern ermöglicht dem Kind auch das Kauen, Sprechen und die Lautbildung. Um die Zahngesundheit Ihres Kindes zu fördern, empfehlen wir regelmäßige Kontrollen. Dabei lässt sich frühzeitig erkennen, ob Fehlentwicklungen von Ober- und Unterkiefer oder Zahnfehlstellungen vorliegen, sodass diese rechtzeitig kieferorthopädisch behandelt werden können.',
      leistungspunkte: [
        { text: 'Angenehmer, angstfreier Einstieg in ruhiger, entspannter Atmosphäre' },
        { text: 'Spielerische, schonende Behandlung mit individueller Prophylaxe' },
        { text: 'Regelmäßige Kontrollen zur Förderung der Zahngesundheit' },
        { text: 'Frühzeitiges Erkennen von Kiefer- und Zahnfehlstellungen' },
      ],
      ablauf: [],
      faq: [],
    },
  ]
  for (let i = 0; i < leistungen.length; i++) {
    const l = leistungen[i]
    const katFile = KATEGORIE_BILD[l.title]
    const heroImage = katFile ? await createLeistungBild(payload, katFile, l.title) : undefined
    const unterleistungen = l.unterleistungen
      ? await Promise.all(
          l.unterleistungen.map(async (u) => ({
            ...u,
            heroImage: await createLeistungBild(payload, `${u.slug}.jpg`, u.title),
          })),
        )
      : undefined
    await payload.create({
      collection: 'leistungen',
      data: { ...l, unterleistungen, heroImage, sortOrder: i } as never,
    })
  }
  payload.logger.info('✓ 6 Leistungen (mit Bildern) angelegt')
}

async function seedAerzte(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'aerzte' })
  if (totalDocs > 0) return
  // Sprechzeiten: 1 = Mo … 5 = Fr.
  const block = (tage: string[], von: string, bis: string) => tage.map((t) => ({ wochentag: t, von, bis }))

  // Porträt: aus dem Teamfoto ausgeschnittener Kopf (siehe src/seed/assets/adolf.jpg).
  let fotoId: number | undefined
  try {
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Johannes Adolf, Zahnarzt' },
      filePath: path.join(process.cwd(), 'src/seed/assets/adolf.jpg'),
    })
    fotoId = media.id as number
  } catch (e) {
    payload.logger.warn('Arzt-Foto konnte nicht angelegt werden (Fallback: Initialen): ' + (e as Error).message)
  }

  await payload.create({
    collection: 'aerzte',
    data: {
      titel: '', // „Zahnarzt", kein „Dr." – sein Vater Dr. Wolfgang Adolf war der Vorgänger
      name: 'Johannes Adolf',
      fachrichtung: 'Zahnarzt · Schwerpunkte Implantologie & Kieferorthopädie',
      vita: 'Approbation 2012 (Universität Regensburg), nach Assistenzzeit in Landshut seit 2015 Inhaber der Praxis in Adlkofen — in dritter Generation. Breites Behandlungsspektrum von der allgemeinen Zahnmedizin bis zu Implantologie und Kieferorthopädie.',
      foto: fotoId,
      slotDauerMin: 30,
      sprechzeiten: [...block(['1', '2', '3', '4', '5'], '08:00', '12:00'), ...block(['1', '2', '4'], '14:00', '18:00')],
      aktiv: true,
      sortOrder: 0,
    } as never,
  })
  payload.logger.info('✓ Zahnarzt angelegt')
}

/**
 * Demo-Belegung: legt für den nächsten ~14 Tagen einen Teil der freien Slots als
 * bestätigte Termine an, damit das Buchungsraster realistisch „teilweise belegt"
 * aussieht (belegte Slots werden von der Slot-Engine automatisch ausgeblendet).
 * Deterministisch (FNV-Hash je Slot) → bei jedem Reset gleiches Muster.
 */
async function seedTermine(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'termine' })
  if (totalDocs > 0) return
  const res = await payload.find({ collection: 'aerzte', limit: 1, sort: 'sortOrder', depth: 0 })
  const arzt = res.docs[0] as unknown as { id: number; slotDauerMin: number; sprechzeiten?: unknown; abwesenheiten?: unknown }
  if (!arzt) return

  const days = computeSlots(
    { slotDauerMin: arzt.slotDauerMin, sprechzeiten: arzt.sprechzeiten as never, abwesenheiten: arzt.abwesenheiten as never },
    [],
    { includeEmpty: false, horizonDays: 14 },
  )
  const arten = ['kontrolle', 'pzr', 'akut', 'beratung_ersatz', 'kfo', 'aesthetik', 'erstgespraech']
  const vers = ['gesetzlich', 'privat', 'selbstzahler']
  let count = 0
  for (const day of days) {
    for (const slot of day.slots) {
      // Deterministischer FNV-1a-Hash aus dem ISO-String.
      let h = 2166136261
      for (let i = 0; i < slot.iso.length; i++) {
        h ^= slot.iso.charCodeAt(i)
        h = Math.imul(h, 16777619)
      }
      h = h >>> 0
      if (h % 100 >= 50) continue // ~50 % der Slots belegen
      const start = new Date(slot.iso)
      const ende = new Date(start.getTime() + arzt.slotDauerMin * 60000)
      await payload.create({
        collection: 'termine',
        data: {
          arzt: arzt.id,
          terminart: arten[h % arten.length],
          versicherung: vers[(h >>> 3) % vers.length],
          start: start.toISOString(),
          ende: ende.toISOString(),
          patientName: 'Reserviert',
          patientEmail: 'reserviert@example.invalid',
          istNeupatient: false,
          status: 'bestaetigt',
        } as never,
      })
      count++
    }
  }
  payload.logger.info(`✓ ${count} Demo-Termine (belegt) angelegt`)
}

async function seedFaqs(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'faqs' })
  if (totalDocs > 0) return
  const faqs = [
    { question: 'Wie bekomme ich einen Termin?', answer: ['Am einfachsten online über „Termin buchen": Sie wählen eine Wunschzeit und bestätigen per E-Mail. Telefonisch erreichen Sie uns unter 08707 266, persönlich an der Anmeldung.'] },
    { question: 'Nehmen Sie neue Patienten auf?', answer: ['Ja, wir freuen uns über neue Patientinnen und Patienten. Als Neupatient können Sie den Anamnesebogen bequem vorab online ausfüllen — Ende-zu-Ende verschlüsselt und nur für unsere Praxis lesbar.'] },
    { question: 'Sind Sie eine amalgamfreie Praxis?', answer: ['Ja. Wir verwenden zahnfarbene Kompositfüllungen — von der komplett kassenübernommenen Füllung bis zur hochästhetischen, unsichtbaren Restauration.'] },
    { question: 'Behandeln Sie auch Kinder und ängstliche Patienten?', answer: ['Sehr gern. Wir nehmen uns Zeit, gehen in ruhiger Atmosphäre einfühlsam vor und nehmen besonders Kindern spielerisch die Angst vor dem Zahnarztbesuch.'] },
    { question: 'Was kann ich bei akuten Zahnschmerzen tun?', answer: ['Rufen Sie uns bitte direkt an (08707 266) — wir versuchen, Ihnen kurzfristig zu helfen. Außerhalb unserer Sprechzeiten finden Sie den zahnärztlichen Notdienst online.'] },
    { question: 'Welche Versicherungen akzeptieren Sie?', answer: ['Wir behandeln gesetzlich und privat Versicherte sowie Selbstzahler. Bitte bringen Sie zum ersten Termin Ihre Versichertenkarte mit.'] },
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
      brandName: 'Zahnarztpraxis',
      brandSuffix: 'Adolf',
      legalName: 'Zahnarztpraxis Johannes Adolf',
      region: 'Adlkofen',
      tagline:
        'Ihre Zahnarztpraxis in Adlkofen — in dritter Generation. Moderne Zahnmedizin von der Vorsorge bis zur Implantologie, ein herzliches Team und Termine, die Sie bequem online buchen.',
      phoneDisplay: '08707 266',
      phoneHref: '+498707266',
      email: 'landpraxis-adolf@gmx.de',
      addressStreet: 'Hauptstraße 26',
      addressCity: '84166 Adlkofen',
      oeffnungszeiten: [
        { tag: 'Montag', zeit: '08:00 – 12:00 · 14:00 – 18:00' },
        { tag: 'Dienstag', zeit: '08:00 – 12:00 · 14:00 – 18:00' },
        { tag: 'Mittwoch', zeit: '08:00 – 12:00' },
        { tag: 'Donnerstag', zeit: '08:00 – 12:00 · 14:00 – 18:00' },
        { tag: 'Freitag', zeit: '08:00 – 12:00' },
        { tag: 'Samstag & Sonntag', zeit: 'geschlossen' },
      ],
      heroBadge: 'Zahnarztpraxis in Adlkofen · in dritter Generation',
      heroHeadingLine1: 'Willkommen',
      heroHeadingPrefix: 'in der ',
      heroHeadingAccent: 'Praxis Adolf',
      heroLead: '',
      heroStats: [
        { value: '3.', label: 'Generation in Adlkofen' },
        { value: '< 24 h', label: 'online buchbar' },
        { value: 'amalgamfrei', label: 'in der Füllungstherapie' },
      ],
      marquee: [
        { word: 'Zahnerhalt' },
        { word: 'Zahnersatz' },
        { word: 'Implantologie' },
        { word: 'Kieferorthopädie' },
        { word: 'Zahnästhetik' },
        { word: 'Kinderbehandlung' },
        { word: 'Prophylaxe' },
      ],
      welcomeHeading: 'Herzlich willkommen',
      welcomeText:
        'Sehr geehrte Patientin, sehr geehrter Patient,\n\nwir freuen uns, Sie auf unserer Webseite begrüßen zu dürfen und heißen Sie herzlich willkommen. Auf den folgenden Seiten möchten wir unsere Praxis und unsere Leistungen vorstellen.\n\nMittelpunkt der Behandlung ist der Patient als Mensch, sodass wir zu jeder Zeit ein Maximum an umfassender Aufklärung und individueller Behandlung bieten. Schöne und gesunde Zähne sind für jeden Menschen wichtig, deshalb ist es unsere Aufgabe, dass Sie beschwerde- und schmerzfrei sind und sich rundum wohlfühlen. Es erwartet Sie bei uns eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge.\n\nUm Ihren Zahnarzttermin so einfach wie nur möglich zu gestalten, bemühen wir uns um kurze Wartezeiten. Durch eine strukturierte Terminvergabe und eine Optimierung der Behandlungsabläufe beansprucht Ihr Besuch in unserer Praxis lediglich einen Bruchteil Ihrer wertvollen Zeit.',
      welcomeSignature: 'Ihr Johannes Adolf',
      teamHeadingPrefix: 'Ihr Zahnarzt in ',
      teamHeadingAccent: 'Adlkofen.',
      teamIntro:
        'Mittelpunkt der Behandlung ist der Mensch. Es erwartet Sie eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge — in familiärer Atmosphäre und mit kurzen Wartezeiten.',
      teamMembersTitle: 'Unser Praxisteam',
      teamMembersRole: 'Zahnmedizinische Fachangestellte',
      teamMembersText:
        'Damit Sie sich bei uns rundum wohlfühlen, bildet sich unser Praxisteam kontinuierlich weiter, um Ihnen modernste Behandlungsmethoden anbieten zu können. Wir freuen uns, Sie herzlich in Empfang zu nehmen.',
      teamMembers: [{ name: 'Stefanie Simmeth' }, { name: 'Simone Hölzl' }, { name: 'Sabine Ostner' }],
      stats: [
        { count: 3, suffix: '.', label: 'Generation' },
        { count: 6, suffix: '', label: 'Leistungsbereiche' },
        { count: 24, suffix: ' h', label: 'online buchbar' },
      ],
      careerHeadingPrefix: 'Werde Teil ',
      careerHeadingAccent: 'unseres Teams.',
      careerText:
        'Wir suchen Menschen, die mit Herz und Sorgfalt arbeiten. Bei uns erwarten dich ein eingespieltes, freundliches Team, moderne Ausstattung und ein familiäres Praxisumfeld.',
      buchungIntro:
        'Buchen Sie Ihren Termin bequem online — wählen Sie eine Wunschzeit und bestätigen Sie per E-Mail. Bitte geben Sie keine sensiblen Gesundheitsdetails an; die Terminart genügt. Bei akuten Zahnschmerzen rufen Sie uns bitte direkt an: 08707 266.',
    },
  })
  payload.logger.info('✓ Einstellungen befüllt')
}
