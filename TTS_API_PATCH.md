# TTS API Compatibility Patch Documentation

## Problem Statement

When using the Coqui TTS library's high-level API (`TTS.api.TTS`) to load a custom VITS model, calling the `tts()` method raises an `AttributeError`:

```
AttributeError: 'TTS' object has no attribute 'is_multi_lingual'
```

### Root Cause

The TTS library's `_check_arguments()` method assumes all loaded models have an `is_multi_lingual` attribute. This attribute is typically set by models that support multiple languages (like XTTS), but it's missing from single-language models like our custom VITS model for Plattdeutsch.

When `tts.tts(text)` is called, the internal code path is:
```
tts.tts(text) 
  → _check_arguments() 
    → if self.is_multi_lingual and language is None:  # ← AttributeError here!
```

This is a version compatibility issue between the TTS library and how custom models are loaded.

### Call Stack Example
```
File "TTS/api.py", line 273, in tts
  self._check_arguments(...)
File "TTS/api.py", line 228, in _check_arguments
  if self.is_multi_lingual and language is None:
       ^^^^^^^^^^^^^^^^^^^^^
AttributeError: 'TTS' object has no attribute 'is_multi_lingual'
```

---

## Solution: Monkey Patching

We use **monkey-patching** to replace the problematic `_check_arguments()` method with a patched version that gracefully handles the missing attribute.

### Why Monkey Patching?

We considered several alternatives:

| Approach | Feasibility | Reason |
|----------|-------------|--------|
| **Wrapper Class** | ❌ No | TTS internal methods access `self.is_multi_lingual` directly, bypassing any wrapper |
| **Instance Attribute** | ❌ No | `is_multi_lingual` is a read-only property with no setter |
| **Direct Model Loading** | ⚠️ Avoided | Would lose TTS API benefits (audio processing, config management) |
| **Monkey Patch** | ✅ Yes | Works cleanly, minimal code, preserves all TTS functionality |

### Implementation Details

#### 1. Patch Function (`patch_tts_api()`)

```python
def patch_tts_api():
    from TTS.api import TTS
    
    # Save original method
    original_check_arguments = TTS._check_arguments
    
    def patched_check_arguments(self, *args, **kwargs):
        try:
            return original_check_arguments(self, *args, **kwargs)
        except AttributeError as e:
            if 'is_multi_lingual' in str(e):
                # Safe to skip - VITS is not multilingual
                return None
            raise  # Re-raise other AttributeErrors
    
    # Replace the method
    TTS._check_arguments = patched_check_arguments
```

#### 2. Application Point

The patch is applied in `load_model()` **before** creating the TTS instance:

```python
def load_model():
    ...
    patch_tts_api()  # Apply patch first
    tts_model = TTS(model_path=..., config_path=...)  # Then load
```

#### 3. Error Handling

The patch only catches the specific `is_multi_lingual` AttributeError and re-raises any other AttributeErrors that might indicate real problems.

---

## Why This Works

1. **Non-intrusive**: Only patches the specific problematic method
2. **Safe**: Re-raises unexpected errors to catch real issues
3. **Reversible**: Patch only applies during runtime, doesn't modify library files
4. **Minimal**: ~15 lines of code for full fix
5. **Semantic**: Correct behavior - VITS doesn't support multiple languages anyway

---

## Testing

### Direct Test (`test_tts_direct.py`)

```bash
python test_tts_direct.py
```

Expected output:
```
Importing TTS...
OK: TTS imported
Loading model from D:\...\model\best_model.pth
 > Using model: vits
 > Setting up Audio Processor...
...
OK: Model loaded
Generating TTS for: Dat is en Test vun de Plattdüütsche TTS.
 > Text splitted to sentences.
['Dat is en Test vun de Plattdüütsche TTS.']
 > Processing time: 1.187...
OK: Generated audio: 90640 samples
```

### Backend Test

Start the Flask server:
```bash
cd backend
python app.py
```

Make a request:
```powershell
$body = @{
    text = "Dat is en Test"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/tts" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -OutFile "output.wav"
```

---

## Files Modified

1. **`backend/app.py`**
   - Added `patch_tts_api()` function
   - Call `patch_tts_api()` in `load_model()` before TTS initialization
   - Added explicit `config_path` parameter to TTS constructor

2. **`test_tts_direct.py`**
   - Added `patch_tts_api()` function
   - Call `patch_tts_api()` before TTS initialization
   - Added explicit `config_path` parameter to TTS constructor

---

## Technical Notes

### Version Compatibility

- **TTS Library**: ≥ 0.22.0 (required in `requirements.txt`)
- **Torch**: 2.1.1 (GPU/CPU inference support)
- **Python**: 3.8+

### Performance Impact

None. The patch only adds error handling; it doesn't affect inference performance or quality.

### Future Upgrades

If Coqui TTS updates their API to:
1. Make `is_multi_lingual` always available (e.g., False for monolingual models)
2. Change the attribute access pattern

The patch would need to be reviewed but can be removed or updated without affecting other code.

---

## References

- Coqui TTS GitHub: https://github.com/coqui-ai/TTS
- VITS Paper: https://arxiv.org/abs/2106.06103
- Python Monkey Patching: https://en.wikipedia.org/wiki/Monkey_patch

---

## Troubleshooting

### Still Getting `is_multi_lingual` Error?

Ensure `patch_tts_api()` is called **before** any TTS instance creation:

```python
# ✅ Correct
patch_tts_api()
tts = TTS(model_path=..., config_path=...)

# ❌ Wrong
tts = TTS(model_path=..., config_path=...)
patch_tts_api()
```

### Other AttributeErrors?

The patch will re-raise any AttributeError not related to `is_multi_lingual`. Check the full traceback for details.

### Model Not Found?

Ensure both files exist:
- `model/best_model.pth`
- `model/config.json`

And use absolute paths or relative paths correctly from the Flask app root.
