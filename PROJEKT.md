# Praxis am Stadtpark — Projektdoku (Stand der Webapplikation)

Vollständige Übergabe-Doku. Wer hiermit arbeitet, soll die App verstehen, ohne
den Code komplett lesen zu müssen. Ergänzt — und in Detailfragen überschrieben —
durch `CLAUDE.md` (Original-Leitfaden des wiederverwendbaren Drafts).

> **Was ist das?** Ursprünglich ein wiederverwendbarer Website-Draft (Referenz:
> Zimmerei „AIGNER Holzbau"). Wurde umgebaut zu einer **finalen Arztpraxis-Website**
> „**Praxis am Stadtpark**" (fiktive Muster-Gemeinschaftspraxis) mit einem
> **vollständigen, DSGVO-bewussten Online-Terminbuchungssystem**. Es ist KEIN
> Template mehr (z. B. wurde der Farbwelt-Umschalter entfernt).

---

## 1. Stack

| Baustein | Version | Zweck |
|---|---|---|
| Next.js (App Router) | 15.4 | Frontend + Routing + Route Handler |
| React (Server Components) | 19.1 | UI |
| Payload CMS | 3.85 | Headless CMS + Admin (`/admin`) + Local API |
| SQLite (`@payloadcms/db-sqlite`) | — | DB: eine Datei `content.db` |
| `@payloadcms/email-nodemailer` | 3.85 | SMTP-Mailversand (ohne SMTP → Konsole) |
| TypeScript (strict) | 5.7 | Typsicherheit |

Frontend-Seiten sind RSC und lesen via Payload **Local API** (`getPayloadClient()`)
direkt aus der DB. Fonts lokal: **Fraunces** (Serif/Display) + **Hanken Grotesk**
(Sans) über `next/font/local` → DSGVO-konform, keine externen Requests.

---

## 2. Leitprinzipien

- **Inhalt lebt in Daten:** `src/seed/seed.ts` ist die kanonische Inhaltsquelle;
  alles ist im Admin pflegbar (Settings-Global + Collections). Code rendert nur.
- **Patientendaten sind Art.-9-Daten:** Buchungs-/Gesundheitsdaten sind nicht
  öffentlich, Anamnese ist Ende-zu-Ende verschlüsselt, Mails sind neutral,
  self-hosted, keine US-Dienste. (Maßstab: DSK-Positionspapier 16.06.2025.)

---

## 3. Verzeichnis-Landkarte

```
src/
  collections/      Aerzte, Termine, Anamnese, Leistungen(+ Slug & Detailinhalt),
                    Testimonials, Jobs, Faqs, Media, Users, Projekte(Legacy, ungenutzt)
  globals/Settings.ts
  lib/              booking, time, slots, tokens, ics, email, anamnese,
                    crypto-client, payload, format, slug
  seed/seed.ts      kanonischer Inhalt + Admin-User + Demo-Ärzte
  components/
    sections/       Hero, Team, Testimonials, Career, Faq, Contact,
                    Services + Stats + Marquee (ungenutzt, Reste)
    booking/        BookingFlow, SlotGrid, ManageTermin, booking.css
    praxis/         KeyTool, AnamneseDecrypt
    SiteChrome, Brand, ServiceIcon, SiteScripts, HelixVideo
  app/(frontend)/
    page.tsx        Startseite (Orchestrator)
    layout.tsx      SEO/Meta + Fonts + SiteScripts
    styles.css      globales Stylesheet (CSS-Variablen-Theme)
    leistungen/[slug]/  Detailseite je Leistung (Hero, Punkte, Ablauf, FAQ, CTA)
    termin/         page.tsx (Buchung), actions.ts (createBooking),
                    bestaetigen/page.tsx (Double-Opt-In), ics/route.ts,
                    verwalten/page.tsx + manage-actions.ts
    praxis/         schluessel/page.tsx, anamnese/page.tsx (noindex)
    cron/route.ts   Wartungs-Endpunkt (Erinnerungen/Aufräumen/Löschfristen)
    impressum/, datenschutz/, projekt/[slug]/(Legacy), sitemap.ts, robots.ts
  app/(payload)/    Admin-Panel + Payload-API (Plugin-generiert)
public/
  hero/praxis.jpg   Hero-Hintergrundbild (optimiert)
  media/helix.*     DNA-Helix-Video (webm+mp4) + Poster
  fonts/, favicon.svg, projekte/(Legacy-Bilder)
```

---

## 4. Das Buchungssystem (Kernfeature)

### 4.1 Datenmodell (Collections)

- **`aerzte`** (öffentlich lesbar): `name`, `titel`, `fachrichtung`, `foto`,
  `vita`, `aktiv`, `slotDauerMin`, `sprechzeiten[]` (`wochentag` 1–7, `von`/`bis`
  „HH:MM"), `abwesenheiten[]` (`von`/`bis` Datum), `sortOrder`, `slug`.
  Liefert Profilkarten (Team) **und** die Verfügbarkeit für die Slot-Engine.
- **`termine`** (NICHT öffentlich; `access` = nur eingeloggte Praxis): `arzt`,
  `terminart` (Kategorie-Enum), `versicherung` (gesetzlich/privat/selbstzahler),
  `start`, `ende`, `patientName`, `patientGeburtsdatum`, `patientEmail`,
  `patientTelefon`, `istNeupatient`, `anamnese` (Relation), `status`
  (ausstehend/bestaetigt/abgesagt/wahrgenommen/nicht_erschienen),
  `erinnerungErwuenscht`, `erinnerungGesendet`, `loeschdatum`, `notizPraxis`,
  `verifyToken`/`verifyExpiresAt` (Double-Opt-In), `manageToken` (Magic-Link).
- **`anamnese`** (nur Praxis): nur **Chiffrat** — `ciphertext`, `encryptedKey`,
  `iv`, `algo`, `eingegangenAm`. Server kann den Inhalt nie lesen.

Öffentliche Buchung schreibt **serverseitig** über die Local API
(`overrideAccess` standardmäßig true) — die REST-API der `termine`/`anamnese`
bleibt für Patienten gesperrt.

Geteilte Konstanten: `src/lib/booking.ts` → `TERMINARTEN`, `VERSICHERUNG`,
`WOCHENTAGE`, `TERMIN_STATUS`, `validateUhrzeit`.

### 4.2 Buchungsfluss (UI)

Seite `/termin` (`termin/page.tsx`, Server) berechnet je aktiver Ärzt:in die
freien Slots und rendert `components/booking/BookingFlow.tsx` (Client). 4 Schritte:

1. **Ärzt:in** wählen (Karten, „Nächster Termin"-Hinweis)
2. **Anliegen**: Neupatient? (Ja/Nein) · Versicherung · Terminart
3. **Termin**: Wochen-Raster `SlotGrid.tsx` (Tage = Spalten, Zeiten = Zeilen,
   Wochen-Navigation, 5 Tage/Seite)
4. **Ihre Daten**: Name, Geburtsdatum (Tag/Monat/Jahr), E-Mail, Telefon,
   bei Neupatient:in optional der **verschlüsselte Anamnesebogen**, Einwilligung

Absenden → Server-Action `termin/actions.ts: createBooking()`:
validiert, prüft den Slot erneut gegen die Engine, legt ggf. das
Anamnese-Chiffrat an, erstellt den `termin` (Status `ausstehend`) mit
`verifyToken`/`manageToken`, sendet die **Double-Opt-In-Mail**.

### 4.3 Slot-Engine

`src/lib/slots.ts: computeSlots(arzt, belegt, opts)` — reine Funktion. Bildet
freie Slots aus Sprechzeiten − Abwesenheiten − belegten Terminen, Horizont 28 Tage,
Mindest-Vorlauf 120 min. Option `includeEmpty: true` liefert auch leere Tage
(für das Spalten-Raster). Zeitzonen-sicher über `src/lib/time.ts`
(**Europe/Berlin**, DST-fest, ohne externe Lib).

### 4.4 Double-Opt-In, ICS, E-Mail

- `/termin/bestaetigen?token=<verifyToken>` (`bestaetigen/page.tsx`): verifiziert,
  setzt `status=bestaetigt`, entwertet den verifyToken, setzt `loeschdatum`
  (Start + 14 Tage), sendet die **neutrale** Bestätigungsmail mit ICS- und
  Verwalten-Link. Idempotent.
- `/termin/ics?token=<manageToken>` (`ics/route.ts`): liefert `text/calendar`.
  Bewusst **neutral** (kein Fach/Grund). Generator: `src/lib/ics.ts`.
- Mail-Vorlagen: `src/lib/email.ts` — `sendDoiEmail`, `sendConfirmationEmail`,
  `sendReminderEmail`, `sendCancellationEmail`. **Neutrale Betreffzeilen.**
  Ohne SMTP loggt Payload die Mails in die Konsole (Dev).

### 4.5 Online-Anamnese (Ende-zu-Ende verschlüsselt)

- Krypto im Browser: `src/lib/crypto-client.ts` — hybrid **RSA-OAEP-3072 +
  AES-256-GCM** (Web Crypto). `generateKeypairPem`, `encryptAnamnese`,
  `decryptAnamnese`. Fragenkatalog: `src/lib/anamnese.ts`.
- **Einrichtung (einmalig):** `/praxis/schluessel` (`KeyTool`) erzeugt das
  Schlüsselpaar lokal → **öffentlichen** Schlüssel in **Admin → Einstellungen →
  Buchung → „Anamnese: öffentlicher Schlüssel"** einfügen; **privaten** Schlüssel
  sicher verwahren (verlässt nie den Praxis-Rechner). Erst wenn ein Public Key
  hinterlegt ist, erscheint der Anamnese-Block in der Buchung.
- **Lesen:** `/praxis/anamnese` (`AnamneseDecrypt`) — Praxis lädt den privaten
  Schlüssel lokal, gibt die Anamnese-ID ein, holt das Chiffrat per Login
  (`/api/anamnese/:id`, Cookie-Auth) und entschlüsselt im Browser. Beide
  `/praxis/*`-Seiten sind `noindex`.

### 4.6 Erinnerungen, Aufräumen, Aufbewahrung (Cron)

`/cron?secret=<CRON_SECRET>` (GET/POST, `cron/route.ts`) — regelmäßig von außen
aufrufen (z. B. stündlich). Drei Aufgaben:
1. abgelaufene unbestätigte Anfragen (`ausstehend` + `verifyExpiresAt` < jetzt)
   löschen (Slot frei, keine PII halten),
2. Erinnerungen senden (`bestaetigt` + `erinnerungErwuenscht` + Start < 24 h,
   idempotent via `erinnerungGesendet`),
3. **Aufbewahrung**: Termine mit erreichtem `loeschdatum` samt verknüpfter
   Anamnese löschen.

### 4.7 Umbuchen / Stornieren

`/termin/verwalten?token=<manageToken>` (`verwalten/page.tsx` + `ManageTermin.tsx`,
Actions `manage-actions.ts`): stornieren oder verschieben (gleiches Wochen-Raster,
erneuter Slot-Check), jeweils mit Folge-Mail. Der manageToken steckt in jeder
Bestätigungs-/Erinnerungs-Mail.

---

## 5. Frontend / Startseite

`page.tsx` ist der schlanke Orchestrator. Reihenfolge der Sektionen:
**Hero → Team → Testimonials → Career → Faq → Contact.**

> Die früheren Sektionen **„Unsere Leistungen" (`Services`)** und **Zahlen-Band
> (`Stats`)** wurden entfernt: Die Leistungen leben jetzt in der Hero (Kacheln →
> Detailseiten), das Hochzähl-Band ist raus. `Services.tsx`/`Stats.tsx` liegen
> ungenutzt im Repo (Reste, ggf. später entfernen). **Die ganze Website ist
> entgendert** (generisches Maskulinum; „(m/w/d)" in Stellenanzeigen bleibt).

- **Hero** (`sections/Hero.tsx`): **3-spaltig, asymmetrisch** — links die
  **DNA-Helix** (`HelixVideo`), Mitte die **Glas-Kachel-Matrix** (2×3 aus
  `leistungen`, je `ServiceIcon`), rechts **rechtsbündig** die große Fraunces-Headline
  („Willkommen in der *Praxis*", aus `settings.heroHeading*`) + CTAs. Die H1 steht im
  DOM zuerst (SEO/Screenreader) und wird nur per Grid-Spalte nach rechts gesetzt; alle
  drei sind via `grid-row:1` in einer Reihe und vertikal mittig zueinander. Der
  Hero-Inhalt darf bis `min(1700px,97vw)` breit werden (nicht die globalen 1240px),
  damit die drei Spalten Luft haben. **Jede Kachel ist ein Link** auf die jeweilige
  Detailseite `/leistungen/<slug>`. Die `<section>` trägt `id="leistungen"` (Anker für
  Navbar/Footer). Kein Lead-Absatz mehr. Vollflächiges, leicht unscharfes
  Hintergrundbild (`/hero/praxis.jpg`, Blur+Tint im CSS, Gradient-Fallback),
  **Overlay-Header** (transparent → fest beim Scrollen via `.scrolled`), Scroll-Hinweis.
  **Glas-Kacheln ohne `backdrop-filter`:** bewusst nur halbtransparenter Verlauf statt
  Live-Blur (der erzeugte sporadische Paint-Naht-Bugs; das Hintergrundbild ist ohnehin
  schon unscharf). **Helix-Stacking-Trick:** `.hero-bg2` liegt auf `z-index:-1` (statt
  eigenem Stacking-Context auf `.hero-inner`), damit das Video per `mix-blend-mode:
  screen` mit dem Bild blenden kann (Schwarz wird durchsichtig). Die Helix wird
  **≤1024px ausgeblendet** (Tablet/Handy).
- **Leistungs-Detailseiten** (`app/(frontend)/leistungen/[slug]/page.tsx`): je Leistung
  eine volle Seite — dunkelgrüner Hero (Icon, Breadcrumb, Lead, CTAs), Fließtext +
  „Das bieten wir"-Checkliste, „So läuft es ab"-Schritte, aufklappbares FAQ
  (`<details>`), Vorherige/Nächste-Navigation und Buchungs-CTA. Inhalte kommen aus den
  neuen `Leistungen`-Feldern (`lead`, `intro`, `leistungspunkte[]`, `ablauf[]`, `faq[]`)
  + Slug. `force-dynamic`, eigene Metadata. Nutzt `HeaderSub`/`FooterSub` wie die
  Projekt-Seite.
- **Navbar** (`SiteChrome.tsx → HeaderHome`): „Leistungen ▾" öffnet beim Hover (und per
  `:focus-within`) ein **Dropdown** mit allen 6 Kategorien — **gleiche Links wie die
  Kacheln**. Eigener Punkt **„Öffnungszeiten"** → Anker `#oeffnungszeiten` (Block in der
  Contact-Sektion). Im mobilen Vollbild-Menü ist das Dropdown ausgeblendet (die Kacheln
  sind dort die Liste). `HeaderHome`/`FooterHome` bekommen dafür die `leistungen`-Liste
  als Prop.
- **DNA-Helix** (`components/HelixVideo.tsx`, Client): gelooptes Video
  (`/media/helix.{webm,mp4}` + Poster), `mix-blend-mode: screen` blendet das reine
  Schwarz weg. **Nicht** an Scroll gekoppelt (GPU, ruckelfrei). Client-Komponente,
  weil React `muted` im SSR nicht als Attribut setzt → Effekt erzwingt `muted=true`
  + `play()`. Poster = statische Helix als Fallback. Wird im Hero genutzt;
  wiederverwendbar (z. B. für eine eigene Sektion).
- **Team/Testimonials/Career/Faq** sind datengetrieben (Collections bzw. Settings).
  **Team** (`sections/Team.tsx`): Headline „Ärzte, die *zuhören.*"; Karten mit
  Initialen-Avataren (Grün-Verlauf, `data-av`-Varianten) — ein hochgeladenes `foto`
  ersetzt automatisch die Initialen. **Contact** zeigt Kontaktdaten +
  **Öffnungszeiten** (`settings.oeffnungszeiten`, Block mit `id="oeffnungszeiten"`) +
  „Termin buchen"-CTA — **kein Kontaktformular** (für eine Praxis unüblich).
- **Theme/Palette:** CSS-Variablen in `styles.css` (`:root`), medizinisches Grün/
  Teal (`--wood: #0f6e56` = Akzent). Es gibt noch ungenutzte `data-theme`-Varianten
  (schiefer/kalk) im CSS; der Umschalter wurde entfernt → faktisch nur Grün.
- **Interaktivität** (Header-Scroll, Scroll-Reveal `.reveal`→`.in`, Zähler-Animation,
  Lightbox) bündelt `components/SiteScripts.tsx`.

---

## 6. Settings-Global & Inhalt

`globals/Settings.ts` (Tabs: Allgemein & Kontakt · Hero · Zahlen-Band · Karriere ·
Buchung). Wichtige Felder: Marke (`brandName`/`brandSuffix`), Kontakt, Adresse,
**`oeffnungszeiten[]`** (`tag`/`zeit`), Hero-Texte, `marquee[]`, `stats[]`,
Karriere-Texte, `buchungIntro`, **`anamnesePublicKey`**.

> Frontend-seitig **nicht mehr gerendert** (Felder/Tabs bleiben für später bestehen):
> `stats[]` (Zahlen-Band entfernt), `heroLead`/`heroStats`/`marquee` (Hero zeigt nur
> noch Headline + CTAs + Kacheln).

`seed/seed.ts` befüllt beim ersten Start idempotent: Admin-User, Leistungen,
3 Demo-Ärzte (mit Sprechzeiten), Testimonials, Jobs, FAQ und alle
Settings-Werte. **Guard:** Settings werden nur befüllt, wenn `heroStats` noch leer
ist → Admin-Eingaben werden nie überschrieben. Inhaltsänderungen also entweder im
Seed (dann `npm run reset`) oder direkt im Admin.

---

## 7. Befehle, ENV, Admin

| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server (`:3000`), Schema-Push + Auto-Seed |
| `npm run devsafe` | **Nach einem `npm run build` benutzen** (löscht `.next`) |
| `npm run reset` | Lokale DB + Medien löschen → frischer Seed |
| `npm run build` | Produktions-Build (Verifikations-Tor) |
| `npm run generate:types` | `payload-types.ts` neu (nach Modell-Änderung) |
| `npm run migrate:create` | Migration aus Schema-Diff (für Produktion) |
| `npm run start:prod` | `payload migrate` + `next start` |

**ENV** (`.env`, siehe `.env.example`): `PAYLOAD_SECRET` (Pflicht), `SITE_NAME`,
`DATABASE_URI`, `PUBLIC_URL`, `MEDIA_DIR`, `SMTP_*` (sonst Mail→Konsole),
`ADMIN_EMAIL`/`ADMIN_PASSWORD`, **`CRON_SECRET`** (für `/cron`). `CONTACT_TO` ist
seit Entfernung des Kontaktformulars ungenutzt.

**Admin-Erstzugang** (per ENV überschreibbar): `admin@praxis-am-stadtpark.de` /
`praxis-admin` — vor echtem Einsatz ändern. Gebuchte Termine + Anamnesebögen liegen
im Admin unter Gruppe **„Praxis"**.

---

## 8. Invarianten / Stolpersteine

- **Nach Änderung an `collections/*` oder `globals/Settings.ts`:**
  `npm run generate:types` (sonst bricht der Build). Für Produktion zusätzlich
  `npm run migrate:create` + committen.
- **`export const dynamic = 'force-dynamic'`** auf DB-lesenden Seiten nicht
  entfernen (sonst Prerender-/DB-Fehler beim Build).
- **Nach `npm run build` immer `npm run devsafe`** statt `dev`, sonst Dev-Render-
  Fehler („missing required error components").
- **Fonts lokal lassen**, keine externen Requests (DSGVO).
- **Nicht committen:** `.env`, `content.db*`, `media/` (Uploads). **Doch** committen:
  Quellbilder/-videos unter `public/` (`hero/`, `media/`).
- **Termine/Anamnese nie öffentlich lesbar machen** — Buchung läuft serverseitig
  über die Local API.
- **Anamnese:** privater Schlüssel gehört NUR auf Praxis-Geräte, niemals in Settings
  oder auf den Server.
- **Helix-Video:** muss reines Schwarz als Hintergrund haben (für `mix-blend: screen`)
  und bleibt ein kurzer, nahtloser Loop; Client-Komponente wegen Autoplay/`muted`.
- **DSFA / Rechtstexte:** Impressum & Datenschutz sind fiktive Mustertexte (mit
  Hinweis); vor Echteinsatz rechtlich prüfen lassen (Art. 9, DSFA für die
  Online-Anamnese).

---

## 9. Offene Punkte / Platzhalter

- **Echte Praxis-Daten** statt „Musterstadt"/Demo (Name, Adresse, Telefon, Ärzte,
  Öffnungszeiten) — im Admin bzw. Seed.
- **Arzt-Fotos** (Team zeigt sonst stilvolle Initialen-Avatare). Foto-Upload je Arzt
  ist vorhanden — echte Porträts im Admin hochladen, sie ersetzen die Initialen.
- **Produktions-Migration:** die committete `src/migrations/…_initial` spiegelt
  noch ein älteres Schema → vor Deploy `npm run migrate:create` neu erzeugen
  (u. a. wegen der neuen `Leistungen`-Felder + Slug).
- **Compliance-Paket** als Doku: DSFA, AVV-Vorlagen, vollständige, geprüfte
  Datenschutzerklärung, Löschkonzept.
- **Ungenutzte Reste:** `Projekte`-Collection + `/projekt/[slug]` (Draft, leer) sowie
  `sections/Services.tsx` + `sections/Stats.tsx` (durch die Hero-Kacheln bzw. den
  Wegfall des Zahlen-Bands überflüssig) — bei Bedarf repurposen oder entfernen.
- Optional: Doppelbuchungs-Schutz auf DB-Ebene härten (aktuell Slot-Recheck).
