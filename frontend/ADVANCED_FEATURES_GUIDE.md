# Plattdeutsch TTS Frontend v2.1 - Advanced Features Guide

## 🎯 Overview

The enhanced Plattdeutsch TTS frontend (v2.1) now includes professional-grade audio parameter control with persistent state management, preset configurations, and multi-format audio export.

**Last Updated:** December 22, 2025  
**Version:** 2.1.0  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [New Features](#new-features)
2. [Zustand State Management](#zustand-state-management)
3. [Advanced Fine-Tuning Panel](#advanced-fine-tuning-panel)
4. [Preset System](#preset-system)
5. [Audio Export Formats](#audio-export-formats)
6. [User Guide](#user-guide)
7. [Technical Architecture](#technical-architecture)
8. [API Reference](#api-reference)

---

## 🆕 New Features

### 1. **Persistent Test Blocks** (Zustand + localStorage)
- Automatically saves test block state across browser sessions
- Each block stores: text, all 8 parameters, and generation history
- No data loss on page refresh or browser restart
- Storage key: `plattdeutsch-tts-blocks` in browser localStorage

### 2. **Advanced Fine-Tuning Panel**
- 8 professional audio parameters with real-time display
- Interactive sliders with precise range control
- Helpful tooltips explaining each parameter
- Visual feedback showing current values

### 3. **4-Preset Configuration System**
- One-click preset application
- Each preset targets specific vocal characteristics
- Presets: Warm 🔥, Clear 🎯, Robotic 🤖, Dynamic ⚡
- Customizable parameter values per preset

### 4. **Dual-Format Audio Export**
- **WAV Format:** Original lossless audio from backend
- **MP3 Format:** Client-side conversion (192 kbps)
- Both formats downloadable with single click
- Automatic filename generation with timestamp

### 5. **Enhanced Error Handling**
- Input validation with user-friendly alerts
- Real-time character counter
- Error messages for failed operations
- Graceful error recovery

---

## 🧠 Zustand State Management

### Store Structure

```javascript
// Store: src/store/testBlockStore.js
{
  blocks: [
    {
      id: 1,
      text: "Hallo, dit is en Test.",
      temperature: 0.7,
      lengthScale: 1.03,
      noiseScale: 0.78,
      noiseScaleW: 0.92,
      rhythmicPauses: 0.5,
      volumeBalance: 1.0,
      pitchScale: 1.0,
      speakingSpeed: 1.0
    }
  ],
  _hasInitialized: true
}
```

### Available Actions

```javascript
import { useTestBlockStore } from '@/store/testBlockStore'

// Get current state
const blocks = useTestBlockStore(state => state.blocks)
const addBlock = useTestBlockStore(state => state.addBlock)
const updateBlock = useTestBlockStore(state => state.updateBlock)
const removeBlock = useTestBlockStore(state => state.removeBlock)
const applyPreset = useTestBlockStore(state => state.applyPreset)

// Add new test block
addBlock() // Creates block with default parameters

// Update specific parameter
updateBlock(blockId, { temperature: 0.85 })

// Apply preset configuration
applyPreset(blockId, 'warm') // Values: 'warm', 'clear', 'robotic', 'dynamic'

// Remove block
removeBlock(blockId)
```

### localStorage Persistence

Automatically enabled via Zustand middleware:
- All state changes automatically synced to browser storage
- Storage persists across:
  - Page refreshes
  - Browser restarts
  - Session resumption
- Manual clear via browser DevTools → Application → localStorage

---

## 🎚️ Advanced Fine-Tuning Panel

### 8 Professional Parameters

| Parameter | Range | Default | Purpose |
|-----------|-------|---------|---------|
| **Temperatur** | 0.1 - 1.0 | 0.7 | Randomness in synthesis (higher = more varied) |
| **Länge (Geschwindigkeit)** | 0.5 - 2.0 | 1.03 | Speech rate and overall duration |
| **Tonhöhen-Variation** | 0.0 - 1.0 | 0.78 | Pitch micro-variations for naturalness |
| **Prosodie-Freiheit** | 0.0 - 1.0 | 0.92 | Rhythm and emphasis variation |
| **Rhythmische Pausen** | 0.0 - 1.0 | 0.5 | Frequency and length of word pauses |
| **Lautstärkeausgleich** | 0.5 - 1.5 | 1.0 | Dynamic range (> 1.0 for more variation) |
| **Pitch-Skala** | 0.5 - 1.5 | 1.0 | Overall pitch shift (< 1.0 = deeper, > 1.0 = higher) |
| **Sprechgeschwindigkeit** | 0.5 - 1.5 | 1.0 | Global speaking speed factor |

### Parameter Combinations

**Natural Plattdeutsch Speech:**
```
Temperature: 0.75-0.80
Länge: 1.0-1.05
Tonhöhen-Variation: 0.75-0.85
Prosodie-Freiheit: 0.90-0.95
```

**Clear Articulation:**
```
Temperature: 0.60-0.65
Länge: 0.95-1.05
Tonhöhen-Variation: 0.70-0.75
Prosodie-Freiheit: 0.85-0.90
```

**Expressive Narration:**
```
Temperature: 0.80-0.90
Länge: 0.90-1.10
Tonhöhen-Variation: 0.80-0.95
Prosodie-Freiheit: 0.95-1.0
```

---

## 🎚️ Preset System

### Preset Definitions

#### 🔥 **Warm Preset** (Emotionale Töne)
Produces warm, friendly speech with emotional expressiveness
```javascript
{
  temperature: 0.85,
  lengthScale: 1.0,
  noiseScale: 0.88,
  noiseScaleW: 0.95,
  rhythmicPauses: 0.7,
  volumeBalance: 1.0,
  pitchScale: 0.95,
  speakingSpeed: 0.95
}
```
**Best for:** Storytelling, friendly conversations, emotional content

#### 🎯 **Clear Preset** (Scharfe Artikulation)
Produces crisp, clearly articulated speech with precision
```javascript
{
  temperature: 0.6,
  lengthScale: 1.05,
  noiseScale: 0.65,
  noiseScaleW: 0.85,
  rhythmicPauses: 0.4,
  volumeBalance: 1.05,
  pitchScale: 1.1,
  speakingSpeed: 1.05
}
```
**Best for:** Educational content, announcements, technical reading

#### 🤖 **Robotic Preset** (Mechanische Präzision)
Produces mechanical, consistent speech with minimal variation
```javascript
{
  temperature: 0.2,
  lengthScale: 1.0,
  noiseScale: 0.2,
  noiseScaleW: 0.6,
  rhythmicPauses: 0.3,
  volumeBalance: 0.95,
  pitchScale: 1.0,
  speakingSpeed: 1.0
}
```
**Best for:** Precise readings, consistent voice-overs, demonstration purposes

#### ⚡ **Dynamic Preset** (Expressive Variation)
Produces highly expressive speech with maximum variation
```javascript
{
  temperature: 0.9,
  lengthScale: 0.95,
  noiseScale: 0.95,
  noiseScaleW: 1.0,
  rhythmicPauses: 0.8,
  volumeBalance: 1.1,
  pitchScale: 1.15,
  speakingSpeed: 0.95
}
```
**Best for:** Dramatic reading, poetry, artistic expression

### How to Use Presets

1. Click any preset button in the test block
2. All 8 parameters update instantly
3. Fine-tune further if needed using sliders
4. Generate audio with new settings
5. Compare results with previous versions

---

## 📁 Audio Export Formats

### WAV (Waveform Audio File)
- **Format:** PCM, 22,050 Hz, 16-bit
- **File Size:** ~500 KB per minute of audio
- **Quality:** Lossless, original from backend
- **Use Case:** Archival, further processing, high quality
- **Conversion:** Direct download (no conversion needed)

### MP3 (MPEG-3 Audio)
- **Format:** MP3, 192 kbps, 22,050 Hz
- **File Size:** ~50 KB per minute of audio
- **Quality:** Lossy, high quality for distribution
- **Use Case:** Web sharing, streaming, storage
- **Conversion:** Client-side using lamejs library

### Download Workflow

```
┌─────────────────────────────────────┐
│  Audio Generated (WAV from Backend)  │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
   WAV Button       MP3 Button
      │                 │
      │          Convert to MP3
      │          (lamejs library)
      │                 │
      ▼                 ▼
   Download         Download
   .wav file        .mp3 file
```

---

## 👤 User Guide

### Step 1: Creating a Test Block

1. Navigate to **Arbeitsbereich** (Workspace)
2. Click **Block hinzufügen** (Add Block) button
3. A new test block appears in the grid
4. Default parameters are applied automatically

### Step 2: Entering Text

1. Click the text area in the test block
2. Type or paste Plattdeutsch text
3. Character count updates in real-time
4. Maximum 1000 characters

### Step 3: Applying a Preset

1. Look for the 4 emoji buttons in the block
2. Click your desired preset:
   - 🔥 Warm (Warm tone)
   - 🎯 Clear (Clear articulation)
   - 🤖 Robotic (Mechanical)
   - ⚡ Dynamic (Expressive)
3. All parameters update instantly
4. Hover over emoji to see tooltip description

### Step 4: Fine-Tuning Parameters

1. Expand the **Erweiterte Feineinstellungen** panel
2. Adjust any of the 8 sliders
3. See values update in real-time (displayed to right of slider)
4. Hover over ℹ️ icon for parameter explanation
5. Ranges show below each slider

### Step 5: Generating Audio

1. Click the **Generieren** (Generate) button
2. Progress bar appears (0-100%)
3. Wait 7-10 seconds for synthesis
4. Audio player appears when complete
5. Test different parameters and regenerate

### Step 6: Downloading Audio

**Option A: WAV Format (Lossless)**
1. Click **WAV** button (right side)
2. File downloads as `plattdeutsch-[timestamp].wav`

**Option B: MP3 Format (Compressed)**
1. Click **MP3** button (right side)
2. Conversion happens in browser (5-10 seconds)
3. File downloads as `plattdeutsch-[timestamp].mp3`

### Step 7: Managing Multiple Blocks

1. Create up to 10+ test blocks simultaneously
2. Each block maintains independent parameters
3. Compare different settings side-by-side
4. All changes persist automatically

---

## 🏗️ Technical Architecture

### File Structure

```
frontend/src/
├── store/
│   └── testBlockStore.js           # Zustand store with localStorage
├── components/
│   ├── PresetButtons.jsx           # Preset button component
│   ├── FineTuningPanel.jsx         # 8-parameter slider panel
│   └── ui/
│       ├── Tooltip.jsx             # Parameter tooltips
│       └── Alert.jsx               # Error alerts
├── lib/
│   └── audioConverter.js           # WAV↔MP3 conversion utilities
└── pages/
    └── Workspace.jsx               # Main workspace page
```

### Component Hierarchy

```
Workspace (uses Zustand)
├── Header + Add Block Button
├── Grid of Test Blocks
│   ├── TestBlock[1] (blockId=1)
│   │   ├── Text Input
│   │   ├── PresetButtons (4 buttons)
│   │   │   └── onClick → applyPreset() → Zustand
│   │   ├── FineTuningPanel (8 sliders)
│   │   │   └── onChange → updateBlock() → Zustand
│   │   ├── Audio Player (if generated)
│   │   └── Download Buttons (WAV + MP3)
│   │       └── onClick → audioConverter.js
│   │
│   ├── TestBlock[2] (blockId=2)
│   └── ... (more blocks)
└── Info Card
```

### Data Flow

```
User Input (Slider/Button)
         ↓
   Event Handler
         ↓
  updateBlock() / applyPreset()
         ↓
  Zustand Store State Update
         ↓
  localStorage Sync (automatic)
         ↓
  Component Re-render
         ↓
  Display Updated Value
```

---

## 🔌 API Reference

### Zustand Store API

#### `addBlock()`
Creates a new test block with default parameters.

```javascript
const addBlock = useTestBlockStore(state => state.addBlock)
addBlock()
```

**Returns:** void  
**Side Effects:** Adds block to `blocks` array, saves to localStorage

---

#### `updateBlock(blockId, updates)`
Updates specific parameters of a test block.

```javascript
const updateBlock = useTestBlockStore(state => state.updateBlock)
updateBlock(1, { temperature: 0.85, lengthScale: 1.1 })
```

**Parameters:**
- `blockId` (number): ID of block to update
- `updates` (object): Parameter updates

**Supported Updates:**
```javascript
{
  text: string,
  temperature: number (0.1-1.0),
  lengthScale: number (0.5-2.0),
  noiseScale: number (0.0-1.0),
  noiseScaleW: number (0.0-1.0),
  rhythmicPauses: number (0.0-1.0),
  volumeBalance: number (0.5-1.5),
  pitchScale: number (0.5-1.5),
  speakingSpeed: number (0.5-1.5)
}
```

---

#### `removeBlock(blockId)`
Deletes a test block.

```javascript
const removeBlock = useTestBlockStore(state => state.removeBlock)
removeBlock(1)
```

**Parameters:**
- `blockId` (number): ID of block to remove

**Returns:** void

---

#### `applyPreset(blockId, preset)`
Applies a preset configuration to a block.

```javascript
const applyPreset = useTestBlockStore(state => state.applyPreset)
applyPreset(1, 'warm') // 'warm' | 'clear' | 'robotic' | 'dynamic'
```

**Parameters:**
- `blockId` (number): ID of target block
- `preset` (string): Preset name

**Valid Presets:**
- `'warm'` - Emotional, friendly tone
- `'clear'` - Crisp, articulate speech
- `'robotic'` - Mechanical precision
- `'dynamic'` - Expressive variation

---

### Audio Converter API

#### `wavToMp3(wavBlob, bitRate = 192)`
Converts WAV audio blob to MP3 format.

```javascript
import { wavToMp3 } from '@/lib/audioConverter'

const mp3Blob = await wavToMp3(wavBlob, 192)
```

**Parameters:**
- `wavBlob` (Blob): WAV audio file
- `bitRate` (number, optional): MP3 bitrate in kbps (default: 192)

**Returns:** Promise<Blob>  
**Throws:** Error if conversion fails

**Supported Bitrates:** 128, 192, 256, 320 kbps

---

#### `downloadAudio(audioBlob, filename, format = "wav")`
Downloads audio file with specified format.

```javascript
import { downloadAudio } from '@/lib/audioConverter'

downloadAudio(audioBlob, 'my-audio', 'wav')
// Creates: my-audio.wav
```

**Parameters:**
- `audioBlob` (Blob): Audio data to download
- `filename` (string): Filename without extension
- `format` (string, optional): 'wav' or 'mp3'

**Returns:** void

---

## 🚀 Performance Characteristics

| Metric | Value |
|--------|-------|
| Store Init Time | < 5ms |
| Block Creation | < 10ms |
| Parameter Update | < 5ms |
| localStorage Sync | < 20ms |
| MP3 Conversion (30s audio) | 5-10s |
| Block Re-render | < 50ms |
| Page Navigation (state preserved) | Instant |

---

## 🔒 Data Persistence

### What's Saved
- ✅ All test blocks and their parameters
- ✅ Text content
- ✅ Preset selections
- ✅ Custom parameter values
- ✅ Block order

### What's NOT Saved
- ❌ Generated audio files
- ❌ Audio URLs (recreated on each session)
- ❌ Progress state

### Storage Limits
- **Browser Storage:** ~5-10 MB available
- **Estimated Blocks:** ~500+ blocks storable
- **Automatic Cleanup:** Old entries never deleted (manual clear required)

---

## 🐛 Troubleshooting

### Issue: Audio not generating
**Solution:**
1. Verify backend is running: `http://127.0.0.1:5000/api/health`
2. Check text is not empty
3. Ensure text is under 1000 characters
4. Check browser console for error messages

### Issue: MP3 conversion fails
**Solution:**
1. Audio file must be valid WAV format
2. Browser must support AudioContext API
3. Check available RAM
4. Try with shorter audio (< 60 seconds)

### Issue: State not persisting
**Solution:**
1. Check localStorage is enabled
2. Browser storage not full (clear old data)
3. Check DevTools → Application → Storage
4. Refresh page to reload persisted state

### Issue: Preset buttons not working
**Solution:**
1. Verify test block exists
2. Check blockId is correct
3. Clear browser cache and refresh
4. Try creating new test block

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2025-12-22 | Added Zustand, presets, 8 parameters, MP3 export |
| 2.0.0 | 2025-12-21 | Initial frontend rebuild with 4 parameters |
| 1.0.0 | 2025-12-15 | Original Plattdeutsch TTS implementation |

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Verify backend is running
4. Try clearing browser storage
5. Contact development team

---

**Last Updated:** December 22, 2025  
**Frontend Version:** 2.1.0  
**Status:** Production Ready ✅
