import cv2
from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
from pathlib import Path

from app.websocket.stream_handler import (
    websocket_endpoint
)
from app.processors.video_processor import process_video_files

# =========================================
# FASTAPI APP
# =========================================

app = FastAPI()

# =========================================
# CORS MIDDLEWARE
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# CONFIGURATION
# =========================================

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

OUTPUTS_DIR = Path("outputs")
OUTPUTS_DIR.mkdir(exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# =========================================
# ROOT ROUTE
# =========================================

@app.get("/")
def home():
    return {
        "message": "DriveSafe Backend Running",
        "endpoints": {
            "upload": "/api/upload/videos",
            "websocket": "/ws",
            "health": "/health"
        }
    }

# =========================================
# HEALTH CHECK
# =========================================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "DriveSafe Backend"}

# =========================================
# VIDEO UPLOAD ENDPOINT
# =========================================

@app.post("/api/upload/videos")
async def upload_videos(
    road_video: UploadFile = File(...),
    cabin_video: UploadFile = File(...)
):
    try:
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        session_dir = UPLOAD_DIR / session_id
        session_dir.mkdir(exist_ok=True)
        
        # Save uploaded videos
        road_video_path = session_dir / "road_video.mp4"
        cabin_video_path = session_dir / "cabin_video.mp4"
        
        with open(road_video_path, "wb") as buffer:
            content = await road_video.read()
            buffer.write(content)
            
        with open(cabin_video_path, "wb") as buffer:
            content = await cabin_video.read()
            buffer.write(content)
        
        # Read video durations to determine processing time
        road_cap = cv2.VideoCapture(str(road_video_path))
        road_fps = road_cap.get(cv2.CAP_PROP_FPS)
        road_frames = road_cap.get(cv2.CAP_PROP_FRAME_COUNT)
        road_duration = road_frames / road_fps if road_fps > 0 else 0
        road_cap.release()

        cabin_cap = cv2.VideoCapture(str(cabin_video_path))
        cabin_fps = cabin_cap.get(cv2.CAP_PROP_FPS)
        cabin_frames = cabin_cap.get(cv2.CAP_PROP_FRAME_COUNT)
        cabin_duration = cabin_frames / cabin_fps if cabin_fps > 0 else 0
        cabin_cap.release()

        process_duration = min(cabin_duration, road_duration)

        # Process videos with duration limit
        processing_result = process_video_files(
            str(road_video_path),
            str(cabin_video_path),
            session_id,
            process_duration
        )
        
        return {
            "session_id": session_id,
            "status": "processing_started",
            "duration": process_duration,
            "message": "Videos uploaded and processing started",
            "video_info": {
                "road_video": {
                    "filename": road_video.filename,
                    "size": os.path.getsize(road_video_path)
                },
                "cabin_video": {
                    "filename": cabin_video.filename,
                    "size": os.path.getsize(cabin_video_path)
                }
            },
            "processing": processing_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# =========================================
# PROCESSING STATUS ENDPOINT
# =========================================

@app.get("/api/processing/{session_id}")
async def get_processing_status(session_id: str):
    # In a real implementation, you would check processing status from a database or queue
    # For now, return a mock response
    return {
        "session_id": session_id,
        "status": "processing",
        "progress": 0.5,
        "estimated_time_remaining": 30
    }

# =========================================
# WEBSOCKET ROUTE
# =========================================

@app.websocket("/ws")
async def websocket_route(
    websocket: WebSocket
):
    await websocket_endpoint(
        websocket
    )