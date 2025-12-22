# Admin Panel — Quick Start Guide

**Plattdeutsch TTS v1.0**  
Access at: `http://localhost:3002/admin`

---

## 🎯 Five Core Tabs

### 1. 📊 **Logs** — Inference Log Dashboard
Real-time view of all synthesis operations with expandable parameter details.

**Quick Actions:**
- Click "Details" to see all 8 VITS parameters for any synthesis run
- View warnings (e.g., "temperature below recommended (0.75)")
- Track Real-Time Factor (RTF) — system performance metric

**When to Use:**
- Monitor synthesis quality in production
- Find problematic synthesis runs
- Trace parameter values for specific requests

---

### 2. 🧪 **Diagnose-Test** — Multi-Run Reproducibility Testing
Run the same text 3 times with the same preset to detect artifact patterns.

**Quick Actions:**
1. Paste Plattdeutsch text
2. Select preset (Warm, Klar, Dynamisch, Erzähler)
3. Click "Starte 3x Test"
4. View variability: Min/Max/Range in milliseconds

**When to Use:**
- QA Testing: "Does this preset consistently produce good quality?"
- Artifact Diagnosis: "Does the robotic sound persist across runs?"
- Performance Check: "Is latency consistent or does it spike?"

**Interpretation:**
- ✅ **Tight Range (< 100ms)** = Stable system
- ⚠️ **Wide Range (> 500ms)** = CPU load or memory pressure

---

### 3. 📦 **Modelle** — Model Management
Upload new VITS models and track versions.

**Quick Actions:**
- Click "Hochladen" to upload new `.pth` model file
- Click "Hochladen" to upload corresponding `.json` config file
- Delete archived models with trash icon

**When to Use:**
- Deploy new VITS model version
- Manage model versioning
- Archive old models

---

### 4. 📥 **Export** — Log Export & Audit
Generate structured exports for bug reports and QA analysis.

**Three Export Formats:**
1. **📄 JSON** — Complete structured data with system metadata
2. **📊 CSV** — Spreadsheet-friendly for analysis
3. **📝 TXT Report** — Human-readable summary

**When to Use:**
- Bug reports: "Export logs → send to developers"
- QA Audits: "CSV export → analyze parameter patterns"
- Performance Benchmarking: "JSON export → statistical analysis"

---

## 🔍 Understanding the Logs

### Table Columns

| Column | Means | Example |
|--------|-------|---------|
| **Timestamp** | When synthesis ran | 14:32:15 |
| **Preset** | Which voice preset | warm, klar, dynamisch, erzähler |
| **Dauer** | Inference time | 8200ms (8.2 seconds) |
| **RTF** | Speed vs. real-time | 2.56x = system is 2.5x slower than real-time |
| **Status** | Success or warning | ✓ OK or ⚠ Warning |

### Expanded Log View

Click "Details" to see:
- All 8 VITS parameter values
- Audio duration (in seconds)
- Real-Time Factor (RTF)
- Any warnings (parameter violations)

**Example:**
```
Temperature: 0.87
Length Scale: 0.98
Noise Scale: 0.80
⚠ Warnungen: temperature below recommended (0.75)
```

---

## ⚡ Common Workflows

### Workflow 1: "Quality is Bad — What Went Wrong?"
1. Go to **Logs** tab
2. Find the synthesis run (check timestamp)
3. Click "Details" to expand
4. Check parameters — are they within safe ranges?
5. If warning badge, read the specific violation
6. Go to **Diagnose-Test** → run same text with same preset 3x
7. If artifact persists, export results to send to audio engineer

### Workflow 2: "System is Slow"
1. Go to **Logs** tab
2. Check RTF column — is it consistently > 5.0x?
3. Check **System-Status** card — memory usage, hardware type
4. Go to **Diagnose-Test** → run diagnostic
5. Are latencies consistent or variable?
6. If variable, may indicate CPU load or model loading overhead

### Workflow 3: "Deploy New Model"
1. Go to **Modelle** tab
2. Click "Hochladen" on Model file input → select `.pth` file
3. Click "Hochladen" on Config file input → select `.json` file
4. New model appears in list (initially not Aktiv)
5. When ready, model can be activated (implementation pending)

### Workflow 4: "Send Performance Report to Developers"
1. Go to **Export** tab
2. Click **📊 CSV exportieren** for spreadsheet analysis
3. Or click **📄 JSON exportieren** for complete data
4. Download file, attach to bug report

---

## 🎓 Important Concepts

### Real-Time Factor (RTF)
```
RTF = Audio Duration / Inference Duration

Example:
  Audio: 3.2 seconds
  Inference: 8.2 seconds
  RTF = 3.2 / 8.2 = 0.39 ≈ 2.56x (shown as "2.56x")

Meaning: System took 2.56 seconds to synthesize 1 second of audio
(Slower than real-time; higher number = slower system)
```

### Parameter Ranges

**Safe Zone (Recommended):**
- Temperature: 0.75 — 0.95
- Noise Scale: 0.75 — 0.95
- Length Scale: 0.90 — 1.05
- Noise Scale W: 0.80 — 0.98

**Outside Safe Zone = Warning** but synthesis still works
(System logs warning but doesn't block execution)

### What "Warning" Means
- Parameter is outside recommended range
- Synthesis still completed successfully
- May affect quality (robotic, metallic, etc.)
- Admin should investigate

---

## 🚨 When to Escalate

**Escalate to Audio Engineer if:**
- Consistent warnings in Logs tab (same parameter repeatedly violated)
- Diagnostic test shows artifacts in multiple runs
- RTF is consistently > 5.0x (very slow)

**Export to Send:**
- CSV export of logs
- TXT report from Export tab
- Result of diagnostic test (run 2-3 times)

---

## 🔐 Admin Panel vs. User Tester

| Feature | Admin Panel | User Tester |
|---------|-------------|------------|
| **Purpose** | Observability & diagnostics | User speech synthesis |
| **Access** | Operators only | Public |
| **Logs** | All synthesis operations | User session only |
| **Testing** | Multi-run diagnostics | Single synthesis |
| **Parameter Control** | Full view & audit | 4 presets only |
| **Export** | JSON/CSV/TXT reports | Audio file only |

---

## 📞 Quick Reference

**System Status Card** (top) — Always check first
- Model version
- Memory usage
- Hardware type
- Last error

**Statistics** (below status) — Key performance indicators
- Total synthesis operations
- Success rate (%)
- Average duration (s)
- Active users

**Logs Tab** — The main operational dashboard
- Table of all synthesis runs
- Expandable rows with parameters
- Status badges (success/warning)

**Diagnose-Test Tab** — For QA and troubleshooting
- Run same text multiple times
- View timing consistency
- Detect intermittent artifacts

**Export Tab** — For reporting
- CSV for analysis
- JSON for complete data
- TXT for human reading

---

**Last Updated:** 2025-12-22  
**For Questions:** Refer to [ADMIN_PANEL_SPECIFICATION.md](./ADMIN_PANEL_SPECIFICATION.md)
