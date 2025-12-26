"""
Plattdeutsch TTS Backend - AWS Elastic Beanstalk Entry Point
Production-ready Flask application that can start WITHOUT a model.
Model is uploaded and activated via Admin Panel after deployment.

DEPLOYMENT: AWS Elastic Beanstalk (eu-central-1)
"""

import os
import sys
import json
import logging
import tempfile
import shutil
from pathlib import Path
from io import BytesIO
from datetime import datetime
from functools import wraps

import numpy as np
from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Configure logging for production
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURATION
# =============================================================================

class Config:
    """Application configuration from environment variables"""
    
    # Model storage - use EBS volume path for persistence
    MODEL_BASE_PATH = os.environ.get('MODEL_BASE_PATH', '/var/app/models')
    
    # Flask settings
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 1024 * 1024 * 1024))  # 1GB for model uploads
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
    
    # Admin authentication (simple token-based for model uploads)
    ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', None)  # Must be set in production
    
    # CORS origins
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Static files (built frontend)
    STATIC_FOLDER = os.environ.get('STATIC_FOLDER', '../frontend/dist')


# =============================================================================
# GLOBAL STATE
# =============================================================================

tts_model = None
model_info = {
    'loaded': False,
    'name': None,
    'loaded_at': None,
    'error': None
}


# =============================================================================
# TEXT NORMALIZATION
# =============================================================================

def normalize_text(text: str) -> str:
    """Normalize text for Plattdeutsch TTS synthesis."""
    import re
    
    text = text.replace("„", "\"").replace(""", "\"").replace(""", "\"")
    text = text.replace("'", "'").replace("'", "'")
    text = text.replace("–", "-").replace("—", "-")
    text = re.sub(r"\s+([.,!?;:])", r"\1", text)
    text = re.sub(r"([.,!?;:])([^\s])", r"\1 \2", text)
    text = re.sub(r"\s+", " ", text)
    
    return text.strip()


# =============================================================================
# TTS API PATCH
# =============================================================================

def patch_tts_api():
    """Apply Coqui TTS validation workaround for custom VITS models."""
    try:
        from TTS.api import TTS
        
        def _no_check_arguments(*args, **kwargs):
            return
        
        TTS._check_arguments = _no_check_arguments
        logger.info("TTS API patched successfully")
        return True
    except ImportError:
        logger.warning("TTS library not available - model loading disabled")
        return False


# =============================================================================
# MODEL MANAGEMENT
# =============================================================================

def get_model_paths():
    """Get paths for model storage."""
    base = Path(Config.MODEL_BASE_PATH)
    return {
        'base': base,
        'active': base / 'active',
        'inactive': base / 'inactive',
        'metadata': base / 'metadata.json'
    }


def ensure_model_directories():
    """Create model storage directories if they don't exist."""
    paths = get_model_paths()
    for key in ['base', 'active', 'inactive']:
        paths[key].mkdir(parents=True, exist_ok=True)
    logger.info(f"Model directories ensured at {paths['base']}")


def get_model_metadata():
    """Load model metadata."""
    paths = get_model_paths()
    if paths['metadata'].exists():
        try:
            with open(paths['metadata'], 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading metadata: {e}")
    return {'active_model': None, 'models': [], 'last_updated': None}


def save_model_metadata(metadata):
    """Save model metadata."""
    paths = get_model_paths()
    metadata['last_updated'] = datetime.now().isoformat()
    try:
        with open(paths['metadata'], 'w') as f:
            json.dump(metadata, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving metadata: {e}")


def load_model_from_path(model_path: Path, config_path: Path):
    """Load TTS model from specific paths."""
    global tts_model, model_info
    
    try:
        logger.info(f"Loading model from {model_path}")
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        if not config_path.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        # Apply TTS API patch
        if not patch_tts_api():
            raise RuntimeError("Failed to patch TTS API")
        
        from TTS.api import TTS
        
        tts_model = TTS(
            model_path=str(model_path),
            config_path=str(config_path),
            gpu=False
        )
        
        model_info = {
            'loaded': True,
            'name': model_path.parent.name,
            'loaded_at': datetime.now().isoformat(),
            'error': None
        }
        
        logger.info(f"✓ Model loaded successfully: {model_info['name']}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}", exc_info=True)
        model_info = {
            'loaded': False,
            'name': None,
            'loaded_at': None,
            'error': str(e)
        }
        tts_model = None
        return False


def try_load_active_model():
    """Attempt to load the currently active model (if any)."""
    global tts_model, model_info
    
    paths = get_model_paths()
    ensure_model_directories()
    
    # Check for active model
    active_dir = paths['active']
    
    # Look for model files in active directory
    model_dirs = [d for d in active_dir.iterdir() if d.is_dir()] if active_dir.exists() else []
    
    if not model_dirs:
        logger.info("No active model found - application starting in model-less mode")
        model_info = {
            'loaded': False,
            'name': None,
            'loaded_at': None,
            'error': 'No model uploaded yet. Use Admin Panel to upload a model.'
        }
        return False
    
    # Use first model directory found
    model_dir = model_dirs[0]
    model_path = model_dir / 'best_model.pth'
    config_path = model_dir / 'config.json'
    
    return load_model_from_path(model_path, config_path)


# =============================================================================
# AUTHENTICATION DECORATOR
# =============================================================================

def require_admin(f):
    """Decorator to require admin authentication for sensitive endpoints."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if Config.ADMIN_TOKEN:
            token = request.headers.get('X-Admin-Token') or request.args.get('admin_token')
            if token != Config.ADMIN_TOKEN:
                return jsonify({'error': 'Unauthorized - invalid or missing admin token'}), 401
        return f(*args, **kwargs)
    return decorated_function


# =============================================================================
# FLASK APPLICATION FACTORY
# =============================================================================

def create_app():
    """Create and configure the Flask application."""
    
    # Determine static folder path
    static_folder = Path(__file__).parent / Config.STATIC_FOLDER
    if not static_folder.exists():
        static_folder = Path(__file__).parent / 'static'
    
    app = Flask(__name__, 
                static_folder=str(static_folder) if static_folder.exists() else None,
                static_url_path='')
    
    app.config['SECRET_KEY'] = Config.SECRET_KEY
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
    
    # Configure CORS for API routes
    CORS(app, resources={
        r"/api/*": {
            "origins": Config.CORS_ORIGINS,
            "methods": ["GET", "POST", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "X-Admin-Token"]
        }
    })
    
    # Temp folder for uploads
    temp_folder = Path(__file__).parent / 'temp'
    temp_folder.mkdir(exist_ok=True)
    app.config['UPLOAD_FOLDER'] = str(temp_folder)
    
    # =========================================================================
    # HEALTH & STATUS ENDPOINTS
    # =========================================================================
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """
        Health check endpoint for Elastic Beanstalk.
        Returns 200 even if model is not loaded (app is healthy, just not ready for TTS).
        """
        return jsonify({
            'status': 'ok',
            'model_loaded': model_info['loaded'],
            'model_name': model_info.get('name'),
            'timestamp': datetime.now().isoformat()
        }), 200
    
    @app.route('/api/status', methods=['GET'])
    def detailed_status():
        """Detailed application status."""
        paths = get_model_paths()
        
        # Count inactive models
        inactive_count = 0
        try:
            inactive_count = len([d for d in paths['inactive'].iterdir() if d.is_dir()])
        except:
            pass
        
        return jsonify({
            'application': 'Plattdeutsch TTS',
            'version': '2.0.0',
            'environment': os.environ.get('FLASK_ENV', 'production'),
            'model': model_info,
            'storage': {
                'base_path': str(paths['base']),
                'inactive_models': inactive_count
            },
            'timestamp': datetime.now().isoformat()
        }), 200
    
    # =========================================================================
    # TTS ENDPOINTS
    # =========================================================================
    
    @app.route('/api/tts', methods=['POST'])
    def text_to_speech():
        """Generate speech from Plattdeutsch text."""
        if tts_model is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'No TTS model is currently active. Please upload and activate a model via the Admin Panel.',
                'code': 'MODEL_NOT_LOADED'
            }), 503
        
        try:
            data = request.get_json()
            
            if not data or 'text' not in data:
                return jsonify({'error': 'Missing required field: text'}), 400
            
            text = str(data.get('text', '')).strip()
            
            if not text:
                return jsonify({'error': 'Text cannot be empty'}), 400
            
            if len(text) > 1000:
                return jsonify({'error': 'Text too long (max 1000 characters)'}), 400
            
            # Get parameters with defaults
            temperature = float(data.get('temperature', 0.7))
            length_scale = float(data.get('length_scale', 1.03))
            noise_scale = float(data.get('noise_scale', 0.78))
            noise_scale_w = float(data.get('noise_scale_w', 0.92))
            
            # Clamp parameters
            temperature = max(0.1, min(1.0, temperature))
            length_scale = max(0.5, min(2.0, length_scale))
            noise_scale = max(0.0, min(1.0, noise_scale))
            noise_scale_w = max(0.0, min(1.0, noise_scale_w))
            
            # Normalize text
            text = normalize_text(text)
            logger.info(f"Generating TTS for: {text[:50]}...")
            
            # Generate speech
            wav = tts_model.tts(
                text=text,
                length_scale=length_scale,
                noise_scale=noise_scale,
                noise_scale_w=noise_scale_w
            )
            
            # Convert to numpy array
            if isinstance(wav, list):
                wav = np.array(wav)
            
            from scipy.io import wavfile
            
            # Normalize audio
            wav_max = np.max(np.abs(wav))
            if wav_max > 0:
                wav = wav / wav_max * 0.95
            
            # Write to buffer
            output = BytesIO()
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
            
        except Exception as e:
            logger.error(f"TTS generation failed: {e}", exc_info=True)
            return jsonify({'error': f'TTS generation failed: {str(e)}'}), 500
    
    @app.route('/api/info', methods=['GET'])
    def get_model_info():
        """Get information about the loaded model."""
        if tts_model is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'Upload a model via Admin Panel to enable TTS.',
                'code': 'MODEL_NOT_LOADED'
            }), 503
        
        return jsonify({
            'model_name': 'Plattdeutsch VITS',
            'language': 'Plattdeutsch (Low German)',
            'model_type': 'VITS',
            'sample_rate': 22050,
            'loaded_at': model_info.get('loaded_at'),
            'parameters': {
                'temperature': {'min': 0.1, 'max': 1.0, 'default': 0.7},
                'length_scale': {'min': 0.5, 'max': 2.0, 'default': 1.03},
                'noise_scale': {'min': 0.0, 'max': 1.0, 'default': 0.78},
                'noise_scale_w': {'min': 0.0, 'max': 1.0, 'default': 0.92}
            }
        }), 200
    
    # =========================================================================
    # MODEL MANAGEMENT ENDPOINTS (Admin)
    # =========================================================================
    
    @app.route('/api/admin/models', methods=['GET'])
    @require_admin
    def list_models():
        """List all available models."""
        paths = get_model_paths()
        models = []
        
        # Active model
        if model_info['loaded']:
            models.append({
                'name': model_info['name'],
                'status': 'ACTIVE',
                'loaded_at': model_info['loaded_at']
            })
        
        # Inactive models
        try:
            for model_dir in paths['inactive'].iterdir():
                if model_dir.is_dir():
                    config_path = model_dir / 'config.json'
                    if config_path.exists():
                        models.append({
                            'name': model_dir.name,
                            'status': 'INACTIVE',
                            'path': str(model_dir)
                        })
        except Exception as e:
            logger.error(f"Error listing models: {e}")
        
        return jsonify({'models': models}), 200
    
    @app.route('/api/admin/models/upload', methods=['POST'])
    @require_admin
    def upload_model():
        """
        Upload a new model (ZIP containing best_model.pth and config.json).
        """
        if 'model' not in request.files:
            return jsonify({'error': 'No model file provided'}), 400
        
        file = request.files['model']
        model_name = request.form.get('name', f'model_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
        model_name = secure_filename(model_name)
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        paths = get_model_paths()
        target_dir = paths['inactive'] / model_name
        
        try:
            # Save uploaded file temporarily
            temp_path = Path(app.config['UPLOAD_FOLDER']) / secure_filename(file.filename)
            file.save(str(temp_path))
            
            # Extract if ZIP
            if temp_path.suffix.lower() == '.zip':
                import zipfile
                target_dir.mkdir(parents=True, exist_ok=True)
                with zipfile.ZipFile(temp_path, 'r') as zip_ref:
                    zip_ref.extractall(target_dir)
                temp_path.unlink()
            else:
                # Single file (assume it's the model)
                target_dir.mkdir(parents=True, exist_ok=True)
                shutil.move(str(temp_path), str(target_dir / temp_path.name))
            
            # Validate model files exist
            model_file = target_dir / 'best_model.pth'
            config_file = target_dir / 'config.json'
            
            if not model_file.exists() and not config_file.exists():
                # Check subdirectory
                subdirs = [d for d in target_dir.iterdir() if d.is_dir()]
                if subdirs:
                    subdir = subdirs[0]
                    if (subdir / 'best_model.pth').exists():
                        # Move files up
                        for item in subdir.iterdir():
                            shutil.move(str(item), str(target_dir / item.name))
                        subdir.rmdir()
            
            model_file = target_dir / 'best_model.pth'
            config_file = target_dir / 'config.json'
            
            if not model_file.exists():
                shutil.rmtree(target_dir)
                return jsonify({'error': 'Invalid model: best_model.pth not found'}), 400
            
            if not config_file.exists():
                shutil.rmtree(target_dir)
                return jsonify({'error': 'Invalid model: config.json not found'}), 400
            
            # Update metadata
            metadata = get_model_metadata()
            if model_name not in metadata['models']:
                metadata['models'].append(model_name)
            save_model_metadata(metadata)
            
            logger.info(f"Model uploaded: {model_name}")
            
            return jsonify({
                'success': True,
                'model_name': model_name,
                'message': f'Model {model_name} uploaded successfully. Use /api/admin/models/activate to activate it.'
            }), 200
            
        except Exception as e:
            logger.error(f"Upload failed: {e}", exc_info=True)
            if target_dir.exists():
                shutil.rmtree(target_dir)
            return jsonify({'error': f'Upload failed: {str(e)}'}), 500
    
    @app.route('/api/admin/models/activate', methods=['POST'])
    @require_admin
    def activate_model():
        """Activate an uploaded model."""
        global tts_model, model_info
        
        data = request.get_json()
        model_name = data.get('name') if data else None
        
        if not model_name:
            return jsonify({'error': 'Model name required'}), 400
        
        paths = get_model_paths()
        source_dir = paths['inactive'] / model_name
        
        if not source_dir.exists():
            return jsonify({'error': f'Model not found: {model_name}'}), 404
        
        try:
            # Clear active directory
            if paths['active'].exists():
                shutil.rmtree(paths['active'])
            paths['active'].mkdir(parents=True, exist_ok=True)
            
            # Copy model to active
            target_dir = paths['active'] / model_name
            shutil.copytree(source_dir, target_dir)
            
            # Load the model
            model_path = target_dir / 'best_model.pth'
            config_path = target_dir / 'config.json'
            
            if load_model_from_path(model_path, config_path):
                # Update metadata
                metadata = get_model_metadata()
                metadata['active_model'] = model_name
                save_model_metadata(metadata)
                
                return jsonify({
                    'success': True,
                    'message': f'Model {model_name} activated successfully',
                    'model_info': model_info
                }), 200
            else:
                return jsonify({
                    'error': 'Failed to load model',
                    'details': model_info.get('error')
                }), 500
                
        except Exception as e:
            logger.error(f"Activation failed: {e}", exc_info=True)
            return jsonify({'error': f'Activation failed: {str(e)}'}), 500
    
    @app.route('/api/admin/models/deactivate', methods=['POST'])
    @require_admin
    def deactivate_model():
        """Deactivate the current model."""
        global tts_model, model_info
        
        paths = get_model_paths()
        
        try:
            # Clear active directory
            if paths['active'].exists():
                shutil.rmtree(paths['active'])
            paths['active'].mkdir(parents=True, exist_ok=True)
            
            # Reset model state
            tts_model = None
            model_info = {
                'loaded': False,
                'name': None,
                'loaded_at': None,
                'error': 'Model deactivated'
            }
            
            # Update metadata
            metadata = get_model_metadata()
            metadata['active_model'] = None
            save_model_metadata(metadata)
            
            return jsonify({
                'success': True,
                'message': 'Model deactivated'
            }), 200
            
        except Exception as e:
            logger.error(f"Deactivation failed: {e}", exc_info=True)
            return jsonify({'error': f'Deactivation failed: {str(e)}'}), 500
    
    @app.route('/api/admin/models/<model_name>', methods=['DELETE'])
    @require_admin
    def delete_model(model_name):
        """Delete an inactive model."""
        paths = get_model_paths()
        model_path = paths['inactive'] / secure_filename(model_name)
        
        if not model_path.exists():
            return jsonify({'error': 'Model not found'}), 404
        
        try:
            shutil.rmtree(model_path)
            
            # Update metadata
            metadata = get_model_metadata()
            if model_name in metadata['models']:
                metadata['models'].remove(model_name)
            save_model_metadata(metadata)
            
            return jsonify({
                'success': True,
                'message': f'Model {model_name} deleted'
            }), 200
            
        except Exception as e:
            logger.error(f"Delete failed: {e}", exc_info=True)
            return jsonify({'error': f'Delete failed: {str(e)}'}), 500
    
    # =========================================================================
    # STATIC FILES (Frontend)
    # =========================================================================
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve the React frontend."""
        if app.static_folder is None:
            return jsonify({
                'error': 'Frontend not built',
                'message': 'The frontend static files are not available. Build the frontend first.'
            }), 404
        
        # Serve static files
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        
        # Serve index.html for SPA routing
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, 'index.html')
        
        return jsonify({'error': 'Frontend not found'}), 404
    
    # =========================================================================
    # ERROR HANDLERS
    # =========================================================================
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({'error': 'File too large'}), 413
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({'error': 'Internal server error'}), 500
    
    return app


# =============================================================================
# APPLICATION ENTRY POINT
# =============================================================================

# Create the application instance (for Gunicorn/EB)
application = create_app()

# Alias for some WSGI servers
app = application


def main():
    """Development server entry point."""
    print("=" * 60)
    print("Plattdeutsch TTS Backend - Development Server")
    print("=" * 60)
    
    # Try to load active model
    print("\nChecking for active model...")
    try_load_active_model()
    
    if model_info['loaded']:
        print(f"✓ Model loaded: {model_info['name']}")
    else:
        print("⚠ No model loaded - application starting in model-less mode")
        print("  Use Admin Panel to upload and activate a model")
    
    print("\nStarting development server...")
    print("Health check: http://127.0.0.1:5000/api/health")
    print("=" * 60 + "\n")
    
    application.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    )


if __name__ == '__main__':
    # Initialize model on startup
    try_load_active_model()
    main()
