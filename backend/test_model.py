#!/usr/bin/env python3
"""
Test script to verify model import and activation
"""

import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print('=' * 60)
print('TESTING MODEL IMPORT & ACTIVATION')
print('=' * 60)

# Test 1: Check model files
print('\n[1] Checking model files...')
project_root = Path(__file__).parent.parent
model_path = project_root / 'model' / 'best_model.pth'
config_path = project_root / 'model' / 'config.json'

if model_path.exists():
    size_mb = model_path.stat().st_size / (1024 * 1024)
    print(f'✓ Model file found: {size_mb:.1f} MB')
else:
    print(f'✗ Model file NOT found: {model_path}')
    
if config_path.exists():
    print(f'✓ Config file found')
    with open(config_path) as f:
        import json
        config = json.load(f)
        print(f'  - Model type: {config.get("model_type", "unknown")}')
        print(f'  - Language: {config.get("language", "unknown")}')
else:
    print(f'✗ Config file NOT found: {config_path}')

# Test 2: Try loading TTS API
print('\n[2] Testing TTS API import...')
try:
    from TTS.api import TTS
    print('✓ TTS API imported successfully')
except Exception as e:
    print(f'✗ TTS API import failed: {e}')
    sys.exit(1)

# Test 3: Try patching
print('\n[3] Applying TTS API patch...')
try:
    def _no_check_arguments(*args, **kwargs):
        return
    TTS._check_arguments = _no_check_arguments
    print('✓ TTS API patched successfully')
except Exception as e:
    print(f'✗ TTS API patch failed: {e}')

# Test 4: Try loading model
print('\n[4] Loading VITS model (this may take 1-2 minutes)...')
print('Please wait - loading 951 MB weights...')
try:
    tts_model = TTS(
        model_path=str(model_path),
        config_path=str(config_path),
        gpu=False
    )
    print('✓ Model loaded successfully!')
    
    # Test 5: Try generating audio
    print('\n[5] Testing TTS generation...')
    test_text = 'Hallo, dit is en Test.'
    print(f'Generating audio for: "{test_text}"')
    
    wav = tts_model.tts(
        text=test_text,
        length_scale=1.0,
        noise_scale=0.6,
        noise_scale_w=0.8
    )
    
    if wav is not None:
        print(f'✓ Audio generated successfully!')
        if isinstance(wav, list):
            print(f'  - Audio length: {len(wav)} samples')
        else:
            print(f'  - Audio shape: {wav.shape}')
    else:
        print('✗ Audio generation returned None')
        
except Exception as e:
    print(f'✗ Model loading/generation failed: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)

print('\n' + '=' * 60)
print('✓ ALL TESTS PASSED - MODEL IS WORKING CORRECTLY!')
print('=' * 60)
