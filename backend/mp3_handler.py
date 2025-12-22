"""
MP3 Download Handler - Production-Ready
Robust MP3 conversion and download mechanism with proper error handling,
temporary file management, and browser compatibility.
"""

import os
import tempfile
from pathlib import Path
from io import BytesIO
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class MP3Handler:
    """Production-grade MP3 download handler"""
    
    def __init__(self, temp_dir: str = "./temp/mp3"):
        """
        Initialize MP3 handler.
        
        Args:
            temp_dir: Directory for temporary MP3 files
        """
        self.temp_dir = Path(temp_dir)
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.max_age_seconds = 3600  # Clean up files older than 1 hour
        
    def cleanup_old_files(self):
        """Remove temporary MP3 files older than max_age_seconds"""
        try:
            now = datetime.now().timestamp()
            for file in self.temp_dir.glob("*.mp3"):
                file_age = now - file.stat().st_mtime
                if file_age > self.max_age_seconds:
                    file.unlink()
                    logger.info(f"Cleaned up old MP3: {file.name}")
        except Exception as e:
            logger.error(f"Error cleaning up old MP3 files: {e}")
    
    def save_to_disk(self, audio_bytes: bytes, filename: str) -> Path:
        """
        Save audio bytes to temporary disk location.
        
        Args:
            audio_bytes: Raw audio data
            filename: Original filename (without .mp3)
            
        Returns:
            Path to saved file
        """
        try:
            # Clean old files first
            self.cleanup_old_files()
            
            # Create safe filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_filename = f"{filename}_{timestamp}.mp3"
            file_path = self.temp_dir / safe_filename
            
            # Write to disk
            with open(file_path, 'wb') as f:
                f.write(audio_bytes)
            
            logger.info(f"MP3 saved to disk: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Failed to save MP3 to disk: {e}")
            raise
    
    def get_download_headers(self, filename: str) -> dict:
        """
        Get proper HTTP headers for browser download.
        
        Args:
            filename: Name for the downloaded file (without .mp3)
            
        Returns:
            Dictionary of headers
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        download_name = f"{filename}_{timestamp}.mp3"
        
        return {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': f'attachment; filename="{download_name}"',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }


# Global MP3 handler instance
mp3_handler = None


def init_mp3_handler(temp_dir: str = "./temp/mp3"):
    """Initialize the global MP3 handler"""
    global mp3_handler
    mp3_handler = MP3Handler(temp_dir)
    logger.info(f"MP3 Handler initialized with temp_dir: {temp_dir}")


def get_mp3_handler() -> MP3Handler:
    """Get the global MP3 handler (initialize if needed)"""
    global mp3_handler
    if mp3_handler is None:
        init_mp3_handler()
    return mp3_handler
