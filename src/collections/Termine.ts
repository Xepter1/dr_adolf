import type { Access, CollectionConfig } from 'payload'
import { TERMINARTEN, TERMIN_STATUS, VERSICHERUNG } from '../lib/booking'

/** Nur eingeloggte Praxis-Benutzer dürfen Termine sehen/ändern. */
const nurPraxis: Access = ({ req: { user } }) => Boolean(user)

/**
 * Gebuchte Termine. Enthält personenbezogene Gesundheitsdaten (Art. 9 DSGVO) –
 * daher KEIN öffentlicher Zugriff. Die öffentliche Buchung legt Termine
 * serverseitig über die Local API (overrideAccess) an; lesen/verwalten kann sie
 * nur die Praxis im Admin-Dashboard.
 *
 * Datensparsamkeit: bewusst nur Name + eine Kontaktmöglichkeit + Terminart
 * (geschlossene Kategorie, kein Freitext-Grund).
 */
export const Termine: CollectionConfig = {
  slug: 'termine',
  labels: { singular: 'Termin', plural: 'Termine' },
  admin: {
    group: 'Praxis',
    useAsTitle: 'patientName',
    defaultColumns: ['start', 'arzt', 'terminart', 'status', 'istNeupatient'],
    description: 'Gebuchte Termine. Enthält Patientendaten – streng vertraulich.',
  },
  access: { read: nurPraxis, create: nurPraxis, update: nurPraxis, delete: nurPraxis },
  defaultSort: '-start',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'arzt', type: 'relationship', relationTo: 'aerzte', label: 'Arzt', required: true },
        {
          name: 'terminart',
          type: 'select',
          label: 'Terminart',
          required: true,
          options: TERMINARTEN,
          admin: { description: 'Geschlossene Kategorie – kein Freitext (Datenschutz).' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'start', type: 'date', label: 'Beginn', required: true, admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
        { name: 'ende', type: 'date', label: 'Ende', admin: { date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm' } } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Patient',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'patientName', type: 'text', label: 'Name', required: true },
            { name: 'patientGeburtsdatum', type: 'date', label: 'Geburtsdatum', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'patientEmail', type: 'email', label: 'E-Mail', required: true },
            { name: 'patientTelefon', type: 'text', label: 'Telefon (optional)' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'versicherung', type: 'select', label: 'Versicherung', options: VERSICHERUNG },
            { name: 'istNeupatient', type: 'checkbox', label: 'Neupatient' },
          ],
        },
      ],
    },
    {
      name: 'anamnese',
      type: 'relationship',
      relationTo: 'anamnese',
      label: 'Anamnesebogen (verschlüsselt)',
      admin: { description: 'Nur bei Neupatienten, sofern ausgefüllt.' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'ausstehend',
      options: TERMIN_STATUS,
      admin: { position: 'sidebar' },
    },
    {
      name: 'erinnerungErwuenscht',
      type: 'checkbox',
      label: 'Erinnerung erwünscht',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Nur mit ausdrücklicher Einwilligung bei der Buchung (Art. 9 DSGVO).' },
    },
    {
      name: 'erinnerungGesendet',
      type: 'checkbox',
      label: 'Erinnerung gesendet',
      defaultValue: false,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'loeschdatum',
      type: 'date',
      label: 'Automatisch löschen ab',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' }, description: 'Terminkalender ist keine Behandlungsdoku – kurz nach dem Termin löschen.' },
    },
    { name: 'notizPraxis', type: 'textarea', label: 'Interne Notiz', admin: { description: 'Nur praxisintern – nicht vom Patienten ausgefüllt.' } },
    // Tokens für Double-Opt-In-Bestätigung und Magic-Link (Umbuchen/Stornieren).
    // Versteckt: rein technisch, serverseitig gesetzt.
    { name: 'verifyToken', type: 'text', admin: { hidden: true } },
    { name: 'verifyExpiresAt', type: 'date', admin: { hidden: true } },
    { name: 'manageToken', type: 'text', admin: { hidden: true } },
  ],
}
