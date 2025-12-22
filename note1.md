# Plattdeutsch TTS - Web-Anwendung für Sprachsynthese

Eine produktionsreife Text-zu-Sprache (TTS) Webanwendung mit lokalem VITS-Modell von Coqui AI für Plattdeutsch (Niederdeutsch).

**Status:** ✅ Vollständig implementiert - 100% Deutsch lokalisiert - White Canvas Design

Weitere Informationen:
- 📖 [Schnellstart auf Deutsch](QUICKSTART_DE.md)
- 🔍 [Verifikationsbericht](VERIFICATION_REPORT.md)
- 🔧 [Technische Spezifikation](TECHNICAL_SPEC.md)


```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ and npm/yarn
- GPU (optional, but recommended for inference)

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```powershell
   python app.py
   ```

   You should see:
   ```
   ============================================================
   Plattdeutsch TTS Backend - Flask Server
   ============================================================
   Starting Flask server on http://127.0.0.1:5000
   ...
   ```

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   VITE v5.0.0  ready in 234 ms
   ➜  Local:   http://127.0.0.1:3000/
   ```

### Usage

1. Open your browser and go to: **http://127.0.0.1:3000/**

2. Enter Plattdeutsch text in the text area

3. Adjust voice parameters using the sliders:
   - **Temperature** (0.1-1.0): Controls variation in output
   - **Length Scale** (0.5-2.0): Controls speech speed
   - **Noise Scale** (0.0-1.0): Controls voice clarity
   - **Noise Scale W** (0.0-1.0): Controls spectral characteristics

4. Click **"Generate Speech"**

5. Listen to the generated audio in the built-in player

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

### Text-to-Speech
```
POST /api/tts
Content-Type: application/json

{
  "text": "Plattdeutsch text here",
  "temperature": 0.7,
  "length_scale": 1.0,
  "noise_scale": 0.6,
  "noise_scale_w": 0.8
}
```

Response: Binary WAV audio file

## Key Features

- ✅ **Inference Only**: No model downloading or training
- ✅ **Windows Compatible**: Fully tested on Windows
- ✅ **CORS Enabled**: Frontend-backend communication
- ✅ **Clean UI**: Modern, responsive React interface
- ✅ **Parameter Control**: Adjust voice characteristics in real-time
- ✅ **Audio Playback**: Built-in browser audio player
- ✅ **Error Handling**: Graceful error messages
- ✅ **Model Caching**: Model loads once at startup

## Technical Details

### Backend (Flask)

- **Framework**: Flask with CORS support
- **TTS Engine**: Coqui TTS (VITS)
- **Model Loading**: Happens at application startup
- **Audio Output**: Temporary WAV files
- **Parameter Validation**: Input validation with sensible defaults

### Frontend (React)

- **Build Tool**: Vite (modern, fast)
- **Styling**: Pure CSS (no external libraries)
- **Communication**: Fetch API
- **State Management**: React Hooks

## Troubleshooting

### Model Loading Issues

If the model fails to load, check:
- File paths are correct (absolute paths used internally)
- `best_model.pth` and `config.json` exist in `backend/model/`
- Sufficient disk space for model and temporary files

### CORS Errors

If you see CORS errors, ensure:
- Flask backend is running on `http://127.0.0.1:5000`
- Frontend is running on `http://127.0.0.1:3000`
- Flask-CORS is properly installed

### GPU/CUDA Issues

If CUDA is not detected:
- The app will fall back to CPU (slower)
- Check CUDA installation if GPU is available
- TTS will work on CPU, just slower inference

## Performance Notes

- First inference will be slower (model warmup)
- Subsequent requests are faster
- GPU inference is significantly faster than CPU
- Default parameters are optimized for quality/speed balance

## License

This application uses the Coqui TTS library (Mozilla Public License 2.0).

## Support

For issues with:
- **TTS Model**: See [Coqui TTS GitHub](https://github.com/coqui-ai/TTS)
- **Flask**: See [Flask Documentation](https://flask.palletsprojects.com/)
- **React/Vite**: See [Vite Documentation](https://vitejs.dev/)
