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
      defaultValue: 'stethoscope',
      options: [
        { label: 'Stethoskop (Allgemein)', value: 'stethoscope' },
        { label: 'Herz (Vorsorge)', value: 'heart' },
        { label: 'Schild (Impfung/Prävention)', value: 'shield' },
        { label: 'Kind (Kinderheilkunde)', value: 'child' },
        { label: 'Labor / Diagnostik', value: 'lab' },
        { label: 'Hausbesuch', value: 'housecall' },
      ],
    },
    // ---- Inhalte der Detailseite ----
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
      name: 'sortOrder',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    slugField('title'),
  ],
}
