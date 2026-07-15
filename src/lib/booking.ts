/**
 * Geteilte Quelle für das Buchungssystem – Collections, Slot-Engine und das
 * Frontend lesen dieselben Listen, damit nichts auseinanderläuft (DRY).
 */

/** Konkrete Select-Option (kompatibel mit Payloads `options`-Feld). */
export interface SelectOption {
  label: string
  value: string
}

/**
 * Terminarten bewusst als geschlossene Kategorien (nicht als Freitext-„Grund").
 * Datenschutz: Die DSK lässt für die Terminverwaltung nur die „Art des Termins"
 * zu, kein Symptom-/Diagnose-Freitext. Diese Liste ist die einzige erlaubte
 * Auswahl bei der Buchung.
 */
export const TERMINARTEN: SelectOption[] = [
  { label: 'Kontrolle / Vorsorge', value: 'kontrolle' },
  { label: 'Professionelle Zahnreinigung', value: 'pzr' },
  { label: 'Akute Zahnschmerzen', value: 'akut' },
  { label: 'Beratung Zahnersatz / Implantat', value: 'beratung_ersatz' },
  { label: 'Kieferorthopädie-Beratung', value: 'kfo' },
  { label: 'Ästhetik / Bleaching-Beratung', value: 'aesthetik' },
  { label: 'Erstgespräch (Neupatient)', value: 'erstgespraech' },
]

/** Versicherungsart bei der Buchung. */
export const VERSICHERUNG: SelectOption[] = [
  { label: 'Gesetzlich versichert', value: 'gesetzlich' },
  { label: 'Privat versichert', value: 'privat' },
  { label: 'Selbstzahlend', value: 'selbstzahler' },
]

/** ISO-Wochentag: Montag = 1 … Sonntag = 7 (passt zur Slot-Engine). */
export const WOCHENTAGE: SelectOption[] = [
  { label: 'Montag', value: '1' },
  { label: 'Dienstag', value: '2' },
  { label: 'Mittwoch', value: '3' },
  { label: 'Donnerstag', value: '4' },
  { label: 'Freitag', value: '5' },
  { label: 'Samstag', value: '6' },
  { label: 'Sonntag', value: '7' },
]

/** Lebenszyklus eines Termins. */
export const TERMIN_STATUS: SelectOption[] = [
  { label: 'Ausstehend (E-Mail unbestätigt)', value: 'ausstehend' },
  { label: 'Bestätigt', value: 'bestaetigt' },
  { label: 'Abgesagt', value: 'abgesagt' },
  { label: 'Wahrgenommen', value: 'wahrgenommen' },
  { label: 'Nicht erschienen', value: 'nicht_erschienen' },
]

/** Validierung für „HH:MM"-Uhrzeiten in den Sprechzeiten. */
export const validateUhrzeit = (value: unknown): true | string =>
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
    ? true
    : 'Bitte als Uhrzeit im Format HH:MM angeben (z. B. 09:30).'
