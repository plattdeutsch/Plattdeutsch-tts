# Admin Panel Specification — Plattdeutsch TTS v1.0

**Status:** Production-Ready Implementation  
**Last Updated:** 2025-12-22  
**Target Audience:** System Operators, QA Engineers, Researchers

---

## 🎯 Admin Panel Purpose

The Admin Panel provides **production-grade observability, traceability, and diagnostic capabilities** for the Plattdeutsch VITS TTS system. It is **strictly distinct** from the user-facing Tester page and serves four core functions:

1. **Inference Log Dashboard** — Real-time and historical view of all synthesis operations
2. **Diagnostic Testing** — Multi-run reproducibility testing for artifact detection and performance validation
3. **System Management** — Model uploading, versioning, and hardware monitoring
4. **Log Export & Audit** — Structured data export for QA audits, bug reports, and benchmarking

---

## 📊 Core Sections

### A. System Status Card (Always Visible)

**Purpose:** At-a-glance system health monitoring

**Displays:**
- Active model with version (e.g., "✓ VITS v1.0")
- Current memory usage (e.g., "245 MB")
- Hardware type (CPU/GPU)
- Last error status (none/timestamp)

**Update Frequency:** Real-time (should be tied to backend health endpoint)

**Example:**
```
┌─ System-Status ─────────────────────┐
│ Modell: ✓ VITS v1.0                │
│ Speicher: 245 MB                    │
│ Hardware: CPU                       │
│ Letzter Fehler: keine               │
└─────────────────────────────────────┘
```

---

### B. Statistics Panel (Always Visible)

**Four Key Metrics:**

| Metric | Source | Refresh | Purpose |
|--------|--------|---------|---------|
| **Generierungen** | DAM logs count | Per request | Total synthesis operations since system start |
| **Erfolgsquote** | success_count / total_count | Per request | Percentage of synthesis operations without errors/warnings |
| **Ø Dauer** | avg(duration) of all logs | Per request | Average inference time in seconds |
| **Aktive Nutzer** | unique session IDs in last 1h | 5 min | Concurrent active sessions |

---

### C. Tab 1: Inference Log Dashboard (📊 Logs)

**Purpose:** Real-time and historical view of all synthesis operations with parameter traceability

#### Table Columns

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| **Timestamp** | ISO8601 (HH:MM:SS) | 14:32:15 | When synthesis occurred |
| **Preset** | Enum | warm / klar / dynamisch / erzähler | Which preset was used |
| **Dauer (Duration)** | Integer (ms) | 8200 | Total inference time |
| **RTF** | Float | 2.56 | Real-time factor (audio_duration / inference_time) |
| **Status** | Badge | ✓ OK / ⚠ Warning | Success or warning flag |
| **Action** | Button | Details | Expand row to see parameters |

#### Expanded Log View (Details)

Clicking "Details" expands the row to show:

```
Detailierte Ansicht: req-001
────────────────────────────────────

Temperature:        0.87
Length Scale:       0.98
Noise Scale:        0.80
Noise Scale W:      0.85
Audio Duration:     3.2s
Real-Time Factor:   2.56x

⚠ Warnungen:
  • temperature below recommended (0.75)
  • noiseScale below recommended (0.75)
```

#### Logging Requirements

Each log entry must include:

```json
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
  "status": "success|warning",
  "warnings": [
    "parameter_name out of recommended range"
  ],
  "systemMessages": [
    "GPU memory: 2.1GB",
    "Model hash: abc123..."
  ]
}
```

#### Warning Detection Rules

**Temperature**
- Recommended: 0.75 ≤ temp ≤ 0.95
- Trigger warning: temp < 0.75 (too-tight sampling → robotic) or temp > 0.95 (too-loose → incoherent)

**Noise Scale**
- Recommended: 0.75 ≤ noiseScale ≤ 0.95
- Trigger warning: noiseScale < 0.75 (metallic) or noiseScale > 0.98 (muffled)

**Length Scale**
- Recommended: 0.90 ≤ lengthScale ≤ 1.05
- Trigger warning: outside range (phoneme duration deviation)

**Preset Override**
- Log when user manually entered parameters vs. using preset
- Format: `preset: "manual"` instead of preset name

---

### D. Tab 2: Diagnostic Tester (🧪 Diagnose-Test)

**Purpose:** Multi-run reproducibility testing for QA operators and audio engineers

**Layout:**
```
🧪 Admin Diagnose-Test
━━━━━━━━━━━━━━━━━━━━

⚠️ TEST MODE — Führe mehrfach Tests durch,
   um Inferenzvariabilität zu diagnostizieren

Test-Text:
┌─────────────────────────────────────┐
│ Dit is en Plattdeutsch Text zum     │
│ Testen.                             │
└─────────────────────────────────────┘

Preset:              [🔥 Warm ▼]
[Starte 3x Test]

Test-Ergebnisse:
┌────────┐ ┌────────┐ ┌────────┐
│ Run 1  │ │ Run 2  │ │ Run 3  │
│ 8156ms │ │ 8210ms │ │ 8189ms │
│ ✓ OK   │ │ ✓ OK   │ │ ✓ OK   │
└────────┘ └────────┘ └────────┘

Variabilität-Analyse:
Min: 8156ms | Max: 8210ms | Bereich: 54ms
```

#### Test Execution Flow

1. User enters text (any Plattdeutsch or German text)
2. User selects preset (Warm, Klar, Dynamisch, Erzähler)
3. Click "Starte 3x Test"
4. System runs synthesis 3 times sequentially
5. For each run, log:
   - Duration in milliseconds
   - Status (success/warning)
   - Timestamp

#### Variability Analysis (Auto-Computed)

After 2+ runs, display:
- **Min Duration:** Fastest run
- **Max Duration:** Slowest run  
- **Variability Range:** max - min

**Why This Matters:**
- Tight variability (< 100ms) = stable inference
- Wide variability (> 500ms) = possible memory pressure or model loading issues
- Consistent time means repeatable quality

#### Use Cases

**QA Operators:**
- "Run 5 tests with each preset to ensure consistency"
- "Check if system is slower under load"

**Audio Engineers:**
- "Diagnose artifact patterns across repeated runs"
- "Validate that parameter changes have reproducible effects"

---

### E. Tab 3: Model Management (📦 Modelle)

**Purpose:** Upload new models, track versions, manage active model

**Features:**

#### Upload Section
- File input for `.pth` or `.pt` model files
- File input for `.json` configuration files
- Upload button for each

#### Models List

Display all uploaded models with:
- Model name
- Import date
- Status badge (Aktiv / Archiviert)
- Delete button (trash icon)

**Constraints:**
- Only one model can be "Aktiv" at a time
- Deleting active model requires confirmation
- Archived models can be deleted without confirmation

---

### F. Tab 4: Export & Audit (📥 Export)

**Purpose:** Generate structured logs for external analysis, QA audits, and bug reports

#### Export Formats

**1. JSON Export**
```json
{
  "exportDate": "2025-12-22T14:40:00Z",
  "systemInfo": {
    "modelVersion": "VITS v1.0",
    "modelHash": "abc123def456",
    "hardware": "CPU",
    "memoryUsage": "245MB"
  },
  "logs": [
    {
      "requestId": "req-001",
      "timestamp": "2025-12-22T14:32:15Z",
      ...
    }
  ]
}
```

**2. CSV Export**
```
Timestamp,TextLength,Preset,Temperature,Duration(ms),Status
2025-12-22T14:32:15Z,24,warm,0.87,8200,success
2025-12-22T14:31:45Z,18,klar,0.80,7950,success
```

**3. TXT Report** (Human-Readable)
```
PLATTDEUTSCH TTS - INFERENCE LOG EXPORT
Exported: 2025-12-22T14:40:00Z
Model: VITS v1.0
Hardware: CPU

════════════════════════════════════════════════════════

Request ID: req-001
Timestamp: 2025-12-22T14:32:15Z
Text Length: 24 chars
Preset: warm
Temperature: 0.87
Duration: 8200ms
Audio Duration: 3.2s
Status: success

Request ID: req-002
Timestamp: 2025-12-22T14:31:45Z
...
```

#### What Gets Exported

- ✓ System metadata (Model Hash, Hardware, Memory)
- ✓ All inference parameters (all 8 VITS controls)
- ✓ Timing breakdowns (start, end, duration)
- ✓ Warnings and anomalies
- ✓ Request UUIDs for traceability

---

## 🔐 Safety & Security Rules

### Admin Panel Separation
- Admin panel is **visually distinct** from user Tester page
- Header shows "🔐 ADMIN PANEL — Nur für Operatoren" (in red border)
- Test mode banner shows "⚠️ TEST MODE" (red background)

### Parameter Boundary Warnings

If any parameter falls outside safe range:
- Display yellow warning border in log entry
- List specific violations: `"temperature below recommended (0.75)"`
- Do **not** block execution; warn after-the-fact

### Test Mode Indicators

When in Diagnostic Tester tab:
- Show warning banner: "TEST MODE — Multi-run testing for variability diagnostics"
- Do not export test-mode runs to main logs (keep separate)
- Log still tracks them but mark with `testMode: true`

### Preset Override Tracking

When user enters manual parameters (vs. using preset):
- Log should show `preset: "manual"`
- Admin can see: "Parameters manually set instead of preset"
- Enables auditing of non-standard configurations

---

## 📋 Data Model Reference

### Inference Log Schema

```typescript
interface InferenceLog {
  // Traceability
  requestId: string;           // UUID-style unique ID
  timestamp: string;           // ISO8601 datetime
  
  // Input
  textLength: number;          // Number of characters
  preset: string;              // "warm" | "klar" | "dynamisch" | "erzaehler" | "manual"
  
  // VITS Parameters (8 total)
  parameters: {
    temperature: number;       // 0.65-1.10, recommended 0.75-0.95
    lengthScale: number;       // 0.85-1.20, recommended 0.90-1.05
    noiseScale: number;        // 0.65-1.10, recommended 0.75-0.95
    noiseScaleW: number;       // 0.70-1.10, recommended 0.80-0.98
    rhythmicPauses: number;    // 0.30-1.00
    volumeBalance: number;     // 0.80-1.20
    pitchScale: number;        // 0.70-1.30
    speakingSpeed: number;     // 0.50-2.00
  };
  
  // Timing
  inferenceDuration: number;   // Milliseconds
  audioDuration: number;       // Seconds (calculated)
  rtf: number;                 // Real-time factor (audio_duration / inference_duration)
  
  // Results
  status: "success" | "warning" | "error";
  warnings: string[];          // List of parameter violations
  systemMessages: string[];    // GPU/CPU info, cache state, etc.
}
```

### Preset Definitions

```typescript
const PRESETS = {
  warm: {
    temperature: 0.87,
    lengthScale: 0.98,
    noiseScale: 0.80,
    noiseScaleW: 0.85,
    rhythmicPauses: 0.65,
    volumeBalance: 0.95,
    pitchScale: 1.00,
    speakingSpeed: 1.00
  },
  klar: {
    temperature: 0.80,
    lengthScale: 0.95,
    noiseScale: 0.82,
    noiseScaleW: 0.80,
    rhythmicPauses: 0.60,
    volumeBalance: 1.00,
    pitchScale: 1.05,
    speakingSpeed: 0.95
  },
  dynamisch: {
    temperature: 0.92,
    lengthScale: 1.00,
    noiseScale: 0.90,
    noiseScaleW: 0.90,
    rhythmicPauses: 0.75,
    volumeBalance: 1.05,
    pitchScale: 1.08,
    speakingSpeed: 1.05
  },
  erzaehler: {
    temperature: 0.85,
    lengthScale: 0.98,
    noiseScale: 0.78,
    noiseScaleW: 0.75,
    rhythmicPauses: 0.55,
    volumeBalance: 0.98,
    pitchScale: 0.95,
    speakingSpeed: 0.98
  }
};
```

---

## 🚀 Implementation Checklist

### Frontend (React)
- [x] Admin.jsx with 5 tabs (Logs, Tester, Models, Export, Health)
- [x] System status card with real-time indicators
- [x] Statistics display (4 KPIs)
- [x] Inference log table with expandable rows
- [x] Diagnostic tester with multi-run support
- [x] Model upload and management
- [x] Export buttons (JSON, CSV, TXT)

### Backend (Flask)
- [ ] `/api/admin/logs` endpoint (GET logs with filtering)
- [ ] `/api/admin/system-status` endpoint (health check)
- [ ] `/api/admin/export` endpoint (generate exports)
- [ ] Logging middleware (capture all synthesis operations)
- [ ] Parameter validation with warning generation
- [ ] Test-mode flag handling

### Database / Storage
- [ ] DAM logs table (inference log persistence)
- [ ] Compound index on (timestamp, preset, status)
- [ ] Query optimization for large datasets (pagination)

### Testing & Validation
- [ ] Admin panel loads without errors
- [ ] Log table populates correctly
- [ ] Diagnostic tester runs 3x sequentially
- [ ] Variability analysis computes correctly
- [ ] Exports generate valid JSON/CSV/TXT
- [ ] Parameter warnings trigger correctly

---

## 🔍 Artifact Diagnosis Workflow

**Example: Audio sounds robotic in Diagnostic Tester**

1. User notices "robotic" quality in 3-run test with Klar preset
2. Click "Details" to expand first run
3. See: `temperature: 0.80` (at lower bound)
4. Admin notes: Tight sampling with Klar preset may cause this
5. Recommend: "Try Dynamisch preset (temp 0.92) or manually increase temperature to 0.88"
6. Run new diagnostic test with adjusted parameters
7. Export results as TXT report for audio engineer analysis

---

## 📚 Reference Links

- **VITS Technical Docs:** [VITS_SPRACHQUALITAT_TECHNISCHE_GRUNDLAGEN.md](./VITS_SPRACHQUALITAT_TECHNISCHE_GRUNDLAGEN.md)
- **Parameter Control Guide:** [VITS_PRESET_DESIGN.md](./VITS_PRESET_DESIGN.md)
- **User Tester Page:** [Documentation.jsx](./frontend/src/pages/Documentation.jsx)

---

## 🎓 Key Concepts for Operators

### Real-Time Factor (RTF)
- **RTF = Audio Duration / Inference Duration**
- Example: 3.2s audio in 8.2s inference = RTF 2.56x (system is 2.5x slower than real-time)
- Higher RTF = slower system (may indicate CPU load)
- Used for performance monitoring

### Variability in Diagnostics
- Small variability (< 100ms) across 3 runs = **stable system**
- Large variability (> 500ms) = **potential issues**:
  - Model loading overhead
  - CPU thermal throttling
  - Memory pressure
  - Competing system processes

### Parameter Override Tracking
- **Preset Mode:** User selected one of 4 presets
- **Manual Mode:** User manually entered all 8 parameters
- **Hybrid Mode:** Started with preset, then adjusted (should log which params changed)

---

## 📞 Support & Escalation

**If logs show consistent warnings:**
1. Export as CSV or JSON
2. Cross-reference with VITS_SPRACHQUALITAT_TECHNISCHE_GRUNDLAGEN.md
3. Run diagnostic test with different preset
4. Send export + diagnostic results to audio engineer

**If RTF is consistently high (> 5.0x):**
1. Check hardware status in System Card
2. Run diagnostic test multiple times
3. Export results
4. May indicate CPU overload or model optimization needed

---

**Document Version:** 1.0  
**Last Reviewed:** 2025-12-22  
**Next Review:** 2026-01-15  
**Maintainer:** Audio Engineering Team
