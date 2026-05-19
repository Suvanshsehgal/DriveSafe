from fastapi import WebSocket
import json
import asyncio
from pathlib import Path
from urllib.parse import parse_qs

from app.utils.image_utils import (
    decode_base64_image,
    encode_image_to_base64
)

from app.processors.road_processor import (
    process_road_frame
)

from app.processors.driver_processor import (
    process_driver_frame
)

from app.processors.fusion_processor import (
    fuse_risk_scores
)

from app.processors.video_processor import (
    get_processing_results,
    get_processing_status,
    processing_manager
)


# =========================================
# WEBSOCKET STREAM HANDLER
# =========================================

async def websocket_endpoint(
    websocket: WebSocket
):
    # ACCEPT CONNECTION
    await websocket.accept()
    
    print("WebSocket Client Connected")
    
    try:
        # Get session ID from query params
        query_string = websocket.scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        session_id = query_params.get("session_id", [None])[0]
        
        if session_id:
            print(f"WebSocket connected for session: {session_id}")
            
            # Stream results from video processing
            await stream_video_results(websocket, session_id)
        else:
            # Real-time frame processing mode
            await real_time_processing(websocket)
            
    except Exception as error:
        print("WebSocket Error:", error)
        await websocket.close()


# =========================================
# REAL-TIME PROCESSING MODE
# =========================================

async def real_time_processing(websocket: WebSocket):
    """Process real-time frames from WebSocket"""
    try:
        while True:
            # RECEIVE DATA
            data = await websocket.receive_json()

            # Extract frames
            road_frame_base64 = data.get("road_frame", "")
            driver_frame_base64 = data.get("driver_frame", "")

            if not road_frame_base64 or not driver_frame_base64:
                await websocket.send_json({
                    "error": "Both road and driver frames are required"
                })
                continue

            # DECODE FRAMES
            road_frame = decode_base64_image(road_frame_base64)
            driver_frame = decode_base64_image(driver_frame_base64)

            # PROCESS ROAD STREAM
            road_result = process_road_frame(road_frame)

            # PROCESS DRIVER STREAM
            driver_result = process_driver_frame(driver_frame)

            # FUSION
            fusion_result = fuse_risk_scores(road_result, driver_result)

            # ENCODE OUTPUTS
            encoded_road_frame = encode_image_to_base64(
                road_result.get("annotated_frame", road_frame)
            )

            encoded_driver_frame = encode_image_to_base64(
                driver_result.get("annotated_frame", driver_frame)
            )

            # SEND RESULTS
            await websocket.send_json({
                "road_score": fusion_result["road_score"],
                "driver_score": fusion_result["driver_score"],
                "fused_score": fusion_result["fused_score"],
                "risk_level": fusion_result["risk_level"],
                "road_frame_annotated": encoded_road_frame,
                "driver_frame_annotated": encoded_driver_frame,
                "detections": {
                    "road": road_result.get("detections", []),
                    "driver": driver_result.get("metrics", {})
                }
            })

    except Exception as error:
        print("Real-time processing error:", error)
        raise


# =========================================
# VIDEO RESULTS STREAMING MODE
# =========================================

async def stream_video_results(websocket: WebSocket, session_id: str):
    """Stream video results in real-time from the processing queue"""
    try:
        # Get the session's result queue
        q = processing_manager.get_or_create_queue(session_id)
        loop = asyncio.get_event_loop()

        # Stream results as they arrive from the background processor
        while True:
            # Block on the thread-safe queue (non-blocking for the event loop)
            result = await loop.run_in_executor(None, q.get)

            try:
                await websocket.send_json(result)
            except Exception:
                break  # WebSocket disconnected

            if result.get("status") == "completed":
                break

            # Maintain ~30 FPS streaming rate
            await asyncio.sleep(0.033)

    except Exception as error:
        print(f"Video streaming error for session {session_id}:", error)
        try:
            await websocket.send_json({
                "error": f"Streaming failed: {str(error)}"
            })
        except Exception:
            pass


# =========================================
# SESSION STATUS CHECK
# =========================================

async def check_session_status(session_id: str):
    """Check processing status for a session"""
    return get_processing_status(session_id)