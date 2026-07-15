# Bilder für die Leistungs-Detailseiten — NanoBanana-Prompts

Das Bild erscheint **scharf, hell und rechts neben dem Fließtext** im Inhaltsbereich
(nicht mehr im Header — der grüne Streifen bleibt schlank und rein textlich). Auf den
**Unterseiten** scrollt das Bild neben dem Text mit („sticky"); auf den **Kategorieseiten**
sitzt es rechts oben über der Box „Das bieten wir". Weil das Bild scharf und prominent auf
hellem Grund steht, kommt es auf **saubere, helle, hochwertige Motive** an.

- **Seitenverhältnis: 4:5 (Hochformat).** Das Panel schneidet mit `object-fit: cover`
  zu — Motiv **mittig mit etwas Rand** halten, dann sitzt der Zuschnitt immer.
- **Hell & luftig** wirkt am besten (das Bild sitzt auf hellem, cremefarbenem Grund).
- **Ohne Gesichter / echte Münder** — vermeidet den „KI-Zähne"-Uncanny-Effekt. Motive
  sind bewusst Instrumente / Materialien / Modelle / helle Szenen. (Später jederzeit durch
  **echte Praxisfotos** ersetzbar — gleiches Feld.)

## So kommen die Bilder rein
1. Prompt bei NanoBanana (Gemini) generieren, **4:5 / Hochformat** wählen, 2–3 Varianten.
   Tipp für einen **einheitlichen Look:** alle 15 in einer Sitzung erzeugen und/oder ein
   fertiges Bild als Referenz mitgeben („match this lighting & style").
2. Groß exportieren (~1200–1600 px Breite reicht).
3. Datei nach dem **Slug** benennen (z. B. `zahnfuellungen.jpg`) — dann weißt du sofort,
   wohin sie gehört.
4. Im Admin hochladen: `http://localhost:3000/admin` → **Inhalte → Leistungen** →
   Kategorie öffnen → bei einer **Unterleistung** das Feld **„Bild (neben dem Text)"**,
   bzw. auf Kategorie-Ebene **„Bild (Detailseite, neben dem Text)"**.
5. Fertig — das Bild erscheint automatisch neben dem Text. Kein Bild = die Textspalte steht allein.

**Stil-Zusatz (steckt schon in jedem Prompt unten):** _photorealistic editorial dental
photography, bright soft natural daylight, shallow depth of field, sharp focus on the
subject, clean and calm, warm neutral tones with subtle sage-green and teal accents,
uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos,
no watermark, vertical 4:5 portrait._

---

## Unterseiten (pro Unterseite ein eigenes Motiv)

### Zahnerhalt
**Professionelle Zahnreinigung** — `/leistungen/zahnerhalt/professionelle-zahnreinigung`
> Polished stainless-steel prophylaxis instruments and an ultrasonic scaler resting on a clean sage-green tray, tiny fresh water droplets, immaculate spa-like freshness — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Zahnfüllungen** — `/leistungen/zahnerhalt/zahnfuellungen`
> Close-up of tooth-colored composite shade tabs and a slim dental sculpting instrument on a spotless bright surface, soft reflections, amalgam-free modern dentistry — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Endodontie (Wurzelbehandlung)** — `/leistungen/zahnerhalt/endodontie`
> Elegant macro of slender nickel-titanium root-canal files fanned out on a soft neutral surface with dental magnification loupes nearby, quiet focused precision — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Parodontologie** — `/leistungen/zahnerhalt/parodontologie`
> Bright still-life of an anatomical teeth-and-gum model beside a slim periodontal probe on a calm clean surface, healthy pink gums, gentle reassuring feel — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

### Zahnersatz
**Kronen und Brücken** — `/leistungen/zahnersatz/kronen-und-bruecken`
> Jewel-like close-up of a lustrous ceramic dental crown and a small bridge on a soft neutral surface, pearlescent porcelain catching gentle daylight, premium master-lab craftsmanship — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Herausnehmbarer Zahnersatz** — `/leistungen/zahnersatz/herausnehmbarer-zahnersatz`
> Tasteful bright still-life of a modern removable partial denture on soft neutral linen, precise dental-lab craftsmanship, dignified and understated — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Implantatgetragener Zahnersatz** — `/leistungen/zahnersatz/implantatgetragener-zahnersatz`
> Clean macro of a titanium implant-supported overdenture model on a bright clinical surface, subtle teal reflections, cutting-edge and trustworthy — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

### Zahnästhetik
**Veneers** — `/leistungen/zahnaesthetik/veneers`
> Extreme macro of a few ultra-thin translucent ceramic veneer shells catching delicate daylight on a soft matte surface, luxurious minimal pristine, like fine glass petals — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

**Bleaching** — `/leistungen/zahnaesthetik/bleaching`
> Bright fresh cosmetic-dentistry still-life: a tooth shade guide arranged from darker to brilliant white on an airy surface, luminous soft light, clean and radiant — photorealistic editorial dental photography, bright soft natural daylight, shallow depth of field, sharp focus on the subject, clean and calm, warm neutral tones with subtle sage-green and teal accents, uncluttered premium composition, reassuring and trustworthy, no faces, no text, no logos, no watermark, vertical 4:5 portrait.

---

## Kategorieseiten (auch diese Seiten haben ein Kopfbild-Feld)

**Zahnerhalt** — `/leistungen/zahnerhalt`
> Calm bright dental check-up still-life: a dentist's mouth mirror and a healthy natural-looking tooth model on a clean sage surface, soft daylight, preventive-care feel — [Stil-Zusatz].

**Zahnersatz** — `/leistungen/zahnersatz`
> Refined bright dental-lab still-life: a row of pearlescent ceramic prosthetics and crowns on a soft neutral surface, craftsmanship and precision — [Stil-Zusatz].

**Implantologie** — `/leistungen/implantologie`
> Clean bright macro of a titanium dental implant standing upright with a ceramic crown beside it, soft directional daylight, modern high-tech and trustworthy — [Stil-Zusatz].

**Kieferorthopädie** — `/leistungen/kieferorthopaedie`
> Discreet modern orthodontics still-life: a transparent clear aligner and a teeth model on a bright clean surface, fresh and contemporary, soft daylight — [Stil-Zusatz].

**Zahnästhetik** — `/leistungen/zahnaesthetik`
> Soft radiant close-up evoking cosmetic dentistry: glossy pristine model teeth catching gentle daylight on a matte surface, elegant luminous glow, no human face — [Stil-Zusatz].

**Kinderbehandlung** — `/leistungen/kinderbehandlung`
> Warm friendly pediatric-dentistry corner in soft pastel-and-sage tones, a cheerful little toy beside a clean child-friendly chair, reassuring and calm, no children's faces — [Stil-Zusatz].

> `[Stil-Zusatz]` = den Stil-Satz von oben anhängen (steht bei den Unterseiten schon komplett drin).
