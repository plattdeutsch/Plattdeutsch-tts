"""
Direct TTS Test Script
Tests the TTS model without the Flask API
"""

import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from app import patch_tts_api

def main():
    print("=" * 60)
    print("Plattdeutsch TTS - Direct Test")
    print("=" * 60)
    print()

    # Get paths
    project_root = Path(__file__).parent
    model_path = project_root / "model" / "best_model.pth"
    config_path = project_root / "model" / "config.json"

    print("Step 1: Checking model files...")
    if not model_path.exists():
        print(f"ERROR: Model not found at {model_path}")
        return False
    if not config_path.exists():
        print(f"ERROR: Config not found at {config_path}")
        return False
    print("✓ Model files found")
    print()

    print("Step 2: Importing TTS...")
    try:
        from TTS.api import TTS
        print("✓ TTS imported")
    except ImportError as e:
        print(f"ERROR: Failed to import TTS: {e}")
        return False
    print()

    print("Step 3: Patching TTS API...")
    try:
        patch_tts_api()
        print("✓ TTS API patched")
    except Exception as e:
        print(f"ERROR: Failed to patch TTS: {e}")
        return False
    print()

    print("Step 4: Loading model...")
    try:
        tts_model = TTS(
            model_path=str(model_path),
            config_path=str(config_path),
            gpu=True,
            verbose=False
        )
        print("✓ Model loaded successfully")
    except Exception as e:
        print(f"ERROR: Failed to load model: {e}")
        import traceback
        traceback.print_exc()
        return False
    print()

    print("Step 5: Generating TTS...")
    test_text = "Dat is en Test vun de Plattdüütsche TTS."
    try:
        wav = tts_model.tts(
            text=test_text,
            temperature=0.7,
            length_scale=1.0,
            noise_scale=0.6,
            noise_scale_w=0.8
        )
        print(f"✓ Generated audio: {len(wav)} samples")
    except Exception as e:
        print(f"ERROR: Failed to generate TTS: {e}")
        import traceback
        traceback.print_exc()
        return False
    print()

    print("=" * 60)
    print("✓ All tests passed!")
    print("=" * 60)
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
