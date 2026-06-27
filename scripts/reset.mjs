// ---------------------------------------------------------------------------
// Setzt den LOKALEN Draft-Zustand zurück: löscht die SQLite-Datenbank und alle
// hochgeladenen Medien. Danach erzeugt `npm run dev` Schema + Seed automatisch
// neu. Genau das macht einen Umbau ("bau das auf eine Arztpraxis um") sauber:
// Inhalte/Seed ändern  ->  `npm run reset`  ->  `npm run dev`  ->  frische Seite.
//
// Achtung: Das löscht ALLE redaktionell gepflegten Inhalte der lokalen DB.
// Im Produktivbetrieb (Docker-Volume) NICHT verwenden.
// ---------------------------------------------------------------------------
import { rm } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

// .env best-effort lesen, damit DATABASE_URI / MEDIA_DIR respektiert werden
// (falls die DB mal umbenannt wurde). Keine Abhängigkeit nötig.
const env = {}
try {
  for (const line of readFileSync(path.join(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  /* keine .env – Defaults verwenden */
}

const dbUri = env.DATABASE_URI || 'file:./content.db'
const dbFile = dbUri.startsWith('file:') ? dbUri.slice(5) : 'content.db'
const dbPath = path.resolve(root, dbFile)
const mediaDir = path.resolve(root, env.MEDIA_DIR || 'media')

const targets = [dbPath, `${dbPath}-shm`, `${dbPath}-wal`, `${dbPath}-journal`, mediaDir]

console.log('Setze lokalen Draft-Zustand zurück …')
let removed = 0
for (const t of targets) {
  if (existsSync(t)) {
    await rm(t, { recursive: true, force: true })
    console.log('  gelöscht:', path.relative(root, t) || t)
    removed++
  }
}

console.log(
  removed
    ? `\n✓ Zurückgesetzt (${removed} Einträge entfernt).\n  Nächster Schritt:  npm run dev   (legt Schema + Seed-Inhalte neu an)`
    : '\nNichts zu löschen – der Zustand war bereits sauber.\n  Nächster Schritt:  npm run dev',
)
