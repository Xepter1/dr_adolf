import type { CollectionConfig } from 'payload'
import { slugField } from '../lib/slug'

export const Leistungen: CollectionConfig = {
  slug: 'leistungen',
  labels: { singular: 'Leistung', plural: 'Leistungen' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'sortOrder'],
    description: 'Die Leistungskacheln in der Hero — jede mit eigener Detailseite unter /leistungen/<slug>.',
  },
  access: { read: () => true },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', label: 'Titel', required: true },
    { name: 'description', type: 'textarea', label: 'Kurzbeschreibung', required: true, admin: { description: 'Erscheint als Teaser (Kachel/Liste) und als Meta-Description der Detailseite.' } },
    {
      name: 'icon',
      type: 'select',
      label: 'Symbol',
      required: true,
      defaultValue: 'tooth',
      options: [
        { label: 'Zahn (Zahnerhalt)', value: 'tooth' },
        { label: 'Krone (Zahnersatz)', value: 'denture' },
        { label: 'Implantat (Implantologie)', value: 'implant' },
        { label: 'Zahnspange (Kieferorthopädie)', value: 'braces' },
        { label: 'Funkeln (Zahnästhetik)', value: 'sparkle' },
        { label: 'Lächelnder Zahn (Kinder)', value: 'child' },
      ],
    },
    // ---- Inhalte der Detailseite ----
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild (Detailseite, neben dem Text – optional)',
      admin: { description: 'Erscheint rechts neben dem Text im Inhaltsbereich (über „Das bieten wir"). Ohne Bild bleibt die Textspalte allein. Empfehlung: Hochformat, ca. 4:5.' },
    },
    { name: 'lead', type: 'textarea', label: 'Einleitung (Detailseite)', admin: { description: 'Ein bis zwei Sätze unter der Überschrift der Detailseite.' } },
    { name: 'intro', type: 'textarea', label: 'Fließtext (Detailseite)', admin: { description: 'Der Hauptabsatz: worum geht es bei dieser Leistung.' } },
    {
      name: 'leistungspunkte',
      type: 'array',
      label: 'Das bieten wir',
      labels: { singular: 'Punkt', plural: 'Punkte' },
      admin: { description: 'Stichpunkt-Liste der konkreten Leistungen.' },
      fields: [{ name: 'text', type: 'text', label: 'Punkt', required: true }],
    },
    {
      name: 'ablauf',
      type: 'array',
      label: 'So läuft es ab',
      labels: { singular: 'Schritt', plural: 'Schritte' },
      admin: { description: 'Optionale Schritte, die den Ablauf erklären.' },
      fields: [
        { name: 'titel', type: 'text', label: 'Schritt-Titel', required: true },
        { name: 'text', type: 'textarea', label: 'Beschreibung', required: true },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Häufige Fragen',
      labels: { singular: 'Frage', plural: 'Fragen' },
      fields: [
        { name: 'frage', type: 'text', label: 'Frage', required: true },
        { name: 'antwort', type: 'textarea', label: 'Antwort', required: true },
      ],
    },
    {
      name: 'unterleistungen',
      type: 'array',
      label: 'Unterleistungen (eigene Detailseiten)',
      labels: { singular: 'Unterleistung', plural: 'Unterleistungen' },
      admin: { description: 'Untergeordnete Leistungen mit eigener Seite unter /leistungen/<kategorie>/<slug> — erscheinen auch im Aufklapp-Menü der Navbar.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', label: 'Titel', required: true },
            { name: 'slug', type: 'text', label: 'Slug (URL-Teil)', required: true, admin: { description: 'z. B. „professionelle-zahnreinigung".' } },
          ],
        },
        { name: 'lead', type: 'textarea', label: 'Einleitung (kurz, optional)' },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Bild (neben dem Text – optional)',
          admin: { description: 'Erscheint rechts neben dem Fließtext (scrollt mit). Leer = Bild der Kategorie bzw. nur Text. Empfehlung: Hochformat, ca. 4:5.' },
        },
        {
          name: 'abschnitte',
          type: 'array',
          label: 'Abschnitte',
          labels: { singular: 'Abschnitt', plural: 'Abschnitte' },
          admin: { description: 'Fließtext-Abschnitte; optionale Zwischenüberschrift je Abschnitt.' },
          fields: [
            { name: 'titel', type: 'text', label: 'Zwischenüberschrift (optional)' },
            { name: 'text', type: 'textarea', label: 'Text', required: true },
          ],
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    slugField('title'),
  ],
}
