"""
DriveSafe Backend Application Package
"""

__version__ = "1.0.0"
__author__ = "DriveSafe Team"

# Import key modules to make them available at package level
from .main import app
from .config import *

# Define what gets imported with "from app import *"
__all__ = [
    "app",
]