from fastapi import WebSocket
from fastapi import WebSocketDisconnect

import json

from app.utils.image_utils import decode_base64_image

from app.models.yolo.detector import detect_objects

from app.annotators.road_annotator import draw_detections


async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    print("Client Connected")

    try:

        while True:

            # Receive JSON
            data = await websocket.receive_text()

            # Convert JSON string to dictionary
            data = json.loads(data)

            # Extract frames
            road_frame_base64 = data["road_frame"]

            cabin_frame_base64 = data["cabin_frame"]

            # Decode frames
            road_frame = decode_base64_image(
                road_frame_base64
            )

            cabin_frame = decode_base64_image(
                cabin_frame_base64
            )

            print("Frames Received")

            # YOLO Detection
            detections = detect_objects(
                road_frame
            )

            print(detections)

            # Draw detections
            annotated_frame = draw_detections(
                road_frame,
                detections
            )

            # Send response
            await websocket.send_text(
                "YOLO Detection Complete"
            )

    except WebSocketDisconnect:

        print("Client Disconnected")