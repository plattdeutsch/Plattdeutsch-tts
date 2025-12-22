# Backend Integration Guide — Admin Panel Logging System

**Target:** Flask backend integration for Plattdeutsch TTS Admin Panel  
**Status:** Specification (Ready for Backend Development)  
**Last Updated:** 2025-12-22

---

## 📋 Overview

The Admin Panel frontend is **production-ready** and has mock data. To make it fully operational, the Flask backend must:

1. **Capture inference logs** from synthesis operations
2. **Provide API endpoints** for the Admin Panel to query
3. **Validate parameters** and generate warnings
4. **Track system health** metrics
5. **Support log export** in multiple formats

---

## 🔌 Required API Endpoints

### 1. GET `/api/admin/logs`

**Purpose:** Fetch inference logs with optional filtering

**Query Parameters:**
```
?limit=50              # Default 50, max 1000
&offset=0              # Pagination
&preset=warm           # Filter by preset (optional)
&status=success        # Filter by status: success|warning|error (optional)
&startDate=2025-12-22  # Filter by date range (optional)
&endDate=2025-12-23
```

**Response:**
```json
{
  "success": true,
  "total": 247,
  "returned": 50,
  "logs": [
    {
      "requestId": "req-001",
      "timestamp": "2025-12-22T14:32:15Z",
      "textLength": 24,
      "preset": "warm",
      "parameters": {
        "temperature": 0.87,
        "lengthScale": 0.98,
        "noiseScale": 0.80,
        "noiseScaleW": 0.85,
        "rhythmicPauses": 0.65,
        "volumeBalance": 0.95,
        "pitchScale": 1.00,
        "speakingSpeed": 1.00
      },
      "inferenceDuration": 8200,
      "audioDuration": 3.2,
      "rtf": 2.56,
      "status": "success",
      "warnings": [],
      "systemMessages": []
    }
  ]
}
```

**Implementation Notes:**
- Logs should be ordered by timestamp DESC (newest first)
- Must support pagination for large datasets
- Consider indexing on (timestamp, preset, status) for performance

---

### 2. GET `/api/admin/system-status`

**Purpose:** Real-time system health check

**Response:**
```json
{
  "success": true,
  "data": {
    "model": {
      "name": "Plattdeutsch VITS v1.0",
      "version": "1.0",
      "modelHash": "abc123def456",
      "loaded": true
    },
    "hardware": {
      "type": "CPU",
      "memoryUsage": 245,
      "memoryTotal": 8192,
      "memoryPercent": 3.0
    },
    "performance": {
      "totalSynthesis": 247,
      "successCount": 243,
      "warningCount": 4,
      "errorCount": 0,
      "successRate": 98.39
    },
    "uptime": 3600,
    "lastError": null,
    "activeSessions": 12
  }
}
```

**Update Frequency:** Can be cached for 5-30 seconds (not real-time required)

---

### 3. POST `/api/admin/export`

**Purpose:** Generate logs export in requested format

**Request Body:**
```json
{
  "format": "json",  // json | csv | txt
  "filters": {
    "preset": "warm",           // optional
    "status": "success",        // optional
    "startDate": "2025-12-22",  // optional
    "endDate": "2025-12-23"     // optional
  }
}
```

**Response (Content-Type based on format):**

**JSON:**
```json
{
  "exportDate": "2025-12-22T14:40:00Z",
  "systemInfo": {
    "modelVersion": "VITS v1.0",
    "modelHash": "abc123def456",
    "hardware": "CPU",
    "memoryUsage": "245MB"
  },
  "logs": [...]
}
```

**CSV:**
```
Timestamp,TextLength,Preset,Temperature,Duration(ms),Status
2025-12-22T14:32:15Z,24,warm,0.87,8200,success
```

**TXT:**
```
PLATTDEUTSCH TTS - INFERENCE LOG EXPORT
Exported: 2025-12-22T14:40:00Z
Model: VITS v1.0
Hardware: CPU
...
```

---

### 4. POST `/api/admin/test-synthesis`

**Purpose:** Run synthesis for diagnostic testing (called by Diagnose-Test tab)

**Request Body:**
```json
{
  "text": "Dit is en Plattdeutsch Text zum Testen.",
  "preset": "warm",
  "testMode": true,
  "runNumber": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "test-req-001",
    "timestamp": "2025-12-22T14:40:00Z",
    "duration": 8200,
    "audioDuration": 3.2,
    "rtf": 2.56,
    "status": "success",
    "warnings": [],
    "audioBytes": "base64-encoded-audio-data"
  }
}
```

**Note:** Test mode runs should be logged but marked with `testMode: true` flag

---

## 🔄 Logging Middleware

Add middleware to capture all synthesis operations:

```python
from datetime import datetime
import uuid
import json

def log_inference(request_data, response_data, duration_ms, audio_duration_s):
    """
    Log every synthesis operation
    """
    log_entry = {
        "requestId": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "textLength": len(request_data.get("text", "")),
        "preset": request_data.get("preset", "manual"),
        "parameters": {
            "temperature": request_data.get("temperature"),
            "lengthScale": request_data.get("lengthScale"),
            "noiseScale": request_data.get("noiseScale"),
            "noiseScaleW": request_data.get("noiseScaleW"),
            "rhythmicPauses": request_data.get("rhythmicPauses"),
            "volumeBalance": request_data.get("volumeBalance"),
            "pitchScale": request_data.get("pitchScale"),
            "speakingSpeed": request_data.get("speakingSpeed"),
        },
        "inferenceDuration": duration_ms,
        "audioDuration": audio_duration_s,
        "rtf": audio_duration_s / (duration_ms / 1000),
        "status": "success",
        "warnings": validate_parameters(request_data),
        "systemMessages": get_system_info()
    }
    
    # Save to database
    save_inference_log(log_entry)
    
    return log_entry
```

---

## ⚠️ Parameter Validation & Warnings

Implement parameter validation that generates warnings (but doesn't block):

```python
def validate_parameters(params):
    """
    Validate parameters and return list of warnings
    """
    warnings = []
    
    # Temperature validation
    temp = params.get("temperature", 0.85)
    if temp < 0.75:
        warnings.append("temperature below recommended (0.75)")
    elif temp > 0.95:
        warnings.append("temperature above recommended (0.95)")
    
    # Noise Scale validation
    noise = params.get("noiseScale", 0.82)
    if noise < 0.75:
        warnings.append("noiseScale below recommended (0.75)")
    elif noise > 0.95:
        warnings.append("noiseScale above recommended (0.95)")
    
    # Length Scale validation
    length = params.get("lengthScale", 0.97)
    if length < 0.90:
        warnings.append("lengthScale below recommended (0.90)")
    elif length > 1.05:
        warnings.append("lengthScale above recommended (1.05)")
    
    # Noise Scale W validation
    noise_w = params.get("noiseScaleW", 0.82)
    if noise_w < 0.80:
        warnings.append("noiseScaleW below recommended (0.80)")
    elif noise_w > 0.98:
        warnings.append("noiseScaleW above recommended (0.98)")
    
    return warnings
```

---

## 📊 Database Schema (SQLite/PostgreSQL)

### Table: `inference_logs`

```sql
CREATE TABLE inference_logs (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  requestId VARCHAR(36) UNIQUE NOT NULL,
  timestamp DATETIME NOT NULL,
  textLength INTEGER NOT NULL,
  preset VARCHAR(20) NOT NULL,
  
  -- Parameters (8 total)
  temperature FLOAT,
  lengthScale FLOAT,
  noiseScale FLOAT,
  noiseScaleW FLOAT,
  rhythmicPauses FLOAT,
  volumeBalance FLOAT,
  pitchScale FLOAT,
  speakingSpeed FLOAT,
  
  -- Timing
  inferenceDuration INTEGER NOT NULL,  -- milliseconds
  audioDuration FLOAT NOT NULL,        -- seconds
  rtf FLOAT NOT NULL,                  -- real-time factor
  
  -- Status
  status VARCHAR(10) NOT NULL,         -- success|warning|error
  warnings JSON,                       -- Array of warning strings
  systemMessages JSON,                 -- Array of system info
  testMode BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_timestamp (timestamp DESC),
  INDEX idx_preset (preset),
  INDEX idx_status (status),
  INDEX idx_timestamp_preset (timestamp DESC, preset)
);
```

---

## 🔍 System Health Metrics

Endpoints that provide real-time health status:

**Current Implementation (Mock Data):**
```json
{
  "totalGenerations": 247,
  "successRate": 98.5,
  "avgDuration": 8.3,
  "activeUsers": 12
}
```

**Should Query:**
- `totalGenerations` → COUNT(*) from inference_logs
- `successRate` → (success_count / total_count) * 100
- `avgDuration` → AVG(inferenceDuration) / 1000
- `activeUsers` → COUNT(DISTINCT session_id) in last 60 minutes

---

## 🚀 Integration Checklist

### Backend Implementation
- [ ] Create `/api/admin/logs` endpoint with filtering
- [ ] Create `/api/admin/system-status` endpoint
- [ ] Create `/api/admin/export` endpoint (JSON/CSV/TXT)
- [ ] Add logging middleware to capture all synthesis ops
- [ ] Implement parameter validation with warnings
- [ ] Create `inference_logs` table in database
- [ ] Add indexes for performance (timestamp, preset, status)

### Testing
- [ ] Manually run synthesis → verify log created
- [ ] Query `/api/admin/logs` → verify data returned
- [ ] Export logs → verify JSON/CSV/TXT valid
- [ ] Run diagnostic test 3x → verify RTF calculation correct
- [ ] Parameter validation → verify warnings trigger

### Production Deployment
- [ ] Run database migrations
- [ ] Test with production load
- [ ] Monitor query performance
- [ ] Set up log retention policy (e.g., 30-day retention)

---

## 💾 Log Retention Policy (Recommended)

To manage database size:

```sql
-- Archive logs older than 30 days (run daily)
INSERT INTO inference_logs_archive
SELECT * FROM inference_logs
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);

DELETE FROM inference_logs
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## 🔐 Security Considerations

1. **Admin Endpoint Access Control**
   - Require authentication for `/api/admin/*` endpoints
   - Use API key or session-based auth
   - Log all admin access

2. **Rate Limiting**
   - Limit export endpoint (to prevent DoS)
   - Allow max 5 exports per minute per IP

3. **Data Privacy**
   - Don't log user identities (use session IDs)
   - Redact PII if present
   - Ensure exported files are handled securely

---

## 📚 Frontend-Backend Contract

**Frontend Expectations:**
1. `/api/admin/logs` returns paginated data
2. `/api/admin/system-status` returns health metrics
3. `/api/admin/export` returns file download with correct MIME type
4. All timestamps are ISO8601 UTC
5. RTF is pre-calculated (not computed on frontend)

**Backend Expectations:**
1. All synthesis operations are logged automatically
2. Parameter validation happens before logging
3. Logs persist even if synthesis fails
4. System status can handle concurrent requests

---

## 🧪 Example Request Flow

**Scenario: User clicks "Details" on log entry**

```
Frontend:
  GET /api/admin/logs?limit=50&offset=0
  
Backend:
  1. Query database: SELECT * FROM inference_logs ORDER BY timestamp DESC LIMIT 50
  2. Return JSON with all parameters visible
  
Frontend:
  3. User clicks "Details" button
  4. Expand row in table to show parameter details
  (No additional API call needed — data already in row)
```

**Scenario: User exports logs as CSV**

```
Frontend:
  POST /api/admin/export
  {
    "format": "csv",
    "filters": { "preset": "warm" }
  }
  
Backend:
  1. Query: SELECT * FROM inference_logs WHERE preset='warm'
  2. Format as CSV
  3. Return with Content-Type: text/csv
  
Frontend:
  4. Browser downloads file as "inference-logs-{timestamp}.csv"
```

---

## 📞 Next Steps

1. **Create database schema** (inference_logs table)
2. **Implement logging middleware** (capture all synthesis ops)
3. **Build API endpoints** (logs, system-status, export)
4. **Test with Admin Panel frontend** (already waiting)
5. **Deploy to production** (logs will be live)

---

**Document Version:** 1.0  
**Status:** Ready for Backend Development  
**Questions?** Refer to [ADMIN_PANEL_SPECIFICATION.md](./ADMIN_PANEL_SPECIFICATION.md)
