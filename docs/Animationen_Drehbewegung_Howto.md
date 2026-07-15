# Der „schwebendes Objekt"-Hero-Effekt (Zahn / DNA-Helix)

Wie das frei schwebende, leuchtende Objekt im Hero funktioniert — der rotierende **Zahn**
(vorher die **DNA-Helix**). Diese Datei erklärt das Prinzip, die Code-Bausteine und die
Bild-/Video-Pipeline, sodass du **oder eine nächste KI** den Effekt verstehen, warten und
mit einem beliebigen anderen Objekt wiederverwenden kann.

---

## 1. Die Kernidee in einem Satz

> Ein **helles Objekt auf reinem Schwarz** wird als Video eingebunden und per CSS
> `mix-blend-mode: screen` mit dem Hintergrund verrechnet — dabei wird **Schwarz
> unsichtbar** und nur das helle Objekt bleibt sichtbar und „schwebt".

Kein Greenscreen, kein Alphakanal, kein Freistellen. Nur ein Blend-Modus + ein sauber
schwarzer Hintergrund im Quellvideo.

---

## 2. Warum das funktioniert (kurz & mathematisch)

`mix-blend-mode: screen` verrechnet jeden Farbkanal von Vordergrund (`a`) und
Hintergrund (`b`) so:

```
ergebnis = 1 − (1 − a) · (1 − b)
```

Daraus folgt das ganze Geheimnis:

| Pixel im Video | a-Wert | Ergebnis | Wirkung |
|---|---|---|---|
| reines Schwarz | 0 | `= b` (der Hintergrund) | **transparent** |
| reines Weiß | 1 | `= 1` (weiß) | bleibt voll sichtbar |
| helle Grautöne | hoch | fast unverändert hell | leuchten „additiv" |

Der schwarze Hintergrund des Videos „verschwindet" also rechnerisch, das helle Objekt
bleibt. Wichtig: Screen ist **additiv** — dunkle Objektbereiche kann man so **nicht**
deckend darstellen. Für ein leuchtend-weißes Objekt (Zahn, Helix) ist das perfekt; für
ein Objekt mit echten dunklen/farbtreuen Schatten bräuchte man stattdessen einen echten
**Alphakanal** (siehe Abschnitt 7).

---

## 3. Die Code-Bausteine

### a) Die Video-Komponente — `src/components/ToothVideo.tsx`

Eine kleine **Client-Komponente** (`'use client'`), weil React `muted` beim
Server-Rendering nicht als HTML-Attribut setzt — Autoplay funktioniert aber nur bei
stummen Videos. Der `useEffect` erzwingt darum `muted = true` und ruft `play()` auf.

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function ToothVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])
  return (
    <video ref={ref} className={className}
           autoPlay loop muted playsInline preload="auto"
           poster="/media/zahn-poster.jpg" aria-hidden="true">
      <source src="/media/zahn.webm" type="video/webm" />
      <source src="/media/zahn.mp4" type="video/mp4" />
    </video>
  )
}
```

- `loop` → Endlosschleife, `playsInline` → kein Vollbild auf iOS, `aria-hidden` →
  Screenreader ignorieren es (rein dekorativ).
- `poster` → statisches Standbild als Fallback, bis das Video läuft.
- **webm zuerst, mp4 als Fallback** (Reihenfolge = Priorität des Browsers).

### b) Das CSS — `src/app/(frontend)/styles.css`

```css
.hero-tooth { grid-column: 1; grid-row: 1; display: grid; place-items: center; }
.hero-tooth-video {
  width: 100%;
  max-width: 430px;            /* Objektgröße im Hero */
  display: block;
  mix-blend-mode: screen;      /* ← HIER passiert der Trick */
  filter: saturate(1.05) drop-shadow(0 24px 60px rgba(0,0,0,.35));
}
@media (max-width: 1024px) { .hero-tooth { display: none; } }  /* Tablet/Handy aus */
```

### c) Das Layout & der Stacking-Trick — `src/components/sections/Hero.tsx`

```
<section class="hero">
  <div class="hero-bg2">      ← Hintergrund: Bild + grüner Tint,  z-index: -1
     <div class="hero-img" /> <div class="hero-tint" />
  </div>
  <div class="wrap hero-inner">
     <div class="hero-tooth"><ToothVideo .../></div>   ← das schwebende Video
     <div class="hero-content">…Headline…</div>
     <aside class="hero-tiles">…Leistungs-Kacheln…</aside>
  </div>
</section>
```

```css
.hero-bg2 { position: absolute; inset: 0; z-index: -1; }
```

**Warum `z-index: -1`?** Damit `mix-blend-mode: screen` den Hintergrund „sehen" kann,
müssen Video **und** Hintergrund im **selben Stacking-Context** liegen. Indem `.hero-bg2`
auf `z-index: -1` sitzt (statt dem Inhalt einen eigenen Stacking-Context zu geben),
blendet das Video gegen das Hintergrundbild — das Schwarz wird gegen Bild + Tint
durchsichtig. Das ist der subtilste Teil des Effekts (siehe Stolpersteine, Abschnitt 6).

---

## 4. Die Asset-Pipeline (Rohvideo → Web-Assets)

Aus einem Rohvideo (Objekt auf Schwarz) werden **drei** Dateien in `public/media/`:
`*.webm`, `*.mp4` und ein `*-poster.jpg`. Genau diese Befehle wurden für den Zahn benutzt
(`ffmpeg` nötig):

```bash
SRC="zahn_video.mp4"                         # Rohvideo
CRUSH="curves=all='0/0 0.045/0 1/1'"         # Schwarz-Crush (s. u.)

# 1) WEBM (VP9) – modern, klein
ffmpeg -y -i "$SRC" -an -vf "scale=800:-2,$CRUSH" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -pix_fmt yuv420p public/media/zahn.webm

# 2) MP4 (H.264) – Fallback für alle Browser
ffmpeg -y -i "$SRC" -an -vf "scale=800:-2,$CRUSH" \
  -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart public/media/zahn.mp4

# 3) Poster (ein repräsentatives Standbild, hier bei Sekunde 3)
ffmpeg -y -ss 3.0 -i "$SRC" -frames:v 1 -vf "scale=800:-2,$CRUSH" -q:v 3 public/media/zahn-poster.jpg
```

**Was die Flags bedeuten:**

- `-an` → Tonspur entfernen (Hero-Video braucht keinen Ton).
- `scale=800:-2` → Breite auf 800 px herunterskalieren, Höhe automatisch (`-2` = auf
  gerade Zahl runden, Pflicht für `yuv420p`). 800 px reichen, weil das Objekt im Hero nur
  ~430 px breit dargestellt wird → kleine, schnell ladende Dateien.
- `curves=all='0/0 0.045/0 1/1'` → **der Schwarz-Crush**: Alles dunkler als ~4,5 %
  Helligkeit (≈ 11/255) wird auf **reines Schwarz** gezogen, der Rest bleibt linear.
  Nötig, weil Videokompression Schwarz leicht „anhebt" (Rauschen) — sonst entsteht unter
  `screen` ein milchiger Schleier statt echter Transparenz. Das helle Objekt liegt weit
  über der Schwelle und bleibt unangetastet.
- `crf` → Qualität/Größe (kleiner = besser/größer). VP9 ~34, H.264 ~24 sind ein guter
  Hero-Kompromiss.
- `-movflags +faststart` → MP4 startet sofort beim Streamen (Metadaten nach vorne).

**Prüfen:** Poster ansehen — Objekt hell, Hintergrund **wirklich** schwarz? Dann blendet
es im Hero sauber.

---

## 5. Anforderungen an das Quellvideo

- **Hintergrund: reines Schwarz** (#000000). Das ist die einzige harte Voraussetzung.
- **Helles Objekt** mit gutem Kontrast zum Schwarz (weiß/leuchtend ist ideal).
- **Nahtloser Loop**: erstes Bild = letztes Bild (sonst sichtbarer „Sprung").
- **Konstante Bewegung** (gleichmäßige Drehung) wirkt am ruhigsten — Ease-in/-out oder
  ein „Halt" in der Mitte fällt als Ruckeln auf. (Das lässt sich nicht per CSS, nur per
  Neu-Rendern beheben.)
- **Kurz & leicht**: wenige Sekunden, ein paar hundert KB.

---

## 6. Stolpersteine (häufige Fehler)

1. **Kein reines Schwarz** → milchiger Schleier statt Transparenz. → Schwarz-Crush
   (`curves`) anwenden, Poster gegenprüfen.
2. **Eigener Stacking-Context um das Video** → `mix-blend-mode` blendet dann gegen den
   Wrapper statt gegen den Seitenhintergrund → schwarzer Kasten / falsche Mischung.
   Auslöser sind `transform`, `filter`, `opacity < 1` oder `position` + `z-index` auf
   einem Elternelement. Deshalb sitzt hier der **Hintergrund** auf `z-index: -1`, nicht
   der Inhalt in einem eigenen Kontext.
3. **Autoplay startet nicht** → Video muss `muted` + `playsInline` sein; React setzt
   `muted` im SSR nicht zuverlässig → die Client-Komponente erzwingt `v.muted = true`
   und `play()`.
4. **`backdrop-filter` auf darüberliegenden Elementen** (z. B. Glas-Kacheln) kann
   sporadische Paint-Nähte erzeugen — in diesem Projekt bewusst vermieden.
5. **Loop ruckelt** → Quellvideo ist nicht nahtlos (erstes ≠ letztes Bild). Im Code nicht
   lösbar; sauber neu rendern oder den besten Loop-Punkt schneiden.

---

## 7. Variante mit echtem Alphakanal (wenn Screen nicht reicht)

Braucht das Objekt **deckende dunkle Bereiche oder farbtreue Schatten**, ist Screen das
falsche Werkzeug. Dann mit echter Transparenz arbeiten:

- **WebM/VP9 mit `-pix_fmt yuva420p`** (Alpha) oder **HEVC mit Alpha** (Safari),
- im CSS **kein** `mix-blend-mode` mehr nötig,
- Quellvideo braucht dann aber einen echten Alphakanal (z. B. aus einem 3D-Render).

Für leuchtende Objekte (Zahn, Helix) ist `screen` jedoch einfacher, kleiner und robuster.

---

## 8. Rezept: ein anderes Objekt einbauen

1. Video besorgen: **Objekt hell, auf reinem Schwarz, nahtloser Loop, gleichmäßige
   Bewegung**.
2. Die 3 `ffmpeg`-Befehle aus Abschnitt 4 laufen lassen → `public/media/<name>.webm`,
   `.mp4`, `-poster.jpg`.
3. In der Video-Komponente (`ToothVideo.tsx` oder eine Kopie) die `<source>`- und
   `poster`-Pfade auf die neuen Dateien zeigen lassen.
4. Sicherstellen, dass die CSS-Klasse `mix-blend-mode: screen`, eine `max-width` und das
   Ausblenden ≤ 1024 px hat.
5. Im Browser prüfen: Video läuft (`paused: false`), Hintergrund blendet durch (kein
   schwarzer Kasten), keine Konsolenfehler.

---

## 9. Schnell-Checkliste

- [ ] Quellvideo: Objekt hell, Hintergrund **#000000**, nahtloser Loop
- [ ] `ffmpeg` mit **Schwarz-Crush** → webm + mp4 + poster in `public/media/`
- [ ] Poster gegengeprüft (Hintergrund wirklich schwarz)
- [ ] Komponente: `muted` + `playsInline` + `loop`, Pfade korrekt
- [ ] CSS: `mix-blend-mode: screen`, `max-width`, `@media(max-width:1024px){ display:none }`
- [ ] Hintergrund im selben Stacking-Context (`z-index:-1`), **kein** eigener Context ums Video
- [ ] Browser: Video läuft, blendet sauber, keine Fehler

---

*Referenzdateien im Projekt:* `src/components/ToothVideo.tsx` · `src/components/sections/Hero.tsx`
· `src/app/(frontend)/styles.css` (Klassen `.hero-tooth`, `.hero-tooth-video`, `.hero-bg2`)
· Assets in `public/media/`.
