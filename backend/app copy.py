"""
Plattdeutsch TTS Backend - Flask Server
A production-ready Text-to-Speech application using Coqui TTS VITS model
for the Plattdeutsch (Low German) language.
"""

import os
import sys
import json
import logging
from pathlib import Path
from io import BytesIO
import numpy as np
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global TTS model instance
tts_model = None


def normalize_text(text: str) -> str:
    """
    Normalize text for Plattdeutsch TTS synthesis.
    Handles quotes, dashes, and punctuation spacing.
    """
    import re
    
    # Normalize quotes
    text = text.replace("„", "\"").replace(""", "\"").replace(""", "\"")
    text = text.replace("'", "'").replace("'", "'")
    
    # Normalize dashes
    text = text.replace("–", "-").replace("—", "-")
    
    # Fix punctuation spacing
    text = re.sub(r"\s+([.,!?;:])", r"\1", text)
    text = re.sub(r"([.,!?;:])([^\s])", r"\1 \2", text)
    text = re.sub(r"\s+", " ", text)
    
    return text.strip()


def patch_tts_api():
    """
    Apply critical Coqui validation bug workaround.
    Disables the _check_arguments validation which causes issues with custom VITS models.
    """
    from TTS.api import TTS
    
    def _no_check_arguments(*args, **kwargs):
        return
    
    TTS._check_arguments = _no_check_arguments
    logger.info("TTS API patched successfully")


def load_model():
    """Load the Plattdeutsch TTS model from disk."""
    global tts_model
    
    try:
        # Get absolute path to model files
        project_root = Path(__file__).parent.parent
        model_path = project_root / "model" / "best_model.pth"
        config_path = project_root / "model" / "config.json"
        
        logger.info(f"Model path: {model_path}")
        logger.info(f"Config path: {config_path}")
        
        # Verify files exist
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        if not config_path.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        logger.info("Loading TTS model (this may take several minutes on CPU)...")
        logger.info("Please wait - loading 951 MB model weights into memory...")
        
        # Apply patch before loading TTS
        patch_tts_api()
        
        # Import and load TTS
        from TTS.api import TTS
        
        tts_model = TTS(
            model_path=str(model_path),
            config_path=str(config_path),
            gpu=False
        )
        
        logger.info("✓ TTS model loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}", exc_info=True)
        return False


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://127.0.0.1:3000", "http://127.0.0.1:3002", "http://localhost:3000", "http://localhost:3002"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Configure upload folder
    UPLOAD_FOLDER = Path(__file__).parent / "temp"
    UPLOAD_FOLDER.mkdir(exist_ok=True)
    app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
    
    # ============================================================
    # API Routes
    # ============================================================
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Check if the TTS service is healthy."""
        return jsonify({
            'status': 'ok',
            'model_loaded': tts_model is not None
        }), 200
    
    
    @app.route('/api/tts', methods=['POST'])
    def text_to_speech():
        """
        Generate speech from Plattdeutsch text.
        
        Request JSON:
        {
            "text": "Plattdeutsch text",
            "temperature": 0.7,      # Optional, default 0.7
            "length_scale": 1.0,     # Optional, default 1.0
            "noise_scale": 0.6,      # Optional, default 0.6
            "noise_scale_w": 0.8     # Optional, default 0.8
        }
        
        Returns:
        - WAV audio file (binary)
        - 400: Bad request (missing text or invalid params)
        - 500: Server error (TTS generation failed)
        """
        if tts_model is None:
            return jsonify({'error': 'Model not loaded'}), 503
        
        try:
            data = request.get_json()
            
            if not data or 'text' not in data:
                return jsonify({'error': 'Missing required field: text'}), 400
            
            text = str(data.get('text', '')).strip()
            
            if not text:
                return jsonify({'error': 'Text cannot be empty'}), 400
            
            if len(text) > 1000:
                return jsonify({'error': 'Text too long (max 1000 characters)'}), 400
            
            # Get optional parameters with improved defaults (less robotic)
            temperature = float(data.get('temperature', 0.7))
            length_scale = float(data.get('length_scale', 1.03))  # Slightly faster, less dragging
            noise_scale = float(data.get('noise_scale', 0.78))    # Pitch micro-variation
            noise_scale_w = float(data.get('noise_scale_w', 0.92)) # Prosody freedom
            
            # Validate parameter ranges
            temperature = max(0.1, min(1.0, temperature))
            length_scale = max(0.5, min(2.0, length_scale))
            noise_scale = max(0.0, min(1.0, noise_scale))
            noise_scale_w = max(0.0, min(1.0, noise_scale_w))
            
            logger.info(f"Generating TTS for: {text[:50]}...")
            logger.debug(f"Parameters: len={length_scale}, noise={noise_scale}, noise_w={noise_scale_w}")
            
            # Normalize text for better synthesis
            text = normalize_text(text)
            logger.info(f"Normalized text: {text}")
            
            # Generate speech
            wav = tts_model.tts(
                text=text,
                length_scale=length_scale,
                noise_scale=noise_scale,
                noise_scale_w=noise_scale_w
            )
            
            # Convert to WAV file
            if isinstance(wav, list):
                wav = np.array(wav)
            
            from scipy.io import wavfile
            
            # Proper loudness normalization (prevent clipping)
            wav_max = np.max(np.abs(wav))
            if wav_max > 0:
                wav = wav / wav_max * 0.95  # Normalize to 95% to avoid clipping
            
            # Create BytesIO buffer
            output = BytesIO()
            
            # Write WAV file to buffer (22050 Hz standard for VITS)
            sample_rate = 22050
            
            wav_int16 = (wav * 32767).astype(np.int16)
            wavfile.write(output, sample_rate, wav_int16)
            output.seek(0)
            
            logger.info("✓ TTS generation successful")
            
            return send_file(
                output,
                mimetype='audio/wav',
                as_attachment=True,
                download_name='output.wav'
            )
            
        except ValueError as e:
            logger.error(f"Invalid parameter: {str(e)}")
            return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
        except Exception as e:
            logger.error(f"TTS generation failed: {str(e)}", exc_info=True)
            return jsonify({'error': f'TTS generation failed: {str(e)}'}), 500
    
    
    @app.route('/api/info', methods=['GET'])
    def model_info():
        """Get information about the loaded model."""
        if tts_model is None:
            return jsonify({'error': 'Model not loaded'}), 503
        
        try:
            info = {
                'model_name': 'Plattdeutsch VITS',
                'language': 'Plattdeutsch (Low German)',
                'model_type': 'VITS',
                'sample_rate': 22050,
                'parameters': {
                    'temperature': {'min': 0.1, 'max': 1.0, 'default': 0.7},
                    'length_scale': {'min': 0.5, 'max': 2.0, 'default': 1.0},
                    'noise_scale': {'min': 0.0, 'max': 1.0, 'default': 0.6},
                    'noise_scale_w': {'min': 0.0, 'max': 1.0, 'default': 0.8}
                }
            }
            return jsonify(info), 200
        except Exception as e:
            logger.error(f"Failed to get model info: {str(e)}")
            return jsonify({'error': 'Failed to get model info'}), 500
    
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors."""
        return jsonify({'error': 'Endpoint not found'}), 404
    
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors."""
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({'error': 'Internal server error'}), 500
    
    
    return app


def main():
    """Main entry point."""
    print("=" * 60)
    print("Plattdeutsch TTS Backend - Flask Server")
    print("=" * 60)
    
    # Load model
    print("\nLoading TTS model...")
    if not load_model():
        print("ERROR: Failed to load model. Exiting.")
        sys.exit(1)
    
    # Create Flask app
    app = create_app()
    
    # Run server
    print("\nStarting Flask server on http://127.0.0.1:5000")
    print("CORS enabled for frontend on http://127.0.0.1:3000 and http://127.0.0.1:3002")
    print("\nPress Ctrl+C to stop the server.")
    print("=" * 60 + "\n")
    
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=False,
        use_reloader=False
    )


if __name__ == '__main__':
    main()
