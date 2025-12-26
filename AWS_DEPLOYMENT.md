# AWS Elastic Beanstalk Deployment Guide

## Plattdeutsch TTS Application

**Application Name:** `plattdeutsch-tts-app`  
**Environment Name:** `Plattdeutsch-tts-app-env`  
**Region:** `eu-central-1` (Frankfurt)  
**Deployment Method:** ZIP via GitHub Actions

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Elastic Beanstalk                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │   Nginx     │───▶│   Gunicorn  │───▶│  Flask Application  │  │
│  │  (Proxy)    │    │  (WSGI)     │    │  (application.py)   │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│         │                                        │              │
│         │                               ┌────────┴────────┐     │
│         │                               │                 │     │
│         ▼                               ▼                 ▼     │
│  ┌─────────────┐                 ┌───────────┐    ┌───────────┐ │
│  │   Static    │                 │ TTS API   │    │  Admin    │ │
│  │  Frontend   │                 │ Endpoints │    │  Panel    │ │
│  │  (React)    │                 └───────────┘    └───────────┘ │
│  └─────────────┘                        │                       │
│                                         ▼                       │
│                                 ┌───────────────┐               │
│                                 │  /var/app/    │               │
│                                 │   models/     │               │
│                                 │  (Persistent) │               │
│                                 └───────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

### 1. AWS Setup

- [ ] AWS Account with Elastic Beanstalk access
- [ ] IAM User with programmatic access and these policies:
  - `AWSElasticBeanstalkFullAccess`
  - `AmazonS3FullAccess` (for deployment artifacts)
- [ ] Elastic Beanstalk Application created: `plattdeutsch-tts-app`
- [ ] Environment created: `Plattdeutsch-tts-app-env`
  - Platform: Python 3.11 running on 64bit Amazon Linux 2023
  - Instance type: `t3.medium` (minimum for TTS)

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM User Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Access Key |

### 3. Environment Variables (EB Console)

Set these in Elastic Beanstalk Configuration > Software:

| Variable | Value | Description |
|----------|-------|-------------|
| `ADMIN_TOKEN` | `<secure-random-string>` | **Required** - Admin authentication |
| `SECRET_KEY` | `<secure-random-string>` | Flask session security |
| `MODEL_BASE_PATH` | `/var/app/models` | Model storage location |
| `CORS_ORIGINS` | `*` | Allowed CORS origins |

**Generate secure tokens:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

1. Push to `main` or `master` branch
2. GitHub Actions workflow triggers automatically
3. Frontend is built (npm run build)
4. Backend is tested (startup without model)
5. ZIP package is created and uploaded
6. Elastic Beanstalk deploys the new version

### Manual Deployment

```bash
# 1. Build frontend
cd frontend
npm ci
npm run build

# 2. Create deployment package
cd ..
mkdir -p deploy
cp -r backend/* deploy/
cp -r frontend/dist deploy/static
cp -r .ebextensions deploy/
cp Procfile deploy/

# 3. Create ZIP
cd deploy
zip -r ../plattdeutsch-tts.zip .

# 4. Upload via AWS Console or EB CLI
eb deploy
```

---

## 🔧 Post-Deployment: Upload Model

The application starts WITHOUT a model. You must upload one via the Admin Panel.

### Option 1: Admin API (curl)

```bash
# Set your environment URL and admin token
EB_URL="http://plattdeutsch-tts-app-env.eu-central-1.elasticbeanstalk.com"
ADMIN_TOKEN="your-admin-token"

# Upload model (ZIP containing best_model.pth and config.json)
curl -X POST "${EB_URL}/api/admin/models/upload" \
  -H "X-Admin-Token: ${ADMIN_TOKEN}" \
  -F "model=@plattdeutsch-model.zip" \
  -F "name=plattdeutsch-v1"

# Activate model
curl -X POST "${EB_URL}/api/admin/models/activate" \
  -H "X-Admin-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name": "plattdeutsch-v1"}'

# Verify
curl "${EB_URL}/api/health"
```

### Option 2: Admin UI

1. Navigate to `http://<your-eb-url>/admin`
2. Enter Admin Token
3. Upload model ZIP file
4. Click "Activate"

### Model ZIP Structure

```
plattdeutsch-model.zip
├── best_model.pth    (~950 MB)
└── config.json       (~10 KB)
```

---

## 🏥 Health Monitoring

### Health Check Endpoint

```
GET /api/health

Response (without model):
{
  "status": "ok",
  "model_loaded": false,
  "model_name": null,
  "timestamp": "2025-12-26T10:00:00"
}

Response (with model):
{
  "status": "ok",
  "model_loaded": true,
  "model_name": "plattdeutsch-v1",
  "timestamp": "2025-12-26T10:00:00"
}
```

### Status Endpoint

```
GET /api/status

Response:
{
  "application": "Plattdeutsch TTS",
  "version": "2.0.0",
  "environment": "production",
  "model": {
    "loaded": true,
    "name": "plattdeutsch-v1",
    "loaded_at": "2025-12-26T10:05:00"
  }
}
```

---

## 🔒 Security Considerations

1. **ADMIN_TOKEN**: Always set a strong, unique token in production
2. **HTTPS**: Configure SSL certificate via ACM + Load Balancer
3. **Security Groups**: Restrict inbound to port 443 only
4. **IAM**: Use least-privilege IAM roles

---

## 📊 Scaling Recommendations

| Load | Instance Type | Workers | Notes |
|------|---------------|---------|-------|
| Light (< 100 req/hr) | t3.medium | 2 | Default configuration |
| Medium (< 1000 req/hr) | t3.large | 4 | Increase `WEB_CONCURRENCY` |
| Heavy (> 1000 req/hr) | c5.xlarge | 8 | CPU-optimized instances |

---

## 🐛 Troubleshooting

### Application won't start

```bash
# Check EB logs
eb logs

# Common issues:
# - Missing environment variables
# - Python dependency conflicts
# - Insufficient memory (need t3.medium+)
```

### Model upload fails

```bash
# Check nginx config allows large uploads
# Max upload size: 1.1 GB

# Verify model ZIP structure
unzip -l your-model.zip
# Must contain: best_model.pth, config.json
```

### TTS returns 503

```bash
# Model not loaded - check:
curl http://your-url/api/status

# If model_loaded: false, upload and activate a model
```

---

## 📁 File Structure

```
plattdeutsch-tts/
├── .ebextensions/           # EB configuration
│   ├── 01_python.config     # Python platform settings
│   ├── 02_models.config     # Model directory persistence
│   ├── 03_packages.config   # System dependencies
│   └── 04_nginx.config      # Nginx large upload config
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions CI/CD
├── backend/
│   ├── application.py       # Main Flask app (EB entry point)
│   ├── gunicorn.conf.py     # Gunicorn configuration
│   ├── requirements.txt     # Python dependencies
│   └── static/              # Built frontend (added during CI)
├── frontend/
│   ├── src/                 # React source code
│   └── dist/                # Built output (gitignored)
├── Procfile                 # EB process definition
└── AWS_DEPLOYMENT.md        # This file
```

---

## ✅ Deployment Verification Checklist

After deployment, verify:

- [ ] `/api/health` returns 200 with `status: ok`
- [ ] Frontend loads at root URL `/`
- [ ] Model upload works via Admin Panel
- [ ] Model activation succeeds
- [ ] TTS generation works after model activation
- [ ] CloudWatch logs are streaming

---

**Last Updated:** 2025-12-26  
**Version:** 2.0.0
