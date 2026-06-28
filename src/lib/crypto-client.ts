/**
 * Browser-Krypto für den Anamnesebogen (Web Crypto API, keine externe Lib).
 *
 * Hybride Verschlüsselung: ein zufälliger AES-256-GCM-Schlüssel verschlüsselt
 * den Bogen, der Praxis-RSA-Public-Key (RSA-OAEP, SHA-256) „wrappt" diesen
 * Schlüssel. Gespeichert wird nur Chiffrat. Entschlüsseln kann ausschließlich,
 * wer den privaten Schlüssel besitzt – also nur die Praxis.
 *
 * Läuft im Browser (Patient = verschlüsseln, Praxis = entschlüsseln).
 */

export interface CipherBundle {
  ciphertext: string
  encryptedKey: string
  iv: string
  algo: string
}

const ALGO = 'RSA-OAEP-3072-SHA256 + AES-256-GCM'

function abToB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function b64ToU8(b64: string): Uint8Array {
  const clean = b64.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '')
  const bin = atob(clean)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
  return u8
}

/** Base64 in PEM-Blöcke (64 Zeichen pro Zeile) verpacken. */
export function toPem(b64: string, label: string): string {
  const lines = b64.match(/.{1,64}/g)?.join('\n') ?? b64
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`
}

/** Einmalig in der Praxis: RSA-Schlüsselpaar erzeugen (als PEM zurück). */
export async function generateKeypairPem(): Promise<{ publicPem: string; privatePem: string }> {
  const kp = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 3072, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  )
  const spki = await crypto.subtle.exportKey('spki', kp.publicKey)
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', kp.privateKey)
  return {
    publicPem: toPem(abToB64(spki), 'PUBLIC KEY'),
    privatePem: toPem(abToB64(pkcs8), 'PRIVATE KEY'),
  }
}

/** Patient-Browser: Anamnese-Antworten mit dem Praxis-Public-Key verschlüsseln. */
export async function encryptAnamnese(publicKey: string, answers: Record<string, string>): Promise<CipherBundle> {
  const pub = await crypto.subtle.importKey('spki', b64ToU8(publicKey), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
  const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = new TextEncoder().encode(JSON.stringify(answers))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, data)
  const rawAes = await crypto.subtle.exportKey('raw', aes)
  const wrapped = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, rawAes)
  return { ciphertext: abToB64(ct), encryptedKey: abToB64(wrapped), iv: abToB64(iv), algo: ALGO }
}

/** Praxis-Browser: Chiffrat mit dem privaten Schlüssel entschlüsseln. */
export async function decryptAnamnese(privateKey: string, bundle: CipherBundle): Promise<Record<string, string>> {
  const priv = await crypto.subtle.importKey('pkcs8', b64ToU8(privateKey), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt'])
  const rawAes = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, b64ToU8(bundle.encryptedKey))
  const aes = await crypto.subtle.importKey('raw', rawAes, { name: 'AES-GCM' }, false, ['decrypt'])
  const data = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToU8(bundle.iv) }, aes, b64ToU8(bundle.ciphertext))
  return JSON.parse(new TextDecoder().decode(data))
}
