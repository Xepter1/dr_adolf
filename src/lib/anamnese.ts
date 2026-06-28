/**
 * Fragenkatalog des Online-Anamnesebogens (Klartext-Labels – nicht sensibel).
 * Die Antworten werden im Browser verschlüsselt; nur die Praxis kann sie lesen.
 * Geteilt zwischen Buchungs-UI und dem Entschlüsselungs-Werkzeug.
 */

export type AnamneseFieldType = 'text' | 'textarea' | 'choice'

export interface AnamneseQuestion {
  id: string
  label: string
  type: AnamneseFieldType
  options?: string[]
  placeholder?: string
}

export const ANAMNESE_FRAGEN: AnamneseQuestion[] = [
  { id: 'groesse', label: 'Körpergröße (cm)', type: 'text', placeholder: 'z. B. 178' },
  { id: 'gewicht', label: 'Körpergewicht (kg)', type: 'text', placeholder: 'z. B. 74' },
  { id: 'beschwerden', label: 'Aktuelle Beschwerden / Grund des Besuchs', type: 'textarea' },
  { id: 'vorerkrankungen', label: 'Bekannte Vorerkrankungen', type: 'textarea' },
  { id: 'medikamente', label: 'Regelmäßig eingenommene Medikamente', type: 'textarea' },
  { id: 'allergien', label: 'Allergien / Unverträglichkeiten', type: 'textarea' },
  { id: 'operationen', label: 'Frühere Operationen', type: 'textarea' },
  { id: 'raucher', label: 'Rauchen Sie?', type: 'choice', options: ['Nein', 'Gelegentlich', 'Ja'] },
  { id: 'schwangerschaft', label: 'Besteht eine Schwangerschaft (möglich)?', type: 'choice', options: ['Nicht zutreffend', 'Nein', 'Ja'] },
  { id: 'hausarzt', label: 'Hausarzt (optional)', type: 'text' },
]

/** Map id → Label, um entschlüsselte Antworten beschriftet anzuzeigen. */
export const ANAMNESE_LABELS: Record<string, string> = Object.fromEntries(
  ANAMNESE_FRAGEN.map((q) => [q.id, q.label]),
)
