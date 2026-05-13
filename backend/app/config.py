"""
Configuration settings for DriveSafe backend
"""

import os
from typing import Optional

# Application settings
APP_NAME = "DriveSafe Backend"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Server settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# WebSocket settings
WEBSOCKET_MAX_CONNECTIONS = int(os.getenv("WEBSOCKET_MAX_CONNECTIONS", "100"))
WEBSOCKET_TIMEOUT = int(os.getenv("WEBSOCKET_TIMEOUT", "300"))

# Model settings (for future ML features)
MODEL_PATH = os.getenv("MODEL_PATH", "models/")
USE_GPU = os.getenv("USE_GPU", "False").lower() == "true"

# Logging settings
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# CORS settings (for frontend integration)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Add any additional origins from environment variable
ADDITIONAL_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")
if ADDITIONAL_ORIGINS:
    ALLOWED_ORIGINS.extend([origin.strip() for origin in ADDITIONAL_ORIGINS.split(",")])