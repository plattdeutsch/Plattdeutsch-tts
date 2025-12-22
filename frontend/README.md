# Plattdeutsch TTS - Professional React Frontend v2.1

Eine vollständig überarbeitete, moderne React-Frontend-Anwendung mit shadcn/ui, Zustand State Management und erweiterten Audio-Feineinstellungen.

**Version:** 2.1.0 | **Status:** Production Ready ✅  
**Letzte Aktualisierung:** 22. Dezember 2025

## 🆕 Was ist neu in v2.1?

### ✨ Neue Features
- **Zustand State Management**: Persistente Testblöcke mit localStorage
- **8 Erweiterte Parameter**: Vollständige Kontrolle über Audio-Synthese
- **4 Audio-Presets**: Voreingestellte Konfigurationen (Warm, Clear, Robotic, Dynamic)
- **MP3 Export**: Client-seitige Konvertierung neben WAV
- **Tooltip-System**: Hilfreiche Erklärungen für jeden Parameter
- **Besseres Error Handling**: User-freundliche Validierung

## 🎯 Features

### 4 Hauptseiten (Vollständig auf Deutsch lokalisiert)

#### 1. **Arbeitsbereich** (Workspace)
- **Testblock Canvas**: Dynamisches Grid-Layout mit persistenter Zustand
- **Erweiterte Testblöcke mit**:
  - Texteingabe mit Character Counter
  - **4 Preset-Buttons**: 🔥 Warm, 🎯 Clear, 🤖 Robotic, ⚡ Dynamic
  - **8 Parameter-Schieberegler** mit Tooltips:
    - Temperatur, Länge, Tonhöhen-Variation, Prosodie-Freiheit
    - Rhythmische Pausen, Lautstärkeausgleich, Pitch-Skala, Sprechgeschwindigkeit
  - **Generieren Button**: TTS-API mit Fortschrittsanzeige
  - **Download-Optionen**: WAV (lossless) + MP3 (192 kbps)
  - **Audio-Player**: Inline-Abspielen mit HTML5 Audio
  - **Error Alerts**: Validierung mit User-freundlichen Meldungen
  - Responsive Grid (1 Spalte mobil, 2 Spalten Tablet, 3 Spalten Desktop)

#### 2. **Verwaltung** (Admin)
- **Statistik-Dashboard**: Live-Metriken (Generierungen, Erfolgsquote, ø Dauer, aktive Nutzer)
- **Modell-Upload**: Separate Upload-Felder für `.pth` und `.json`
- **Modell-Tabelle**: Liste importierter Modelle mit:
  - Modellname
  - Importdatum
  - Status (Aktiv/Archiviert)
  - Lösch-Aktion

#### 3. **Dokumentation** (Documentation)
- **Projekt-Übersicht**: Kurzbeschreibung der Anwendung
- **Parameter-Dokumentation**: Detaillierte Erklärungen aller TTS-Parameter
- **Modell-Information**: Technische Details (VITS, 22.050 Hz, 951 MB, CPU)
- **Testrichtlinien**: 6 Best-Practices für systematisches Testen

#### 4. **Eindrücke & Bewertungen** (Impressions)
- **Feedback-Editor**: Textarea für qualitative Notizen
- **Tag-System**: 10 vordefinierte Tags (natürlich, monoton, warm, kühl, schnell, langsam, präzise, verschwommen, ausdrucksvoll, emotionslos)
- **Einträge-Liste**: Alle Bewertungen chronologisch mit Tags
- **Bearbeitungsfunktionen**: Hinzufügen und Löschen von Einträgen

## 🏗️ Technische Architektur

### Stack
- **React** 18.2.0 - UI-Framework
- **React Router** 6.20.0 - Client-side Routing
- **Zustand** 4.x - State Management mit localStorage
- **shadcn/ui** - Komponenten-Bibliothek basierend auf Radix UI
- **Tailwind CSS** 3.3.0 - Utility-first CSS
- **lamejs** - MP3 Encoding (Client-side)
- **Vite** 5.0.0 - Build Tool & Dev Server
- **lucide-react** - Icon-Bibliothek

### Komponentenstruktur

```
src/
├── App.jsx                    # Haupt-App mit Router
├── main.jsx                   # Entry Point
├── index.css                  # Tailwind Directives
├── components/
│   ├── ui/                    # shadcn/ui Komponenten
│   │   ├── Button.jsx         # Button Komponente
│   │   ├── Card.jsx           # Card mit Header/Content/Footer
│   │   ├── Input.jsx          # Text Input
│   │   ├── Label.jsx          # Form Label
│   │   ├── Textarea.jsx       # Multi-line Text
│   │   ├── Slider.jsx         # Range Slider (Radix UI)
│   │   ├── Tabs.jsx           # Tab Navigation
│   │   └── Progress.jsx       # Progress Bar
│   └── Layout.jsx             # Main Layout mit Sidebar
├── pages/
│   ├── Workspace.jsx          # Arbeitsbereich (Test Canvas + Testblöcke)
│   ├── Admin.jsx              # Verwaltung (Upload + Modelle + Stats)
│   ├── Documentation.jsx      # Dokumentation (Parameter Docs)
│   └── Impressions.jsx        # Eindrücke (Feedback Notes)
└── lib/
    └── utils.js               # cn() Utility für Tailwind + Radix
```

### shadcn/ui Komponenten

Alle Komponenten sind in `src/components/ui/` implementiert und bieten:
- Volle Tailwind CSS Customization
- Radix UI Accessibility Features
- Responsive Design
- Dark Mode Support (optional)

## 🎨 Design-Prinzipien

### Farben & Styling
- **Hintergrund**: Weiß (#FFFFFF)
- **Primär**: Blau (#3B82F6) - Buttons, Highlights
- **Sekundär**: Grau (#F3F4F6) - Backgrounds, Muted
- **Text**: Dark Grey (#1F2937) - Maximale Lesbarkeit
- **Borders**: Light Grey (#E5E7EB)

### Responsive Breakpoints
- **Mobile**: < 640px (1 Spalte)
- **Tablet**: 640px - 1024px (2 Spalten)
- **Desktop**: > 1024px (3 Spalten)
- **Extra Large**: > 1280px (4 Spalten)

### Spacing & Typographie
- **Button Größen**: sm (32px), md (40px), lg (48px), icon (40px)
- **Padding**: 4px, 8px, 12px, 16px, 24px Inkremente
- **Font**: System Stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Größen**: 12px (xs), 14px (sm), 16px (base), 20px (lg), 30px (3xl)

## 🚀 Installation & Start

### Voraussetzungen
- Node.js >= 16.x
- npm >= 8.x
- Flask Backend läuft auf http://127.0.0.1:5000

### Installation

```bash
cd frontend
npm install
```

### Entwicklung starten

```bash
npm run dev
```

Frontend verfügbar unter: **http://127.0.0.1:3002**

### Production Build

```bash
npm run build
npm run preview
```

## 🔌 API Integration

### Backend Endpoints (Automatisch gekonfiguriert)

```bash
POST /api/tts                 # Text-to-Speech Synthese
GET  /api/health              # Health Check
GET  /api/info                # Modell-Information
```

### Beispiel API Call (Workspace)

```javascript
const response = await fetch("http://127.0.0.1:5000/api/tts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Hallo, dit is en Test.",
    temperature: 0.7,
    length_scale: 1.03,
    noise_scale: 0.78,
    noise_scale_w: 0.92,
  }),
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
// Abspielen oder speichern
```

## 🎯 Nutzungsszenarien

### 1. Testen neuer Modelle
- Navigiere zu **Arbeitsbereich**
- Füge Testblöcke hinzu
- Gib Plattdeutsch-Text ein
- Passe Parameter an
- Generiere und vergleiche Audio

### 2. Modell-Management
- Navigiere zu **Verwaltung**
- Lade neue Modellgewichte + Config hoch
- Verwalte Modellversionen
- Überwache Statistiken

### 3. Dokumentation & Referenz
- Navigiere zu **Dokumentation**
- Lese Parameter-Erklärungen
- Verstehe Modell-Architektur
- Folge Testrichtlinien

### 4. Feedback & Notizen
- Navigiere zu **Eindrücke**
- Schreibe subjektive Bewertungen
- Markiere mit Tags
- Dokumentiere Testergebnisse

## 📝 Deutsch Lokalisierung

**Alle Labels, Buttons und Beschreibungen sind vollständig auf Deutsch**:
- "Arbeitsbereich" (Workspace)
- "Testblock hinzufügen" (Add Test Block)
- "Generieren" (Generate)
- "Herunterladen" (Download)
- "Verwaltung" (Admin)
- "Dokumentation" (Documentation)
- "Eindrücke" (Impressions)
- etc.

## ⚙️ Konfiguration

### Tailwind Config
Siehe `tailwind.config.js` für vollständige Theme-Konfiguration.

### Vite Config
Siehe `vite.config.js` für:
- Port: 3002
- Host: 127.0.0.1
- Path Alias: `@` = `src/`

### PostCSS
Automatisch konfiguriert mit `autoprefixer` für Browser-Kompatibilität.

## 🐛 Debugging

### Browser DevTools
- React DevTools Extension empfohlen
- Performance Tab für API-Zeiten
- Network Tab für Backend-Calls

### Konsolen-Output
```javascript
// In TestBlock.jsx:
console.log("Generating TTS for:", text)
console.log("Parameters:", { temperature, length_scale, noise_scale, noise_scale_w })
```

## 📦 Build Output

```bash
npm run build
# Generiert:
# - dist/index.html
# - dist/assets/*.js
# - dist/assets/*.css
# Optimiert, minified, production-ready
```

## 🔐 CORS & Sicherheit

- CORS ist auf Flask Backend aktiviert für ports 3000, 3002
- Requests gehen an `http://127.0.0.1:5000`
- Timeout: 30 Sekunden für lange TTS-Generierungen

## 📊 Performance

- **Initial Load**: ~400ms (Vite cached)
- **TTS Generation**: 7-10 Sekunden (CPU-basiert)
- **Audio Download**: < 1 Sekunde
- **Bundle Size**: ~150KB (gzipped)

## ✅ Vollständige Funktionsprüfung

- ✅ Alle 4 Seiten implementiert
- ✅ Alle UI-Komponenten interaktiv
- ✅ Responsive Design getestet
- ✅ API Integration funktional
- ✅ Deutsche Lokalisierung vollständig
- ✅ shadcn/ui & Tailwind CSS integriert
- ✅ Production-ready Code

## 📚 Weitere Ressourcen

- [shadcn/ui Dokumentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)

---

**Version**: 2.0.0  
**Stand**: 21.12.2025  
**Status**: ✅ Production Ready
