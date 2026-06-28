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
                { name: 'brandName', type: 'text', label: 'Markenname', defaultValue: 'AIGNER', required: true },
                { name: 'brandSuffix', type: 'text', label: 'Marken-Zusatz', defaultValue: 'Holzbau', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'legalName', type: 'text', label: 'Firmenname (rechtlich)', defaultValue: 'AIGNER Holzbau GmbH', required: true },
                { name: 'region', type: 'text', label: 'Region', defaultValue: 'Niederbayern', required: true },
              ],
            },
            { name: 'tagline', type: 'textarea', label: 'Footer-Slogan', defaultValue: 'Meisterhafter Holzbau aus Niederbayern. Dachstühle, Holzhäuser und Sanierungen — ehrlich, präzise, aus einer Hand.' },
            {
              type: 'row',
              fields: [
                { name: 'phoneDisplay', type: 'text', label: 'Telefon (Anzeige)', defaultValue: '0871 123 45 67', required: true },
                { name: 'phoneHref', type: 'text', label: 'Telefon (Wählformat)', defaultValue: '+498711234567', required: true },
              ],
            },
            { name: 'email', type: 'text', label: 'E-Mail', defaultValue: 'servus@aigner-holzbau.de', required: true },
            {
              type: 'row',
              fields: [
                { name: 'addressStreet', type: 'text', label: 'Straße', defaultValue: 'Sägewerkstraße 4' },
                { name: 'addressCity', type: 'text', label: 'PLZ & Ort', defaultValue: '84028 Landshut' },
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
            { name: 'heroBadge', type: 'text', label: 'Badge', defaultValue: 'Meisterbetrieb seit 1989 · Niederbayern' },
            {
              type: 'row',
              fields: [
                { name: 'heroHeadingLine1', type: 'text', label: 'Überschrift Zeile 1', defaultValue: 'Willkommen' },
                { name: 'heroHeadingPrefix', type: 'text', label: 'Zeile 2 (Anfang)', defaultValue: 'in der ' },
                { name: 'heroHeadingAccent', type: 'text', label: 'Zeile 2 (Akzent, kursiv)', defaultValue: 'Praxis' },
              ],
            },
            { name: 'heroLead', type: 'textarea', label: 'Hero-Text', defaultValue: 'Vom Dachstuhl bis zum schlüsselfertigen Holzhaus — wir verbinden traditionelles Zimmererhandwerk mit moderner Abbundtechnik. Ehrlich, präzise, aus einer Hand.' },
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
                { name: 'careerHeadingPrefix', type: 'text', label: 'Überschrift (Anfang)', defaultValue: 'Bau mit an dem, ' },
                { name: 'careerHeadingAccent', type: 'text', label: 'Überschrift (Akzent)', defaultValue: 'was bleibt.' },
              ],
            },
            { name: 'careerText', type: 'textarea', label: 'Text', defaultValue: 'Wir suchen Hände, die anpacken, und Köpfe, die mitdenken. Bei uns gibt’s keine Massenabfertigung — sondern echtes Handwerk, faire Bezahlung und ein Team, das zusammenhält.' },
          ],
        },
        {
          label: 'Buchung',
          fields: [
            { name: 'buchungIntro', type: 'textarea', label: 'Hinweis über dem Buchungstool', defaultValue: 'Buchen Sie Ihren Termin online – wählen Sie Ihren Arzt und eine Wunschzeit und bestätigen Sie per E-Mail. Bitte geben Sie keine sensiblen Gesundheitsdetails an; die Terminart genügt.' },
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
