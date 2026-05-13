from fastapi import FastAPI
from fastapi import WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.websocket.stream_handler import websocket_endpoint
from app.config import *

app = FastAPI(title=APP_NAME, version=APP_VERSION, debug=DEBUG)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {
        "message": "DriveSafe Backend Running",
        "version": APP_VERSION,
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)