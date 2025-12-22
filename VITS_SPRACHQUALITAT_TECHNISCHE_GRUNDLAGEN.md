# VITS Sprachqualität: Technische Grundlagen und Inferenzkonfiguration

**Version:** 2.1.0  
**Datum:** 22. Dezember 2025  
**Audience:** Systemverantwortliche, technische Entscheidungsträger, Forscher  
**Sprache:** Deutsch

---

## Übersicht

Diese Dokumentation erklärt die wissenschaftlichen Grundlagen der Sprachqualität in VITS-Modellen. Sie richtet sich an Systemverantwortliche und technische Entscheidungsträger, die verstehen möchten, warum Sprachqualität eine Systemeignenschaft ist und warum Inferenzkonfiguration eine kritische Designentscheidung darstellt.

---

## 1. Die Sprachgenerierungs-Pipeline: Konzeptionelle Grundlagen

### 1.1 Was VITS tatsächlich tut

VITS modelliert menschliche Sprache nicht als deterministischen Datensatz, der treu reproduziert werden muss. Stattdessen:

**VITS lernt eine wahrscheinlichkeitsbasierte Verteilung über den latenten Raum.**

Das Modell erfasst während des Trainings:

- **Phonem-Audio-Ausrichtung:** Welche Lautdauern typisch sind
- **Harmonische Struktur:** Welche Tonhöhenmuster natürlich klingen
- **Prosodische Variabilität:** Wie Intonation, Pausen und Emphasis natürlicherweise variieren
- **Mikrovariation:** Kleine, unbewusste Schwankungen in Timing und Spektrum

Aber: Das Modell speichert keine deterministischen Abbildungen. Es speichert statistische Muster.

### 1.2 Inferenz als Stichprobenziehung

Wenn Sie einen Satz generieren, führt VITS zwei Schritte durch:

**Schritt 1: Phonem-zu-Latent-Kodierung**  
Der Encoder konvertiert Text und Phoneme in eine kontinuierliche Darstellung im latenten Raum. Diese Darstellung ist nicht eindeutig — es gibt einen *Bereich* plausibler Latent-Vektoren.

**Schritt 2: Stichprobenziehung aus der Verteilung**  
Der Decoder entnimmt aus dieser Verteilung (gesteuert durch die Temperatur) und erzeugt Wellen-Audio.

**Das Schlüsselkonzept:** Die gleiche Eingabe kann legitim zu unterschiedlichen Audio-Ausgaben führen. Das ist nicht Zufall oder Fehler — das ist korrekt.

### 1.3 Warum derselbe Satz unterschiedlich klingen sollte

Menschliche Sprache ist nicht deterministisch. Wenn Sie einen Satz fünfmal sagen, variieren Sie:

- Timing (Sprechgeschwindigkeit schwankt)
- Tonhöhe (Intonation ist nicht perfekt konsistent)
- Emphasis und Pausen (Sie betonen unterschiedliche Wörter)
- Mikro-Details (Reibelaute, Vokalkwalität)

**Ein gutes Sprachmodell sollte diese natürliche Variabilität reproduzieren.**

Ein Modell, das immer identisch klingt, ist nicht realistisch — es ist roboterartig.

---

## 2. Training vs. Inferenz: Verantwortungsteilung

### 2.1 Was während des Trainings gelernt wird

Das Training ist ein statistischer Prozess. Das Modell sieht Tausende von Paaren aus (Text, Audio) und lernt:

| Lernelement | Was das Modell erfasst |
|------------|----------------------|
| **Phonem-Ausrichtung** | Wie lange jeder Laut typischerweise dauert |
| **Spektrale Struktur** | Welche Frequenzen bei welchen Phonemen aktiv sind |
| **Prosodische Muster** | Wie Tonhöhe über Phrasen fällt; wo Pausen natürlich sind |
| **Sprecheridentität** | Grundfrequenz, Formanten, Klangfarbe des Sprechers |
| **Mikrovariation** | Kleine natürliche Schwankungen, die normal sind |

**Das Modell lernt NICHT, determinstische Regeln anzuwenden.**  
Es lernt, Verteilungen zu approximieren.

### 2.2 Was während der Inferenz entschieden wird

Während der Inferenz kontrollieren Sie nicht das Modell — Sie konfigurieren, wie es abgetastet wird.

| Inferenz-Entscheidung | Wirkung |
|----------------------|--------|
| **Temperatur** | Wie eng oder breit die Stichprobenziehung aus der gelernte Verteilung ist |
| **Dauer-Skalierung** | Wie sehr Timing-Vorhersagen gedehnt oder komprimiert werden |
| **Rausch-Skala (Tonhöhen)** | Wie viel mikrotonale Variation übrig bleibt |
| **Prosodische Freiheit** | Wie viel Intonations- und Emphasis-Variation erlaubt ist |
| **Pausen-Variabilität** | Wie stark Pausen zwischen Phonemen variieren können |
| **Lautstärke-Normalisierung** | Wie aggressiv Amplitude geglättet wird |

**Das Kritische:** Ein gut trainiertes Modell kann unnatürlich klingen, wenn die Inferenzkonfiguration falsch ist.

### 2.3 Warum Inferenzkonfiguration nicht trivial ist

**Szenario A: Zu enge Abtastung**
- Temperatur = 0.2, noiseScale = 0.2
- Das Modell wird gezwungen, sehr nah am Mittelwert der Verteilung zu bleiben
- Ergebnis: Monoton, roboterartig, künstlich

**Szenario B: Zu lockere Abtastung**
- Temperatur = 1.5, noiseScale = 1.2
- Das Modell entnimmt weit entfernt von der trainierten Verteilung
- Ergebnis: Inkohärent, instabil, nicht zusammenhängend

**Szenario C: Ausgewogene Abtastung** (optimale Inferenz)
- Temperatur = 0.85, noiseScale = 0.80
- Das Modell entnimmt aus der trainierten Verteilung mit leichtem Bias zum Mittelwert
- Ergebnis: Natürlich, stabil, menschlich

**Die Inferenzparameter sind keine „Knöpfe zum Reparieren des Modells".**  
Sie sind Steuermechanismen für Stichprobenverhalten.

---

## 3. Häufige Sprachquellen: Wissenschaftliche Erklärung

### 3.1 Roboterartige Qualität

**Wahrnehmung:**  
Der Klang ist monoton, mechanisch, ohne natürliche Emotion oder Variation.

**Akustische Ursachen:**

1. **Zeitliche Überregularisierung**
   - Jedes Phonem hat exakt die vorhergesagte Dauer
   - Keine natürlichen Timing-Schwankungen
   - Sprechgeschwindigkeit ist konstant

2. **Prosodische Symmetrie**
   - Tonhöhe folgt eines starren Musters
   - Keine unerwarteren Betonungen oder Emphasis
   - Intonation wirkt wie ein mechanisches Auf-und-Ab

3. **Deterministische Dauer-Vorhersage**
   - Der Duration-Prädiktor wird zu wörtlich genommen
   - Keine Variabilität in Phonem-Längen über Wiederholungen

**System-Level-Ursprung:**
- temperature zu niedrig (< 0.75)
- noiseScale zu niedrig (< 0.75)
- noiseScaleW zu niedrig (< 0.80)
- Alle Variabilität wurde unterdrückt

**Diagnose:**
Generieren Sie die gleiche Phrase dreimal. Bei roboteratigem Klang klingt jede Wiederholung praktisch identisch.

---

### 3.2 Metallische Qualität

**Wahrnehmung:**  
Der Klang hat ein schmetterndes, kreischendes oder "synthetisches" Brummen, besonders bei Vokalen.

**Akustische Ursachen:**

1. **Harmonische Überregularisierung**
   - Der Decoder erzeugt sehr regelmäßige harmonische Strukturen
   - Natürliche Unregelmäßigkeiten in Harmonischen sind unterdrückt
   - Spitzenenergie konzentriert sich auf enge Frequenzbänder

2. **Latent-Mean-Kollaps**
   - Die Abtastung zu nah am Mittelwert des latenten Raums
   - Der Variationsdecoder (VAE-Komponente) wird nicht sinnvoll genutzt
   - Ergebnis: Energiekonzentration statt natürlicher Verbreitung

3. **Spektrale Eng-Bandigkeit**
   - Weniger „Rauschen" im guten Sinne (Flüchtige, Reibelaute)
   - Vokalformanten sind unnaturally sharp
   - Unerwünschte Harmonische-Verstärkung

**System-Level-Ursprung:**
- temperature zu hoch (> 0.95) ODER
- noiseScale zu hoch (> 0.95) bei gleichzeitig enger Abtastung
- Paradoxerweise kann auch *zu enge* Abtastung metallisch klingen, wenn der Latent-Mittelwert durch falsche Daten voreingenommen ist

**Diagnose:**
Hören Sie auf scharfe oder kreischende Qualität bei Vokalen. Oft begleitet von weniger natürlichen Reibelauten (s, f, th).

---

### 3.3 Zeitliche Verschmierung

**Wahrnehmung:**  
Phoneme „verschmieren" ineinander. Anfangskonsonanten verlieren ihren Schärfe. Sprachverständlichkeit leidet.

**Akustische Ursachen:**

1. **Zu kurz vorhergesagte Phonem-Dauern**
   - lengthScale < 0.90
   - Der Decoder versucht, zu viel Audio in zu weniger Zeit zu erzeugen
   - Phoneme überlappen oder verschwinden

2. **Verlust des Konsonanten-Anfangs (Attack)**
   - Explosiven Geräusche (p, t, k) haben keine Zeit zu entstehen
   - Reibelaute sind unterbrochen oder gedimmt
   - Die resultierende Sprache wird undeutlich

3. **Flache Spektral-Umhüllungen**
   - Ohne ausreichende Phonem-Dauer ist die Spektral-Auflösung gering
   - Das Ohr kann nicht unterscheiden, was gesagt wird

**System-Level-Ursprung:**
- lengthScale zu niedrig (< 0.90)
- Fehlerhafte Dauer-Vorhersagen während des Trainings (seltener)

**Diagnose:**
Lesen Sie eine Phrase laut. Vergleichen Sie die Sprechgeschwindigkeit mit dem generierten Audio. Bei Verschmierung ist das generierte Audio unrealistisch schnell oder verschwommen.

---

### 3.4 Flache / Leblose Stimme

**Wahrnehmung:**  
Der Klang ist ausdruckslos, ohne Dynamik. Alle Silben klingen gleich laut. Keine emotionale Variation.

**Akustische Ursachen:**

1. **Über-normalisierte Dynamik**
   - volumeBalance wird zu aggressiv angewendet
   - Die Amplitude wird zu flach gemacht
   - Natürliche Emphasis-Unterschiede werden eliminiert

2. **Unterdrückte Mikro-Randomisierung**
   - Kleine, unbewusste Schwankungen in Amplitude und Tonhöhe sind entfernt
   - Das Ohr nimmt dies als „künstlich" wahr, weil echte Sprache immer etwas Rauschmittel enthält

3. **Zu starre Prosodische Vorhersage**
   - Betonung folgt einem starren Muster
   - Keine "Überraschungs"-Emphasis

**System-Level-Ursprung:**
- volumeBalance zu hoch (> 1.1)
- Alle noise-Parameter zu niedrig
- noiseScaleW < 0.80 (Prosodische Freiheit unterdrückt)

**Diagnose:**
Höre auf Monotonie. Alle Wörter klingen gleich betont. Keine natürliche Satzmelodie.

---

## 4. Warum Über-Bereinigte Aufnahmen künstlich klingen

### 4.1 Das Problem mit zu sauberen Trainingsdaten

Ein kritischer Fehler bei der Erstellung von Sprachmodellen ist die Überannahme, dass „saubere Audio = besseres Modell":

**Was passiert, wenn Sie zu aggressiv bereinigte Daten verwenden:**

1. **Entfernung von Atem und Mikro-Ruhe**
   - Menschliche Sprache ist nicht kontinuierlich
   - Atmen, Stille, Anfang/Ende von Phonemen sind akustisch wichtig
   - Das Modell sieht keine Beispiele von normalem Atem

2. **Aggressives Noise-Gating**
   - Leise Konsonanten (f, th, s) werden gedimmt oder entfernt
   - Das Modell lernt, diese Laute zu unterdrücken
   - Resultierende Sprache klingt gedimmt

3. **Harte Kompression**
   - Dynamische Bereiche werden zu aggressiv komprimiert
   - Das Modell lernt flache Amplituden
   - Keine natürliche Emphasis-Variation

4. **Spektrale Säuberung (exzessives Denoising)**
   - Hochfrequenz-Rauschen wird aggressiv entfernt
   - Das Modell verliert die subtile Spektrale-Textur echter Sprache
   - Generierte Sprache klingt synthetisch

### 4.2 Warum echte Sprache „Unordnung" braucht

Menschliche Sprache enthält natürlicherweise:

| Element | Warum wichtig | Effekt bei Entfernung |
|---------|---------------|-------------------|
| **Atem** | Zeitmarkierungen; rhythmisches Gefühl | Sprache wirkt unnatürlich gehetzt |
| **Micro-Hiss** | Reibelaute; spektrale Textur | Konsonanten werden flach, undeutlich |
| **Unregelmäßiges Timing** | Natürliche Variation; Nicht-Robotik | Alle Silben klingen identisch |
| **Amplitude-Schwankung** | Emotionale Ausstrahlung; Emphasis | Alles wirkt flach und monoton |
| **Spektrale Körnigkeit** | Authentizität; Wärme | Klang wirkt steril und synthetisch |

**Das Paradoxon:** Wenn Sie zu aggressiv bereinigte Daten verwenden, trainieren Sie das Modell, synthetisch zu klingen.

### 4.3 Praktische Konsequenz

Selbst ein perfekt trainiertes Modell kann nicht reparieren, was es nicht gelernt hat.

Wenn das Trainings-Audio keine natürlichen Atempausen enthält, kann das generierte Audio auch nicht natürlich atmen. Wenn die trainierten Daten zu flache Dynamik haben, wird die generierte Sprache auch flach sein.

---

## 5. Inferenz-Parameter als Wahrnehmungs-Steuermechanismen

### 5.1 Temperatur (temperature)

**Was es steuert:**  
Die Unsicherheit der Kodierung. Bei niedrigerem Wert wird das Modell gezwungen, nah am Mittelwert der Verteilung zu bleiben.

**Signal-Level-Auswirkung:**

- **temperature = 0.5**  
  → Sehr niedrig. Das Modell entnimmt praktisch aus einer Dirac-Delta (sehr enge Verteilung).  
  → Ergebnis: Monotone, roboterartige Qualität. Kein Variation.

- **temperature = 0.75–0.95** (Sicher-Bereich)  
  → Modell entnimmt aus der trainierten Verteilung mit leichtem Bias zum Mittelwert.  
  → Ergebnis: Natürlich, stabil, menschlich.

- **temperature = 1.0**  
  → Unbegrenzte Abtastung aus der trainierten Verteilung.  
  → Ergebnis: Sehr variabel, manchmal inkohärent.

- **temperature = 1.5+**  
  → Zu lockere Abtastung, weit jenseits der Trainingsdaten.  
  → Ergebnis: Instabil, unsinnig, künstlich.

**Wahrnehmungs-Dimension:** Natürlichkeit und Variation vs. Stabilität.

---

### 5.2 Length Scale (Dauer-Skalierung)

**Was es steuert:**  
Ein Multiplikator auf vorhergesagte Phonem-Dauern.

**Signal-Level-Auswirkung:**

- **length_scale = 0.8**  
  → Sprache ist 20% schneller.  
  → Ergebnis: Verschmiertes Audio; Konsonanten verlieren Schärfe.

- **length_scale = 0.90–1.05** (Sicher-Bereich)  
  → Sprache hat natürliche Timing.  
  → Ergebnis: Verständlich, natürlich, keine zeitlichen Artefakte.

- **length_scale = 1.2+**  
  → Sprache ist deutlich langsamer.  
  → Ergebnis: Unnatürliche Pausen zwischen Phonemen; Monotonie.

**Wahrnehmungs-Dimension:** Sprechgeschwindigkeit, Verständlichkeit.

---

### 5.3 Noise Scale (Tonhöhen-Variation)

**Was es steuert:**  
Wie viel Variation der Decoder in die Spektrale-Kodierung hinzufügt (unabhängig von der Phonem-Identität).

**Signal-Level-Auswirkung:**

- **noise_scale = 0.3**  
  → Sehr wenig Variation.  
  → Ergebnis: Roboterartig, flache Spektren, monotone Tonhöhe.

- **noise_scale = 0.75–0.95** (Sicher-Bereich)  
  → Natürliche Spektrale-Variation.  
  → Ergebnis: Wärme, Charakter, menschlicher Klang.

- **noise_scale = 1.2+**  
  → Zu viel Variation.  
  → Ergebnis: Metallisch, scharf, manchmal inkoherent.

**Wahrnehmungs-Dimension:** Wärme, Textur, Spektrales Reichtum.

---

### 5.4 Noise Scale W (Prosodische Freiheit)

**Was es steuert:**  
Wie viel Variation in die Prosodische Latent-Kodierung (Tonhöhe, Betonung, Intonation) hinzugefügt wird.

**Signal-Level-Auswirkung:**

- **noise_scale_w = 0.3**  
  → Prosodische Vorhersage ist starr.  
  → Ergebnis: Monotone Intonation; keine emotionalen Schwankungen.

- **noise_scale_w = 0.80–0.98** (Sicher-Bereich)  
  → Natürliche Prosodische Variation.  
  → Ergebnis: Ausdrucksvolle, emotionale Intonation; natürliche Satzmelodie.

- **noise_scale_w = 1.3+**  
  → Zu viel prosodische Variation.  
  → Ergebnis: Unvorhersehbare Intonation; künstlich, verwirrend.

**Wahrnehmungs-Dimension:** Emotionaler Ausdruck, Satzmelodie, Natürlichkeit.

---

### 5.5 Rhythmic Pauses (Pausen-Variabilität)

**Was es steuert:**  
Wie konsistent Pausen zwischen Phonemen sind.

**Signal-Level-Auswirkung:**

- **rhythmicPauses = 0.3**  
  → Pausen sind sehr regelmäßig.  
  → Ergebnis: Roboterartiges Rhythmus; künstliche Strukturen.

- **rhythmicPauses = 0.50–0.80** (Sicher-Bereich)  
  → Pausen haben natürliche Variabilität.  
  → Ergebnis: Natürlicher Rhythmus; menschliche Sprechweise.

- **rhythmicPauses = 1.1+**  
  → Pausen sind sehr variabel.  
  → Ergebnis: Unregelmäßiges Timing; manchmal unklar.

**Wahrnehmungs-Dimension:** Rhythmisches Gefühl, Natürlichkeit.

---

### 5.6 Volume Balance (Lautstärke-Normalisierung)

**Was es steuert:**  
Wie aggressiv die Amplitude normalisiert wird.

**Signal-Level-Auswirkung:**

- **volumeBalance = 0.7**  
  → Zu aggressive Normalisierung.  
  → Ergebnis: Flache Dynamik; keine Emphasis-Unterschiede.

- **volumeBalance = 0.90–1.05** (Sicher-Bereich)  
  → Ausgewogene Normalisierung.  
  → Ergebnis: Natürliche Dynamik; hörbare Emphasis.

- **volumeBalance = 1.3+**  
  → Sehr wenig Normalisierung.  
  → Ergebnis: Ungleichmäßige Lautstärke; manchmal zu laut.

**Wahrnehmungs-Dimension:** Dynamische Range, Emphasis.

---

### 5.7 Pitch Scale (Tonhöhen-Skalierung)

**Was es steuert:**  
Multiplikator auf die Grundfrequenz.

**Signal-Level-Auswirkung:**

- **pitchScale = 0.8**  
  → Tiefere Stimme (20% niedriger).  
  → Ergebnis: Wahrgenommen als männlicher, tiefer.

- **pitchScale = 0.90–1.10** (Sicher-Bereich)  
  → Natürliche Tonhöhe für die Sprecheridentität.  
  → Ergebnis: Authentischer, natürlicher Klang.

- **pitchScale = 1.3+**  
  → Höhere Stimme.  
  → Ergebnis: Wahrgenommen als weiblich, höher; manchmal künstlich.

**Wahrnehmungs-Dimension:** Sprecheridentität, Tonhöhe.

---

### 5.8 Speaking Speed (Sprechgeschwindigkeit)

**Was es steuert:**  
Globale Multiplikator auf alle Phonem-Dauern (ähnlich length_scale, aber auf Sprecher-Ebene).

**Signal-Level-Auswirkung:**

- **speakingSpeed = 0.7**  
  → 30% langsamer.  
  → Ergebnis: Nachdenklich, bedacht, manchmal zu langsam.

- **speakingSpeed = 0.90–1.10** (Sicher-Bereich)  
  → Natürliche Sprechgeschwindigkeit.  
  → Ergebnis: Verständlich, angenehm, natürlich.

- **speakingSpeed = 1.5+**  
  → 50% schneller.  
  → Ergebnis: Gehetzt, manchmal unverständlich.

**Wahrnehmungs-Dimension:** Sprechgeschwindigkeit, Verständlichkeit.

---

## 6. Über-Begrenzte Inferenz: Wenn Korrektheit künstlich klingt

### 6.1 Das zentrale Paradoxon

**Problem:**  
Ein Inferenzparameter-Set kann mathematisch völlig korrekt sein und trotzdem künstlich klingen.

**Grund:**  
VITS ist ein probabilistisches Modell. Zu enge Abtastung (um zu nah am Mittelwert zu bleiben) bricht natürliche Variation zusammen.

### 6.2 Wie Über-Begrenzung funktioniert

Stellen Sie sich vor, der latente Raum ist ein Wald. Das Modell hat während des Trainings gelernt, wo die „natürlichen Pfade" sind.

- **Gute Inferenz:** Wandern Sie leicht neben den Pfaden, aber bleiben Sie im Wald.  
  → Ergebnis: Natürlich, variabel, realistisch.

- **Über-begrenzte Inferenz:** Gehen Sie direkt down der Mittellinie des Pfades, ohne Abweichung.  
  → Ergebnis: Mechanisch, vorhersagbar, künstlich.

- **Zu lockere Inferenz:** Verlassen Sie den Wald völlig.  
  → Ergebnis: Inkohärent, unnatürlich, unsinnig.

### 6.3 Warum Inferenz strenger als Training sein kann

Überraschend: Während des Trainings können Sie das Modell mit reicher Variation exposieren, aber während der Inferenz können Sie wählen, enger zu sampeln.

**Warum?**

Das Modell lernt robuste Mappings. Aber es lernt auch die Variabilität. Wenn Sie diese Variabilität während der Inferenz unterdrücken, erhalten Sie technisch korrekte, aber perceptuell künstliche Ergebnisse.

### 6.4 Analogie: Musikalische Interpretation

Stellen Sie sich ein Orchester vor. Der Komponist schreibt Noten (Training). Aber jede Aufführung ist verschieden (Inferenz-Variabilität).

- Ein großer Dirigent ermutigt natürliche Variation innerhalb der Struktur.  
- Ein sehr strikter Dirigent erzwingt Exaktheit.
- Ein völlig nachlässiger Dirigent lässt das Orchester machen, was es will.

Das Modell ist ähnlich. Über-strenge Inferenz-Parameter = sehr strikter Dirigent = technisch perfekt, aber künstlich.

---

## 7. Presets als gesteuerte Verzerrung, nicht Reparatur

### 7.1 Was Presets NICHT tun

Presets sind **keine Reparaturen** für ein schlecht trainiertes Modell.

Sie reparieren nicht:
- Fehlende Phoneme
- Falsche Sprecheridentität
- Unnatürliche Trainings-Data

### 7.2 Was Presets TUN

Presets sind **sanfte Verzerrungen der Stichprobenverteilung.**

Jedes Preset nimmt die trainierte Verteilung und sagt dem Decoder:

"Entnehmen Sie von dieser Stelle aus, mit dieser Stärke."

| Preset | Abtastungs-Bias | Effekt |
|--------|-----------------|--------|
| **Warm** | Bias zu warmem Spektrum, ausdrucksvoller Prosodic | Emotionale, freundliche Qualität |
| **Clear** | Bias zu Klarheit, eng begrenzte Prosodic | Kristallklare Artikulation |
| **Dynamic** | Bias zu hoher Prosodic-Variabilität | Ausdrucksvolle, dramatische Qualität |
| **Narrative** | Bias zu tieferer Tonhöhe, kontrollierten Prosody | Autorität, Gewicht |

### 7.3 Warum Presets im sicheren Bereich sein MÜSSEN

**Kritisch:** Presets müssen innerhalb der trainierten Verteilung bleiben.

Wenn ein Preset sagt: „Verwenden Sie temperature = 2.0", ist das außerhalb aller trainierten Bereiche. Das Modell wird nicht "mehr Variation" erzeugen — es wird zusammenbrechen.

### 7.4 Presets als Design-Entscheidung

Presets sind Ihre Wahl, wie das trainierte Modell präsentiert wird. Sie sind nicht mehr oder weniger gültig als jede andere Inferenz-Konfiguration — aber sie sind designiert, bestimmte Wahrnehmungs-Ziele zu erreichen:

- Warm = emotional access
- Clear = professionell access
- Dynamic = narrative access
- Narrative = authority access

---

## 8. Praktische Diagnose-Anleitung

### 8.1 Wie man Sprachqualitäts-Probleme diagnostiziert

**Schritt 1: Generieren Sie die gleiche Phrase dreimal hintereinander.**

Bei einem gut konfigurierten Modell sollten Sie 3 etwas unterschiedliche Wiederholungen hören.

| Beobachtung | Diagnose |
|-------------|----------|
| Alle 3 klingen identisch | Temperatur oder noise_scale zu niedrig |
| Alle 3 klingen sehr unterschiedlich | Temperatur oder noise_scale zu hoch |
| 3 klingen ähnlich, aber etwas variiert | Gut konfiguriert |

**Schritt 2: Höre auf spezifische artefakte.**

| Artefakt | Wahrscheinliche Ursache | Nächster Schritt |
|----------|------------------------|--------------------|
| Metallisch, kreischend | temperature > 0.95 ODER noiseScale > 0.95 | Reduktion beider Parameter |
| Roboterartig, monoton | temperature < 0.75 ODER noiseScale < 0.75 | Erhöhung beider Parameter |
| Verschmiert, undeutlich | lengthScale < 0.90 | Erhöhung auf 0.95+ |
| Flach, ausdruckslos | noiseScaleW < 0.80 ODER volumeBalance > 1.1 | Erhöhung noiseScaleW oder Reduktion volumeBalance |

**Schritt 3: Verändern Sie einen Parameter zur Zeit.**

Ändern Sie nicht alle auf einmal. Ändern Sie temperature um ±0.05 und höre wieder. Isolieren Sie, welcher Parameter das Problem verursacht.

### 8.2 Training-Defekt vs. Inferenzkonfiguration

**Frage: Sollte ich das Modell neu trainieren, oder ist das ein Inferenzproblem?**

**Es ist wahrscheinlich ein Inferenz-Problem, wenn:**
- Verschiedene Inferenz-Parameter bessere Ergebnisse geben
- Das Problem konsistent ist, aber nicht „unmöglich"
- Andere Sätze besser funktionieren

**Es ist wahrscheinlich ein Training-Defekt, wenn:**
- Alle Inferenz-Parameter geben schlechte Ergebnisse
- Das Problem beispielsweise in allen Phonemen auftritt
- Sprecheridentität ist offensichtlich falsch

**Training ist selten notwendig.** Die meisten Sprachqualitäts-Probleme sind Inferenzkonfiguration.

### 8.3 Wenn Retraining notwendig ist

Retraining ist notwendig, wenn:

1. Das Trainings-Audio ist zu sauber oder zu verrauscht
2. Wichtige Phoneme sind in den Trainings-Daten nicht vorhanden
3. Sprecheridentität ist falsch (falscher Sprecher, falsche Sprache)
4. Keine Inferenzkonfiguration kann das Problem beheben

**Aber:** Selbst dann ist Training schwierig. Versuchen Sie zuerst, die Inferenzkonfiguration zu optimieren.

---

## 9. Zusammenfassung: Sprachqualität als Systemeigenschaft

### 9.1 Die drei Layer von Sprachqualität

| Layer | Kontrolle | Veränderbarkeit |
|-------|-----------|-----------------|
| **Daten** | Trainings-Audio-Qualität, Sauberkeit | Schwer (Retraining nötig) |
| **Training** | Modellarchitektur, Loss-Funktionen | Mittelschwer (Retraining nötig) |
| **Inferenz** | Parameter-Konfiguration, Presets | Leicht (nur Konfiguration) |

Alle drei Ebenen beeinflussen das Endergebnis.

### 9.2 Praktische Implikationen

1. **Inferenzkonfiguration ist eine Design-Entscheidung, nicht eine Reparatur.**  
   Sie wählen, wie das Modell präsentiert wird.

2. **Gutes Training bedeutet nicht automatisch gute Inferenz.**  
   Sogar ein großartiges Modell kann durch schlechte Inferenzkonfiguration künstlich klingen.

3. **Presets sind nicht "Fixes" — sie sind Biases.**  
   Sie lenken die Abtastung, um bestimmte wahrnehmungs-Ziele zu erreichen.

4. **Über-Bereinigung ist selten besser.**  
   Natürliche Sprache braucht Variabilität. Zu starre Konfiguration klingt künstlich.

5. **Diagnostik sollte systematisch sein.**  
   Ändere einen Parameter, beobachte die Auswirkung, isoliere das Problem.

---

## 10. Referenz-Tabelle: Safe Bereiche

Diese Bereiche basieren auf VITS-Stabilität und Artefakt-Schwellen:

| Parameter | Min | Max | Sicherer Bereich | Optimum |
|-----------|-----|-----|------------------|---------|
| temperature | 0.70 | 1.00 | 0.75–0.95 | 0.85 |
| lengthScale | 0.85 | 1.15 | 0.90–1.05 | 0.98 |
| noiseScale | 0.65 | 1.05 | 0.75–0.95 | 0.85 |
| noiseScaleW | 0.70 | 1.10 | 0.80–0.98 | 0.90 |
| rhythmicPauses | 0.40 | 0.95 | 0.50–0.80 | 0.65 |
| volumeBalance | 0.85 | 1.20 | 0.90–1.05 | 0.98 |
| pitchScale | 0.80 | 1.30 | 0.90–1.10 | 1.00 |
| speakingSpeed | 0.80 | 1.25 | 0.90–1.10 | 1.00 |

---

## 11. Weiterführende Ressourcen

- **VITS_PRESET_DESIGN.md** - Detaillierte Preset-Spezifikationen
- **VITS_PRESET_IMPLEMENTATION.md** - Technische Implementierung
- **DEVELOPER_QUICK_REFERENCE.md** - Schnelle API-Referenz

---

**Version:** 2.1.0  
**Datum:** 22. Dezember 2025  
**Status:** Produktionsreife Dokumentation
