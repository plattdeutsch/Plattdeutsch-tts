"""
Model Management System - Production-Ready
Handles model lifecycle: upload, validation, activation, deactivation.
Supports safe dynamic model switching without server restart.
"""

import json
import logging
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List

logger = logging.getLogger(__name__)


class ModelManager:
    """Production-grade model lifecycle manager"""
    
    def __init__(self, base_path: str = "./models"):
        """
        Initialize model manager.
        
        Args:
            base_path: Base directory for all model storage
        """
        self.base_path = Path(base_path)
        self.active_dir = self.base_path / "active"
        self.inactive_dir = self.base_path / "inactive"
        
        # Create directory structure
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.active_dir.mkdir(parents=True, exist_ok=True)
        self.inactive_dir.mkdir(parents=True, exist_ok=True)
        
        # Metadata file for tracking active model
        self.metadata_file = self.base_path / "metadata.json"
        self._ensure_metadata()
        
        logger.info(f"ModelManager initialized at {self.base_path}")
    
    def _ensure_metadata(self):
        """Ensure metadata file exists"""
        if not self.metadata_file.exists():
            initial_metadata = {
                "active_model": None,
                "last_activated": None,
                "models": []
            }
            self._save_metadata(initial_metadata)
    
    def _load_metadata(self) -> Dict:
        """Load model metadata"""
        try:
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading metadata: {e}")
            return {"active_model": None, "models": []}
    
    def _save_metadata(self, metadata: Dict):
        """Save model metadata"""
        try:
            with open(self.metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving metadata: {e}")
    
    def get_active_model(self) -> Optional[Dict]:
        """Get information about active model"""
        metadata = self._load_metadata()
        if metadata.get("active_model"):
            active_path = self.active_dir / metadata["active_model"]
            if active_path.exists():
                config_path = active_path / "config.json"
                if config_path.exists():
                    try:
                        with open(config_path, 'r') as f:
                            config = json.load(f)
                        return {
                            "name": metadata["active_model"],
                            "path": str(active_path),
                            "config_path": str(config_path),
                            "activated_at": metadata.get("last_activated"),
                            "status": "ACTIVE"
                        }
                    except Exception as e:
                        logger.error(f"Error reading active model config: {e}")
        return None
    
    def get_inactive_models(self) -> List[Dict]:
        """List all inactive models"""
        models = []
        try:
            for model_dir in self.inactive_dir.iterdir():
                if model_dir.is_dir():
                    config_path = model_dir / "config.json"
                    if config_path.exists():
                        try:
                            with open(config_path, 'r') as f:
                                config = json.load(f)
                            models.append({
                                "name": model_dir.name,
                                "path": str(model_dir),
                                "status": "INACTIVE",
                                "created_at": datetime.fromtimestamp(
                                    model_dir.stat().st_ctime
                                ).isoformat()
                            })
                        except Exception as e:
                            logger.error(f"Error reading model config: {e}")
        except Exception as e:
            logger.error(f"Error listing inactive models: {e}")
        return models
    
    def activate_model(self, model_name: str) -> bool:
        """
        Activate an inactive model.
        
        Args:
            model_name: Name of model in inactive directory
            
        Returns:
            True if successful
        """
        try:
            model_path = self.inactive_dir / model_name
            
            # Validate model exists
            if not model_path.exists():
                logger.error(f"Model not found: {model_path}")
                return False
            
            # Validate config.json exists
            config_path = model_path / "config.json"
            if not config_path.exists():
                logger.error(f"Config not found for {model_name}")
                return False
            
            # Clear active directory
            if self.active_dir.exists():
                shutil.rmtree(self.active_dir)
            self.active_dir.mkdir(parents=True, exist_ok=True)
            
            # Move model to active directory
            active_model_path = self.active_dir / model_name
            shutil.copytree(model_path, active_model_path)
            
            # Update metadata
            metadata = self._load_metadata()
            metadata["active_model"] = model_name
            metadata["last_activated"] = datetime.now().isoformat()
            self._save_metadata(metadata)
            
            logger.info(f"Model activated: {model_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error activating model: {e}")
            return False
    
    def deactivate_model(self) -> bool:
        """
        Deactivate current active model.
        
        Returns:
            True if successful
        """
        try:
            if self.active_dir.exists():
                shutil.rmtree(self.active_dir)
            self.active_dir.mkdir(parents=True, exist_ok=True)
            
            metadata = self._load_metadata()
            metadata["active_model"] = None
            self._save_metadata(metadata)
            
            logger.info("Model deactivated")
            return True
            
        except Exception as e:
            logger.error(f"Error deactivating model: {e}")
            return False
    
    def delete_model(self, model_name: str) -> bool:
        """
        Delete an inactive model.
        
        Args:
            model_name: Name of model to delete
            
        Returns:
            True if successful
        """
        try:
            model_path = self.inactive_dir / model_name
            
            if model_path.exists():
                shutil.rmtree(model_path)
                logger.info(f"Model deleted: {model_name}")
                return True
            else:
                logger.error(f"Model not found: {model_name}")
                return False
                
        except Exception as e:
            logger.error(f"Error deleting model: {e}")
            return False


# Global model manager instance
model_manager = None


def init_model_manager(base_path: str = "./models"):
    """Initialize the global model manager"""
    global model_manager
    model_manager = ModelManager(base_path)
    logger.info("Model manager initialized")


def get_model_manager() -> ModelManager:
    """Get the global model manager (initialize if needed)"""
    global model_manager
    if model_manager is None:
        init_model_manager()
    return model_manager
