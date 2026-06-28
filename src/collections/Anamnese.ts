import type { Access, CollectionConfig } from 'payload'

const nurPraxis: Access = ({ req: { user } }) => Boolean(user)

/**
 * Online-Anamnesebogen für Neupatienten – Ende-zu-Ende verschlüsselt.
 *
 * Privacy by Design (Art. 25 DSGVO): Der Webserver hält NUR den öffentlichen
 * Schlüssel der Praxis. Der ausgefüllte Bogen wird mit einem zufälligen
 * AES-256-GCM-Schlüssel verschlüsselt, dieser wiederum mit dem Praxis-Public-Key
 * (RSA-OAEP) „gewrappt". Gespeichert wird ausschließlich Chiffrat. Den privaten
 * Schlüssel besitzt nur die Praxis → nur dort ist der Bogen lesbar. Selbst bei
 * Server-Kompromittierung fällt kein Klartext an.
 */
export const Anamnese: CollectionConfig = {
  slug: 'anamnese',
  labels: { singular: 'Anamnesebogen', plural: 'Anamnesebögen' },
  admin: {
    group: 'Praxis',
    useAsTitle: 'eingegangenAm',
    defaultColumns: ['eingegangenAm', 'algo'],
    description: 'Verschlüsselte Anamnesebögen. Inhalt nur mit dem Praxis-Schlüssel lesbar.',
  },
  access: { read: nurPraxis, create: nurPraxis, update: nurPraxis, delete: nurPraxis },
  fields: [
    { name: 'eingegangenAm', type: 'date', label: 'Eingegangen am', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    // Hybride Verschlüsselung: ciphertext = AES-GCM(Inhalt), encryptedKey = RSA-OAEP(AES-Key).
    { name: 'ciphertext', type: 'textarea', label: 'Chiffrat (Base64)', admin: { readOnly: true } },
    { name: 'encryptedKey', type: 'textarea', label: 'Verschlüsselter Schlüssel (Base64)', admin: { readOnly: true } },
    { name: 'iv', type: 'text', label: 'IV / Nonce (Base64)', admin: { readOnly: true } },
    { name: 'algo', type: 'text', label: 'Verfahren', defaultValue: 'RSA-OAEP-256 + AES-256-GCM', admin: { readOnly: true } },
  ],
}
