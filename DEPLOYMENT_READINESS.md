# Deployment Readiness Checklist

## Plattdeutsch TTS - AWS Elastic Beanstalk Deployment

**Status:** ✅ READY FOR DEPLOYMENT  
**Date:** 2025-12-26  
**Target:** AWS Elastic Beanstalk (eu-central-1)

---

## ✅ Code Adjustments Made

### 1. New Backend Entry Point (`backend/application.py`)

- [x] Flask application factory pattern
- [x] Starts successfully **without** a model loaded
- [x] Returns HTTP 200 on `/api/health` even without model
- [x] Returns HTTP 503 with clear error message when TTS called without model
- [x] Model upload API (`POST /api/admin/models/upload`)
- [x] Model activation API (`POST /api/admin/models/activate`)
- [x] Model deactivation API (`POST /api/admin/models/deactivate`)
- [x] Admin token authentication for sensitive endpoints
- [x] Serves built React frontend as static files
- [x] CORS configuration via environment variables
- [x] Production logging to stdout

### 2. EB Configuration Files (`.ebextensions/`)

| File | Purpose |
|------|---------|
| `01_python.config` | Python platform, WSGI path, health check |
| `02_models.config` | Persistent model storage at `/var/app/models` |
| `03_packages.config` | System dependencies (libsndfile, espeak-ng) |
| `04_nginx.config` | Nginx config for 1GB file uploads |

### 3. CI/CD Pipeline (`.github/workflows/deploy.yml`)

- [x] Builds React frontend (`npm run build`)
- [x] Tests backend startup without model
- [x] Creates deployment ZIP with frontend + backend
- [x] Uploads to S3
- [x] Creates EB application version
- [x] Deploys to environment
- [x] Validates health endpoint post-deployment

### 4. Supporting Files

| File | Purpose |
|------|---------|
| `Procfile` | Gunicorn startup command |
| `backend/gunicorn.conf.py` | Production Gunicorn settings |
| `backend/requirements.txt` | Python dependencies (includes gunicorn) |
| `frontend/vite.config.js` | Updated for production build |

---

## ✅ Requirements Verification

| Requirement | Status | Notes |
|-------------|--------|-------|
| ML model NOT in repository | ✅ | `.gitignore` excludes `*.pth` files |
| App starts without model | ✅ | Verified by `test_deployment.py` |
| Admin UI for model upload | ✅ | `/api/admin/models/*` endpoints |
| Frontend built during CI | ✅ | GitHub Actions builds with npm |
| Flask serves static frontend | ✅ | `application.py` serves from `/static` |
| Dependencies via requirements.txt | ✅ | `backend/requirements.txt` |
| No hardcoded secrets | ✅ | Uses environment variables |
| AWS creds via GitHub Secrets | ✅ | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |
| ZIP deployment (not Docker) | ✅ | GitHub Actions creates ZIP |
| Health check at `/api/health` | ✅ | Returns 200 always |
| Model directory persists | ✅ | `/var/app/models` survives deployments |

---

## ✅ Error Handling (No Model Loaded)

| Endpoint | Status Code | Response |
|----------|-------------|----------|
| `GET /api/health` | 200 | `{"status": "ok", "model_loaded": false}` |
| `GET /api/status` | 200 | Full status with model info |
| `POST /api/tts` | 503 | `{"error": "Model not loaded", "code": "MODEL_NOT_LOADED"}` |
| `GET /api/info` | 503 | `{"error": "Model not loaded", "code": "MODEL_NOT_LOADED"}` |

---

## 🚀 Deployment Steps

### Step 1: Configure AWS

1. Create Elastic Beanstalk Application: `plattdeutsch-tts-app`
2. Create Environment: `Plattdeutsch-tts-app-env`
   - Platform: Python 3.11 on Amazon Linux 2023
   - Instance: t3.medium (minimum)

### Step 2: Set GitHub Secrets

```
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
```

### Step 3: Set EB Environment Variables

```
ADMIN_TOKEN=<secure-random-string>
SECRET_KEY=<secure-random-string>
MODEL_BASE_PATH=/var/app/models
```

### Step 4: Push to Deploy

```bash
git push origin main
```

### Step 5: Upload Model (Post-Deployment)

```bash
curl -X POST "http://<eb-url>/api/admin/models/upload" \
  -H "X-Admin-Token: <your-token>" \
  -F "model=@plattdeutsch-model.zip" \
  -F "name=plattdeutsch-v1"

curl -X POST "http://<eb-url>/api/admin/models/activate" \
  -H "X-Admin-Token: <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "plattdeutsch-v1"}'
```

---

## 📁 Final Repository Structure

```
plattdeutsch-tts/
├── .ebextensions/
│   ├── 01_python.config      # NEW
│   ├── 02_models.config      # NEW
│   ├── 03_packages.config    # NEW
│   └── 04_nginx.config       # NEW
├── .github/workflows/
│   └── deploy.yml            # NEW
├── backend/
│   ├── application.py        # NEW - Main entry point
│   ├── gunicorn.conf.py      # NEW
│   ├── requirements.txt      # MODIFIED - added gunicorn
│   ├── test_deployment.py    # NEW
│   └── ... (existing files)
├── frontend/
│   ├── vite.config.js        # MODIFIED - production build settings
│   └── ... (existing files)
├── .gitignore                 # MODIFIED - exclude models, frontend/dist
├── Procfile                   # NEW
├── AWS_DEPLOYMENT.md          # NEW
└── DEPLOYMENT_READINESS.md    # NEW (this file)
```

---

## ✅ Confirmation

**The application can be launched safely without the model.**

- Health check returns 200 ✓
- TTS endpoints return 503 with clear error ✓
- Model can be uploaded post-deployment ✓
- Frontend is served by Flask ✓
- All sensitive data via environment variables ✓

---

**Ready for production deployment to AWS Elastic Beanstalk.**
