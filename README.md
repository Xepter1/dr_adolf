# Draft Website (Next.js + Payload CMS + SQLite)

Ein **wiederverwendbarer Website-Draft**. Die enthaltene Zimmerei („AIGNER Holzbau")
ist die **Referenz** – eine vollständige, funktionierende Beispielseite. Für ein neues
Projekt wird diese Referenz umgebaut (z. B. „bau das auf eine Arztpraxis um").
Inhalte sind vollständig über das Admin-Panel bzw. den Seed pflegbar.

> **Umbau-Leitfaden:** Wie man den Draft sauber auf eine andere Branche umbaut
> (Landkarte, Reihenfolge, Invarianten), steht in **[CLAUDE.md](CLAUDE.md)**.

## Stack

| Baustein | Version | Zweck |
|---|---|---|
| **Next.js** | 15.4 (App Router) | Frontend + Routing |
| **React** | 19.1 | UI (Server Components) |
| **Payload CMS** | 3.85 | Headless CMS + Admin-Panel |
| **SQLite** | via `@payloadcms/db-sqlite` | Datenbank (eine Datei) |
| **Form Builder** | `@payloadcms/plugin-form-builder` | Kontaktformular, im Admin pflegbar |
| **TypeScript** | 5.7 (strict) | Typsicherheit |

Frontend-Seiten sind React Server Components und lesen Daten direkt über die
Payload **Local API** (kein HTTP-Umweg). Schriften (Fraunces, Hanken Grotesk)
sind lokal gehostet (`next/font/local`) – DSGVO-konform, keine externen Requests.

## Schnellstart (lokal)

```bash
npm install
cp .env.example .env          # PAYLOAD_SECRET setzen: openssl rand -hex 32
npm run dev
```

- Website: <http://localhost:3000>
- Admin-Panel: <http://localhost:3000/admin>

Beim **ersten Start** werden automatisch Demo-Inhalte angelegt (Projekte,
Leistungen, Stimmen, Stellen, FAQ, Einstellungen, Kontaktformular) und ein
Admin-Benutzer: `admin@aigner-holzbau.de` / `aigner-admin` (bitte ändern; per
`ADMIN_EMAIL`/`ADMIN_PASSWORD` überschreibbar).

## Inhalte pflegen

Alles im Admin unter „Inhalte" und „Einstellungen":

- **Projekte** – Referenzen. Reihenfolge steuert die Bento-Kacheln der Startseite
  und Vor/Zurück auf den Detailseiten. Optionaler Vorher/Nachher-Vergleich.
- **Leistungen, Stimmen, Stellen, FAQ** – die jeweiligen Startseiten-Abschnitte.
- **Einstellungen** (Global) – Branding, Kontaktdaten, Hero-Texte, Zahlen-Band,
  Karriere-Text.
- **Formulare → Einsendungen** – Kontaktanfragen laufen hier ein.

Die Rechtsseiten (Impressum/Datenschutz) sind statische Seiten unter
`src/app/(frontend)/impressum` bzw. `datenschutz` – die Daten sind fiktiv und vor
echtem Einsatz zu ersetzen und rechtlich zu prüfen.

## E-Mail (Formular-Benachrichtigungen)

Ohne SMTP werden Mails nur in die Konsole geloggt (Dev). Für echten Versand in
`.env` setzen: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME`.

## Skripte

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run reset` | Lokale DB + Medien löschen (sauberer Umbau-Start) |
| `npm run build` | Produktions-Build |
| `npm run start:prod` | Migrationen anwenden + Server starten |
| `npm run generate:types` | Payload-Typen neu generieren |
| `npm run generate:importmap` | Admin-Import-Map neu generieren |
| `npm run migrate:create` | Neue Migration aus dem Schema erzeugen |

> Nach Änderungen an Collections/Globals: `generate:types` (und ggf.
> `generate:importmap`) ausführen, im Dev wird das Schema automatisch gepusht.
> Für die Produktion eine Migration committen (`migrate:create`).

## Deployment (Docker / Portainer)

```bash
export PAYLOAD_SECRET=$(openssl rand -hex 32)
docker compose up -d --build
```

- SQLite-Datei (`content.db`) liegt auf Volume `draft_data`, Uploads auf `draft_media`.
- `start:prod` wendet beim Containerstart automatisch Migrationen an.
- Hinter Domain/Proxy zusätzlich `PUBLIC_URL` setzen (für Admin-Login & SEO).

## Aus dem Draft eine echte Seite machen

Kurzfassung (Details + Invarianten in **[CLAUDE.md](CLAUDE.md)**):

1. Inhalte im Seed (`src/seed/seed.ts`) + `Settings` umschreiben, eigene Bilder
   nach `public/projekte/` legen.
2. Datenmodell nur bei Bedarf anpassen (`src/collections/*`) – danach
   `npm run generate:types` (+ `migrate:create` für Produktion).
3. Fest verdrahtete Abschnitte (`src/components/sections/`) und SEO/Rechtsseiten
   an die neue Branche anpassen.
4. `npm run reset && npm run dev` → frisch seeden und prüfen, dann `npm run build`.
5. Pro Deployment ein **eigenes** `PAYLOAD_SECRET` erzeugen.

> **Datenbank:** Dieser Draft nutzt **SQLite** (eine Datei, ideal für kleine bis
> mittlere Seiten, self-hosted EU/DSGVO). Bei viel Schreiblast wäre ein Wechsel auf
> Postgres möglich (`@payloadcms/db-postgres` + `DATABASE_URI`), ist hier aber
> bewusst nicht aktiv.
