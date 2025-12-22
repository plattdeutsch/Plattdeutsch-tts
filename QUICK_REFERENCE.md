# Quick Reference - Plattdeutsch TTS

## 🚀 START HERE

### Option 1: Automatic Setup (Recommended)
```powershell
.\setup.bat
```

### Option 2: Manual Setup

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

**Access:** http://127.0.0.1:3002

---

## 🔗 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://127.0.0.1:3002 | Main app |
| **Backend** | http://127.0.0.1:5000 | API server |
| **Health Check** | http://127.0.0.1:5000/api/health | Diagnostics |

---

## 🎚️ Parameters Quick Guide

| German Name | English Name | Min | Max | Default | Use |
|---|---|---|---|---|---|
| **Stimmvarianz** | Temperature | 0.1 | 1.0 | 0.7 | Voice variation |
| **Sprechgeschwindigkeit** | Length Scale | 0.5 | 2.0 | 1.0 | Speaking speed |
| **Klangvielfalt** | Noise Scale | 0.0 | 1.0 | 0.6 | Voice clarity |
| **Prosodiefreiheit** | Noise Scale W | 0.0 | 1.0 | 0.8 | Prosody freedom |

---

## 🎯 Presets

### 1. Natürlich (Natural)
- Temp: 0.5 | Speed: 1.0 | Quality: 0.4 | Prosody: 0.6
- **Use:** Formal presentations, consistent reading

### 2. Ausgeglichen (Balanced)
- Temp: 0.7 | Speed: 1.0 | Quality: 0.6 | Prosody: 0.8
- **Use:** General use, natural but clear

### 3. Ausdrucksstark (Expressive)
- Temp: 0.9 | Speed: 1.1 | Quality: 0.8 | Prosody: 0.9
- **Use:** Emotional content, varied tone

### 4. Sanft (Soft)
- Temp: 0.3 | Speed: 0.9 | Quality: 0.3 | Prosody: 0.5
- **Use:** Gentle voice, calming tone

---

## 📁 Project Structure

```
Plattdeutsch-tts/
├── backend/          → Flask TTS API
├── frontend/         → React web interface
├── model/            → VITS model files
└── docs/             → Documentation
```

---

## 🔧 Common Commands

### Backend
```powershell
# Start server
cd backend && .venv\Scripts\activate && python app.py

# Test directly
python test_tts_direct.py

# Check health
curl http://127.0.0.1:5000/api/health
```

### Frontend
```powershell
# Development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Lint code
cd frontend && npm run lint
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Model not found** | Place `best_model.pth` and `config.json` in `model/` |
| **CORS error** | Make sure both servers are running on correct ports |
| **Port already in use** | Check if another app is using 5000 or 3002 |
| **npm not found** | Install Node.js from https://nodejs.org |
| **Python not found** | Install Python from https://python.org |
| **TTS error** | Check `test_tts_direct.py` output for details |

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `backend/app.py` | Main Flask application |
| `frontend/src/App.jsx` | React main component |
| `README.md` | Full documentation |
| `QUICKSTART_DE.md` | German setup guide |
| `setup.bat` | Automatic setup |
| `test_tts_direct.py` | Direct TTS testing |

---

## 🌍 Interface Pages

1. **Testlabor** (Test Lab)
   - A/B testing interface
   - Multiple test blocks
   - Parameter adjustment
   - Audio comparison

2. **Verwaltung** (Admin)
   - Test sentence management
   - Batch testing
   - System information

3. **Dokumentation** (Docs)
   - Parameter guides
   - Preset explanations
   - Best practices
   - Use case recommendations

---

## 📝 Example API Call

```python
import requests

response = requests.post(
    'http://127.0.0.1:5000/api/tts',
    json={
        'text': 'Dat is en Test vun de Plattdüütsche TTS.',
        'temperature': 0.7,
        'length_scale': 1.0,
        'noise_scale': 0.6,
        'noise_scale_w': 0.8
    }
)

with open('output.wav', 'wb') as f:
    f.write(response.content)
```

---

## ✅ Verification

```powershell
# Test backend
python test_tts_direct.py

# Test API
curl http://127.0.0.1:5000/api/health

# Test frontend build
cd frontend && npm run build
```

---

## 🚀 Deployment Checklist

- [ ] Model files present in `model/`
- [ ] All dependencies installed
- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] API endpoints responding
- [ ] Audio generation working
- [ ] Download functionality working
- [ ] All parameters validated

---

## 📞 Support

- **TTS Issues**: https://github.com/coqui-ai/TTS
- **Python Help**: https://python.org
- **React Help**: https://react.dev
- **Flask Help**: https://flask.palletsprojects.com

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2025  
**Language**: German (100% Localized)
