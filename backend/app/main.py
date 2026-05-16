from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.websocket.stream_handler import (
    websocket_endpoint
)

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
# ROOT ROUTE
# =========================================

@app.get("/")
def home():

    return {

        "message":
        "DriveSafe Backend Running"
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