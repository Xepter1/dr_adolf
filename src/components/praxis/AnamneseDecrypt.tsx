'use client'

import { useEffect, useState } from 'react'
import '@/components/booking/booking.css'
import { decryptAnamnese } from '@/lib/crypto-client'
import { ANAMNESE_LABELS } from '@/lib/anamnese'

export function AnamneseDecrypt() {
  const [privateKey, setPrivateKey] = useState('')
  const [keyName, setKeyName] = useState('')
  const [id, setId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Record<string, string> | null>(null)

  // Anamnese-ID aus der URL vorbelegen (?id=…).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('id')
    if (q) setId(q)
  }, [])

  const loadKey = (file?: File) => {
    if (!file) return
    file.text().then((t) => {
      setPrivateKey(t)
      setKeyName(file.name)
    })
  }

  const decrypt = async () => {
    setError(null)
    setResult(null)
    if (!privateKey) return setError('Bitte zuerst den privaten Schlüssel laden.')
    if (!id.trim()) return setError('Bitte eine Anamnese-ID angeben.')
    setBusy(true)
    try {
      const res = await fetch(`/api/anamnese/${id.trim()}?depth=0`, { credentials: 'include' })
      if (res.status === 401 || res.status === 403) {
        setError('Nicht autorisiert. Bitte zuerst im Admin (/admin) als Praxis einloggen.')
        return
      }
      if (!res.ok) {
        setError('Anamnesebogen nicht gefunden.')
        return
      }
      const doc = await res.json()
      if (!doc?.ciphertext || !doc?.encryptedKey || !doc?.iv) {
        setError('Dieser Eintrag enthält kein Chiffrat.')
        return
      }
      const answers = await decryptAnamnese(privateKey, { ciphertext: doc.ciphertext, encryptedKey: doc.encryptedKey, iv: doc.iv, algo: doc.algo || '' })
      setResult(answers)
    } catch {
      setError('Entschlüsselung fehlgeschlagen – passt der private Schlüssel zu diesem Bogen?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="bk-wrap">
      <div className="bk-head">
        <h1>Anamnesebogen entschlüsseln</h1>
        <p className="bk-intro">
          Nur für die Praxis. Der private Schlüssel verlässt diesen Browser nicht. Melden Sie sich vorab im{' '}
          <a href="/admin" target="_blank" rel="noreferrer">Admin</a> an, damit der verschlüsselte Bogen geladen werden darf.
        </p>
      </div>

      <section className="bk-panel">
        <div className="bk-field" style={{ marginBottom: 16 }}>
          <span>1 · Privater Schlüssel (.pem)</span>
          <input type="file" accept=".pem,.txt,text/plain" onChange={(e) => loadKey(e.target.files?.[0])} />
          {keyName && <small style={{ color: 'var(--bk-accent)' }}>✓ {keyName} geladen (bleibt lokal)</small>}
        </div>
        <div className="bk-field" style={{ marginBottom: 16 }}>
          <span>2 · Anamnese-ID</span>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="z. B. 3 (steht am Termin im Admin)" />
        </div>
        <button type="button" className="bk-submit" onClick={decrypt} disabled={busy}>
          {busy ? 'Entschlüssele …' : 'Entschlüsseln'}
        </button>

        {error && <p className="bk-error" style={{ marginTop: 16 }}>{error}</p>}

        {result && (
          <div className="bk-result">
            <h2>Anamnesebogen</h2>
            <dl>
              {Object.entries(result).map(([k, v]) => (
                <div key={k} className="bk-result-row">
                  <dt>{ANAMNESE_LABELS[k] ?? k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </main>
  )
}
