'use client'

import { useState } from 'react'
import '@/components/booking/booking.css'
import { generateKeypairPem } from '@/lib/crypto-client'

export function KeyTool() {
  const [publicPem, setPublicPem] = useState('')
  const [privatePem, setPrivatePem] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const generate = async () => {
    setBusy(true)
    try {
      const kp = await generateKeypairPem()
      setPublicPem(kp.publicPem)
      setPrivatePem(kp.privatePem)
      setCopied(false)
      setDownloaded(false)
    } finally {
      setBusy(false)
    }
  }

  const copyPublic = async () => {
    await navigator.clipboard.writeText(publicPem)
    setCopied(true)
  }

  const downloadPrivate = () => {
    const blob = new Blob([privatePem], { type: 'application/x-pem-file' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'praxis-privater-schluessel.pem'
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }

  return (
    <main className="bk-wrap">
      <div className="bk-head">
        <h1>Anamnese-Schlüssel erzeugen</h1>
        <p className="bk-intro">
          Einmalige Einrichtung. Erzeugt das Schlüsselpaar Ihrer Praxis <strong>direkt in diesem Browser</strong> – nichts
          wird an den Server gesendet. Mit dem öffentlichen Schlüssel werden Anamnesebögen verschlüsselt; nur mit dem
          privaten Schlüssel lassen sie sich wieder lesen.
        </p>
      </div>

      <section className="bk-panel">
        <button type="button" className="bk-submit" onClick={generate} disabled={busy}>
          {busy ? 'Erzeuge …' : publicPem ? 'Neues Schlüsselpaar erzeugen' : 'Schlüsselpaar erzeugen'}
        </button>

        {publicPem && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p className="bk-lock" style={{ marginBottom: 10 }}>
                ① Öffentlichen Schlüssel kopieren und im Admin unter <strong>Einstellungen → Buchung → „Anamnese:
                öffentlicher Schlüssel"</strong> einfügen.
              </p>
              <textarea className="bk-key" readOnly value={publicPem} rows={5} />
              <button type="button" className="bk-back" onClick={copyPublic} style={{ marginTop: 8 }}>
                {copied ? '✓ Kopiert' : 'Öffentlichen Schlüssel kopieren'}
              </button>
            </div>

            <div>
              <p className="bk-warn">
                ② Privaten Schlüssel herunterladen und <strong>sicher</strong> aufbewahren (Passwortmanager / verschlüsselter
                USB-Stick). Geht er verloren, sind bereits eingegangene Anamnesebögen unwiederbringlich verloren. Niemals
                per E-Mail versenden, niemals auf den Server laden.
              </p>
              <button type="button" className="bk-submit" onClick={downloadPrivate}>
                {downloaded ? '✓ Heruntergeladen' : 'Privaten Schlüssel herunterladen (.pem)'}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
