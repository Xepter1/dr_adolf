# Draft Website — Architektur & Umbau-Leitfaden

Ein **wiederverwendbarer Website-Draft** auf Next.js 15 + Payload 3 + SQLite.

Die enthaltene Zimmerei (**„AIGNER Holzbau"**) ist die **Referenz**: eine vollständige,
funktionierende, hübsche Beispielseite. Für ein neues Projekt wird diese Referenz
**umgebaut** (z. B. _„bau das auf eine Arztpraxis um"_) — ohne die Architektur neu
zu erfinden. Dieses Dokument ist die Landkarte dafür.

> **Wichtigstes Prinzip:** Inhalt lebt in **Daten** (Settings-Global + Collections +
> `seed.ts`), nicht im Code. Der Code rendert nur. Je konsequenter ein Umbau über die
> Daten läuft, desto sauberer das Ergebnis.

---

## Stack

| Baustein | Version | Zweck |
|---|---|---|
| Next.js (App Router) | 15.4 | Frontend + Routing |
| React (Server Components) | 19.1 | UI |
| Payload CMS | 3.85 | Headless CMS + Admin-Panel (`/admin`) |
| SQLite (`@payloadcms/db-sqlite`) | — | Datenbank: **eine Datei** (`content.db`) |
| Form Builder Plugin | 3.85 | Kontaktformular, im Admin pflegbar |
| TypeScript (strict) | 5.7 | Typsicherheit |

Frontend-Seiten sind RSC und lesen via Payload **Local API** direkt (kein HTTP-Umweg).
Fonts sind lokal gehostet (`public/fonts` + `next/font/local`) → **DSGVO-konform**.

---

## ⭐ Umbau-Workflow — „bau das auf <Branche> um"

Reihenfolge einhalten, dann bricht nichts:

1. **Identität & Inhalt im Seed** — `src/seed/seed.ts`
   Demo-Inhalte umschreiben (Projekte → z. B. Behandlungen, Leistungen, Stimmen,
   Stellen, FAQ), die `IMAGES`-Map, die `Settings`-Werte (Markenname, Kontakt, Hero,
   Kennzahlen, Karriere), das Kontaktformular und die Admin-E-Mail.
   → Der Seed ist die **kanonische Inhaltsquelle**.

2. **Bilder** — `public/projekte/`
   Referenzbilder durch die echten ersetzen (gleiche Dateinamen behalten _oder_
   `IMAGES` + `imgPath` in `seed.ts` anpassen).

3. **Datenmodell (nur wenn nötig)** — `src/collections/*.ts`, `src/globals/Settings.ts`
   Braucht die Branche andere Inhaltstypen (z. B. „Ärzte/Team", „Sprechzeiten"
   statt „Projekte")? Felder/Collections anpassen/umbenennen/ergänzen.
   **Danach ZWINGEND:** siehe [Invarianten](#-invarianten--was-den-umbau-nicht-brechen-darf).

4. **Frontend-Abschnitte** — `src/components/sections/*.tsx` + `src/app/(frontend)/page.tsx`
   Datengetriebene Abschnitte laufen meist mit neuen Inhalten einfach weiter.
   **Fest verdrahtete** Abschnitte mit Zimmerei-Texten/SVGs umschreiben oder entfernen
   (siehe Abschnitts-Landkarte unten). In `page.tsx` Abschnitte ein-/ausbauen.

5. **SEO & Code-Identität**
   `src/app/(frontend)/layout.tsx` (Meta-Title/Description/OpenGraph),
   `src/app/(frontend)/projekt/[slug]/page.tsx` (OG-Title),
   ENV `SITE_NAME` (Admin-Titel + Mail-Absender).

6. **Rechtsseiten** — `src/app/(frontend)/impressum/`, `…/datenschutz/`
   Fiktive Daten durch echte ersetzen und rechtlich prüfen lassen.

7. **Zurücksetzen & prüfen**
   ```bash
   npm run reset && npm run dev    # frische DB + Seed, Seite auf :3000
   npm run build                   # muss grün sein
   ```

---

## Wo liegt welcher Inhalt? (die Landkarte)

### Inhalt in Daten (hier zuerst ändern)
| Quelle | Inhalt |
|---|---|
| `src/globals/Settings.ts` | Branding, Kontakt, Hero-Texte, Kennzahlen, Karriere — als Feld-`defaultValue` (Referenz) und im Admin pflegbar |
| `src/collections/Projekte.ts` | Referenzprojekte (Bento-Kacheln, Detailseiten, Vorher/Nachher) |
| `src/collections/Leistungen.ts` | Leistungs-Kacheln (+ Icon-Auswahl) |
| `src/collections/Testimonials.ts` · `Jobs.ts` · `Faqs.ts` | Stimmen / Stellen / FAQ |
| `src/collections/Media.ts` · `Users.ts` | Uploads / Admin-Benutzer |
| `src/seed/seed.ts` | **Befüllt all das** mit der Referenz — die zentrale Inhaltsdatei für einen Umbau |

### Abschnitts-Landkarte (Startseite → Komponente)
`src/app/(frontend)/page.tsx` ist der schlanke Orchestrator. Jeder Abschnitt ist isoliert:

| Komponente (`src/components/sections/`) | Quelle | Typ |
|---|---|---|
| `Hero.tsx` | Settings | datengetrieben |
| `Marquee.tsx` | Settings (`marquee`) | datengetrieben |
| `Projects.tsx` | Collection `projekte` | datengetrieben |
| `Services.tsx` | Collection `leistungen` | datengetrieben |
| `Stats.tsx` | Settings (`stats`) | datengetrieben |
| `Testimonials.tsx` | Collection `testimonials` | datengetrieben |
| `Career.tsx` | Settings + `jobs` | datengetrieben |
| `Faq.tsx` | Collection `faqs` | datengetrieben |
| `Contact.tsx` | Settings + Formular | datengetrieben |
| `BeforeAfter.tsx` | — | **fest verdrahtet** (Zimmerei) |
| `WhyWood.tsx` | — | **fest verdrahtet** (Zimmerei) |
| `Process.tsx` | — | **fest verdrahtet** (Zimmerei) |
| `About.tsx` | Settings + fester Text | **teils fest** (Signatur „Martin Aigner" etc.) |

Die clientseitige Interaktivität (Scroll-Reveal, Zähler, Vorher/Nachher-Slider,
Theme-Umschalter, Lightbox) bündelt `src/components/SiteScripts.tsx`.

---

## ⚠️ Invarianten — was den Umbau NICHT brechen darf

- **Datenmodell geändert? → Typen + Migration nachziehen.**
  Nach jeder Änderung an `collections/*` oder `globals/Settings.ts`:
  ```bash
  npm run generate:types        # payload-types.ts neu (sonst bricht der Build)
  npm run migrate:create        # nur für Produktion nötig; committen
  ```
  Im **Dev** pusht Payload das Schema automatisch (`push: true`). In **Produktion**
  laufen committete Migrationen (`start:prod` = `payload migrate && next start`).
  **Migrationsdateien nicht von Hand editieren.**

- **Settings-`defaultValue` geändert?** Diese spiegeln sich in der initialen Migration
  (`src/migrations/…_initial`) als Spalten-Defaults. Nach Änderung Migration neu erzeugen
  (oder lokal einfach `npm run reset`).

- **`export const dynamic = 'force-dynamic'` nicht entfernen** — die Frontend-Seiten
  lesen zur Laufzeit aus der DB. Ohne den Export versucht Next, zur Build-Zeit zu
  prerendern → DB-Fehler beim Build.

- **Fonts lokal lassen** (`public/fonts` + `next/font/local`). Keine Google Fonts /
  externen Requests einbauen (DSGVO).

- **Nicht committen / nicht ins Repo:** `.env`, `content.db*`, `media/` (alle in
  `.gitignore`). Quellbilder dagegen gehören nach `public/` und werden committet.

- **Genau eine DB: SQLite.** (Postgres-Wechsel wäre möglich, ist aber bewusst nicht
  aktiv — siehe README.)

- **Nach dem Umbau immer verifizieren:** `npm run build` grün **und**
  `npm run reset && npm run dev` rendert `/` und `/admin`.

---

## Marken-Touchpoints (Referenz „AIGNER/Holzbau" — beim Umbau ersetzen)

Die **Mechanik** ist bereits marken-neutral (Paketname, DB-Datei `content.db`,
Docker-Volumes, Admin-Titel via `SITE_NAME`, Mail-Defaults). Der **Referenz-Inhalt**
sagt noch „AIGNER/Holzbau" — bewusst, als Vorlage. Liegt in:

- `src/seed/seed.ts` — alle Demo-Inhalte, Admin-E-Mail, `CONTACT_TO`-Fallback
- `src/globals/Settings.ts` — Feld-`defaultValue`s
- `src/migrations/…_initial.*` — Spalten-Defaults (spiegeln Settings; regenerieren)
- `src/components/sections/About.tsx` · `BeforeAfter.tsx` · `WhyWood.tsx` · `Process.tsx`
- `src/app/(frontend)/layout.tsx` — SEO-Metadaten
- `src/app/(frontend)/projekt/[slug]/page.tsx` — OG-Title
- `src/app/(frontend)/impressum/page.tsx` · `datenschutz/page.tsx` — Rechtstexte (fiktiv)
- `README.md` — Projektbeschreibung

---

## Befehle

| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server (`:3000`), Schema-Push + Auto-Seed |
| `npm run reset` | Lokale DB + Medien löschen (sauberer Umbau-Start) |
| `npm run build` | Produktions-Build (Verifikations-Tor) |
| `npm run generate:types` | `payload-types.ts` neu erzeugen (nach Modell-Änderung) |
| `npm run migrate:create` | Migration aus Schema-Diff erzeugen (für Produktion) |
| `npm run start:prod` | Migrationen anwenden + Server starten |

Admin-Erstzugang (Referenz, per ENV `ADMIN_EMAIL`/`ADMIN_PASSWORD` überschreibbar):
`admin@aigner-holzbau.de` / `aigner-admin` — **vor echtem Einsatz ändern.**
