import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Einstellungen',
  admin: {
    group: 'Einstellungen',
    description: 'Branding, Kontaktdaten, Startseiten-Texte und Rechtstexte – an einer Stelle.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Allgemein & Kontakt',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'brandName', type: 'text', label: 'Markenname', defaultValue: 'Zahnarztpraxis', required: true },
                { name: 'brandSuffix', type: 'text', label: 'Marken-Zusatz', defaultValue: 'Adolf', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'legalName', type: 'text', label: 'Firmenname (rechtlich)', defaultValue: 'Zahnarztpraxis Johannes Adolf', required: true },
                { name: 'region', type: 'text', label: 'Region', defaultValue: 'Adlkofen', required: true },
              ],
            },
            { name: 'tagline', type: 'textarea', label: 'Footer-Slogan', defaultValue: 'Ihre Zahnarztpraxis in Adlkofen — in dritter Generation. Moderne Zahnmedizin von der Vorsorge bis zur Implantologie, ein herzliches Team und Termine, die Sie bequem online buchen.' },
            {
              type: 'row',
              fields: [
                { name: 'phoneDisplay', type: 'text', label: 'Telefon (Anzeige)', defaultValue: '08707 266', required: true },
                { name: 'phoneHref', type: 'text', label: 'Telefon (Wählformat)', defaultValue: '+498707266', required: true },
              ],
            },
            { name: 'email', type: 'text', label: 'E-Mail', defaultValue: 'landpraxis-adolf@gmx.de', required: true },
            {
              type: 'row',
              fields: [
                { name: 'addressStreet', type: 'text', label: 'Straße', defaultValue: 'Hauptstraße 26' },
                { name: 'addressCity', type: 'text', label: 'PLZ & Ort', defaultValue: '84166 Adlkofen' },
              ],
            },
            {
              name: 'oeffnungszeiten',
              type: 'array',
              label: 'Öffnungszeiten',
              labels: { singular: 'Zeile', plural: 'Zeilen' },
              admin: { description: 'Je Zeile ein Tag bzw. Tagesbereich und die zugehörige Zeit.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'tag', type: 'text', label: 'Tag(e)', required: true },
                    { name: 'zeit', type: 'text', label: 'Zeit', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Startseite (Hero)',
          fields: [
            { name: 'heroBadge', type: 'text', label: 'Badge', defaultValue: 'Zahnarztpraxis in Adlkofen · in dritter Generation' },
            {
              type: 'row',
              fields: [
                { name: 'heroHeadingLine1', type: 'text', label: 'Überschrift Zeile 1', defaultValue: 'Willkommen' },
                { name: 'heroHeadingPrefix', type: 'text', label: 'Zeile 2 (Anfang)', defaultValue: 'in der ' },
                { name: 'heroHeadingAccent', type: 'text', label: 'Zeile 2 (Akzent, kursiv)', defaultValue: 'Praxis Adolf' },
              ],
            },
            { name: 'heroLead', type: 'textarea', label: 'Hero-Text', defaultValue: 'Von der Vorsorge bis zur Implantologie — moderne Zahnmedizin in familiärer Atmosphäre. Der Mensch steht bei uns im Mittelpunkt.' },
            { name: 'welcomeHeading', type: 'text', label: 'Willkommen: Überschrift', defaultValue: 'Herzlich willkommen' },
            {
              name: 'welcomeText',
              type: 'textarea',
              label: 'Willkommen: Text',
              admin: { description: 'Begrüßungstext der Startseite. Mehrere Absätze durch eine Leerzeile trennen.' },
              defaultValue:
                'Sehr geehrte Patientin, sehr geehrter Patient,\n\nwir freuen uns, Sie auf unserer Webseite begrüßen zu dürfen und heißen Sie herzlich willkommen. Auf den folgenden Seiten möchten wir unsere Praxis und unsere Leistungen vorstellen.\n\nMittelpunkt der Behandlung ist der Patient als Mensch, sodass wir zu jeder Zeit ein Maximum an umfassender Aufklärung und individueller Behandlung bieten. Schöne und gesunde Zähne sind für jeden Menschen wichtig, deshalb ist es unsere Aufgabe, dass Sie beschwerde- und schmerzfrei sind und sich rundum wohlfühlen. Es erwartet Sie bei uns eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge.\n\nUm Ihren Zahnarzttermin so einfach wie nur möglich zu gestalten, bemühen wir uns um kurze Wartezeiten. Durch eine strukturierte Terminvergabe und eine Optimierung der Behandlungsabläufe beansprucht Ihr Besuch in unserer Praxis lediglich einen Bruchteil Ihrer wertvollen Zeit.',
            },
            { name: 'welcomeSignature', type: 'text', label: 'Willkommen: Unterschrift', defaultValue: 'Ihr Johannes Adolf' },
            {
              name: 'heroStats',
              type: 'array',
              label: 'Hero-Kennzahlen',
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', label: 'Wert', required: true },
                    { name: 'label', type: 'text', label: 'Bezeichnung', required: true },
                  ],
                },
              ],
            },
            {
              name: 'marquee',
              type: 'array',
              label: 'Lauftext-Begriffe',
              fields: [{ name: 'word', type: 'text', label: 'Begriff', required: true }],
            },
          ],
        },
        {
          label: 'Team',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'teamHeadingPrefix', type: 'text', label: 'Überschrift (Anfang)', defaultValue: 'Ihr Zahnarzt in ' },
                { name: 'teamHeadingAccent', type: 'text', label: 'Überschrift (Akzent, grün)', defaultValue: 'Adlkofen.' },
              ],
            },
            { name: 'teamIntro', type: 'textarea', label: 'Einleitungstext', defaultValue: 'Mittelpunkt der Behandlung ist der Mensch. Es erwartet Sie eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge — in familiärer Atmosphäre und mit kurzen Wartezeiten.' },
            {
              type: 'row',
              fields: [
                { name: 'teamMembersTitle', type: 'text', label: 'Team-Block: Überschrift', defaultValue: 'Unser Praxisteam' },
                { name: 'teamMembersRole', type: 'text', label: 'Team-Block: Untertitel', defaultValue: 'Zahnmedizinische Fachangestellte' },
              ],
            },
            { name: 'teamMembersText', type: 'textarea', label: 'Team-Block: Text', defaultValue: 'Damit Sie sich bei uns rundum wohlfühlen, bildet sich unser Praxisteam kontinuierlich weiter, um Ihnen modernste Behandlungsmethoden anbieten zu können. Wir freuen uns, Sie herzlich in Empfang zu nehmen.' },
            {
              name: 'teamMembers',
              type: 'array',
              label: 'Mitarbeiter',
              labels: { singular: 'Mitarbeiter:in', plural: 'Mitarbeiter' },
              admin: { description: 'Die Namen des Praxisteams – erscheinen unter dem Teamfoto.' },
              fields: [{ name: 'name', type: 'text', label: 'Name', required: true }],
            },
          ],
        },
        {
          label: 'Zahlen-Band',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Animierte Kennzahlen',
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'count', type: 'number', label: 'Zielzahl', required: true },
                    { name: 'suffix', type: 'text', label: 'Suffix', admin: { description: 'z. B. „+", „%", „ m³"' } },
                    { name: 'label', type: 'text', label: 'Bezeichnung', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Karriere',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'careerHeadingPrefix', type: 'text', label: 'Überschrift (Anfang)', defaultValue: 'Werde Teil ' },
                { name: 'careerHeadingAccent', type: 'text', label: 'Überschrift (Akzent)', defaultValue: 'unseres Teams.' },
              ],
            },
            { name: 'careerText', type: 'textarea', label: 'Text', defaultValue: 'Wir suchen Menschen, die mit Herz und Sorgfalt arbeiten. Bei uns erwarten dich ein eingespieltes, freundliches Team, moderne Ausstattung und ein familiäres Praxisumfeld.' },
          ],
        },
        {
          label: 'Buchung',
          fields: [
            { name: 'buchungIntro', type: 'textarea', label: 'Hinweis über dem Buchungstool', defaultValue: 'Buchen Sie Ihren Termin bequem online – wählen Sie eine Wunschzeit und bestätigen Sie per E-Mail. Bitte geben Sie keine sensiblen Gesundheitsdetails an; die Terminart genügt. Bei akuten Zahnschmerzen rufen Sie uns bitte direkt an: 08707 266.' },
            {
              name: 'anamnesePublicKey',
              type: 'textarea',
              label: 'Anamnese: öffentlicher Schlüssel (RSA, PEM/SPKI)',
              admin: {
                description:
                  'Öffentlicher Schlüssel der Praxis (Base64-SPKI). Nur damit werden Anamnesebögen verschlüsselt. Der PRIVATE Schlüssel gehört ausschließlich auf die Praxis-Geräte – niemals hier oder auf den Server.',
              },
            },
          ],
        },
      ],
    },
  ],
}
