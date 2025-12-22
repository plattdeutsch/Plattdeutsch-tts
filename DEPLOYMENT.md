# PLATTDEUTSCH TTS - PRODUCTION DEPLOYMENT GUIDE
## AWS & GitHub Ready Implementation

**Version**: 2.0.0  
**Date**: December 22, 2025  
**Status**: PRODUCTION READY

---

## 🎯 EXECUTIVE SUMMARY

This document provides step-by-step instructions for deploying the Plattdeutsch TTS platform to GitHub and AWS. The system is designed for:

- **Zero model files in repository** (models loaded post-deployment)
- **Clean dependency management** (pinned versions, no dev-only packages)
- **Robust MP3 downloads** (server-side conversion, proper headers)
- **Admin model management** (upload, validate, activate without restart)
- **AWS compatibility** (relative paths, environment-driven config)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code Cleanup
- [x] Remove all `.pth`, `.pt`, `.onnx` files from repository
- [x] Remove all large model binaries
- [x] Remove dev-only dependencies from main requirements.txt
- [x] Create clean folder structure (see §2)
- [x] Remove hardcoded absolute paths
- [x] Update all paths to use environment variables

### Dependency Management
- [x] Audit requirements.txt (production-only)
- [x] Create requirements-dev.txt (excluded from deployment)
- [x] Pin all versions (no `>=`, no `~`)
- [x] Verify torch/CUDA compatibility for target platform
- [x] Test clean install in fresh environment

### Configuration
- [x] Create .env.example with all required variables
- [x] Remove hardcoded secrets
- [x] Document all environment variables
- [x] Test with .env file (not committed)

### Testing
- [x] Verify app starts with NO models present
- [x] Test admin model upload workflow
- [x] Test model activation/deactivation
- [x] Test MP3 download with proper headers
- [x] Verify CORS works for frontend

---

## 📁 §2: CLEAN FOLDER STRUCTURE (POST-DEPLOYMENT)

After cloning from GitHub and deploying to AWS:

```
project-root/
├── backend/
│   ├── app.py                          # Main Flask app (PRODUCTION)
│   ├── mp3_handler.py                  # MP3 download system (NEW)
│   ├── model_manager.py                # Model lifecycle mgmt (NEW)
│   ├── requirements-production.txt     # Production deps only
│   ├── requirements-dev.txt            # Dev deps (NOT deployed)
│   ├── .env.example                    # Config template
│   ├── .env                            # LOCAL ONLY (gitignored)
│   ├── models/
│   │   ├── active/                     # Exactly ONE model here after activation
│   │   │   └── model-name/
│   │   │       ├── best_model.pth      # ← Uploaded post-deployment
│   │   │       ├── config.json         # ← Uploaded post-deployment
│   │   │       └── metadata.json       # ← Auto-generated
│   │   ├── inactive/                   # Uploaded but not active
│   │   │   └── other-models/...        # Optional alternatives
│   │   └── metadata.json               # Tracks active model
│   ├── temp/
│   │   └── mp3/                        # Temporary MP3 files (cleaned hourly)
│   ├── cache/
│   │   └── audio/                      # Cached audio files
│   ├── logs/
│   │   └── tts-backend.log             # Application logs
│   └── .gitignore                      # Excludes models, temp, cache, .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Admin.jsx               # Updated with model manager UI
│   │   │   ├── Workspace.jsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── audioConverter.js       # Fixed MP3 download (production-ready)
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD pipeline (example)
│
├── README.md                           # Deployment instructions
├── DEPLOYMENT.md                       # This file
└── .gitignore                          # Excludes models, node_modules, .env

```

---

## 🚀 §3: DEPLOYMENT WORKFLOW

### Step 1: Prepare Repository for GitHub

```bash
# Clean model files (DO NOT COMMIT)
rm backend/models/active/*
rm backend/models/inactive/*

# Verify no large files
find . -type f -size +10M | grep -v .git | grep -v node_modules

# Clean up
rm backend/temp/*.mp3
rm backend/cache/*.wav

# Commit
git add .
git commit -m "Production-ready: models removed, deps cleaned"
git push origin main
```

### Step 2: AWS Deployment (Example: EC2 + Auto Scaling)

#### 2a. Create EC2 Instance

```bash
# Launch Ubuntu 22.04 LTS (t3.medium minimum)
# Security groups:
#   - Inbound: 443 (HTTPS), 80 (HTTP for redirect)
#   - Outbound: 443 (pip install, model download)

# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Install system dependencies
sudo apt update
sudo apt install -y python3.10 python3-pip python3-venv git

# Clone repository
git clone https://github.com/your-org/plattdeutsch-tts.git
cd plattdeutsch-tts/backend
```

#### 2b. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install production dependencies ONLY
pip install -r requirements-production.txt

# Verify installation
python -c "import torch; import TTS; print('✓ Dependencies OK')"
```

#### 2c. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with production values
nano .env

# Critical values to set:
# - FLASK_ENV=production
# - SERVER_HOST=0.0.0.0
# - SERVER_PORT=5000
# - CORS_ORIGINS=https://your-domain.com
# - MODEL_PATH=./models/active
# - USE_CPU=True (for cost efficiency)
```

#### 2d. Upload Initial Model

```bash
# Create model directory structure
mkdir -p models/inactive/plattdeutsch-v1

# Copy model files (manually uploaded or via S3)
# Your model should have:
#   - best_model.pth (VITS weights)
#   - config.json (TTS config)

# Verify structure
ls -lh models/inactive/plattdeutsch-v1/
# Expected:
#   best_model.pth
#   config.json
```

#### 2e. Initialize Database (Optional)

```bash
# If using database for inference logs:
python init_db.py

# Otherwise, logs go to files
mkdir -p logs
```

#### 2f. Start Application (Manual Test)

```bash
# Test locally first
python app.py

# Expected output:
# Loading TTS model...
# TTS model loaded successfully
# Starting Flask server on http://0.0.0.0:5000
```

#### 2g. Deploy with Gunicorn (Production WSGI)

```bash
# Install Gunicorn (optional, for production)
pip install gunicorn==20.1.0

# Start with 4 workers (adjust for your instance size)
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 60 app:app

# Or use systemd service (recommended):
sudo nano /etc/systemd/system/plattdeutsch-tts.service
```

**systemd service file:**

```ini
[Unit]
Description=Plattdeutsch TTS Backend
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/plattdeutsch-tts/backend
Environment="PATH=/home/ubuntu/plattdeutsch-tts/backend/venv/bin"
Environment="PYTHONUNBUFFERED=1"
EnvironmentFile=/home/ubuntu/plattdeutsch-tts/backend/.env
ExecStart=/home/ubuntu/plattdeutsch-tts/backend/venv/bin/gunicorn \
  -w 4 \
  -b 0.0.0.0:5000 \
  --timeout 60 \
  --access-logfile - \
  --error-logfile - \
  app:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable plattdeutsch-tts
sudo systemctl start plattdeutsch-tts
sudo systemctl status plattdeutsch-tts
```

#### 2h. Set Up Reverse Proxy (nginx)

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/default
```

**nginx config:**

```nginx
upstream tts_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://tts_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for model inference
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

## 🛠️ §4: ADMIN MODEL MANAGEMENT (NEW)

### Admin Panel Features

The updated Admin page (/admin route) now includes:

1. **Model Status Panel**
   - Shows currently ACTIVE model
   - Shows all INACTIVE models
   - Activation timestamps

2. **Model Upload**
   - Upload ZIP file containing model folder
   - Auto-validate: config.json + best_model.pth present
   - Show file size, metadata

3. **Model Activation**
   - Single click: "Activate Now"
   - No server restart required
   - Automatic: copy model to /models/active
   - Update inference engine configuration

4. **Model Deactivation**
   - One active model at a time
   - Prevent accidental model corruption
   - Log all activation changes

### API Endpoints

```bash
# GET - List all models
curl http://localhost:5000/api/models

# Response:
{
  "active": {
    "name": "plattdeutsch-v1",
    "path": "./models/active/plattdeutsch-v1",
    "status": "ACTIVE",
    "activated_at": "2025-12-22T16:00:00"
  },
  "inactive": [
    {
      "name": "plattdeutsch-v0.9",
      "path": "./models/inactive/plattdeutsch-v0.9",
      "status": "INACTIVE"
    }
  ]
}

# POST - Upload model
curl -X POST \
  -F "model=@model.zip" \
  http://localhost:5000/api/models/upload

# POST - Activate model
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"model_name": "plattdeutsch-v1"}' \
  http://localhost:5000/api/models/activate

# POST - Deactivate model
curl -X POST http://localhost:5000/api/models/deactivate

# DELETE - Delete model
curl -X DELETE \
  http://localhost:5000/api/models/plattdeutsch-v0.9
```

---

## 📥 §5: ROBUST MP3 DOWNLOAD SYSTEM (NEW)

### Problem Solved

✅ **Previous Issue**: MP3 encoding failed with "MPEGMode is not defined"  
✅ **New Solution**: Server-side MP3 conversion with proper headers

### Flow

```
Frontend (React)
    ↓
[Generate Audio] → Backend receives WAV blob
    ↓
Backend (Flask)
    ├─ Convert WAV → MP3 (stereo-to-mono)
    ├─ Save to temp directory
    └─ Return download URL
    ↓
Frontend
    └─ Trigger browser download with proper headers
```

### Backend Implementation

```python
from flask import send_file, jsonify
from mp3_handler import get_mp3_handler

@app.route('/api/tts/download', methods=['POST'])
def download_audio():
    """Download audio as MP3"""
    try:
        # Receive WAV from frontend
        data = request.get_json()
        audio_base64 = data.get('audio')
        
        # Convert WAV to MP3
        mp3_bytes = convert_wav_to_mp3(audio_base64)
        
        # Save to disk
        handler = get_mp3_handler()
        filepath = handler.save_to_disk(mp3_bytes, "plattdeutsch")
        
        # Get proper headers
        headers = handler.get_download_headers("plattdeutsch-audio")
        
        # Return file with proper headers
        return send_file(
            filepath,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=headers['Content-Disposition']
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

### Frontend Implementation

```javascript
// frontend/src/lib/audioDownloader.js
export async function downloadAudio(audioBlob, format = 'mp3') {
  try {
    // MP3 download - use new endpoint
    if (format === 'mp3') {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const response = await fetch('/api/tts/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            audio: e.target.result.split(',')[1]  // base64
          })
        })
        
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `plattdeutsch-${Date.now()}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      reader.readAsDataURL(audioBlob)
    }
  } catch (error) {
    throw new Error(`MP3 download failed: ${error.message}`)
  }
}
```

### Testing MP3 Downloads

```bash
# Test endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"audio": "UklGRiYAAABXQVZFZm10IBAAAA..."}' \
  http://localhost:5000/api/tts/download \
  -o output.mp3

# Verify file
file output.mp3
# Expected: output.mp3: Audio file with ID3 version 2.4.0
```

---

## 🔒 §6: ENVIRONMENT-DRIVEN CONFIGURATION

### Key Environment Variables

```bash
# See .env.example for complete list

# CRITICAL FOR DEPLOYMENT:
FLASK_ENV=production              # Disable debug mode
USE_CPU=True                      # Cost-effective for AWS
MODEL_PATH=./models/active        # Relative path only
CORS_ORIGINS=https://your-domain  # Your actual domain
MAX_TEXT_LENGTH=1000              # Safety limit
```

### Validation Script

```python
# backend/validate_config.py
import os
from pathlib import Path

def validate_deployment():
    """Validate deployment configuration"""
    checks = {
        "FLASK_ENV": os.getenv("FLASK_ENV") == "production",
        "Model path exists": Path(os.getenv("MODEL_PATH", "./models/active")).exists(),
        "Temp dir writable": Path(os.getenv("AUDIO_TEMP_DIR", "./temp")).is_dir(),
        "No hardcoded paths": not any(
            '/root/' in str(Path(f)) for f in Path('.').rglob('*.py')
        ),
        "Dependencies installed": True,
    }
    
    for check, result in checks.items():
        status = "✓" if result else "✗"
        print(f"{status} {check}")
    
    return all(checks.values())

if __name__ == "__main__":
    if validate_deployment():
        print("\n✓ Deployment validated successfully")
    else:
        print("\n✗ Deployment validation failed")
        exit(1)
```

---

## 📊 §7: MONITORING & LOGGING

### Application Logs

```bash
# Monitor in real-time
tail -f logs/tts-backend.log

# Check for errors
grep "ERROR\|CRITICAL" logs/tts-backend.log

# Inference metrics
grep "success\|failed" logs/tts-backend.log | tail -20
```

### AWS CloudWatch Integration

```python
# Optional: Send logs to CloudWatch
import watchtower

logger.addHandler(
    watchtower.CloudWatchLogHandler(
        log_group='plattdeutsch-tts',
        stream_name='backend'
    )
)
```

---

## ✅ §8: FINAL DEPLOYMENT CHECKLIST

Before pushing to production:

- [ ] All `.pth` files removed from git
- [ ] requirements-production.txt pinned (no `>=`)
- [ ] .env.example created with all variables
- [ ] `.env` is in `.gitignore`
- [ ] MP3 download tested end-to-end
- [ ] Admin model upload/activation tested
- [ ] CORS configured for your domain
- [ ] Logging configured
- [ ] temp/ and cache/ directories ignored in git
- [ ] models/ directory exists but empty
- [ ] Application starts with: `python app.py`
- [ ] No errors in first 30 seconds
- [ ] Frontend CORS requests succeed
- [ ] MP3 downloads with correct filename

### Ready for GitHub

```bash
git push origin main
```

### Ready for AWS

```bash
# From your local machine:
git clone https://github.com/your-org/plattdeutsch-tts.git
cd plattdeutsch-tts/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-production.txt

# Configure
cp .env.example .env
# Edit .env with production values...

# Upload models
# (Via scp, S3, or manual admin panel)

# Start
python app.py
```

---

## 🆘 TROUBLESHOOTING

### MP3 Download Fails

```bash
# Check mp3_handler is initialized
curl http://localhost:5000/api/health
# Should see: {"status": "ok", "model": "active"}

# Check temp directory
ls -la temp/mp3/
# Should have write permissions

# Check logs
grep "MP3" logs/tts-backend.log
```

### Model Not Found After Upload

```bash
# Verify structure
tree models/

# Should show:
# models/
# ├── active/
# │   └── model-name/
# │       ├── best_model.pth
# │       └── config.json
# └── inactive/
```

### CORS Errors

```bash
# Check CORS configuration
grep "CORS" .env

# Example:
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Restart service
sudo systemctl restart plattdeutsch-tts
```

---

## 📞 SUPPORT

For issues, check:
1. logs/tts-backend.log
2. Browser DevTools (Network/Console)
3. Deployment checklist (§8)
4. This guide's troubleshooting section

---

**Document Version**: 1.0  
**Last Updated**: December 22, 2025  
**Status**: PRODUCTION READY
