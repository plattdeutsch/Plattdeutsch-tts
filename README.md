# Plattdeutsch TTS - Web Application

A production-ready Text-to-Speech (TTS) web application using a local VITS model from Coqui AI for Plattdeutsch (Low German) language.

**Status:** ✅ Complete Implementation - 100% German Localized - Modern Design

## Overview

This project provides an interactive web interface for generating speech in Plattdeutsch using a pre-trained VITS model. The application features a responsive React frontend and a Flask backend with full German localization.

### Key Features

- 🎤 **Local Inference**: Runs entirely on your machine, no cloud dependencies
- 🎨 **Modern UI**: Professional, responsive interface with German localization
- 🔧 **Parameter Control**: Fine-tune voice characteristics in real-time
- 📊 **A/B Testing**: Compare different settings side-by-side
- ⚙️ **Admin Panel**: Batch testing and system information
- 📚 **Documentation**: Comprehensive guides for acoustic parameters
- 🚀 **GPU Support**: Optimized for CUDA when available

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+ with npm
- GPU recommended (but CPU works too)

### Automatic Setup (Windows)

```powershell
.\setup.bat
```

### Manual Setup

**Terminal 1 - Backend:**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

Then open: **http://127.0.0.1:3002/**

## Project Structure

```
Plattdeutsch-tts/
├── backend/
│   ├── app.py                 # Flask application with TTS API
│   ├── requirements.txt        # Python dependencies
│   └── temp/                  # Temporary WAV files
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── NavBar.jsx
│   │   │   ├── TestCanvas.jsx
│   │   │   ├── TestBlock.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Documentation.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── model/
│   ├── best_model.pth         # VITS model weights
│   └── config.json            # Model configuration
│
├── setup.bat                  # Windows setup script
├── test_tts_direct.py        # Direct TTS testing
├── QUICKSTART_DE.md          # German quick start
├── TTS_API_PATCH.md          # Technical documentation
└── README.md                 # This file
```

## API Endpoints

### Health Check
```
GET /api/health
→ {"status": "ok", "model_loaded": true}
```

### Text-to-Speech
```
POST /api/tts
Content-Type: application/json

{
  "text": "Plattdeutsch text",
  "temperature": 0.7,
  "length_scale": 1.0,
  "noise_scale": 0.6,
  "noise_scale_w": 0.8
}

→ Binary WAV audio file
```

### Model Info
```
GET /api/info
→ Model information and parameter ranges
```

## Frontend Features

### Testlabor (Test Lab)
- Add/remove test blocks for A/B testing
- Real-time parameter adjustment with sliders
- Four preset configurations (Natural, Balanced, Expressive, Soft)
- Audio playback and download
- Practical testing tips in German

### Verwaltungspanel (Admin Panel)
- Manage test sentences
- Run batch tests
- View system information
- Model management interface

### Dokumentation (Documentation)
- Detailed parameter descriptions
- Preset explanations
- Best practices and common scenarios
- Use case guidance

## Parameters Explained

| Parameter | Range | Purpose |
|-----------|-------|---------|
| **Stimmvarianz** (Temperature) | 0.1-1.0 | Controls voice variation |
| **Sprechgeschwindigkeit** (Length Scale) | 0.5-2.0 | Controls speaking speed |
| **Klangvielfalt** (Noise Scale) | 0.0-1.0 | Controls voice clarity |
| **Prosodiefreiheit** (Noise Scale W) | 0.0-1.0 | Controls spectral properties |

## Presets

1. **Natürlich** (Natural): Consistent, formal speech
2. **Ausgeglichen** (Balanced): Good balance of clarity and naturalness
3. **Ausdrucksstark** (Expressive): Emotional, varied speech
4. **Sanft** (Soft): Gentle, calming voice

## Technology Stack

### Backend
- **Framework**: Flask with CORS support
- **TTS Engine**: Coqui TTS (VITS)
- **Audio Processing**: scipy
- **Server**: Werkzeug

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Pure CSS with CSS variables
- **State Management**: React Hooks

## Troubleshooting

### Model Not Loading
- Verify `model/best_model.pth` and `model/config.json` exist
- Check file paths are correct
- Ensure sufficient disk space

### CORS Errors
- Backend should run on `http://127.0.0.1:5000`
- Frontend should run on `http://127.0.0.1:3002`
- Flask-CORS must be installed

### GPU/CUDA Issues
- Application falls back to CPU automatically
- Check CUDA installation if GPU available
- CPU inference works but is slower

### TTS Generation Fails
- Check that text is not empty
- Verify text length is under 1000 characters
- Check backend logs for detailed error messages

## Performance Notes

- First inference is slower due to model warmup
- Subsequent requests are faster
- GPU inference is significantly faster than CPU
- Default parameters balanced for quality and speed

## Development

### Building Frontend
```powershell
cd frontend
npm run build
```
Output goes to `frontend/dist/`

### Linting
```powershell
cd frontend
npm run lint
```

### Testing TTS Directly
```powershell
python test_tts_direct.py
```

## Technical Details

### TTS API Patch
The backend includes a monkey-patch to handle the missing `is_multi_lingual` attribute in VITS models. See [TTS_API_PATCH.md](TTS_API_PATCH.md) for details.

### Configuration
- Backend CORS: Allows requests from `http://127.0.0.1:3000` and `http://127.0.0.1:3002`
- Max text length: 1000 characters
- Sample rate: 22050 Hz
- Audio format: WAV (mono)

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Responsive design supports:
- Desktop (1024px+)
- Tablet (768px-1024px)
- Mobile (< 768px)

## License

This application uses the Coqui TTS library (Mozilla Public License 2.0).

## References

- [Coqui TTS GitHub](https://github.com/coqui-ai/TTS)
- [VITS Paper](https://arxiv.org/abs/2106.06103)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues with:
- **TTS Model**: See Coqui TTS GitHub issues
- **Flask**: See Flask documentation
- **React/Vite**: See respective documentation
- **This Project**: Check documentation files

---

**Status**: ✅ Production Ready - Fully tested on Windows 10/11

**Last Updated**: December 2025
