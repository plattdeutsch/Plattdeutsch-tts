# Plattdeutsch TTS - Aufbauanleitung

Eine produktionsreife Text-zu-Sprache (TTS) Webanwendung mit lokalem VITS-Modell von Coqui AI für Plattdeutsch (Niederdeutsch).

## Status

✅ **Vollständig implementiert** - 100% Deutsch lokalisiert - Modernes Design

## Voraussetzungen

- **Python 3.8+** (für Backend)
- **Node.js 16+** und **npm/yarn** (für Frontend)
- **GPU** (optional, aber empfohlen für schnellere Inferenz)
- **Modellateien:**
  - `model/best_model.pth` (VITS-Modell)
  - `model/config.json` (Modellkonfiguration)

## Schnellstart - Automatisch

### Windows

1. Öffnen Sie PowerShell oder CMD im Projektverzeichnis
2. Führen Sie das Setup-Skript aus:
   ```powershell
   .\setup.bat
   ```

Das Skript erstellt automatisch:
- Python Virtual Environment
- Installiert alle Abhängigkeiten
- Setzt Frontend-Abhängigkeiten auf

## Schnellstart - Manuell

### Backend-Setup

1. Navigieren Sie zum Backend-Verzeichnis:
   ```powershell
   cd backend
   ```

2. Erstellen Sie ein Virtual Environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Installieren Sie die Abhängigkeiten:
   ```powershell
   pip install -r requirements.txt
   ```

4. Starten Sie den Flask-Server:
   ```powershell
   python app.py
   ```

   Erwartete Ausgabe:
   ```
   ============================================================
   Plattdeutsch TTS Backend - Flask Server
   ============================================================
   Starting Flask server on http://127.0.0.1:5000
   ```

### Frontend-Setup

In einem **neuen Terminal**:

1. Navigieren Sie zum Frontend-Verzeichnis:
   ```powershell
   cd frontend
   ```

2. Installieren Sie die Abhängigkeiten:
   ```powershell
   npm install
   ```

3. Starten Sie den Entwicklungsserver:
   ```powershell
   npm run dev
   ```

   Erwartete Ausgabe:
   ```
   VITE v5.0.0  ready in 234 ms
   ➜  Local:   http://127.0.0.1:3002/
   ```

## Nutzung

1. Öffnen Sie Ihren Browser und gehen Sie zu: **http://127.0.0.1:3002/**

2. Geben Sie Plattdeutsch-Text in das Textfeld ein

3. Passen Sie die Sprachparameter mit den Schiebereglern an:
   - **Stimmvarianz** (0,1-1,0): Kontrolliert die Variation der Ausgabe
   - **Sprechgeschwindigkeit** (0,5-2,0): Kontrolliert die Sprechgeschwindigkeit
   - **Klangvielfalt** (0,0-1,0): Kontrolliert die Stimmklarheit
   - **Prosodiefreiheit** (0,0-1,0): Kontrolliert spektrale Eigenschaften

4. Klicken Sie auf **"Sprache generieren"**

5. Hören Sie sich das generierte Audio an und laden Sie es herunter

## API-Endpunkte

### Health Check
```
GET http://127.0.0.1:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

### Text-zu-Sprache
```
POST http://127.0.0.1:5000/api/tts
Content-Type: application/json

{
  "text": "Plattdeutsch text hier",
  "temperature": 0.7,
  "length_scale": 1.0,
  "noise_scale": 0.6,
  "noise_scale_w": 0.8
}
```

Response: Binary WAV audio file

### Modellinfo
```
GET http://127.0.0.1:5000/api/info
```

Response:
```json
{
  "model_name": "Plattdeutsch VITS",
  "language": "Plattdeutsch (Low German)",
  "model_type": "VITS",
  "sample_rate": 22050,
  "parameters": {
    "temperature": {"min": 0.1, "max": 1.0, "default": 0.7},
    "length_scale": {"min": 0.5, "max": 2.0, "default": 1.0},
    "noise_scale": {"min": 0.0, "max": 1.0, "default": 0.6},
    "noise_scale_w": {"min": 0.0, "max": 1.0, "default": 0.8}
  }
}
```

## Projektstruktur

```
Plattdeutsch-tts/
├── backend/
│   ├── app.py                 # Flask-Hauptanwendung
│   ├── requirements.txt        # Python-Abhängigkeiten
│   ├── .venv/                 # Virtual Environment
│   └── temp/                  # Temporäre WAV-Dateien
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React-Komponenten
│   │   │   ├── NavBar.jsx
│   │   │   ├── TestCanvas.jsx
│   │   │   ├── TestBlock.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Documentation.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Globale Stile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/          # Abhängigkeiten
│
├── model/
│   ├── best_model.pth         # VITS-Modellgewichte
│   └── config.json            # Modellkonfiguration
│
├── setup.bat                  # Windows-Setup-Skript
├── note1.md                   # Projektbeschreibung
└── TTS_API_PATCH.md           # Technische Dokumentation
```

## Wichtige Funktionen

### Frontend

- ✅ **Testlabor**: A/B-Tests mit verschiedenen Parametereinstellungen
- ✅ **Verwaltungspanel**: Modellverwaltung und Batch-Tests
- ✅ **Dokumentation**: Detaillierte Parameterbeschreibungen
- ✅ **Responsives Design**: Funktioniert auf Desktop, Tablet und Mobilgeräten
- ✅ **Deutsche Lokalisierung**: 100% auf Deutsch
- ✅ **Voreinstellungen**: Natürlich, Ausgeglichen, Ausdrucksstark, Sanft

### Backend

- ✅ **Inference-Only**: Kein Model Training
- ✅ **CORS-Aktiviert**: Frontend-Backend-Kommunikation
- ✅ **Parametervalidierung**: Eingabevalidierung mit sinnvollen Defaults
- ✅ **Fehlerbehandlung**: Aussagekräftige Fehlermeldungen
- ✅ **Modell-Caching**: Modell wird einmal beim Start geladen
- ✅ **TTS-API-Patch**: Behebt Kompatibilitätsprobleme mit VITS

## Troubleshooting

### Model Loading Issues

Wenn das Modell nicht geladen wird:
- Überprüfen Sie, dass `best_model.pth` und `config.json` existieren
- Stellen Sie sicher, dass die Dateipfade korrekt sind
- Überprüfen Sie, ob genug Festplattenspeicher verfügbar ist

### CORS-Fehler

Wenn Sie CORS-Fehler sehen:
- Stellen Sie sicher, dass der Flask-Backend auf `http://127.0.0.1:5000` läuft
- Stellen Sie sicher, dass das Frontend auf `http://127.0.0.1:3002` läuft
- Flask-CORS sollte korrekt installiert sein

### GPU/CUDA-Probleme

Wenn CUDA nicht erkannt wird:
- Die App wird auf CPU zurückfallen (langsamer)
- Überprüfen Sie CUDA-Installation, wenn GPU verfügbar ist
- TTS funktioniert auf CPU, nur langsamer

## Performance-Hinweise

- Erste Inferenz ist langsamer (Model Warmup)
- Nachfolgende Anfragen sind schneller
- GPU-Inferenz ist deutlich schneller als CPU
- Standardparameter sind für Qualität/Geschwindigkeit optimiert

## Entwicklung

### Frontend bauen

```powershell
cd frontend
npm run build
```

Die Ausgabe wird in `frontend/dist/` erstellt.

### Linting

```powershell
cd frontend
npm run lint
```

## Lizenz

Diese Anwendung nutzt die Coqui TTS-Bibliothek (Mozilla Public License 2.0).

## Support & Referenzen

- **Coqui TTS GitHub**: https://github.com/coqui-ai/TTS
- **VITS Paper**: https://arxiv.org/abs/2106.06103
- **Flask Dokumentation**: https://flask.palletsprojects.com/
- **React/Vite Dokumentation**: https://vitejs.dev/

## Notizen

- Das Backend erwartet VITS-Modelle mit einer `config.json`-Datei
- Die TTS-API-Patch (siehe `TTS_API_PATCH.md`) behebt Kompatibilitätsprobleme
- Alle Text-Eingaben sind auf 1000 Zeichen begrenzt
- Alle Parameter werden automatisch validiert und auf sichere Bereiche begrenzt

---

**Status:** ✅ Produktionsreife - Vollständig getestet unter Windows
